"use client";

import React, { useState } from "react";
import styles from '@/styles/timeManage.module.css';


const StudyPlanNotes = () => {
    const [language, setLanguage] = useState<"hi" | "en">("hi");

    const t = { hi: { toggle: "Read in English", title: "स्टडी प्लान कैसे बनाएं? (RBSE और CBSE छात्रों के लिए)", what: "स्टडी प्लान क्या होता है?", whatDesc: "स्टडी प्लान एक ऐसा टाइम टेबल होता है जो आपकी पढ़ाई को सही दिशा देता है। इसमें तय होता है कि आपको कौन-से विषय को कब और कितनी देर पढ़ना है।", importance: "स्टडी प्लान क्यों ज़रूरी है?", importancePoints: ["सभी विषयों में संतुलन बनाए रखता है", "पढ़ाई में फोकस बढ़ाता है", "Exam time में तनाव कम होता है", "Revision और practice के लिए समय बचता है",], types: "स्टडी प्लान के प्रकार", typesList: ["Daily Study Plan", "Weekly Study Plan", "Monthly Study Plan", "Exam-Focused Study Plan",], how: "अपना स्टडी प्लान कैसे बनाएं?", steps: ["अपने syllabus को समझें और break करें", "हर subject को time दें – कमजोर विषयों को ज्यादा", "Daily fixed hours decide करें", "Breaks भी include करें", "Revision के लिए extra slots रखें", "हर Sunday को weekly review करें",], samples: "Class-Wise सैंपल स्टडी प्लान", class10: "कक्षा 10वीं (Board Exam Focus)", class12: "कक्षा 12वीं Science Stream:", classPlan: ["5:30 AM – उठना", "6:00 – Science revision", "7:30 – Math practice", "8:30 – School", "3:00 – आराम / नाश्ता", "4:00 – Social Science", "6:00 – English Grammar", "8:00 – Dinner", "9:00 – Revision", "10:00 – सोना",], tips: "स्टडी प्लान के लिए अतिरिक्त सुझाव", tipsList: ["To-Do लिस्ट बनाएं", "Visual Chart / Calendar का उपयोग करें", "Morning में difficult subject पढ़ें", "Night में revision रखें",], conclusion: "निष्कर्ष", conclusionText: "एक प्रभावशाली स्टडी प्लान आपकी सफलता की कुंजी है। इसे नियमित रूप से follow करें और ज़रूरत के अनुसार update करते रहें।", }, en: { toggle: "हिंदी में पढ़ें", title: "How to Create a Study Plan? (For RBSE & CBSE Students)", what: "What is a Study Plan?", whatDesc: "A study plan is a timetable that gives direction to your preparation. It helps you decide what to study, when, and for how long.", importance: "Why is a Study Plan Important?", importancePoints: ["Keeps balance between all subjects", "Improves focus", "Reduces exam-time stress", "Ensures time for revision and practice",], types: "Types of Study Plans", typesList: ["Daily Study Plan", "Weekly Study Plan", "Monthly Study Plan", "Exam-Focused Study Plan",], how: "How to Make Your Own Study Plan?", steps: ["Understand your syllabus and break it down", "Allocate time for each subject – more time for weak ones", "Fix daily hours", "Include short breaks", "Keep extra time for revision", "Do a weekly review every Sunday",], samples: "Class-Wise Sample Study Plan", class10: "Class 10th (Board Exam Focus)", class12: "Class 12th Science Stream:", classPlan: ["5:30 AM – Wake up", "6:00 – Science revision", "7:30 – Math practice", "8:30 – School", "3:00 – Rest / Snack", "4:00 – Social Science", "6:00 – English Grammar", "8:00 – Dinner", "9:00 – Revision", "10:00 – Sleep",], tips: "Extra Tips for Effective Study Plan", tipsList: ["Maintain a daily to-do list", "Use visual charts or calendars", "Study tough subjects in the morning", "Do revision at night",], conclusion: "Conclusion", conclusionText: "A strong study plan is key to success. Follow it consistently and keep updating it as per your needs.", }, };

    const content = t[language];

    return (

        <div className={styles['container'] }>
            <div className={styles['language-toggle'] }>
                <button onClick={() => setLanguage(language === "hi" ? "en" : "hi")} 
                 className={styles['toggle-button'] }> {content.toggle} 
                 </button>
            </div>

            <h1>{content.title}</h1>

            <section>
                <h2>{content.what}</h2>
                <p>{content.whatDesc}</p>
            </section>

            <section>
                <h2>{content.importance}</h2>
                <ul>
                    {content.importancePoints.map((point, i) => (
                        <li key={i}>{point}</li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>{content.types}</h2>
                <ul>
                    {content.typesList.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>{content.how}</h2>
                <ul>
                    {content.steps.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>{content.samples}</h2>
                <p>{content.class10}</p>
                <ul>
                    {content.classPlan.map((line, i) => (
                        <li key={i}>{line}</li>
                    ))}
                </ul>
                <p>{content.class12}</p>
                <ul>
                    {content.classPlan.map((line, i) => (
                        <li key={i}>{line}</li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>{content.tips}</h2>
                <ul>
                    {content.tipsList.map((tip, i) => (
                        <li key={i}>{tip}</li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>{content.conclusion}</h2>
                <p>{content.conclusionText}</p>
            </section>
        </div>

    );
};

export default StudyPlanNotes;