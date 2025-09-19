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

        // Products
        { path: 'products', element: <ProtectedModuleRoute route="products"><ProductsManager /></ProtectedModuleRoute> },
        { path: 'products/create', element: <ProtectedModuleRoute route="products"><ProductForm mode="create" /></ProtectedModuleRoute> },
        { path: 'products/:productId/edit', element: <ProtectedModuleRoute route="products"><ProductForm mode="edit" /></ProtectedModuleRoute> },
        { path: 'products/:productId/view', element: <ProtectedModuleRoute route="products"><ProductDetails /></ProtectedModuleRoute> },
        { path: 'products/:productId', element: <ProtectedModuleRoute route="products"><ProductDetails /></ProtectedModuleRoute> },

        // Circles
        { path: 'circles', element: <ProtectedModuleRoute route="circles"><CirclesManager /></ProtectedModuleRoute> },
        { path: 'circles/create', element: <ProtectedModuleRoute route="circles"><CircleForm mode="create" /></ProtectedModuleRoute> },
        { path: 'circles/edit', element: <ProtectedModuleRoute route="circles"><CircleForm mode="edit" /></ProtectedModuleRoute> },
        { path: 'circles/view', element: <ProtectedModuleRoute route="circles"><CircleForm mode="view" /></ProtectedModuleRoute> },

        // Events
        { path: 'events', element: <ProtectedModuleRoute route="events"><EventsManager /></ProtectedModuleRoute> },
        { path: 'events/create', element: <ProtectedModuleRoute route="events"><EventForm mode="create" /></ProtectedModuleRoute> },
        { path: 'events/edit', element: <ProtectedModuleRoute route="events"><EventForm mode="edit" /></ProtectedModuleRoute> },
        { path: 'events/view', element: <ProtectedModuleRoute route="events"><EventForm mode="view" /></ProtectedModuleRoute> },

        // Intentions
        { path: 'intentions', element: <ProtectedModuleRoute route="intentions"><IntentionsManager /></ProtectedModuleRoute> },
        { path: 'intentions/create', element: <ProtectedModuleRoute route="intentions"><IntentionForm mode="create" /></ProtectedModuleRoute> },
        { path: 'intentions/edit', element: <ProtectedModuleRoute route="intentions"><IntentionForm mode="edit" /></ProtectedModuleRoute> },
        { path: 'intentions/view', element: <ProtectedModuleRoute route="intentions"><IntentionForm mode="view" /></ProtectedModuleRoute> },

        // Payments
        { path: 'payments', element: <ProtectedModuleRoute route="payments"><PaymentsManager /></ProtectedModuleRoute> },

        // Subadmins
        { path: 'subadmins', element: <ProtectedModuleRoute route="subadmins"><SubadminManager /></ProtectedModuleRoute> },
        { path: 'subadmins/create', element: <ProtectedModuleRoute route="subadmins"><SubadminForm mode="add" /></ProtectedModuleRoute> },
        { path: 'subadmins/edit', element: <ProtectedModuleRoute route="subadmins"><SubadminForm mode="edit" /></ProtectedModuleRoute> },
        { path: 'subadmins/view', element: <ProtectedModuleRoute route="subadmins"><SubadminDetails mode="view" /></ProtectedModuleRoute> },


        // Virtual Gifts Routes

        { path: 'virtual-gifts', element: <ProtectedModuleRoute route="virtual-gifts"><VirtualGiftsManager /></ProtectedModuleRoute> },
        { path: 'virtual-gifts/create', element: <ProtectedModuleRoute route="virtual-gifts"><VirtualGiftForm mode="create" /></ProtectedModuleRoute> },
        { path: 'virtual-gifts/:giftId/edit', element: <ProtectedModuleRoute route="virtual-gifts"><VirtualGiftForm mode="edit" /></ProtectedModuleRoute> },
        { path: 'virtual-gifts/:giftId/view', element: <ProtectedModuleRoute route="virtual-gifts"><VirtualGiftDetails /></ProtectedModuleRoute> },
        { path: 'virtual-gifts/:giftId', element: <ProtectedModuleRoute route="virtual-gifts"><VirtualGiftDetails /></ProtectedModuleRoute> },


        // Orders 
        { path: 'orders', element: <ProtectedModuleRoute route="orders"><div className="p-4 lg:p-6"><h2 className="text-3xl font-bold mb-4">Orders Management</h2><p className="text-muted-foreground">Orders management coming soon...</p></div></ProtectedModuleRoute> },

        // Analytics 
        { path: 'analytics', element: <ProtectedModuleRoute route="analytics"><div className="p-4 lg:p-6"><h2 className="text-3xl font-bold mb-4">Analytics</h2><p className="text-muted-foreground">Advanced analytics coming soon...</p></div></ProtectedModuleRoute> },

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

        //  email templates
        { path: 'email-template', element: <ProtectedModuleRoute route="email-template"><EmailTemplateManager /></ProtectedModuleRoute> },
        { path: 'email-template/edit', element: <ProtectedModuleRoute route="email-template"><EmailTemplateEditor /></ProtectedModuleRoute> },
        { path: 'email-template/view', element: <ProtectedModuleRoute route="email-template"><EmailTemplateEditor /></ProtectedModuleRoute> },

        { path: 'reports', element: <ProtectedModuleRoute route="reports"><ReportManager /></ProtectedModuleRoute> },

        // secret crush 
        { path: 'secret-crush', element: <ProtectedModuleRoute route="secret-crush"><SecretCrushManager /></ProtectedModuleRoute> },

         // secret crush 
         { path: 'error-logs', element: <ProtectedModuleRoute route="error-logs"><ErrorLogsManager /></ProtectedModuleRoute> },
    ],
}
export default AdminRoutes


