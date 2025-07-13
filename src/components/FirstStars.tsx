import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface Star {
  id: string;
  element: HTMLDivElement;
  mass: number;
  age: number;
  isSupernova: boolean;
}

const FirstStars: React.FC = () => {
  const visualRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [supernovaCount, setSupernovaCount] = useState(0);
  const [elementsCreated, setElementsCreated] = useState<string[]>([]);

  useEffect(() => {
    if (visualRef.current) {
      createStarField();
    }
  }, []);

  const createStarField = () => {
    if (!visualRef.current) return;

    const newStars: Star[] = [];
    
    // Create background stars
    for (let i = 0; i < 50; i++) {
      const star = document.createElement('div');
      star.className = 'background-star';
      star.style.position = 'absolute';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.width = `${1 + Math.random() * 3}px`;
      star.style.height = star.style.width;
      star.style.borderRadius = '50%';
      star.style.background = '#fff';
      star.style.boxShadow = '0 0 4px #fff';
      star.style.opacity = `${0.3 + Math.random() * 0.7}`;
      
      visualRef.current.appendChild(star);
      
      // Twinkling animation
      gsap.to(star, {
        opacity: 0.2 + Math.random() * 0.8,
        duration: 1 + Math.random() * 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });
    }

    // Create main interactive stars
    for (let i = 0; i < 8; i++) {
      const mass = 10 + Math.random() * 40; // Solar masses
      const star = document.createElement('div');
      const id = `star-${i}`;
      
      star.id = id;
      star.className = 'interactive-star';
      star.style.position = 'absolute';
      star.style.left = `${15 + Math.random() * 70}%`;
      star.style.top = `${15 + Math.random() * 70}%`;
      star.style.width = `${Math.min(50, 20 + mass)}px`;
      star.style.height = star.style.width;
      star.style.borderRadius = '50%';
      star.style.cursor = 'pointer';
      star.style.zIndex = '10';
      star.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      
      // Color based on mass/temperature
      const hue = mass > 30 ? 220 : mass > 20 ? 200 : 60;
      star.style.background = `radial-gradient(circle, hsl(${hue}, 80%, 70%), hsl(${hue}, 60%, 40%))`;
      star.style.boxShadow = `0 0 ${15 + mass/2}px hsl(${hue}, 80%, 60%)`;
      
      // Add stellar classification
      const classification = document.createElement('div');
      classification.style.position = 'absolute';
      classification.style.top = '-25px';
      classification.style.left = '50%';
      classification.style.transform = 'translateX(-50%)';
      classification.style.color = '#fff';
      classification.style.fontSize = '10px';
      classification.style.fontWeight = 'bold';
      classification.style.background = 'rgba(0,0,0,0.7)';
      classification.style.padding = '2px 6px';
      classification.style.borderRadius = '4px';
      classification.style.whiteSpace = 'nowrap';
      classification.textContent = mass > 30 ? 'O-Type' : mass > 20 ? 'B-Type' : 'A-Type';
      star.appendChild(classification);
      
      visualRef.current.appendChild(star);
      
      const starData: Star = {
        id,
        element: star,
        mass,
        age: 0,
        isSupernova: false
      };
      
      newStars.push(starData);
      
      // Pulsing animation
      gsap.to(star, {
        scale: 1 + (mass / 200),
        duration: 2 + Math.random() * 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });
      
      // Click handler
      star.addEventListener('click', () => triggerSupernova(starData));
      
      // Hover effects
      star.addEventListener('mouseenter', () => {
        gsap.to(star, {
          scale: 1.2,
          duration: 0.3,
          ease: "power2.out"
        });
        
        showStarInfo(star, starData);
      });
      
      star.addEventListener('mouseleave', () => {
        gsap.to(star, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
        
        hideStarInfo();
      });
    }
    
    setStars(newStars);
  };

  const showStarInfo = (star: HTMLDivElement, starData: Star) => {
    const info = document.createElement('div');
    info.className = 'star-info';
    info.style.position = 'absolute';
    info.style.background = 'rgba(0,0,0,0.9)';
    info.style.color = '#fff';
    info.style.padding = '12px';
    info.style.borderRadius = '8px';
    info.style.fontSize = '0.8rem';
    info.style.zIndex = '50';
    info.style.border = '1px solid rgba(255,255,255,0.2)';
    info.style.maxWidth = '200px';
    info.style.pointerEvents = 'none';
    
    const rect = star.getBoundingClientRect();
    const containerRect = visualRef.current?.getBoundingClientRect();
    
    if (containerRect) {
      info.style.left = `${rect.left - containerRect.left + rect.width + 10}px`;
      info.style.top = `${rect.top - containerRect.top}px`;
    }
    
    info.innerHTML = `
      <div style="color: #4ecdc4; font-weight: 600; margin-bottom: 6px;">
        כוכב מסיבי
      </div>
      <div>מסה: ${starData.mass.toFixed(1)} שמשות</div>
      <div>טמפרטורה: ${(30000 + starData.mass * 500).toLocaleString()}K</div>
      <div style="margin-top: 6px; font-size: 0.7rem; opacity: 0.8;">
        לחץ להפעלת סופרנובה
      </div>
    `;
    
    visualRef.current?.appendChild(info);
    
    gsap.fromTo(info, 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
    );
  };

  const hideStarInfo = () => {
    const info = visualRef.current?.querySelector('.star-info');
    if (info) {
      gsap.to(info, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => info.remove()
      });
    }
  };

  const triggerSupernova = (starData: Star) => {
    if (starData.isSupernova) return;
    
    starData.isSupernova = true;
    setSupernovaCount(prev => prev + 1);
    
    const star = starData.element;
    const tl = gsap.timeline();
    
    // Hide info panel
    hideStarInfo();
    
    // Supernova sequence
    tl.to(star, {
      scale: 0.8,
      duration: 0.5,
      ease: "power2.in"
    })
    .to(star, {
      scale: 15,
      opacity: 0.8,
      duration: 2,
      ease: "power3.out",
      background: 'radial-gradient(circle, #ffffff 0%, #ffaa00 20%, #ff6b6b 50%, #4ecdc4 80%, transparent 100%)'
    })
    .to(star, {
      scale: 25,
      opacity: 0.3,
      duration: 1.5,
      ease: "power2.out"
    })
    .call(() => createHeavyElements(star, starData))
    .to(star, {
      scale: 1,
      opacity: 0,
      duration: 2,
      ease: "power2.in",
      onComplete: () => {
        // Create neutron star or black hole
        createStellarRemnant(star, starData);
      }
    });
  };

  const createHeavyElements = (starElement: HTMLDivElement, starData: Star) => {
    const elements = [
      { symbol: 'C', name: 'פחמן', color: '#4ecdc4' },
      { symbol: 'O', name: 'חמצן', color: '#96ceb4' },
      { symbol: 'Ne', name: 'נאון', color: '#feca57' },
      { symbol: 'Mg', name: 'מגנזיום', color: '#ff9ff3' },
      { symbol: 'Si', name: 'סיליקון', color: '#54a0ff' },
      { symbol: 'Fe', name: 'ברזל', color: '#5f27cd' }
    ];
    
    const newElements: string[] = [];
    
    elements.forEach((element, index) => {
      const elementDiv = document.createElement('div');
      elementDiv.className = 'heavy-element';
      elementDiv.style.position = 'absolute';
      elementDiv.style.left = starElement.style.left;
      elementDiv.style.top = starElement.style.top;
      elementDiv.style.width = '30px';
      elementDiv.style.height = '30px';
      elementDiv.style.borderRadius = '50%';
      elementDiv.style.background = `radial-gradient(circle, ${element.color}, ${element.color}aa)`;
      elementDiv.style.color = '#fff';
      elementDiv.style.display = 'flex';
      elementDiv.style.alignItems = 'center';
      elementDiv.style.justifyContent = 'center';
      elementDiv.style.fontSize = '11px';
      elementDiv.style.fontWeight = 'bold';
      elementDiv.style.boxShadow = `0 0 15px ${element.color}`;
      elementDiv.style.border = '2px solid rgba(255,255,255,0.4)';
      elementDiv.style.zIndex = '20';
      elementDiv.textContent = element.symbol;
      elementDiv.title = element.name;
      
      visualRef.current?.appendChild(elementDiv);
      newElements.push(element.name);
      
      gsap.fromTo(elementDiv,
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.6,
          delay: index * 0.15,
          ease: "back.out(1.7)"
        }
      );
      
      // Scatter elements
      const angle = (index / elements.length) * Math.PI * 2;
      const distance = 150 + Math.random() * 100;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      gsap.to(elementDiv, {
        x: x,
        y: y,
        duration: 3,
        delay: index * 0.15,
        ease: "power2.out"
      });
      
      // Floating animation
      gsap.to(elementDiv, {
        x: `+=${(Math.random() - 0.5) * 50}`,
        y: `+=${(Math.random() - 0.5) * 50}`,
        duration: 4 + Math.random() * 3,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        delay: 3 + index * 0.15
      });
    });
    
    setElementsCreated(prev => [...prev, ...newElements]);
  };

  const createStellarRemnant = (starElement: HTMLDivElement, starData: Star) => {
    const remnant = document.createElement('div');
    const isBlackHole = starData.mass > 25;
    
    remnant.className = isBlackHole ? 'black-hole' : 'neutron-star';
    remnant.style.position = 'absolute';
    remnant.style.left = starElement.style.left;
    remnant.style.top = starElement.style.top;
    remnant.style.width = isBlackHole ? '40px' : '20px';
    remnant.style.height = remnant.style.width;
    remnant.style.borderRadius = '50%';
    remnant.style.zIndex = '15';
    
    if (isBlackHole) {
      remnant.style.background = 'radial-gradient(circle, #000 30%, #333 60%, transparent 100%)';
      remnant.style.border = '2px solid #666';
      remnant.style.boxShadow = '0 0 30px #000, inset 0 0 20px #000';
      
      // Add accretion disk
      const disk = document.createElement('div');
      disk.style.position = 'absolute';
      disk.style.width = '60px';
      disk.style.height = '60px';
      disk.style.border = '2px solid rgba(255, 107, 107, 0.6)';
      disk.style.borderRadius = '50%';
      disk.style.top = '50%';
      disk.style.left = '50%';
      disk.style.transform = 'translate(-50%, -50%)';
      remnant.appendChild(disk);
      
      gsap.to(disk, {
        rotation: 360,
        duration: 3,
        ease: "none",
        repeat: -1
      });
    } else {
      remnant.style.background = 'radial-gradient(circle, #fff, #ccc)';
      remnant.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
      
      // Pulsing animation for pulsar
      gsap.to(remnant, {
        opacity: 0.5,
        duration: 0.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });
    }
    
    visualRef.current?.appendChild(remnant);
    
    gsap.fromTo(remnant,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)" }
    );
  };

  return (
    <div className="section-content">
      <div className="section-visual" ref={visualRef}>
        {/* Status Panel */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0,0,0,0.8)',
          padding: '15px',
          borderRadius: '12px',
          color: '#fff',
          fontSize: '0.9rem',
          minWidth: '220px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ 
            color: '#ff6b6b', 
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
              background: '#ff6b6b',
              boxShadow: '0 0 8px #ff6b6b'
            }} />
            סופרנובות: {supernovaCount}
          </div>
          <div>יסודות כבדים שנוצרו: {elementsCreated.length}</div>
          {elementsCreated.length > 0 && (
            <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '8px' }}>
              {elementsCreated.slice(-3).join(', ')}
            </div>
          )}
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
          העבר עכבר על כוכב ללמוד עליו, לחץ להפעלת סופרנובה
        </div>

        {/* Elements Legend */}
        {elementsCreated.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0,0,0,0.8)',
            padding: '15px',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '0.8rem',
            maxWidth: '200px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ marginBottom: '8px', fontWeight: '600', color: '#4ecdc4' }}>
              יסודות שנוצרו
            </div>
            <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>
              הברזל שבדם שלך נוצר בלב כוכב שמת לפני מיליארדי שנים!
            </div>
          </div>
        )}
      </div>
      
      <div className="section-text">
        <div className="section-timeline">לפני 13.5 מיליארד שנה</div>
        <h2 className="section-title">הכוכבים הראשונים</h2>
        <p className="section-description">
          ענני הגז הראשונים קרסו תחת הכבידה שלהם, והתחממו עד שהתחיל בהם היתוך גרעיני - 
          כך נולדו הכוכבים הראשונים. הם היו ענקיים וחמים, ובערו במהירות רבה.
        </p>
        <p className="section-description">
          כשהכוכבים הגדולים מתים, הם מתפוצצים בסופרנובה - פיצוץ כה עוצמתי שהוא יוצר 
          יסודות כבדים כמו פחמן, חמצן וברזל. הברזל שבדם שלך נוצר בלב כוכב שמת לפני מיליארדי שנים!
        </p>
      </div>
    </div>
  );
};

export default FirstStars;