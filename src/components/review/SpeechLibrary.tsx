
import { useState, useMemo } from 'react';
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
  Heart,
  Lightbulb,
  Plus,
  XCircle,
  CheckSquare,
  Square,
  ArrowRight,
  Clock,
  History,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { PersonalSpeech } from '@/types';

type SourceFilter = 'all' | 'consult_collect' | 'review_auto' | 'review_manual' | 'review_all';

const categoryLabels: Record<string, string> = {
  greeting: '开场问候',
  medical_history: '病史追问',
  pre_exam: '检查前说明',
  treatment_explain: '方案解释',
  closing: '结束语',
  objection_handling: '异议处理',
};

const sourceFilterOptions: { value: SourceFilter; label: string; icon: typeof Star; color: string }[] = [
  { value: 'all', label: '全部来源', icon: Star, color: 'bg-gray-100 text-gray-600' },
  { value: 'consult_collect', label: '接诊收藏', icon: Heart, color: 'bg-rose-100 text-rose-600' },
  { value: 'review_all', label: '全部复盘', icon: RotateCcw, color: 'bg-orange-100 text-orange-600' },
  { value: 'review_auto', label: '自动沉淀', icon: Sparkles, color: 'bg-amber-100 text-amber-600' },
  { value: 'review_manual', label: '复盘手写', icon: Pencil, color: 'bg-blue-100 text-blue-600' },
];

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

function getSourceInfo(speech: PersonalSpeech) {
  const source = speech.source || (speech.tags.includes('接诊收藏') ? 'consult_collect' : 'manual_edit');

  if (source === 'consult_collect') {
    const complaintTag = speech.tags.find((t) =>
      ['toothache', 'missing_tooth', 'malocclusion', 'cleaning'].includes(t)
    );
    const complaintLabels: Record<string, string> = {
      toothache: '牙痛',
      missing_tooth: '缺牙',
      malocclusion: '牙齿不齐',
      cleaning: '洗牙咨询',
    };
    return {
      label: '接诊收藏',
      color: 'bg-rose-100 text-rose-700',
      icon: Heart,
      detail: complaintTag
        ? `来自「${complaintLabels[complaintTag] || complaintTag}」接诊场景`
        : '接诊沟通中收藏',
      isReview: false,
    };
  }

  if (source === 'review_auto') {
    const isSmooth = speech.tags.includes('顺利复盘');
    const stuckTag = speech.tags.find((t) => commonStuckPoints.includes(t));
    const isCustom = speech.tags.includes('自定义卡点');

    if (isSmooth) {
      return {
        label: '复盘·顺利',
        color: 'bg-emerald-100 text-emerald-700',
        icon: Star,
        detail: '来自顺利沟通复盘',
        isReview: true,
      };
    }
    if (stuckTag) {
      return {
        label: `复盘·${stuckTag}`,
        color: 'bg-orange-100 text-orange-700',
        icon: RotateCcw,
        detail: `来自「${stuckTag}」卡点自动沉淀`,
        isReview: true,
      };
    }
    if (isCustom) {
      const customTag = speech.tags.find(
        (t) =>
          !['自动沉淀', '预设卡点', '自定义卡点', 'objection_handling'].includes(t) &&
          !commonStuckPoints.includes(t) && t !== speech.category
      );
      return {
        label: '复盘·自定义卡点',
        color: 'bg-violet-100 text-violet-700',
        icon: Lightbulb,
        detail: customTag ? `针对「${customTag}」自动生成` : '自定义卡点自动沉淀',
        isReview: true,
      };
    }
    return {
      label: '复盘·自动沉淀',
      color: 'bg-amber-100 text-amber-700',
      icon: Sparkles,
      detail: '系统自动生成话术',
      isReview: true,
    };
  }

  if (source === 'review_manual') {
    return {
      label: '复盘·手写',
      color: 'bg-blue-100 text-blue-700',
      icon: Pencil,
      detail: '复盘时手动输入保存',
      isReview: true,
    };
  }

  return {
    label: '手动编辑',
    color: 'bg-indigo-100 text-indigo-700',
    icon: Star,
    detail: '手动编辑保存',
    isReview: false,
  };
}

function matchesSourceFilter(speech: PersonalSpeech, filter: SourceFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'review_all') {
    return speech.source === 'review_auto' || speech.source === 'review_manual';
  }
  return speech.source === filter;
}

