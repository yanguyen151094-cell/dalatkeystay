import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import FloatingContacts from "./components/feature/FloatingContacts";
import ChatWidget from "./components/feature/ChatWidget";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <AdminAuthProvider>
          <AppRoutes />
          <FloatingContacts />
          <ChatWidget />
        </AdminAuthProvider>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;
