import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const Galaxies: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const galaxyRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      initThreeJS();
    }
    
    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  const initThreeJS = () => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    sceneRef.current = scene;
    rendererRef.current = renderer;
    
    // Create galaxy
    const galaxy = new THREE.Group();
    galaxyRef.current = galaxy;
    
    // Create spiral arms
    const spiralGeometry = new THREE.BufferGeometry();
    const spiralCount = 8000;
    const positions = new Float32Array(spiralCount * 3);
    const colors = new Float32Array(spiralCount * 3);
    
    for (let i = 0; i < spiralCount; i++) {
      const i3 = i * 3;
      const angle = (i / spiralCount) * Math.PI * 6;
      const radius = (i / spiralCount) * 3;
      
      // Spiral formula
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = (Math.random() - 0.5) * 0.2;
      positions[i3 + 2] = Math.sin(angle) * radius;
      
      // Colors
      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.2, 0.8, 0.6 + Math.random() * 0.4);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    spiralGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    spiralGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const spiralMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    const spiral = new THREE.Points(spiralGeometry, spiralMaterial);
    galaxy.add(spiral);
    
    // Add central bulge
    const bulgeGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const bulgeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffaa00,
      transparent: true,
      opacity: 0.6
    });
    const bulge = new THREE.Mesh(bulgeGeometry, bulgeMaterial);
    galaxy.add(bulge);
    
    scene.add(galaxy);
    
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (galaxy) {
        galaxy.rotation.y += 0.005;
        galaxy.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      gsap.to(galaxy.rotation, {
        x: mouseY * 0.3,
        y: mouseX * 0.3,
        duration: 1,
        ease: "power2.out"
      });
    };
    
    containerRef.current.addEventListener('mousemove', handleMouseMove);
  };

  return (
    <div className="section-content">
      <div className="section-visual">
        <div ref={containerRef} className="three-container" />
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          color: '#fff',
          fontSize: '0.8rem'
        }}>
          הזז את העכבר כדי לסובב את הגלקסיה
        </div>
      </div>
      
      <div className="section-text">
        <div className="section-timeline">לפני 13 מיליארד שנה</div>
        <h2 className="section-title">לידת הגלקסיות</h2>
        <p className="section-description">
          כוכבים החלו להתקבץ יחד בקבוצות עצומות שנקראות גלקסיות. הגלקסיות הראשונות 
          היו קטנות יותר ולא סדורות כמו הגלקסיות שאנחנו רואים היום.
        </p>
        <p className="section-description">
          הגלקסיה שלנו, שביל החלב, מכילה יותר מ-100 מיליארד כוכבים! היא נוצרה 
          כשגלקסיות קטנות יותר התמזגו יחד לאורך מיליארדי שנים.
        </p>
      </div>
    </div>
  );
};

export default Galaxies;