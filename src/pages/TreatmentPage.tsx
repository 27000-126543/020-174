
import { useState, useEffect, useRef } from 'react';
import {
  FileText,
  AlertCircle,
  ArrowLeftRight,
  StickyNote,
  Star,
  Plus,
  Trash2,
  Check,
  Bookmark,
  X,
} from 'lucide-react';
import type { TreatmentType } from '@/types';
import { treatmentCards } from '@/data/treatments';
import { TreatmentSelector } from '@/components/treatment/TreatmentSelector';
import { TreatmentCardComponent } from '@/components/treatment/TreatmentCard';
import { TreatmentComparison } from '@/components/treatment/TreatmentComparison';
import { useAppStore } from '@/store/useAppStore';

type ViewMode = 'single' | 'compare';

export function TreatmentPage() {
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentType | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [compareA, setCompareA] = useState<TreatmentType | null>(null);
  const [compareB, setCompareB] = useState<TreatmentType | null>(null);
  const [currentNote, setCurrentNote] = useState('');
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showFavorites, setShowFavorites] = useState(false);
  const [newFavName, setNewFavName] = useState('');
  const [showAddFavInput, setShowAddFavInput] = useState(false);

  const comparisonNotes = useAppStore((state) => state.comparisonNotes);
  const setComparisonNote = useAppStore((state) => state.setComparisonNote);
  const favoriteComparisons = useAppStore((state) => state.favoriteComparisons);
  const addFavoriteComparison = useAppStore((state) => state.addFavoriteComparison);
  const deleteFavoriteComparison = useAppStore((state) => state.deleteFavoriteComparison);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedCard = treatmentCards.find((c) => c.type === selectedTreatment);
  const cardA = treatmentCards.find((c) => c.type === compareA);
  const cardB = treatmentCards.find((c) => c.type === compareB);

  const pairKey = compareA && compareB ? `${compareA}__${compareB}` : '';
  const reversePairKey = compareA && compareB ? `${compareB}__${compareA}` : '';

  useEffect(() => {
    if (pairKey) {
      const existingNote = comparisonNotes[pairKey] || comparisonNotes[reversePairKey] || '';
      setCurrentNote(existingNote);
    } else {
      setCurrentNote('');
    }
  }, [pairKey, reversePairKey]);

  useEffect(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    if (!pairKey) return;

    setSavingStatus('saving');
    saveTimerRef.current = setTimeout(() => {
      setComparisonNote(pairKey, currentNote);
      setSavingStatus('saved');
      setTimeout(() => setSavingStatus('idle'), 1000);
    }, 500);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [currentNote, pairKey]);

  const handleSelectSingle = (type: TreatmentType | null) => {
    setSelectedTreatment(type);
    if (viewMode === 'compare') {
      if (!compareA) {
        setCompareA(type);
      } else if (!compareB && type !== compareA) {
        setCompareB(type);
      }
    }
  };

  const handleToggleCompare = () => {
    if (viewMode === 'single') {
      setViewMode('compare');
      setCompareA(selectedTreatment);
      setCompareB(null);
    } else {
      setViewMode('single');
      setCompareA(null);
      setCompareB(null);
    }
  };

  const canCompare = viewMode === 'compare' && compareA && compareB;

  const handleAddFavorite = () => {
    if (!compareA || !compareB) return;
    const name = newFavName.trim() || `${cardA?.name} vs ${cardB?.name}`;
    addFavoriteComparison({
      treatmentA: compareA,
      treatmentB: compareB,
      name,
      note: currentNote,
    });
    setShowAddFavInput(false);
    setNewFavName('');
  };

  const handleOpenFavorite = (fav: typeof favoriteComparisons[0]) => {
    setViewMode('compare');
    setCompareA(fav.treatmentA);
    setCompareB(fav.treatmentB);
    setSelectedTreatment(fav.treatmentA);
  };

  const isCurrentFavorite = favoriteComparisons.some(
    (f) =>
      (f.treatmentA === compareA && f.treatmentB === compareB) ||
      (f.treatmentA === compareB && f.treatmentB === compareA)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FileText className="w-4 h-4 text-purple-500" />
          <span>选择治疗项目，查看患者易懂的解释话术</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-xl border transition-all duration-200 ${
              showFavorites
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-amber-600 border-amber-200 hover:border-amber-400 hover:bg-amber-50'
            }`}
          >
            <Star className="w-4 h-4" />
            常用组合
            {favoriteComparisons.length > 0 && (
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                {favoriteComparisons.length}
              </span>
            )}
          </button>
          <button
            onClick={handleToggleCompare}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl border transition-all duration-200 ${
              viewMode === 'compare'
                ? 'bg-purple-500 text-white border-purple-500'
                : 'bg-white text-purple-600 border-purple-200 hover:border-purple-400 hover:bg-purple-50'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            {viewMode === 'compare' ? '退出对比' : '对比模式'}
          </button>
        </div>
      </div>

      {showFavorites && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-500" />
              常用对比组合
            </h3>
            {canCompare && !showAddFavInput && (
              <button
                onClick={() => setShowAddFavInput(true)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-amber-600 bg-amber-50 rounded-md hover:bg-amber-100 transition-colors"
              >
                <Plus className="w-3 h-3" />
                收藏当前组合
              </button>
            )}
          </div>

          {showAddFavInput && canCompare && (
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newFavName}
                onChange={(e) => setNewFavName(e.target.value)}
                placeholder={`${cardA?.name} vs ${cardB?.name}`}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                autoFocus
              />
              <button
                onClick={handleAddFavorite}
                className="px-3 py-2 text-xs text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                确定
              </button>
              <button
                onClick={() => {
                  setShowAddFavInput(false);
                  setNewFavName('');
                }}
                className="px-3 py-2 text-xs text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
            </div>
          )}

          {favoriteComparisons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {favoriteComparisons.map((fav) => {
                const fa = treatmentCards.find((c) => c.type === fav.treatmentA);
                const fb = treatmentCards.find((c) => c.type === fav.treatmentB);
                const isCurrent =
                  (compareA === fav.treatmentA && compareB === fav.treatmentB) ||
                  (compareA === fav.treatmentB && compareB === fav.treatmentA);
                return (
                  <div
                    key={fav.id}
                    className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-50 border-amber-300'
                        : 'bg-gray-50 border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                    onClick={() => handleOpenFavorite(fav)}
                  >
                    <p className="text-sm font-medium text-gray-800 mb-1">{fav.name}</p>
                    <p className="text-xs text-gray-500">
                      {fa?.name} vs {fb?.name}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFavoriteComparison(fav.id);
                      }}
                      className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {isCurrent && (
                      <span className="absolute top-2 right-2 text-xs text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                        当前
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-400">
                暂无常用组合，在对比模式下可收藏当前组合
              </p>
            </div>
          )}
        </div>
      )}

      <TreatmentSelector selected={selectedTreatment} onSelect={handleSelectSingle} />

      {viewMode === 'compare' && (
        <div className="bg-purple-50 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
          <ArrowLeftRight className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-purple-700">
            <p className="font-medium mb-1">对比模式</p>
            <p className="text-xs text-purple-600">
              请选择两个治疗项目进行对比。{compareA ? `已选方案A（${cardA?.name}），` : '请选择方案A，'}
              {compareB ? `已选方案B（${cardB?.name}）` : '请选择方案B'}
            </p>
          </div>
        </div>
      )}

      {viewMode === 'single' && selectedCard ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
            <h2 className="text-xl font-bold mb-2">{selectedCard.name}</h2>
            <p className="text-purple-100 text-sm">用患者听得懂的方式，解释清楚每个细节</p>
          </div>
          <TreatmentCardComponent card={selectedCard} />
        </div>
      ) : viewMode === 'compare' && canCompare && cardA && cardB ? (
        <div className="space-y-4 animate-fade-in">
          <TreatmentComparison cardA={cardA} cardB={cardB} />

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-amber-500" />
                医生讲解备注
                <span className="text-xs text-gray-400 font-normal">
                  （{cardA.name} vs {cardB.name}）
                </span>
              </h3>
              <div className="flex items-center gap-2">
                {savingStatus === 'saving' && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></span>
                    正在保存...
                  </span>
                )}
                {savingStatus === 'saved' && (
                  <span className="text-xs text-emerald-500 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    已自动保存
                  </span>
                )}
                {isCurrentFavorite && (
                  <span className="text-xs text-amber-600 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500" />
                    已收藏
                  </span>
                )}
              </div>
            </div>
            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder={`记录患者对「${cardA.name}」和「${cardB.name}」最关心的问题、顾虑点、讲解重点等...\n\n💡 输入会自动保存，无需手动点击保存按钮`}
              rows={5}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-400">
                ✨ 边写边存，切换项目组合、刷新页面都不会丢失
              </p>
              <div className="flex gap-2">
                {!isCurrentFavorite ? (
                  <button
                    onClick={() => {
                      setShowFavorites(true);
                      setShowAddFavInput(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    收藏组合
                  </button>
                ) : (
                  <span className="flex items-center gap-1 px-3 py-1.5 text-xs text-amber-600 bg-amber-50 rounded-lg">
                    <Star className="w-3 h-3 fill-amber-500" />
                    已在常用组合中
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-600 font-medium mb-2">
            {viewMode === 'compare' ? '请选择两个项目进行对比' : '请先选择治疗项目'}
          </h3>
          <p className="text-sm text-gray-400">
            {viewMode === 'compare'
              ? '在上方选择两个不同的治疗项目即可查看对比'
              : '选择后将展示患者易懂的解释话术'}
          </p>
        </div>
      )}

      {selectedCard && viewMode === 'single' && (
        <div className="bg-purple-50 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-purple-700">
            <p className="font-medium mb-1">沟通技巧</p>
            <ul className="text-purple-600 space-y-1 text-xs">
              <li>• 用通俗比喻代替专业术语，让患者更容易理解</li>
              <li>• 先讲好处再讲费用，降低患者对价格的敏感度</li>
              <li>• 强调"这是正常的"，减少患者的焦虑和担心</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
