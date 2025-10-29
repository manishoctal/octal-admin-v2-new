
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Eye, MoreHorizontal, RotateCcw, Clock, Ban, CircleCheck, CheckCircle, CirclePlus, } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import {  PermissionGate, MODULES, ACTIONS } from './PermissionContext';
import { User as UserType } from './AuthContext';
import { Pagination } from './common/Pagination';
import helpers from '@/utils/helpers';
import NoResultFound from './common/NoResultFound';
import ConfirmStatusChange from './common/ConfirmStatusChange';
import SortButton from './common/SortButton';
import DebouncedSearchInput from './common/DebouncedSearchInput';
import { apiGet, apiPut } from '@/utils/apiFetch';
import apiPath from '@/utils/apiPath';
import { ErrorToastMessage, SuccessToastMessage } from './common/sonner';
import { DateRangePicker } from './common/DateRangePicker';
import { showFormattedDate } from './common/showFormattedDate';
import CardSkelton from './common/CardSkelton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { useTranslation } from './TranslationContext';

const ReportSkeleton = () => (
    <TableRow className="hover:bg-muted/50">
        <TableCell className="w-12">
            <div className="h-4 w-4 bg-muted rounded animate-pulse" />
        </TableCell>
        <TableCell>
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        </TableCell>
        <TableCell>
            <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-3 w-32 bg-muted rounded animate-pulse" />
            </div>
        </TableCell>

        <TableCell>
            <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-3 w-48 bg-muted rounded animate-pulse" />
            </div>
        </TableCell>
        <TableCell>
            <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
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
export function ReportManager() {
    const { t } = useTranslation();
    const [subadmins, setSubadmins] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [sortField, setSortField] = useState<keyof UserType>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [StatusSubadminId, setStatusSubadminId] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
    // Load subadmins
    useEffect(() => {
        loadReports();
    }, [sortDirection, sortField, statusFilter, searchTerm, pageSize, dateRange, currentPage]);

    const loadReports = async () => {
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
            const resp = await apiGet(apiPath.getReports, paylaod);
            if (resp?.data?.success) {
                setSubadmins(resp?.data?.results);
            }
        } catch (error) {
            ErrorToastMessage({ message: 'Failed to load reports' })
        } finally {
            setLoading(false);
        }
    };

    // Check if any filters are applied
    const hasActiveFilters = searchTerm || statusFilter !== '' || dateRange?.from || dateRange?.to;

    // Calculate statistics
    const statistics = useMemo(() => {
        const totalSubadmins = subadmins?.totalReports;
        const pendingSubadmins = subadmins?.totalPendingReports;
        const approvedSubadmins = subadmins?.totalApprovedReports;
        const rejectedSubadmins = subadmins?.totalRejectedReports;
        return {
            totalUsers: totalSubadmins,
            pendingSubadmins: pendingSubadmins,
            approvedSubadmins: approvedSubadmins,
            rejectedSubadmins: rejectedSubadmins

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




    const handleToggleStatus = async (subadmin: UserType) => {
        try {
            const newStatus = subadmin?.action
            const resp = await apiPut(apiPath.getReports + '/' + subadmin?._id, { status: newStatus, });
            if (resp?.data?.success) {
                SuccessToastMessage({ message: resp?.data?.message })
                loadReports();
            }
        } catch (error) {
            ErrorToastMessage({ message: error?.response?.data?.message || 'Failed to update report status' })
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
            case 'approved': return 'default';
            case 'pending': return 'warning';
            case 'rejected': return 'destructive';
            default: return 'outline';
        }
    };


    return (
        <div className="p-4 lg:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>

                    <h2 className="text-3xl font-bold">Report Management</h2>
                    <p className="text-muted-foreground">Review and manage user reports</p>
                </div>

            </div>

            {/* Statistics Cards */}

            {helpers.ternaryCondition(loading, <CardSkelton />,
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    <Card className="transition-all duration-200 hover:shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                                    <div className="text-2xl font-bold">{statistics?.totalUsers?.toLocaleString()}</div>
                                </div>
                                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                                    <CirclePlus className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="transition-all duration-200 hover:shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                                    <div className="text-2xl font-bold">{statistics?.pendingSubadmins?.toLocaleString()}</div>
                                </div>
                                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                                    <Clock className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="transition-all duration-200 hover:shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Approved</p>
                                    <div className="text-2xl font-bold">{statistics?.approvedSubadmins?.toLocaleString()}</div>
                                </div>
                                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="transition-all duration-200 hover:shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                                    <div className="text-2xl font-bold">{statistics?.rejectedSubadmins?.toLocaleString() || 0}</div>
                                </div>
                                <div className="p-3 rounded-lg bg-red-50 dark:bg-green-950/20">
                                    <Ban className="h-6 w-6 text-red-600" />
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
                                    placeholder={t('SEARCH_BY_NAME')}
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
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>

                                <DateRangePicker
                                    dateRange={dateRange}
                                    onDateRangeChange={setDateRange}
                                    placeholder={t('FILTER_BY_REPORTED_DATE')}
                                    className="w-full sm:w-[280px]"
                                />

                                {hasActiveFilters && (
                                    <Button variant="outline" onClick={handleResetFilters} className="w-full sm:w-auto h-10">
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        {t('RESET')}
                                    </Button>
                                )}

                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-3">
                    <div className="border-t border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b bg-muted/30">
                                    <TableHead className="w-20 h-12">{t('SR_NO')}</TableHead>

                                    <TableHead className="min-w-[120px] h-12">
                                        <SortButton<UserType>
                                            field="reporter.fullName"
                                            sortField={sortField}
                                            onSort={handleSort}
                                        >
                                            {t('REPORTER_NAME')}
                                        </SortButton>

                                    </TableHead>

                                    <TableHead className="min-w-[120px] h-12">
                                        <SortButton<UserType>
                                            field="reportedUser.fullName"
                                            sortField={sortField}
                                            onSort={handleSort}
                                        >
                                            {t('REPORTED_USER')}
                                        </SortButton>

                                    </TableHead>

                                    <TableHead className="min-w-[200px] h-12">
                                        <SortButton<UserType>
                                            field="reason"
                                            sortField={sortField}
                                            onSort={handleSort}
                                        >
                                            {t('REASON')}
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
                                            {t('REPORTED_DATE')}
                                        </SortButton>
                                    </TableHead>

                                    <TableHead className="min-w-[100px] h-12">
                                        <SortButton<UserType>
                                            field="updatedAt"
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
                                        <ReportSkeleton key={i} />
                                    ))
                                ) : (
                                    helpers.ternaryCondition(subadmins?.docs?.length > 0, filteredSubadmins?.map((subadmin, index) => (
                                        <TableRow
                                            key={subadmin._id}
                                            className="group hover:bg-muted/50 transition-colors duration-150"
                                        >
                                            <TableCell className=''>
                                                <span className='flex gap-2 justify-left items-center'>
                                                    <Badge variant="outline" className="font-mono">
                                                        {index + 1 + pageSize * (subadmins?.page - 1)}
                                                    </Badge>
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="space-y-1">
                                                    <div className="font-medium text-sm leading-none">{helpers.capitalizeFirstWord(subadmin?.reporter?.fullName)}</div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="py-4">
                                                <div className="space-y-1">
                                                    <div className="font-medium text-sm leading-none">{helpers.capitalizeFirstWord(subadmin?.reportedUser?.fullName)}</div>
                                                    {helpers.ternaryCondition(subadmin?.reportedUser?.reportCount, <div className="text-xs text-muted-foreground truncate max-w-[450px]"><span className='text-xs'>Report Count:</span> <b>{subadmin?.reportedUser?.reportCount}</b></div>,'')}

                                                </div>
                                            </TableCell>

                                            <TableCell className="py-4">
                                                <div className="space-y-1">
                                                    <div className="font-medium text-sm leading-none">{subadmin?.reason}</div>
                                                    <div className="text-xs text-muted-foreground truncate max-w-[450px]">{subadmin?.description}</div>

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
                                                        <DropdownMenuItem onClick={() => setSelectedReport(subadmin)}>
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            {t('VIEW_DETAILS')}
                                                        </DropdownMenuItem>
                                                        {helpers.andCondition(subadmin?.status == 'pending', <PermissionGate module={MODULES.REPORTS} action={ACTIONS.EDIT}>
                                                            <DropdownMenuItem onClick={() => setStatusSubadminId({ ...subadmin, action: 'approve' })}>
                                                                <CircleCheck className="w-4 h-4 mr-2" />
                                                                {t('APPROVE')}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => setStatusSubadminId({ ...subadmin, action: 'reject' })}>
                                                                <Ban className="w-4 h-4 mr-2" />
                                                                {t('REJECT')}
                                                            </DropdownMenuItem>
                                                        </PermissionGate>)}
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
                    {helpers.andCondition(filteredSubadmins?.length > 0, <Pagination currentPage={currentPage} pageSize={pageSize} length={subadmins?.totalDocs} setPageSize={setPageSize} setCurrentPage={setCurrentPage} totalPages={subadmins?.totalPages} />)}

                </CardContent>
            </Card>
            {selectedReport && (
                <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Report Details</DialogTitle>
                            <DialogDescription>
                                Complete information about this report
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm font-medium">Reporter</p>
                                    <p className="text-sm text-muted-foreground">{helpers.capitalizeFirstWord(selectedReport?.reporter?.fullName)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Reported Date</p>
                                    <p className="text-sm text-muted-foreground">
                                        {showFormattedDate(selectedReport?.createdAt)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium">Status</p>
                                    <Badge variant={getStatusColor(selectedReport.status)} className="font-medium">
                                        {helpers.capitalizeFirstWord(selectedReport.status)}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-4">

                                <div className='grid grid-cols-3 gap-4'>
                                    {selectedReport?.reportedUser?.fullName && (
                                        <div>
                                            <p className="text-sm font-medium">Reported User</p>
                                            <p className="text-sm text-muted-foreground">{helpers.capitalizeFirstWord(selectedReport?.reportedUser?.fullName)}</p>
                                        </div>
                                    )}

                                    {selectedReport?.reportedUser?.reportedCount && (
                                        <div>
                                            <p className="text-sm font-medium">Reported Count</p>
                                            <p className="text-sm text-muted-foreground">{selectedReport?.reportedUser?.reportedCount}</p>
                                        </div>
                                    )}

                                </div>


                                <div>
                                    <p className="text-sm font-medium">Report Reason</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-muted-foreground">•</span>
                                        <span>{selectedReport?.reason}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Description</p>
                                    <div className="p-3 bg-muted rounded-lg mt-1 ">
                                        <p className="text-sm">{selectedReport?.description}</p>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </DialogContent>
                </Dialog>
            )}

            <ConfirmStatusChange
                open={!!StatusSubadminId}
                onCancel={() => setStatusSubadminId(null)}
                onConfirm={() => StatusSubadminId && handleToggleStatus(StatusSubadminId)}
                confirmText="Yes"
                title={t('ARE_YOU_SURE_YOU_WANT_TO') + helpers.ternaryCondition(StatusSubadminId?.action == 'approve', 'approve', 'reject') + ' report'}
                loading={loading}
            />

        </div>
    );
}