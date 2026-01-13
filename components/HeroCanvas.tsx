import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera, Environment, useAnimations } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { motion, useTransform, useMotionValue, MotionValue, useMotionValueEvent } from 'framer-motion';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

const OrbitingParticles = ({ count = 60, seed = "v2", isActive = true, isMobile = false }: { count?: number; seed?: string; isActive?: boolean; isMobile?: boolean }) => {
    const { scene } = useGLTF('/assets/3d/sh/sh_geo.gltf');
    const meshRef = useRef<any>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const noise3D = useMemo(() => createNoise3D(), []);

    const logoPos = useMemo(() => {
        const logo = scene.getObjectByName('sh_logo01') || scene.getObjectByName('sh_logo_m01');
        if (logo) {
            const pos = logo.position.clone();
            pos.y -= 2.2;
            return pos;
        }
        return new THREE.Vector3(0, -2.2, 0);
    }, [scene]);

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
                    const g = 0.5 + Math.random() * 0.5;
                    return new THREE.Color(g, g, g);
                })()
            });
        }
        return temp;
    }, [count]);

    const explosionFactor = useRef(0);

    useFrame((state, delta) => {
        if (!isActive) return;
        const t = state.clock.getElapsedTime();
        const dt = Math.min(delta, 0.1);
        const { mouse } = state;

        const isNearCenter = isMobile ? false : Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) < 0.4;
        const explosionAlpha = 1 - Math.exp(-10 * dt);
        explosionFactor.current = THREE.MathUtils.lerp(explosionFactor.current, isNearCenter ? 1.0 : 0.0, explosionAlpha);

        if (meshRef.current) {
            particleData.forEach((p, i) => {
                const nx = noise3D(p.basePos.x * 0.5, p.basePos.y * 0.5, t * 0.25 + p.offset);
                const ny = noise3D(p.basePos.y * 0.5, p.basePos.z * 0.5, t * 0.25 + p.offset);
                const nz = noise3D(p.basePos.z * 0.5, p.basePos.x * 0.5, t * 0.25 + p.offset);

                let targetPos = new THREE.Vector3(
                    p.basePos.x + nx * 0.3,
                    p.basePos.y + ny * 0.3,
                    p.basePos.z + nz * 0.3
                );
                targetPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), t * 0.4);

                if (explosionFactor.current > 0.001) {
                    targetPos.lerp(targetPos.clone().normalize().multiplyScalar(4.5), explosionFactor.current);
                }

                const springForce = targetPos.clone().sub(p.currentPos).multiplyScalar(isNearCenter ? 25.0 : 70.0);
                p.velocity.add(springForce.multiplyScalar(dt));
                p.velocity.multiplyScalar(Math.pow(0.82, dt * 60));

                if (!isMobile) {
                    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -logoPos.z);
                    const mousePoint = new THREE.Vector3();
                    state.raycaster.ray.intersectPlane(plane, mousePoint);
                    const localMouse = mousePoint.sub(logoPos);
                    const dist = p.currentPos.distanceTo(localMouse);
                    const interactionForce = Math.max(0, 1 - dist / 2.5) * (1 - explosionFactor.current);
                    if (interactionForce > 0) {
                        p.velocity.addScaledVector(p.currentPos.clone().sub(localMouse).normalize(), interactionForce * 35.0 * dt);
                    }
                }

                p.currentPos.addScaledVector(p.velocity, dt);

                if (isMobile) {
                    const pos = meshRef.current.geometry.attributes.position;
                    pos.setXYZ(i, p.currentPos.x, p.currentPos.y, p.currentPos.z);
                } else {
                    dummy.position.copy(p.currentPos);
                    dummy.scale.setScalar((0.8 + Math.sin(t * 2 + p.offset) * 0.2) * p.randomScale);
                    dummy.updateMatrix();
                    meshRef.current.setMatrixAt(i, dummy.matrix);
                }
            });

            if (isMobile) {
                meshRef.current.geometry.attributes.position.needsUpdate = true;
            } else {
                meshRef.current.instanceMatrix.needsUpdate = true;
            }
        }
    });

    if (isMobile) {
        const pos = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        for (let i = 0; i < count; i++) sizes[i] = 1.0;
        return (
            <points ref={meshRef} position={logoPos}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} />
                    <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
                </bufferGeometry>
                <shaderMaterial
                    transparent
                    uniforms={{ uColor: { value: new THREE.Color('#ffffff') } }}
                    vertexShader={`
                        attribute float aSize;
                        void main() {
                            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                            gl_PointSize = aSize * (150.0 / -mvPosition.z);
                            gl_Position = projectionMatrix * mvPosition;
                        }
                    `}
                    fragmentShader={`
                        uniform vec3 uColor;
                        void main() {
                            float d = length(gl_PointCoord - vec2(0.5));
                            if (d > 0.5) discard;
                            float strength = 1.0 - smoothstep(0.0, 0.5, d);
                            gl_FragColor = vec4(uColor * 2.0, strength); // More vibrant glow
                        }
                    `}
                />
            </points>
        );
    }

    return (
        <group position={logoPos}>
            <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
                <sphereGeometry args={[0.01, 8, 8]} />
                <meshStandardMaterial emissive="#ffffff" emissiveIntensity={3} toneMapped={false} />
            </instancedMesh>
        </group>
    );
};

