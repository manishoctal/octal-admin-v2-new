import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { ArrowLeft, Edit, Shield, Calendar, Mail, CheckCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { toast } from "sonner";
import { usePermissions, PermissionGate, MODULES, ACTIONS, MODULE_LABELS, ACTION_LABELS } from './PermissionContext';
import { subadminAPI, User as UserType } from './AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { showFormattedDate } from './common/showFormattedDate';
import helpers from '@/utils/helpers';


export function SubadminDetails() {
  const navigate = useNavigate();
  const location = useLocation()
  const subadminId = location?.state
  const { hasPermission } = usePermissions();
  const [subadmin, setSubadmin] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadSubadmin();
  }, [subadminId]);

  const loadSubadmin = async () => {
    try {
      setLoading(true);
      setSubadmin(subadminId);
    } catch (error) {
      navigate('/subadmins');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/subadmins/edit`, { state: { ...subadminId } });
  };

  const handleDelete = async () => {
    try {
      await subadminAPI.deleteSubadmin(subadminId);
      toast.success('Subadmin deleted successfully');
      navigate('/subadmins');
    } catch (error) {
      toast.error('Failed to delete subadmin');
      console.error('Error deleting subadmin:', error);
    }
  };


  const getPermissionsByModule = () => {
    if (!subadmin?.permission) return {};
    const permissionsByModule: Record<string, string[]> = {};
    subadmin?.permission?.forEach(permission => {
      const [module, action] = helpers.ternaryCondition(permission, permission?.split(':'), '');
      if (!permissionsByModule[module]) {
        permissionsByModule[module] = [];
      }
      permissionsByModule[module]?.push(action);
    });

    return permissionsByModule;
  };


  const getStatusColor = (status: string) => {
    return status === 'active' ? 'default' : 'secondary';
  };

  const canView = hasPermission(MODULES.SUBADMINS, ACTIONS.VIEW);

  if (!canView) {
    return (
      <div className="p-4 lg:p-6 flex flex-col items-center justify-center min-h-[400px]">
        <Shield className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground text-center">
          You don't have permission to view sub admin details.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-muted rounded"></div>
            <div className="h-8 w-48 bg-muted rounded"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="h-20 w-20 bg-muted rounded-full"></div>
              <div className="h-6 w-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!subadmin) {
    return (
      <div className="p-4 lg:p-6 flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-2xl font-bold mb-2">Subadmin Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested subadmin could not be found.</p>
        <Button onClick={() => navigate('/subadmins')}>
          Back to Subadmins
        </Button>
      </div>
    );
  }

  const permissionsByModule = getPermissionsByModule();

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => { navigate(-1) }}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold">Sub Admin Details</h2>
            <p className="text-muted-foreground">View and manage sub admin information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <PermissionGate module={MODULES.SUBADMINS} action={ACTIONS.EDIT}>

            <Button onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </PermissionGate>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-20 w-20 ring-4 ring-background shadow-lg">
                  <AvatarImage src={subadmin?.profilePic} alt={subadmin?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-lg font-medium">
                    {subadmin?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">{subadmin.name}</h3>
                  <div className="flex flex-col items-center gap-2">

                    <Badge variant={getStatusColor(subadmin?.status)} className="font-medium">
                      {subadmin?.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{subadmin.email}</p>
                  </div>
                </div>



                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {subadmin.createdAt ? showFormattedDate(subadmin?.createdAt) : 'Unknown'}

                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Login</p>
                    <p className="font-medium">
                      {subadmin.lastLogin ? showFormattedDate(subadmin?.lastLogin) : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permissions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Permissions & Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(permissionsByModule).length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No specific permissions assigned</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(permissionsByModule).map(([module, actions]) => (
                    <div key={module} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-lg">
                          {MODULE_LABELS[module as keyof typeof MODULE_LABELS] || module}
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {actions.map(action => (
                          <Badge
                            key={action}
                            variant="outline"
                            className="bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {ACTION_LABELS[action as keyof typeof ACTION_LABELS] || action}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">
                    {subadmin.status === 'active' ? '✅' : '❌'}
                  </p>
                  <p className="text-sm text-muted-foreground">Account Status</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">
                    {Object.keys(permissionsByModule).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Modules Access</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subadmin</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{subadmin.name}</strong>?
              This action cannot be undone and will permanently remove their access to the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Subadmin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}