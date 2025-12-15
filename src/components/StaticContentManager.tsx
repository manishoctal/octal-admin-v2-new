import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Edit, Trash2, Eye, MoreHorizontal, RotateCcw, Shield, UserCheck, UserX } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { toast } from "sonner";
import { useSettings } from './contexts/settings';
import { useTranslation } from './TranslationContext';
import { usePermissions, PermissionGate, MODULES, ACTIONS, ROLES } from './PermissionContext';
import { subadminAPI, User as UserType } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { Pagination } from './common/Pagination';
import helpers from '@/utils/helpers';
import NoResultFound from './common/NoResultFound';
import ConfirmDialog from './common/DeleteConfirm';
import ConfirmStatusChange from './common/ConfirmStatusChange';
import SortButton from './common/SortButton';
import { apiGet, apiPost, apiPut } from '@/utils/apiFetch';
import apiPath from '@/utils/apiPath';
import { ErrorToastMessage, SuccessToastMessage } from './common/sonner';
import { showFormattedDate } from './common/showFormattedDate';
import { Buffer } from 'buffer'
const SubadminSkeleton = () => (
  <TableRow className="hover:bg-muted/50">

    <TableCell>
      <div className="space-y-2">
        <div className="h-6 w-6 bg-muted rounded-lg animate-pulse" />
      </div>
    </TableCell>
    <TableCell>
      <div className="space-y-2">
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
      </div>
    </TableCell>

    <TableCell>
      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
    </TableCell>


    <TableCell>
      <div className="h-4 w-20 bg-muted rounded animate-pulse" />
    </TableCell>

    <TableCell>
      <div className="h-4 w-20 bg-muted rounded animate-pulse" />
    </TableCell>
    <TableCell className="w-12">
      <div className="h-8 w-8 bg-muted rounded animate-pulse" />
    </TableCell>
  </TableRow>
);
interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}
export function StaticContentManager() {
  const navigate = useNavigate();
  const { formatDate } = useSettings();
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const [subadmins, setSubadmins] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortField, setSortField] = useState<keyof UserType>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedSubadmins, setSelectedSubadmins] = useState<string[]>([]);
  const [deleteSubadminId, setDeleteSubadminId] = useState<string | null>(null);
  const [StatusSubadminId, setStatusSubadminId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  // Load subadmins
  useEffect(() => {
    loadSubadmins();
  }, [sortDirection, sortField, statusFilter, pageSize, dateRange]);

  const loadSubadmins = async () => {
    try {
      setLoading(true);
      const resp = await apiGet(apiPath.getStaticContent);
      if (resp?.data?.success) {
        setSubadmins(resp?.data?.results);
      }

    } catch (error) {
      console.log('------error-----', error)
    } finally {
      setLoading(false);
    }
  };


  // Filtered and sorted subadmins
  const filteredSubadmins = useMemo(() => {
    return subadmins;
  }, [subadmins, searchTerm, roleFilter, statusFilter, sortField, sortDirection]);

  // Paginated subadmins
  const paginatedSubadmins = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredSubadmins?.slice(startIndex, startIndex + pageSize);
  }, [filteredSubadmins, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredSubadmins?.length / pageSize);

  const handleSort = (field: keyof UserType) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };



  const handleToggleStatus = async (subadmin: UserType) => {
    try {
      const newStatus = subadmin?.status === 'active' ? 'inactive' : 'active';
      const resp = await apiPut(apiPath.emailTemplate + `/change-status/${subadmin?._id}`, { status: newStatus })
      if (resp?.data?.success) {
        loadSubadmins();
        SuccessToastMessage({ message: resp?.data?.message })
      }
    } catch (error) {
      ErrorToastMessage({ message: error?.response?.data?.message })
      console.error('Error updating subadmin status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      default: return 'outline';
    }
  };

  // Navigation functions
  const handleViewSubadmin = async(subadminId: string) => {

    const newContent = await Buffer.from(subadminId?.content, 'base64').toString(
      'ascii'
    )

    navigate(`/static-content/view`, { state: {...subadminId,content:newContent} });
  };

  const handleEditSubadmin = async(subadminId: string) => {
    const newContent = await Buffer.from(subadminId?.content, 'base64').toString(
      'ascii'
    )
    navigate(`/static-content/edit`, { state: {...subadminId,content:newContent}});

  };


  const canCreate = hasPermission(MODULES.STATIC_CONTENT, ACTIONS.CREATE);
  const canEdit = hasPermission(MODULES.STATIC_CONTENT, ACTIONS.EDIT);
  const canDelete = hasPermission(MODULES.STATIC_CONTENT, ACTIONS.DELETE);
  const canView = hasPermission(MODULES.STATIC_CONTENT, ACTIONS.VIEW);

  if (!canView) {
    return (
      <div className="p-4 lg:p-6 flex flex-col items-center justify-center min-h-[400px]">
        <Shield className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t('ACCESS_DENIED')}</h2>
        <p className="text-muted-foreground text-center">
          {t('YOU_DONT_HAVE_PERMISSION')} {t('EMAIL_MANAGEMENT')?.toLowerCase()}.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Static Content</h2>
          <p className="text-muted-foreground">Manage website pages and static content</p>
        </div>

      </div>


      <Card className="shadow-sm">
        <CardContent className="px-3 mt-3">
          <div className="border-t border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-muted/30">
                  <TableHead className="w-12 h-12">  {t('SR_NO')}</TableHead>
                  <TableHead className="min-w-[200px] h-12">
                  {t('TITLE')}
                  </TableHead>


                  <TableHead className="min-w-[100px] h-12">

                  {t('SLUG')}
                  </TableHead>

                  <TableHead className="min-w-[100px] h-12">
                  {t('CREATED_AT')}
                  </TableHead>

                  <TableHead className="min-w-[100px] h-12">
                  {t('UPDATED_AT')}
                  </TableHead>
                  <TableHead className="w-12 h-12">  {t('ACTIONS')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                    <SubadminSkeleton key={i} />
                  ))
                ) : (
                  helpers.ternaryCondition(subadmins?.length > 0, paginatedSubadmins?.map((subadmin, i) => (
                    <TableRow
                      key={subadmin._id}
                      className="group hover:bg-muted/50 transition-colors duration-150"
                    >
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {i + 1}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <div className="font-medium text-sm leading-none">{subadmin?.title}</div>
                        </div>
                      </TableCell>




                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <div className="font-medium text-sm leading-none">{subadmin?.slug}</div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="text-sm">
                          {showFormattedDate(subadmin?.createdAt)}
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="text-sm">
                          {showFormattedDate(subadmin?.updatedAt)}
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-60 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleViewSubadmin(subadmin)}>
                              <Eye className="w-4 h-4 mr-2" />
                              {t('VIEW_DETAILS')}
                            </DropdownMenuItem>
                            <PermissionGate module={MODULES.STATIC_CONTENT} action={ACTIONS.EDIT}>
                              <DropdownMenuItem onClick={() => handleEditSubadmin(subadmin)}>
                                <Edit className="w-4 h-4 mr-2" />
                                {t('EDIT_CONTENT')}
                              </DropdownMenuItem>

                            </PermissionGate>

                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )),
                    <NoResultFound />)

                )}
              </TableBody>
            </Table>
          </div>

          {/* Enhanced Pagination */}
          {helpers.andCondition(filteredSubadmins?.length > 0, <Pagination currentPage={currentPage} pageSize={pageSize} length={filteredSubadmins?.length} setPageSize={setPageSize} setCurrentPage={setCurrentPage} totalPages={totalPages} />)}

        </CardContent>
      </Card>




      <ConfirmStatusChange
        open={!!StatusSubadminId}
        onCancel={() => setStatusSubadminId(null)}
        onConfirm={() => StatusSubadminId && handleToggleStatus(StatusSubadminId)}
        confirmText="Yes"
        title={t('ARE_YOU_SURE_YOU_WANT_TO') + helpers.ternaryCondition(StatusSubadminId?.status == 'active', 'inactive', 'active') + ' ' + (StatusSubadminId?.firstName || '')}
        loading={loading}
      />

    </div>
  );
}