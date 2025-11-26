import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calculator, 
  CheckCircle, 
  User, 
  GraduationCap, 
  Settings, 
  Menu, 
  X, 
  ChevronRight, 
  Download, 
  AlertCircle,
  TrendingUp,
  Percent,
  LogOut,
  Home,
  Bot
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Types and Constants
import { StudentProfile, AttendanceRecord, MarksRecord, AppSettings, Subject } from './types';
import { SAMPLE_SUBJECTS, COURSES, INTRO_SLIDES } from './constants';
import { Input, Select } from './components/Input';
import { Button } from './components/Button';
import { AiChat } from './components/AiChat';

// -----------------------------------------------------------------------------
// HELPER HOOKS & UTILS
// -----------------------------------------------------------------------------
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// -----------------------------------------------------------------------------
// SCREENS
// -----------------------------------------------------------------------------

// 1. SPLASH SCREEN
const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-teal-500 to-green-500 text-white z-50">
      <div className="relative animate-bounce">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-20">
          <div className="h-32 w-32 rounded-full bg-white blur-xl"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <GraduationCap size={64} className="mb-4 drop-shadow-lg" />
          <h1 className="text-4xl font-bold tracking-tight drop-shadow-md">SemBuddy</h1>
          <p className="mt-2 text-sm font-medium text-teal-100 tracking-wider">ENGINEERING COMPANION</p>
        </div>
      </div>
      <div className="absolute bottom-10 w-48 h-1 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white animate-[width_2s_ease-in-out_forwards] w-0"></div>
      </div>
    </div>
  );
};

// 2. ONBOARDING
const Onboarding = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < INTRO_SLIDES.length - 1) {
      setCurrentSlide(curr => curr + 1);
    } else {
      navigate('/register');
    }
  };

  const SlideIcon = ({ name }: { name: string }) => {
    if (name === 'CheckCircle') return <CheckCircle size={80} className="text-teal-500 mb-8" />;
    if (name === 'Calculator') return <Calculator size={80} className="text-teal-500 mb-8" />;
    return <BookOpen size={80} className="text-teal-500 mb-8" />;
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <SlideIcon name={INTRO_SLIDES[currentSlide].icon} />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{INTRO_SLIDES[currentSlide].title}</h2>
        <p className="text-gray-500 leading-relaxed">{INTRO_SLIDES[currentSlide].description}</p>
      </div>
      
      <div className="p-8">
        <div className="flex justify-center space-x-2 mb-8">
          {INTRO_SLIDES.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-teal-500' : 'w-2 bg-gray-200'}`}
            />
          ))}
        </div>
        <Button fullWidth onClick={nextSlide}>
          {currentSlide === INTRO_SLIDES.length - 1 ? "Get Started" : "Next"}
        </Button>
      </div>
    </div>
  );
};

