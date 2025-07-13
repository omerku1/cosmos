import React, { useEffect, useRef, useState } from 'react';

interface TimelineNavigationProps {
  currentSection: number;
  totalSections: number;
  onSectionChange: (section: number) => void;
  sectionTitles: string[];
}

const TimelineNavigation: React.FC<TimelineNavigationProps> = ({
  currentSection,
  totalSections,
  onSectionChange,
  sectionTitles
}) => {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressRef.current) {
      const progress = ((currentSection + 1) / totalSections) * 100;
      progressRef.current.style.width = `${progress}%`;
    }
  }, [currentSection, totalSections]);

  const handleMarkerClick = (index: number) => {
    onSectionChange(index);
    
    const section = document.getElementById(`section-${index}`);
    if (section) {
      section.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  return (
    <nav className="timeline-nav">
      <h1 className="nav-title">ציר הזמן הקוסמי</h1>
      
      <div className="timeline-progress-container">
        <div className="timeline-track">
          <div 
            ref={progressRef}
            className="timeline-progress"
          />
        </div>
        
        <div className="timeline-markers">
          {Array.from({ length: totalSections }, (_, index) => (
            <div
              key={index}
              className={`timeline-marker ${
                index === currentSection ? 'active' : 
                index < currentSection ? 'completed' : ''
              }`}
              onClick={() => handleMarkerClick(index)}
            >
              <div className="marker-tooltip">
                {sectionTitles[index]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default TimelineNavigation;