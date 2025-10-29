
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Trash2, Eye, MoreHorizontal, RotateCcw, UserCheck, UserX, CircleCheck, Loader2,  Heart, ImageUp, Camera, Upload, X, AlertCircle, XIcon, Ban } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Avatar, AvatarImage } from './ui/avatar';
import { useTranslation } from './TranslationContext';
import {  PermissionGate, MODULES, ACTIONS } from './PermissionContext';
import { User as UserType } from './AuthContext';
import { Pagination } from './common/Pagination';
import helpers from '@/utils/helpers';
import NoResultFound from './common/NoResultFound';
import ConfirmDialog from './common/DeleteConfirm';
import ConfirmStatusChange from './common/ConfirmStatusChange';
import SortButton from './common/SortButton';
import { apiDelete, apiGet, apiPost } from '@/utils/apiFetch';
import apiPath from '@/utils/apiPath';
import { ErrorToastMessage, SuccessToastMessage } from './common/sonner';
import { DateRangePicker } from './common/DateRangePicker';
import { showFormattedDate } from './common/showFormattedDate';
import CardSkelton from './common/CardSkelton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Alert, AlertDescription } from './ui/alert';
import axios from 'axios';





interface SecretCrush {
    id: string;
    senderName: string;
    senderEmail: string;
    senderAvatar?: string;
    recipientName: string;
    recipientEmail: string;
    recipientAvatar?: string;
    crushGif: string;
    crushGifThumbnail?: string;
    message?: string;
    sentDate: string;
    status: 'active' | 'inactive';
    isRevealed: boolean;
    category: 'flowers' | 'chocolates' | 'hearts' | 'teddy' | 'custom';
    giftType: string;
    views: number;
    reactions?: number;
    expiryDate?: string;
}

interface CreateCrushForm {
    senderName: string;
    senderEmail: string;
    senderAvatar: string;
    recipientName: string;
    recipientEmail: string;
    recipientAvatar: string;
    crushGif: string;
    message: string;
    category: string;
    giftType: string;
    status: 'active' | 'inactive';
    isRevealed: boolean;
    setExpiry: boolean;
    expiryDate?: Date;
}


interface ImageValidationResult {
    isValid: boolean;
    error?: string;
    size?: number;
    dimensions?: { width: number; height: number };
}





