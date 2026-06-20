
import { Smile, Stethoscope } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">口腔接诊话术提示台</h1>
            <p className="text-xs text-blue-100">专业 · 温暖 · 高效</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-100">
          <Stethoscope className="w-4 h-4" />
          <span>张医生</span>
        </div>
      </div>
    </header>
  );
}
