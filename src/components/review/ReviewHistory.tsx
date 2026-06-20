
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
  Trash2,
  MessageCircle,
  Calendar,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function ReviewHistory() {
  const reviewRecords = useAppStore((state) => state.reviewRecords);
  const personalSpeeches = useAppStore((state) => state.personalSpeeches);
  const updatePersonalSpeech = useAppStore((state) => state.updatePersonalSpeech);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingSpeechId, setEditingSpeechId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getSpeechesForReview = (speechIds?: string[]) => {
    if (!speechIds || speechIds.length === 0) return [];
    return personalSpeeches.filter((s) => speechIds.includes(s.id));
  };

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

  const sortedRecords = [...reviewRecords].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-1 h-5 bg-rose-500 rounded-full"></span>
          复盘历史记录
        </h3>
        <span className="text-xs text-gray-400">{reviewRecords.length} 条</span>
      </div>

      {sortedRecords.length > 0 ? (
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {sortedRecords.map((record) => {
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
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800">
                        {record.isSmooth ? '沟通顺利' : '沟通受阻'}
                      </span>
                      {!record.isSmooth && record.stuckPoint && (
                        <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded-md">
                          {record.stuckPoint}
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
                  <div className="px-3 pb-3 pt-0 space-y-2 animate-fade-in">
                    <div className="border-t border-gray-100 pt-3">
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
          <p className="text-sm text-gray-500 mb-1">暂无复盘记录</p>
          <p className="text-xs text-gray-400">
            每次接诊后填写复盘，都会记录在这里
          </p>
        </div>
      )}
    </div>
  );
}
