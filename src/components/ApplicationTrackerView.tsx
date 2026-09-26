import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TrackedApplication, ApplicationStatus, Scholarship } from '../types';
import {
  Layers,
  Calendar,
  ExternalLink,
  Edit2,
  Trash2,
  CheckSquare,
  Square,
  Plus,
  Clock,
  Building,
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface ApplicationTrackerViewProps {
  onExploreScholarships: () => void;
  onOpenDetails: (scholarshipId: string) => void;
}

export const ApplicationTrackerView: React.FC<ApplicationTrackerViewProps> = ({
  onExploreScholarships,
  onOpenDetails,
}) => {
  const { trackedApplications, updateTrackedApplication, deleteTrackedApplication, addTrackedApplication } = useAuth();
  const [editingItem, setEditingItem] = useState<TrackedApplication | null>(null);
  const [newApplicationOpen, setNewApplicationOpen] = useState(false);

  const statuses: ApplicationStatus[] = [
    'Interested',
    'Preparing Documents',
    'Ready to Apply',
    'Applied',
    'Accepted',
    'Rejected',
  ];

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    await updateTrackedApplication(id, { status: newStatus });
  };

  const handleToggleDoc = async (item: TrackedApplication, docKey: string) => {
    const nextChecklist = {
      ...item.documentsChecklist,
      [docKey]: !item.documentsChecklist[docKey],
    };
    await updateTrackedApplication(item.id, { documentsChecklist: nextChecklist });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    await updateTrackedApplication(editingItem.id, editingItem);
    setEditingItem(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Application Tracker
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Track your milestones across global fellowship cycles. Manage deadlines, personal notes, document readiness, and direct portal links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExploreScholarships}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Browse More Scholarships</span>
          </button>
        </div>
      </div>

      {/* Advisory Notice */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Official Portal Reminder:</strong> Application submission always takes place through each scholarship provider's accredited website (e.g. OASIS for Australia Awards, Chevening Portal, USEFP). GlobalScholar AI assists you in tracking deadlines and document readiness.
        </div>
      </div>

      {/* Pipeline Columns / Kanban View */}
      {trackedApplications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No Tracked Applications Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Start by saving scholarships or adding target opportunities from our database to monitor deadlines and requirements.
            </p>
          </div>
          <button
            onClick={onExploreScholarships}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow"
          >
            Explore Verified Scholarships
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trackedApplications.map((item) => {
            const docEntries = Object.entries(item.documentsChecklist || {});
            const completedCount = docEntries.filter(([_, done]) => done).length;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Status selector & Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as ApplicationStatus)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                        item.status === 'Accepted'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : item.status === 'Applied'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : item.status === 'Preparing Documents'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        title="Edit application notes"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTrackedApplication(item.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete from tracker"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Organization */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {item.scholarshipTitle}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{item.provider} ({item.country})</span>
                    </p>
                  </div>

                  {/* Target Degree & Personal Date */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Degree:</span>
                      <span className="font-semibold text-slate-800">{item.targetDegree}</span>
                    </div>
                    {item.personalTargetDate && (
                      <div className="flex justify-between text-blue-700 font-medium">
                        <span>Personal Target Date:</span>
                        <span>{item.personalTargetDate}</span>
                      </div>
                    )}
                    {item.submissionDeadline && (
                      <div className="flex justify-between text-slate-600">
                        <span className="text-slate-400">Official Deadline:</span>
                        <span className="font-semibold">{new Date(item.submissionDeadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Document Checklist */}
                  {docEntries.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span>Document Readiness</span>
                        <span>{completedCount}/{docEntries.length} Completed</span>
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                        {docEntries.map(([docName, done]) => (
                          <button
                            key={docName}
                            type="button"
                            onClick={() => handleToggleDoc(item, docName)}
                            className="w-full text-left flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 text-xs text-slate-700 transition-colors"
                          >
                            {done ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300 shrink-0" />
                            )}
                            <span className={done ? 'line-through text-slate-400' : ''}>
                              {docName}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {item.notes && (
                    <div className="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100 italic">
                      "{item.notes}"
                    </div>
                  )}
                </div>

                {/* Footer link to official portal */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[10px]">
                    Updated {new Date(item.lastUpdated).toLocaleDateString()}
                  </span>
                  {item.officialUrl && (
                    <a
                      href={item.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 my-auto">
            <h3 className="font-bold text-slate-900 text-base">
              Edit Application: {editingItem.scholarshipTitle}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={editingItem.status}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as ApplicationStatus })}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Degree Program</label>
                <input
                  type="text"
                  value={editingItem.targetDegree}
                  onChange={(e) => setEditingItem({ ...editingItem, targetDegree: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Personal Target Submission Date</label>
                <input
                  type="date"
                  value={editingItem.personalTargetDate || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, personalTargetDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Personal Strategy Notes</label>
                <textarea
                  rows={3}
                  value={editingItem.notes || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                  placeholder="e.g. Contacted Prof. Tariq for reference. Need to proofread SOP draft 2."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setEditingItem(null)}
                className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
