import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {RotateCcw, RefreshCw, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useTranslation } from './TranslationContext';
import { User as UserType } from './AuthContext';
import { Pagination } from './common/Pagination';
import helpers from '@/utils/helpers';
import NoResultFound from './common/NoResultFound';
import SortButton from './common/SortButton';
import {  apiGet } from '@/utils/apiFetch';
import apiPath from '@/utils/apiPath';
import { ErrorToastMessage, SuccessToastMessage } from './common/sonner';
import { DateRangePicker } from './common/DateRangePicker';
import { showFormattedDate } from './common/showFormattedDate';


const ErrorLogSkeleton = () => (
    <TableRow className="hover:bg-muted/50">
        <TableCell className="w-12">
            <div className="h-8 w-8 bg-muted rounded animate-pulse" />
        </TableCell>
        <TableCell>
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
        </TableCell>

        <TableCell>
            <div className="space-y-2">
                <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            </div>
        </TableCell>
        <TableCell>
            <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
        </TableCell>
        <TableCell>
            <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
        </TableCell>
        <TableCell>
            <div className="h-4 w-30 bg-muted rounded animate-pulse" />
        </TableCell>
        <TableCell>
            <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
        </TableCell>
        <TableCell>
            <div className="space-y-2">
                <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            </div>
        </TableCell>


    </TableRow>
);
interface DateRange {
    from: Date | undefined;
    to: Date | undefined;
}




