import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera, Environment, useTexture, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const MorphParticles = ({ isTargeted, targetId, isMobile }: { isTargeted: boolean, targetId: string, isMobile: boolean }) => {
    const { scene, nodes } = useGLTF('/assets/3d/s01/morph_particles.gltf');
    const pointsRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    // Internal state to track the transition
    const [ids, setIds] = useState({ current: targetId, prev: targetId });

    // Sync prop changes to internal state during render to ensure uTargetMorph can be reset immediately
    if (targetId !== ids.current) {
        setIds({ current: targetId, prev: ids.current });
        if (materialRef.current) {
            materialRef.current.uniforms.uTargetMorph.value = 0;
        }
    }

    const geometry = useMemo(() => {
        let targetMesh: THREE.Mesh | null = null;
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).geometry) {
                const attrs = (child as THREE.Mesh).geometry.attributes;
                for (const key in attrs) {
                    if (key.startsWith('_p_') || key.startsWith('_P_')) {
                        targetMesh = child as THREE.Mesh;
                        break;
                    }
                }
            }
        });

        if (!targetMesh) targetMesh = nodes.morph_section01 as THREE.Mesh;
        if (!targetMesh || !targetMesh.geometry) return null;

        const g = targetMesh.geometry.clone();
        const attrs = g.attributes;

        const pBase = attrs._p_07 || attrs._P_07;
        const cBase = attrs._color_07 || attrs._COLOR_07;

        // Current Target (ids.current)
        const pTarget = attrs[`_p_${ids.current}`] || attrs[`_P_${ids.current}`] || attrs._p_01 || attrs._P_01;
        const cTarget = attrs[`_color_${ids.current}`] || attrs[`_COLOR_${ids.current}`] || attrs._color_01 || attrs._COLOR_01;

        // Previous Target (ids.prev)
        const pPrev = attrs[`_p_${ids.prev}`] || attrs[`_P_${ids.prev}`] || attrs._p_01 || attrs._P_01;
        const cPrev = attrs[`_color_${ids.prev}`] || attrs[`_COLOR_${ids.prev}`] || attrs._color_01 || attrs._COLOR_01;

        if (pBase && pTarget && pPrev) {
            g.setAttribute('aInstancePosition', pBase);
            g.setAttribute('aInstanceTargetPosition', pTarget);
            g.setAttribute('aInstancePrevTargetPosition', pPrev);
        }

        if (cBase) g.setAttribute('aInstanceColor', cBase);
        if (cTarget) g.setAttribute('aInstanceTargetColor', cTarget);
        if (cPrev) g.setAttribute('aInstancePrevTargetColor', cPrev);

        if (pBase) {
            const count = pBase.count;
            const sizes = new Float32Array(count);
            const perspectives = new Float32Array(count);
            for (let i = 0; i < count; i++) {
                sizes[i] = 0.5 + Math.random() * 0.5; // Scale multiplier for the sphere
                perspectives[i] = 1.0; // Unused in mesh mode but kept for compat
            }
            g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        }

        g.setIndex(null);
        return g;
    }, [scene, ids]);

    const uniforms = useMemo(() => ({
        uMorph: { value: 0 },
        uTargetMorph: { value: 1.0 },
        uOpacity: { value: 0.8 },
        uMouse: { value: new THREE.Vector3(0, 0, 0) },
        uExplosion: { value: 0 },
        uTime: { value: 0 }
    }), []);

    const mousePlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
    const mouseWorldPos = useMemo(() => new THREE.Vector3(), []);
    const raycaster = useMemo(() => new THREE.Raycaster(), []);

    useFrame((state, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += 0.015;

            // Project mouse to world space
            raycaster.setFromCamera(state.mouse, state.camera);
            raycaster.ray.intersectPlane(mousePlane, mouseWorldPos);
            pointsRef.current.worldToLocal(mouseWorldPos);
        }

        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

            // Smoothed Mouse following - lerp uniform towards target world pos
            materialRef.current.uniforms.uMouse.value.lerp(mouseWorldPos, 0.15);

            // Calculate if mouse is "over" particles area (approximate radius)
            const distToCenter = mouseWorldPos.length();
            const isNear = distToCenter < 2.5;

            // Lerp the explosion factor for a gentle "float" feel
            const targetExplosion = isNear ? 1.0 : 0.0;
            materialRef.current.uniforms.uExplosion.value = THREE.MathUtils.lerp(
                materialRef.current.uniforms.uExplosion.value,
                targetExplosion,
                0.03 // Much slower, smoother transition
            );

            // Main morph (Base -> Card)
            const globalTarget = isTargeted ? 1.0 : 0.0;
            materialRef.current.uniforms.uMorph.value = THREE.MathUtils.lerp(
                materialRef.current.uniforms.uMorph.value,
                globalTarget,
                0.04
            );

            // Sub-morph (Prev Card -> Next Card)
            if (materialRef.current.uniforms.uTargetMorph.value < 1.0) {
                materialRef.current.uniforms.uTargetMorph.value = THREE.MathUtils.lerp(
                    materialRef.current.uniforms.uTargetMorph.value,
                    1.0,
                    0.05
                );
            }
        }
    });

    if (!geometry) return null;

    const instanceCount = geometry?.attributes.aInstancePosition?.count || 0;

    return (
        <instancedMesh ref={pointsRef as any} args={[undefined, undefined, instanceCount]}>
            <icosahedronGeometry args={[0.02, 1]} >
                <instancedBufferAttribute attach="attributes-aInstancePosition" args={[geometry.attributes.aInstancePosition.array, 3]} />
                <instancedBufferAttribute attach="attributes-aInstanceTargetPosition" args={[geometry.attributes.aInstanceTargetPosition.array, 3]} />
                <instancedBufferAttribute attach="attributes-aInstancePrevTargetPosition" args={[geometry.attributes.aInstancePrevTargetPosition.array, 3]} />
                <instancedBufferAttribute attach="attributes-aInstanceColor" args={[geometry.attributes.aInstanceColor.array, 3]} />
                <instancedBufferAttribute attach="attributes-aInstanceTargetColor" args={[geometry.attributes.aInstanceTargetColor.array, 3]} />
                <instancedBufferAttribute attach="attributes-aInstancePrevTargetColor" args={[geometry.attributes.aInstancePrevTargetColor.array, 3]} />
                <instancedBufferAttribute attach="attributes-aSize" args={[geometry.attributes.aSize.array, 1]} />
            </icosahedronGeometry>
            <shaderMaterial
                ref={materialRef}
                vertexColors
                uniforms={uniforms}
                vertexShader={`
                    attribute vec3 aInstancePosition;
                    attribute vec3 aInstanceTargetPosition;
                    attribute vec3 aInstancePrevTargetPosition;
                    attribute vec3 aInstanceColor;
                    attribute vec3 aInstanceTargetColor;
                    attribute vec3 aInstancePrevTargetColor;
                    attribute float aSize;

                    varying vec3 vColor;
                    varying vec3 vTargetColor;
                    varying vec3 vNormal;
                    varying vec3 vViewPosition;

                    uniform float uMorph;
                    uniform float uTargetMorph;
                    uniform vec3 uMouse;
                    uniform float uExplosion;
                    uniform float uTime;

                    void main() {
                        vColor = aInstanceColor;
                        vNormal = normalize(normalMatrix * normal);
                        
                        // Internal morph between targets
                        vec3 stageTargetPos = mix(aInstancePrevTargetPosition, aInstanceTargetPosition, uTargetMorph);
                        vec3 stageTargetColor = mix(aInstancePrevTargetColor, aInstanceTargetColor, uTargetMorph);
                        vTargetColor = stageTargetColor;

                        // Main morph from base to the current stage target
                        vec3 instanceCenter = mix(aInstancePosition, stageTargetPos, uMorph);
                        
                        // GENTLE FLOATING & REACTION
                        vec3 dir = instanceCenter - uMouse;
                        float dist = length(dir);
                        dir = normalize(dir);
                        float radius = 3.0; 
                        float rawForce = 1.0 - smoothstep(0.0, radius, dist);
                        float force = pow(rawForce, 1.5); 
                        float floatOsc = sin(uTime * 2.0 + (instanceCenter.x + instanceCenter.y) * 0.5) * 0.1;
                        float floatIntensity = uExplosion * force * (1.2 + floatOsc);
                        
                        vec3 finalInstancePos = instanceCenter + (dir * floatIntensity);

                        // Position the vertex relative to the instance center
                        vec3 transformed = position * aSize; 
                        
                        vec4 mvPosition = modelViewMatrix * vec4(finalInstancePos + transformed, 1.0);
                        vViewPosition = -mvPosition.xyz;
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `}
                fragmentShader={`
                    varying vec3 vColor;
                    varying vec3 vTargetColor;
                    varying vec3 vNormal;
                    varying vec3 vViewPosition;

                    uniform float uOpacity;
                    uniform float uMorph;
                    
                    void main() {
                        vec3 targetColorDimmed = vTargetColor * 0.5;
                        vec3 baseColor = mix(vColor, targetColorDimmed, uMorph);
                        
                        // Fresnel Glow
                        vec3 normal = normalize(vNormal);
                        vec3 viewDir = normalize(vViewPosition);
                        float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 2.0);
                        
                        // Add glow to base color
                        vec3 glowColor = baseColor * 2.5; // Super bright glow
                        vec3 finalColor = baseColor + (glowColor * fresnel);
                        
                        // Overall boost
                        finalColor *= 1.5;

                        gl_FragColor = vec4(finalColor, uOpacity);
                    }
                `}
            />
        </instancedMesh>
    );

};

