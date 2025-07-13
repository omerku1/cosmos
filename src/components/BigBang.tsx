import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const BigBang: React.FC = () => {
  const visualRef = useRef<HTMLDivElement>(null);
  const explosionRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const [isTriggered, setIsTriggered] = useState(false);
  const [particleCount, setParticleCount] = useState(0);

  useEffect(() => {
    if (visualRef.current && explosionRef.current && particlesRef.current) {
      initializeScene();
      
      // Auto-trigger after a delay
      const timer = setTimeout(() => {
        if (!isTriggered) {
          triggerBigBang();
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isTriggered]);

  const initializeScene = () => {
    if (!explosionRef.current) return;

    // Set initial state
    gsap.set(explosionRef.current, { 
      scale: 0, 
      opacity: 1,
      background: 'radial-gradient(circle, #000, #000)'
    });

    // Add subtle pulsing before explosion
    gsap.to(explosionRef.current, {
      scale: 0.1,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });
  };

  const triggerBigBang = () => {
    if (isTriggered) return;
    setIsTriggered(true);

    const tl = gsap.timeline();
    
    // Stop the pulsing
    gsap.killTweensOf(explosionRef.current);
    
    // Big Bang sequence
    tl.to(explosionRef.current, {
      scale: 0.2,
      duration: 0.5,
      ease: "power2.in"
    })
    .to(explosionRef.current, {
      scale: 25,
      opacity: 1,
      duration: 2.5,
      ease: "power3.out",
      background: 'radial-gradient(circle, #ffffff 0%, #ffaa00 20%, #ff6b6b 40%, #4ecdc4 60%, #000 100%)'
    })
    .to(explosionRef.current, {
      background: 'radial-gradient(circle, #ff6b6b 0%, #4ecdc4 30%, #45b7d1 60%, #000 100%)',
      duration: 2,
      ease: "power2.inOut"
    }, "-=1.5")
    .call(() => createParticleExplosion(), null, "-=2")
    .to(explosionRef.current, {
      opacity: 0.3,
      duration: 3,
      ease: "power2.out"
    }, "-=1");

    // Create continuous particle generation
    createContinuousParticles();
  };

  const createParticleExplosion = () => {
    if (!particlesRef.current) return;

    const colors = ['#ffffff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    
    for (let i = 0; i < 100; i++) {
      const particle = document.createElement('div');
      particle.className = 'explosion-particle';
      particle.style.position = 'absolute';
      particle.style.left = '50%';
      particle.style.top = '50%';
      particle.style.width = `${2 + Math.random() * 4}px`;
      particle.style.height = particle.style.width;
      particle.style.borderRadius = '50%';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.boxShadow = `0 0 ${5 + Math.random() * 10}px currentColor`;
      particle.style.zIndex = '10';
      
      particlesRef.current.appendChild(particle);

      const angle = (Math.PI * 2 * i) / 100;
      const velocity = 200 + Math.random() * 400;
      const x = Math.cos(angle) * velocity;
      const y = Math.sin(angle) * velocity;

      gsap.to(particle, {
        x: x,
        y: y,
        duration: 3 + Math.random() * 2,
        ease: "power2.out",
        delay: Math.random() * 0.5,
        onComplete: () => {
          particle.remove();
        }
      });

      gsap.to(particle, {
        opacity: 0,
        scale: 0,
        duration: 2 + Math.random(),
        delay: 1 + Math.random(),
        ease: "power2.out"
      });
    }
  };

  const createContinuousParticles = () => {
    if (!particlesRef.current) return;

    const interval = setInterval(() => {
      if (particleCount > 200) {
        clearInterval(interval);
        return;
      }

      const particle = document.createElement('div');
      particle.className = 'atom-particle';
      particle.style.position = 'absolute';
      particle.style.left = `${20 + Math.random() * 60}%`;
      particle.style.top = `${20 + Math.random() * 60}%`;
      particle.style.width = `${3 + Math.random() * 6}px`;
      particle.style.height = particle.style.width;
      particle.style.borderRadius = '50%';
      particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
      particle.style.boxShadow = '0 0 8px currentColor';
      
      particlesRef.current?.appendChild(particle);
      setParticleCount(prev => prev + 1);

      // Floating animation
      gsap.to(particle, {
        x: `+=${(Math.random() - 0.5) * 200}`,
        y: `+=${(Math.random() - 0.5) * 200}`,
        duration: 5 + Math.random() * 5,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      });

      gsap.to(particle, {
        opacity: 0.3 + Math.random() * 0.7,
        duration: 2 + Math.random() * 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });

      // Remove after some time
      setTimeout(() => {
        if (particle.parentNode) {
          gsap.to(particle, {
            opacity: 0,
            scale: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
              particle.remove();
              setParticleCount(prev => prev - 1);
            }
          });
        }
      }, 10000 + Math.random() * 5000);
    }, 100);

    // Stop after 10 seconds
    setTimeout(() => clearInterval(interval), 10000);
  };

  return (
    <div className="section-content">
      <div className="section-visual" ref={visualRef}>
        <div 
          ref={explosionRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2
          }}
        />
        <div ref={particlesRef} className="particle-system" />
        
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10
          }}
        >
          <button 
            className="interactive-button"
            onClick={triggerBigBang}
            disabled={isTriggered}
          >
            {isTriggered ? 'המפץ התרחש!' : 'הפעל את המפץ הגדול'}
          </button>
        </div>

        {isTriggered && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: 'rgba(0,0,0,0.8)',
              padding: '15px',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '0.9rem',
              maxWidth: '250px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <div style={{ color: '#4ecdc4', fontWeight: '600', marginBottom: '8px' }}>
              מצב היקום
            </div>
            <div>טמפרטורה: אינסופית</div>
            <div>צפיפות: אינסופית</div>
            <div>גודל: נקודה</div>
            <div style={{ marginTop: '8px', fontSize: '0.8rem', opacity: 0.8 }}>
              חלקיקים פעילים: {particleCount}
            </div>
          </div>
        )}
      </div>
      
      <div className="section-text">
        <div className="section-timeline">לפני 13.8 מיליארד שנה</div>
        <h2 className="section-title">המפץ הגדול</h2>
        <p className="section-description">
          היקום כולו התחיל מנקודה אחת קטנה וצפופה במיוחד - סינגולריות. ברגע אחד, 
          הכל התפוצץ החוצה במהירות מדהימה, יוצר חלל, זמן, ואת כל החומר והאנרגיה 
          שיהפכו לכוכבים, גלקסיות וכדור הארץ.
        </p>
        <p className="section-description">
          בשברי השנייה הראשונים, הטמפרטורה הייתה חמה יותר ממרכז השמש פי מיליארד מיליארד. 
          זהו הרגע שבו הכל התחיל - הסיפור הגדול של היקום שלנו, שממשיך להתרחב עד היום.
        </p>
      </div>
    </div>
  );
};

export default BigBang;