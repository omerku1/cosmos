import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const MoonFormation: React.FC = () => {
  const visualRef = useRef<HTMLDivElement>(null);
  const earthRef = useRef<HTMLDivElement>(null);
  const theiaRef = useRef<HTMLDivElement>(null);
  const debrisRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);
  const [impactTriggered, setImpactTriggered] = React.useState(false);

  useEffect(() => {
    if (visualRef.current) {
      createInitialState();
    }
  }, []);

  const createInitialState = () => {
    if (!earthRef.current || !theiaRef.current) return;

    // Position Earth
    gsap.set(earthRef.current, {
      left: '40%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    });

    // Position Theia
    gsap.set(theiaRef.current, {
      left: '80%',
      top: '30%',
      transform: 'translate(-50%, -50%)'
    });

    // Animate Theia's approach
    gsap.to(theiaRef.current, {
      rotation: 360,
      duration: 3,
      ease: "none",
      repeat: -1
    });
  };

  const triggerImpact = () => {
    if (impactTriggered) return;
    setImpactTriggered(true);

    const tl = gsap.timeline();

    // Theia approaches Earth
    tl.to(theiaRef.current, {
      left: '40%',
      top: '50%',
      duration: 2,
      ease: "power2.in"
    })
    // Impact flash
    .to(visualRef.current, {
      background: 'radial-gradient(circle, #fff 0%, #ff6b6b 30%, #000 70%)',
      duration: 0.3,
      ease: "power2.out"
    })
    .to(visualRef.current, {
      background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
      duration: 0.5,
      ease: "power2.in"
    })
    // Hide Theia
    .to(theiaRef.current, {
      opacity: 0,
      scale: 0,
      duration: 0.5
    }, "-=0.5")
    // Create debris
    .call(() => createDebris())
    // Show debris animation
    .to(debrisRef.current, {
      opacity: 1,
      duration: 1
    })
    // Form the moon
    .call(() => formMoon(), null, "+=2");
  };

  const createDebris = () => {
    if (!debrisRef.current) return;

    for (let i = 0; i < 30; i++) {
      const debris = document.createElement('div');
      debris.className = 'debris-particle';
      debris.style.position = 'absolute';
      debris.style.left = '40%';
      debris.style.top = '50%';
      debris.style.width = `${5 + Math.random() * 10}px`;
      debris.style.height = debris.style.width;
      debris.style.borderRadius = '50%';
      debris.style.background = i % 2 === 0 ? '#ff6b6b' : '#4ecdc4';
      debris.style.boxShadow = `0 0 10px ${i % 2 === 0 ? '#ff6b6b' : '#4ecdc4'}`;
      
      debrisRef.current.appendChild(debris);

      // Animate debris
      gsap.to(debris, {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
        duration: 2 + Math.random() * 2,
        ease: "power2.out",
        delay: Math.random() * 0.5
      });
    }
  };

  const formMoon = () => {
    if (!moonRef.current) return;

    gsap.set(moonRef.current, {
      left: '65%',
      top: '30%',
      transform: 'translate(-50%, -50%)',
      opacity: 0,
      scale: 0
    });

    gsap.to(moonRef.current, {
      opacity: 1,
      scale: 1,
      duration: 2,
      ease: "back.out(1.7)"
    });

    // Orbital animation
    gsap.to(moonRef.current, {
      rotation: 360,
      duration: 8,
      ease: "none",
      repeat: -1
    });
  };

  return (
    <div className="section-content">
      <div className="section-visual" ref={visualRef}>
        {/* Earth */}
        <div 
          ref={earthRef}
          style={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #4a90e2, #2c5aa0)',
            border: '2px solid #fff',
            boxShadow: '0 0 20px rgba(74, 144, 226, 0.6)'
          }}
        />
        
        {/* Theia */}
        <div 
          ref={theiaRef}
          style={{
            position: 'absolute',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ff6b6b, #cc5449)',
            border: '2px solid #fff',
            boxShadow: '0 0 15px rgba(255, 107, 107, 0.6)'
          }}
        />
        
        {/* Debris */}
        <div ref={debrisRef} style={{ opacity: 0 }} />
        
        {/* Moon */}
        <div 
          ref={moonRef}
          style={{
            position: 'absolute',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ddd, #999)',
            border: '1px solid #fff',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.4)'
          }}
        />
        
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10
        }}>
          <button 
            className="interactive-button"
            onClick={triggerImpact}
            disabled={impactTriggered}
          >
            {impactTriggered ? 'הירח נוצר!' : 'הפעל את ההתנגשות'}
          </button>
        </div>
      </div>
      
      <div className="section-text">
        <div className="section-timeline">לפני 4.5 מיליארד שנה</div>
        <h2 className="section-title">יצירת הירח</h2>
        <p className="section-description">
          גוף בגודל מאדים בשם "תיאה" התנגש בכדור הארץ הצעיר בעוצמה מדהימה. 
          ההתנגשות הייתה כה חזקה שחלקים מכדור הארץ נזרקו לחלל.
        </p>
        <p className="section-description">
          הריסות מההתנגשות יצרו טבעת סביב כדור הארץ, שהתגבשה לאחר מכן לירח. 
          זו הסיבה שהירח מכיל חומרים דומים לכדור הארץ, והוא השפיע על האקלים והחיים כאן.
        </p>
      </div>
    </div>
  );
};

export default MoonFormation;