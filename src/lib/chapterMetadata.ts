import { subjects } from "@/config/subjects";

export interface ChapterInfo {
  chapterNumber: number;
  chapterTitle: string;
  subjectId: string;
  subjectName: string;

  previous: {
    no: number;
    title: string;
  } | null;

  next: {
    no: number;
    title: string;
  } | null;

  chapters: string[];
}

export function getChapterInfo(
  grade: string,
  subjectId: string,
  chapterNo: string
): ChapterInfo | null {
  const classSubjects = subjects[grade];

  if (!classSubjects) return null;

  const subject = classSubjects.find(
    (s) => s.id.toLowerCase() === subjectId.toLowerCase()
  );

  if (!subject) return null;

  const number = Number(chapterNo);

  if (
    Number.isNaN(number) ||
    number < 1 ||
    number > subject.chapters.length
  ) {
    return null;
  }

  const chapterTitle = subject.chapters[number - 1];

  return {
    chapterNumber: number,

    chapterTitle,

    subjectId: subject.id,

    subjectName: subject.name,

    chapters: subject.chapters,

    previous:
      number > 1
        ? {
            no: number - 1,
            title: subject.chapters[number - 2],
          }
        : null,

    next:
      number < subject.chapters.length
        ? {
            no: number + 1,
            title: subject.chapters[number],
          }
        : null,
  };
}