import { Subject } from './types';

export const COURSES = ['Computer Engineering', 'Information Technology', 'Civil Engineering', 'Mechanical Engineering', 'Electronics'];

export const SAMPLE_SUBJECTS: Subject[] = [
  {
    code: '22516',
    name: 'Operating System',
    semester: 5,
    scheme: 'I',
    hasPractical: true,
    maxTheory: 70,
    maxInternal: 30,
    maxUnitTest: 20,
    maxTermWork: 25,
    maxPractical: 25,
    maxOral: 0,
    syllabusUrl: '#'
  },
  {
    code: '22517',
    name: 'Advanced Java',
    semester: 5,
    scheme: 'I',
    hasPractical: true,
    maxTheory: 70,
    maxInternal: 30,
    maxUnitTest: 20,
    maxTermWork: 25,
    maxPractical: 50,
    maxOral: 0,
    syllabusUrl: '#'
  },
  {
    code: '22518',
    name: 'Software Testing',
    semester: 5,
    scheme: 'I',
    hasPractical: true,
    maxTheory: 70,
    maxInternal: 30,
    maxUnitTest: 20,
    maxTermWork: 25,
    maxPractical: 0,
    maxOral: 0,
    syllabusUrl: '#'
  },
  {
    code: '22519',
    name: 'Client Side Scripting',
    semester: 5,
    scheme: 'I',
    hasPractical: true,
    maxTheory: 70,
    maxInternal: 30,
    maxUnitTest: 20,
    maxTermWork: 25,
    maxPractical: 25,
    maxOral: 0,
    syllabusUrl: '#'
  }
];

export const INTRO_SLIDES = [
  {
    id: 1,
    title: 'Track Attendance',
    description: 'Never fall below 75%. Calculate bunkable lectures instantly.',
    icon: 'CheckCircle'
  },
  {
    id: 2,
    title: 'Calculate Marks',
    description: 'Predict your pointer. MSBTE style marksheet generation.',
    icon: 'Calculator'
  },
  {
    id: 3,
    title: 'Access Syllabus',
    description: 'Subject details, codes, and syllabus copies in your pocket.',
    icon: 'BookOpen'
  }
];