const Model = ({ isActive = true, isMobile = false }: { isActive?: boolean; isMobile?: boolean }) => {
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
                    // Aluminum material - Balanced for mobile quality
                    mesh.material = new THREE.MeshPhysicalMaterial({
                        color: '#f0f0f0',
                        metalness: 1.0,
                        roughness: isMobile ? 0.2 : 0.1,
                        envMapIntensity: isMobile ? 1.5 : 2.5,
                        clearcoat: isMobile ? 0 : 0.5, // Save some perf on mobile
                    });
                    mesh.castShadow = !isMobile;
                } else if (name.includes('sh_background') || name.includes('sh_backdrop')) {
                    mesh.material = new THREE.MeshStandardMaterial({
                        color: '#1a1a1a',
                        metalness: 0.1,
                        roughness: 0.9,
                    });
                    mesh.receiveShadow = !isMobile;
                } else {
                    mesh.material = new THREE.MeshStandardMaterial({
                        color: '#404040',
                        metalness: 0.5,
                        roughness: 0.5,
                    });
                    mesh.receiveShadow = !isMobile;
                }
            }
        });
    }, [scene, isMobile]);

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

const Scene = ({ scrollY, isActive = true, isMobile = false }: { scrollY?: MotionValue<number>; isActive?: boolean; isMobile?: boolean }) => {
    const { cameras, scene } = useGLTF('/assets/3d/sh/sh_geo.gltf');
    const spotLightRef = useRef<THREE.SpotLight>(null);
    const ambientLightRef = useRef<THREE.AmbientLight>(null);
    const dirLightRef = useRef<THREE.DirectionalLight>(null);

    const shCam = useMemo(() => {
        return cameras.find((cam) => cam.name === 'sh_cam') as THREE.PerspectiveCamera;
    }, [cameras]);

    const noise = useMemo(() => createNoise3D(), []);

    const spotLightPos = useMemo(() => {
        const lightObj = scene.getObjectByName('sh_spot_light');
        return lightObj ? lightObj.position.clone() : new THREE.Vector3(0, 15, 0);
    }, [scene]);

    const cameraRef = useRef<THREE.PerspectiveCamera>(null);

    useFrame((state, delta) => {
        if (!isActive) return;
        const t = state.clock.getElapsedTime();

        // Disable light flickering on mobile to save CPU
        if (!isMobile) {
            const baseNoise = (noise(t * 22, 0, 0) + 1) / 2;
            const powerNoise = Math.pow(baseNoise, 1.5);

            if (spotLightRef.current) spotLightRef.current.intensity = 1000 + (powerNoise * 30000);
            if (ambientLightRef.current) ambientLightRef.current.intensity = 0.01 + (baseNoise * 0.15);
            if (dirLightRef.current) dirLightRef.current.intensity = 0.1 + (baseNoise * 1.2);
        }

        if (cameraRef.current && scrollY && shCam) {
            const scrollVal = scrollY.get();
            const targetZ = shCam.position.z + (scrollVal * (isMobile ? 0.05 : 0.03));
            const alpha = 1 - Math.exp(-8 * delta);
            cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, targetZ, alpha);

            cameraRef.current.position.x = shCam.position.x + (isMobile ? 0 : 0.2);
            cameraRef.current.position.y = shCam.position.y;
            cameraRef.current.rotation.copy(shCam.rotation);
        }
    });

    return (
        <>
            {shCam ? (
                <PerspectiveCamera ref={cameraRef} makeDefault fov={isMobile ? 65 : shCam.fov} near={shCam.near} far={shCam.far} />
            ) : (
                <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} fov={50} />
            )}

            <ambientLight ref={ambientLightRef} intensity={0.05} />
            <directionalLight ref={dirLightRef} position={[10, 20, 10]} intensity={0.8} />

            <spotLight
                ref={spotLightRef}
                position={spotLightPos}
                angle={1.0}
                intensity={isMobile ? 5000 : 15000}
                distance={50}
                castShadow={!isMobile}
            />
            <primitive object={new THREE.Object3D()} attach="target" position={[spotLightPos.x, spotLightPos.y - 12, spotLightPos.z]} />

            <Model isActive={isActive} isMobile={isMobile} />
            <OrbitingParticles count={isMobile ? 35 : 60} isActive={isActive} isMobile={isMobile} />

            <Environment preset="city" environmentIntensity={isMobile ? 0.35 : 0.4} />
            {!isMobile && <fog attach="fog" args={['#000000', 5, 35]} />}

            {!isMobile && (
                <EffectComposer enableNormalPass={false} multisampling={0}>
                    <Bloom luminanceThreshold={1} mipmapBlur intensity={0.2} radius={0.4} />
                    <Noise opacity={0.015} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
            )}
        </>
    );
};

const HeroCanvas: React.FC<{ scrollY?: MotionValue<number> }> = ({ scrollY }) => {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
                shadows={!isFirefox && !isMobile}
                dpr={isMobile ? [1, 1.5] : (isFirefox ? 1 : [1, 2])}
                gl={{
                    antialias: true, // Back to true for smooth edges
                    toneMapping: THREE.ACESFilmicToneMapping,
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: true,
                    alpha: true
                }}
            >
                <Scene scrollY={s} isActive={isActive} isMobile={isMobile} />
            </Canvas>
        </motion.div>
    );
};

useGLTF.preload('/assets/3d/sh/sh_geo.gltf');

export default HeroCanvas;