const TrailParticles = ({ isMobile }: { isMobile: boolean }) => {
    const count = isMobile ? 150 : 400; // Significantly reduced for mobile
    const meshRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const [coords, sizes, ages, offsets] = useMemo(() => {
        const c = new Float32Array(count * 3);
        const s = new Float32Array(count);
        const a = new Float32Array(count);
        const o = new Float32Array(count * 3); // Random offsets for motion
        for (let i = 0; i < count; i++) {
            a[i] = 1000.0;
            o[i * 3] = Math.random() * 2 - 1;
            o[i * 3 + 1] = Math.random() * 2 - 1;
            o[i * 3 + 2] = Math.random() * 2 - 1;
        }
        return [c, s, a, o];
    }, []);

    const geometry = useMemo(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(coords, 3));
        g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        g.setAttribute('aAge', new THREE.BufferAttribute(ages, 1));
        g.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 3));
        return g;
    }, []);

    const mousePlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
    const mouseWorldPos = useMemo(() => new THREE.Vector3(), []);
    const raycaster = useMemo(() => new THREE.Raycaster(), []);
    const currentIdx = useRef(0);

    useFrame((state) => {
        if (!meshRef.current || !materialRef.current) return;

        raycaster.setFromCamera(state.mouse, state.camera);
        raycaster.ray.intersectPlane(mousePlane, mouseWorldPos);

        const posAttr = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const sizeAttr = meshRef.current.geometry.attributes.aSize as THREE.BufferAttribute;
        const ageAttr = meshRef.current.geometry.attributes.aAge as THREE.BufferAttribute;

        // Spawn multiple particles for a denser trail
        const spawnCount = 2;
        for (let s = 0; s < spawnCount; s++) {
            const idx = currentIdx.current;
            // Add slight randomness to spawn position for a "brush" feel
            const spread = 0.1;
            posAttr.setXYZ(idx,
                mouseWorldPos.x + (Math.random() - 0.5) * spread,
                mouseWorldPos.y + (Math.random() - 0.5) * spread,
                mouseWorldPos.z
            );
            sizeAttr.setX(idx, 0.08 + Math.random() * 0.2); // Varied sizes
            ageAttr.setX(idx, 0.0);

            currentIdx.current = (idx + 1) % count;
        }

        // Update ages
        for (let i = 0; i < count; i++) {
            let age = ageAttr.getX(i);
            age += 0.015; // Slightly slower fade
            ageAttr.setX(i, age);
        }

        posAttr.needsUpdate = true;
        sizeAttr.needsUpdate = true;
        ageAttr.needsUpdate = true;

        materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    });

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#4488ff') }
    }), []);

    return (
        <points ref={meshRef} geometry={geometry}>
            <shaderMaterial
                ref={materialRef}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                uniforms={uniforms}
                vertexShader={`
                    attribute float aSize;
                    attribute float aAge;
                    attribute vec3 aOffset;
                    varying float vAge;
                    void main() {
                        vAge = aAge;
                        vec3 pos = position;
                        
                        // Organic drift
                        float t = aAge * 3.0;
                        pos.x += sin(t * 2.0 + aOffset.x) * 0.1 * t;
                        pos.y += (cos(t * 1.5 + aOffset.y) * 0.1 + 0.2) * t; // Upward drift
                        pos.z += sin(t + aOffset.z) * 0.1 * t;

                        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                        float size = aSize * (1.0 - smoothstep(0.0, 1.0, aAge));
                        gl_PointSize = size * (350.0 / -mvPosition.z);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `}
                fragmentShader={`
                    varying float vAge;
                    uniform vec3 uColor;
                    void main() {
                        if (vAge > 1.0) discard;
                        vec2 uv = gl_PointCoord - vec2(0.5);
                        float dist = length(uv);
                        if (dist > 0.5) discard;
                        
                        // Soft glow
                        float glow = 1.0 - smoothstep(0.0, 0.5, dist);
                        
                        // Color blending: White -> Blue -> Transparent
                        vec3 finalColor = mix(vec3(1.0), uColor, smoothstep(0.0, 0.4, vAge));
                        
                        float opacity = (1.0 - smoothstep(0.0, 1.0, vAge)) * glow;
                        gl_FragColor = vec4(finalColor, opacity);
                    }
                `}
            />
        </points>
    );
};

