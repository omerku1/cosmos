import React, { useEffect, useState } from 'react';
import TimelineNavigation from './components/TimelineNavigation';
import './App.css';

function App() {
  const [currentSection, setCurrentSection] = useState(0);

  const sectionTitles = [
    'המפץ הגדול',
    'האטומים הראשונים', 
    'הכוכבים הראשונים',
    'לידת הגלקסיות',
    'מערכת השמש',
    'יצירת הירח',
    'תולדות החיים'
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.timeline-section');
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setCurrentSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionChange = (sectionIndex: number) => {
    setCurrentSection(sectionIndex);
  };

  return (
    <div className="cosmic-container">
      <div className="cosmic-bg"></div>
      
      <TimelineNavigation
        currentSection={currentSection}
        totalSections={sectionTitles.length}
        onSectionChange={handleSectionChange}
        sectionTitles={sectionTitles}
      />

      <header className="cosmic-header">
        <h1 className="cosmic-title">ציר הזמן הקוסמי</h1>
        <p className="cosmic-subtitle">
          מסע בזמן מהמפץ הגדול ועד תולדות החיים • הסיפור המדהים של היקום שלנו
        </p>
      </header>

      <main className="timeline-main">
        {/* שלב 1: המפץ הגדול */}
        <section className="timeline-section" id="section-0">
          <div className="section-content">
            <div className="section-visual">
              💥
            </div>
            
            <div className="section-text">
              <div className="section-timeline">לפני 13.8 מיליארד שנה</div>
              <h2 className="section-title">המפץ הגדול</h2>
              <p className="section-description">
                היקום כולו התחיל מנקודה אחת קטנה וצפופה במיוחד - סינגולריות. ברגע אחד, 
                הכל התפוצץ החוצה במהירות מדהימה, יוצר חלל, זמן, ואת כל החומר והאנרגיה.
              </p>
              
              <div className="amazing-fact">
                <h3>🤯 עובדה מדהימה</h3>
                <p>
                  בשנייה הראשונה אחרי המפץ הגדול, היקום התרחב יותר מאשר בכל 13.8 מיליארד השנים שאחרי כן! 
                  הטמפרטורה הייתה <span className="fact-highlight">טריליון מעלות</span> - חמה יותר ממרכז השמש פי מיליארד.
                </p>
              </div>

              <p className="section-description">
                זהו הרגע שבו הכל התחיל - הסיפור הגדול של היקום שלנו, שממשיך להתרחב עד היום.
                כל מה שאתה רואה סביבך - הכוכבים, הגלקסיות, כדור הארץ ואפילו אתה - הכל התחיל כאן.
              </p>
            </div>
          </div>
        </section>

        {/* שלב 2: האטומים הראשונים */}
        <section className="timeline-section" id="section-1">
          <div className="section-content">
            <div className="section-visual">
              ⚛️
            </div>
            
            <div className="section-text">
              <div className="section-timeline">לפני 13.8 מיליארד שנה - 380,000 שנה</div>
              <h2 className="section-title">האטומים הראשונים</h2>
              <p className="section-description">
                ליקום לקח 380,000 שנה להתקרר מספיק כדי שהחלקיקים יוכלו להתחבר ליצירת 
                האטומים הראשונים - בעיקר מימן והליום.
              </p>
              
              <div className="amazing-fact">
                <h3>✨ הרגע הגדול</h3>
                <p>
                  זה היה הרגע שבו היקום הפך <span className="fact-highlight">שקוף לראשונה</span>! 
                  לפני כן, היקום היה מלא באור בלבד - חם מדי בשביל אטומים יציבים. 
                  עכשיו, בפעם הראשונה, אור יכול לנסוע בחופשיות ביקום.
                </p>
              </div>

              <p className="section-description">
                זהו האור שאנחנו עדיין רואים היום כקרינת הרקע הקוסמית - הד עדין של המפץ הגדול 
                שמגיע אלינו מכל כיוון בחלל. זה כמו לשמוע את הד הראשון של היקום!
              </p>
            </div>
          </div>
        </section>

        {/* שלב 3: הכוכבים הראשונים */}
        <section className="timeline-section" id="section-2">
          <div className="section-content">
            <div className="section-visual">
              ⭐
            </div>
            
            <div className="section-text">
              <div className="section-timeline">לפני 13.5 מיליארד שנה</div>
              <h2 className="section-title">הכוכבים הראשונים</h2>
              <p className="section-description">
                ענני הגז הראשונים קרסו תחת הכבידה שלהם, והתחממו עד שהתחיל בהם היתוך גרעיני - 
                כך נולדו הכוכבים הראשונים. הם היו ענקיים וחמים, ובערו במהירות רבה.
              </p>
              
              <div className="amazing-fact">
                <h3>🌟 אתה עשוי מאבק כוכבים</h3>
                <p>
                  <span className="fact-highlight">כל אטום בגוף שלך נוצר בלב כוכב או במפץ הגדול</span>! 
                  הברזל שבדם שלך, הסידן בעצמות שלך, החמצן שאתה נושם - הכל נוצר בלב כוכב שמת לפני מיליארדי שנים 
                  והתפוצץ בסופרנובה מדהימה.
                </p>
              </div>

              <p className="section-description">
                כשהכוכבים הגדולים מתים, הם מתפוצצים בסופרנובה - פיצוץ כה עוצמתי שהוא יוצר 
                יסודות כבדים כמו פחמן, חמצן וברזל ומפזר אותם לחלל. בלעדי הכוכבים האלה, 
                לא היו יכולים להיות כוכבי לכת, אוקיינוסים או חיים.
              </p>
            </div>
          </div>
        </section>

        {/* שלב 4: לידת הגלקסיות */}
        <section className="timeline-section" id="section-3">
          <div className="section-content">
            <div className="section-visual">
              🌌
            </div>
            
            <div className="section-text">
              <div className="section-timeline">לפני 13 מיליארד שנה</div>
              <h2 className="section-title">לידת הגלקסיות</h2>
              <p className="section-description">
                כוכבים החלו להתקבץ יחד בקבוצות עצומות שנקראות גלקסיות. הגלקסיות הראשונות 
                היו קטנות יותר ולא סדורות כמו הגלקסיות שאנחנו רואים היום.
              </p>
              
              <div className="amazing-fact">
                <h3>🌠 שביל החלב - הבית שלנו</h3>
                <p>
                  הגלקסיה שלנו, שביל החלב, מכילה <span className="fact-highlight">יותר מ-100 מיליארד כוכבים</span>! 
                  היא נוצרה כשגלקסיות קטנות יותר התמזגו יחד לאורך מיליארדי שנים. 
                  אם תוכל לנסוע במהירות האור, ייקח לך 100,000 שנה לחצות אותה!
                </p>
              </div>

              <p className="section-description">
                הגלקסיות ממשיכות לגדול ולהתמזג עד היום. בעוד כ-4.5 מיליארד שנה, 
                שביל החלב יתמזג עם גלקסיית אנדרומדה השכנה ויצור גלקסיה ענקית חדשה!
              </p>
            </div>
          </div>
        </section>

        {/* שלב 5: מערכת השמש */}
        <section className="timeline-section" id="section-4">
          <div className="section-content">
            <div className="section-visual">
              ☀️
            </div>
            
            <div className="section-text">
              <div className="section-timeline">לפני 4.6 מיליארד שנה</div>
              <h2 className="section-title">מערכת השמש</h2>
              <p className="section-description">
                מענן עצום של גז ואבק, השמש שלנו נולדה במרכז, וכוכבי הלכת נוצרו מהחומרים 
                שנותרו. הכוכבים הפנימיים עשויים מסלע, והחיצוניים מגז.
              </p>
              
              <div className="amazing-fact">
                <h3>🌍 אזור גולדילוקס</h3>
                <p>
                  כדור הארץ נוצר בדיוק במרחק הנכון מהשמש - <span className="fact-highlight">לא חם מדי ולא קר מדי</span>. 
                  זה נקרא "אזור גולדילוקס" - המקום המושלם לחיים! אם היינו קרובים יותר לשמש כמו נוגה, 
                  המים היו מתאדים. אם היינו רחוקים יותר כמו מאדים, הם היו קופאים.
                </p>
              </div>

              <p className="section-description">
                השמש שלנו היא כוכב ממוצע - לא גדול מדי ולא קטן מדי. היא בוערת בצורה יציבה כבר 
                4.6 מיליארד שנה, ותמשיך לבעור עוד 5 מיליארד שנה. זה נתן לחיים על כדור הארץ 
                את הזמן להתפתח ולהתמורר.
              </p>
            </div>
          </div>
        </section>

        {/* שלב 6: יצירת הירח */}
        <section className="timeline-section" id="section-5">
          <div className="section-content">
            <div className="section-visual">
              🌙
            </div>
            
            <div className="section-text">
              <div className="section-timeline">לפני 4.5 מיליארד שנה</div>
              <h2 className="section-title">יצירת הירח</h2>
              <p className="section-description">
                גוף בגודל מאדים בשם "תיאה" התנגש בכדור הארץ הצעיר בעוצמה מדהימה. 
                ההתנגשות הייתה כה חזקה שחלקים מכדור הארץ נזרקו לחלל.
              </p>
              
              <div className="amazing-fact">
                <h3>🌕 הירח - השומר שלנו</h3>
                <p>
                  הירח לא רק נותן לנו אור בלילה - <span className="fact-highlight">הוא מייצב את כדור הארץ</span>! 
                  בלעדיו, כדור הארץ היה מתנדנד בפראות, מה שהיה יוצר שינויי אקלים קיצוניים. 
                  הירח גם יוצר את הגאות והשפל, שעזרו לחיים הראשונים לעבור מהים ליבשה.
                </p>
              </div>

              <p className="section-description">
                הריסות מההתנגשות יצרו טבעת סביב כדור הארץ, שהתגבשה לאחר מכן לירח. 
                זו הסיבה שהירח מכיל חומרים דומים לכדור הארץ. התנגשות אדירה אחת 
                שינתה את הלילות שלנו לנצח!
              </p>
            </div>
          </div>
        </section>

        {/* שלב 7: תולדות החיים */}
        <section className="timeline-section" id="section-6">
          <div className="section-content">
            <div className="section-visual">
              🧬
            </div>
            
            <div className="section-text">
              <div className="section-timeline">לפני 3.8 מיליארד שנה</div>
              <h2 className="section-title">תולדות החיים</h2>
              <p className="section-description">
                החיים התחילו באוקיינוסים הקדומים כתאים פשוטים מאוד. במשך מיליארדי שנים, 
                הם למדו לעבוד יחד, ליצור תאים מורכבים יותר, ולבסוף יצורים רב-תאיים.
              </p>
              
              <div className="amazing-fact">
                <h3>🦠 המהפכה הגדולה</h3>
                <p>
                  לפני 2.4 מיליארד שנה, חיידקים קטנים למדו לעשות פוטוסינתזה ו<span className="fact-highlight">יצרו את החמצן שאנחנו נושמים</span>! 
                  זה היה כמעט קטסטרופה - החמצן היה רעיל לרוב החיים דאז. אבל החיים הסתגלו, 
                  ועכשיו אנחנו תלויים בחמצן הזה כדי לחיות.
                </p>
              </div>

              <p className="section-description">
                זהו הבסיס לכל החיים על כדור הארץ היום - מהחיידק הקטן ביותר ועד הווייתן הכחול. 
                כולנו חולקים את אותם אבני הבניין הבסיסיות. אתה קשור לכל יצור חי על פני כדור הארץ 
                דרך שושלת אבות משותפת שמתחילה בתא פשוט באוקיינוס קדום.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="cosmic-footer">
        <p>מסע בזמן אל הסיפור הגדול של היקום שלנו</p>
        <p style={{ 
          marginTop: '15px', 
          fontSize: '1rem', 
          opacity: 0.8,
          fontWeight: '300'
        }}>
          מהמפץ הגדול לפני 13.8 מיליארד שנה ועד החיים המורכבים על כדור הארץ
        </p>
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)',
          maxWidth: '600px',
          margin: '20px auto 0'
        }}>
          <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            כל אטום בגוף שלך נוצר בלב כוכב או במפץ הגדול. 
            אתה ממש עשוי מאבק כוכבים ⭐
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;