export function SpeechLibrary() {
  const personalSpeeches = useAppStore((state) => state.personalSpeeches);
  const deletePersonalSpeech = useAppStore((state) => state.deletePersonalSpeech);
  const updatePersonalSpeech = useAppStore((state) => state.updatePersonalSpeech);
  const batchUpdateCategory = useAppStore((state) => state.batchUpdateCategory);
  const addTagToSpeeches = useAppStore((state) => state.addTagToSpeeches);
  const removeTagFromSpeech = useAppStore((state) => state.removeTagFromSpeech);
  const reviewRecords = useAppStore((state) => state.reviewRecords);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterSource, setFilterSource] = useState<SourceFilter>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBatchBar, setShowBatchBar] = useState(false);
  const [batchCategory, setBatchCategory] = useState('');
  const [showBatchCategory, setShowBatchCategory] = useState(false);
  const [addingTagToId, setAddingTagToId] = useState<string | null>(null);
  const [newTagInput, setNewTagInput] = useState('');
  const [showBatchTagInput, setShowBatchTagInput] = useState(false);
  const [batchTagInput, setBatchTagInput] = useState('');
  const [jumpToReviewId, setJumpToReviewId] = useState<string | null>(null);

  const categories = [...new Set(personalSpeeches.map((s) => s.category))];
  const allTags = [...new Set(personalSpeeches.flatMap((s) => s.tags))];

  const filteredSpeeches = personalSpeeches
    .filter((s) => matchesSourceFilter(s, filterSource))
    .filter((s) => !filterCategory || s.category === filterCategory)
    .filter((s) => {
      if (!searchKeyword.trim()) return true;
      const kw = searchKeyword.toLowerCase();
      const sourceInfo = getSourceInfo(s);
      return (
        s.content.toLowerCase().includes(kw) ||
        s.tags.some((t) => t.toLowerCase().includes(kw)) ||
        (categoryLabels[s.category] || '').includes(kw) ||
        sourceInfo.label.includes(kw) ||
        sourceInfo.detail.includes(kw)
      );
    })
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const getReviewForSpeech = (reviewId?: string) => {
    if (!reviewId) return null;
    return reviewRecords.find((r) => r.id === reviewId) || null;
  };

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      setShowBatchBar(next.size > 0);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filteredSpeeches.length) {
      setSelectedIds(new Set());
      setShowBatchBar(false);
    } else {
      setSelectedIds(new Set(filteredSpeeches.map((s) => s.id)));
      setShowBatchBar(true);
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setShowBatchBar(false);
    setShowBatchCategory(false);
    setBatchCategory('');
    setShowBatchTagInput(false);
    setBatchTagInput('');
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
      const originalSpeech = personalSpeeches.find((s) => s.id === editingId);
      updatePersonalSpeech(editingId, {
        content: editContent.trim(),
        category: editCategory,
        tags: originalSpeech?.tags || [],
      });
      setEditingId(null);
      setEditContent('');
      setEditCategory('');
    }
  };

  const handleBatchUpdateCategory = () => {
    if (selectedIds.size > 0 && batchCategory) {
      batchUpdateCategory([...selectedIds], batchCategory);
      clearSelection();
    }
  };

  const handleAddTag = (id: string) => {
    if (newTagInput.trim()) {
      addTagToSpeeches([id], newTagInput.trim());
      setAddingTagToId(null);
      setNewTagInput('');
    }
  };

  const handleBatchAddTag = () => {
    if (selectedIds.size > 0 && batchTagInput.trim()) {
      addTagToSpeeches([...selectedIds], batchTagInput.trim());
      clearSelection();
    }
  };

  const handleRemoveTag = (id: string, tag: string) => {
    removeTagFromSpeech(id, tag);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const formatFullDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleJumpToReview = (reviewId: string) => {
    setJumpToReviewId(reviewId);
    setTimeout(() => {
      setJumpToReviewId(null);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
      {jumpToReviewId && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-20 animate-fade-in flex items-center gap-2">
          <ArrowRight className="w-4 h-4" />
          请在上方「复盘历史记录」中查看对应复盘
        </div>
      )}

      {showBatchBar && (
        <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-blue-700 font-medium">
              已选 {selectedIds.size} 条
            </span>
            {!showBatchCategory && !showBatchTagInput && (
              <>
                <button
                  onClick={() => setShowBatchCategory(true)}
                  className="px-3 py-1 text-xs bg-white text-blue-600 rounded-md hover:bg-blue-50 border border-blue-200 transition-colors flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  批量改分类
                </button>
                <button
                  onClick={() => setShowBatchTagInput(true)}
                  className="px-3 py-1 text-xs bg-white text-emerald-600 rounded-md hover:bg-emerald-50 border border-emerald-200 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  批量加标签
                </button>
              </>
            )}
            {showBatchCategory && (
              <div className="flex items-center gap-2">
                <select
                  value={batchCategory}
                  onChange={(e) => setBatchCategory(e.target.value)}
                  className="px-2 py-1 text-xs border border-blue-300 rounded-md bg-white"
                >
                  <option value="">选择分类</option>
                  {allCategories.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <button
                  onClick={handleBatchUpdateCategory}
                  disabled={!batchCategory}
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  确定
                </button>
                <button
                  onClick={() => { setShowBatchCategory(false); setBatchCategory(''); }}
                  className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                >
                  取消
                </button>
              </div>
            )}
            {showBatchTagInput && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={batchTagInput}
                  onChange={(e) => setBatchTagInput(e.target.value)}
                  placeholder="输入标签名称..."
                  className="px-2 py-1 text-xs border border-emerald-300 rounded-md w-32"
                />
                <button
                  onClick={handleBatchAddTag}
                  disabled={!batchTagInput.trim()}
                  className="px-2 py-1 text-xs bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  确定
                </button>
                <button
                  onClick={() => { setShowBatchTagInput(false); setBatchTagInput(''); }}
                  className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                >
                  取消
                </button>
              </div>
            )}
          </div>
          <button
            onClick={clearSelection}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
          个人话术库
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{personalSpeeches.length} 条</span>
          <button
            onClick={selectAll}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors ${
              selectedIds.size > 0
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {selectedIds.size === filteredSpeeches.length && filteredSpeeches.length > 0 ? (
              <CheckSquare className="w-3.5 h-3.5" />
            ) : (
              <Square className="w-3.5 h-3.5" />
            )}
            多选
          </button>
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
                {sourceFilterOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = filterSource === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setFilterSource(filterSource === opt.value ? 'all' : opt.value)}
                      className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-md transition-all ${
                        isActive ? opt.color : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {opt.label}
                    </button>
                  );
                })}
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
        <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
          {filteredSpeeches.map((speech) => {
            const sourceInfo = getSourceInfo(speech);
            const SourceIcon = sourceInfo.icon;
            const isSelected = selectedIds.has(speech.id);
            const review = getReviewForSpeech(speech.reviewId);
            const hasBeenEdited = speech.updatedAt > speech.createdAt + 1000;

            return (
              <div
                key={speech.id}
                className={`group p-3 rounded-xl border transition-all duration-200 ${
                  editingId === speech.id
                    ? 'bg-blue-50 border-blue-300'
                    : isSelected
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border-transparent'
                }`}
              >
                {showBatchBar && (
                  <div className="absolute -left-2 -top-2">
                    <button
                      onClick={() => toggleSelect(speech.id)}
                      className="p-0.5 bg-white rounded border border-blue-300"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-300" />
                      )}
                    </button>
                  </div>
                )}

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
                            t !== '接诊收藏' &&
                            !commonStuckPoints.includes(t) &&
                            !['toothache', 'missing_tooth', 'malocclusion', 'cleaning', 'adult', 'child', 'teen', 'senior', 'low', 'medium', 'high'].includes(t)
                        )
                        .map((tag) => (
                          <span
                            key={tag}
                            className="group/tag inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded-md"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(speech.id, tag)}
                              className="ml-0.5 text-gray-400 hover:text-red-500 opacity-0 group-hover/tag:opacity-100 transition-opacity"
                            >
                              <XCircle className="w-3 h-3" />
                            </button>
                          </span>
                        ))}

                      {addingTagToId === speech.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            placeholder="新标签"
                            className="px-2 py-0.5 text-xs border border-emerald-300 rounded-md w-20"
                            autoFocus
                          />
                          <button
                            onClick={() => handleAddTag(speech.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { setAddingTagToId(null); setNewTagInput(''); }}
                            className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingTagToId(speech.id)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-emerald-600 hover:bg-emerald-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Plus className="w-3 h-3" />
                          加标签
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 pl-1 flex-wrap">
                      <p className="text-xs text-gray-400">{sourceInfo.detail}</p>
                      <div className="flex items-center gap-2 ml-auto">
                        {hasBeenEdited && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            编辑于 {formatDate(speech.updatedAt)}
                          </span>
                        )}
                        {!hasBeenEdited && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            {formatDate(speech.createdAt)}
                          </span>
                        )}
                        {speech.reviewId && review && (
                          <button
                            onClick={() => handleJumpToReview(speech.reviewId!)}
                            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600"
                          >
                            <History className="w-3 h-3" />
                            查看复盘
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
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
