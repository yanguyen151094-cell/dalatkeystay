import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import FloatingContacts from "./components/feature/FloatingContacts";
import ChatWidget from "./components/feature/ChatWidget";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <AppRoutes />
        <FloatingContacts />
        <ChatWidget />
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;