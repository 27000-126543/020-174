
import { useState } from 'react';
import { ThumbsUp, ThumbsDown, AlertCircle, Save, Check } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const stuckPointOptions = [
  '费用太贵',
  '担心疼痛',
  '对效果不确定',
  '时间安排问题',
  '想再考虑考虑',
  '不信任方案',
  '和家人商量',
  '其他',
];

const categoryOptions = [
  { value: 'greeting', label: '开场问候' },
  { value: 'medical_history', label: '病史追问' },
  { value: 'pre_exam', label: '检查前说明' },
  { value: 'treatment_explain', label: '方案解释' },
  { value: 'closing', label: '结束语' },
];

export function ReviewForm() {
  const [isSmooth, setIsSmooth] = useState<boolean | null>(null);
  const [selectedStuckPoints, setSelectedStuckPoints] = useState<string[]>([]);
  const [customStuckPoint, setCustomStuckPoint] = useState('');
  const [speechContent, setSpeechContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('treatment_explain');
  const [saved, setSaved] = useState(false);

  const addReviewRecord = useAppStore((state) => state.addReviewRecord);
  const addPersonalSpeech = useAppStore((state) => state.addPersonalSpeech);

  const toggleStuckPoint = (point: string) => {
    setSelectedStuckPoints((prev) =>
      prev.includes(point) ? prev.filter((p) => p !== point) : [...prev, point]
    );
  };

  const handleSave = () => {
    if (isSmooth !== null) {
      addReviewRecord({
        isSmooth,
        stuckPoint: [...selectedStuckPoints, customStuckPoint].filter(Boolean).join('、'),
        speechContent,
      });
    }

    if (speechContent.trim()) {
      addPersonalSpeech({
        content: speechContent.trim(),
        category: selectedCategory,
        tags: [selectedCategory],
      });
    }

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setIsSmooth(null);
      setSelectedStuckPoints([]);
      setCustomStuckPoint('');
      setSpeechContent('');
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-base font-semibold text-gray-800 mb-5 flex items-center gap-2">
        <span className="w-1 h-5 bg-amber-500 rounded-full"></span>
        本次沟通复盘
      </h3>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">沟通是否顺利？</label>
          <div className="flex gap-3">
            <button
              onClick={() => setIsSmooth(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all duration-200 ${
                isSmooth === true
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <ThumbsUp className="w-5 h-5" />
              <span className="font-medium">很顺利</span>
            </button>
            <button
              onClick={() => setIsSmooth(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all duration-200 ${
                isSmooth === false
                  ? 'border-orange-500 bg-orange-50 text-orange-600'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <ThumbsDown className="w-5 h-5" />
              <span className="font-medium">不太顺</span>
            </button>
          </div>
        </div>

        {isSmooth === false && (
          <div className="animate-fade-in">
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              患者主要卡在哪些问题？
            </label>
            <div className="flex flex-wrap gap-2">
              {stuckPointOptions.map((point) => {
                const isSelected = selectedStuckPoints.includes(point);
                return (
                  <button
                    key={point}
                    onClick={() => toggleStuckPoint(point)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-all duration-200 ${
                      isSelected
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {point}
                  </button>
                );
              })}
            </div>
            {selectedStuckPoints.includes('其他') && (
              <input
                type="text"
                value={customStuckPoint}
                onChange={(e) => setCustomStuckPoint(e.target.value)}
                placeholder="请输入其他卡点问题..."
                className="mt-3 w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            )}
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            沉淀优质话术（选填）
          </label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {categoryOptions.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <textarea
            value={speechContent}
            onChange={(e) => setSpeechContent(e.target.value)}
            placeholder="把今天用得好的话术记录下来，沉淀为个人常用话术..."
            rows={4}
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saved}
          className={`w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-[0.98]'
          }`}
        >
          {saved ? (
            <>
              <Check className="w-5 h-5" />
              保存成功
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              保存复盘
            </>
          )}
        </button>
      </div>

      <div className="mt-4 bg-amber-50 rounded-xl p-3 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          定期复盘接诊过程，积累个人话术库，逐步形成自己的沟通风格
        </p>
      </div>
    </div>
  );
}
