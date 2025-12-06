// Static GK topics & subtopics used by the frontend.
// The backend will only store sub-subtopics (detailed HTML content).

export type GKSubtopic = {
  title: string;
  slug: string;
};

export type GKTopic = {
  title: string;
  slug: string;
  subtopics: GKSubtopic[];
};

const gkData: GKTopic[] = [
  {
    title: 'Current Affairs',
    slug: 'current-affairs',
    subtopics: [
      { title: 'राष्ट्रीय घटनाएँ', slug: 'national-affairs' },
      { title: 'अंतर्राष्ट्रीय घटनाएँ', slug: 'international-affairs' },
      { title: 'राजनीति एवं सुशासन', slug: 'politics-governance' },
      { title: 'अर्थव्यवस्था', slug: 'economy' },
      { title: 'विज्ञान एवं प्रौद्योगिकी', slug: 'science-technology' },
      { title: 'पर्यावरण एवं पारिस्थितिकी', slug: 'environment-ecology' },
      { title: 'सामाजिक मुद्दे', slug: 'social-issues' },
      { title: 'कला, संस्कृति एवं खेलकूद', slug: 'arts-culture-sports' },
      // { title: 'सरकारी योजनाएँ एवं कार्यक्रम', slug: 'government-schemes-programs' },
      // { title: 'पुरस्कार एवं सम्मान', slug: 'awards-honours' },
      // { title: 'रिपोर्ट, सूचकांक एवं सर्वेक्षण', slug: 'reports-indexes-surveys' },
      // { title: 'नियुक्तियाँ', slug: 'appointments' },
      // { title: 'रक्षा एवं सुरक्षा', slug: 'defense-security' },
      
    ],
  },
  {
    title: 'Indian History',
    slug: 'indian-history',
    subtopics: [
      { title: 'प्राचीन भारत', slug: 'ancient-india' },
      { title: 'मध्यकालीन भारत', slug: 'medieval-india' },
      { title: 'आधुनिक भारत', slug: 'modern-india' },
      {title: 'कला एवं संस्कृति', slug: 'art-culture' },
      {title: 'अन्य जानकारी ', slug: 'miscellaneous' },
    ],
  },
  {
    title: 'Geography',
    slug: 'geography',
    subtopics: [
      { title: 'भौतिक भूगोल', slug: 'physical-geography' },
      { title: 'मानव भूगोल', slug: 'human-geography' },
      { title: 'आर्थिक भूगोल', slug: 'economic-geography' },
      { title: 'पर्यावरण एवं प्राकृतिक संसाधन', slug: 'environment-natural-resources' },
      { title: 'क्षेत्रीय भूगोल', slug: 'regional-geography' },
      {title: 'भारत की भू-राजनीति', slug: 'geopolitics-of-india' },
    ],
  },
  {
    title: 'Indian Polity',
    slug: 'polity',
    subtopics: [
      { title: 'भारतीय संविधान का परिचय', slug: 'introduction-to-indian-constitution' },
      { title: 'संविधान के स्रोत एवं ऐतिहासिक पृष्ठभूमि', slug: 'historical-background-and-sources' },
      { title: 'भारतीय संघ और संघीय ढाँचा', slug: 'indian-federation-and-federal-structure' },
      { title: 'नागरिकता', slug: 'citizenship' },
      { title: 'मौलिक अधिकार', slug: 'fundamental-rights' },
      { title: 'राज्य के नीति निदेशक तत्व', slug: 'directive-principles-of-state-policy' },
      { title: 'मौलिक कर्तव्य', slug: 'fundamental-duties' },
      { title: 'राष्ट्रपति एवं उपराष्ट्रपति', slug: 'president-and-vice-president' },
      { title: 'प्रधानमंत्री और मंत्रिपरिषद', slug: 'prime-minister-and-council-of-ministers' },
      { title: 'भारतीय संसद', slug: 'indian-parliament' },
      { title: 'भारत की न्यायपालिका', slug: 'indian-judiciary' },
      { title: 'राज्य सरकार', slug: 'state-government' },
      { title: 'केंद्र-राज्य संबंध', slug: 'centre-state-relations' },
      { title: 'आपातकालीन प्रावधान', slug: 'emergency-provisions' },
      { title: 'पंचायती राज एवं स्थानीय स्वशासन', slug: 'panchayati-raj-and-local-self-government' },
      { title: 'चुनाव प्रणाली', slug: 'electoral-system' },
      { title: 'संवैधानिक संशोधन', slug: 'constitutional-amendments' },
      { title: 'संघ लोक सेवा आयोग एवं राज्य लोक सेवा आयोग', slug: 'upsc-and-spsc' },
      { title: 'नियंत्रक और महालेखा परीक्षक ', slug: 'cag' },
      { title: 'वित्त आयोग और नीति आयोग', slug: 'finance-commission-and-niti-aayog' },
      { title: 'विशेष प्रावधान', slug: 'special-provisions' },
      { title: 'अधिकार और सामाजिक न्याय', slug: 'rights-and-social-justice' },
      { title: 'विदेशी नीति एवं अंतरराष्ट्रीय संबंधों में संविधान की भूमिका', slug: 'foreign-policy-and-role-of-constitution-in-international-relations' },
      { title: 'समसामयिक संवैधानिक विकास ', slug: 'contemporary-constitutional-developments' },

    ],
  },
  // {
  //   title: 'Science & Technology',
  //   slug: 'science-technology',
  //   subtopics: [
  //     { title: 'General Science', slug: 'general-science' },
  //     { title: 'Space & IT', slug: 'space-it' },
  //   ],
  // },
  // {
  //   title: 'Important Days & Events',
  //   slug: 'important-days-events',
  //   subtopics: [
  //     { title: 'National Days', slug: 'national-days' },
  //     { title: 'International Days', slug: 'international-days' },
  //   ],
  // },
  // {
  //   title: 'Sports GK',
  //   slug: 'sports-gk',
  //   subtopics: [
  //     { title: 'Major Tournaments', slug: 'major-tournaments' },
  //     { title: 'Players & Records', slug: 'players-records' },
  //   ],
  // },
  // {
  //   title: 'Books & Authors',
  //   slug: 'books-authors',
  //   subtopics: [
  //     { title: 'Famous Books', slug: 'famous-books' },
  //     { title: 'Notable Authors', slug: 'notable-authors' },
  //   ],
  // },
  // {
  //   title: 'Awards & Honours',
  //   slug: 'awards-honours',
  //   subtopics: [
  //     { title: 'National Awards', slug: 'national-awards' },
  //     { title: 'International Awards', slug: 'international-awards' },
  //   ],
  // },
  // {
  //   title: 'Static GK',
  //   slug: 'static-gk',
  //   subtopics: [
  //     { title: 'Quick Facts', slug: 'quick-facts' },
  //     { title: 'Yearwise Events', slug: 'yearwise-events' },
  //   ],
  // },
];

export default gkData;
