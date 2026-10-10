/**
 * Maps https://jntuh-backend-7rad.onrender.com/result/{htno}
 * into the academic-result shape used by the result tables.
 */

const GRADE_POINTS: Record<string, number> = {
  O: 10,
  "A+": 9,
  A: 8,
  "B+": 7,
  B: 6,
  C: 5,
  D: 5,
  F: 0,
  AB: 0,
  "-": 0,
};

type RenderSubject = {
  subjectCode?: string;
  subjectName?: string;
  grade?: string;
  credits?: string | number;
  internal?: string | number;
  external?: string | number;
  total?: string | number;
};

type RenderSemester = {
  semester?: string;
  subjects?: RenderSubject[];
};

export const RENDER_RESULT_API_BASE =
  process.env.NEXT_PUBLIC_RENDER_RESULT_API?.replace(/\/$/, "") ||
  "https://jntuh-backend-7rad.onrender.com";

export function renderResultUrl(htno: string): string {
  return `${RENDER_RESULT_API_BASE}/result/${encodeURIComponent(htno.trim().toUpperCase())}`;
}

function gradePoints(grade: string): number {
  return GRADE_POINTS[grade.toUpperCase()] ?? 0;
}

function isFail(grade: string): boolean {
  const value = grade.toUpperCase();
  return value === "F" || value === "AB" || value === "ABSENT";
}

function semesterSortKey(semester: string): number {
  const match = /^(\d+)-(\d+)/.exec(semester);
  if (!match) return 999;
  return Number(match[1]) * 10 + Number(match[2]);
}

function betterSubject(current: RenderSubject, next: RenderSubject): RenderSubject {
  const currentPoints = gradePoints(String(current.grade || ""));
  const nextPoints = gradePoints(String(next.grade || ""));
  if (nextPoints !== currentPoints) return nextPoints > currentPoints ? next : current;
  return Number(next.total || 0) > Number(current.total || 0) ? next : current;
}

export function mapRenderResult(payload: unknown): {
  details: Record<string, string>;
  results: Record<string, unknown>;
} | null {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as { data?: Record<string, unknown> };
  const data = (root.data && typeof root.data === "object" ? root.data : payload) as Record<
    string,
    unknown
  >;
  const hallTicket = String(data.hallTicket || data.rollNumber || "").trim();
  const name = String(data.name || "").trim();
  if (!hallTicket || !name) return null;

  const semesters = Array.isArray(data.semesters) ? (data.semesters as RenderSemester[]) : [];
  const bySemester = new Map<string, Map<string, RenderSubject>>();

  for (const semester of semesters) {
    const label = String(semester.semester || "").trim();
    if (!label) continue;
    if (!bySemester.has(label)) bySemester.set(label, new Map());
    const subjects = bySemester.get(label)!;
    for (const subject of semester.subjects || []) {
      const code = String(subject.subjectCode || "").trim();
      if (!code) continue;
      const previous = subjects.get(code);
      subjects.set(code, previous ? betterSubject(previous, subject) : subject);
    }
  }

  let totalBacklogs = 0;
  let totalPoints = 0;
  let totalCredits = 0;

  const mappedSemesters = Array.from(bySemester.entries())
    .sort(([a], [b]) => semesterSortKey(a) - semesterSortKey(b))
    .map(([semester, subjects]) => {
      let points = 0;
      let credits = 0;
      let backlogs = 0;
      const rows = Array.from(subjects.values()).map((subject) => {
        const grade = String(subject.grade || "");
        const subjectCredits = Number(subject.credits || 0);
        const pointsForGrade = gradePoints(grade);
        if (isFail(grade)) backlogs += 1;
        if (subjectCredits > 0) {
          points += pointsForGrade * subjectCredits;
          credits += subjectCredits;
        }
        return {
          subjectCode: String(subject.subjectCode || ""),
          subjectName: String(subject.subjectName || ""),
          internalMarks: Number(subject.internal || 0),
          externalMarks: Number(subject.external || 0),
          totalMarks: Number(subject.total || 0),
          grades: grade,
          credits: subjectCredits,
        };
      });

      totalBacklogs += backlogs;
      totalPoints += points;
      totalCredits += credits;

      return {
        semester,
        subjects: rows,
        semesterSGPA: credits > 0 ? (points / credits).toFixed(2) : "",
        semesterCredits: credits,
        backlogs,
        failed: backlogs > 0,
      };
    });

  return {
    details: {
      name,
      rollNumber: hallTicket,
      collegeCode: String(data.collegeCode || ""),
      fatherName: String(data.fatherName || ""),
    },
    results: {
      semesters: mappedSemesters,
      CGPA: totalBacklogs === 0 && totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0,
      backlogs: totalBacklogs,
      credits: totalCredits,
    },
  };
}

function unwrapRenderData(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as { data?: Record<string, unknown> };
  const data = root.data && typeof root.data === "object" ? root.data : (payload as Record<string, unknown>);
  if (!String(data.hallTicket || data.rollNumber || "").trim()) return null;
  return data;
}

function toSubjectRow(subject: RenderSubject) {
  return {
    subjectCode: String(subject.subjectCode || ""),
    subjectName: String(subject.subjectName || ""),
    internalMarks: Number(subject.internal || 0),
    externalMarks: Number(subject.external || 0),
    totalMarks: Number(subject.total || 0),
    grades: String(subject.grade || ""),
    credits: Number(subject.credits || 0),
  };
}

