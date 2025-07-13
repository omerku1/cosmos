import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const Galaxies: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const galaxyRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [galaxyType, setGalaxyType] = useState<'spiral' | 'elliptical' | 'irregular'>('spiral');
  const [starCount, setStarCount] = useState(15000);

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

  useEffect(() => {
    if (galaxyRef.current) {
      createGalaxy();
    }
  }, [galaxyType, starCount]);

  const initThreeJS = () => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 0, 0);
    
    createGalaxy();
    setupControls();
    animate();
    
    setIsLoading(false);
  };

  const createGalaxy = () => {
    if (!sceneRef.current) return;

    // Remove existing galaxy
    if (galaxyRef.current) {
      sceneRef.current.remove(galaxyRef.current);
    }

    const galaxy = new THREE.Group();
    galaxyRef.current = galaxy;

    switch (galaxyType) {
      case 'spiral':
        createSpiralGalaxy(galaxy);
        break;
      case 'elliptical':
        createEllipticalGalaxy(galaxy);
        break;
      case 'irregular':
        createIrregularGalaxy(galaxy);
        break;
    }

    sceneRef.current.add(galaxy);
  };

  const createSpiralGalaxy = (galaxy: THREE.Group) => {
    // Create spiral arms
    const spiralGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      
      // Spiral parameters
      const radius = (i / starCount) * 4;
      const angle = (i / starCount) * Math.PI * 8 + Math.random() * 0.5;
      const armOffset = Math.floor(Math.random() * 4) * (Math.PI / 2);
      
      // Position with some randomness
      positions[i3] = Math.cos(angle + armOffset) * radius + (Math.random() - 0.5) * 0.5;
      positions[i3 + 1] = (Math.random() - 0.5) * 0.3 * (1 - radius / 4);
      positions[i3 + 2] = Math.sin(angle + armOffset) * radius + (Math.random() - 0.5) * 0.5;
      
      // Colors based on distance from center
      const distanceFromCenter = Math.sqrt(positions[i3] ** 2 + positions[i3 + 2] ** 2);
      const color = new THREE.Color();
      
      if (distanceFromCenter < 0.5) {
        // Central bulge - yellow/orange
        color.setHSL(0.1 + Math.random() * 0.1, 0.8, 0.7 + Math.random() * 0.3);
      } else {
        // Spiral arms - blue/white
        color.setHSL(0.6 + Math.random() * 0.2, 0.6, 0.6 + Math.random() * 0.4);
      }
      
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // Size variation
      sizes[i] = 0.5 + Math.random() * 1.5;
    }
    
    spiralGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    spiralGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    spiralGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const spiralMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float r = distance(gl_PointCoord, vec2(0.5, 0.5));
          if (r > 0.5) discard;
          
          float alpha = 1.0 - (r * 2.0);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });
    
    const spiral = new THREE.Points(spiralGeometry, spiralMaterial);
    galaxy.add(spiral);
    
    // Add central black hole
    const blackHoleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const blackHoleMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x000000,
      transparent: true,
      opacity: 0.8
    });
    const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    galaxy.add(blackHole);
    
    // Add accretion disk
    const diskGeometry = new THREE.RingGeometry(0.15, 0.4, 32);
    const diskMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff6b6b,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    disk.rotation.x = Math.PI / 2;
    galaxy.add(disk);
  };

  const createEllipticalGalaxy = (galaxy: THREE.Group) => {
    const ellipticalGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      
      // Elliptical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = Math.pow(Math.random(), 0.7) * 3;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6; // Flattened
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Older, redder stars
      const color = new THREE.Color();
      color.setHSL(0.05 + Math.random() * 0.1, 0.7, 0.6 + Math.random() * 0.3);
      
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      sizes[i] = 0.3 + Math.random() * 1.0;
    }
    
    ellipticalGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    ellipticalGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    ellipticalGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const ellipticalMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const elliptical = new THREE.Points(ellipticalGeometry, ellipticalMaterial);
    galaxy.add(elliptical);
  };

  const createIrregularGalaxy = (galaxy: THREE.Group) => {
    const irregularGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    // Create multiple star-forming regions
    const regions = 5;
    const starsPerRegion = Math.floor(starCount / regions);
    
    for (let region = 0; region < regions; region++) {
      const regionCenter = {
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 1,
        z: (Math.random() - 0.5) * 4
      };
      
      for (let i = 0; i < starsPerRegion; i++) {
        const index = region * starsPerRegion + i;
        const i3 = index * 3;
        
        // Clustered around region center
        positions[i3] = regionCenter.x + (Math.random() - 0.5) * 2;
        positions[i3 + 1] = regionCenter.y + (Math.random() - 0.5) * 0.5;
        positions[i3 + 2] = regionCenter.z + (Math.random() - 0.5) * 2;
        
        // Mixed stellar populations
        const color = new THREE.Color();
        if (Math.random() > 0.7) {
          // Young blue stars
          color.setHSL(0.6 + Math.random() * 0.1, 0.8, 0.8);
        } else {
          // Older stars
          color.setHSL(0.1 + Math.random() * 0.2, 0.6, 0.6);
        }
        
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
        
        sizes[i] = 0.4 + Math.random() * 1.2;
      }
    }
    
    irregularGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    irregularGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    irregularGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const irregularMaterial = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    
    const irregular = new THREE.Points(irregularGeometry, irregularMaterial);
    galaxy.add(irregular);
  };

  const setupControls = () => {
    if (!containerRef.current || !cameraRef.current || !galaxyRef.current) return;

    let mouseX = 0;
    let mouseY = 0;
    let isMouseDown = false;
    
    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      if (!isMouseDown && galaxyRef.current) {
        gsap.to(galaxyRef.current.rotation, {
          x: mouseY * 0.3,
          y: mouseX * 0.5,
          duration: 1.5,
          ease: "power2.out"
        });
      }
    };
    
    const handleMouseDown = () => {
      isMouseDown = true;
    };
    
    const handleMouseUp = () => {
      isMouseDown = false;
    };
    
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (!cameraRef.current) return;
      
      const zoomSpeed = 0.1;
      const newZ = cameraRef.current.position.z + event.deltaY * zoomSpeed * 0.01;
      cameraRef.current.position.z = Math.max(2, Math.min(15, newZ));
    };
    
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('mousedown', handleMouseDown);
    containerRef.current.addEventListener('mouseup', handleMouseUp);
    containerRef.current.addEventListener('wheel', handleWheel);
  };

  const animate = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    
    requestAnimationFrame(animate);
    
    if (galaxyRef.current) {
      // Slow rotation
      galaxyRef.current.rotation.y += 0.002;
      
      // Update shader uniforms if using custom shaders
      galaxyRef.current.children.forEach(child => {
        if (child instanceof THREE.Points && child.material instanceof THREE.ShaderMaterial) {
          child.material.uniforms.time.value = Date.now() * 0.001;
        }
      });
    }
    
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  const handleGalaxyTypeChange = (type: 'spiral' | 'elliptical' | 'irregular') => {
    setGalaxyType(type);
  };

  const handleStarCountChange = (count: number) => {
    setStarCount(count);
  };

  return (
    <div className="section-content">
      <div className="section-visual">
        <div ref={containerRef} className="three-container" />
        
        {isLoading && (
          <div className="loading-spinner" />
        )}
        
        {/* Galaxy Controls */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0,0,0,0.8)',
          padding: '15px',
          borderRadius: '12px',
          color: '#fff',
          fontSize: '0.9rem',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ 
            color: '#4ecdc4', 
            fontWeight: '600', 
            marginBottom: '12px'
          }}>
            סוג גלקסיה
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { type: 'spiral' as const, name: 'ספירלית', desc: 'כמו שביל החלב' },
              { type: 'elliptical' as const, name: 'אליפטית', desc: 'עגולה וישנה' },
              { type: 'irregular' as const, name: 'לא סדירה', desc: 'צורה חופשית' }
            ].map(({ type, name, desc }) => (
              <button
                key={type}
                onClick={() => handleGalaxyTypeChange(type)}
                style={{
                  background: galaxyType === type ? 'rgba(78, 205, 196, 0.3)' : 'transparent',
                  border: `1px solid ${galaxyType === type ? '#4ecdc4' : 'rgba(255,255,255,0.3)'}`,
                  color: galaxyType === type ? '#4ecdc4' : '#fff',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  textAlign: 'right',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ fontWeight: '600' }}>{name}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Star Count Control */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.8)',
          padding: '15px',
          borderRadius: '12px',
          color: '#fff',
          fontSize: '0.9rem',
          border: '1px solid rgba(255,255,255,0.2)',
          minWidth: '180px'
        }}>
          <div style={{ 
            color: '#4ecdc4', 
            fontWeight: '600', 
            marginBottom: '12px'
          }}>
            כוכבים: {starCount.toLocaleString()}
          </div>
          
          <input
            type="range"
            min="5000"
            max="25000"
            step="2500"
            value={starCount}
            onChange={(e) => handleStarCountChange(parseInt(e.target.value))}
            style={{
              width: '100%',
              marginBottom: '8px'
            }}
          />
          
          <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
            שביל החלב מכיל יותר מ-100 מיליארד כוכבים!
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          color: '#fff',
          fontSize: '0.9rem',
          background: 'rgba(0,0,0,0.6)',
          padding: '12px 20px',
          borderRadius: '25px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          הזז עכבר לסיבוב • גלגל עכבר לזום • נסה סוגי גלקסיות שונים
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
          כשגלקסיות קטנות יותר התמזגו יחד לאורך מיליארדי שנים, ויוצרת צורה ספירלית מרהיבה.
        </p>
      </div>
    </div>
  );
};

export default Galaxies;