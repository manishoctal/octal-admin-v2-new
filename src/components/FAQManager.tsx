import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import ConfirmDialog from './common/DeleteConfirm';
import ConfirmStatusChange from './common/ConfirmStatusChange';
import { User as UserType } from './AuthContext';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  RotateCcw,
  Loader2,
  GripVertical,
  MoreHorizontal,
  UserCheck,
  UserX
} from 'lucide-react';
import {  MODULES, ACTIONS, PermissionGate } from './PermissionContext';
import SortButton from './common/SortButton';
import { useTranslation } from './TranslationContext';
import { showFormattedDate } from './common/showFormattedDate';
import helpers from '@/utils/helpers';
import { apiDelete, apiGet, apiPost } from '@/utils/apiFetch';
import apiPath from '@/utils/apiPath';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { DateRangePicker } from './common/DateRangePicker';
import DebouncedSearchInput from './common/DebouncedSearchInput';
import { ErrorToastMessage, SuccessToastMessage } from './common/sonner';
import { Pagination } from './common/Pagination';
import NoResultFound from './common/NoResultFound';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  sequence: number;
  viewCount: number;
  isHelpful: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}


interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}
const SubadminSkeleton = () => (
  <TableRow className="hover:bg-muted/50">
    <TableCell className="w-12">
      <div className="h-4 w-4 bg-muted rounded animate-pulse" />
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


export default function  FAQManager() {
  const [faqs, setFaqs] = useState<FAQ[]>();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [sortField, setSortField] = useState<keyof UserType>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [deleteSubadminId, setDeleteSubadminId] = useState<string | null>(null);
  const [StatusSubadminId, setStatusSubadminId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  // Permission checks
  useEffect(() => {
    loadSubadmins();
  }, [sortDirection, sortField, statusFilter, searchTerm, pageSize, dateRange, currentPage]);

  const loadSubadmins = async () => {

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
    try {
      setLoading(true);
      const resp = await apiGet(apiPath.getFAQ, paylaod);
      if (resp?.data?.success) {
        setFaqs(resp?.data?.results);
      }

    } catch (error) {
      console.log('------error-----', error)
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
  const { t } = useTranslation()
  
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCurrentPage(1);
    setDateRange({ from: undefined, to: undefined })
    SuccessToastMessage({ message: 'Filters reset' })
  };




  // Filter FAQs
  const filteredFAQs = faqs?.docs;
  const hasActiveFilters = searchTerm || statusFilter !== '' || dateRange?.from || dateRange?.to;
  const totalPages = Math.ceil(filteredFAQs?.length / pageSize);
  const handleCreate = () => {
    const newFAQ: FAQ = {
      id: `new-${Date.now()}`,
      question: '',
      answer: '',
      category: 'general',
      isActive: true,
      sequence: faqs?.docs?.length + 1,
      viewCount: 0,
      isHelpful: false,
      helpfulCount: 0,
      notHelpfulCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
      updatedBy: 'Current User'
    };

    setSelectedFAQ(newFAQ);
    setIsCreating(true);
    setIsEditing(true);
  };


  const handleToggleStatus = async (subadmin: UserType) => {
    try {
      const newStatus = subadmin?.status === 'active' ? 'inactive' : 'active';
      const updatedSubadmin = await apiPost(apiPath.getFAQ + '/change-status/' + subadmin?._id, { status: newStatus, type: 'faq' });
      if (updatedSubadmin?.data?.success) {
        loadSubadmins();
        SuccessToastMessage({ message: updatedSubadmin?.data?.message })
      }
    } catch (error) {
      SuccessToastMessage({ message: error?.response?.data?.message })
      console.error('Error updating subadmin status:', error);
    }
  };




  const handleEdit = (faq: FAQ) => {
    setSelectedFAQ({ ...faq, question: faq?.title, answer: faq?.content, });

    setIsEditing(true);
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!selectedFAQ) return;

    if (!selectedFAQ?.question?.trim() || !selectedFAQ?.answer?.trim()) {
      ErrorToastMessage({ message: 'Question and answer are required.' })
      return;
    }

    setLoading(true);
    try {      
      const resp =isCreating? await apiPost(apiPath.getFAQ+'/create', { title: selectedFAQ?.question, content: selectedFAQ?.answer }):await apiPost(apiPath.getFAQ+'/update/'+selectedFAQ?._id, { title: selectedFAQ?.question, content: selectedFAQ?.answer })
      if (resp?.data?.success) {
        SuccessToastMessage({ message: resp?.data?.message })
        loadSubadmins()
      }
      setIsEditing(false);
      setIsCreating(false);
      setSelectedFAQ(null);
    } catch (error) {
      ErrorToastMessage({ message: error?.response?.data?.message || 'Failed to save FAQ' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (faqId: string) => {
  
    setLoading(true);
    try {      
    const resp=await apiDelete(apiPath.getFAQ+'/delete/'+faqId)
      if (resp?.data?.success) {
        SuccessToastMessage({ message: resp?.data?.message })
        loadSubadmins()
      }
      setIsEditing(false);
      setIsCreating(false);
      setSelectedFAQ(null);
    } catch (error) {
      ErrorToastMessage({ message: error?.response?.data?.message || 'Failed to delete FAQ' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setSelectedFAQ(null);
  };

  const handlePreview = (faq: FAQ) => {
    setSelectedFAQ({ ...faq, question: faq?.title, answer: faq?.content, });
    setIsEditing(false);
    setIsCreating(false);
  };

  const moveItem = async (fromIndex: number, toIndex: number) => {
    const newFAQs = [...filteredFAQs];
    const [movedItem] = newFAQs.splice(fromIndex, 1);
    newFAQs.splice(toIndex, 0, movedItem);

    // Update sequences
    const updatedFAQs = newFAQs.map((faq, index) => ({
      ...faq,
      title: faq?.title,
      _id: faq?._id,
      sequence: index + 1
    }));


    try {
      const reOrderResult = await apiPost(apiPath.reOrderFaq, {
        sequence: updatedFAQs,
      });
      if (reOrderResult?.data?.success) {
        loadSubadmins();
        SuccessToastMessage({ message: reOrderResult?.data?.message })
      }
    } catch (error) {
      console.error("error in get all FAQs list==>>>>", error);
      SuccessToastMessage({ message: error?.response?.data?.message })
    }



  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveItem(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      default: return 'outline';
    }
  };



  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">FAQ Management</h2>
          <p className="text-muted-foreground">Manage frequently asked questions</p>
        </div>
        <PermissionGate module={MODULES.FAQ} action={ACTIONS.CREATE}>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Add FAQ
          </Button>
        </PermissionGate>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">

          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <DebouncedSearchInput
                  defaultValue={searchTerm}
                  setPage={setCurrentPage}
                  placeholder={t('SEARCH_BY_QUESTION')}
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


              </div>
            </div>
          </div>


        </CardContent>
      </Card>

      {/* FAQs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            FAQs ({filteredFAQs?.length})
          </CardTitle>
          <CardDescription>
            Drag and drop rows to reorder FAQs
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 mt-3">
          <div className="overflow-x-auto border-t border rounded-lg">
            <Table>

              <TableHeader>
                <TableRow className="border-b bg-muted/30">
                  <TableHead className="w-12 h-12 text-center">#</TableHead>
                  <TableHead className="min-w-[200px] h-12">
                    <SortButton<UserType>
                      field="title"
                      sortField={sortField}
                      onSort={handleSort}
                    >
                      {t('QUESTION_AND_ANSWER')}
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
                      field="updatedAt"
                      sortField={sortField}
                      onSort={handleSort}
                    >
                      {t('UPDATED_AT')}
                    </SortButton>
                  </TableHead>
                  <TableHead className="w-12 h-12 text-center">  {t('ACTIONS')}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>

                {helpers.ternaryCondition(loading , (
                  Array.from({ length: pageSize }).map((_, i) => (
                    <SubadminSkeleton key={i} />
                  ))
                ) ,
                  helpers.ternaryCondition(filteredFAQs?.length > 0,
                    filteredFAQs?.map((faq, index) => (
                      <TableRow
                        key={faq._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`cursor-move ${draggedIndex === index ? 'opacity-50' : ''}`}
                      >

                        <TableCell className=''>
                          <span className='flex gap-2 justify-center items-center'>
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                            <Badge variant="outline" className="font-mono">

                              {index + 1 + pageSize * (faqs?.page - 1)}
                            </Badge>
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium truncate" title={faq?.title}>
                              {faq?.title}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {faq?.content?.substring(0, 80)}...
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <Badge variant={getStatusColor(faq?.status)} className="font-medium">
                            {helpers.capitalizeFirstWord(faq?.status || 'N/A')}
                          </Badge>
                        </TableCell>


                        <TableCell className="py-4">
                          <div className="text-sm">
                            {showFormattedDate(faq?.createdAt)}
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="text-sm">
                            {showFormattedDate(faq?.updatedAt)}
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
                              <DropdownMenuItem onClick={() => handlePreview(faq)}>
                                <Eye className="w-4 h-4 mr-2" />
                                {t('VIEW_DETAILS')}
                              </DropdownMenuItem>
                              <PermissionGate module={MODULES.FAQ} action={ACTIONS.EDIT}>
                                <DropdownMenuItem onClick={() => handleEdit(faq)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  {t('EDIT')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusSubadminId(faq)}>
                                  {helpers.ternaryCondition(faq?.status === 'active',
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
                             
                              <PermissionGate module={MODULES.FAQ} action={ACTIONS.DELETE}>
                              <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setDeleteSubadminId(faq._id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  {t('DELETE')}
                                </DropdownMenuItem>
                              </PermissionGate>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>

                      </TableRow>
                    )), <NoResultFound />))}
              </TableBody>
            </Table>
          </div>

          {helpers.andCondition(filteredFAQs?.length > 0, <Pagination currentPage={currentPage} pageSize={pageSize} length={faqs?.totalDocs} setPageSize={setPageSize} setCurrentPage={setCurrentPage} totalPages={faqs?.totalPages} />)}

        </CardContent>
      </Card>

      {/* Edit/Preview/Create Dialog */}
      <Dialog open={!!selectedFAQ} onOpenChange={() => setSelectedFAQ(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {helpers.ternaryCondition(isCreating , <Plus className="w-5 h-5" /> ,helpers.ternaryCondition(isEditing , <Edit className="w-5 h-5" /> , <Eye className="w-5 h-5" />))}
              {helpers.ternaryCondition(isCreating , 'Create FAQ' ,helpers.ternaryCondition(isEditing , 'Edit FAQ' , 'Preview FAQ'))}
            </DialogTitle>
            <DialogDescription className='text-left'>
              {isCreating ? 'Create a new frequently asked question' :
                isEditing ? 'Modify the FAQ content and settings' :
                  'Preview FAQ content'}
            </DialogDescription>
          </DialogHeader>

          {selectedFAQ &&
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className=''>
                  <Label htmlFor="question">Question<span className='text-red-500'>*</span></Label>
                  <Input
                    id="question"
                    maxLength={100}
                    value={selectedFAQ?.question}
                    onChange={(e) => setSelectedFAQ({
                      ...selectedFAQ,
                      question: e.target.value
                    })}
                    disabled={!isEditing}
                    className="mt-1"
                    placeholder="Enter Question"
                  />
                </div>

                <div className=''>
                  <Label htmlFor="answer">Answer<span className='text-red-500'>*</span> </Label>
                  <Textarea
                    id="answer"
                    maxLength={200}
                    value={selectedFAQ.answer}
                    onChange={(e) => setSelectedFAQ({
                      ...selectedFAQ,
                      answer: e.target.value
                    })}
                    disabled={!isEditing}
                    className="min-h-[200px] mt-1 w-full resize-none break-all whitespace-pre-wrap"
                    placeholder="Enter Detailed Answer"
                  />
                </div>


                {!isCreating && (
                  <div>
                    <h4 className="font-medium mb-3">Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Created At:</span>
                        <span className="ml-2 font-medium">
                          {showFormattedDate(selectedFAQ?.createdAt)}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground">Updated At:</span>
                        <span className="ml-2 font-medium">
                          {showFormattedDate(selectedFAQ?.updatedAt)}
                        </span>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            </div>
          }

          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              {isEditing ? (
                <Button onClick={handleSave} disabled={loading} className="gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {isCreating ? 'Create FAQ' : 'Save Changes'}
                    </>
                  )}
                </Button>
              ) : (
                <PermissionGate module={MODULES.FAQ} action={ACTIONS.EDIT}>
                  <Button onClick={() => setIsEditing(true)} className="gap-2">
                    <Edit className="w-4 h-4" />
                    Edit FAQ
                  </Button>
                </PermissionGate>
              )}
            </div>
          </DialogFooter>
        </DialogContent>

      </Dialog>



      <ConfirmDialog
        open={!!deleteSubadminId}
        onCancel={() => setDeleteSubadminId(null)}
        onConfirm={() => deleteSubadminId && handleDelete(deleteSubadminId)}
        description="This will permanently delete the faq and remove their access to the system."
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