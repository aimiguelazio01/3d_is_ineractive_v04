import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera, Environment, useAnimations } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { motion, useTransform, useMotionValue, MotionValue, useMotionValueEvent } from 'framer-motion';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

const OrbitingParticles = ({ count = 60, seed = "v2", isActive = true }: { count?: number; seed?: string; isActive?: boolean }) => {
    const { scene } = useGLTF('/assets/3d/sh/sh_geo.gltf');
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const noise3D = useMemo(() => createNoise3D(), []);

    // Find the logo object to orbit around
    const logoPos = useMemo(() => {
        // Specifically look for sh_logo01 as requested
        const logo = scene.getObjectByName('sh_logo01') || scene.getObjectByName('sh_logo_m01');
        if (logo) {
            const pos = logo.position.clone();
            pos.y -= 2.2; // Lower the orbit further
            return pos;
        }
        return new THREE.Vector3(0, -2.2, 0);
    }, [scene]);

    // Create particle initial positions and random phase offsets
    const particleData = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const r = 0.3 + Math.random() * 1.7;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            const x = (r + 0.3) * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            temp.push({
                basePos: new THREE.Vector3(x, y, z),
                currentPos: new THREE.Vector3(x, y, z),
                velocity: new THREE.Vector3(),
                speed: 0.1 + Math.random() * 0.1,
                offset: Math.random() * 100,
                randomScale: 0.2 + Math.random() * 0.8,
                color: (() => {
                    const g = 0.5 + Math.random() * 0.5; // range 0.5 to 1.0 (50% grey to white)
                    return new THREE.Color(g, g, g);
                })()
            });
        }
        return temp;
    }, [count, seed]);

    useEffect(() => {
        if (meshRef.current) {
            particleData.forEach((p, i) => {
                meshRef.current!.setColorAt(i, p.color);
            });
            meshRef.current.instanceColor!.needsUpdate = true;
        }
    }, [particleData]);

    const explosionFactor = useRef(0);

    useFrame((state, delta) => {
        if (!isActive) return;
        const t = state.clock.getElapsedTime();
        const dt = Math.min(delta, 0.1);
        const { mouse } = state;

        // 0. Check if mouse is in center to trigger explosion
        const mouseDistanceFromCenter = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y);
        const isNearCenter = mouseDistanceFromCenter < 0.4;

        // Target 1.0 for explosion, 0.0 for normal (Frame-rate independent lerp)
        const explosionAlpha = 1 - Math.exp(-10 * dt);
        explosionFactor.current = THREE.MathUtils.lerp(explosionFactor.current, isNearCenter ? 1.0 : 0.0, explosionAlpha);

        // Calculate mouse interaction point in 3D space
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -logoPos.z);
        const mousePoint = new THREE.Vector3();
        state.raycaster.ray.intersectPlane(plane, mousePoint);
        const localMouse = mousePoint.clone().sub(logoPos);

        if (meshRef.current) {
            particleData.forEach((p, i) => {
                // 1. Target Position (Base Orbit + Noise)
                const nx = noise3D(p.basePos.x * 0.5, p.basePos.y * 0.5, t * 0.25 + p.offset);
                const ny = noise3D(p.basePos.y * 0.5, p.basePos.z * 0.5, t * 0.25 + p.offset);
                const nz = noise3D(p.basePos.z * 0.5, p.basePos.x * 0.5, t * 0.25 + p.offset);

                const noiseScale = 0.3;
                let targetPos = new THREE.Vector3(
                    p.basePos.x + nx * noiseScale,
                    p.basePos.y + ny * noiseScale,
                    p.basePos.z + nz * noiseScale
                );
                targetPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), t * 0.4);

                // Apply Explosion: blast particles outwards away from logo center
                if (explosionFactor.current > 0.001) {
                    const explosionDir = targetPos.clone().normalize();
                    // Blast range: move particles towards the viewport borders (reduced from 12.0)
                    const blastTarget = explosionDir.multiplyScalar(4.5);
                    targetPos.lerp(blastTarget, explosionFactor.current);
                }

                // 2. Spring Physics Logic
                // Increase stiffness for snappier snapping (ULTRA responsive)
                const stiffness = isNearCenter ? 25.0 : 70.0;
                const damping = 0.82;

                const springForce = targetPos.clone().sub(p.currentPos).multiplyScalar(stiffness);
                p.velocity.add(springForce.multiplyScalar(dt));
                // Frame-rate independent damping
                p.velocity.multiplyScalar(Math.pow(damping, dt * 60));

                // 3. Mouse Interaction (Repulsion) - Reduced during explosion
                const dist = p.currentPos.distanceTo(localMouse);
                const forceRange = 2.5;
                const interactionForce = Math.max(0, 1 - dist / forceRange) * (1 - explosionFactor.current);

                if (interactionForce > 0) {
                    const repulsionDir = p.currentPos.clone().sub(localMouse).normalize();
                    p.velocity.addScaledVector(repulsionDir, interactionForce * 35.0 * dt);
                }

                // 4. Update Position
                p.currentPos.addScaledVector(p.velocity, dt);

                // 5. Apply transforms
                dummy.position.copy(p.currentPos);

                const pulsingScale = 0.8 + Math.sin(t * 2 + p.offset) * 0.2;
                const mouseScaleBoost = 1.0 + interactionForce * 3.0;
                // Scale stays small or grows slightly during explosion
                dummy.scale.setScalar(pulsingScale * p.randomScale * mouseScaleBoost);

                dummy.updateMatrix();
                meshRef.current!.setMatrixAt(i, dummy.matrix);
            });

            meshRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <group position={logoPos}>
            <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
                <sphereGeometry args={[0.01, 8, 8]} />
                <meshStandardMaterial
                    emissive="#ffffff"
                    emissiveIntensity={3}
                    toneMapped={false}
                />
            </instancedMesh>
        </group>
    );
};

