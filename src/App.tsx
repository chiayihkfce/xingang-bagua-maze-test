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
    return <AdminPage {...app} />;
  }

  if (submitted) {
    return <SuccessPage {...app} />;
  }

  return <RegistrationPage {...app} />;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
export default App
