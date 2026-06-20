
import { useState, useEffect } from 'react';
import { FileText, AlertCircle, ArrowLeftRight, StickyNote, Save } from 'lucide-react';
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

  const comparisonNotes = useAppStore((state) => state.comparisonNotes);
  const setComparisonNote = useAppStore((state) => state.setComparisonNote);

  const selectedCard = treatmentCards.find((c) => c.type === selectedTreatment);
  const cardA = treatmentCards.find((c) => c.type === compareA);
  const cardB = treatmentCards.find((c) => c.type === compareB);

  const pairKey = compareA && compareB ? `${compareA}__${compareB}` : '';
  const reversePairKey = compareA && compareB ? `${compareB}__${compareA}` : '';

  useEffect(() => {
    if (pairKey) {
      setCurrentNote(comparisonNotes[pairKey] || comparisonNotes[reversePairKey] || '');
    } else {
      setCurrentNote('');
    }
  }, [pairKey, reversePairKey, comparisonNotes]);

  const handleSaveNote = () => {
    if (pairKey) {
      setComparisonNote(pairKey, currentNote);
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FileText className="w-4 h-4 text-purple-500" />
          <span>选择治疗项目，查看患者易懂的解释话术</span>
        </div>
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

      <TreatmentSelector selected={selectedTreatment} onSelect={handleSelectSingle} />

      {viewMode === 'compare' && (
        <div className="bg-purple-50 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
          <ArrowLeftRight className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-purple-700">
            <p className="font-medium mb-1">对比模式</p>
            <p className="text-xs text-purple-600">
              请选择两个治疗项目进行对比。{compareA ? `已选方案A，${compareB ? '已选方案B' : '请选择方案B'}` : '请选择方案A'}
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
              <button
                onClick={handleSaveNote}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Save className="w-3 h-3" />
                保存备注
              </button>
            </div>
            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder={`记录患者对「${cardA.name}」和「${cardB.name}」最关心的问题、顾虑点、讲解重点等...`}
              rows={4}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-2">
              💡 备注会自动关联当前对比项目，下次切换到此组合时自动加载，刷新不丢失
            </p>
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
