import { useEffect, lazy, Suspense } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import { registerLocale } from 'react-datepicker';
import { zhTW } from './utils/dateUtils';
import { AppProvider, useAppContext } from './context/AppContext';
import AdminPage from './pages/AdminPage';
import CustomCursor from './components/UI/CustomCursor';
import { useSecurityGuard } from './hooks/useSecurityGuard';

// 註冊語系
registerLocale('zh', zhTW as any);

// 使用 Lazy Loading 延遲載入部分頁面
const SuccessPage = lazy(() => import('./pages/SuccessPage'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));

/**
 * 載入中畫面
 */
const LoadingFallback = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#c1a57b'
    }}
  >
    <div className="loading-spinner">載入中...</div>
  </div>
);

/**
 * 應用程式內容區：負責根據 Context 狀態切換頁面
 */
function AppContent() {
  const app = useAppContext();
  const { SECRET_ADMIN_PATH, currentPath, submitted, isAuthenticating } = app;

  // 啟動系統安全守衛 (暫時關閉以排查黑屏問題)
  // useSecurityGuard();

  if (isAuthenticating) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      {(() => {
        if (
          SECRET_ADMIN_PATH &&
          SECRET_ADMIN_PATH !== '/' &&
          currentPath === SECRET_ADMIN_PATH
        ) {
          return <AdminPage />;
        }

        if (submitted) {
          return <SuccessPage />;
        }

        return <RegistrationPage />;
      })()}
      <CustomCursor />
    </Suspense>
  );
}

function App() {
  useEffect(() => {
    // 0. 強制設定網頁標題
    document.title = '新港八卦謎蹤';

    // 2. SEO 結構化資料注入邏輯
    const scriptId = 'google-event-jsonld';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: '新港八卦謎蹤 | 實境解謎活動',
        description:
          '昭和九年，一場神祕疫病肆虐新港... 穿梭時空，解開隱藏在古鎮巷弄間的八卦謎團。嘉義新港實境冒險，由新港文教基金會製作。',
        image: 'https://chiayihkfce.github.io/xingang-bagua-maze/poster.jpg',
        startDate: '2026-01-01T09:00',
        endDate: '2026-12-31T17:00',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
          '@type': 'Place',
          name: '培桂堂 (林懷民祖厝)',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '新中路305號',
            addressLocality: '新港鄉',
            addressRegion: '嘉義縣',
            postalCode: '616',
            addressCountry: 'TW'
          }
        },
        performer: {
          '@type': 'Organization',
          name: '新港文教基金會'
        },
        offers: {
          '@type': 'Offer',
          url: 'https://chiayihkfce.github.io/xingang-bagua-maze/',
          price: '650',
          priceCurrency: 'TWD',
          availability: 'https://schema.org/InStock',
          validFrom: '2026-01-01T00:00:00'
        },
        organizer: {
          '@type': 'Organization',
          name: '新港文教基金會',
          url: 'http://www.hkfce.org.tw/'
        }
      });
      document.head.appendChild(script);
    }
  }, []);

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
export default App;
