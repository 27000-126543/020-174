
import { useState } from 'react';
import {
  History,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  Pencil,
  Save,
  X,
  MessageCircle,
  Calendar,
  Filter,
  User,
  Stethoscope,
  Heart,
  XCircle,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { chiefComplaintLabels, treatmentLabels } from '@/types';
import type { ChiefComplaintType, TreatmentType } from '@/types';

export function ReviewHistory() {
  const reviewRecords = useAppStore((state) => state.reviewRecords);
  const personalSpeeches = useAppStore((state) => state.personalSpeeches);
  const updatePersonalSpeech = useAppStore((state) => state.updatePersonalSpeech);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingSpeechId, setEditingSpeechId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterComplaint, setFilterComplaint] = useState<ChiefComplaintType | null>(null);
  const [filterTreatment, setFilterTreatment] = useState<TreatmentType | null>(null);
  const [filterConcern, setFilterConcern] = useState<string | null>(null);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatDateShort = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getSpeechesForReview = (speechIds?: string[]) => {
    if (!speechIds || speechIds.length === 0) return [];
    return personalSpeeches.filter((s) => speechIds.includes(s.id));
  };

  const concernOptions = [
    '费用预算',
    '治疗疼痛',
    '治疗周期',
    '美观效果',
    '使用寿命',
    '饮食影响',
    '复诊次数',
    '安全性',
    '美观考虑',
    '家属意见',
  ];

  const filteredRecords = reviewRecords
    .filter((r) => !filterComplaint || r.chiefComplaint === filterComplaint)
    .filter((r) => !filterTreatment || (r.treatmentItems && r.treatmentItems.includes(filterTreatment)))
    .filter((r) => !filterConcern || (r.patientConcerns && r.patientConcerns.includes(filterConcern)))
    .sort((a, b) => b.createdAt - a.createdAt);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const startEdit = (id: string, content: string) => {
    setEditingSpeechId(id);
    setEditContent(content);
  };

  const saveEdit = () => {
    if (editingSpeechId && editContent.trim()) {
      updatePersonalSpeech(editingSpeechId, {
        content: editContent.trim(),
      });
      setEditingSpeechId(null);
      setEditContent('');
    }
  };

  const cancelEdit = () => {
    setEditingSpeechId(null);
    setEditContent('');
  };

  const clearFilters = () => {
    setFilterComplaint(null);
    setFilterTreatment(null);
    setFilterConcern(null);
  };

  const hasActiveFilters = filterComplaint || filterTreatment || filterConcern;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-1 h-5 bg-rose-500 rounded-full"></span>
          复盘历史记录
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{reviewRecords.length} 条</span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-rose-100 text-rose-600'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            筛选
            {hasActiveFilters && (
              <span className="w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center">
                {[filterComplaint, filterTreatment, filterConcern].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-4 p-4 bg-gray-50 rounded-xl space-y-3 animate-fade-in">
          <div>
            <p className="text-xs text-gray-500 mb-2">按主诉筛选</p>
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setFilterComplaint(null)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                  filterComplaint === null
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                全部
              </button>
              {Object.entries(chiefComplaintLabels).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setFilterComplaint(filterComplaint === value ? null : value as ChiefComplaintType)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                    filterComplaint === value
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">按治疗项目筛选</p>
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setFilterTreatment(null)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                  filterTreatment === null
                    ? 'bg-teal-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                全部
              </button>
              {Object.entries(treatmentLabels).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setFilterTreatment(filterTreatment === value ? null : value as TreatmentType)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                    filterTreatment === value
                      ? 'bg-teal-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">按患者关心点筛选</p>
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setFilterConcern(null)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                  filterConcern === null
                    ? 'bg-rose-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                全部
              </button>
              {concernOptions.map((concern) => (
                <button
                  key={concern}
                  onClick={() => setFilterConcern(filterConcern === concern ? null : concern)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                    filterConcern === concern
                      ? 'bg-rose-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {concern}
                </button>
              ))}
            </div>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
            >
              <XCircle className="w-3 h-3" />
              清除所有筛选
            </button>
          )}
        </div>
      )}

      {filteredRecords.length > 0 ? (
        <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
          {filteredRecords.map((record) => {
            const speeches = getSpeechesForReview(record.speechIds);
            const isExpanded = expandedId === record.id;
            return (
              <div
                key={record.id}
                className="border border-gray-100 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleExpand(record.id)}
                  className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      record.isSmooth
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-orange-100 text-orange-600'
                    }`}
                  >
                    {record.isSmooth ? (
                      <ThumbsUp className="w-4 h-4" />
                    ) : (
                      <ThumbsDown className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-800">
                        {record.isSmooth ? '沟通顺利' : '沟通受阻'}
                      </span>
                      {!record.isSmooth && record.stuckPoint && (
                        <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded-md">
                          {record.stuckPoint}
                        </span>
                      )}
                      {record.chiefComplaint && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-md">
                          {chiefComplaintLabels[record.chiefComplaint]}
                        </span>
                      )}
                      {record.treatmentItems && record.treatmentItems.length > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-teal-100 text-teal-600 rounded-md">
                          {record.treatmentItems.slice(0, 2).map((t) => treatmentLabels[t]).join('、')}
                          {record.treatmentItems.length > 2 && ` +${record.treatmentItems.length - 2}`}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(record.createdAt)}</span>
                      <span className="mx-1">·</span>
                      <MessageCircle className="w-3 h-3" />
                      <span>{speeches.length} 条话术</span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-3 pb-3 pt-0 space-y-3 animate-fade-in">
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-xs text-gray-500 mb-2">沟通背景</p>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-xs">
                        {record.chiefComplaint && (
                          <div className="flex items-start gap-2">
                            <User className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-gray-500">患者主诉：</span>
                              <span className="text-gray-700">{chiefComplaintLabels[record.chiefComplaint]}</span>
                            </div>
                          </div>
                        )}
                        {record.treatmentItems && record.treatmentItems.length > 0 && (
                          <div className="flex items-start gap-2">
                            <Stethoscope className="w-3 h-3 text-teal-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-gray-500">涉及项目：</span>
                              <span className="text-gray-700">{record.treatmentItems.map((t) => treatmentLabels[t]).join('、')}</span>
                            </div>
                          </div>
                        )}
                        {record.patientConcerns && record.patientConcerns.length > 0 && (
                          <div className="flex items-start gap-2">
                            <Heart className="w-3 h-3 text-rose-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-gray-500">患者关心：</span>
                              <span className="text-gray-700">{record.patientConcerns.join('、')}</span>
                            </div>
                          </div>
                        )}
                        {!record.chiefComplaint && !record.treatmentItems && !record.patientConcerns && (
                          <p className="text-gray-400">未填写沟通背景</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-2">本次沉淀的话术：</p>
                      {speeches.length > 0 ? (
                        <div className="space-y-2">
                          {speeches.map((speech) => (
                            <div
                              key={speech.id}
                              className="p-2.5 bg-gray-50 rounded-lg group"
                            >
                              {editingSpeechId === speech.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    rows={2}
                                    className="w-full px-2.5 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none bg-white"
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={cancelEdit}
                                      className="px-2.5 py-1 text-xs text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                      取消
                                    </button>
                                    <button
                                      onClick={saveEdit}
                                      className="px-2.5 py-1 text-xs text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1"
                                    >
                                      <Save className="w-3 h-3" />
                                      保存
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-start gap-2">
                                  <p className="text-sm text-gray-700 flex-1">
                                    {speech.content}
                                  </p>
                                  <button
                                    onClick={() => startEdit(speech.id, speech.content)}
                                    className="p-1 text-gray-300 hover:text-amber-500 hover:bg-amber-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                              {editingSpeechId !== speech.id && (
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                  <span className="text-xs px-1.5 py-0.5 bg-white text-gray-500 rounded">
                                    {speech.tags.slice(0, 3).join(' / ')}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {formatDateShort(speech.updatedAt)}
                                    {speech.updatedAt > speech.createdAt + 1000 && ' (已编辑)'}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">本次复盘未沉淀话术</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <History className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mb-1">
            {hasActiveFilters ? '没有找到匹配的复盘记录' : '暂无复盘记录'}
          </p>
          <p className="text-xs text-gray-400">
            {hasActiveFilters ? '试试调整筛选条件' : '每次接诊后填写复盘，都会记录在这里'}
          </p>
        </div>
      )}
    </div>
  );
}
