import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Plus, Edit, Trash2, Eye, MoreHorizontal, RotateCcw, Shield, UserCheck, UserX, Users, Clock, Circle, Ban, CircleCheck, CircleStop, UsersRound, Globe, DollarSign, MapPin, Calendar1, CalendarCheck, CalendarX, FolderKanban, SquareKanban } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useTranslation } from './TranslationContext';
import { usePermissions, PermissionGate, MODULES, ACTIONS } from './PermissionContext';
import { User as UserType } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { Pagination } from './common/Pagination';
import helpers from '@/utils/helpers';
import NoResultFound from './common/NoResultFound';
import ConfirmDialog from './common/DeleteConfirm';
import ConfirmStatusChange from './common/ConfirmStatusChange';
import SortButton from './common/SortButton';
import DebouncedSearchInput from './common/DebouncedSearchInput';
import { apiDelete, apiGet, apiPost } from '@/utils/apiFetch';
import apiPath from '@/utils/apiPath';
import { ErrorToastMessage, SuccessToastMessage } from './common/sonner';
import { DateRangePicker } from './common/DateRangePicker';
import { showFormattedDate } from './common/showFormattedDate';
import CardSkelton from './common/CardSkelton';

const SubadminSkeleton = () => (
  <TableRow className="hover:bg-muted/50">
    <TableCell className="w-12">
      <div className="h-4 w-4 bg-muted rounded animate-pulse" />
    </TableCell>
    <TableCell className="w-20">
      <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
    </TableCell>
    {/* <TableCell className="w-20">
      <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
    </TableCell> */}
    <TableCell>
      <div className="space-y-2">
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        {/* <div className="h-3 w-48 bg-muted rounded animate-pulse" /> */}
      </div>
    </TableCell>
  
    <TableCell>
      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
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



interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  endDate?: string;
  endTime?: string;
  location: string;
  venue?: string;
  accessType: 'free' | 'premium' | 'invite_only';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  rsvpCount: number;
  maxAttendees?: number;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  organizerId: string;
  organizerName: string;
  price?: number;
  currency: string;
  isFeature: boolean;
  bannerImage?: string;
  registrationDeadline?: string;
  attendeesCount: number;
  waitlistCount: number;
}



