import { useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css"
import './App.css'
import { registerLocale } from "react-datepicker";
import { zhTW } from './utils/dateUtils'
import { AppProvider, useAppContext } from './context/AppContext'

// 註冊語系
registerLocale('zh', zhTW as any);

import SuccessPage from './pages/SuccessPage'
import AdminPage from './pages/AdminPage'
import RegistrationPage from './pages/RegistrationPage'

/**
 * 應用程式內容區：負責根據 Context 狀態切換頁面
 */
function AppContent() {
  const app = useAppContext();
  const { SECRET_ADMIN_PATH, currentPath, submitted } = app;

  if (SECRET_ADMIN_PATH && SECRET_ADMIN_PATH !== '/' && currentPath === SECRET_ADMIN_PATH) {
    return <AdminPage />;
  }

  if (submitted) {
    return <SuccessPage />;
  }

  return <RegistrationPage />;
}

function App() {
  useEffect(() => {
    // SEO 結構化資料注入邏輯
    const scriptId = 'google-event-jsonld';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "新港八卦謎蹤 | 實境解謎活動",
        "description": "昭和九年，一場神祕疫病肆虐新港... 穿梭時空，解開隱藏在古鎮巷弄間的八卦謎團。嘉義新港實境冒險，由新港文教基金會製作。",
        "image": "https://chiayihkfce.github.io/xingang-bagua-maze/poster.jpg",
        "startDate": "2026-01-01T09:00",
        "endDate": "2026-12-31T17:00",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
          "@type": "Place",
          "name": "培桂堂 (林懷民祖厝)",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "新中路305號",
            "addressLocality": "新港鄉",
            "addressRegion": "嘉義縣",
            "postalCode": "616",
            "addressCountry": "TW"
          }
        },
        "offers": {
          "@type": "Offer",
          "url": "https://chiayihkfce.github.io/xingang-bagua-maze/",
          "price": "650",
          "priceCurrency": "TWD",
          "availability": "https://schema.org/InStock"
        },
        "organizer": {
          "@type": "Organization",
          "name": "新港文教基金會",
          "url": "http://www.hkfce.org.tw/"
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
export default App
