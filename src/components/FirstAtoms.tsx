import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface Particle {
  id: string;
  element: HTMLDivElement;
  type: 'proton' | 'electron';
}

const FirstAtoms: React.FC = () => {
  const visualRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [atomsCreated, setAtomsCreated] = useState(0);
  const [temperature, setTemperature] = useState(3000);
  const draggedParticle = useRef<HTMLDivElement | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (visualRef.current) {
      createInitialParticles();
      startTemperatureCooling();
    }
  }, []);

  const startTemperatureCooling = () => {
    const interval = setInterval(() => {
      setTemperature(prev => {
        const newTemp = Math.max(300, prev - 50);
        if (newTemp <= 300) {
          clearInterval(interval);
        }
        return newTemp;
      });
    }, 500);
  };

  const createInitialParticles = () => {
    if (!visualRef.current) return;

    const newParticles: Particle[] = [];
    
    // Create protons and electrons
    for (let i = 0; i < 30; i++) {
      const isProton = i < 15;
      const particle = document.createElement('div');
      const id = `particle-${i}`;
      
      particle.id = id;
      particle.className = `draggable-element ${isProton ? 'proton' : 'electron'}`;
      particle.style.position = 'absolute';
      particle.style.left = `${15 + Math.random() * 70}%`;
      particle.style.top = `${15 + Math.random() * 70}%`;
      particle.style.width = isProton ? '24px' : '16px';
      particle.style.height = particle.style.width;
      particle.style.borderRadius = '50%';
      particle.style.background = isProton ? 
        'radial-gradient(circle, #ff6b6b, #e55656)' : 
        'radial-gradient(circle, #4ecdc4, #45b7d1)';
      particle.style.cursor = 'grab';
      particle.style.zIndex = '10';
      particle.style.boxShadow = `0 0 15px ${isProton ? '#ff6b6b' : '#4ecdc4'}`;
      particle.style.border = '2px solid rgba(255,255,255,0.3)';
      
      // Add charge indicator
      const charge = document.createElement('div');
      charge.textContent = isProton ? '+' : '-';
      charge.style.position = 'absolute';
      charge.style.top = '50%';
      charge.style.left = '50%';
      charge.style.transform = 'translate(-50%, -50%)';
      charge.style.color = '#fff';
      charge.style.fontSize = '12px';
      charge.style.fontWeight = 'bold';
      charge.style.pointerEvents = 'none';
      particle.appendChild(charge);
      
      visualRef.current.appendChild(particle);
      
      newParticles.push({
        id,
        element: particle,
        type: isProton ? 'proton' : 'electron'
      });

      // Add floating animation
      gsap.to(particle, {
        x: `+=${(Math.random() - 0.5) * 100}`,
        y: `+=${(Math.random() - 0.5) * 100}`,
        duration: 3 + Math.random() * 4,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      });

      // Add mouse events
      setupParticleEvents(particle);
    }
    
    setParticles(newParticles);
  };

  const setupParticleEvents = (particle: HTMLDivElement) => {
    let isDragging = false;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      isDragging = true;
      draggedParticle.current = particle;
      
      const rect = particle.getBoundingClientRect();
      const containerRect = visualRef.current?.getBoundingClientRect();
      
      if (containerRect) {
        dragOffset.current = {
          x: e.clientX - rect.left - rect.width / 2,
          y: e.clientY - rect.top - rect.height / 2
        };
      }
      
      particle.style.cursor = 'grabbing';
      particle.style.zIndex = '20';
      particle.style.transform = 'scale(1.1)';
      
      // Kill existing animations
      gsap.killTweensOf(particle);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || draggedParticle.current !== particle) return;
      
      const containerRect = visualRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      
      const x = e.clientX - containerRect.left - dragOffset.current.x;
      const y = e.clientY - containerRect.top - dragOffset.current.y;
      
      // Keep within bounds
      const maxX = containerRect.width - parseInt(particle.style.width);
      const maxY = containerRect.height - parseInt(particle.style.height);
      
      particle.style.left = `${Math.max(0, Math.min(maxX, x))}px`;
      particle.style.top = `${Math.max(0, Math.min(maxY, y))}px`;
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      
      isDragging = false;
      particle.style.cursor = 'grab';
      particle.style.zIndex = '10';
      particle.style.transform = 'scale(1)';
      
      // Check for atom formation
      checkForAtomFormation(particle);
      
      draggedParticle.current = null;
    };

    particle.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const checkForAtomFormation = (particle: HTMLDivElement) => {
    if (!visualRef.current) return;
    
    const allParticles = visualRef.current.querySelectorAll('.draggable-element');
    const rect1 = particle.getBoundingClientRect();
    
    allParticles.forEach(other => {
      if (other === particle || other.classList.contains('atom')) return;
      
      const rect2 = other.getBoundingClientRect();
      const distance = Math.sqrt(
        Math.pow(rect1.left - rect2.left, 2) + 
        Math.pow(rect1.top - rect2.top, 2)
      );
      
      // Check if proton and electron are close enough
      const isProtonElectronPair = 
        (particle.classList.contains('proton') && (other as HTMLElement).classList.contains('electron')) ||
        (particle.classList.contains('electron') && (other as HTMLElement).classList.contains('proton'));
      
      if (distance < 60 && isProtonElectronPair && temperature <= 3000) {
        createAtom(particle, other as HTMLDivElement);
      }
    });
  };

  const createAtom = (particle1: HTMLDivElement, particle2: HTMLDivElement) => {
    if (!visualRef.current) return;

    // Create hydrogen atom
    const atom = document.createElement('div');
    atom.className = 'created-atom atom';
    atom.style.position = 'absolute';
    atom.style.left = particle1.style.left;
    atom.style.top = particle1.style.top;
    atom.style.width = '50px';
    atom.style.height = '50px';
    atom.style.borderRadius = '50%';
    atom.style.background = 'radial-gradient(circle, #96ceb4 0%, #85c7a6 50%, #74b895 100%)';
    atom.style.border = '3px solid #fff';
    atom.style.boxShadow = '0 0 25px rgba(150, 206, 180, 0.8), inset 0 0 15px rgba(255,255,255,0.3)';
    atom.style.display = 'flex';
    atom.style.alignItems = 'center';
    atom.style.justifyContent = 'center';
    atom.style.color = '#fff';
    atom.style.fontWeight = 'bold';
    atom.style.fontSize = '16px';
    atom.style.zIndex = '15';
    atom.textContent = 'H';
    
    // Add nucleus
    const nucleus = document.createElement('div');
    nucleus.style.position = 'absolute';
    nucleus.style.width = '12px';
    nucleus.style.height = '12px';
    nucleus.style.borderRadius = '50%';
    nucleus.style.background = '#ff6b6b';
    nucleus.style.top = '50%';
    nucleus.style.left = '50%';
    nucleus.style.transform = 'translate(-50%, -50%)';
    nucleus.style.boxShadow = '0 0 8px #ff6b6b';
    atom.appendChild(nucleus);
    
    // Add electron orbit
    const orbit = document.createElement('div');
    orbit.style.position = 'absolute';
    orbit.style.width = '40px';
    orbit.style.height = '40px';
    orbit.style.border = '1px solid rgba(78, 205, 196, 0.5)';
    orbit.style.borderRadius = '50%';
    orbit.style.top = '50%';
    orbit.style.left = '50%';
    orbit.style.transform = 'translate(-50%, -50%)';
    atom.appendChild(orbit);
    
    // Add orbiting electron
    const electron = document.createElement('div');
    electron.style.position = 'absolute';
    electron.style.width = '8px';
    electron.style.height = '8px';
    electron.style.borderRadius = '50%';
    electron.style.background = '#4ecdc4';
    electron.style.boxShadow = '0 0 6px #4ecdc4';
    electron.style.top = '5px';
    electron.style.left = '50%';
    electron.style.transform = 'translateX(-50%)';
    orbit.appendChild(electron);
    
    visualRef.current.appendChild(atom);
    
    // Animate atom creation
    gsap.fromTo(atom, 
      { scale: 0, opacity: 0, rotation: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        rotation: 360,
        duration: 1.5, 
        ease: "back.out(1.7)" 
      }
    );
    
    // Animate electron orbit
    gsap.to(electron, {
      rotation: 360,
      duration: 2,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 20px"
    });
    
    // Remove original particles with animation
    gsap.to([particle1, particle2], {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        particle1.remove();
        particle2.remove();
      }
    });
    
    setAtomsCreated(prev => prev + 1);
    
    // Add floating animation to atom
    gsap.to(atom, {
      x: `+=${(Math.random() - 0.5) * 50}`,
      y: `+=${(Math.random() - 0.5) * 50}`,
      duration: 4 + Math.random() * 3,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      delay: 1
    });
  };

  const getTemperatureColor = () => {
    if (temperature > 2000) return '#ff6b6b';
    if (temperature > 1000) return '#feca57';
    if (temperature > 500) return '#48cae4';
    return '#4ecdc4';
  };

  return (
    <div className="section-content">
      <div className="section-visual" ref={visualRef}>
        {/* Temperature and Status Panel */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0,0,0,0.8)',
          padding: '15px',
          borderRadius: '12px',
          color: '#fff',
          fontSize: '0.9rem',
          minWidth: '200px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ 
            color: getTemperatureColor(), 
            fontWeight: '600', 
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: getTemperatureColor(),
              boxShadow: `0 0 8px ${getTemperatureColor()}`
            }} />
            טמפרטורה: {temperature.toLocaleString()}K
          </div>
          <div>אטומים שנוצרו: {atomsCreated}</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '8px' }}>
            {temperature > 3000 ? 'חם מדי ליצירת אטומים' : 'מתקרר... אטומים יכולים להיווצר!'}
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
          גרור פרוטונים (+) ואלקטרונים (-) קרוב זה לזה ליצירת אטומי מימן
        </div>

        {/* Legend */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.8)',
          padding: '15px',
          borderRadius: '12px',
          color: '#fff',
          fontSize: '0.8rem',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ marginBottom: '8px', fontWeight: '600', color: '#4ecdc4' }}>
            מקרא
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #ff6b6b, #e55656)'
            }} />
            פרוטון (+)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #4ecdc4, #45b7d1)'
            }} />
            אלקטרון (-)
          </div>
        </div>
      </div>
      
      <div className="section-text">
        <div className="section-timeline">לפני 13.8 מיליארד שנה - 380,000 שנה</div>
        <h2 className="section-title">האטומים הראשונים</h2>
        <p className="section-description">
          ליקום לקח 380,000 שנה להתקרר מספיק כדי שהחלקיקים יוכלו להתחבר ליצירת 
          האטומים הראשונים - בעיקר מימן והליום. זה היה הרגע שבו היקום הפך שקוף לראשונה.
        </p>
        <p className="section-description">
          לפני כן, היקום היה מלא באור בלבד - חם מדי בשביל אטומים יציבים. עכשיו, בפעם הראשונה, 
          אור יכול לנסוע בחופשיות ביקום. זהו האור שאנחנו עדיין רואים היום כקרינת הרקע הקוסמית.
        </p>
      </div>
    </div>
  );
};

export default FirstAtoms;