const SecretCrushSkeleton = () => (
    <TableRow className="hover:bg-muted/50">
        <TableCell className="w-12">
            <div className="h-8 w-8 bg-muted rounded animate-pulse" />
        </TableCell>
        <TableCell className="">
            <div className="w-22 h-18 bg-muted rounded-md animate-pulse" />
        </TableCell>

        <TableCell>
            <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
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






export function SecretCrushManager() {
    const { t } = useTranslation();
    const [subadmins, setSubadmins] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
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

    const [selectedCrush, setSelectedCrush] = useState<SecretCrush | null>(null);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [key, setKey] = useState("");
    const [url, setURL] = useState("");


    const [formData, setFormData] = useState<CreateCrushForm>({
        senderName: '',
        senderEmail: '',
        senderAvatar: '',
        recipientName: '',
        recipientEmail: '',
        recipientAvatar: '',
        crushGif: '',
        message: '',
        category: '',
        giftType: '',
        status: 'active',
        isRevealed: false,
        setExpiry: false,
        expiryDate: undefined
    });






    // Load subadmins
    useEffect(() => {
        loadSecretCrush();
    }, [sortDirection, sortField, statusFilter, pageSize, dateRange, currentPage]);

    const loadSecretCrush = async () => {
        try {

            const paylaod = {
                sortType: sortDirection,
                sortBy: sortField,
                status: statusFilter,
                pageSize: pageSize,
                page: currentPage,
                startDate: dateRange?.from ? helpers.getFormattedDate(new Date(dateRange?.from)) : '',
                endDate: dateRange?.to ? helpers.getFormattedDate(new Date(dateRange?.to)) : ''
            }
            setLoading(true);
            const resp = await apiGet(apiPath.getSecretCrush, paylaod);
            if (resp?.data?.success) {
                setSubadmins(resp?.data?.results);
            }
        } catch (error) {
            ErrorToastMessage({ message: 'Failed to load crush' })
        } finally {
            setLoading(false);
        }
    };

    // Check if any filters are applied
    const hasActiveFilters = statusFilter !== '' || dateRange?.from || dateRange?.to;

    // Calculate statistics
    const statistics = useMemo(() => {
        const totalSubadmins = subadmins?.totalCrushes;
        const activeSubadmins = subadmins?.totalActiveCrushes;
        const inactiveSubadmins = subadmins?.totalInactiveCrushes;
        return {
            totalUsers: totalSubadmins,
            activeUsers: activeSubadmins,
            inactiveUsers: inactiveSubadmins,

        };
    }, [subadmins]);

    // Filtered and sorted subadmins
    const filteredSubadmins = useMemo(() => {
        return subadmins?.docs;
    }, [subadmins, roleFilter, statusFilter, sortField, sortDirection]);



    const handleSort = (field: keyof UserType) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };



    const fileInputRef = useRef<HTMLInputElement>(null);

    // Image validation constants
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/gif'];
    const MAX_DIMENSIONS = { width: 2048, height: 2048 };
    const MIN_DIMENSIONS = { width: 100, height: 100 };

    // Validate image file
    const validateImage = async (file: File): Promise<ImageValidationResult> => {

        // Check file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return {
                isValid: false,
                error: 'Please upload a valid file (GIF).'
            };
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return {
                isValid: false,
                error: `GIF size must be less than ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB`
            };
        }

        // Check image dimensions
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const { width, height } = img;

                if (width > MAX_DIMENSIONS.width || height > MAX_DIMENSIONS.height) {
                    resolve({
                        isValid: false,
                        error: `GIF dimensions must be less than ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height}px`
                    });
                } else if (width < MIN_DIMENSIONS.width || height < MIN_DIMENSIONS.height) {
                    resolve({
                        isValid: false,
                        error: `GIF dimensions must be at least ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height}px`
                    });
                } else {
                    resolve({
                        isValid: true,
                        size: file.size,
                        dimensions: { width, height }
                    });
                }
            };

            img.onerror = () => {
                resolve({
                    isValid: false,
                    error: 'Invalid image file'
                });
            };

            img.src = URL.createObjectURL(file);
        });
    };

    // Handle image upload

    const [file, setFile] = useState()
    const handleImageUpload = async (file: File) => {
        setImageLoading(true);
        setError('');

        try {
            const validation = await validateImage(file);

            if (!validation.isValid) {
                setError(validation.error || 'Invalid GIF file');
                return;
            }

            if (file) {
                setFile(file)
                const payloadPre = {
                    contentType: file?.type,
                    folder: "secretCrush",
                };
                const path = apiPath.generatePreSignUrl;
                const result = await apiPost(path, payloadPre);
                if (result?.data?.success) {
                    setKey(result?.data?.results?.key);
                    setURL(result?.data?.results?.url);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const result = e.target?.result as string;
                        setFormData(prev => ({ ...prev, avatar: result }));
                    };
                    reader.readAsDataURL(file);

                }
            }
        } catch (error) {
            setError(error?.response?.data?.message || 'Failed to process GIF. Please try again.');
        } finally {
            setImageLoading(false);
        }
    }

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    // Handle drag and drop
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files?.[0]) {
            handleImageUpload(files[0]);
        }
    }, []);




    // Remove avatar
    const handleRemoveAvatar = () => {
        setFormData(prev => ({ ...prev, avatar: '' }));
        setFile('')
    };

    const handleDeleteSubadmin = async (subadminId: any) => {
        let resp
        try {
            if (typeof subadminId == 'string') {
                resp = await apiDelete(apiPath.getSecretCrush + '/' + subadminId,);
                if (resp?.data?.success) {
                    SuccessToastMessage({ message: resp?.data?.message })
                    setDeleteSubadminId(null);
                    loadSecretCrush();

                }
            } else {

                resp = await apiPost(apiPath.getEvents + '/bulk-delete-events', { ids: selectedSubadmins })
                if (resp?.data?.success) {
                    setDeleteSubadminId(null);
                    loadSecretCrush();
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
            const resp = await apiPost(apiPath.getSecretCrush + '/' + subadmin?._id, { status: newStatus, });
            if (resp?.data?.success) {
                SuccessToastMessage({ message: resp?.data?.message })
                loadSecretCrush();
            }
        } catch (error) {
            ErrorToastMessage({ message: error?.response?.data?.message || 'Failed to update secret crush status' })
        }
    };

    const handleResetFilters = () => {
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
        setSelectedCrush(subadminId)
        setShowViewDialog(true)
    };


    const resetForm = () => {
        setFormData({
            avatar: ''
        });
        setError('')
    };



    const addSecret = async (payload) => {
        let resp
        try {
            resp = await apiPost(apiPath.getSecretCrush, payload)
            if (resp?.data?.success) {
                SuccessToastMessage({ message: resp?.data?.message })
                setURL('')
                setKey('')
                setFile('')
                resetForm()
                setShowAddDialog(false)
                loadSecretCrush()
            }

        } catch (err) {
            ErrorToastMessage({ message: err?.response?.data?.message })
        } finally {
            setLoading(false);
        }


    }

    const handleCreateCrush = async () => {
        try {

            if (!formData?.avatar) {
                setError('Secret crush GIF is required.');
                return;
            }
            setLoading(true);
            const imageReader = new FileReader();
            if (file) {

                imageReader.readAsArrayBuffer(file);
                imageReader.onloadend = async () => {
                    const binaryData = imageReader.result;
                    const contentType = file?.type;
                    const resp = await axios.put(url, binaryData, {
                        headers: {
                            "Content-Type": contentType ? contentType : "application/octet-stream",
                        },
                    });
                    if (resp?.status === 200) {
                        addSecret({ gif: key })
                    }
                };
                return
            }
        } catch (error) {
            setError(error?.response?.data?.message || 'Failed to add secret crush.');
        }

    };

    return (
        <div className="p-4 lg:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold">Secret Crush Management</h2>
                    <p className="text-muted-foreground">Manage secret crushes</p>
                </div>

                <div className="flex gap-2">
                    <PermissionGate module={MODULES.SECRET_CRUSH} action={ACTIONS.CREATE}>
                        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add Secret Crush
                                </Button>
                            </DialogTrigger>
                            <DialogContent isCross={true} className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                <span onClick={() => {
                                    setShowAddDialog(false);
                                    resetForm();
                                }} className="ring-offset-background cursor-pointer focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                                    <XIcon />
                                    <span className="sr-only">Close</span>
                                </span>

                                <DialogHeader>
                                    <DialogTitle>Create New Secret Crush</DialogTitle>
                                    <DialogDescription>
                                        Create a new secret crush for users
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6">


                                    {error && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="space-y-4 mt-2 ">
                                        <Label>Secret Crush GIF<span className='text-red-500'>*</span></Label>
                                        <div className="flex items-start gap-4">
                                            <div className="relative">
                                                <Avatar className="w-20 h-20">
                                                    {formData?.avatar ? (
                                                        <AvatarImage src={formData?.avatar} alt={formData?.name} />
                                                    ) : (
                                                        <span className="bg-muted flex size-full items-center justify-center rounded-full text-lg"><ImageUp className='h-12 w-8' /></span>
                                                    )}
                                                </Avatar>
                                                {imageLoading && (
                                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 space-y-3">
                                                <div
                                                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}`}
                                                    onDragEnter={handleDrag}
                                                    onDragLeave={handleDrag}
                                                    onDragOver={handleDrag}
                                                    onDrop={handleDrop}
                                                >
                                                    <div className="space-y-2">
                                                        <Camera className="w-8 h-8 mx-auto text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                Drag and drop your image here, or{' '}
                                                                <button
                                                                    type="button"
                                                                    className="text-primary hover:underline"
                                                                    onClick={() => fileInputRef.current?.click()}
                                                                >
                                                                    browse
                                                                </button>
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                GIF • Max 5MB • Min 100x100px
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        disabled={imageLoading}
                                                        className="gap-2"
                                                    >
                                                        <Upload className="w-4 h-4" />
                                                        Upload Image
                                                    </Button>
                                                    {formData?.avatar && file && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={handleRemoveAvatar}
                                                            disabled={imageLoading}
                                                            className="gap-2 text-destructive hover:text-destructive"
                                                        >
                                                            <X className="w-4 h-4" />
                                                            Remove
                                                        </Button>
                                                    )}
                                                </div>

                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept={ALLOWED_TYPES.join(',')}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </div>

                                        </div>

                                    </div>


                                    {/* Action Buttons */}
                                    <div className="flex justify-end gap-2 pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowAddDialog(false);
                                                resetForm();
                                            }}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleCreateCrush}
                                            disabled={loading || !formData?.avatar}>
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Create Secret Crush
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </PermissionGate>
                </div>


            </div>

            {/* Statistics Cards */}

            {helpers.ternaryCondition(loading, <CardSkelton />,
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="transition-all duration-200 hover:shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Total Crushes</p>
                                    <div className="text-2xl font-bold">{statistics?.totalUsers?.toLocaleString()}</div>
                                </div>
                                <div className="p-3 rounded-lg bg-pink-100 dark:bg-pink-900/20">
                                    <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="transition-all duration-200 hover:shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Active Crushes</p>
                                    <div className="text-2xl font-bold">{statistics?.activeUsers?.toLocaleString()}</div>
                                </div>
                                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                                    <CircleCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="transition-all duration-200 hover:shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Inactive Crushes</p>
                                    <div className="text-2xl font-bold">{statistics?.inactiveUsers?.toLocaleString()}</div>
                                </div>
                                <div className="p-3 rounded-lg bg-pink-100 dark:bg-pink-900/20">
                                    <Ban className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>)}

            <Card className="shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Select value={statusFilter} onValueChange={(e) => {setCurrentPage(1); if (e == 'all') { setStatusFilter('') } else { setStatusFilter(e) } }}>
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

                                    <TableHead>GIF Preview</TableHead>

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
                                    <TableHead className="w-12 h-12">  {t('ACTIONS')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: pageSize }).map((_, i) => (
                                        <SecretCrushSkeleton key={i} />
                                    ))
                                ) : (
                                    helpers.ternaryCondition(subadmins?.docs?.length > 0, filteredSubadmins?.map((subadmin, index) => {
                                        return (
                                            <TableRow
                                                key={subadmin._id}
                                                className="group hover:bg-muted/50 transition-colors duration-150">
                                                <TableCell className=''>
                                                    <span className='flex gap-2 justify-left items-center'>
                                                        <Badge variant="outline" className="font-mono">
                                                            {index + 1 + pageSize * (subadmins?.page - 1)}
                                                        </Badge>
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="relative">
                                                        <ImageWithFallback
                                                            src={subadmin?.gif}
                                                            alt={`GIF`}
                                                            className="w-22 h-18 object-cover rounded-lg border"
                                                        />

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
                                                            <PermissionGate module={MODULES.SECRET_CRUSH} action={ACTIONS.CREATE}>
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

                                                            <PermissionGate module={MODULES.SECRET_CRUSH} action={ACTIONS.DELETE}>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="text-destructive focus:text-destructive"
                                                                    onClick={() => setDeleteSubadminId(subadmin._id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                    {t('DELETE_CRUSH')}
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



            {/* View Details Dialog */}
            {selectedCrush && showViewDialog && (
                <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Secret Crush Details</DialogTitle>
                            <DialogDescription>
                                Complete information about this secret crush
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 mx-5">
                                <div>
                                    <p className="text-sm font-medium">Status</p>
                                    <Badge variant={getStatusColor(selectedCrush?.status)} className="font-medium">
                                        {helpers.capitalizeFirstWord(selectedCrush?.status)}
                                    </Badge>

                                </div>

                                <div>
                                    <p className="text-sm font-medium">Created At</p>
                                    {showFormattedDate(selectedCrush?.createdAt)}
                                </div>

                            </div>
                            <div className="text-center">
                                <div className="relative inline-block">
                                    <ImageWithFallback
                                        src={selectedCrush?.gif}
                                        alt={`GIF`}
                                        className="max-w-full h-auto max-h-64 rounded-lg border shadow-lg"
                                    />

                                </div>
                            </div>

                        </div>
                    </DialogContent>
                </Dialog>
            )}

            <ConfirmDialog
                open={!!deleteSubadminId}
                onCancel={() => setDeleteSubadminId(null)}
                onConfirm={() => deleteSubadminId && handleDeleteSubadmin(deleteSubadminId)}
                description="This will permanently delete the secret crush and remove their access to the system."
                confirmText="Delete"
                loading={loading}
            />

            <ConfirmStatusChange
                open={!!StatusSubadminId}
                onCancel={() => setStatusSubadminId(null)}
                onConfirm={() => StatusSubadminId && handleToggleStatus(StatusSubadminId)}
                confirmText="Yes"
                title={t('ARE_YOU_SURE_YOU_WANT_TO') + helpers.ternaryCondition(StatusSubadminId?.status == 'active', 'inactive', 'active') + ' secret crush'}
                loading={loading}
            />

        </div>
    );
}