import { Card, CardContent } from '../ui/card';
import { AnimatedCounter } from './AnimatedCounter';
import { Users, UserCheck, UserX, Wallet, UserX2 } from 'lucide-react';
import { useSettings } from '../contexts/settings';

interface StatisticsData {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalWalletBalance: number;
  deletedUser:number
}

interface StatisticsCardsProps {
  data: StatisticsData;
  loading?: boolean;
}

export function StatisticsCards({ data, loading }: StatisticsCardsProps) {
  const { formatCurrency } = useSettings();
    const stats = [
    {
      title: 'Total Users',
      value: data.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      formatter: (val: number) => val.toLocaleString(),
    },
    {
      title: 'Active Users',
      value: data.activeUsers,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      formatter: (val: number) => val.toLocaleString(),
    },
    {
      title: 'Inactive Users',
      value: data.inactiveUsers,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      formatter: (val: number) => val.toLocaleString(),
    },

    ...(data?.deletedUser
      ? [
        {
          title: 'Deleted Users',
          value: data?.deletedUser,
          icon: UserX2,
          color: 'text-red-600',
          bgColor: 'bg-red-50 dark:bg-red-950/20',
          formatter: (val: number) => val.toLocaleString(),
        },
      ]
      : []),



    ...(data.totalWalletBalance?[{
      title: 'Total Wallet Balance',
      value: data.totalWalletBalance,
      icon: Wallet,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      formatter: (val: number) => formatCurrency(val),
    }]:[]),
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-12 w-12 bg-muted rounded-lg animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="text-2xl font-bold">
                    <AnimatedCounter
                      value={stat.value}
                      formatter={stat.formatter}
                      duration={1200}
                    />
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


export function SubadminStatisticsCards({ data, loading }: StatisticsCardsProps) {
    const stats = [
    {
      title: 'Total Sub Admins',
      value: data.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      formatter: (val: number) => val.toLocaleString(),
    },
    {
      title: 'Active Sub Admins',
      value: data.activeUsers,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      formatter: (val: number) => val.toLocaleString(),
    },
    {
      title: 'Inactive Sub Admins',
      value: data.inactiveUsers,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      formatter: (val: number) => val.toLocaleString(),
    },

  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-12 w-12 bg-muted rounded-lg animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="text-2xl font-bold">
                    <AnimatedCounter
                      value={stat.value}
                      formatter={stat.formatter}
                      duration={1200}
                    />
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}