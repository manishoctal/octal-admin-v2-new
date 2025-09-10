import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { DateRangePicker } from "./common/DateRangePicker";
import { StatisticsCards } from "./common/StatisticsCards";
import { AnimatedCounter } from "./common/AnimatedCounter";
import { useSettings } from "./SettingsContext";
import { toast } from "sonner";

// Mock payment data
interface Payment {
  id: string;
  transactionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: "success" | "failed" | "pending";
  paymentMethod: string;
  date: string;
  description: string;
  processingFee?: number;
  refundId?: string;
}

const generateMockPayments = (): Payment[] => {
  const statuses: Payment["status"][] = [
    "success",
    "failed",
    "pending",
  ];
  const paymentMethods = [
    "Credit Card",
    "PayPal",
    "Bank Transfer",
    "Apple Pay",
    "Google Pay",
  ];
  const currencies = ["USD", "EUR", "GBP"];

  const users = [
    { name: "John Doe", email: "john.doe@example.com" },
    { name: "Jane Smith", email: "jane.smith@example.com" },
    { name: "Mike Johnson", email: "mike.johnson@example.com" },
    { name: "Sarah Wilson", email: "sarah.wilson@example.com" },
    { name: "Alex Brown", email: "alex.brown@example.com" },
    { name: "Emily Davis", email: "emily.davis@example.com" },
    { name: "Chris Miller", email: "chris.miller@example.com" },
    { name: "Lisa Garcia", email: "lisa.garcia@example.com" },
    {
      name: "David Martinez",
      email: "david.martinez@example.com",
    },
    { name: "Anna Lee", email: "anna.lee@example.com" },
  ];

  return Array.from({ length: 150 }, (_, i) => {
    const user = users[i % users.length];
    const status =
      statuses[Math.floor(Math.random() * statuses.length)];
    const amount = Math.floor(Math.random() * 500) + 10;
    const currency =
      currencies[Math.floor(Math.random() * currencies.length)];
    const date = new Date();
    date.setDate(
      date.getDate() - Math.floor(Math.random() * 90),
    );

    return {
      id: `payment-${i + 1}`,
      transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userId: `user-${(i % users.length) + 1}`,
      userName: user.name,
      userEmail: user.email,
      amount,
      currency,
      status,
      paymentMethod:
        paymentMethods[
          Math.floor(Math.random() * paymentMethods.length)
        ],
      date: date.toISOString(),
      description:
        status === "success"
          ? "Premium subscription payment"
          : status === "failed"
            ? "Payment failed - insufficient funds"
            : "Payment processing...",
      processingFee:
        status === "success"
          ? Math.round(amount * 0.029 * 100) / 100
          : undefined,
      refundId:
        status === "failed" && Math.random() > 0.7
          ? `RFD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          : undefined,
    };
  });
};

const ITEMS_PER_PAGE = 10;

export function PaymentsManager() {
  const { settings } = useSettings();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<string>("all");
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({ from: undefined, to: undefined });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Payment;
    direction: "asc" | "desc";
  }>({ key: "date", direction: "desc" });

  // Load payments data
  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) =>
          setTimeout(resolve, 1000),
        );
        setPayments(generateMockPayments());
      } catch (error) {
        toast.error("Failed to load payments data");
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  // Filter and sort payments
  const filteredPayments = useMemo(() => {
    let filtered = payments.filter((payment) => {
      const matchesSearch =
        searchTerm === "" ||
        payment.userName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.transactionId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.userEmail
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        payment.status === statusFilter;

      const paymentDate = new Date(payment.date);
      const matchesDateRange =
        (!dateRange.from || paymentDate >= dateRange.from) &&
        (!dateRange.to || paymentDate <= dateRange.to);

      return matchesSearch && matchesStatus && matchesDateRange;
    });

    // Sort payments
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue)
        return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue)
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    payments,
    searchTerm,
    statusFilter,
    dateRange,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(
    filteredPayments.length / ITEMS_PER_PAGE,
  );
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Statistics
  const statistics = useMemo(() => {
    const successPayments = payments.filter(
      (p) => p.status === "success",
    );
    const failedPayments = payments.filter(
      (p) => p.status === "failed",
    );
    const pendingPayments = payments.filter(
      (p) => p.status === "pending",
    );

    const totalRevenue = successPayments.reduce(
      (sum, p) => sum + p.amount,
      0,
    );
    const avgPayment =
      successPayments.length > 0
        ? totalRevenue / successPayments.length
        : 0;
    const totalFees = successPayments.reduce(
      (sum, p) => sum + (p.processingFee || 0),
      0,
    );

    return {
      totalPayments: payments.length,
      successfulPayments: successPayments.length,
      failedPayments: failedPayments.length,
      pendingPayments: pendingPayments.length,
      totalRevenue,
      averagePayment: avgPayment,
      totalFees,
      successRate:
        payments.length > 0
          ? (successPayments.length / payments.length) * 100
          : 0,
    };
  }, [payments]);

  const handleSort = (key: keyof Payment) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleExport = (format: "csv" | "excel") => {
    const exportData = filteredPayments.map((payment) => ({
      "Transaction ID": payment.transactionId,
      "User Name": payment.userName,
      "User Email": payment.userEmail,
      Amount: `${payment.amount} ${payment.currency}`,
      Status:
        payment.status.charAt(0).toUpperCase() +
        payment.status.slice(1),
      "Payment Method": payment.paymentMethod,
      Date: new Date(payment.date).toLocaleDateString(
        settings.dateFormat === "DD/MM/YYYY"
          ? "en-GB"
          : "en-US",
      ),
      Description: payment.description,
      "Processing Fee": payment.processingFee
        ? `${payment.processingFee} ${payment.currency}`
        : "N/A",
    }));

    if (format === "csv") {
      const csvContent = [
        Object.keys(exportData[0]).join(","),
        ...exportData.map((row) =>
          Object.values(row)
            .map((val) => `"${val}"`)
            .join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }

    toast.success(
      `Payments exported as ${format.toUpperCase()}`,
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateRange({});
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm ||
    statusFilter !== "all" ||
    dateRange.from ||
    dateRange.to;

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = settings.currencySymbol;
    return `${symbol}${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (settings.dateFormat === "DD/MM/YYYY") {
      return date.toLocaleDateString("en-GB");
    }
    return date.toLocaleDateString("en-US");
  };

  const getStatusBadge = (status: Payment["status"]) => {
    const variants = {
      success: "default",
      failed: "destructive",
      pending: "secondary",
    } as const;

    const labels = {
      success: "Success",
      failed: "Failed",
      pending: "Pending",
    };

    return (
      <Badge variant={variants[status]}>{labels[status]}</Badge>
    );
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Statistics Cards Loading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="w-12 h-12 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table Loading */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row gap-4">
              <Skeleton className="h-10 flex-1" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">
            Payment Tracking
          </h2>
          <p className="text-muted-foreground">
            Monitor and manage all payment transactions
          </p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <div className="text-2xl font-bold">
                  <AnimatedCounter
                    value={statistics.totalRevenue}
                    formatter={(val) =>
                      formatCurrency(val, "USD")
                    }
                    duration={
                      settings.enableAnimations ? 2000 : 0
                    }
                  />
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  Success rate:{" "}
                  {statistics.successRate.toFixed(1)}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Payments
                </p>
                <div className="text-2xl font-bold">
                  <AnimatedCounter
                    value={statistics.totalPayments}
                    duration={
                      settings.enableAnimations ? 2000 : 0
                    }
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg:{" "}
                  {formatCurrency(
                    statistics.averagePayment,
                    "USD",
                  )}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Successful
                </p>
                <div className="text-2xl font-bold text-green-600">
                  <AnimatedCounter
                    value={statistics.successfulPayments}
                    duration={
                      settings.enableAnimations ? 1500 : 0
                    }
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {statistics.totalPayments > 0
                    ? (
                        (statistics.successfulPayments /
                          statistics.totalPayments) *
                        100
                      ).toFixed(1)
                    : 0}
                  % of total
                </div>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Failed/Pending
                </p>
                <div className="text-2xl font-bold text-orange-600">
                  <AnimatedCounter
                    value={
                      statistics.failedPayments +
                      statistics.pendingPayments
                    }
                    duration={
                      settings.enableAnimations ? 1500 : 0
                    }
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {statistics.failedPayments} failed,{" "}
                  {statistics.pendingPayments} pending
                </div>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by user name, email, or transaction ID..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Statuses
                  </SelectItem>
                  <SelectItem value="success">
                    Success
                  </SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">
                    Pending
                  </SelectItem>
                </SelectContent>
              </Select>

              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                placeholder="Select date range"
                maxDate={new Date()}
                className="w-52"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleExport("csv")}
                  >
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExport("excel")}
                  >
                    Export as Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="gap-2 text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Results Summary */}
          <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
            <span>
              Showing {paginatedPayments.length} of{" "}
              {filteredPayments.length} payments
              {hasActiveFilters &&
                ` (filtered from ${payments.length} total)`}
            </span>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort("userName")}
                  >
                    <div className="flex items-center gap-2">
                      User Name
                      {sortConfig.key === "userName" && (
                        <span className="text-xs">
                          {sortConfig.direction === "asc"
                            ? "↑"
                            : "↓"}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center gap-2">
                      Amount
                      {sortConfig.key === "amount" && (
                        <span className="text-xs">
                          {sortConfig.direction === "asc"
                            ? "↑"
                            : "↓"}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort("transactionId")}
                  >
                    <div className="flex items-center gap-2">
                      Transaction ID
                      {sortConfig.key === "transactionId" && (
                        <span className="text-xs">
                          {sortConfig.direction === "asc"
                            ? "↑"
                            : "↓"}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      {sortConfig.key === "date" && (
                        <span className="text-xs font-bold">
                          {sortConfig.direction === "asc"
                            ? "↑"
                            : "↓"}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPayments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {hasActiveFilters
                        ? "No payments match your filters."
                        : "No payments found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPayments.map((payment) => (
                    <TableRow
                      key={payment.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {payment.userName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {payment.userEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(
                            payment.amount,
                            payment.currency,
                          )}
                        </div>
                        {payment.processingFee && (
                          <div className="text-sm text-muted-foreground">
                            Fee:{" "}
                            {formatCurrency(
                              payment.processingFee,
                              payment.currency,
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {payment.transactionId}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(payment.date)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(
                            payment.date,
                          ).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {payment.paymentMethod}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {payment.status === "success" && (
                              <DropdownMenuItem>
                                Process Refund
                              </DropdownMenuItem>
                            )}
                            {payment.status === "failed" && (
                              <DropdownMenuItem>
                                Retry Payment
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.max(1, prev - 1),
                    )
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (
                        currentPage >=
                        totalPages - 2
                      ) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setCurrentPage(pageNum)
                          }
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    },
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(totalPages, prev + 1),
                    )
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}