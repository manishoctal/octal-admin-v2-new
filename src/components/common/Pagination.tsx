
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../TranslationContext';

export const Pagination = ({currentPage,pageSize,length,setPageSize,setCurrentPage,totalPages}) => {
    const { t } = useTranslation();
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4  bg-muted/20">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>
        {t('I_SHOWING')} {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, length)} {t('I_OFF')} {length} {t('RECORDS').toLowerCase()}
      </span>
      <Select disabled={length<=10} value={pageSize?.toString()} onValueChange={(value) =>{setCurrentPage(1);setPageSize(Number(value))}}>
        <SelectTrigger className="w-20 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="flex items-center gap-2 mt-4 sm:mt-0">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="h-8"
      >
        <ChevronLeft className="w-4 h-4" />
        {t('PREV')}
      </Button>
      
      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {(() => {
          const maxVisiblePages = 5;
          const pages = [];
          let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
          let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
          
          // Adjust start page if we're near the end
          if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
          }
          
          // Show first page if not in range
          if (startPage > 1) {
            pages.push(
              <Button
                key={1}
                variant={1 === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(1)}
                className="w-8 h-8"
              >
                1
              </Button>
            );
            if (startPage > 2) {
              pages.push(
                <span key="start-ellipsis" className="text-muted-foreground px-2 text-sm">
                  ...
                </span>
              );
            }
          }
          
          // Show page range
          for (let i = startPage; i <= endPage; i++) {
            pages.push(
              <Button
                key={i}
                variant={i === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(i)}
                className="w-8 h-8"
              >
                {i}
              </Button>
            );
          }
          
          // Show last page if not in range
          if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
              pages.push(
                <span key="end-ellipsis" className="text-muted-foreground px-2 text-sm">
                  ...
                </span>
              );
            }
            pages.push(
              <Button
                key={totalPages}
                variant={totalPages === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                className="w-8 h-8"
              >
                {totalPages}
              </Button>
            );
          }
          
          return pages;
        })()}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="h-8"
      >
        {t('NEXT')}
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  </div>
  )
}
