
import { MessageCircle, FileText, RotateCcw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { TabType } from '@/types';

const tabs: { key: TabType; label: string; icon: typeof MessageCircle }[] = [
  { key: 'consultation', label: '初诊沟通', icon: MessageCircle },
  { key: 'treatment', label: '治疗方案', icon: FileText },
  { key: 'review', label: '接诊复盘', icon: RotateCcw },
];

export function TabNav() {
  const activeTab = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);

  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6">
        <nav className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                  isActive
                    ? 'text-blue-600 border-blue-600 bg-blue-50/50'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
