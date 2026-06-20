
import { Header } from '@/components/layout/Header';
import { TabNav } from '@/components/layout/TabNav';
import { ConsultationPage } from '@/pages/ConsultationPage';
import { TreatmentPage } from '@/pages/TreatmentPage';
import { ReviewPage } from '@/pages/ReviewPage';
import { useAppStore } from '@/store/useAppStore';

export default function App() {
  const activeTab = useAppStore((state) => state.activeTab);

  const renderPage = () => {
    switch (activeTab) {
      case 'consultation':
        return <ConsultationPage />;
      case 'treatment':
        return <TreatmentPage />;
      case 'review':
        return <ReviewPage />;
      default:
        return <ConsultationPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <Header />
      <TabNav />
      <main className="max-w-6xl mx-auto px-6 py-6">
        <div key={activeTab} className="animate-fade-in">
          {renderPage()}
        </div>
      </main>
      <footer className="mt-auto py-6 text-center text-xs text-gray-400">
        口腔接诊话术提示台 · 让沟通更专业更温暖
      </footer>
    </div>
  );
}