const CardItem = ({ card, onHoverChange, onClick, isMobile }: { card: any, onHoverChange?: (hovered: boolean) => void, onClick?: () => void, isMobile: boolean }) => {
    const groupRef = useRef<THREE.Group>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const [isHovered, setIsHovered] = useState(false);

    const floatSeed = useMemo(() => Math.random() * 1000, []);

    useFrame((state) => {
        if (!groupRef.current) return;

        // Enhanced Floating Translation
        const t = state.clock.elapsedTime * 0.9 + floatSeed;
        groupRef.current.position.y = card.center.y + Math.sin(t) * 0.25; // Increased floating range
        groupRef.current.position.x = card.center.x + Math.cos(t * 0.8) * 0.15;

        const mx = state.mouse.x * 12;
        const my = state.mouse.y * 8;
        dummy.position.copy(groupRef.current.position);
        dummy.lookAt(mx, my, 8);
        const euler = new THREE.Euler().setFromQuaternion(dummy.quaternion);
        const tiltLimit = 15 * (Math.PI / 180);
        euler.x = Math.max(-tiltLimit, Math.min(tiltLimit, euler.x));
        euler.y = Math.max(-tiltLimit, Math.min(tiltLimit, euler.y));
        euler.z = 0;
        dummy.setRotationFromEuler(euler);
        groupRef.current.quaternion.slerp(dummy.quaternion, 0.08);

        // Premium scale effect
        const targetScale = isHovered ? 1.25 : 1.0;
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        // Subtly animate the emissive intensity for a "glow" effect when hovered
        if (card.material) {
            const targetEmissive = isHovered ? 0.4 : 0.05;
            card.material.emissiveIntensity = THREE.MathUtils.lerp(card.material.emissiveIntensity, targetEmissive, 0.1);
            card.material.emissive.copy(card.material.color); // Match the blueish hue
        }
    });

    return (
        <group ref={groupRef} position={[card.center.x, card.center.y, card.center.z]}>
            {/* Transparent plane for interaction - slightly larger than visual for ease of use */}
            <mesh
                onPointerOver={(e) => {
                    if (isMobile) return;
                    e.stopPropagation();
                    setIsHovered(true);
                    if (card.material) card.material.opacity = 1.0;
                    onHoverChange?.(true);
                }}
                onPointerOut={() => {
                    if (isMobile) return;
                    setIsHovered(false);
                    if (card.material) card.material.opacity = 0.85;
                    onHoverChange?.(false);
                }}
                onPointerDown={(e) => {
                    if (!isMobile) return;
                    e.stopPropagation();
                    // Toggle hover state on mobile touch
                    const newHover = !isHovered;
                    setIsHovered(newHover);
                    if (card.material) card.material.opacity = newHover ? 1.0 : 0.85;
                    onHoverChange?.(newHover);
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick?.();
                }}
            >
                <planeGeometry args={[card.size.x * (isMobile ? 2.0 : 1.5), card.size.y * (isMobile ? 2.0 : 1.5)]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {/* The Visual Button Plane */}
            <mesh frustumCulled={false} raycast={() => null}>
                <planeGeometry args={[card.size.x, card.size.y]} />
                <primitive object={card.material} attach="material" />
            </mesh>
        </group>
    );
};

const Model = ({ textures, isMobile }: { textures: any, isMobile: boolean }) => {
    const { scene } = useGLTF('/assets/3d/s01/morph_particles.gltf');
    const [cardUnits, setCardUnits] = useState<{
        id: string,
        geometry: THREE.BufferGeometry,
        material: THREE.MeshStandardMaterial,
        center: THREE.Vector3,
        rotation: THREE.Euler,
        scale: THREE.Vector3,
        size: THREE.Vector3
    }[]>([]);

    const [activeHoverId, setActiveHoverId] = useState<string | null>(null);
    const [activeClickId, setActiveClickId] = useState<string | null>(null);
    const [stickyTargetId, setStickyTargetId] = useState<string | null>(null);
    const [lastActiveId, setLastActiveId] = useState<string>('01');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!scene) return;
        const found: any[] = [];
        scene.updateMatrixWorld(true);

        scene.traverse((child) => {
            const name = child.name || "";
            if ((child as THREE.Mesh).isMesh) {
                if (name.toLowerCase().includes('card_')) {
                    const mesh = child as THREE.Mesh;
                    const worldScale = new THREE.Vector3();
                    mesh.getWorldScale(worldScale);

                    const box = new THREE.Box3().setFromObject(mesh);
                    const center = new THREE.Vector3();
                    box.getCenter(center);
                    // Standard depth fix for interactions
                    center.z = center.x < 0 ? 2.0 : 1.0;
                    const size = new THREE.Vector3();
                    box.getSize(size);

                    const geom = mesh.geometry.clone();
                    geom.center();

                    // Random Blueish hue (0.55 - 0.70 HSL)
                    const randomBlue = new THREE.Color().setHSL(0.55 + Math.random() * 0.15, 0.6, 0.7);

                    const material = new THREE.MeshStandardMaterial({
                        map: textures[name] || textures[name.replace('OUT_', '')] || null,
                        color: randomBlue,
                        transparent: true,
                        opacity: 0.85,
                        metalness: 0.3,
                        roughness: 0.4,
                        emissive: randomBlue,
                        emissiveIntensity: 0.05,
                        envMapIntensity: 1,
                        side: THREE.DoubleSide
                    });

                    found.push({
                        id: name,
                        geometry: geom,
                        material: material,
                        center: center,
                        rotation: mesh.rotation.clone(),
                        scale: worldScale,
                        size: size
                    });
                } else {
                    child.raycast = () => null;
                }
            } else {
                child.raycast = () => null;
            }
        });
        setCardUnits(found);
    }, [scene, textures]);

    const getTargetId = (id: string | null) => {
        if (!id) return null;
        const match = id.match(/card_(\d+)/i);
        return match ? match[1] : null;
    };

    useEffect(() => {
        const currentId = activeHoverId || activeClickId;
        if (currentId) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            const tid = getTargetId(currentId);
            if (tid) {
                setStickyTargetId(tid);
                setLastActiveId(tid);
            }
        } else if (stickyTargetId) {
            timeoutRef.current = setTimeout(() => {
                setStickyTargetId(null);
            }, 10000);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [activeHoverId, activeClickId, stickyTargetId]);

    return (
        <group>
            <MorphParticles
                isTargeted={!!stickyTargetId}
                targetId={lastActiveId}
                isMobile={isMobile}
            />
            <TrailParticles isMobile={isMobile} />
            <Float
                speed={2}
                rotationIntensity={0.5}
                floatIntensity={0.5}
                floatingRange={[-0.15, 0.15]}
            >
                <group
                    onPointerMove={(e) => {
                        if (e.intersections.length > 0) {
                            const hit = e.intersections[0].object;
                            // Log what the mouse is touching to find invisible blocks
                            console.log('Raycaster touching:', hit.name);
                        }
                    }}
                >
                    {cardUnits.map((card) => {
                        return (
                            <CardItem
                                key={card.id}
                                card={card}
                                isMobile={isMobile}
                                onHoverChange={(hovered) => {
                                    if (hovered) {
                                        setActiveHoverId(card.id);
                                    } else if (activeHoverId === card.id) {
                                        setActiveHoverId(null);
                                    }
                                }}
                                onClick={() => {
                                    setActiveClickId(activeClickId === card.id ? null : card.id);
                                }}
                            />
                        );
                    })}
                </group>
            </Float>
        </group>
    );
};