const Model = ({ isActive = true }: { isActive?: boolean }) => {
    const { scene, animations } = useGLTF('/assets/3d/sh/sh_geo.gltf');
    const { actions } = useAnimations(animations, scene);

    // Apply animation state for Frame 24 (at 24 FPS = 1.0s)
    useEffect(() => {
        if (actions) {
            const action = Object.values(actions)[0];
            if (action) {
                action.play();
                // Set to specifically 1.0s (Frame 24) and pause
                action.time = 1.0;
                action.paused = true;
            }
        }
    }, [actions]);

    // Setup materials
    useMemo(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const name = mesh.name.toLowerCase();

                if (name.startsWith('sh_logo')) {
                    // Aluminum material
                    mesh.material = new THREE.MeshPhysicalMaterial({
                        color: '#f0f0f0',
                        metalness: 1.0,
                        roughness: 0.1,
                        transparent: false,
                        opacity: 1,
                        envMapIntensity: 2.5,
                    });
                    mesh.castShadow = true;
                } else if (name.includes('sh_background') || name.includes('sh_backdrop')) {
                    // Dark grey floor to show the light pool
                    mesh.material = new THREE.MeshPhysicalMaterial({
                        color: '#1a1a1a',
                        metalness: 0.2,
                        roughness: 0.8,
                        transparent: false,
                        opacity: 1,
                        envMapIntensity: 0.5,
                    });
                    mesh.receiveShadow = true;
                } else {
                    // Default material for others
                    mesh.material = new THREE.MeshPhysicalMaterial({
                        color: '#404040',
                        metalness: 0.5,
                        roughness: 0.5,
                    });
                    mesh.receiveShadow = true;
                }
            }
        });
    }, [scene]);

    const logoRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (!isActive) return;
        if (logoRef.current) {
            const t = state.clock.getElapsedTime();
            const { mouse } = state;

            // 1. Check if mouse is in the "center" of the screen (distance from [0,0] in normalized coords)
            const mouseDistanceFromCenter = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y);
            const isNearCenter = mouseDistanceFromCenter < 0.4;

            // 2. Animate Frame time (Lerp between 1.0 and 0.0)
            // Frame 24 = 1.0s, Frame 1 = 0.0s
            const action = actions && Object.values(actions)[0];
            if (action) {
                const targetTime = isNearCenter ? 0.0 : 1.0;
                // Frame-rate independent lerp for animation time
                const alpha = 1 - Math.exp(-4 * delta);
                action.time = THREE.MathUtils.lerp(action.time, targetTime, alpha);
            }

            // Gentle floating/bobbing (with a -0.2 base offset)
            logoRef.current.position.y = -0.2 + Math.sin(t * 0.5) * 0.15;

            // Even more pronounced mouse-tracking
            const targetRotX = -mouse.y * 0.25;
            const targetRotY = mouse.x * 0.25;

            // ULTRA responsive mouse-tracking (Increased from 12 to 24)
            const alpha = 1 - Math.exp(-24 * delta);
            logoRef.current.rotation.x = THREE.MathUtils.lerp(
                logoRef.current.rotation.x,
                targetRotX + Math.sin(t * 0.3) * 0.02,
                alpha
            );
            logoRef.current.rotation.y = THREE.MathUtils.lerp(
                logoRef.current.rotation.y,
                targetRotY,
                alpha
            );
            logoRef.current.rotation.z = THREE.MathUtils.lerp(
                logoRef.current.rotation.z,
                Math.cos(t * 0.4) * 0.02,
                alpha
            );
        }
    });

    return (
        <group ref={logoRef}>
            <primitive object={scene} />
        </group>
    );
};

