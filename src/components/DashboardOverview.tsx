import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import {
  Users,
  CreditCard,
  UserPlus,
  Flag,
  UserCheck,
  Music,
  TrendingUp,
  MapPin,
  Calendar,
  DollarSign,
  RotateCcw
} from 'lucide-react';
import { AnimatedCounter } from './common/AnimatedCounter';
import { useSettings } from './SettingsContext';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { apiGet } from '@/utils/apiFetch';
import apiPath from '@/utils/apiPath';
import helpers from '@/utils/helpers';
import { DateRangePicker } from './common/DateRangePicker';
import { useTranslation } from './TranslationContext';
import { Button } from './ui/button';
import { SuccessToastMessage } from './common/sonner';
import { useNavigate } from 'react-router-dom';

// Mock data for dashboard metrics
const generateDashboardData = () => {
  // Daily signup data for the last 7 days
  const dailySignups = [
    { date: 'Mon', signups: 45, day: 'Monday' },
    { date: 'Tue', signups: 52, day: 'Tuesday' },
    { date: 'Wed', signups: 38, day: 'Wednesday' },
    { date: 'Thu', signups: 67, day: 'Thursday' },
    { date: 'Fri', signups: 71, day: 'Friday' },
    { date: 'Sat', signups: 89, day: 'Saturday' },
    { date: 'Sun', signups: 94, day: 'Sunday' },
  ];

  // New subscribed users over time
  const subscriptionData = [
    { month: 'Jan', free: 1200, premium: 320, pro: 180 },
    { month: 'Feb', free: 1350, premium: 380, pro: 220 },
    { month: 'Mar', free: 1480, premium: 420, pro: 250 },
    { month: 'Apr', free: 1620, premium: 470, pro: 290 },
    { month: 'May', free: 1750, premium: 520, pro: 330 },
    { month: 'Jun', free: 1890, premium: 580, pro: 370 },
  ];

  // Top cities by active users
  const topCities = [
    { city: 'New York', users: 2847, percentage: 18.2, color: '#3b82f6' },
    { city: 'Los Angeles', users: 2156, percentage: 13.8, color: '#10b981' },
    { city: 'Chicago', users: 1923, percentage: 12.3, color: '#f59e0b' },
    { city: 'Houston', users: 1654, percentage: 10.6, color: '#ef4444' },
    { city: 'Phoenix', users: 1387, percentage: 8.9, color: '#8b5cf6' },
    { city: 'Philadelphia', users: 1245, percentage: 8.0, color: '#ec4899' },
    { city: 'San Antonio', users: 1098, percentage: 7.0, color: '#06b6d4' },
    { city: 'San Diego', users: 967, percentage: 6.2, color: '#84cc16' },
    { city: 'Dallas', users: 845, percentage: 5.4, color: '#f97316' },
    { city: 'San Jose', users: 756, percentage: 4.8, color: '#14b8a6' },
  ];

  // Ensure all numeric values are valid numbers
  const sanitizeNumber = (value: any): number => {
    const num = Number(value);
    return isNaN(num) || !isFinite(num) ? 0 : num;
  };

  return {
    // Summary metrics - ensure all values are valid numbers
    totalUsers: sanitizeNumber(15642),
    activeSubscriptions: sanitizeNumber(4758),
    newSignupsToday: sanitizeNumber(94),
    reportsFlagsToday: sanitizeNumber(12),
    totalCircles: sanitizeNumber(1847),
    totalPlaylists: sanitizeNumber(3256),

    // Growth metrics
    userGrowth: sanitizeNumber(12.5),
    subscriptionGrowth: sanitizeNumber(8.3),
    circleGrowth: sanitizeNumber(15.2),
    playlistGrowth: sanitizeNumber(22.1),

    // Charts data
    dailySignups,
    subscriptionData,
    topCities,
  };
};
interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}
export function DashboardOverview() {
  const { settings, formatCurrency } = useSettings();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<ReturnType<typeof generateDashboardData> | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const { t } = useTranslation()

const navigate=useNavigate()
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
    if (typeof value === 'number' && isFinite(value) && !isNaN(value)) {
      return Math.max(0, value); // Ensure non-negative
    }
    return 0;
  };

  // Helper function to safely get percentage values
  const safePercentage = (value: any): number => {
    const num = safeValue(value);
    return Math.min(100, Math.max(0, num)); // Clamp between 0 and 100
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
        {/* 
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-48 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div> */}
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

      {/* Charts & Graphs */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Daily Signup Graph (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData.dailySignups}>
                <defs>
                  <linearGradient id="signupGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  className="text-sm"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-sm"
                />
                <Tooltip content={CustomTooltip} />
                <Area 
                  type="monotone" 
                  dataKey="signups" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="url(#signupGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              New Subscribed Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.subscriptionData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  className="text-sm"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-sm"
                />
                <Tooltip content={CustomTooltip} />
                <Legend />
                <Bar dataKey="free" stackId="a" fill="#10b981" name="Free" />
                <Bar dataKey="premium" stackId="a" fill="#3b82f6" name="Premium" />
                <Bar dataKey="pro" stackId="a" fill="#8b5cf6" name="Pro" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Top Cities by Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={dashboardData.topCities}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="users"
                    >
                      {dashboardData.topCities.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={CustomTooltip} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {dashboardData.topCities.map((city, index) => (
                  <div key={city.city} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: city.color }}
                        />
                      </div>
                      <span className="font-medium">{city.city}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{city.users.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{city.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}