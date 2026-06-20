
import { useState } from 'react';
import {
  Bookmark,
  Trash2,
  Copy,
  Check,
  Tag,
  Search,
  Pencil,
  X,
  Save,
  Sparkles,
  Star,
  RotateCcw,
  Filter,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

type SourceFilter = 'all' | 'auto' | 'manual' | 'review';

const categoryLabels: Record<string, string> = {
  greeting: '开场问候',
  medical_history: '病史追问',
  pre_exam: '检查前说明',
  treatment_explain: '方案解释',
  closing: '结束语',
  objection_handling: '异议处理',
};

const sourceLabels: Record<SourceFilter, string> = {
  all: '全部来源',
  auto: '自动沉淀',
  manual: '手动收藏',
  review: '复盘来源',
};

const allCategories = Object.entries(categoryLabels);

const commonStuckPoints = [
  '费用太贵',
  '担心疼痛',
  '对效果不确定',
  '时间安排问题',
  '想再考虑考虑',
  '不信任方案',
  '和家人商量',
];

function getSpeechSource(tags: string[]): 'auto' | 'manual' {
  return tags.includes('自动沉淀') ? 'auto' : 'manual';
}

function getSourceInfo(tags: string[]) {
  const isAuto = tags.includes('自动沉淀');
  const isManual = tags.includes('手动沉淀');
  const isSmooth = tags.includes('顺利复盘');
  const stuckPointTag = tags.find((t) => commonStuckPoints.includes(t) || t === '自定义卡点' || t === '预设卡点');
  const customTag = tags.find((t) => !Object.values(categoryLabels).includes(t) && t !== '自动沉淀' && t !== '手动沉淀' && t !== '自定义卡点' && t !== '预设卡点' && t !== '顺利复盘');

  if (isSmooth) {
    return {
      label: '复盘 · 顺利',
      color: 'bg-emerald-100 text-emerald-700',
      icon: Star,
      detail: '来自顺利沟通复盘',
    };
  }

  if (stuckPointTag && stuckPointTag !== '预设卡点' && stuckPointTag !== '自定义卡点') {
    return {
      label: `复盘 · ${stuckPointTag}`,
      color: 'bg-orange-100 text-orange-700',
      icon: RotateCcw,
      detail: `来自「${stuckPointTag}」卡点复盘`,
    };
  }

  if (isAuto) {
    return {
      label: '自动沉淀',
      color: 'bg-amber-100 text-amber-700',
      icon: Sparkles,
      detail: customTag ? `关联「${customTag}」` : '系统自动生成',
    };
  }

  if (isManual) {
    return {
      label: '手动沉淀',
      color: 'bg-blue-100 text-blue-700',
      icon: Star,
      detail: '复盘时手动输入保存',
    };
  }

  return {
    label: '手动收藏',
    color: 'bg-indigo-100 text-indigo-700',
    icon: Star,
    detail: customTag ? `来自「${customTag}」场景收藏` : '接诊沟通中收藏',
  };
}

export function SpeechLibrary() {
  const personalSpeeches = useAppStore((state) => state.personalSpeeches);
  const deletePersonalSpeech = useAppStore((state) => state.deletePersonalSpeech);
  const updatePersonalSpeech = useAppStore((state) => state.updatePersonalSpeech);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterSource, setFilterSource] = useState<SourceFilter>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [...new Set(personalSpeeches.map((s) => s.category))];

  const filteredSpeeches = personalSpeeches
    .filter((s) => !filterCategory || s.category === filterCategory)
    .filter((s) => {
      if (filterSource === 'all') return true;
      if (filterSource === 'auto') return getSpeechSource(s.tags) === 'auto';
      if (filterSource === 'manual') return getSpeechSource(s.tags) === 'manual';
      if (filterSource === 'review') return s.tags.includes('顺利复盘') || s.tags.some((t) => commonStuckPoints.includes(t));
      return true;
    })
    .filter((s) => {
      if (!searchKeyword.trim()) return true;
      const kw = searchKeyword.toLowerCase();
      const sourceInfo = getSourceInfo(s.tags);
      return (
        s.content.toLowerCase().includes(kw) ||
        s.tags.some((t) => t.toLowerCase().includes(kw)) ||
        (categoryLabels[s.category] || '').includes(kw) ||
        sourceInfo.label.includes(kw) ||
        sourceInfo.detail.includes(kw)
      );
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const startEdit = (id: string, content: string, category: string) => {
    setEditingId(id);
    setEditContent(content);
    setEditCategory(category);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
    setEditCategory('');
  };

  const saveEdit = () => {
    if (editingId && editContent.trim()) {
      updatePersonalSpeech(editingId, {
        content: editContent.trim(),
        category: editCategory,
      });
      setEditingId(null);
      setEditContent('');
      setEditCategory('');
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
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{personalSpeeches.length} 条</span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors ${
              showFilters || filterSource !== 'all' || filterCategory
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            筛选
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="搜索话术内容、标签、来源..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {showFilters && (
          <div className="space-y-3 animate-fade-in">
            <div>
              <p className="text-xs text-gray-500 mb-2">来源筛选</p>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(sourceLabels) as SourceFilter[]).map((src) => (
                  <button
                    key={src}
                    onClick={() => setFilterSource(filterSource === src ? 'all' : src)}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      filterSource === src
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {sourceLabels[src]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">分类筛选</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterCategory(null)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    filterCategory === null
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  全部分类
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
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
            </div>
            {(filterSource !== 'all' || filterCategory) && (
              <button
                onClick={() => {
                  setFilterSource('all');
                  setFilterCategory(null);
                }}
                className="text-xs text-blue-500 hover:text-blue-600"
              >
                清除所有筛选
              </button>
            )}
          </div>
        )}
      </div>

      {filteredSpeeches.length > 0 ? (
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {filteredSpeeches.map((speech) => {
            const sourceInfo = getSourceInfo(speech.tags);
            const SourceIcon = sourceInfo.icon;
            return (
              <div
                key={speech.id}
                className={`group p-3 rounded-xl border transition-all duration-200 ${
                  editingId === speech.id
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border-transparent'
                }`}
              >
                {editingId === speech.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none bg-white"
                    />
                    <div className="flex gap-2 flex-wrap">
                      {allCategories.map(([value, label]) => (
                        <button
                          key={value}
                          onClick={() => setEditCategory(value)}
                          className={`px-2 py-0.5 text-xs rounded-md transition-colors ${
                            editCategory === value
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1.5 text-xs text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        取消
                      </button>
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1.5 text-xs text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                      >
                        <Save className="w-3 h-3" />
                        保存
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-700 flex-1 leading-relaxed">{speech.content}</p>
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
                          onClick={() => startEdit(speech.id, speech.content, speech.category)}
                          className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePersonalSpeech(speech.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white text-xs text-gray-500 rounded-md">
                        <Tag className="w-3 h-3" />
                        {categoryLabels[speech.category] || speech.category}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md ${sourceInfo.color}`}
                        title={sourceInfo.detail}
                      >
                        <SourceIcon className="w-3 h-3" />
                        {sourceInfo.label}
                      </span>
                      {speech.tags
                        .filter(
                          (t) =>
                            t &&
                            t !== speech.category &&
                            t !== '自动沉淀' &&
                            t !== '手动沉淀' &&
                            t !== '自定义卡点' &&
                            t !== '预设卡点' &&
                            t !== '顺利复盘' &&
                            !commonStuckPoints.includes(t)
                        )
                        .slice(0, 2)
                        .map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-gray-100 text-xs text-gray-500 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      <span className="text-xs text-gray-400 ml-auto">{formatDate(speech.createdAt)}</span>
                    </div>
                    <div className="mt-1.5 pl-1">
                      <p className="text-xs text-gray-400">{sourceInfo.detail}</p>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Bookmark className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mb-1">
            {searchKeyword || filterSource !== 'all' || filterCategory
              ? '没有找到匹配的话术'
              : '暂无个人话术'}
          </p>
          <p className="text-xs text-gray-400">
            {searchKeyword || filterSource !== 'all' || filterCategory
              ? '试试调整搜索关键词或筛选条件'
              : '在接诊沟通中收藏或在复盘中沉淀'}
          </p>
        </div>
      )}
    </div>
  );
}
