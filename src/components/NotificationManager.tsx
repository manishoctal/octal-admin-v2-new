import  { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User as UserType } from './AuthContext';
import {
  Bell,
  Plus,
  MoreHorizontal,
  Eye,
  Download,
  RotateCcw,
  Shield
} from 'lucide-react';
import { usePermissions, MODULES, ACTIONS, PermissionGate } from './PermissionContext';
import { NotificationForm } from '@/components/NotificationForm';
import SortButton from './common/SortButton';
import { useTranslation } from './TranslationContext';
import helpers from '@/utils/helpers';
import { apiGet } from '@/utils/apiFetch';
import apiPath from '@/utils/apiPath';
import { ErrorToastMessage } from './common/sonner';
import { showFormattedDate } from './common/showFormattedDate';
import NoResultFound from './common/NoResultFound';
import { Pagination } from './common/Pagination';
import DebouncedSearchInput from './common/DebouncedSearchInput';
import { DateRangePicker } from './common/DateRangePicker';
import startCase from "lodash.startcase";


const NotificationSkeleton = () => (
  <TableRow className="hover:bg-muted/50">
    <TableCell className="w-12">
      <div className="h-8 w-8 bg-muted rounded animate-pulse" />
    </TableCell>
    
    <TableCell>
      <div className="space-y-2">
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        <div className="h-3 w-48 bg-muted rounded animate-pulse" />
      </div>
    </TableCell>
  
    <TableCell>
      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
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
interface Notification {
  id: string;
  title: string;
  message: string;
  sentDate: string;
  sentTo: 'all' | 'specific';
  specificUsers?: string[];
  status: 'sent' | 'scheduled' | 'draft' | 'failed';
  totalRecipients: number;
  deliveryRate?: number;
  openRate?: number;
  clickRate?: number;
  createdBy: string;
}






export function NotificationManager() {
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recipientFilter, setRecipientFilter] = useState<string>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [sortField, setSortField] = useState<keyof UserType>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  // Permission checks
  const canView = hasPermission(MODULES.NOTIFICATIONS, ACTIONS.VIEW);
  const [allUsers, setAllUsers] = useState([])


  const hasActiveFilters = searchTerm || recipientFilter !== '' || dateRange?.from || dateRange?.to;

  const getUser = async () => {
    try {
      const resp = await apiGet(apiPath.getNotifications + '/users');
      if (resp?.data?.success) {
        setAllUsers(resp?.data?.results);
      }
    } catch (error) {
      console.log('Failed to load user', error)
    }
  }

  useEffect(() => {
    getUser()
  }, [])






  useEffect(() => {
    loadNotifications();
  }, [sortDirection, sortField, recipientFilter, searchTerm, pageSize, dateRange, currentPage]);

  const loadNotifications = async () => {
    try {

      const paylaod = {
        sortType: sortDirection,
        sortBy: sortField,
        keyword: searchTerm,
        sendTo: recipientFilter,
        pageSize: pageSize,
        page: currentPage,
        startDate: dateRange?.from ? helpers.getFormattedDate(new Date(dateRange?.from)) : '',
        endDate: dateRange?.to ? helpers.getFormattedDate(new Date(dateRange?.to)) : ''
      }
      setLoading(true);
      const resp = await apiGet(apiPath.getNotifications, paylaod);
      if (resp?.data?.success) {
        setNotifications(resp?.data?.results);
      }
    } catch (error) {
      ErrorToastMessage({ message: 'Failed to load notifications' })
    } finally {
      setLoading(false);
    }
  };



  const handleSort = (field: keyof UserType) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };



  const handleResetFilters = () => {
    setSearchTerm('');
    setRecipientFilter('')
    setCurrentPage(1);
    setDateRange({ from: undefined, to: undefined })
    SuccessToastMessage({ message: 'Filters reset' })
  };


  if (!canView) {
    return (
      <div className="p-4 lg:p-6 flex flex-col items-center justify-center min-h-[400px]">
        <Shield className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t('ACCESS_DENIED')}</h2>
        <p className="text-muted-foreground text-center">
          You don't have permission to view notifications.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Notification Management</h2>
          <p className="text-muted-foreground">Send and manage notifications</p>
        </div>
        <PermissionGate module={MODULES.NOTIFICATIONS} action={ACTIONS.CREATE}>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog} >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Send Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Send New Notification</DialogTitle>
                <DialogDescription>
                  Create and send notifications to users
                </DialogDescription>
              </DialogHeader>
              <NotificationForm
                loadNotifications={loadNotifications}
                onCancel={() => setShowCreateDialog(false)}
                users={allUsers}
              />
            </DialogContent>
          </Dialog>
        </PermissionGate>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <DebouncedSearchInput
                defaultValue={searchTerm}
                setPage={setCurrentPage}
                placeholder={t('SEARCH_NOTIFICATION_BY_TITLE')}
                onSearch={(value) => setSearchTerm(value)}

              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={recipientFilter} onValueChange={(e) => { if (e == 'all') { setRecipientFilter('') } else { setRecipientFilter(e) } }}>
                <SelectTrigger className="w-full sm:w-40 h-10">
                  <SelectValue placeholder="Recipients" />
                </SelectTrigger>
                <SelectContent>

                  <SelectItem value="all">All Recipients</SelectItem>
                  <SelectItem value="user">All Users</SelectItem>
                  <SelectItem value="specifiedUser">Specific Users</SelectItem>
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
            </div>

            <div className="flex gap-2">
              <PermissionGate module={MODULES.NOTIFICATIONS} action={ACTIONS.MANAGE}>
                <Button variant="outline" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
              </PermissionGate>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader >
          
          <CardTitle  className="flex items-center gap-2"> <Bell className="w-5 h-5"/> Notification History</CardTitle>
          <CardDescription>
            View and manage notifications
          </CardDescription>
        </CardHeader>


        <CardContent className="px-3 mt-3">
          <div className="border-t border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-muted/30">
                  <TableHead className="w-20 h-12">{t('SR_NO')}</TableHead>
                  <TableHead className=" w-12 min-w-[200px] h-12">
                    <SortButton<UserType>
                      field="title"
                      sortField={sortField}
                      onSort={handleSort}
                    >
                      {t('TITLE')}
                    </SortButton>
                  </TableHead>
                  <TableHead className="w-12 h-12">
                    <SortButton<UserType>
                      field="createdAt"
                      sortField={sortField}
                      onSort={handleSort}
                    >
                      {t('SENT_DATE')}
                    </SortButton>

                  </TableHead>

                  <TableHead className="w-12  h-12">{t('TYPE')}</TableHead>
                  <TableHead className="w-12 h-12">{t('ACTIONS')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                    <NotificationSkeleton key={i} />
                  ))
                ) : (
                  helpers.ternaryCondition(notifications?.docs?.length > 0, notifications?.docs?.map((subadmin, index) => (
                    <TableRow
                      key={subadmin._id}
                      className="group hover:bg-muted/50 transition-colors duration-150"
                    >
                      <TableCell className=''>
                        <span className='flex gap-2 justify-left items-center'>
                          <Badge variant="outline" className="font-mono">
                            {index + 1 + pageSize * (notifications?.page - 1)}
                          </Badge>
                        </span>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <div className="font-medium text-sm leading-none truncate max-w-[450px]">{helpers.capitalizeFirstWord(subadmin?.title)}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[450px]" dangerouslySetInnerHTML={{__html:subadmin?.description}}/>

                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="text-sm">
                          {showFormattedDate(subadmin?.createdAt)}
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="text-sm">
                          {startCase(subadmin?.sendTo)}
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
                            <DropdownMenuItem onClick={() =>setSelectedNotification(subadmin)}>
                              <Eye className="w-4 h-4 mr-2" />
                              {t('VIEW_DETAILS')}
                            </DropdownMenuItem>
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
          {helpers.andCondition(notifications?.docs?.length > 0, <Pagination currentPage={currentPage} pageSize={pageSize} length={notifications?.totalDocs} setPageSize={setPageSize} setCurrentPage={setCurrentPage} totalPages={notifications?.totalPages} />)}

        </CardContent>
      </Card>

      {/* Notification Details Dialog */}
      {selectedNotification && (
        <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)} >
          <DialogContent className="max-w-2xl">
            <DialogHeader className='text-left'>
              <DialogTitle  className="break-words break-all leading-snug text-pretty sm:w-[400px] w-[550px] mt-3">{helpers.capitalizeFirstWord(selectedNotification?.title)}</DialogTitle>
              <DialogDescription>
                Notification details and analytics
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Sent Date</p>
                  <p className="text-sm text-muted-foreground">
                    {showFormattedDate(selectedNotification?.createdAt)}
                  </p>
                </div>
               
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Message</p>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm  break-words break-all leading-snug text-pretty sm:w-[370px] w-[500px]" dangerouslySetInnerHTML={{__html:selectedNotification?.description}}/>
                </div>
              </div>

             
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}