/** Every exam attempt, grouped for the All Results page. */
export function mapAllResult(payload: unknown) {
  const academic = mapRenderResult(payload);
  const data = unwrapRenderData(payload);
  if (!academic || !data) return null;
  const semesters = Array.isArray(data.semesters) ? (data.semesters as RenderSemester[]) : [];
  const grouped = new Map<string, Map<string, RenderSubject[]>>();

  for (const semester of semesters) {
    const label = String(semester.semester || "").trim();
    if (!label) continue;
    if (!grouped.has(label)) grouped.set(label, new Map());
    const exams = grouped.get(label)!;
    for (const subject of semester.subjects || []) {
      const examCode = String((subject as RenderSubject & { examCode?: string }).examCode || "Result");
      if (!exams.has(examCode)) exams.set(examCode, []);
      exams.get(examCode)!.push(subject);
    }
  }

  return {
    details: academic.details,
    results: Array.from(grouped.entries())
      .sort(([a], [b]) => semesterSortKey(a) - semesterSortKey(b))
      .map(([semester, exams]) => ({
        semester,
        exams: Array.from(exams.entries()).map(([examCode, subjects]) => ({
          examCode,
          rcrv: false,
          subjects: subjects.map(toSubjectRow),
        })),
      })),
  };
}

/** Failed subjects after keeping the best attempt in each semester. */
export function mapBacklogReport(payload: unknown) {
  const academic = mapRenderResult(payload);
  if (!academic) return null;
  const semesters = (academic.results.semesters as Array<Record<string, unknown>>)
    .map((semester) => ({
      ...semester,
      subjects: (semester.subjects as Array<Record<string, unknown>>).filter((subject) =>
        isFail(String(subject.grades || ""))
      ),
    }))
    .filter((semester) => (semester.subjects as unknown[]).length > 0);

  const totalBacklogs = semesters.reduce(
    (sum, semester) => sum + (semester.subjects as unknown[]).length,
    0
  );

  return {
    details: academic.details,
    results: {
      semesters,
      totalBacklogs,
      backlogs: totalBacklogs,
    },
  };
}

/** Semester credit totals grouped by academic year. */
export function mapCreditsReport(payload: unknown) {
  const academic = mapRenderResult(payload);
  if (!academic) return null;
  const semesters = academic.results.semesters as Array<{
    semester: string;
    semesterCredits: number;
  }>;
  const years = new Map<string, Array<{ semester: string; semesterCredits: number }>>();
  for (const semester of semesters) {
    const year = semester.semester.split("-")[0] || "1";
    if (!years.has(year)) years.set(year, []);
    years.get(year)!.push(semester);
  }

  const academicYears = Array.from(years.entries())
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([, yearSemesters]) => {
      const semesterWiseCredits: Record<string, number> = {};
      let creditsObtained = 0;
      for (const semester of yearSemesters) {
        semesterWiseCredits[semester.semester] = semester.semesterCredits;
        creditsObtained += semester.semesterCredits;
      }
      return {
        semesterWiseCredits,
        creditsObtained,
        totalCredits: creditsObtained,
      };
    });

  const totalObtainedCredits = Number(academic.results.credits || 0);
  return {
    details: academic.details,
    results: {
      academicYears,
      totalObtainedCredits,
      totalCredits: totalObtainedCredits,
      totalRequiredCredits: totalObtainedCredits,
      backlogs: Number(academic.results.backlogs || 0),
    },
  };
}

export function mapResultContrast(firstPayload: unknown, secondPayload: unknown) {
  const first = mapRenderResult(firstPayload);
  const second = mapRenderResult(secondPayload);
  if (!first || !second) return null;

  const labels = Array.from(
    new Set([
      ...(first.results.semesters as Array<{ semester: string }>).map((item) => item.semester),
      ...(second.results.semesters as Array<{ semester: string }>).map((item) => item.semester),
    ])
  ).sort((a, b) => semesterSortKey(a) - semesterSortKey(b));

  const findSemester = (
    result: NonNullable<ReturnType<typeof mapRenderResult>>,
    label: string
  ) => {
    const found = (result.results.semesters as Array<Record<string, unknown>>).find(
      (item) => item.semester === label
    );
    return (
      found || {
        semester: label,
        semesterSGPA: "-",
        semesterCredits: "-",
      }
    );
  };

  const profile = (result: NonNullable<ReturnType<typeof mapRenderResult>>) => ({
    name: result.details.name,
    rollNumber: result.details.rollNumber,
    collegeCode: result.details.collegeCode,
    fatherName: result.details.fatherName,
    CGPA: String(result.results.CGPA ?? "0"),
    backlogs: String(result.results.backlogs ?? "0"),
    credits: String(result.results.credits ?? "0"),
  });

  return {
    studentProfiles: [profile(first), profile(second)],
    semesters: labels.map((label) => [findSemester(first, label), findSemester(second, label)]),
  };
}

/** Estimated from marks. This API does not publish official grace-mark decisions. */
export function mapGraceEligibility(payload: unknown) {
  const academic = mapRenderResult(payload);
  if (!academic) return null;
  const close = (academic.results.semesters as Array<{ subjects: Array<Record<string, unknown>> }>)
    .flatMap((semester) => semester.subjects)
    .filter((subject) => {
      const total = Number(subject.totalMarks || 0);
      return isFail(String(subject.grades || "")) && total >= 35 && total < 40;
    });

  return {
    details: academic.details,
    eligibility: close.length > 0,
    message:
      close.length > 0
        ? `${close.length} failed subject(s) are within 5 marks of 40. This is an estimate from published marks, not an official grace-mark decision.`
        : "No failed subject is within 5 marks of 40. This API does not publish an official grace-mark decision.",
  };
}

export function mapGraceProof(payload: unknown) {
  const eligibility = mapGraceEligibility(payload);
  if (!eligibility) return null;
  return {
    details: eligibility.details,
    proof: {
      eligible: eligibility.eligibility,
      graceMarks: 0,
      message: eligibility.message,
    },
  };
}