export function IntentionsManager() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const [subadmins, setSubadmins] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortField, setSortField] = useState<keyof UserType>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedSubadmins, setSelectedSubadmins] = useState<string[]>([]);
  const [deleteSubadminId, setDeleteSubadminId] = useState<string | null>(null);
  const [StatusSubadminId, setStatusSubadminId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  // Load subadmins
  useEffect(() => {
    loadSubadmins();
  }, [sortDirection, sortField, statusFilter, searchTerm, pageSize, dateRange, currentPage]);

  const loadSubadmins = async () => {
    try {

      const paylaod = {
        sortType: sortDirection,
        sortBy: sortField,
        keyword: searchTerm,
        status: statusFilter,
        pageSize: pageSize,
        page: currentPage,
        startDate: dateRange?.from ? helpers.getFormattedDate(new Date(dateRange?.from)) : '',
        endDate: dateRange?.to ? helpers.getFormattedDate(new Date(dateRange?.to)) : ''
      }
      setLoading(true);
      setSelectedSubadmins([])
      const resp = await apiGet(apiPath.getIntent, paylaod);
      if (resp?.data?.success) {
        setSubadmins(resp?.data?.results);
      }
    } catch (error) {
      ErrorToastMessage({ message: 'Failed to load subadmins' })
    } finally {
      setLoading(false);
    }
  };

  // Check if any filters are applied
  const hasActiveFilters = searchTerm || statusFilter !== '' || dateRange?.from || dateRange?.to;

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalSubadmins = subadmins?.totalIntents;
    const activeSubadmins = subadmins?.totalActiveIntents;
    const inactiveSubadmins = subadmins?.totalInactiveIntents;
    const totalMembersCount = subadmins?.docs?.reduce((sum, subadmin) => {
      return sum + (subadmin?.totalMembers || 0);
    }, 0);

    return {
      totalUsers: totalSubadmins,
      activeUsers: activeSubadmins,
      inactiveUsers: inactiveSubadmins,
      totalMembersCount
    };
  }, [subadmins]);

  // Filtered and sorted subadmins
  const filteredSubadmins = useMemo(() => {
    return subadmins?.docs;
  }, [subadmins, searchTerm, roleFilter, statusFilter, sortField, sortDirection]);



  const handleSort = (field: keyof UserType) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSubadmins(filteredSubadmins?.map(subadmin => subadmin?._id));
    } else {
      setSelectedSubadmins([]);
    }
  };

  const handleSelectSubadmin = (subadminId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubadmins([...selectedSubadmins, subadminId]);
    } else {
      setSelectedSubadmins(selectedSubadmins.filter(id => id !== subadminId));
    }
  };

  const handleDeleteSubadmin = async (subadminId: any) => {
    let resp
    try {
      if (typeof subadminId == 'string') {
        resp = await apiDelete(apiPath.getIntent + '/' + subadminId,);
        if (resp?.data?.success) {
          SuccessToastMessage({ message: resp?.data?.message })
          setDeleteSubadminId(null);
          loadSubadmins();

        }
      } else {

        resp = await apiPost(apiPath.getIntent + '/bulk-delete-intents', { ids: selectedSubadmins })
        if (resp?.data?.success) {
          setDeleteSubadminId(null);
          loadSubadmins();
          setSelectedSubadmins([])
          SuccessToastMessage({ message: resp?.data?.message })
          return
        }
        ErrorToastMessage({ message: resp?.data?.message })

      }
    } catch (error) {
      ErrorToastMessage({ message: error?.response?.data?.message })
      
    }

  };

  const handleToggleStatus = async (subadmin: UserType) => {
    try {
      const newStatus = subadmin?.status === 'active' ? 'inactive' : 'active';
      const resp = await apiPost(apiPath.getIntent + '/' + subadmin?._id, { status: newStatus, });
      if (resp?.data?.success) {
        SuccessToastMessage({ message: resp?.data?.message })
        loadSubadmins();
      }
    } catch (error) {
      ErrorToastMessage({ message: error?.response?.data?.message||'Failed to update event status' })
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('');
    setCurrentPage(1);
    setDateRange({ from: undefined, to: undefined })
    SuccessToastMessage({ message: 'Filters reset' })
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      default: return 'outline';
    }
  };


  // Navigation functions
  const handleViewSubadmin = async (subadminId: string) => {
    navigate(`/intentions/view`, { state: { ...subadminId } });
  };

  const handleEditSubadmin = async (subadminId: string) => {
    navigate(`/intentions/edit`, { state: { ...subadminId } });

  };




  const handleCreateSubadmin = () => {
    navigate('/intentions/create');
  };

  const canView = hasPermission(MODULES.INTENTIONS, ACTIONS.VIEW);

  if (!canView) {
    return (
      <div className="p-4 lg:p-6 flex flex-col items-center justify-center min-h-[400px]">
        <Shield className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t('ACCESS_DENIED')}</h2>
        <p className="text-muted-foreground text-center">
          {t('YOU_DONT_HAVE_PERMISSION')} {t('INTENTION_MANAGEMENT')?.toLowerCase()}.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Intent Management</h2>
          <p className="text-muted-foreground">Manage user connection intent and preferences</p>

        </div>

        <PermissionGate module={MODULES.INTENTIONS} action={ACTIONS.CREATE}>
        <Button onClick={handleCreateSubadmin} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Create Intent
        </Button>
        </PermissionGate>
      </div>

      {/* Statistics Cards */}
      {helpers.ternaryCondition(loading,<CardSkelton/>,
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Intent</p>
                <div className="text-2xl font-bold">{statistics?.totalUsers?.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <FolderKanban className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Active Intent</p>
                <div className="text-2xl font-bold">{statistics?.activeUsers?.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                <SquareKanban className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>



        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Inactive Intent</p>
                <div className="text-2xl font-bold">{statistics?.inactiveUsers?.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                <CalendarX className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>)}

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <DebouncedSearchInput
                  defaultValue={searchTerm}
                  setPage={setCurrentPage}
                  placeholder={t('SEARCH_INTENT_BY_NAME')}
                  onSearch={(value) => setSearchTerm(value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={statusFilter} onValueChange={(e) => { if (e == 'all') { setStatusFilter('') } else { setStatusFilter(e) } }}>
                  <SelectTrigger className="w-full sm:w-40 h-10">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('ALL_STATUS')}</SelectItem>
                    <SelectItem value="active">{t('ACTIVE')}</SelectItem>
                    <SelectItem value="inactive">{t('INACTIVE')}</SelectItem>
                  </SelectContent>
                </Select>

                <DateRangePicker
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  placeholder={t('FILTER_BY_CREATION_DATE')}
                  className="w-full sm:w-[280px]"
                />



                {hasActiveFilters && (
                  <Button variant="outline" onClick={handleResetFilters} className="w-full sm:w-auto h-10">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {t('RESET')}
                  </Button>
                )}

                <PermissionGate module={MODULES.INTENTIONS} action={ACTIONS.DELETE}>
                  {selectedSubadmins?.length > 0 && (
                    <Button variant="destructive" onClick={() => { setDeleteSubadminId({ bulk: true }) }} className="w-full sm:w-auto h-10">
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('DELETE')} ({selectedSubadmins?.length})
                    </Button>
                  )}
                </PermissionGate>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-3">
          <div className="border-t border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-muted/30">
                  <TableHead className="w-12 h-12">
                    <Checkbox
                      checked={selectedSubadmins?.length === filteredSubadmins?.length && filteredSubadmins?.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>

                  <TableHead className="w-20 h-12">{t('INTENT_ICON')}</TableHead>
                  {/* <TableHead className="w-20 h-12">{t('INTENT_IMAGE')}</TableHead> */}
                  <TableHead className="min-w-[200px] h-12">
                    <SortButton<UserType>
                      field="name"
                      sortField={sortField}
                      onSort={handleSort}
                    >
                      {t('INTENT_NAME')}
                    </SortButton>
                  </TableHead>



                  <TableHead className="min-w-[100px] h-12">

                    <SortButton<UserType>
                      field="status"
                      sortField={sortField}
                      onSort={handleSort}
                    >
                      {t('STATUS')}
                    </SortButton>
                  </TableHead>

                  <TableHead className="min-w-[100px] h-12">
                    <SortButton<UserType>
                      field="createdAt"
                      sortField={sortField}
                      onSort={handleSort}
                    >
                      {t('CREATED_AT')}
                    </SortButton>
                  </TableHead>
                  <TableHead className="min-w-[100px] h-12">
                    <SortButton<UserType>
                      field="updated"
                      sortField={sortField}
                      onSort={handleSort}
                    >
                      {t('UPDATED_AT')}
                    </SortButton>
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
                  helpers.ternaryCondition(subadmins?.docs?.length > 0, filteredSubadmins?.map((subadmin) => {
                    return (
                      <TableRow
                        key={subadmin._id}
                        className="group hover:bg-muted/50 transition-colors duration-150"
                      >
                        <TableCell className="py-4">
                          <Checkbox
                            checked={selectedSubadmins?.includes(subadmin._id)}
                            onCheckedChange={(checked) => handleSelectSubadmin(subadmin?._id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="py-4">
                          <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                            <AvatarImage src={subadmin?.icon} alt={subadmin?.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-medium">
                              {subadmin?.name?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>

                        {/* <TableCell className="py-4">
                          <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                            <AvatarImage src={subadmin?.image} alt={subadmin?.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-medium">
                              {subadmin?.name?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell> */}
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="font-medium text-sm leading-none">{subadmin?.name}</div>
                          </div>
                        </TableCell>

                       

                        <TableCell className="py-4">
                          <Badge variant={getStatusColor(subadmin?.status)} className="font-medium">
                            {helpers.capitalizeFirstWord(subadmin?.status)}
                          </Badge>
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
                              <PermissionGate module={MODULES.INTENTIONS} action={ACTIONS.EDIT}>
                                <DropdownMenuItem onClick={() => handleEditSubadmin(subadmin)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  {t('EDIT_INTENT')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusSubadminId(subadmin)}>
                                  {helpers.ternaryCondition(subadmin?.status === 'active',
                                    <>
                                      <UserX className="w-4 h-4 mr-2" />
                                      {t('DEACTIVATE')}
                                    </>,
                                    <>
                                      <UserCheck className="w-4 h-4 mr-2" />
                                      {t('ACTIVATE')}
                                    </>
                                  )}
                                </DropdownMenuItem>
                              </PermissionGate>
                             
                              <PermissionGate module={MODULES.INTENTIONS} action={ACTIONS.DELETE}>
                              <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setDeleteSubadminId(subadmin._id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  {t('DELETE_INTENT')}
                                </DropdownMenuItem>
                              </PermissionGate>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  }),
                    <NoResultFound />)

                )}
              </TableBody>
            </Table>
          </div>

          {/* Enhanced Pagination */}
          {helpers.andCondition(filteredSubadmins?.length > 0, <Pagination currentPage={currentPage} pageSize={pageSize} length={subadmins?.totalDocs} setPageSize={setPageSize} setCurrentPage={setCurrentPage} totalPages={subadmins?.totalPages} />)}

        </CardContent>
      </Card>


      <ConfirmDialog
        open={!!deleteSubadminId}
        onCancel={() => setDeleteSubadminId(null)}
        onConfirm={() => deleteSubadminId && handleDeleteSubadmin(deleteSubadminId)}
        description="This will permanently delete the intent and remove their access to the system."
        confirmText="Delete"
        loading={loading}
      />

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