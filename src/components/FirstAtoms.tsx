import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const FirstAtoms: React.FC = () => {
  const visualRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const [atomsCreated, setAtomsCreated] = React.useState(0);

  useEffect(() => {
    if (visualRef.current) {
      createFloatingParticles();
      setupDragAndDrop();
    }
  }, []);

  const createFloatingParticles = () => {
    if (!visualRef.current) return;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'draggable-element';
      particle.style.left = `${Math.random() * 80 + 10}%`;
      particle.style.top = `${Math.random() * 80 + 10}%`;
      particle.style.background = i % 2 === 0 ? 
        'radial-gradient(circle, #ff6b6b, #ff8e8e)' : 
        'radial-gradient(circle, #4ecdc4, #6ee0d4)';
      particle.style.width = '20px';
      particle.style.height = '20px';
      
      visualRef.current.appendChild(particle);

      gsap.to(particle, {
        x: `+=${Math.random() * 40 - 20}`,
        y: `+=${Math.random() * 40 - 20}`,
        duration: 2 + Math.random() * 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });
    }
  };

  const setupDragAndDrop = () => {
    if (!visualRef.current) return;

    const particles = visualRef.current.querySelectorAll('.draggable-element');
    particles.forEach(particle => {
      let isDragging = false;
      let startX = 0;
      let startY = 0;

      const handleMouseDown = (e: MouseEvent) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        (particle as HTMLElement).style.cursor = 'grabbing';
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        gsap.set(particle, {
          x: `+=${dx}`,
          y: `+=${dy}`
        });
        
        startX = e.clientX;
        startY = e.clientY;
      };

      const handleMouseUp = () => {
        isDragging = false;
        (particle as HTMLElement).style.cursor = 'grab';
        
        // Check if particles are close enough to combine
        checkForCombination(particle as HTMLElement);
      };

      particle.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
  };

  const checkForCombination = (particle: HTMLElement) => {
    const particles = visualRef.current?.querySelectorAll('.draggable-element');
    if (!particles) return;

    const rect1 = particle.getBoundingClientRect();
    
    particles.forEach(other => {
      if (other === particle) return;
      
      const rect2 = other.getBoundingClientRect();
      const distance = Math.sqrt(
        Math.pow(rect1.left - rect2.left, 2) + 
        Math.pow(rect1.top - rect2.top, 2)
      );
      
      if (distance < 50) {
        createAtom(particle, other as HTMLElement);
      }
    });
  };

  const createAtom = (particle1: HTMLElement, particle2: HTMLElement) => {
    const atom = document.createElement('div');
    atom.className = 'created-atom';
    atom.style.position = 'absolute';
    atom.style.left = particle1.style.left;
    atom.style.top = particle1.style.top;
    atom.style.width = '40px';
    atom.style.height = '40px';
    atom.style.borderRadius = '50%';
    atom.style.background = 'radial-gradient(circle, #96ceb4, #85c7a6)';
    atom.style.border = '2px solid #fff';
    atom.style.boxShadow = '0 0 20px rgba(150, 206, 180, 0.6)';
    atom.textContent = 'H';
    atom.style.display = 'flex';
    atom.style.alignItems = 'center';
    atom.style.justifyContent = 'center';
    atom.style.color = '#fff';
    atom.style.fontWeight = 'bold';
    
    visualRef.current?.appendChild(atom);
    
    gsap.fromTo(atom, 
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
    );
    
    // Remove original particles
    particle1.remove();
    particle2.remove();
    
    setAtomsCreated(prev => prev + 1);
  };

  return (
    <div className="section-content">
      <div className="section-visual" ref={visualRef}>
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(0,0,0,0.7)',
          padding: '10px',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '0.9rem'
        }}>
          אטומים שנוצרו: {atomsCreated}
        </div>
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          color: '#fff',
          fontSize: '0.8rem'
        }}>
          גרור חלקיקים קרוב זה לזה ליצירת אטומים
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
          לפני כן, היקום היה מלא באור בלבד - חם מדי בשביל אטומים. עכשיו, בפעם הראשונה, 
          אור יכול לנסוע בחופשיות ביקום. זהו האור שאנחנו עדיין רואים היום כקרינת הרקע הקוסמית.
        </p>
      </div>
    </div>
  );
};

export default FirstAtoms;