import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const LifeEvolution: React.FC = () => {
  const visualRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [currentStage, setCurrentStage] = React.useState(0);

  const lifeStages = [
    { name: 'חיידקים פרימיטיביים', color: '#4ecdc4', size: 10, description: 'התאים הראשונים - פשוטים וללא גרעין' },
    { name: 'תאים עם גרעין', color: '#96ceb4', size: 15, description: 'תאים מורכבים יותר עם גרעין מוגדר' },
    { name: 'תאים מתחברים', color: '#ff6b6b', size: 25, description: 'תאים מתחילים לשתף פעולה' },
    { name: 'יצורים רב-תאיים', color: '#feca57', size: 40, description: 'היצורים הרב-תאיים הראשונים' }
  ];

  useEffect(() => {
    if (visualRef.current) {
      createInitialCells();
    }
  }, []);

  const createInitialCells = () => {
    if (!visualRef.current) return;

    // Create primitive cells
    for (let i = 0; i < 20; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.style.position = 'absolute';
      cell.style.left = `${Math.random() * 80 + 10}%`;
      cell.style.top = `${Math.random() * 80 + 10}%`;
      cell.style.width = '8px';
      cell.style.height = '8px';
      cell.style.borderRadius = '50%';
      cell.style.background = '#4ecdc4';
      cell.style.boxShadow = '0 0 10px rgba(78, 205, 196, 0.6)';
      cell.style.opacity = '0.8';
      
      visualRef.current.appendChild(cell);

      // Animate cells
      gsap.to(cell, {
        x: `+=${Math.random() * 60 - 30}`,
        y: `+=${Math.random() * 60 - 30}`,
        duration: 3 + Math.random() * 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });
    }
  };

  const evolveLife = () => {
    if (currentStage >= lifeStages.length - 1) return;

    const nextStage = currentStage + 1;
    setCurrentStage(nextStage);

    const cells = visualRef.current?.querySelectorAll('.cell');
    if (!cells) return;

    const stage = lifeStages[nextStage];

    cells.forEach((cell, index) => {
      gsap.to(cell, {
        width: `${stage.size}px`,
        height: `${stage.size}px`,
        background: stage.color,
        duration: 2,
        ease: "power2.out",
        delay: index * 0.1
      });

      // Add nucleus for eukaryotic cells
      if (nextStage >= 1 && !cell.querySelector('.nucleus')) {
        const nucleus = document.createElement('div');
        nucleus.className = 'nucleus';
        nucleus.style.position = 'absolute';
        nucleus.style.left = '50%';
        nucleus.style.top = '50%';
        nucleus.style.transform = 'translate(-50%, -50%)';
        nucleus.style.width = '30%';
        nucleus.style.height = '30%';
        nucleus.style.borderRadius = '50%';
        nucleus.style.background = '#fff';
        nucleus.style.opacity = '0.8';
        
        cell.appendChild(nucleus);
      }

      // Group cells for multicellular stage
      if (nextStage >= 2) {
        const neighbors = Array.from(cells).filter(other => other !== cell);
        const closest = neighbors.reduce((closest, other) => {
          const cellRect = cell.getBoundingClientRect();
          const otherRect = other.getBoundingClientRect();
          const currentDistance = Math.sqrt(
            Math.pow(cellRect.left - otherRect.left, 2) + 
            Math.pow(cellRect.top - otherRect.top, 2)
          );
          
          if (!closest.element || currentDistance < closest.distance) {
            return { element: other, distance: currentDistance };
          }
          return closest;
        }, { element: null as Element | null, distance: Infinity });

        if (closest.element && Math.random() > 0.7) {
          gsap.to(cell, {
            x: '+=30',
            y: '+=30',
            duration: 1,
            ease: "power2.out"
          });
        }
      }
    });
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const newZoom = direction === 'in' ? zoomLevel * 1.5 : zoomLevel / 1.5;
    setZoomLevel(Math.max(0.5, Math.min(3, newZoom)));
    
    if (visualRef.current) {
      gsap.to(visualRef.current, {
        scale: newZoom,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };

  return (
    <div className="section-content">
      <div className="section-visual">
        <div ref={visualRef} style={{ width: '100%', height: '100%', position: 'relative' }} />
        
        {/* Zoom Controls */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px'
        }}>
          <button 
            onClick={() => handleZoom('in')}
            style={{
              background: 'rgba(0,0,0,0.7)',
              border: '1px solid #4ecdc4',
              color: '#4ecdc4',
              padding: '5px 10px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔍+
          </button>
          <button 
            onClick={() => handleZoom('out')}
            style={{
              background: 'rgba(0,0,0,0.7)',
              border: '1px solid #4ecdc4',
              color: '#4ecdc4',
              padding: '5px 10px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔍-
          </button>
        </div>

        {/* Current Stage Info */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(0,0,0,0.8)',
          padding: '10px',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '0.9rem',
          maxWidth: '200px'
        }}>
          <h4 style={{ color: lifeStages[currentStage].color, marginBottom: '5px' }}>
            {lifeStages[currentStage].name}
          </h4>
          <p>{lifeStages[currentStage].description}</p>
        </div>

        {/* Evolution Button */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10
        }}>
          <button 
            className="interactive-button"
            onClick={evolveLife}
            disabled={currentStage >= lifeStages.length - 1}
          >
            {currentStage >= lifeStages.length - 1 ? 'התפתחות הושלמה!' : 'פתח את החיים'}
          </button>
        </div>
      </div>
      
      <div className="section-text">
        <div className="section-timeline">לפני 3.8 מיליארד שנה</div>
        <h2 className="section-title">תולדות החיים</h2>
        <p className="section-description">
          החיים התחילו באוקיינוסים הקדומים כתאים פשוטים מאוד. במשך מיליארדי שנים, 
          הם למדו לעבוד יחד, ליצור תאים מורכבים יותר, ולבסוף יצורים רב-תאיים.
        </p>
        <p className="section-description">
          זהו הבסיס לכל החיים על כדור הארץ היום - מהחיידק הקטן ביותר ועד הווייתן הכחול. 
          כולנו חולקים את אותם אבני הבניין הבסיסיות.
        </p>
      </div>
    </div>
  );
};

export default LifeEvolution;