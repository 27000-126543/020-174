
import { Bookmark, Trash2, Copy, Check, Tag } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

const categoryLabels: Record<string, string> = {
  greeting: '开场问候',
  medical_history: '病史追问',
  pre_exam: '检查前说明',
  treatment_explain: '方案解释',
  closing: '结束语',
};

export function SpeechLibrary() {
  const personalSpeeches = useAppStore((state) => state.personalSpeeches);
  const deletePersonalSpeech = useAppStore((state) => state.deletePersonalSpeech);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const categories = [...new Set(personalSpeeches.map((s) => s.category))];

  const filteredSpeeches = filterCategory
    ? personalSpeeches.filter((s) => s.category === filterCategory)
    : personalSpeeches;

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
          个人话术库
        </h3>
        <span className="text-xs text-gray-400">{personalSpeeches.length} 条</span>
      </div>

      {categories.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setFilterCategory(null)}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              filterCategory === null
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                filterCategory === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>
      )}

      {filteredSpeeches.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {filteredSpeeches.map((speech) => (
            <div
              key={speech.id}
              className="group p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-gray-700 flex-1">{speech.content}</p>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {copiedId === speech.id ? (
                    <span className="text-xs text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      已复制
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCopy(speech.content, speech.id)}
                      className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deletePersonalSpeech(speech.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white text-xs text-gray-500 rounded-md">
                  <Tag className="w-3 h-3" />
                  {categoryLabels[speech.category] || speech.category}
                </span>
                <span className="text-xs text-gray-400">{formatDate(speech.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Bookmark className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mb-1">暂无个人话术</p>
          <p className="text-xs text-gray-400">在接诊沟通中收藏或在复盘中沉淀</p>
        </div>
      )}
    </div>
  );
}
