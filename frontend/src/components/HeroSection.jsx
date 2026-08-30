import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowRight, ShieldCheck, Zap, Lock, Sparkles, ChevronDown } from 'lucide-react';
import UniversalDropzone from './UniversalDropzone';

export default function HeroSection() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  // -------------------------------------------------------------
  // 1. Interactive Three.js 3D Spatial Canvas (Spline-Grade WebGL)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 7.5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting (Warm Mineral & Crisp Key Light)
    const ambientLight = new THREE.AmbientLight(0xfafafa, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xe2e8f0, 1.0);
    dirLight2.position.set(-5, -5, -2);
    scene.add(dirLight2);

    // Group for layered 3D file origami & floating geometric tokens
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Central Multi-Faceted Crystal File Core (Icosahedron / Polyhedron)
    const coreGeometry = new THREE.IcosahedronGeometry(2.0, 0);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.15,
      metalness: 0.05,
      transmission: 0.65,
      thickness: 1.2,
      ior: 1.45,
      reflectivity: 0.8,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      flatShading: true,
      wireframe: false
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    rootGroup.add(coreMesh);

    // Outer Precision Hairline Wireframe Cage
    const wireGeometry = new THREE.IcosahedronGeometry(2.04, 0);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xcbd5e1,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    rootGroup.add(wireMesh);

    // Orbiting Geometric Satellites (representing format tokens: PDF, 3D, IMG)
    const satellites = [];
    const satGeometries = [
      new THREE.BoxGeometry(0.35, 0.48, 0.08), // Document
      new THREE.OctahedronGeometry(0.28, 0),    // 3D Model
      new THREE.TetrahedronGeometry(0.32, 0)   // Spatial Token
    ];

    const satMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.3, metalness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x4e8773, roughness: 0.2, metalness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.1 })
    ];

    for (let i = 0; i < 6; i++) {
      const satMesh = new THREE.Mesh(satGeometries[i % 3], satMaterials[i % 3]);
      const angle = (i / 6) * Math.PI * 2;
      const radius = 3.2 + (i % 2) * 0.4;
      satMesh.position.set(
        Math.cos(angle) * radius,
        (Math.sin(i * 1.5) * 0.8),
        Math.sin(angle) * radius
      );
      satMesh.userData = {
        angle,
        radius,
        speed: 0.008 + (i * 0.002),
        bobSpeed: 0.02 + (i * 0.005),
        initialY: satMesh.position.y
      };
      rootGroup.add(satMesh);
      satellites.push(satMesh);
    }

    // Animation Loop with Spring Damping ($k=120, d=18$)
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse spring interpolation
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.06;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.06;

      rootGroup.rotation.x = currentRotation.current.x + Math.sin(elapsedTime * 0.6) * 0.08;
      rootGroup.rotation.y = currentRotation.current.y + elapsedTime * 0.25;

      // Animate orbiting satellites
      satellites.forEach((sat, idx) => {
        sat.userData.angle += sat.userData.speed;
        sat.position.x = Math.cos(sat.userData.angle) * sat.userData.radius;
        sat.position.z = Math.sin(sat.userData.angle) * sat.userData.radius;
        sat.position.y = sat.userData.initialY + Math.sin(elapsedTime * 2 + idx) * 0.25;
        sat.rotation.x += 0.015;
        sat.rotation.y += 0.02;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!canvasRef.current) return;
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Mouse Parallax Coordinate Calculation
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    targetRotation.current = {
      x: -y * 0.55,
      y: x * 0.75
    };
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    targetRotation.current = { x: 0, y: 0 };
    setIsHovered(false);
  };

  const scrollToTools = () => {
    const el = document.getElementById('all-tools-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '88vh',
        background: 'linear-gradient(180deg, #FAFAFC 0%, #F4F5F8 100%)',
        overflow: 'hidden',
        padding: '3rem 1.5rem 5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #E2E8F0'
      }}
    >
      {/* Background 3D Spatial Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.85,
          zIndex: 1
        }}
      />

      {/* Subtle Background Radial Ambient Vignette */}
      <div 
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -20%)',
          width: '800px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(244,245,248,0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Main Content Container */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1080px', width: '100%', textAlign: 'center', margin: '0 auto' }}>
        
        {/* Privacy Trust Badge (Staggered Entry 1) */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0.45rem 1.1rem',
          background: 'rgba(255, 255, 255, 0.85)',
          border: '1px solid #E2E8F0',
          borderRadius: '9999px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          marginBottom: '1.75rem',
          animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B', letterSpacing: '0.01em' }}>
            100% In-Browser Computation • Zero Bytes Uploaded to Cloud
          </span>
        </div>

        {/* Master Kinetic Headline (Staggered Entry 2) */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
          fontWeight: 850,
          color: '#111827',
          lineHeight: 1.08,
          letterSpacing: '-0.035em',
          margin: '0 auto 1.25rem auto',
          maxWidth: '900px',
          animation: 'fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards'
        }}>
          Convert. Compress. Compute.{' '}
          <span style={{
            display: 'inline-block',
            color: '#4B5563',
            fontWeight: 400
          }}>
            Locally in your browser.
          </span>
        </h1>

        {/* Subtitle & Value Promise */}
        <p style={{
          fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
          color: '#4B5563',
          maxWidth: '680px',
          margin: '0 auto 2.5rem auto',
          lineHeight: 1.6,
          fontWeight: 450,
          animation: 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards'
        }}>
          Every file utility you need in one unified, high-performance workspace. 
          Powered by WebAssembly, WebGL, and HTML5 Canvas — zero file size limits, zero sign-ups, and absolute privacy.
        </p>

        {/* Magnetic Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '3.5rem',
          animation: 'fadeInUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards'
        }}>
          {/* Primary Magnetic Launch Button */}
          <button
            onClick={scrollToTools}
            style={{
              padding: '0.9rem 2.2rem',
              borderRadius: '10px',
              background: '#111827',
              color: '#FFFFFF',
              border: '1px solid #111827',
              fontSize: '0.98rem',
              fontWeight: 650,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 4px 14px rgba(17, 24, 39, 0.12)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(17, 24, 39, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(17, 24, 39, 0.12)';
            }}
          >
            <span>Explore 50+ In-Browser Tools</span>
            <ArrowRight size={18} />
          </button>

          {/* Secondary Outline Button */}
          <a
            href="/faq"
            style={{
              padding: '0.9rem 2rem',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.8)',
              color: '#1E293B',
              border: '1px solid #CBD5E1',
              fontSize: '0.98rem',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.borderColor = '#94A3B8';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <ShieldCheck size={18} color="#4E8773" />
            <span>How Local Privacy Works</span>
          </a>
        </div>

        {/* Embedded Universal Smart Dropzone with Secure Lock Physics */}
        <div style={{
          position: 'relative',
          maxWidth: '860px',
          margin: '0 auto',
          animation: 'fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards'
        }}>
          <UniversalDropzone />
        </div>

        {/* Scroll Indicator */}
        <div 
          onClick={scrollToTools}
          style={{
            marginTop: '3.5rem',
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: '#94A3B8',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            opacity: 0.8,
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
        >
          <span>Scroll to browse categories</span>
          <ChevronDown size={18} style={{ animation: 'bounceSlow 2s infinite' }} />
        </div>

      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(6px);
          }
        }
      `}</style>
    </section>
  );
}