const Scene = ({ scrollY, isActive = true }: { scrollY?: MotionValue<number>; isActive?: boolean }) => {
    const { cameras, scene } = useGLTF('/assets/3d/sh/sh_geo.gltf');
    const spotLightRef = useRef<THREE.SpotLight>(null);
    const ambientLightRef = useRef<THREE.AmbientLight>(null);
    const dirLightRef = useRef<THREE.DirectionalLight>(null);

    // Find the camera named "sh_cam"
    const shCam = useMemo(() => {
        return cameras.find((cam) => cam.name === 'sh_cam') as THREE.PerspectiveCamera;
    }, [cameras]);

    const noise = useMemo(() => createNoise3D(), []);

    // Find the spotlight position from "sh_spot_light" object
    const spotLightPos = useMemo(() => {
        const lightObj = scene.getObjectByName('sh_spot_light');
        if (lightObj) {
            return lightObj.position.clone();
        }
        return new THREE.Vector3(0, 15, 0);
    }, [scene]);

    const cameraRef = useRef<THREE.PerspectiveCamera>(null);

    // Noise intensity effect logic for all lights
    useFrame((state, delta) => {
        if (!isActive) return;
        const t = state.clock.getElapsedTime();
        // Faster frequency (22 instead of 15)
        const baseNoise = (noise(t * 22, 0, 0) + 1) / 2;
        // Sharper power curve (1.5 instead of 1.2)
        const powerNoise = Math.pow(baseNoise, 1.5);

        // Spotlight Flicker (Deep range: 1,000 to 31,000)
        if (spotLightRef.current) {
            spotLightRef.current.intensity = 1000 + (powerNoise * 30000);
        }

        // Ambient Flicker (0.01 to 0.16)
        if (ambientLightRef.current) {
            ambientLightRef.current.intensity = 0.01 + (baseNoise * 0.15);
        }

        // Directional Flicker (0.1 to 1.3)
        if (dirLightRef.current) {
            dirLightRef.current.intensity = 0.1 + (baseNoise * 1.2);
        }

        // 2. Camera scroll movement logic
        if (cameraRef.current && scrollY && shCam) {
            const scrollVal = scrollY.get();

            // Move BACK (increase Z) immediately from 0 scroll with higher sensitivity
            const targetZ = shCam.position.z + (scrollVal * 0.03);

            // Smoothly lerp with less delay (Frame-rate independent)
            const alpha = 1 - Math.exp(-8 * delta);
            cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, targetZ, alpha);

            // Keep X, Y and Rotation consistent with initial shCam
            cameraRef.current.position.x = shCam.position.x + 0.2;
            cameraRef.current.position.y = shCam.position.y;
            cameraRef.current.rotation.copy(shCam.rotation);
        }
    });

    return (
        <>
            {shCam ? (
                <PerspectiveCamera
                    ref={cameraRef}
                    makeDefault
                    fov={shCam.fov}
                    near={shCam.near}
                    far={shCam.far}
                />
            ) : (
                <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} fov={50} />
            )}

            <ambientLight ref={ambientLightRef} intensity={0.05} />
            <directionalLight ref={dirLightRef} position={[10, 20, 10]} intensity={0.8} color="#ffffff" />

            <spotLight
                ref={spotLightRef}
                position={spotLightPos}
                angle={1.0}
                penumbra={1.0}
                intensity={15000}
                distance={50}
                color="#ffffff"
                castShadow
            />
            {/* Direct downward target */}
            <primitive object={new THREE.Object3D()} attach="target" position={[spotLightPos.x, spotLightPos.y - 12, spotLightPos.z]} />

            <Model isActive={isActive} />
            <OrbitingParticles count={60} isActive={isActive} />

            <Environment preset="city" environmentIntensity={0.4} />
            <fog attach="fog" args={['#000000', 5, 35]} />

            <EffectComposer disableNormalPass multisampling={0}>
                <Bloom
                    luminanceThreshold={1}
                    mipmapBlur={!/firefox/i.test(navigator.userAgent)} // Disable heavy blur on Firefox
                    intensity={0.2}
                    radius={0.4}
                />
                <Noise opacity={0.015} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
        </>
    );
};

const HeroCanvas: React.FC<{ scrollY?: MotionValue<number> }> = ({ scrollY }) => {
    const fallbackScroll = useMotionValue(0);
    const s = scrollY || fallbackScroll;

    const [isActive, setIsActive] = React.useState(true);

    useMotionValueEvent(s, "change", (latest) => {
        if (latest > 1500) {
            if (isActive) setIsActive(false);
        } else {
            if (!isActive) setIsActive(true);
        }
    });

    // Fade out canvas after user scrolls past the first section
    const opacity = useTransform(s, [600, 1200], [1, 0]);

    const isFirefox = /firefox/i.test(navigator.userAgent);

    return (
        <motion.div
            style={{
                opacity,
                display: isActive ? 'block' : 'none'
            }}
            className="fixed inset-0 z-0 pointer-events-none overflow-hidden h-screen w-full"
        >
            <Canvas
                shadows={!isFirefox} // Disable shadows on Firefox for better perf if needed
                dpr={isFirefox ? 1 : [1, 2]} // Lower DPR on Firefox to reduce fill rate issues
                gl={{
                    antialias: false, // Performance: Postprocessing usually handles its own AA
                    toneMapping: THREE.ACESFilmicToneMapping,
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: true
                }}
            >
                <Scene scrollY={s} isActive={isActive} />
            </Canvas>
        </motion.div>
    );
};

useGLTF.preload('/assets/3d/sh/sh_geo.gltf');

export default HeroCanvas;
