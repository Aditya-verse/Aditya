export interface StudentProfile {
  name: string;
  college: string;
  phone: string;
  email: string;
  course: string;
  year: 'FE' | 'SE' | 'TE' | 'BE';
  scheme: 'I' | 'K';
  semester: number;
}

export interface Subject {
  code: string;
  name: string;
  semester: number;
  scheme: 'I' | 'K';
  hasPractical: boolean;
  maxTheory: number;
  maxInternal: number;
  maxUnitTest: number;
  maxTermWork: number;
  maxPractical: number;
  maxOral: number;
  syllabusUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  subjectName: string;
  conducted: number;
  attended: number;
}

export interface MarksRecord {
  subjectCode: string;
  internal: number;
  unitTest: number;
  external: number;
  termWork: number;
  practical: number;
  oral: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  attendanceTarget: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}