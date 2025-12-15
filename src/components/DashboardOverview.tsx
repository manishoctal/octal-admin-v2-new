import { useState, useEffect } from 'react';
import {
  Users,
  CreditCard,
  UserPlus,
  Flag,
  RotateCcw
} from 'lucide-react';
import { AnimatedCounter } from './common/AnimatedCounter';
import { useSettings } from './contexts/settings';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { apiGet } from '@/utils/apiFetch';
import apiPath from '@/utils/apiPath';
import helpers from '@/utils/helpers';
import { DateRangePicker } from './common/DateRangePicker';
import { useTranslation } from './TranslationContext';
import { Button } from './ui/button';
import { SuccessToastMessage } from './common/sonner';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
} from './ui/card';


interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}
export function DashboardOverview() {
  const { settings, formatCurrency } = useSettings();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const { t } = useTranslation()

  const navigate = useNavigate()
  const hasActiveFilters = dateRange?.from || dateRange?.to;

  const getDashboardData = async () => {
    try {


      const paylaod = {
        startDate: dateRange?.from ? helpers.getFormattedDate(new Date(dateRange?.from)) : '',
        endDate: dateRange?.to ? helpers.getFormattedDate(new Date(dateRange?.to)) : ''
      }
      const resp = await apiGet(apiPath.getDashboardData, paylaod)
      if (resp?.data?.success) {
        setDashboardData(resp?.data?.results)
      }
    } catch (err) {
      console.log('---------errr----------', err)
    } finally {
      setLoading(false)
    }

  }


  const handleResetFilters = () => {
    setDateRange({ from: undefined, to: undefined })
    SuccessToastMessage({ message: 'Filters reset' })
  };


  useEffect(() => {
    getDashboardData()

  }, [dateRange]);

  // Helper function to safely get numeric values
  const safeValue = (value: any): number => {
    if (typeof value === 'number' && Number.isFinite(value) && !Number.isNaN(value)) {
      return Math.max(0, value); // Ensure non-negative
    }
    return 0;
  };


  // Get animation duration, defaulting to 0 if animations are disabled
  const getAnimationDuration = () => {
    return 1200
  };

  if (loading || !dashboardData) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back to {settings.siteName}</p>
        </div>

        {/* Loading skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-8 w-20 bg-muted rounded" />
                  </div>
                  <div className="w-12 h-12 bg-muted rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
       
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back to {settings.siteName}</p>
      </div>

      <div className='flex justify-end gap-2'>
        <div>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            placeholder={t('FILTER_BY_DATE_RANGE')}
            className="w-full sm:w-[280px] w-[200px]"
          />
        </div>
        <div>
          {hasActiveFilters && (
            <Button variant="outline" onClick={handleResetFilters} className="w-full sm:w-auto sm:h-10">
              <RotateCcw className="w-4 h-4 mr-2" />
              {t('RESET')}
            </Button>
          )}
        </div>
      </div>

      {/* Summary Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="transition-all duration-200 hover:shadow-md cursor-pointer" onClick={()=>{navigate('/users')}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <div className="text-2xl font-bold">
                  <AnimatedCounter
                    value={safeValue(dashboardData.totalUsers)}
                    duration={getAnimationDuration()}
                  />

                </div>

              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>


        <Card className="transition-all duration-200 hover:shadow-md cursor-pointer" onClick={()=>{navigate('/users',{state:{status:'active'}})}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Active Users</p>
                <div className="text-2xl font-bold">
                  <AnimatedCounter
                    value={safeValue(dashboardData.totalActiveUsers)}
                    duration={getAnimationDuration()}
                  />
                </div>

              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>


        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Subscriptions</p>
                <div className="text-2xl font-bold">
                  <AnimatedCounter
                    value={safeValue(dashboardData?.totalSubscription)}
                    duration={getAnimationDuration()}
                  />
                </div>

              </div>
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Active Subscriptions</p>
                <div className="text-2xl font-bold">
                  <AnimatedCounter
                    value={safeValue(dashboardData?.totalActiveSubscription)}
                    duration={getAnimationDuration()}
                  />
                </div>

              </div>
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md cursor-pointer" onClick={()=>{navigate('/events',{state:{status:'active'}})}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Active Events</p>
                <div className="text-2xl font-bold">
                  <AnimatedCounter
                    value={safeValue(dashboardData?.totalActiveEvents)}
                    duration={getAnimationDuration()}
                  />
                </div>

              </div>
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <UserPlus className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md cursor-pointer" onClick={()=>{navigate('/circles',{state:{status:'active'}})}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Active Circles</p>
                <div className="text-2xl font-bold">
                  <AnimatedCounter
                    value={safeValue(dashboardData?.totalActiveCircles)}
                    duration={getAnimationDuration()}
                  />
                </div>

              </div>
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                <Flag className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Most Joined Circles</p>
                <div className="text-2xl font-bold">
                  <AnimatedCounter
                    value={safeValue(dashboardData?.totalMostJoinedCircles)}
                    duration={getAnimationDuration()}
                  />
                </div>

              </div>
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                <Flag className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <div className="text-2xl font-bold">
                  <span>{formatCurrency(dashboardData?.totalEarnings)}</span>
                </div>

              </div>

              <div className="py-[8px] px-[16px] rounded-lg bg-pink-50 dark:bg-pink-950/20">
                <span className="text-pink-600 text-xl font-bold">
                  {settings?.currencySymbol}
                </span>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>

      
    </div>
  );
}