export function ErrorLogsManager() {
    const { t } = useTranslation();
    const [subadmins, setSubadmins] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [methodFilter, setMethodFilter] = useState<string>('');
    const [typeFilter, setTypeFilter] = useState<string>('');
    const [sortField, setSortField] = useState<keyof UserType>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
    // Load subadmins
    useEffect(() => {
        loadSubadmins();
    }, [sortDirection, sortField, statusFilter, searchTerm, pageSize, dateRange, currentPage,methodFilter,typeFilter]);

    const loadSubadmins = async () => {
        try {

            const paylaod = {
                sortType: sortDirection,
                sortBy: sortField,
                keyword: searchTerm,
                status: statusFilter,
                pageSize: pageSize,
                method:methodFilter,
                accountType:typeFilter,
                page: currentPage,
                startDate: dateRange?.from ? helpers.getFormattedDate(new Date(dateRange?.from)) : '',
                endDate: dateRange?.to ? helpers.getFormattedDate(new Date(dateRange?.to)) : ''
            }
            setLoading(true);
            const resp = await apiGet(apiPath.getErrorLogs, paylaod);
            if (resp?.data?.success) {
                setSubadmins(resp?.data?.results);
            }
        } catch (error) {
            console.error("Error while loading logs:", error);
            ErrorToastMessage({ message: 'Failed to load error logs' })
        } finally {
            setLoading(false);
        }
    };

    // Check if any filters are applied
    const hasActiveFilters = searchTerm || statusFilter !== '' || methodFilter !== '' || typeFilter !== '' || dateRange?.from || dateRange?.to;


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

    const getStatusBadge = (statusCode: number) => {
        if (statusCode >= 500) {
            return <Badge variant="destructive" className="flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {statusCode}
            </Badge>;
        } else if (statusCode >= 400) {
            return <Badge variant="secondary" className="flex items-center gap-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                <AlertTriangle className="w-3 h-3" />
                {statusCode}
            </Badge>;
        } else if (statusCode >= 300) {
            return <Badge variant="outline" className="flex items-center gap-1">
                <Info className="w-3 h-3" />
                {statusCode}
            </Badge>;
        } else {
            return <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {statusCode}
            </Badge>;
        }
    };

    const getLevelBadge = (level: string) => {
        switch (level?.toLowerCase()) {
            case 'error':
                return <Badge variant="destructive" className="capitalize">{level}</Badge>;
            case 'warning':
                return <Badge variant="secondary" className="capitalize bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">{level}</Badge>;
            case 'info':
                return <Badge variant="outline" className="capitalize">{level}</Badge>;
            default:
                return <Badge variant="secondary" className="capitalize">{level}</Badge>;
        }
    };

    const getMethodBadge = (method: string) => {
        const colors = {
            GET: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            POST: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            PUT: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            PATCH: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
        };

        return <Badge variant="secondary" className={`${colors[method as keyof typeof colors] || ''}`}>
            {method}
        </Badge>;
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setRoleFilter('all');
        setStatusFilter('');
        setTypeFilter('');
        setMethodFilter('');
        setCurrentPage(1);
        setDateRange({ from: undefined, to: undefined })
        SuccessToastMessage({ message: 'Filters reset' })
    };




    const handleRefresh = () => {
        setSearchTerm('');
        setRoleFilter('all');
        setStatusFilter('');
        setTypeFilter('');
        setMethodFilter('');
        setCurrentPage(1);
        setDateRange({ from: undefined, to: undefined })
        SuccessToastMessage({ message: 'List Refreshed' })
    };




    return (
        <div className="p-4 lg:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">


                <div>
                    <h2 className="text-3xl font-bold">Error Logs</h2>
                    <p className="text-muted-foreground">Monitor and analyze system errors and exceptions</p>
                </div>


                <div className="flex gap-2">
                    <Button onClick={handleRefresh} className="w-full sm:w-auto">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </Button>
                </div>

            </div>

            <Card className="shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col lg:flex-row gap-4">

                            <div className="flex flex-col sm:flex-row gap-2">
                                <Select value={methodFilter} onValueChange={(e) => { setCurrentPage(1); setPageSize(10); if (e == 'all') { setMethodFilter('') } else { setMethodFilter(e) } }}>
                                    <SelectTrigger className="w-full sm:w-40 h-10">
                                        <SelectValue placeholder="Method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Methods</SelectItem>
                                        <SelectItem value="GET">GET</SelectItem>
                                        <SelectItem value="POST">POST</SelectItem>
                                        <SelectItem value="PUT">PUT</SelectItem>
                                        <SelectItem value="DELETE">DELETE</SelectItem>
                                        <SelectItem value="PATCH">PATCH</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={statusFilter} onValueChange={(e) => { setCurrentPage(1); setPageSize(10); if (e == 'all') { setStatusFilter('') } else { setStatusFilter(e) } }}>
                                    <SelectTrigger className="w-full sm:w-40 h-10">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('ALL_STATUS')}</SelectItem>
                                        <SelectItem value="400">400 - Bad Request</SelectItem>
                                        <SelectItem value="401">401 - Unauthorized</SelectItem>
                                        <SelectItem value="404">404 - Not Found</SelectItem>
                                        <SelectItem value="500">500 - Internal Error</SelectItem>
                                    </SelectContent>
                                </Select>


                                <Select value={typeFilter} onValueChange={(e) => { setCurrentPage(1); setPageSize(10); if (e == 'all') { setTypeFilter('') } else { setTypeFilter(e) } }}>
                                    <SelectTrigger className="w-full sm:w-40 h-10">
                                        <SelectValue placeholder="Error Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Error Type</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
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
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-3">
                    <div className="border-t border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b bg-muted/30">
                                    <TableHead className="min-w-[60px] h-12">{t('SR_NO')}</TableHead>
                                    <TableHead className=" h-12">
                                        <SortButton<UserType>
                                            field="createdAt"
                                            sortField={sortField}
                                            onSort={handleSort}
                                        >
                                            {t('TIMESTAMP')}
                                        </SortButton>
                                    </TableHead>
                                    <TableHead className="min-w-[120px] h-12">{t('ROUTE')}</TableHead>

                                    <TableHead className="min-w-[120px] h-12">
                                        <SortButton<UserType>
                                            field="method"
                                            sortField={sortField}
                                            onSort={handleSort}
                                        >
                                            {t('METHOD')}
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

                                    <TableHead className="min-w-[120px] h-12">
                                        <SortButton<UserType>
                                            field="ip"
                                            sortField={sortField}
                                            onSort={handleSort}
                                        >
                                            {t('IP')}
                                        </SortButton>

                                    </TableHead>

                                    <TableHead className="min-w-[120px] h-12">
                                        <SortButton<UserType>
                                            field="accountType"
                                            sortField={sortField}
                                            onSort={handleSort}
                                        >
                                            {t('ACCOUNT')}
                                        </SortButton>

                                    </TableHead>

                                    <TableHead className="min-w-[120px] h-12">
                                        <SortButton<UserType>
                                            field="message"
                                            sortField={sortField}
                                            onSort={handleSort}
                                        >
                                            {t('MESSAGE')}
                                        </SortButton>

                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: pageSize }).map((_, i) => (
                                        <ErrorLogSkeleton key={i} />
                                    ))
                                ) : (
                                    helpers.ternaryCondition(subadmins?.docs?.length > 0, filteredSubadmins?.map((subadmin, index) => {
                                        return (
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
                                                <TableCell className="text-sm">
                                                    {showFormattedDate(subadmin?.createdAt)}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {subadmin?.route}
                                                </TableCell>
                                                <TableCell>
                                                    {getMethodBadge(subadmin?.method)}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(subadmin?.statusCode)}
                                                </TableCell>
                                                <TableCell>
                                                    {getLevelBadge(subadmin?.ip || 'N/A')}
                                                </TableCell>
                                                <TableCell className="capitalize">
                                                    <Badge variant="outline">{subadmin?.accountType}</Badge>
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate !py-4" title={subadmin?.message}>
                                                    {subadmin?.message}
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
        </div>
    );
}

