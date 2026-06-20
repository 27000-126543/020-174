
import { useState } from 'react';
import { Copy, Check, ThumbsDown, Minimize2, Bookmark } from 'lucide-react';
import type { SpeechItem, SpeechFeedback } from '@/types';
import { useAppStore } from '@/store/useAppStore';

interface SpeechItemProps {
  item: SpeechItem;
  index: number;
}

export function SpeechItemComponent({ item, index }: SpeechItemProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<SpeechFeedback>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const addPersonalSpeech = useAppStore((state) => state.addPersonalSpeech);
  const [saved, setSaved] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleFeedback = (type: SpeechFeedback) => {
    setFeedback(feedback === type ? null : type);
  };

  const handleSave = () => {
    addPersonalSpeech({
      content: item.content,
      category: item.section,
      tags: item.tags,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div
      className={`group relative flex items-start gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer ${
        feedback
          ? feedback === 'too_stiff'
            ? 'bg-orange-50 border border-orange-200'
            : 'bg-purple-50 border border-purple-200'
          : 'hover:bg-blue-50 hover:border-blue-200 border border-transparent'
      }`}
      onClick={handleCopy}
      onMouseEnter={() => setShowFeedback(true)}
      onMouseLeave={() => setShowFeedback(false)}
    >
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center font-medium group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
        {index + 1}
      </span>
      <p className="flex-1 text-sm text-gray-700 leading-relaxed">{item.content}</p>
      
      <div className="flex-shrink-0 flex items-center gap-1">
        {copied ? (
          <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
            <Check className="w-3 h-3" />
            已复制
          </span>
        ) : (
          <button
            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
          >
            <Copy className="w-4 h-4" />
          </button>
        )}
        
        {saved ? (
          <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
            <Check className="w-3 h-3" />
            已收藏
          </span>
        ) : (
          <button
            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            title="收藏到个人话术库"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        )}
      </div>

      {showFeedback && (
        <div className="absolute right-2 -bottom-8 flex gap-1 bg-white shadow-lg rounded-lg p-1 border border-gray-100 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFeedback('too_stiff');
            }}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors ${
              feedback === 'too_stiff'
                ? 'bg-orange-100 text-orange-600'
                : 'text-gray-500 hover:bg-orange-50 hover:text-orange-500'
            }`}
          >
            <ThumbsDown className="w-3 h-3" />
            太生硬
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFeedback('need_simplify');
            }}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors ${
              feedback === 'need_simplify'
                ? 'bg-purple-100 text-purple-600'
                : 'text-gray-500 hover:bg-purple-50 hover:text-purple-500'
            }`}
          >
            <Minimize2 className="w-3 h-3" />
            需简化
          </button>
        </div>
      )}
    </div>
  );
}