// 3. REGISTRATION
const Register = ({ onRegister }: { onRegister: (p: StudentProfile) => void }) => {
  const [formData, setFormData] = useState<StudentProfile>({
    name: '',
    college: '',
    phone: '',
    email: '',
    course: '',
    year: 'FE',
    scheme: 'I',
    semester: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.course) {
      onRegister(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Profile</h1>
          <p className="text-gray-500">Let's set up your academic details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <Input label="Student Name" name="name" value={formData.name} onChange={handleChange} required />
          <Input label="College Name" name="college" value={formData.college} onChange={handleChange} />
          <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
          <Input label="Phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
          
          <Select 
            label="Course" 
            name="course" 
            value={formData.course} 
            onChange={handleChange}
            options={COURSES.map(c => ({ value: c, label: c }))}
            required
          />

          <div className="grid grid-cols-2 gap-4">
             <Select 
              label="Year" 
              name="year" 
              value={formData.year} 
              onChange={handleChange}
              options={[
                { value: 'FE', label: 'First Year' },
                { value: 'SE', label: 'Second Year' },
                { value: 'TE', label: 'Third Year' },
                { value: 'BE', label: 'Final Year' }
              ]}
            />
             <Select 
              label="Scheme" 
              name="scheme" 
              value={formData.scheme} 
              onChange={handleChange}
              options={[
                { value: 'I', label: 'I Scheme' },
                { value: 'K', label: 'K Scheme' }
              ]}
            />
          </div>

          <Select 
            label="Semester" 
            name="semester" 
            value={formData.semester} 
            onChange={handleChange}
            options={[1,2,3,4,5,6,7,8].map(n => ({ value: n, label: `Semester ${n}` }))}
          />

          <Button fullWidth type="submit" className="mt-6">Save & Continue</Button>
        </form>
      </div>
    </div>
  );
};

// 4. ATTENDANCE
const Attendance = ({ records, setRecords, settings }: { records: AttendanceRecord[], setRecords: (r: AttendanceRecord[]) => void, settings: AppSettings }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{c: string, a: string}>({c: '', a: ''});

  const getStatusColor = (percentage: number) => {
    if (percentage >= settings.attendanceTarget) return '#10b981'; // green-500
    if (percentage >= 60) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const calculateStats = (attended: number, conducted: number) => {
    const percentage = conducted === 0 ? 0 : (attended / conducted) * 100;
    const target = settings.attendanceTarget;
    
    // Bunkable
    const canBunk = Math.floor((attended / (target/100)) - conducted);
    
    // Need to attend
    const needToAttend = Math.ceil(((target * conducted) - (100 * attended)) / (100 - target));

    return { percentage, canBunk: Math.max(0, canBunk), needToAttend: Math.max(0, needToAttend) };
  };

  const handleUpdate = (id: string, conducted: number, attended: number) => {
    const newRecords = records.map(r => r.id === id ? { ...r, conducted, attended } : r);
    setRecords(newRecords);
    setEditingId(null);
  };

  const startEdit = (r: AttendanceRecord) => {
    setEditingId(r.id);
    setEditValues({ c: r.conducted.toString(), a: r.attended.toString() });
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Attendance</h2>
        <span className="text-sm text-gray-500 font-medium">Target: {settings.attendanceTarget}%</span>
      </div>

      {records.map(subject => {
        const { percentage, canBunk, needToAttend } = calculateStats(subject.attended, subject.conducted);
        const data = [
          { name: 'Attended', value: subject.attended },
          { name: 'Missed', value: subject.conducted - subject.attended }
        ];

        return (
          <div key={subject.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg text-gray-800 pr-10">{subject.subjectName}</h3>
              <div 
                className={`flex items-center justify-center h-10 w-16 rounded-lg font-bold text-sm text-white`}
                style={{ backgroundColor: getStatusColor(percentage) }}
              >
                {percentage.toFixed(1)}%
              </div>
            </div>

            {/* Editing or View Mode */}
            {editingId === subject.id ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Conducted</label>
                    <input 
                      type="number" 
                      className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
                      value={editValues.c}
                      onChange={e => setEditValues({...editValues, c: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Attended</label>
                    <input 
                      type="number" 
                      className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
                      value={editValues.a}
                      onChange={e => setEditValues({...editValues, a: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" fullWidth onClick={() => handleUpdate(subject.id, parseInt(editValues.c) || 0, parseInt(editValues.a) || 0)}>Save</Button>
                  <Button size="sm" variant="ghost" fullWidth onClick={() => setEditingId(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div onClick={() => startEdit(subject)}>
                 <div className="flex items-center space-x-4 mb-4">
                    <div className="h-24 w-24 flex-shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data}
                            innerRadius={25}
                            outerRadius={35}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            <Cell key="cell-0" fill={getStatusColor(percentage)} />
                            <Cell key="cell-1" fill="#f3f4f6" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-2">
                       <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Conducted: <span className="text-gray-900 font-medium">{subject.conducted}</span></span>
                          <span className="text-gray-500">Attended: <span className="text-gray-900 font-medium">{subject.attended}</span></span>
                       </div>
                       
                       {percentage < settings.attendanceTarget ? (
                         <div className="text-xs font-medium text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                            ⚠ Attend next <span className="font-bold text-lg mx-1">{needToAttend}</span> lectures
                         </div>
                       ) : (
                         <div className="text-xs font-medium text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                            🎉 Safe! You can bunk <span className="font-bold text-lg mx-1">{canBunk}</span> lectures
                         </div>
                       )}
                    </div>
                 </div>
                 <div className="text-center text-xs text-gray-400 mt-2 border-t border-gray-50 pt-2">Tap to edit</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// 5. MARKS CALCULATOR
const MarksCalculator = ({ subjects }: { subjects: Subject[] }) => {
  const [marks, setMarks] = useState<Record<string, MarksRecord>>({});
  const [showResult, setShowResult] = useState(false);

  const handleMarkChange = (code: string, field: keyof MarksRecord, value: string) => {
    const num = parseFloat(value) || 0;
    setMarks(prev => ({
      ...prev,
      [code]: { ...prev[code], [field]: num }
    }));
  };

  const calculateSubjectTotal = (code: string, subj: Subject) => {
    const m = marks[code] || {} as Partial<MarksRecord>;
    const safeAdd = (...nums: (number|undefined)[]) => nums.reduce((a, b) => (a || 0) + (b || 0), 0) as number;
    return safeAdd(m.internal, m.unitTest, m.external, m.termWork, m.practical, m.oral);
  };

  const calculateSubjectMax = (subj: Subject) => {
    return subj.maxTheory + subj.maxInternal + subj.maxUnitTest + subj.maxTermWork + subj.maxPractical + subj.maxOral;
  };

  const semesterTotal = subjects.reduce((acc, subj) => acc + calculateSubjectTotal(subj.code, subj), 0);
  const semesterMax = subjects.reduce((acc, subj) => acc + calculateSubjectMax(subj), 0);
  const semesterPercentage = semesterMax > 0 ? (semesterTotal / semesterMax) * 100 : 0;

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-gray-800">Marks Calculator</h2>
         <Button variant="outline" size="sm" onClick={() => setShowResult(!showResult)}>
            {showResult ? 'Edit Marks' : 'View Result'}
         </Button>
      </div>

      {!showResult ? (
        <div className="space-y-6">
          {subjects.map(subj => (
            <div key={subj.code} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">{subj.name}</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                   label={`Internal (${subj.maxInternal})`} 
                   type="number" 
                   onChange={(e) => handleMarkChange(subj.code, 'internal', e.target.value)}
                />
                <Input 
                   label={`Unit Test (${subj.maxUnitTest})`} 
                   type="number" 
                   onChange={(e) => handleMarkChange(subj.code, 'unitTest', e.target.value)}
                />
                <Input 
                   label={`External (${subj.maxTheory})`} 
                   type="number" 
                   onChange={(e) => handleMarkChange(subj.code, 'external', e.target.value)}
                />
                <Input 
                   label={`Term Work (${subj.maxTermWork})`} 
                   type="number" 
                   onChange={(e) => handleMarkChange(subj.code, 'termWork', e.target.value)}
                />
                {subj.hasPractical && (
                  <Input 
                     label={`Practical (${subj.maxPractical})`} 
                     type="number" 
                     onChange={(e) => handleMarkChange(subj.code, 'practical', e.target.value)}
                  />
                )}
                {subj.maxOral > 0 && (
                  <Input 
                     label={`Oral (${subj.maxOral})`} 
                     type="number" 
                     onChange={(e) => handleMarkChange(subj.code, 'oral', e.target.value)}
                  />
                )}
              </div>
            </div>
          ))}
          <Button fullWidth onClick={() => setShowResult(true)}>Generate Marksheet</Button>
        </div>
      ) : (
        <div className="animate-in zoom-in-95 duration-300">
           {/* Summary Card */}
           <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-3xl p-6 text-white shadow-xl mb-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <TrendingUp size={100} />
             </div>
             <p className="text-blue-100 font-medium mb-1">Semester Performance</p>
             <h1 className="text-5xl font-bold mb-2">{semesterPercentage.toFixed(2)}%</h1>
             <p className="text-sm opacity-90">Total Marks: {semesterTotal} / {semesterMax}</p>
             <div className="mt-6 flex gap-3">
               <div className={`px-4 py-1 rounded-full text-xs font-bold ${semesterPercentage >= 35 ? 'bg-white text-teal-600' : 'bg-red-500 text-white'}`}>
                 {semesterPercentage >= 35 ? 'PASSED' : 'FAILED'}
               </div>
               {semesterPercentage >= 75 && <div className="px-4 py-1 rounded-full text-xs font-bold bg-yellow-400 text-yellow-900">DISTINCTION</div>}
             </div>
           </div>

           {/* MSBTE Style Table */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="bg-gray-50 p-3 border-b border-gray-200">
               <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Marksheet Summary</h4>
             </div>
             <table className="w-full text-sm text-left">
               <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                 <tr>
                   <th className="px-4 py-3 font-medium">Subject</th>
                   <th className="px-4 py-3 font-medium text-right">Obtained</th>
                   <th className="px-4 py-3 font-medium text-right">Total</th>
                   <th className="px-4 py-3 font-medium text-center">%</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {subjects.map(subj => {
                   const total = calculateSubjectTotal(subj.code, subj);
                   const max = calculateSubjectMax(subj);
                   const perc = (total/max)*100;
                   return (
                     <tr key={subj.code} className="hover:bg-gray-50/50">
                       <td className="px-4 py-3 font-medium text-gray-800">
                         {subj.name}
                         <div className="text-xs text-gray-400 font-normal">{subj.code}</div>
                       </td>
                       <td className="px-4 py-3 text-right text-gray-600">{total}</td>
                       <td className="px-4 py-3 text-right text-gray-400">{max}</td>
                       <td className={`px-4 py-3 text-center font-bold ${perc < 35 ? 'text-red-500' : 'text-teal-600'}`}>
                         {perc.toFixed(0)}%
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           </div>
        </div>
      )}
    </div>
  );
};

// 6. SYLLABUS
const Syllabus = ({ subjects }: { subjects: Subject[] }) => {
  return (
    <div className="p-4 pb-24 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Syllabus</h2>
      {subjects.map(subj => (
        <div key={subj.code} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group active:scale-[0.98] transition-transform">
          <div>
            <span className="inline-block px-2 py-1 rounded bg-teal-50 text-teal-700 text-xs font-bold mb-2">{subj.code}</span>
            <h3 className="font-semibold text-gray-800">{subj.name}</h3>
            <p className="text-xs text-gray-400 mt-1">Scheme: {subj.scheme} • Sem {subj.semester}</p>
          </div>
          <button className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 text-teal-600 hover:bg-teal-50 transition-colors">
            <Download size={20} />
          </button>
        </div>
      ))}
      {subjects.length === 0 && (
         <div className="text-center py-10 opacity-50">
           <BookOpen size={48} className="mx-auto mb-4 text-gray-300"/>
           <p>No subjects found for your course.</p>
         </div>
      )}
    </div>
  );
};

// 7. SETTINGS
const SettingsPage = ({ profile, settings, onSettingsChange, onLogout }: { 
  profile: StudentProfile, 
  settings: AppSettings, 
  onSettingsChange: (s: AppSettings) => void,
  onLogout: () => void 
}) => {
  return (
    <div className="p-4 pb-24 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      
      {/* Profile Card */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-xl">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-lg">{profile.name}</h3>
            <p className="text-sm opacity-70">{profile.course}</p>
            <p className="text-xs opacity-50 mt-1">{profile.college}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Percent size={18} /></div>
             <span className="font-medium text-gray-700">Attendance Target</span>
          </div>
          <select 
             className="bg-gray-50 border-none rounded-lg text-sm font-bold text-gray-700 focus:ring-0 cursor-pointer"
             value={settings.attendanceTarget}
             onChange={(e) => onSettingsChange({...settings, attendanceTarget: parseInt(e.target.value)})}
          >
            <option value="60">60%</option>
            <option value="75">75%</option>
            <option value="80">80%</option>
            <option value="90">90%</option>
          </select>
        </div>

         <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Settings size={18} /></div>
             <span className="font-medium text-gray-700">App Theme</span>
          </div>
          <select 
             className="bg-gray-50 border-none rounded-lg text-sm font-bold text-gray-700 focus:ring-0 cursor-pointer"
             value={settings.theme}
             onChange={(e) => onSettingsChange({...settings, theme: e.target.value as any})}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      <Button variant="outline" fullWidth className="!border-red-200 !text-red-500 hover:!bg-red-50" onClick={onLogout}>
        <LogOut size={18} className="mr-2"/> Reset App Data
      </Button>
      
      <div className="text-center text-xs text-gray-400 mt-8">
        SemBuddy v1.0.0 • Made for Engineers
      </div>
    </div>
  );
};

// 8. DASHBOARD (HOME)
const Dashboard = ({ profile, records }: { profile: StudentProfile, records: AttendanceRecord[] }) => {
  const navigate = useNavigate();
  const overallAttendance = records.length > 0
    ? (records.reduce((acc, r) => acc + r.attended, 0) / Math.max(1, records.reduce((acc, r) => acc + r.conducted, 0))) * 100
    : 0;

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex justify-between items-center py-2">
         <div>
           <p className="text-gray-500 text-sm">Welcome back,</p>
           <h1 className="text-2xl font-bold text-gray-800">{profile.name.split(' ')[0]} 👋</h1>
         </div>
         <div onClick={() => navigate('/settings')} className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 cursor-pointer">
           <User size={20} />
         </div>
      </div>

      {/* Main Stats Card */}
      <div className="bg-gradient-to-br from-teal-500 to-green-500 rounded-3xl p-6 text-white shadow-lg shadow-teal-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-teal-100 text-sm font-medium mb-1">Overall Attendance</p>
          <div className="flex items-baseline space-x-2">
             <h2 className="text-5xl font-bold">{overallAttendance.toFixed(1)}%</h2>
             {overallAttendance >= 75 ? <CheckCircle size={24} className="text-teal-100" /> : <AlertCircle size={24} className="text-red-200"/>}
          </div>
          <p className="mt-4 text-sm opacity-90 font-medium bg-white/20 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
             {profile.course} • Sem {profile.semester}
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
           <PieChart width={200} height={200}>
              <Pie data={[{value: overallAttendance}, {value: 100-overallAttendance}]} innerRadius={60} outerRadius={80} dataKey="value">
                 <Cell fill="#ffffff"/>
                 <Cell fill="#000000"/>
              </Pie>
           </PieChart>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div onClick={() => navigate('/attendance')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform cursor-pointer">
           <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
             <CheckCircle size={20}/>
           </div>
           <h3 className="font-bold text-gray-800">Attendance</h3>
           <p className="text-xs text-gray-400 mt-1">Check bunk status</p>
        </div>
         <div onClick={() => navigate('/marks')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform cursor-pointer">
           <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-3">
             <Calculator size={20}/>
           </div>
           <h3 className="font-bold text-gray-800">Marks</h3>
           <p className="text-xs text-gray-400 mt-1">Predict pointer</p>
        </div>
         <div onClick={() => navigate('/syllabus')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform cursor-pointer">
           <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-3">
             <BookOpen size={20}/>
           </div>
           <h3 className="font-bold text-gray-800">Syllabus</h3>
           <p className="text-xs text-gray-400 mt-1">View subjects</p>
        </div>
         <div onClick={() => navigate('/ai-chat')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform cursor-pointer">
           <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3">
             <Bot size={20}/>
           </div>
           <h3 className="font-bold text-gray-800">Ask AI</h3>
           <p className="text-xs text-gray-400 mt-1">Study Helper</p>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// MAIN LAYOUT & NAVIGATION
// -----------------------------------------------------------------------------
const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ path, icon: Icon, label }: { path: string, icon: any, label: string }) => (
     <button 
        onClick={() => navigate(path)}
        className={`flex flex-col items-center justify-center w-full py-3 space-y-1 transition-colors ${
          isActive(path) ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'
        }`}
     >
       <Icon size={24} strokeWidth={isActive(path) ? 2.5 : 2} />
       <span className="text-[10px] font-medium">{label}</span>
     </button>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 pb-safe pt-2 flex justify-between items-center z-40 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)]">
       <NavItem path="/dashboard" icon={Home} label="Home" />
       <NavItem path="/attendance" icon={CheckCircle} label="Attend" />
       <div className="-mt-8">
          <button onClick={() => navigate('/marks')} className="h-14 w-14 bg-teal-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-teal-600/30 active:scale-95 transition-transform">
             <Calculator size={24} />
          </button>
       </div>
       <NavItem path="/syllabus" icon={BookOpen} label="Syllabus" />
       <NavItem path="/ai-chat" icon={Bot} label="Ask AI" />
    </div>
  );
};

// -----------------------------------------------------------------------------
// PROTECTED ROUTE WRAPPER
// -----------------------------------------------------------------------------
const ProtectedRoute = ({ children, isAllowed }: { children: React.ReactNode, isAllowed: boolean }) => {
  if (!isAllowed) return <Navigate to="/onboarding" replace />;
  return (
    <>
      {children}
      <Navigation />
    </>
  );
};

// -----------------------------------------------------------------------------
// APP ROOT
// -----------------------------------------------------------------------------
const AppContent = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useLocalStorage<StudentProfile | null>('sembuddy_profile', null);
  const [settings, setSettings] = useLocalStorage<AppSettings>('sembuddy_settings', { theme: 'light', attendanceTarget: 75 });
  const [attendanceRecords, setAttendanceRecords] = useLocalStorage<AttendanceRecord[]>('sembuddy_attendance', []);

  // Initialize subjects and attendance records if profile exists but records don't match
  useEffect(() => {
    if (profile && attendanceRecords.length === 0) {
      // In a real app, this would fetch from a database based on course/sem
      // Here we use mock data
      const initialRecords = SAMPLE_SUBJECTS.map(s => ({
        id: s.code,
        subjectName: s.name,
        conducted: 0,
        attended: 0
      }));
      setAttendanceRecords(initialRecords);
    }
  }, [profile]);

  if (loading) {
    return <SplashScreen onComplete={() => setLoading(false)} />;
  }

  const handleRegister = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    // Reset records on new registration
    const initialRecords = SAMPLE_SUBJECTS.map(s => ({
      id: s.code,
      subjectName: s.name,
      conducted: 0,
      attended: 0
    }));
    setAttendanceRecords(initialRecords);
  };
  
  const handleLogout = () => {
    if(window.confirm("Are you sure? This will delete all your data.")) {
        localStorage.clear();
        window.location.reload();
    }
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 shadow-2xl relative overflow-hidden">
      <Routes>
        <Route path="/" element={<Navigate to={profile ? "/dashboard" : "/onboarding"} replace />} />
        
        <Route path="/onboarding" element={!profile ? <Onboarding /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={<Register onRegister={(p) => { handleRegister(p); }} />} />
        
        <Route path="/dashboard" element={<ProtectedRoute isAllowed={!!profile}><Dashboard profile={profile!} records={attendanceRecords} /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute isAllowed={!!profile}><Attendance records={attendanceRecords} setRecords={setAttendanceRecords} settings={settings} /></ProtectedRoute>} />
        <Route path="/marks" element={<ProtectedRoute isAllowed={!!profile}><MarksCalculator subjects={SAMPLE_SUBJECTS} /></ProtectedRoute>} />
        <Route path="/syllabus" element={<ProtectedRoute isAllowed={!!profile}><Syllabus subjects={SAMPLE_SUBJECTS} /></ProtectedRoute>} />
        <Route path="/ai-chat" element={<ProtectedRoute isAllowed={!!profile}><AiChat /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute isAllowed={!!profile}><SettingsPage profile={profile!} settings={settings} onSettingsChange={setSettings} onLogout={handleLogout} /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}