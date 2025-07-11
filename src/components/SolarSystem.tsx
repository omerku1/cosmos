import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SolarSystem: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetsRef = useRef<THREE.Group | null>(null);
  const [selectedPlanet, setSelectedPlanet] = React.useState<string | null>(null);

  const planetData = [
    { name: 'שמש', distance: 0, size: 0.5, color: 0xffaa00, fact: 'השמש מכילה 99.86% מכל החומר במערכת השמש' },
    { name: 'כוכב חמה', distance: 1, size: 0.1, color: 0x8c7853, fact: 'יום על כוכב חמה ארוך יותר משנה שלו' },
    { name: 'נוגה', distance: 1.5, size: 0.15, color: 0xffa500, fact: 'נוגה היא הכוכב הכי חם במערכת השמש' },
    { name: 'כדור הארץ', distance: 2, size: 0.15, color: 0x4a90e2, fact: 'כדור הארץ הוא הכוכב היחיד שיש עליו חיים' },
    { name: 'מאדים', distance: 2.5, size: 0.12, color: 0xff4500, fact: 'על מאדים יש את ההר הגבוה ביותר במערכת השמש' },
    { name: 'צדק', distance: 3.5, size: 0.4, color: 0xd2691e, fact: 'צדק כל כך גדול שיכול להכיל את כל שאר הכוכבים' },
    { name: 'שבתאי', distance: 4.5, size: 0.35, color: 0xffd700, fact: 'שבתאי קל מהמים - הוא יכול לצוף!' },
    { name: 'אורנוס', distance: 5.5, size: 0.25, color: 0x4fd0e4, fact: 'אורנוס מסתובב על הצד - הוא "מגלגל" סביב השמש' }
  ];

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
    
    // Create solar system
    const solarSystem = new THREE.Group();
    planetsRef.current = solarSystem;
    
    planetData.forEach((planetInfo) => {
      const geometry = new THREE.SphereGeometry(planetInfo.size, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: planetInfo.color });
      const planet = new THREE.Mesh(geometry, material);
      
      planet.position.set(planetInfo.distance, 0, 0);
      planet.userData = { name: planetInfo.name, fact: planetInfo.fact };
      
      // Add orbit line
      const orbitGeometry = new THREE.RingGeometry(planetInfo.distance - 0.01, planetInfo.distance + 0.01, 64);
      const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x444444, 
        transparent: true, 
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      
      if (planetInfo.name !== 'שמש') {
        scene.add(orbit);
      }
      
      solarSystem.add(planet);
    });
    
    scene.add(solarSystem);
    
    camera.position.set(0, 3, 6);
    camera.lookAt(0, 0, 0);
    
    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const handleClick = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(solarSystem.children);
      
      if (intersects.length > 0) {
        const planet = intersects[0].object;
        setSelectedPlanet(planet.userData.name);
      }
    };
    
    containerRef.current.addEventListener('click', handleClick);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (solarSystem) {
        solarSystem.rotation.y += 0.01;
        
        // Rotate planets around their orbits
        solarSystem.children.forEach((planet, index) => {
          if (planet instanceof THREE.Mesh) {
            const speed = 0.02 / (index + 1);
            const angle = Date.now() * speed * 0.001;
            const distance = planetData[index].distance;
            planet.position.x = Math.cos(angle) * distance;
            planet.position.z = Math.sin(angle) * distance;
          }
        });
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
  };

  return (
    <div className="section-content">
      <div className="section-visual">
        <div ref={containerRef} className="three-container" />
        {selectedPlanet && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'rgba(0,0,0,0.8)',
            padding: '15px',
            borderRadius: '10px',
            color: '#fff',
            maxWidth: '250px',
            fontSize: '0.9rem'
          }}>
            <h4 style={{ marginBottom: '8px', color: '#4ecdc4' }}>{selectedPlanet}</h4>
            <p>{planetData.find(p => p.name === selectedPlanet)?.fact}</p>
            <button 
              onClick={() => setSelectedPlanet(null)}
              style={{
                marginTop: '10px',
                background: 'none',
                border: '1px solid #4ecdc4',
                color: '#4ecdc4',
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              סגור
            </button>
          </div>
        )}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          color: '#fff',
          fontSize: '0.8rem'
        }}>
          לחץ על כוכב לכת ללמוד עליו
        </div>
      </div>
      
      <div className="section-text">
        <div className="section-timeline">לפני 4.6 מיליארד שנה</div>
        <h2 className="section-title">מערכת השמש</h2>
        <p className="section-description">
          מענן עצום של גז ואבק, השמש שלנו נולדה במרכז, וכוכבי הלכת נוצרו מהחומרים 
          שנותרו. הכוכבים הפנימיים עשויים מסלע, והחיצוניים מגז.
        </p>
        <p className="section-description">
          כדור הארץ נוצר בדיוק במרחק הנכון מהשמש - לא חם מדי ולא קר מדי. 
          זה נקרא "אזור גולדילוקס" - המקום המושלם לחיים.
        </p>
      </div>
    </div>
  );
};

export default SolarSystem;