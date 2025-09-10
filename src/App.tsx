
import { Toaster } from './components/ui/sonner';
import { SettingsProvider } from './components/SettingsContext';
import { TranslationProvider } from './components/TranslationContext';
import { AuthProvider } from './components/AuthContext';
import { PermissionProvider } from './components/PermissionContext';
import CombineRoutes from './routes/combineRoutes'
import { BrowserRouter } from 'react-router-dom';
import 'react-phone-input-2/lib/style.css'
function App() {
  return (
    <BrowserRouter>
    <SettingsProvider>
      <TranslationProvider>
        <AuthProvider>
          <PermissionProvider>
              <Toaster />
              <CombineRoutes />
          </PermissionProvider>
        </AuthProvider>
      </TranslationProvider>
    </SettingsProvider>
    </BrowserRouter>
  );
}

export default App;




