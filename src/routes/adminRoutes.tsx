import { DashboardLayout } from '../components/DashboardLayout';
import { DashboardOverview } from '../components/DashboardOverview';
import { UsersManager } from '../components/UsersManager';
import { UserForm } from '../components/UserForm';
import { UserDetails } from '../components/UserDetails';
import { ProductsManager } from '../components/ProductsManager';
import { ProductForm } from '../components/ProductForm';
import { ProductDetails } from '../components/ProductDetails';
import { Settings } from '../components/Settings';
import { CirclesManager } from '../components/CirclesManager';
import { CircleForm } from '../components/CircleForm';
import { CircleDetails } from '../components/CircleDetails';
import { EventsManager } from '../components/EventsManager';
import { EventForm } from '../components/EventForm';
import { EventDetails } from '../components/EventDetails';
import { IntentionsManager } from '../components/IntentionsManager';
import { IntentionForm } from '../components/IntentionForm';
import { IntentionDetails } from '../components/IntentionDetails';
import { PaymentsManager } from '../components/PaymentsManager';
import { SubadminManager } from '../components/SubadminManager';
import { SubadminForm } from '../components/SubadminForm';
import { SubadminDetails } from '../components/SubadminDetails';
import { ProtectedRoute } from '../components/ProtectedRoute';
import SharedLayout from '../components/sharedLayout'
import { VirtualGiftsManager } from '../components/VirtualGiftsManager';
import { VirtualGiftForm } from '../components/VirtualGiftForm';
import { VirtualGiftDetails } from '../components/VirtualGiftDetails';
import ProtectedModuleRoute from './protectedRoutes';
import { ChangePassword } from '@/components/ChangePassword';
import { Profile } from '@/components/Profile';
import { StaticContentManager } from '@/components/StaticContentManager';
import { FAQManager } from '@/components/FAQManager';
import { EmailTemplateManager } from '@/components/EmailTemplateManager';
import { EmailTemplateEditor } from '@/components/EmailTemplateEditor';
import { StaticContentEditor } from '@/components/StaticContentEditor';
import { NotificationManager } from '@/components/NotificationManager';
import { ReportManager } from '@/components/ReportManager';
import { SecretCrushManager } from '@/components/SecretCrush';
import { ErrorLogsManager } from '@/components/ErrorLogsManager';
 import { UiComponentPreview } from '@/components/CommonUiOverview';

const AdminRoutes = {
    path: "/",
    element: (
        <ProtectedRoute>
            <div className="min-h-screen bg-background">
                <SharedLayout>
                    <DashboardLayout />
                </SharedLayout>
            </div>
        </ProtectedRoute>
    ),
    children: [
        {
            path: 'dashboard',
            element: (
                <ProtectedModuleRoute route="dashboard">
                    <DashboardOverview />
                </ProtectedModuleRoute>
            ),
        },

        {
            path: '/',
            element: (
                <ProtectedModuleRoute route="dashboard">
                    <DashboardOverview />
                </ProtectedModuleRoute>
            ),
        },
        // Users
        { path: 'users', element: <ProtectedModuleRoute route="users"><UsersManager /></ProtectedModuleRoute> },
        { path: 'users/view', element: <ProtectedModuleRoute route="users"><UserDetails /></ProtectedModuleRoute> },

        // Subadmins
        { path: 'subadmins', element: <ProtectedModuleRoute route="subadmins"><SubadminManager /></ProtectedModuleRoute> },
        { path: 'subadmins/create', element: <ProtectedModuleRoute route="subadmins"><SubadminForm mode="add" /></ProtectedModuleRoute> },
        { path: 'subadmins/edit', element: <ProtectedModuleRoute route="subadmins"><SubadminForm mode="edit" /></ProtectedModuleRoute> },
        { path: 'subadmins/view', element: <ProtectedModuleRoute route="subadmins"><SubadminDetails mode="view" /></ProtectedModuleRoute> },
        // Settings
        { path: 'settings', element: <ProtectedModuleRoute route="settings"><Settings /></ProtectedModuleRoute> },

        { path: 'notification-manager', element: <ProtectedModuleRoute route="notification-manager"><NotificationManager /></ProtectedModuleRoute> },
        { path: 'change-password', element: <ProtectedModuleRoute route="change-password"><ChangePassword /></ProtectedModuleRoute> },
        { path: 'profile', element: <ProtectedModuleRoute route="profile"><Profile /></ProtectedModuleRoute> },


        //  static content
        { path: 'static-content', element: <ProtectedModuleRoute route="static-content"><StaticContentManager /></ProtectedModuleRoute> },
        { path: 'static-content/edit', element: <ProtectedModuleRoute route="static-content"><StaticContentEditor /></ProtectedModuleRoute> },
        { path: 'static-content/view', element: <ProtectedModuleRoute route="static-content"><StaticContentEditor /></ProtectedModuleRoute> },

        //  FAQS
        { path: 'faqs', element: <ProtectedModuleRoute route="faqs"><FAQManager /></ProtectedModuleRoute> },
        //  UI Components Preview
         { path: 'ui-components-preview', element: <ProtectedModuleRoute route='ui_components_preview'><UiComponentPreview /></ProtectedModuleRoute> },


        //  email templates
        { path: 'email-template', element: <ProtectedModuleRoute route="email-template"><EmailTemplateManager /></ProtectedModuleRoute> },
        { path: 'email-template/edit', element: <ProtectedModuleRoute route="email-template"><EmailTemplateEditor /></ProtectedModuleRoute> },
        { path: 'email-template/view', element: <ProtectedModuleRoute route="email-template"><EmailTemplateEditor /></ProtectedModuleRoute> },

        { path: 'reports', element: <ProtectedModuleRoute route="reports"><ReportManager /></ProtectedModuleRoute> },
         { path: 'error-logs', element: <ProtectedModuleRoute route="error-logs"><ErrorLogsManager /></ProtectedModuleRoute> },
    ],
}
export default AdminRoutes


