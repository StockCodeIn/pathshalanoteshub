export type InternalLink = {
  keyword: string;
  url: string;
  priority?: number;
};

export const INTERNAL_LINKS: InternalLink[] = [
  // Main Sections
  { keyword: 'RBSE', url: '/rbse', priority: 100 },
  { keyword: 'CBSE', url: '/cbse', priority: 100 },
  { keyword: 'General Knowledge', url: '/gk', priority: 90 },
  { keyword: 'GK', url: '/gk', priority: 90 },
  { keyword: 'Previous Year Papers', url: '/rbse-papers', priority: 90 },
  { keyword: 'Study Plan', url: '/study-plan', priority: 80 },
  { keyword: 'Time Management', url: '/time-management', priority: 80 },

  // Blog Hub
  { keyword: 'सरकारी नौकरी', url: '/blogs', priority: 70 },
  { keyword: 'Sarkari Naukri', url: '/blogs', priority: 70 },
  { keyword: 'SSC', url: '/blogs', priority: 60 },
  { keyword: 'Railway', url: '/blogs', priority: 60 },
  { keyword: 'Bank Exam', url: '/blogs', priority: 60 },
];