//src/components/TimeManagementNotes.tsx
"use client";

import React, { useState } from "react";
import styles from '@/styles/timeManage.module.css';

const TimeManagementNotes = () => {
  const [language, setLanguage] = useState<"hi" | "en">("hi");

  const t = {
    hi: {
      toggle: "Read in English",
      title: "टाइम मैनेजमेंट विद्यार्थियों के लिए (RBSE और CBSE)",
      what: "टाइम मैनेजमेंट क्या है?",
      whatDesc:
        "टाइम मैनेजमेंट का मतलब है अपने समय का सही उपयोग करना ताकि आप अपने लक्ष्य बिना तनाव के प्राप्त कर सकें। यह एक ऐसी स्किल है जो हर छात्र को सीखनी चाहिए।",
      importance: "टाइम मैनेजमेंट का महत्व",
      importancePoints: [
        "बेहतर शैक्षणिक प्रदर्शन",
        "परीक्षा के समय कम तनाव",
        "शौक के लिए अधिक समय",
        "जीवन में संतुलन",
      ],
      badHabits: "समय बर्बाद करने वाली आदतें",
      habitsList: [
        "काम टालना (Procrastination)",
        "बहुत ज्यादा सोचना (Overthinking)",
        "अनियमित नींद",
        "फोन / सोशल मीडिया का अत्यधिक उपयोग",
      ],
      tips: "समय प्रबंधन के लिए सुझाव",
      tipsList: [
        "रोज़ाना का टाइम टेबल बनाएं और उसका पालन करें",
        "SMART Goals सेट करें",
        "Distractions से दूर रहें",
        "एक समय पर एक काम करें (No multitasking)",
        "Pomodoro method अपनाएं (25 मिनट फोकस + 5 मिनट ब्रेक)",
      ],
      toppers: "टॉपर्स टाइम मैनेजमेंट कैसे करते हैं?",
      toppersList: [
        "सुबह जल्दी पढ़ाई करना",
        "हर चैप्टर के बाद रिवीजन",
        "साप्ताहिक मॉक टेस्ट",
        "संतुलित जीवन शैली और व्यायाम",
      ],
      sample: "विद्यार्थियों के लिए सैंपल टाइम टेबल",
      forClass: "कक्षा 10 और 12 के लिए:",
      timetableList: [
        "5:30 AM – उठना",
        "6:00 AM – रिवीजन (1 घंटा)",
        "8:00 AM – स्कूल",
        "3:00 PM – आराम / स्नैक्स",
        "4:00 PM – होमवर्क / अभ्यास",
        "6:00 PM – कॉन्सेप्ट स्टडी",
        "8:00 PM – डिनर",
        "9:00 PM – क्विक रिवीजन",
        "10:00 PM – सोना",
      ],
      tools: "टाइम मैनेजमेंट के लिए उपयोगी टूल्स",
      toolsList: [
        "Google Calendar / Notion",
        "Forest App",
        "To-Do लिस्ट नोटबुक",
        "Pomodoro Timer",
      ],
      self: "खुद से पूछे जाने वाले सवाल",
      selfList: [
        "क्या मैं हर दिन का प्लान बनाता हूँ?",
        "क्या मैं distractions से दूर रहता हूँ?",
        "क्या मैंने अपने goal को सही तरीके से सेट किया है?",
        "क्या मेरा study time वास्तव में productive है?",
      ],
      conclusion: "निष्कर्ष",
      conclusionText:
        "टाइम मैनेजमेंट एक पॉवरफुल हैबिट है जो न सिर्फ आपकी स्टडी में बल्कि आपके करियर और जीवन में भी मदद करेगी। आज से ही इसकी शुरुआत करें और खुद में बदलाव देखें!",
    },
    en: {
      toggle: "हिंदी में पढ़ें",
      title: "Time Management for Students (RBSE & CBSE)",
      what: "What is Time Management?",
      whatDesc:
        "Time management means using your time wisely to achieve your goals without stress. It is a skill every student should develop.",
      importance: "Importance of Time Management",
      importancePoints: [
        "Better Academic Performance",
        "Less Stress during Exams",
        "More Time for Hobbies",
        "Balance in Life",
      ],
      badHabits: "Common Time-Wasting Habits",
      habitsList: [
        "Procrastination (delaying work)",
        "Overthinking",
        "Irregular sleeping pattern",
        "Excessive phone or social media usage",
      ],
      tips: "Tips for Effective Time Management",
      tipsList: [
        "Create and follow a daily schedule",
        "Set SMART goals",
        "Avoid distractions",
        "Do one task at a time (No multitasking)",
        "Use Pomodoro method (25 min focus + 5 min break)",
      ],
      toppers: "How Toppers Manage Time",
      toppersList: [
        "Early morning study habit",
        "Revision after each chapter",
        "Weekly mock tests",
        "Balanced lifestyle and regular exercise",
      ],
      sample: "Sample Time Table for Students",
      forClass: "For Class 10 & 12:",
      timetableList: [
        "5:30 AM – Wake up",
        "6:00 AM – Revision (1 hour)",
        "8:00 AM – School",
        "3:00 PM – Rest / Snack",
        "4:00 PM – Homework / Practice",
        "6:00 PM – Concept Study",
        "8:00 PM – Dinner",
        "9:00 PM – Quick Revision",
        "10:00 PM – Sleep",
      ],
      tools: "Useful Tools for Time Management",
      toolsList: [
        "Google Calendar / Notion",
        "Forest App",
        "To-Do list notebooks",
        "Pomodoro Timer",
      ],
      self: "Self Evaluation Questions",
      selfList: [
        "Do I plan my day in advance?",
        "Do I stay away from distractions?",
        "Are my goals clear?",
        "Is my study time actually productive?",
      ],
      conclusion: "Conclusion",
      conclusionText:
        "Time management is a powerful habit that helps not just in studies but also in career and life. Start today and see the difference in yourself!",
    },
  };

  const content = t[language];

  return (
    <div className={styles['container']}>
      <div className={styles['language-toggle']}>
        <button
          onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
          className={styles['toggle-button']}
        >
          {content.toggle}
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
        <h2>{content.badHabits}</h2>
        <ul>
          {content.habitsList.map((item, i) => (
            <li key={i}>{item}</li>
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
        <h2>{content.toppers}</h2>
        <ul>
          {content.toppersList.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{content.sample}</h2>
        <p>{content.forClass}</p>
        <ul>
          {content.timetableList.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{content.tools}</h2>
        <ul>
          {content.toolsList.map((tool, i) => (
            <li key={i}>{tool}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{content.self}</h2>
        <ul>
          {content.selfList.map((q, i) => (
            <li key={i}>{q}</li>
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

export default TimeManagementNotes;
