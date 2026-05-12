import { Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, RoundedBox, Sparkles } from '@react-three/drei';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { buildSectionLayoutStyle, buildTypographyStyle } from './sectionStyleUtils';

function ProductBottle({
  bottleColor = '#e8d7b5',
  capColor = '#c9aa73',
  glowColor = '#f6e6c8',
  rotationSpeed = 0.45,
  floatIntensity = 1.1,
}) {
  const bottleMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: bottleColor,
    roughness: 0.18,
    metalness: 0.08,
    transmission: 0.22,
    thickness: 0.8,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    ior: 1.25,
  }), [bottleColor]);

  useFrame((state) => {
    const group = state.scene.getObjectByName('three-product-bottle');
    if (!group) return;
    group.rotation.y += rotationSpeed * 0.0035;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.35} floatIntensity={floatIntensity}>
      <group name="three-product-bottle" position={[0, 0.2, 0]}>
        <mesh position={[0, -1.55, 0]} rotation={[-0.08, 0, 0]}>
          <torusGeometry args={[1.25, 0.12, 24, 80]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={0.35} metalness={0.25} roughness={0.3} />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.72, 0.86, 2.55, 64]} />
          <primitive object={bottleMaterial} attach="material" />
        </mesh>

        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.36, 0.42, 0.48, 48]} />
          <meshStandardMaterial color={capColor} metalness={0.75} roughness={0.28} />
        </mesh>

        <RoundedBox args={[0.96, 0.78, 0.05]} radius={0.06} smoothness={6} position={[0, 0.1, 0.76]}>
          <meshStandardMaterial color="#f9f5ee" roughness={0.88} metalness={0.03} />
        </RoundedBox>

        <mesh position={[0, 0.14, 0.79]}>
          <planeGeometry args={[0.64, 0.42]} />
          <meshBasicMaterial color="#7b6242" transparent opacity={0.16} />
        </mesh>

        <mesh position={[0, -0.62, 0.8]}>
          <planeGeometry args={[0.42, 0.12]} />
          <meshBasicMaterial color="#b7872f" transparent opacity={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

function ProductStage({
  glowColor,
  bottleColor,
  capColor,
  rotationSpeed,
  floatIntensity,
  showSparkles,
  sparkleCount,
}) {
  return (
    <>
      <color attach="background" args={['transparent']} />
      <fog attach="fog" args={['#f7f1e8', 8, 18]} />
      <ambientLight intensity={1.3} />
      <directionalLight position={[4, 6, 3]} intensity={2.2} color="#fff7e8" />
      <pointLight position={[-4, -2, 2]} intensity={1.1} color={glowColor} />
      <spotLight position={[0, 5, 4]} angle={0.28} penumbra={1} intensity={2.2} color="#ffffff" />

      <mesh position={[0, -2.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.2, 64]} />
        <MeshDistortMaterial color={glowColor} emissive={glowColor} emissiveIntensity={0.28} distort={0.12} speed={1.8} roughness={0.38} />
      </mesh>

      {showSparkles ? (
        <Sparkles
          count={sparkleCount}
          scale={[5.6, 4.4, 5.6]}
          size={4}
          speed={0.35}
          opacity={0.55}
          color={glowColor}
        />
      ) : null}

      <Suspense fallback={null}>
        <ProductBottle
          bottleColor={bottleColor}
          capColor={capColor}
          glowColor={glowColor}
          rotationSpeed={rotationSpeed}
          floatIntensity={floatIntensity}
        />
        <Environment preset="sunset" />
      </Suspense>
    </>
  );
}

export default function ThreeProductHero({
  eyebrow,
  title,
  subtitle,
  description,
  ctaPrimaryText,
  ctaPrimaryHref,
  ctaSecondaryText,
  ctaSecondaryHref,
  bottleColor = '#e8d7b5',
  capColor = '#c9aa73',
  glowColor = '#f3d9aa',
  rotationSpeed = '0.45',
  floatIntensity = '1.1',
  cameraDistance = '6.2',
  showSparkles = true,
  sparkleCount = '32',
  sectionMinHeight,
  contentMaxWidth,
  contentGap,
  columnsTemplate,
  alignItems,
  justifyContent,
  ...styleProps
}) {
  const titleStyle = buildTypographyStyle(styleProps, 'title');
  const subtitleStyle = buildTypographyStyle(styleProps, 'subtitle');
  const descriptionStyle = buildTypographyStyle(styleProps, 'description');
  const layoutStyle = buildSectionLayoutStyle({
    minHeight: sectionMinHeight,
    contentMaxWidth,
    contentGap,
    columnsTemplate,
    alignItems,
    justifyContent,
  });

  return (
    <section
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#f9f4eb_0%,#f2e7d4_40%,#e6dac6_100%)] py-24"
      style={{ minHeight: sectionMinHeight || 'min(980px, 100vh)' }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-[8%] top-[10%] h-48 w-48 rounded-full bg-white/50 blur-3xl" />
        <div className="absolute bottom-[12%] right-[10%] h-56 w-56 rounded-full bg-[#d7b985]/35 blur-3xl" />
      </div>

      <div className="section-padding relative z-10 w-full" style={layoutStyle}>
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="max-w-2xl">
            <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">
              {eyebrow || 'Scene 3D'}
            </p>
            <h2 className="font-display text-5xl leading-[0.92] text-somacan-brand md:text-7xl" style={titleStyle}>
              {title || 'Le soin devient'}
              <br />
              <span className="font-light italic text-[#b7872f]" style={subtitleStyle}>
                {subtitle || 'expérience.'}
              </span>
            </h2>
            <p className="mt-8 max-w-xl text-[16px] font-light leading-8 text-stone-600" style={descriptionStyle}>
              {description || "Une scène produit premium pensée pour créer un moment plus immersif sans alourdir toute la page."}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to={ctaPrimaryHref || '/shop'} className="btn-luxury btn-luxury-primary">
                {ctaPrimaryText || 'Découvrir le produit'}
              </Link>
              <Link to={ctaSecondaryHref || '/about'} className="btn-luxury btn-luxury-outline">
                {ctaSecondaryText || 'Voir la marque'}
              </Link>
            </div>
          </div>

          <div className="relative h-[540px] w-full overflow-hidden rounded-[2.5rem] border border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.18)_100%)] shadow-[0_40px_120px_rgba(73,56,34,0.18)] backdrop-blur-xl">
            <Canvas camera={{ position: [0, 0.3, Number(cameraDistance) || 6.2], fov: 33 }}>
              <ProductStage
                glowColor={glowColor}
                bottleColor={bottleColor}
                capColor={capColor}
                rotationSpeed={Number(rotationSpeed) || 0.45}
                floatIntensity={Number(floatIntensity) || 1.1}
                showSparkles={showSparkles}
                sparkleCount={Number(sparkleCount) || 32}
              />
            </Canvas>
            <div className="pointer-events-none absolute inset-x-6 bottom-6 rounded-[1.5rem] border border-white/50 bg-white/55 px-5 py-4 backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Three.js Scene</p>
              <p className="mt-1 font-display text-xl text-somacan-brand">Rotation, lumière, profondeur et mouvement doux.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