const Content = ({ isMobile }: { isMobile: boolean }) => {
    const { cameras } = useGLTF('/assets/3d/s01/morph_particles.gltf');
    const textures = useTexture({
        card_01: '/assets/images/s01_button_01.png',
        card_02: '/assets/images/s01_button_01.png',
        card_03: '/assets/images/s01_button_01.png',
        card_04: '/assets/images/s01_button_01.png',
        card_05: '/assets/images/s01_button_01.png',
        card_06: '/assets/images/s01_button_01.png',
    });

    useMemo(() => {
        if (!textures) return;
        Object.values(textures).forEach((tex: any) => {
            if (tex) {
                tex.flipY = false;
                if ('colorSpace' in tex) tex.colorSpace = 'srgb';
            }
        });
    }, [textures]);

    const cam1 = useMemo(() => {
        if (!cameras || !Array.isArray(cameras)) return null;
        return cameras.find(c => c.name === 'cam1') as THREE.PerspectiveCamera;
    }, [cameras]);

    return (
        <>
            {cam1 ? (
                <PerspectiveCamera
                    makeDefault
                    position={[cam1.position.x, cam1.position.y, cam1.position.z * (isMobile ? 1.4 : 1.0)]}
                    rotation={[cam1.rotation.x, cam1.rotation.y, cam1.rotation.z]}
                    fov={isMobile ? 45 : 35}
                    near={0.1}
                    far={1000}
                />
            ) : (
                <PerspectiveCamera makeDefault position={[0, 0, isMobile ? 20 : 15]} fov={isMobile ? 45 : 35} />
            )}

            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={2.5} />
            <React.Suspense fallback={null}>
                <Model textures={textures} isMobile={isMobile} />
            </React.Suspense>
            <Environment preset="night" />
        </>
    );
};

const Section01Background3D: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    key="section-01-3d-bg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 0,
                        pointerEvents: 'auto',
                        touchAction: 'none'
                    }}
                >
                    <Canvas
                        gl={{
                            antialias: true,
                            alpha: true,
                            powerPreference: "high-performance"
                        }}
                        dpr={[1, 2]}
                        camera={{ fov: isMobile ? 45 : 35 }}
                        style={{ pointerEvents: 'auto' }}
                    >
                        <React.Suspense fallback={null}>
                            <Content isMobile={isMobile} />
                        </React.Suspense>
                    </Canvas>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

useGLTF.preload('/assets/3d/s01/morph_particles.gltf');
useTexture.preload('/assets/images/s01_button_01.svg');

export default Section01Background3D;
