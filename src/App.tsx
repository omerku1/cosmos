import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BigBang from './components/BigBang';
import FirstAtoms from './components/FirstAtoms';
import FirstStars from './components/FirstStars';
import Galaxies from './components/Galaxies';
import SolarSystem from './components/SolarSystem';
import MoonFormation from './components/MoonFormation';
import LifeEvolution from './components/LifeEvolution';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize scroll-based animations
    const sections = gsap.utils.toArray('.timeline-section');
    
    sections.forEach((section: any, index) => {
      gsap.fromTo(section, 
        { 
          opacity: 0,
          y: 100,
          scale: 0.9
        }, 
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            onEnter: () => {
              // Update progress bar
              if (progressRef.current) {
                const progress = ((index + 1) / sections.length) * 100;
                gsap.to(progressRef.current, {
                  width: `${progress}%`,
                  duration: 0.5,
                  ease: "power2.out"
                });
              }
            }
          }
        }
      );
    });

    // Add parallax effect to background
    gsap.to('.cosmic-bg', {
      backgroundPositionY: '-30%',
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // Animate header on scroll
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        const opacity = 1 - self.progress;
        gsap.to('.cosmic-header', {
          opacity: Math.max(0.3, opacity),
          duration: 0.1
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="cosmic-container">
      <div className="cosmic-bg"></div>
      
      {/* Header Navigation */}
      <header className="cosmic-header">
        <h1 className="cosmic-title">ציר הזמן הקוסמי</h1>
        <p className="cosmic-subtitle">מסע בזמן מהמפץ הגדול ועד תולדות החיים</p>
      </header>

      {/* Timeline Progress */}
      <div className="timeline-progress">
        <div ref={progressRef} className="progress-bar"></div>
      </div>

      {/* Timeline Sections */}
      <main className="timeline-main">
        <section className="timeline-section" id="big-bang">
          <BigBang />
        </section>

        <section className="timeline-section" id="first-atoms">
          <FirstAtoms />
        </section>

        <section className="timeline-section" id="first-stars">
          <FirstStars />
        </section>

        <section className="timeline-section" id="galaxies">
          <Galaxies />
        </section>

        <section className="timeline-section" id="solar-system">
          <SolarSystem />
        </section>

        <section className="timeline-section" id="moon-formation">
          <MoonFormation />
        </section>

        <section className="timeline-section" id="life-evolution">
          <LifeEvolution />
        </section>
      </main>

      {/* Footer */}
      <footer className="cosmic-footer">
        <p>מסע בזמן אל הסיפור הגדול של היקום שלנו</p>
        <p style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.7 }}>
          גלל למעלה כדי לחוות את המסע שוב
        </p>
      </footer>
    </div>
  );
}

export default App;