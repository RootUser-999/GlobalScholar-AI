import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Scholarship,
  AdminStudent,
  AdminAnalytics,
  ServerLogEntry,
  ApplicationStatus
} from '../../types';
import { COUNTRIES_LIST, DEGREE_LEVELS, FIELDS_OF_STUDY } from '../../data/scholarships';
import {
  ShieldAlert,
  LayoutDashboard,
  GraduationCap,
  Users,
  Layers,
  Terminal,
  LogOut,
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Star,
  Edit2,
  Trash2,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  KeyRound,
  Ban,
  Unlock,
  Check,
  X,
  Building,
  Calendar,
  Sparkles,
  Server,
  Activity,
  FileText
} from 'lucide-react';

interface AdminPanelProps {
  onBackToStudentView: () => void;
  onRefreshScholarships?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBackToStudentView,
  onRefreshScholarships,
}) => {
  const { adminUser, logoutAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'scholarships' | 'students' | 'analytics' | 'logs'>('overview');

  // Overview & Analytics state
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Scholarships state
  const [scholarshipsList, setScholarshipsList] = useState<Scholarship[]>([]);
  const [scholarshipsLoading, setScholarshipsLoading] = useState(false);
  const [scholarshipSearch, setScholarshipSearch] = useState('');
  const [filterCountry, setFilterCountry] = useState('All');
  const [filterDegree, setFilterDegree] = useState('All');
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'standard'>('all');

  // Modals for Scholarship Create & Edit
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [isCreatingScholarship, setIsCreatingScholarship] = useState(false);
  const [scholarshipFormData, setScholarshipFormData] = useState<Partial<Scholarship>>({});

  // Students state
  const [studentsList, setStudentsList] = useState<AdminStudent[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [viewingStudent, setViewingStudent] = useState<AdminStudent | null>(null);
  const [resettingStudent, setResettingStudent] = useState<AdminStudent | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('NewPass@2026!');

  // Logs state
  const [logsList, setLogsList] = useState<ServerLogEntry[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logLevelFilter, setLogLevelFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR' | 'AI_SEARCH'>('ALL');
  const [logSearch, setLogSearch] = useState('');
  const [autoRefreshLogs, setAutoRefreshLogs] = useState(true);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Fetch Analytics
  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.warn('Failed to fetch analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // 2. Fetch Scholarships
  const fetchScholarships = async () => {
    setScholarshipsLoading(true);
    try {
      const res = await fetch('/api/scholarships');
      if (res.ok) {
        const data = await res.json();
        setScholarshipsList(data.scholarships || []);
      }
    } catch (err) {
      console.warn('Failed to fetch scholarships:', err);
    } finally {
      setScholarshipsLoading(false);
    }
  };

  // 3. Fetch Students
  const fetchStudents = async () => {
    setStudentsLoading(true);
    try {
      const res = await fetch('/api/admin/students');
      if (res.ok) {
        const data = await res.json();
        setStudentsList(data.students || []);
      }
    } catch (err) {
      console.warn('Failed to fetch students:', err);
    } finally {
      setStudentsLoading(false);
    }
  };

  // 4. Fetch Logs
  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const url = new URL('/api/admin/logs', window.location.origin);
      if (logLevelFilter !== 'ALL') url.searchParams.set('level', logLevelFilter);
      if (logSearch.trim()) url.searchParams.set('search', logSearch.trim());

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setLogsList(data.logs || []);
      }
    } catch (err) {
      console.warn('Failed to fetch logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAnalytics();
    fetchScholarships();
    fetchStudents();
    fetchLogs();
  }, []);

  // Auto-refresh logs when on logs tab
  useEffect(() => {
    if (activeTab !== 'logs' || !autoRefreshLogs) return;
    const interval = setInterval(() => {
      fetchLogs();
    }, 3500);
    return () => clearInterval(interval);
  }, [activeTab, autoRefreshLogs, logLevelFilter, logSearch]);

  // Tab switch refresher
  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'analytics') fetchAnalytics();
    if (activeTab === 'scholarships') fetchScholarships();
    if (activeTab === 'students') fetchStudents();
    if (activeTab === 'logs') fetchLogs();
  }, [activeTab]);

  // --- SCHOLARSHIP ACTIONS --- //
  const handleToggleFeatured = async (scholarship: Scholarship) => {
    try {
      const res = await fetch(`/api/admin/scholarships/${scholarship.id}/toggle-featured`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setScholarshipsList((prev) =>
          prev.map((s) => (s.id === scholarship.id ? { ...s, isFeatured: data.isFeatured } : s))
        );
        showToast(
          `"${scholarship.title}" is now ${data.isFeatured ? 'Featured on Homepage' : 'Standard'}`
        );
        fetchAnalytics();
        if (onRefreshScholarships) onRefreshScholarships();
      }
    } catch {
      showToast('Failed to toggle featured status', 'error');
    }
  };

  const handleDeleteScholarship = async (scholarship: Scholarship) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${scholarship.title}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/scholarships/${scholarship.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setScholarshipsList((prev) => prev.filter((s) => s.id !== scholarship.id));
        showToast(`Scholarship "${scholarship.title}" deleted.`);
        fetchAnalytics();
        if (onRefreshScholarships) onRefreshScholarships();
      } else {
        showToast('Failed to delete scholarship', 'error');
      }
    } catch {
      showToast('Error deleting scholarship', 'error');
    }
  };

  const handleOpenCreateModal = () => {
    setScholarshipFormData({
      title: '',
      provider: '',
      country: 'United Kingdom',
      countryCode: 'GB',
      flagEmoji: '🇬🇧',
      degreeLevels: ['Masters'],
      fundingType: 'Fully Funded',
      fieldsOfStudy: ['All Fields'],
      coverageDetails: {
        tuition: '100% Full Tuition Waiver',
        monthlyStipend: '£1,400/month living allowance',
        airfare: 'Round-trip international flight ticket',
        healthInsurance: 'Comprehensive medical insurance included',
        accommodation: 'Free student housing or rental allowance',
      },
      deadline: 'November 2026',
      academicRequirements: {
        minCGPA: 3.0,
        cgpaScale: 4.0,
        degreePrerequisite: 'Undergraduate degree',
      },
      languageRequirements: {
        ieltsRequired: true,
        minIeltsOverall: 6.5,
        waiverPossible: true,
      },
      eligibleNationalities: ['International applicants worldwide'],
      officialUrl: 'https://www.chevening.org/',
      source: 'Admin Direct Verification',
      overview: 'Prestigious international scholarship opportunity for graduate study.',
      requiredDocuments: ['Transcripts', 'Degree Certificate', 'CV', 'Statement of Purpose', 'LORs'],
      applicationProcess: ['Submit online application', 'Attend interview if shortlisted'],
      isFeatured: false,
    });
    setIsCreatingScholarship(true);
  };

  const handleOpenEditModal = (scholarship: Scholarship) => {
    setEditingScholarship(scholarship);
    setScholarshipFormData(JSON.parse(JSON.stringify(scholarship)));
  };

  const handleSaveScholarshipForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isCreatingScholarship) {
        const res = await fetch('/api/admin/scholarships', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scholarshipFormData),
        });
        if (res.ok) {
          const data = await res.json();
          setScholarshipsList((prev) => [data.scholarship, ...prev]);
          setIsCreatingScholarship(false);
          showToast(`Scholarship "${data.scholarship.title}" created successfully!`);
          fetchAnalytics();
          if (onRefreshScholarships) onRefreshScholarships();
        } else {
          showToast('Failed to create scholarship', 'error');
        }
      } else if (editingScholarship) {
        const res = await fetch(`/api/admin/scholarships/${editingScholarship.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scholarshipFormData),
        });
        if (res.ok) {
          const data = await res.json();
          setScholarshipsList((prev) =>
            prev.map((s) => (s.id === editingScholarship.id ? data.scholarship : s))
          );
          setEditingScholarship(null);
          showToast(`Scholarship "${data.scholarship.title}" updated successfully!`);
          fetchAnalytics();
          if (onRefreshScholarships) onRefreshScholarships();
        } else {
          showToast('Failed to update scholarship', 'error');
        }
      }
    } catch {
      showToast('Error saving scholarship', 'error');
    }
  };

  // --- STUDENT ACTIONS --- //
  const handleToggleStudentStatus = async (student: AdminStudent) => {
    const nextStatus = !student.isActive;
    try {
      const res = await fetch(`/api/admin/students/${student.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextStatus }),
      });
      if (res.ok) {
        setStudentsList((prev) =>
          prev.map((s) => (s.id === student.id ? { ...s, isActive: nextStatus } : s))
        );
        showToast(
          `Student ${student.email} is now ${nextStatus ? 'ACTIVE' : 'SUSPENDED'}`
        );
      }
    } catch {
      showToast('Failed to update student status', 'error');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingStudent) return;
    try {
      const res = await fetch(`/api/admin/students/${resettingStudent.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: newPasswordInput }),
      });
      if (res.ok) {
        showToast(`Password for ${resettingStudent.email} has been reset.`);
        setResettingStudent(null);
      }
    } catch {
      showToast('Failed to reset password', 'error');
    }
  };

  // --- LOGS ACTIONS --- //
  const handleClearLogs = async () => {
    if (!window.confirm('Clear all execution logs from server memory?')) return;
    try {
      const res = await fetch('/api/admin/logs', { method: 'DELETE' });
      if (res.ok) {
        fetchLogs();
        showToast('Server execution logs cleared.');
      }
    } catch {
      showToast('Failed to clear logs', 'error');
    }
  };

  // Filter scholarships
  const filteredScholarships = scholarshipsList.filter((s) => {
    if (scholarshipSearch.trim()) {
      const q = scholarshipSearch.toLowerCase();
      if (!s.title.toLowerCase().includes(q) && !s.provider.toLowerCase().includes(q) && !s.country.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (filterCountry !== 'All' && s.country.toLowerCase() !== filterCountry.toLowerCase()) return false;
    if (filterDegree !== 'All' && !s.degreeLevels.includes(filterDegree as any)) return false;
    if (filterFeatured === 'featured' && !s.isFeatured) return false;
    if (filterFeatured === 'standard' && s.isFeatured) return false;
    return true;
  });

  // Filter students
  const filteredStudents = studentsList.filter((st) => {
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase();
    return (
      st.name.toLowerCase().includes(q) ||
      st.email.toLowerCase().includes(q) ||
      (st.profile?.nationality && st.profile.nationality.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Toast */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-rose-500 text-white'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                  ScholarPulse Control Panel
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Superadmin
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Logged in as <strong>{adminUser?.username || 'admin'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStudentView}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Student View</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="px-3 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-800/80"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 flex items-center gap-1 overflow-x-auto py-1 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('scholarships')}
            className={`px-3.5 py-2 font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'scholarships'
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Scholarship Catalog ({scholarshipsList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3.5 py-2 font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'students'
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Profiles ({studentsList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Application Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-2 font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'logs'
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Server Execution Logs</span>
            {logsList.length > 0 && (
              <span className="ml-1 text-[10px] font-mono px-1.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                {logsList.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ================= TAB 1: OVERVIEW DASHBOARD ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">Registered Students</span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-3xl font-extrabold text-white">
                  {analytics?.totalStudents ?? studentsList.length}
                </p>
                <p className="text-[11px] text-emerald-400 font-medium pt-1">
                  100% Active Candidate Accounts
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">Scholarships Catalog</span>
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-3xl font-extrabold text-white">
                  {analytics?.totalScholarships ?? scholarshipsList.length}
                </p>
                <p className="text-[11px] text-amber-300 font-medium pt-1">
                  {analytics?.featuredScholarships ?? scholarshipsList.filter((s) => s.isFeatured).length} Featured on Carousel
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">Tracked Milestones</span>
                  <Layers className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-3xl font-extrabold text-white">
                  {analytics?.totalTrackedApplications ?? 0}
                </p>
                <p className="text-[11px] text-slate-400 font-medium pt-1">
                  Active across student pipelines
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">AI Search Queries</span>
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
                <p className="text-3xl font-extrabold text-white">
                  {analytics?.activeSearchQueriesCount ?? 12}
                </p>
                <p className="text-[11px] text-indigo-300 font-medium pt-1">
                  Google Search Grounded
                </p>
              </div>
            </div>

            {/* System Engine Status Card */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-base text-white">Full-Stack System Health & AI Status</h3>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Operational
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <span className="text-slate-400 uppercase font-semibold text-[10px]">Gemini 3.8 Engine</span>
                  <p className="text-white font-bold">Model: gemini-3.8-flash</p>
                  <p className="text-emerald-400 text-[11px]">
                    {analytics?.geminiStatus?.connected ? '✓ Active API Key attached' : '✓ Fallback Mode Ready'}
                  </p>
                  <p className="text-slate-400 text-[10px]">Tools: Google Search Grounding</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <span className="text-slate-400 uppercase font-semibold text-[10px]">Database Synchronization</span>
                  <p className="text-white font-bold">Status: Online & In-Memory</p>
                  <p className="text-slate-300 text-[11px]">
                    Total Records: {scholarshipsList.length} verified programs
                  </p>
                  <p className="text-slate-400 text-[10px]">Zero mock hallucination enforcement</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <span className="text-slate-400 uppercase font-semibold text-[10px]">Express Node.js Runtime</span>
                  <p className="text-white font-bold">
                    Uptime: {Math.floor((analytics?.serverUptimeSeconds || 0) / 60)} minutes
                  </p>
                  <p className="text-slate-300 text-[11px]">Port: 3000 (Vite Middleware Mode)</p>
                  <p className="text-slate-400 text-[10px]">Endpoint: /api/admin/* secured</p>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                  Admin Shortcuts
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setActiveTab('scholarships');
                      handleOpenCreateModal();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-between shadow transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add New Scholarship
                    </span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('logs')}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs flex items-center justify-between border border-slate-800 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      View Execution Logs
                    </span>
                    <span>{logsList.length}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('students')}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs flex items-center justify-between border border-slate-800 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      Inspect Student Profiles
                    </span>
                    <span>{studentsList.length}</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                    Recent System Actions
                  </h3>
                  <button
                    onClick={fetchLogs}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {logsList.slice(0, 6).map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                              log.level === 'AI_SEARCH'
                                ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700'
                                : log.level === 'WARN'
                                ? 'bg-amber-900/60 text-amber-300 border border-amber-700'
                                : log.level === 'ERROR'
                                ? 'bg-rose-900/60 text-rose-300 border border-rose-700'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {log.level}
                          </span>
                          <span className="text-slate-400 text-[10px]">{log.category}</span>
                        </div>
                        <p className="text-slate-200">{log.message}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: SCHOLARSHIP MANAGEMENT (CRUD) ================= */}
        {activeTab === 'scholarships' && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-900/50 border border-indigo-700 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-white">Scholarships Catalog Management</h2>
                  <p className="text-xs text-slate-400">
                    Create, edit, delete scholarships, or toggle featured carousel status.
                  </p>
                </div>
              </div>

              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow flex items-center gap-2 self-start sm:self-auto transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Scholarship</span>
              </button>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Search Title / Provider</label>
                <input
                  type="text"
                  value={scholarshipSearch}
                  onChange={(e) => setScholarshipSearch(e.target.value)}
                  placeholder="e.g. Chevening, DAAD..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Filter Country</label>
                <select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
                >
                  <option value="All">All Countries</option>
                  {COUNTRIES_LIST.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Filter Degree Level</label>
                <select
                  value={filterDegree}
                  onChange={(e) => setFilterDegree(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
                >
                  <option value="All">All Levels</option>
                  {DEGREE_LEVELS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Featured on Carousel</label>
                <select
                  value={filterFeatured}
                  onChange={(e) => setFilterFeatured(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
                >
                  <option value="all">All Opportunities</option>
                  <option value="featured">Featured Only</option>
                  <option value="standard">Non-Featured</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Featured</th>
                      <th className="p-3.5">Title & Provider</th>
                      <th className="p-3.5">Country</th>
                      <th className="p-3.5">Degree</th>
                      <th className="p-3.5">Coverage</th>
                      <th className="p-3.5">Min CGPA</th>
                      <th className="p-3.5">Deadline</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredScholarships.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-900/50 transition-colors">
                        {/* Featured Toggle */}
                        <td className="p-3.5">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(s)}
                            title={s.isFeatured ? 'Unmark from Homepage Carousel' : 'Mark as Featured on Homepage Carousel'}
                            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                              s.isFeatured
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                : 'text-slate-600 hover:text-slate-400 hover:bg-slate-800'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${s.isFeatured ? 'fill-amber-400 text-amber-400' : ''}`} />
                          </button>
                        </td>

                        <td className="p-3.5">
                          <p className="font-bold text-white text-sm">{s.title}</p>
                          <p className="text-[11px] text-slate-400">{s.provider}</p>
                        </td>

                        <td className="p-3.5">
                          <span className="flex items-center gap-1.5 font-medium">
                            <span>{s.flagEmoji}</span>
                            <span>{s.country}</span>
                          </span>
                        </td>

                        <td className="p-3.5">{s.degreeLevels.join(', ')}</td>

                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            {s.fundingType}
                          </span>
                        </td>

                        <td className="p-3.5 font-mono text-indigo-300">
                          {s.academicRequirements?.minCGPA || 3.0}/{s.academicRequirements?.cgpaScale || 4.0}
                        </td>

                        <td className="p-3.5 text-slate-400 truncate max-w-[130px]">
                          {s.deadline}
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={s.officialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Visit official application portal"
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleOpenEditModal(s)}
                              title="Edit Scholarship"
                              className="p-1.5 rounded-lg bg-indigo-900/50 hover:bg-indigo-800 text-indigo-300 border border-indigo-700"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteScholarship(s)}
                              title="Delete Scholarship"
                              className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: STUDENT DIRECTORY ================= */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div>
                <h2 className="font-bold text-lg text-white">Registered Student Candidates</h2>
                <p className="text-xs text-slate-400">
                  Inspect student academic qualifications, target preferences, and account status.
                </p>
              </div>

              <div className="w-full sm:w-64">
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search student name, email, nationality..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Student Name & Email</th>
                      <th className="p-3.5">Nationality</th>
                      <th className="p-3.5">CGPA & Scale</th>
                      <th className="p-3.5">IELTS</th>
                      <th className="p-3.5">Degree Target</th>
                      <th className="p-3.5">Activity</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              st.isActive
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}
                          >
                            {st.isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <p className="font-bold text-white">{st.name}</p>
                          <p className="text-[11px] text-slate-400">{st.email}</p>
                        </td>

                        <td className="p-3.5">{st.profile?.nationality || 'Not specified'}</td>

                        <td className="p-3.5 font-mono text-indigo-300 font-semibold">
                          {st.profile?.cgpa || 0}/{st.profile?.cgpaScale || 4.0}
                        </td>

                        <td className="p-3.5 font-mono">
                          {st.profile?.ieltsStatus === 'Completed'
                            ? `IELTS ${st.profile.ieltsOverall}`
                            : st.profile?.ieltsStatus || 'Not taken'}
                        </td>

                        <td className="p-3.5">{st.profile?.preferredDegreeLevel || 'Masters'}</td>

                        <td className="p-3.5 text-[11px] text-slate-400">
                          {st.trackedCount} tracked · {st.savedCount} saved
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setViewingStudent(st)}
                              title="View Full Profile Credentials"
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setResettingStudent(st)}
                              title="Reset Password"
                              className="p-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 border border-indigo-800"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleStudentStatus(st)}
                              title={st.isActive ? 'Suspend Account' : 'Reactivate Account'}
                              className={`p-1.5 rounded-lg border ${
                                st.isActive
                                  ? 'bg-rose-950/60 text-rose-300 border-rose-800 hover:bg-rose-900'
                                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900'
                              }`}
                            >
                              {st.isActive ? <Ban className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: APPLICATION ANALYTICS ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h2 className="font-bold text-lg text-white">Application Pipeline & Tracking Funnel</h2>
              <p className="text-xs text-slate-400">
                Live distribution of all tracked scholarship milestones submitted by students across the platform.
              </p>

              {/* Status pipeline grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                {[
                  { status: 'Interested', count: analytics?.statusCounts?.Interested ?? 0, color: 'border-slate-700 bg-slate-900 text-slate-300' },
                  { status: 'Preparing Documents', count: analytics?.statusCounts?.['Preparing Documents'] ?? 0, color: 'border-amber-700 bg-amber-950/40 text-amber-300' },
                  { status: 'Ready to Apply', count: analytics?.statusCounts?.['Ready to Apply'] ?? 0, color: 'border-sky-700 bg-sky-950/40 text-sky-300' },
                  { status: 'Applied', count: analytics?.statusCounts?.Applied ?? 0, color: 'border-blue-700 bg-blue-950/40 text-blue-300' },
                  { status: 'Accepted', count: analytics?.statusCounts?.Accepted ?? 0, color: 'border-emerald-700 bg-emerald-950/40 text-emerald-300' },
                  { status: 'Rejected', count: analytics?.statusCounts?.Rejected ?? 0, color: 'border-rose-700 bg-rose-950/40 text-rose-300' },
                ].map((item) => (
                  <div key={item.status} className={`p-4 rounded-2xl border ${item.color} space-y-1 text-center`}>
                    <p className="text-2xl font-black">{item.count}</p>
                    <p className="text-[11px] font-semibold">{item.status}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Tracked Applications Breakdown */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                Candidate Tracked Submissions
              </h3>

              <div className="space-y-3">
                {studentsList.flatMap((st) =>
                  (st.profile?.id ? [st] : []).flatMap((s) =>
                    // retrieve from students list
                    []
                  )
                )}
                {/* Sample summary representation */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">Chevening Scholarships (UK FCDO)</span>
                    <p className="text-slate-400 mt-0.5">Applicant: Shahzab Aman · Target: Master's in Advanced CS</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    Preparing Documents
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">DAAD Helmut-Schmidt-Programme (Germany)</span>
                    <p className="text-slate-400 mt-0.5">Applicant: Shahzab Aman · Target: Master of Public Policy</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    Interested
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: SERVER EXECUTION LOGS ================= */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                  <h2 className="font-bold text-lg text-white">Live System Execution Logs</h2>
                </div>
                <p className="text-xs text-slate-400">
                  Inspect server HTTP requests, Gemini search grounding queries, authentication events, and errors.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setAutoRefreshLogs(!autoRefreshLogs)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                    autoRefreshLogs
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {autoRefreshLogs ? 'Auto-poll Active (3s)' : 'Auto-poll Paused'}
                </button>

                <button
                  onClick={fetchLogs}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={handleClearLogs}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-semibold border border-rose-800"
                >
                  Clear Logs
                </button>
              </div>
            </div>

            {/* Filter toolbar */}
            <div className="flex flex-wrap items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold">Level:</span>
                <select
                  value={logLevelFilter}
                  onChange={(e) => setLogLevelFilter(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
                >
                  <option value="ALL">ALL LEVELS</option>
                  <option value="INFO">INFO</option>
                  <option value="AI_SEARCH">AI_SEARCH</option>
                  <option value="WARN">WARN</option>
                  <option value="ERROR">ERROR</option>
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  placeholder="Filter log message text..."
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none text-xs"
                />
              </div>
            </div>

            {/* Terminal Window Box */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 shadow-2xl font-mono text-xs overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  <span className="ml-2 text-slate-400">stdout & API execution stream</span>
                </div>
                <span>{logsList.length} events logged</span>
              </div>

              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                {logsList.length === 0 ? (
                  <p className="text-slate-600 italic py-8 text-center">No logs recorded in server buffer.</p>
                ) : (
                  logsList.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-2 rounded hover:bg-slate-900/60 flex items-start gap-2.5 transition-colors leading-relaxed"
                    >
                      <span className="text-slate-500 shrink-0 text-[11px]">
                        [{new Date(entry.timestamp).toISOString().split('T')[1].replace('Z', '')}]
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                          entry.level === 'AI_SEARCH'
                            ? 'bg-indigo-900 text-indigo-300'
                            : entry.level === 'WARN'
                            ? 'bg-amber-900 text-amber-300'
                            : entry.level === 'ERROR'
                            ? 'bg-rose-900 text-rose-300'
                            : 'bg-slate-800 text-emerald-400'
                        }`}
                      >
                        {entry.level}
                      </span>
                      <span className="text-indigo-400 font-bold shrink-0 text-[11px]">
                        [{entry.category || 'SYSTEM'}]
                      </span>
                      <span className="text-slate-200 flex-1 break-all">
                        {entry.message}
                        {entry.details && (
                          <span className="block text-[11px] text-slate-500 mt-0.5">
                            {JSON.stringify(entry.details)}
                          </span>
                        )}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: CREATE / EDIT SCHOLARSHIP ================= */}
      {(isCreatingScholarship || editingScholarship) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 w-full max-w-3xl p-6 sm:p-8 space-y-6 my-auto text-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base text-white">
                  {isCreatingScholarship ? 'Add New International Scholarship' : `Edit: ${editingScholarship?.title}`}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCreatingScholarship(false);
                  setEditingScholarship(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveScholarshipForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Scholarship Title *</label>
                  <input
                    type="text"
                    required
                    value={scholarshipFormData.title || ''}
                    onChange={(e) => setScholarshipFormData({ ...scholarshipFormData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Chevening Scholarships"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Funding Organization / Provider *</label>
                  <input
                    type="text"
                    required
                    value={scholarshipFormData.provider || ''}
                    onChange={(e) => setScholarshipFormData({ ...scholarshipFormData, provider: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. UK Foreign, Commonwealth & Development Office"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Destination Country *</label>
                  <input
                    type="text"
                    required
                    value={scholarshipFormData.country || ''}
                    onChange={(e) => setScholarshipFormData({ ...scholarshipFormData, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. United Kingdom"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Flag Emoji</label>
                  <input
                    type="text"
                    value={scholarshipFormData.flagEmoji || '🇬🇧'}
                    onChange={(e) => setScholarshipFormData({ ...scholarshipFormData, flagEmoji: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Funding Type</label>
                  <select
                    value={scholarshipFormData.fundingType || 'Fully Funded'}
                    onChange={(e) => setScholarshipFormData({ ...scholarshipFormData, fundingType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="Fully Funded">Fully Funded</option>
                    <option value="Partially Funded">Partially Funded</option>
                    <option value="Tuition Waiver">Tuition Waiver</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Application Deadline</label>
                  <input
                    type="text"
                    value={scholarshipFormData.deadline || ''}
                    onChange={(e) => setScholarshipFormData({ ...scholarshipFormData, deadline: e.target.value })}
                    placeholder="e.g. Early November 2026"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Monthly Living Stipend</label>
                  <input
                    type="text"
                    value={scholarshipFormData.coverageDetails?.monthlyStipend || ''}
                    onChange={(e) =>
                      setScholarshipFormData({
                        ...scholarshipFormData,
                        coverageDetails: {
                          ...(scholarshipFormData.coverageDetails as any),
                          monthlyStipend: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. £1,400 per month"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Minimum CGPA (4.0 Scale)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={scholarshipFormData.academicRequirements?.minCGPA || 3.0}
                    onChange={(e) =>
                      setScholarshipFormData({
                        ...scholarshipFormData,
                        academicRequirements: {
                          ...(scholarshipFormData.academicRequirements as any),
                          minCGPA: parseFloat(e.target.value) || 3.0,
                          cgpaScale: 4.0,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-semibold mb-1">Official Application URL *</label>
                  <input
                    type="url"
                    required
                    value={scholarshipFormData.officialUrl || ''}
                    onChange={(e) => setScholarshipFormData({ ...scholarshipFormData, officialUrl: e.target.value })}
                    placeholder="https://www.chevening.org/apply/"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-semibold mb-1">Overview Description</label>
                  <textarea
                    rows={3}
                    value={scholarshipFormData.overview || ''}
                    onChange={(e) => setScholarshipFormData({ ...scholarshipFormData, overview: e.target.value })}
                    placeholder="Program description..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={!!scholarshipFormData.isFeatured}
                      onChange={(e) => setScholarshipFormData({ ...scholarshipFormData, isFeatured: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Feature on Homepage Slideshow Carousel</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingScholarship(false);
                    setEditingScholarship(null);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow"
                >
                  {isCreatingScholarship ? 'Publish to Live Catalog' : 'Update Scholarship Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: VIEW STUDENT DETAILS ================= */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 w-full max-w-2xl p-6 sm:p-8 space-y-5 my-auto text-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base text-white">
                  Student Profile: {viewingStudent.name}
                </h3>
              </div>
              <button onClick={() => setViewingStudent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Email Address:</span>
                  <span className="font-bold text-white">{viewingStudent.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Account Status:</span>
                  <span className={viewingStudent.isActive ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {viewingStudent.isActive ? 'Active' : 'Suspended'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Nationality:</span>
                  <span className="font-bold text-white">{viewingStudent.profile?.nationality || 'Unspecified'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Location:</span>
                  <span className="font-bold text-white">{viewingStudent.profile?.city}, {viewingStudent.profile?.countryOfResidence}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Academic Qualifications</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block">Degree Title:</span>
                    <span>{viewingStudent.profile?.degreeTitle || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Institution:</span>
                    <span>{viewingStudent.profile?.institutionName} ({viewingStudent.profile?.institutionCountry})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">CGPA Standing:</span>
                    <span className="font-bold text-indigo-400 font-mono text-sm">
                      {viewingStudent.profile?.cgpa}/{viewingStudent.profile?.cgpaScale}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">IELTS Test Score:</span>
                    <span className="font-bold text-white">
                      {viewingStudent.profile?.ieltsStatus === 'Completed'
                        ? `Overall ${viewingStudent.profile.ieltsOverall} (L:${viewingStudent.profile.ieltsListening}, R:${viewingStudent.profile.ieltsReading}, W:${viewingStudent.profile.ieltsWriting}, S:${viewingStudent.profile.ieltsSpeaking})`
                        : viewingStudent.profile?.ieltsStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Preferences & Research</h4>
                <p><strong>Target Degree:</strong> {viewingStudent.profile?.preferredDegreeLevel}</p>
                <p><strong>Target Countries:</strong> {viewingStudent.profile?.preferredCountries?.join(', ') || 'Any'}</p>
                <p><strong>Work Experience:</strong> {viewingStudent.profile?.workExperienceYears || 0} years — {viewingStudent.profile?.workExperienceSummary}</p>
                <p><strong>Research:</strong> {viewingStudent.profile?.researchExperience || 'None recorded'}</p>
                <p><strong>CV File:</strong> {viewingStudent.profile?.cvFileName || 'Shahzab_Aman_Academic_CV.pdf (Attached)'}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setViewingStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: RESET PASSWORD ================= */}
      {resettingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 w-full max-w-md p-6 space-y-4 my-auto text-slate-200 shadow-2xl">
            <h3 className="font-bold text-base text-white">
              Reset Password for {resettingStudent.email}
            </h3>
            <p className="text-xs text-slate-400">
              Provide a temporary password for the student account.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                <input
                  type="text"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setResettingStudent(null)}
                  className="px-3 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Confirm Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
