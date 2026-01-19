import React, { useRef, useMemo, useEffect, createContext, useContext, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { TextureLoader } from 'three';
import { Text } from '@react-three/drei';

// Context for sharing hover state between buttons and particles
interface MorphContextType {
  hoveredButton: number | null;
  setHoveredButton: (button: number | null) => void;
}

const MorphContext = createContext<MorphContextType>({
  hoveredButton: null,
  setHoveredButton: () => { },
});

const SimulationShaders = {
  fragmentShaderPosition: `
    uniform float time;
    uniform float speed;
    uniform float dieSpeed;
    uniform float radius;
    uniform float curlSize;
    uniform float attraction;
    uniform float morphProgress;
    uniform vec3 mouse3d;
    uniform vec2 uUserRotation;
    uniform sampler2D textureDefaultPosition;
    uniform sampler2D textureMorphTargetSource;
    uniform sampler2D textureMorphTargetDest;
    uniform float targetMorphProgress;

    // Simplex Noise 4D
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    float mod289(float x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    float permute(float x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float taylorInvSqrt(float r) { return 1.79284291400159 - 0.85373472095314 * r; }

    vec4 grad4(float j, vec4 ip) {
      const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
      vec4 p,s;
      p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
      p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
      s = vec4(lessThan(p, vec4(0.0)));
      p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;
      return p;
    }

    #define F4 0.309016994374947451
    vec4 simplexNoiseDerivatives (vec4 v) {
      const vec4 C = vec4(0.138196601125011,0.276393202250021,0.414589803375032,-0.447213595499958);
      vec4 i = floor(v + dot(v, vec4(F4)) );
      vec4 x0 = v - i + dot(i, C.xxxx);
      vec4 i0;
      vec3 isX = step( x0.yzw, x0.xxx );
      vec3 isYZ = step( x0.zww, x0.yyz );
      i0.x = isX.x + isX.y + isX.z;
      i0.yzw = 1.0 - isX;
      i0.y += isYZ.x + isYZ.y;
      i0.zw += 1.0 - isYZ.xy;
      i0.z += isYZ.z;
      i0.w += 1.0 - isYZ.z;
      vec4 i3 = clamp( i0, 0.0, 1.0 );
      vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
      vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );
      vec4 x1 = x0 - i1 + C.xxxx;
      vec4 x2 = x0 - i2 + C.yyyy;
      vec4 x3 = x0 - i3 + C.zzzz;
      vec4 x4 = x0 + C.wwww;
      i = mod289(i);
      float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
      vec4 j1 = permute( permute( permute( permute (i.w + vec4(i1.w, i2.w, i3.w, 1.0 )) + i.z + vec4(i1.z, i2.z, i3.z, 1.0 )) + i.y + vec4(i1.y, i2.y, i3.y, 1.0 )) + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
      vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;
      vec4 p0 = grad4(j0, ip);
      vec4 p1 = grad4(j1.x, ip);
      vec4 p2 = grad4(j1.y, ip);
      vec4 p3 = grad4(j1.z, ip);
      vec4 p4 = grad4(j1.w, ip);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      p4 *= taylorInvSqrt(dot(p4,p4));
      vec3 values0 = vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2));
      vec2 values1 = vec2(dot(p3, x3), dot(p4, x4));
      vec3 m0 = max(0.5 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
      vec2 m1 = max(0.5 - vec2(dot(x3,x3), dot(x4,x4)), 0.0);
      vec3 temp0 = -6.0 * m0 * m0 * values0;
      vec2 temp1 = -6.0 * m1 * m1 * values1;
      vec3 mmm0 = m0 * m0 * m0;
      vec2 mmm1 = m1 * m1 * m1;
      float dx = temp0[0] * x0.x + temp0[1] * x1.x + temp0[2] * x2.x + temp1[0] * x3.x + temp1[1] * x4.x + mmm0[0] * p0.x + mmm0[1] * p1.x + mmm0[2] * p2.x + mmm1[0] * p3.x + mmm1[1] * p4.x;
      float dy = temp0[0] * x0.y + temp0[1] * x1.y + temp0[2] * x2.y + temp1[0] * x3.y + temp1[1] * x4.y + mmm0[0] * p0.y + mmm0[1] * p1.y + mmm0[2] * p2.y + mmm1[0] * p3.y + mmm1[1] * p4.y;
      float dz = temp0[0] * x0.z + temp0[1] * x1.z + temp0[2] * x2.z + temp1[0] * x3.z + temp1[1] * x4.z + mmm0[0] * p0.z + mmm0[1] * p1.z + mmm0[2] * p2.z + mmm1[0] * p3.z + mmm1[1] * p4.z;
      float dw = temp0[0] * x0.w + temp0[1] * x1.w + temp0[2] * x2.w + temp1[0] * x3.w + temp1[1] * x4.w + mmm0[0] * p0.w + mmm0[1] * p1.w + mmm0[2] * p2.w + mmm1[0] * p3.w + mmm1[1] * p4.w;
      return vec4(dx, dy, dz, dw) * 49.0;
    }

    vec3 curl( in vec3 p, in float noiseTime ) {
      vec4 xNoisePotentialDerivatives = vec4(0.0);
      vec4 yNoisePotentialDerivatives = vec4(0.0);
      vec4 zNoisePotentialDerivatives = vec4(0.0);
      for (int i = 0; i < 3; ++i) {
        float twoPowI = pow(2.0, float(i));
        float scale = 0.5 * twoPowI * pow(0.2, float(i)); // 0.2 is persistence
        xNoisePotentialDerivatives += simplexNoiseDerivatives(vec4(p * twoPowI, noiseTime)) * scale;
        yNoisePotentialDerivatives += simplexNoiseDerivatives(vec4((p + vec3(123.4, 129845.6, -1239.1)) * twoPowI, noiseTime)) * scale;
        zNoisePotentialDerivatives += simplexNoiseDerivatives(vec4((p + vec3(-9519.0, 9051.0, -123.0)) * twoPowI, noiseTime)) * scale;
      }
      return vec3(
        zNoisePotentialDerivatives[1] - yNoisePotentialDerivatives[2],
        xNoisePotentialDerivatives[2] - zNoisePotentialDerivatives[0],
        yNoisePotentialDerivatives[0] - xNoisePotentialDerivatives[1]
      );
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec4 positionInfo = texture2D( texturePosition, uv );
      vec3 position = positionInfo.xyz;
      float life = positionInfo.a - dieSpeed;

      vec3 followPosition = mouse3d;

      if(life < 0.0) {
        if (morphProgress > 0.01) {
          life = 0.5 + fract(uv.x * 21.4131 + time);
          vec3 targetSource = texture2D(textureMorphTargetSource, uv).xyz;
          vec3 targetDest = texture2D(textureMorphTargetDest, uv).xyz;
          position = mix(targetSource, targetDest, targetMorphProgress) * 0.15;
        } else {
          positionInfo = texture2D( textureDefaultPosition, uv );
          position = positionInfo.xyz * (1.0 + sin(time * 15.0) * 0.2) * 0.4 * radius;
          position += followPosition;
          life = 0.5 + fract(positionInfo.w * 21.4131 + time);
        }
      } else {
        vec3 delta = followPosition - position;
        position += delta * (0.005 + life * 0.01) * attraction * (1.0 - smoothstep(5.0, 35.0, length(delta))) * speed;
        position += curl(position * curlSize, time) * speed;
      }

      // Manual rotation from user drag
      mat3 rotX = mat3(
        1.0, 0.0, 0.0,
        0.0, cos(uUserRotation.x), -sin(uUserRotation.x),
        0.0, sin(uUserRotation.x), cos(uUserRotation.x)
      );
      mat3 rotY = mat3(
        cos(uUserRotation.y), 0.0, sin(uUserRotation.y),
        0.0, 1.0, 0.0,
        -sin(uUserRotation.y), 0.0, cos(uUserRotation.y)
      );
      
      vec3 targetSource = texture2D(textureMorphTargetSource, uv).xyz;
      vec3 targetDest = texture2D(textureMorphTargetDest, uv).xyz;
      vec3 morphPos = mix(targetSource, targetDest, targetMorphProgress) * 0.15;
      
      // Localized wobble effect when mouse is near
      float dToMouse = length(morphPos - mouse3d);
      float wobble = smoothstep(35.0, 0.0, dToMouse) * morphProgress;
      morphPos += curl(morphPos * 0.05, time * 1.5) * wobble * 3.5;

      morphPos = rotY * rotX * morphPos; // Apply user rotation to the morph target
      position = mix(position, morphPos, morphProgress);

      gl_FragColor = vec4(position, life);
    }
  `
};

const Particles = () => {
  const { gl } = useThree();
  const { hoveredButton } = useContext(MorphContext);

  // Load original color texture
  const colorTexture = useLoader(EXRLoader, '/assets/3d/s01/prt08_col.exr');

  // Dynamically load all 6 target textures
  const morphTargets = useLoader(EXRLoader, [
    '/assets/3d/s01/prt01_pos.exr',
    '/assets/3d/s01/prt01_col.exr',
    '/assets/3d/s01/prt02_pos.exr',
    '/assets/3d/s01/prt02_col.exr',
    '/assets/3d/s01/prt03_pos.exr',
    '/assets/3d/s01/prt03_col.exr',
    '/assets/3d/s01/prt04_pos.exr',
    '/assets/3d/s01/prt04_col.exr',
    '/assets/3d/s01/prt05_pos.exr',
    '/assets/3d/s01/prt05_col.exr',
    '/assets/3d/s01/prt06_pos.exr',
    '/assets/3d/s01/prt06_col.exr',
  ]);

  useMemo(() => {
    [colorTexture, ...morphTargets].forEach(tex => {
      tex.minFilter = THREE.NearestFilter;
      tex.magFilter = THREE.NearestFilter;
      tex.generateMipmaps = false;
      tex.flipY = true;
      tex.needsUpdate = true;
    });
  }, [colorTexture, morphTargets]);

  const getTargetTextures = useCallback((btn: number) => {
    const idx = btn - 1;
    if (idx < 0 || idx >= 6) return { pos: morphTargets[0], col: colorTexture };

    const pos = morphTargets[idx * 2];
    const col = morphTargets[idx * 2 + 1];

    return { pos, col };
  }, [morphTargets, colorTexture]);

  // Match EXR texture dimensions: 1024 x 79
  const WIDTH = 1024;
  const HEIGHT = 79;
  const count = WIDTH * HEIGHT;

  const gpuCompute = useMemo(() => {
    const renderer = new GPUComputationRenderer(WIDTH, HEIGHT, gl);

    const dtPosition = renderer.createTexture();
    const posArray = dtPosition.image.data;

    for (let i = 0; i < posArray.length; i += 4) {
      // Create initial sphere distribution
      const r = (0.5 + Math.random() * 0.5) * 50;
      const phi = (Math.random() - 0.5) * Math.PI;
      const theta = Math.random() * Math.PI * 2;
      posArray[i + 0] = r * Math.cos(theta) * Math.cos(phi);
      posArray[i + 1] = r * Math.sin(phi);
      posArray[i + 2] = r * Math.sin(theta) * Math.cos(phi);
      posArray[i + 3] = Math.random();
    }

    const positionVariable = renderer.addVariable('texturePosition', SimulationShaders.fragmentShaderPosition, dtPosition);
    renderer.setVariableDependencies(positionVariable, [positionVariable]);

    positionVariable.material.uniforms.time = { value: 0 };
    positionVariable.material.uniforms.uDelta = { value: 0 };
    positionVariable.material.uniforms.mouse3d = { value: new THREE.Vector3() };
    positionVariable.material.uniforms.textureDefaultPosition = { value: dtPosition.clone() };
    positionVariable.material.uniforms.speed = { value: 0.3 };
    positionVariable.material.uniforms.dieSpeed = { value: 0.008 };
    positionVariable.material.uniforms.radius = { value: 0.6 };
    positionVariable.material.uniforms.curlSize = { value: 0.02 };
    positionVariable.material.uniforms.attraction = { value: 0.5 };
    positionVariable.material.uniforms.morphProgress = { value: 0 };
    positionVariable.material.uniforms.targetMorphProgress = { value: 0 };
    positionVariable.material.uniforms.uUserRotation = { value: new THREE.Vector2(0, 0) };
    positionVariable.material.uniforms.textureMorphTargetSource = { value: morphTargets[0] };
    positionVariable.material.uniforms.textureMorphTargetDest = { value: morphTargets[0] };

    const error = renderer.init();
    if (error !== null) console.error(error);

    return { renderer, positionVariable };
  }, [gl, morphTargets]);

  const pointsRef = useRef<THREE.Points>(null);
  const mouse = useRef(new THREE.Vector3());

  const particlesGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const uvs = new Float32Array(count * 2);

    for (let i = 0; i < count; i++) {
      uvs[i * 2 + 0] = (i % WIDTH) / WIDTH;
      uvs[i * 2 + 1] = Math.floor(i / WIDTH) / HEIGHT;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    return geo;
  }, [count]);

  const particlesMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        texturePosition: { value: null },
        uColorTexture: { value: colorTexture },
        uMorphColorSource: { value: colorTexture },
        uMorphColorDest: { value: colorTexture },
        targetMorphProgress: { value: 0 },
        morphProgress: { value: 0 },
        color1: { value: new THREE.Color('#68F2EB') },
        color2: { value: new THREE.Color('#8868F2') },
      },
      vertexShader: `
        uniform sampler2D texturePosition;
        varying float vLife;
        varying vec2 vUv;
        void main() {
          vec4 positionInfo = texture2D( texturePosition, uv );
          vec4 worldPosition = modelMatrix * vec4( positionInfo.xyz, 1.0 );
          vec4 mvPosition = viewMatrix * worldPosition;
          vLife = positionInfo.w;
          vUv = uv;
          gl_PointSize = 300.0 / length( mvPosition.xyz ) * smoothstep(0.0, 0.2, vLife);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vLife;
        varying vec2 vUv;
        uniform sampler2D uColorTexture;
        uniform sampler2D uMorphColorSource;
        uniform sampler2D uMorphColorDest;
        uniform float targetMorphProgress;
        uniform float morphProgress;
        uniform vec3 color1;
        uniform vec3 color2;
        void main() {
          if (vLife <= 0.0) discard;
          
          // Use gl_PointCoord for softness
          float dist = length(gl_PointCoord - 0.5);
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, dist) * smoothstep(0.0, 0.2, vLife);

          vec3 baseColor = texture2D(uColorTexture, vUv).rgb;
          vec3 morphColorSource = texture2D(uMorphColorSource, vUv).rgb;
          vec3 morphColorDest = texture2D(uMorphColorDest, vUv).rgb;
          vec3 morphColor = mix(morphColorSource, morphColorDest, targetMorphProgress);
          
          vec3 texColor = mix(baseColor, morphColor, morphProgress);
          
          // Create gradient based on particle ID (vUv.x)
          vec3 gradientColor = mix(color1, color2, vUv.x);
          
          // Mix themed gradient with texture colors
          float whiteMix = smoothstep(0.0, 0.7, vLife) * (1.0 - morphProgress);
          vec3 outgoingLight = mix(texColor, gradientColor, whiteMix);
          
          // Boost intensity for bloom effect
          outgoingLight *= 1.5;
          
          gl_FragColor = vec4( outgoingLight, alpha * 0.45 );
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [colorTexture]);

  const prevHovered = useRef<number | null>(null);
  const lastTargetedButton = useRef<number | null>(null);
  const userRotation = useRef(new THREE.Vector2(0, 0));
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      // Only start dragging if particles are morphed (at least somewhat)
      if (gpuCompute.positionVariable.material.uniforms.morphProgress.value > 0.1) {
        isDragging.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;

      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;

      // Update rotation (inverted for natural feel)
      userRotation.current.y += deltaX * 0.01;
      userRotation.current.x += deltaY * 0.01;

      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [gpuCompute]);

  useEffect(() => {
    import('gsap').then(({ default: gsap }) => {
      const isTargetButton = hoveredButton !== null && hoveredButton >= 1 && hoveredButton <= 6;

      const posUniforms = gpuCompute.positionVariable.material.uniforms;
      const mat = pointsRef.current ? pointsRef.current.material as THREE.ShaderMaterial : null;
      const matUniforms = mat ? mat.uniforms : null;

      // Kill any active animations to prevent conflicts
      gsap.killTweensOf(posUniforms.morphProgress);
      gsap.killTweensOf(posUniforms.targetMorphProgress);
      gsap.killTweensOf(posUniforms.dieSpeed);
      if (matUniforms) {
        gsap.killTweensOf(matUniforms.morphProgress);
        gsap.killTweensOf(matUniforms.targetMorphProgress);
      }

      if (isTargetButton) {
        const currentTex = getTargetTextures(hoveredButton!);

        // If we are switching to a NEW button
        if (lastTargetedButton.current !== hoveredButton) {
          const prevBtn = lastTargetedButton.current;

          if (prevBtn === null) {
            // First time hovering - set immediately
            posUniforms.textureMorphTargetSource.value = currentTex.pos;
            posUniforms.textureMorphTargetDest.value = currentTex.pos;
            posUniforms.targetMorphProgress.value = 1;
            if (matUniforms) {
              matUniforms.uMorphColorSource.value = currentTex.col;
              matUniforms.uMorphColorDest.value = currentTex.col;
              matUniforms.targetMorphProgress.value = 1;
            }
          } else {
            const prevTex = getTargetTextures(prevBtn);
            // Set Source to where we were, Dest to where we are going
            posUniforms.textureMorphTargetSource.value = prevTex.pos;
            posUniforms.textureMorphTargetDest.value = currentTex.pos;
            if (matUniforms) {
              matUniforms.uMorphColorSource.value = prevTex.col;
              matUniforms.uMorphColorDest.value = currentTex.col;
            }

            // Animate progress from 0 to 1
            const animObj = { progress: 0 };
            gsap.to(animObj, {
              progress: 1,
              duration: 1.5,
              ease: 'power2.inOut',
              onUpdate: () => {
                posUniforms.targetMorphProgress.value = animObj.progress;
                if (matUniforms) matUniforms.targetMorphProgress.value = animObj.progress;
              }
            });
          }

          // Ensure morphProgress is 1 (morphed state)
          gsap.to(posUniforms.morphProgress, { value: 1, duration: 1.5, ease: 'power2.inOut' });
          if (matUniforms) gsap.to(matUniforms.morphProgress, { value: 1, duration: 1.5, ease: 'power2.inOut' });

          lastTargetedButton.current = hoveredButton!;
        } else {
          // Already have this button as target, ensure textures are correct just in case
          posUniforms.textureMorphTargetDest.value = currentTex.pos;
          if (matUniforms) matUniforms.uMorphColorDest.value = currentTex.col;

          gsap.to(posUniforms.morphProgress, { value: 1, duration: 1.5, ease: 'power2.inOut' });
          if (matUniforms) gsap.to(matUniforms.morphProgress, { value: 1, duration: 1.5, ease: 'power2.inOut' });
        }

        gsap.to(posUniforms.dieSpeed, {
          value: 0,
          duration: 1.0
        });
      } else {
        // If we were just hovering a button, make sure we finish the morph
        // even if the button has disappeared or we moved away.
        if (lastTargetedButton.current !== null) {
          gsap.to(posUniforms.morphProgress, {
            value: 1.0,
            duration: 1.5,
            ease: 'power2.inOut'
          });
          gsap.to(posUniforms.targetMorphProgress, {
            value: 1.0,
            duration: 1.5,
            ease: 'power2.inOut'
          });
          if (matUniforms) {
            gsap.to(matUniforms.morphProgress, { value: 1.0, duration: 1.5, ease: 'power2.inOut' });
            gsap.to(matUniforms.targetMorphProgress, { value: 1.0, duration: 1.5, ease: 'power2.inOut' });
          }
        }

        // RETURN TO FLUID: after 5 seconds
        gsap.to(posUniforms.morphProgress, {
          value: 0,
          duration: 3.0,
          ease: 'power2.inOut',
          delay: 5.0
        });

        if (matUniforms) {
          gsap.to(matUniforms.morphProgress, {
            value: 0,
            duration: 3.0,
            ease: 'power2.inOut',
            delay: 5.0
          });
        }

        gsap.to(posUniforms.dieSpeed, {
          value: 0.008,
          duration: 2.0,
          delay: 5.0
        });
      }

      prevHovered.current = hoveredButton;
    });
  }, [hoveredButton, gpuCompute, getTargetTextures]);

  useFrame((state, delta) => {
    const { clock, raycaster } = state;
    const t = clock.getElapsedTime();

    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const target = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, target);
    mouse.current.lerp(target, 0.1);

    gpuCompute.positionVariable.material.uniforms.time.value = t;
    gpuCompute.positionVariable.material.uniforms.uDelta.value = delta;
    gpuCompute.positionVariable.material.uniforms.mouse3d.value.copy(mouse.current);
    gpuCompute.positionVariable.material.uniforms.uUserRotation.value.copy(userRotation.current);

    gpuCompute.renderer.compute();

    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.texturePosition.value = gpuCompute.renderer.getCurrentRenderTarget(gpuCompute.positionVariable).texture;
    }
  });

  return (
    <points
      ref={pointsRef}
      geometry={particlesGeometry}
      material={particlesMaterial}
    />
  );
};

// Single floating button component
interface FloatingButtonProps {
  position: [number, number, number];
  phaseOffset: number;
  buttonNumber: number;
  onHover: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ position, phaseOffset, buttonNumber, onHover }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { setHoveredButton } = useContext(MorphContext);
  const buttonTexture = useLoader(TextureLoader, '/assets/images/s01_button_01.svg');

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      // Floating motion with unique phase
      groupRef.current.position.y = position[1] + Math.sin(t * 0.8 + phaseOffset) * 3;
      groupRef.current.position.x = position[0] + Math.sin(t * 0.5 + phaseOffset * 0.7) * 1.5;
      // Subtle rotation
      groupRef.current.rotation.z = Math.sin(t * 0.3 + phaseOffset) * 0.1;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={() => {
        setHoveredButton(buttonNumber);
        onHover();
      }}
    >
      <mesh>
        <planeGeometry args={[9.6, 9.6]} />
        <meshBasicMaterial
          map={buttonTexture}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

interface FloatingButtonsProps {
  activeButtonIdx: number;
  onHover: () => void;
}

// Container for all floating buttons
const FloatingButtons: React.FC<FloatingButtonsProps> = ({ activeButtonIdx, onHover }) => {
  // Position buttons in a circular arrangement
  const buttonPositions: [number, number, number][] = [
    [-36, 16, 8],
    [36, 20, 8],
    [-44, -12, 4],
    [40, -16, 4],
    [-24, 28, 12],
    [28, -28, 12],
  ];

  const pos = buttonPositions[activeButtonIdx];

  return (
    <group>
      <FloatingButton
        position={pos}
        phaseOffset={activeButtonIdx * 1.2}
        buttonNumber={activeButtonIdx + 1}
        onHover={onHover}
      />
    </group>
  );
};

const Section01Experience: React.FC = () => {
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);
  const [activeButtonIdx, setActiveButtonIdx] = useState(() => Math.floor(Math.random() * 6));

  const handleNextButton = useCallback(() => {
    // Small delay before setting hoveredButton to null to start the return timer
    setTimeout(() => {
      setHoveredButton(null);
    }, 100);

    // Pick a different random button
    setActiveButtonIdx(prev => {
      let next = Math.floor(Math.random() * 6);
      while (next === prev) {
        next = Math.floor(Math.random() * 6);
      }
      return next;
    });
  }, []);

  return (
    <div className="absolute inset-0 z-[2500] pointer-events-none">
      <MorphContext.Provider value={{ hoveredButton, setHoveredButton }}>
        <Canvas
          style={{ pointerEvents: 'auto' }}
          camera={{ position: [0, 0, 100], fov: 50, far: 10000 }}
          gl={{ antialias: true, alpha: true }}
          shadows
        >
          {/* Scene Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[50, 80, 50]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={500}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
          />
          <pointLight position={[-50, 30, -50]} intensity={0.5} color="#4488ff" />

          <FloatingButtons activeButtonIdx={activeButtonIdx} onHover={handleNextButton} />
          <Particles />
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} intensity={1.5} radius={0.5} />
          </EffectComposer>
        </Canvas>
      </MorphContext.Provider>
    </div>
  );
};

export default Section01Experience;
