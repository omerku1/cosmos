import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const FirstStars: React.FC = () => {
  const visualRef = useRef<HTMLDivElement>(null);
  const [supernovaTriggered, setSupernovaTriggered] = React.useState(false);

  useEffect(() => {
    if (visualRef.current) {
      createStars();
    }
  }, []);

  const createStars = () => {
    if (!visualRef.current) return;

    // Create multiple stars
    for (let i = 0; i < 8; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.position = 'absolute';
      star.style.left = `${Math.random() * 80 + 10}%`;
      star.style.top = `${Math.random() * 80 + 10}%`;
      star.style.width = `${15 + Math.random() * 20}px`;
      star.style.height = star.style.width;
      star.style.borderRadius = '50%';
      star.style.background = `radial-gradient(circle, #fff, #${Math.random() > 0.5 ? 'ff6b6b' : '4ecdc4'})`;
      star.style.cursor = 'pointer';
      star.style.boxShadow = `0 0 ${10 + Math.random() * 20}px rgba(255, 255, 255, 0.8)`;
      star.style.animation = `star-pulse ${2 + Math.random() * 3}s ease-in-out infinite alternate`;
      
      if (i === 0) {
        // Make the first star the supernova candidate
        star.style.background = 'radial-gradient(circle, #ff6b6b, #ff4757)';
        star.style.width = '30px';
        star.style.height = '30px';
        star.style.boxShadow = '0 0 30px rgba(255, 107, 107, 0.9)';
        star.addEventListener('click', () => triggerSupernova(star));
      }
      
      visualRef.current.appendChild(star);
    }
  };

  const triggerSupernova = (star: HTMLElement) => {
    if (supernovaTriggered) return;
    setSupernovaTriggered(true);

    const tl = gsap.timeline();
    
    // Supernova explosion
    tl.to(star, {
      scale: 20,
      opacity: 0.3,
      duration: 2,
      ease: "power2.out",
      background: "radial-gradient(circle, #fff, #ff6b6b)"
    })
    .to(star, {
      scale: 1,
      opacity: 0,
      duration: 1,
      ease: "power2.in"
    })
    .call(() => {
      // Create heavy elements
      createHeavyElements(star);
    });
  };

  const createHeavyElements = (starElement: HTMLElement) => {
    const elements = ['C', 'O', 'Fe', 'Si', 'Mg', 'Ca'];
    const colors = ['#4ecdc4', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
    
    elements.forEach((element, index) => {
      const elementDiv = document.createElement('div');
      elementDiv.style.position = 'absolute';
      elementDiv.style.left = starElement.style.left;
      elementDiv.style.top = starElement.style.top;
      elementDiv.style.width = '25px';
      elementDiv.style.height = '25px';
      elementDiv.style.borderRadius = '50%';
      elementDiv.style.background = colors[index];
      elementDiv.style.color = '#fff';
      elementDiv.style.display = 'flex';
      elementDiv.style.alignItems = 'center';
      elementDiv.style.justifyContent = 'center';
      elementDiv.style.fontSize = '12px';
      elementDiv.style.fontWeight = 'bold';
      elementDiv.style.boxShadow = `0 0 15px ${colors[index]}`;
      elementDiv.textContent = element;
      
      visualRef.current?.appendChild(elementDiv);
      
      gsap.fromTo(elementDiv,
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.5,
          delay: index * 0.1,
          ease: "back.out(1.7)"
        }
      );
      
      gsap.to(elementDiv, {
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 300,
        duration: 3,
        delay: index * 0.1,
        ease: "power2.out"
      });
    });
  };

  return (
    <div className="section-content">
      <div className="section-visual" ref={visualRef}>
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          color: '#fff',
          fontSize: '0.8rem'
        }}>
          {!supernovaTriggered ? 'לחץ על הכוכב הגדול להפעלת סופרנובה' : 'יסודות כבדים נוצרו!'}
        </div>
      </div>
      
      <div className="section-text">
        <div className="section-timeline">לפני 13.5 מיליארד שנה</div>
        <h2 className="section-title">הכוכבים הראשונים</h2>
        <p className="section-description">
          ענני הגז הראשונים קרסו תחת הכבידה שלהם, והתחממו עד שהתחיל בהם היתוך גרעיני - 
          כך נולדו הכוכבים הראשונים. הם היו ענקיים וחמים, ובערו במהירות.
        </p>
        <p className="section-description">
          כשהכוכבים הגדולים מתים, הם מתפוצצים בסופרנובה - פיצוץ כה עוצמתי שהוא יוצר 
          יסודות כבדים כמו פחמן, חמצן וברזל. הברזל שבדם שלך נוצר בלב כוכב שמת!
        </p>
      </div>
    </div>
  );
};

export default FirstStars;