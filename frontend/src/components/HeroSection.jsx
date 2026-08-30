import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowRight, ShieldCheck, Zap, Lock, Sparkles, ChevronDown } from 'lucide-react';
import UniversalDropzone from './UniversalDropzone';

export default function HeroSection() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const isVisibleRef = useRef(true);

  // -------------------------------------------------------------
  // 1. High-Performance 60FPS Three.js Spatial Canvas
  // -------------------------------------------------------------
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.z = 7.0;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    // Optimized Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xe2e8f0, 0.8);
    dirLight2.position.set(-5, -5, -2);
    scene.add(dirLight2);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Central Multi-Faceted Crystal File Core (Optimized Standard Material)
    const coreGeometry = new THREE.IcosahedronGeometry(1.85, 0);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.25,
      metalness: 0.1,
      flatShading: true
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    rootGroup.add(coreMesh);

    // Outer Precision Hairline Wireframe
    const wireGeometry = new THREE.IcosahedronGeometry(1.88, 0);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xcbd5e1,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    rootGroup.add(wireMesh);

    // 4 Lightweight Orbiting Format Satellites
    const satellites = [];
    const satGeometries = [
      new THREE.BoxGeometry(0.32, 0.44, 0.06), // Document
      new THREE.OctahedronGeometry(0.24, 0),    // 3D Model
      new THREE.TetrahedronGeometry(0.26, 0),   // Spatial Token
      new THREE.BoxGeometry(0.3, 0.3, 0.06)     // Media
    ];

    const satMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.3, metalness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: 0x4e8773, roughness: 0.3, metalness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.1 })
    ];

    for (let i = 0; i < 4; i++) {
      const satMesh = new THREE.Mesh(satGeometries[i], satMaterials[i]);
      const angle = (i / 4) * Math.PI * 2;
      const radius = 2.85;
      satMesh.position.set(
        Math.cos(angle) * radius,
        (Math.sin(i * 1.5) * 0.6),
        Math.sin(angle) * radius
      );
      satMesh.userData = {
        angle,
        radius,
        speed: 0.006 + (i * 0.002),
        initialY: satMesh.position.y
      };
      rootGroup.add(satMesh);
      satellites.push(satMesh);
    }

    // Visibility Observer to pause rendering when scrolled out of view
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    // 60FPS Animation Loop with Delta Time
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Only render when visible to guarantee 100% CPU/GPU smoothness for scrolling
      if (!isVisibleRef.current) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse spring interpolation (Lerp factor 0.08)
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08;

      rootGroup.rotation.x = currentRotation.current.x + Math.sin(elapsedTime * 0.5) * 0.06;
      rootGroup.rotation.y = currentRotation.current.y + elapsedTime * 0.2;

      // Animate orbiting satellites
      satellites.forEach((sat, idx) => {
        sat.userData.angle += sat.userData.speed;
        sat.position.x = Math.cos(sat.userData.angle) * sat.userData.radius;
        sat.position.z = Math.sin(sat.userData.angle) * sat.userData.radius;
        sat.position.y = sat.userData.initialY + Math.sin(elapsedTime * 1.8 + idx) * 0.2;
        sat.rotation.x += 0.01;
        sat.rotation.y += 0.015;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Debounced Resize Handler
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!canvasRef.current) return;
        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      renderer.dispose();
    };
  }, []);

  // RAF-Throttled Mouse Parallax
  const rafId = useRef(null);
  const handleMouseMove = (e) => {
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

        targetRotation.current = {
          x: -y * 0.4,
          y: x * 0.55
        };
      }
      rafId.current = null;
    });
  };

  const handleMouseLeave = () => {
    targetRotation.current = { x: 0, y: 0 };
  };

  const scrollToTools = () => {
    const el = document.getElementById('bento-features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '85vh',
        background: 'linear-gradient(180deg, #FAFAFC 0%, #F4F5F8 100%)',
        overflow: 'hidden',
        padding: '3.5rem 1.5rem 4.5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #E2E8F0',
        willChange: 'transform'
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

      {/* Main Content Container */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1080px', width: '100%', textAlign: 'center', margin: '0 auto' }}>
        
        {/* Privacy Trust Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0.45rem 1.1rem',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #E2E8F0',
          borderRadius: '9999px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          marginBottom: '1.75rem'
        }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>
            100% In-Browser Computation • Zero Bytes Uploaded to Cloud
          </span>
        </div>

        {/* Master Headline */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
          fontWeight: 850,
          color: '#111827',
          lineHeight: 1.1,
          letterSpacing: '-0.035em',
          margin: '0 auto 1.25rem auto',
          maxWidth: '900px'
        }}>
          Convert. Compress. Compute.{' '}
          <span style={{ color: '#4B5563', fontWeight: 400 }}>
            Locally in your browser.
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
          color: '#4B5563',
          maxWidth: '680px',
          margin: '0 auto 2.5rem auto',
          lineHeight: 1.6,
          fontWeight: 450
        }}>
          Every file utility you need in one unified, high-performance workspace. 
          Powered by WebAssembly, WebGL, and HTML5 Canvas — zero file size limits, zero sign-ups, and absolute privacy.
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '3.5rem'
        }}>
          <a
            href="/app"
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
              textDecoration: 'none',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 4px 14px rgba(17, 24, 39, 0.12)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(17, 24, 39, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(17, 24, 39, 0.12)';
            }}
          >
            <span>Launch Studio (50+ Tools)</span>
            <ArrowRight size={18} />
          </a>

          <a
            href="/faq"
            style={{
              padding: '0.9rem 2rem',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#1E293B',
              border: '1px solid #CBD5E1',
              fontSize: '0.98rem',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(10px)',
              transition: 'background 0.2s, border-color 0.2s, transform 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.borderColor = '#94A3B8';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
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
          margin: '0 auto'
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
            opacity: 0.85,
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.85'}
        >
          <span>Explore features & architectural breakdown</span>
          <ChevronDown size={18} style={{ animation: 'bounceSlow 2s infinite' }} />
        </div>

      </div>

      <style>{`
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
