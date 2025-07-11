import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const BigBang: React.FC = () => {
  const visualRef = useRef<HTMLDivElement>(null);
  const explosionRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const [isTriggered, setIsTriggered] = React.useState(false);

  useEffect(() => {
    if (visualRef.current && explosionRef.current && particlesRef.current) {
      // Initial dark state
      gsap.set(explosionRef.current, { scale: 0, opacity: 0 });
      gsap.set(particlesRef.current, { opacity: 0 });

      // Auto-trigger animation when component mounts
      const timer = setTimeout(() => {
        triggerBigBang();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const triggerBigBang = () => {
    if (isTriggered) return;
    setIsTriggered(true);

    const tl = gsap.timeline();
    
    // Big Bang explosion
    tl.to(explosionRef.current, {
      scale: 20,
      opacity: 1,
      duration: 2,
      ease: "power2.out",
      backgroundColor: "#ffffff"
    })
    .to(explosionRef.current, {
      backgroundColor: "#ff6b6b",
      duration: 1,
      ease: "power2.inOut"
    }, "-=1")
    .to(explosionRef.current, {
      backgroundColor: "#4ecdc4",
      duration: 1,
      ease: "power2.inOut"
    }, "-=0.5")
    .to(particlesRef.current, {
      opacity: 1,
      duration: 2,
      ease: "power2.out"
    }, "-=2");

    // Create particle animation
    createParticles();
  };

  const createParticles = () => {
    if (!particlesRef.current) return;

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = '50%';
      particle.style.top = '50%';
      particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
      particlesRef.current.appendChild(particle);

      gsap.to(particle, {
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 800,
        duration: 3 + Math.random() * 2,
        ease: "power2.out",
        delay: Math.random() * 0.5,
        onComplete: () => {
          particle.remove();
        }
      });
    }
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
            background: '#000',
            transform: 'translate(-50%, -50%)',
            zIndex: 2
          }}
        />
        <div ref={particlesRef} className="particle-system" />
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
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
      </div>
      
      <div className="section-text">
        <div className="section-timeline">לפני 13.8 מיליארד שנה</div>
        <h2 className="section-title">המפץ הגדול</h2>
        <p className="section-description">
          היקום כולו התחיל מנקודה אחת קטנה וצפופה במיוחד. ברגע אחד, הכל התפוצץ החוצה 
          במהירות מדהימה, יוצר חלל, זמן, ואת כל החומר שיהפוך לכוכבים, גלקסיות וכדור הארץ.
        </p>
        <p className="section-description">
          בשניות הראשונות, הטמפרטורה הייתה חמה יותר ממרכז השמש פי מיליארד. 
          זהו הרגע שבו הכל התחיל - הסיפור הגדול של היקום שלנו.
        </p>
      </div>
    </div>
  );
};

export default BigBang;