import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import {
  ArrowLeft, Edit, Users, TrendingUp, Heart, Activity,
  Search, Calendar, MapPin, Star, Award,
  ChevronLeft, ChevronRight, MoreHorizontal, Download
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useRouter } from './Router';
import { useSettings } from './SettingsContext';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

interface IntentionUser {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  joinedAt: string;
  status: 'active' | 'inactive';
  matchCount: number;
  successfulMatches: number;
  lastActive: string;
  location: string;
  age: number;
}

interface IntentionDetailsProps {
  intentionId: string;
}

// Mock data for intention details
const mockIntention = {
  id: 'intention-1',
  name: 'Networking',
  description: 'Professional networking and business connections for career growth and collaboration opportunities. Connect with like-minded professionals in your industry or explore new career paths through meaningful business relationships.',
  category: 'professional' as const,
  status: 'active' as const,
  userCount: 2847,
  matchCount: 1923,
  successRate: 68,
  icon: 'Users',
  color: '#3b82f6',
  tags: ['business', 'career', 'professional', 'networking'],
  ageGroup: '25-45',
  minAge: 25,
  maxAge: 45,
  popularity: 92,
  trending: true,
  isDefault: true,
  isPremium: false,
  createdAt: '2024-01-15',
  updatedAt: '2024-03-10',
  matchingCriteria: 'Match users based on industry, experience level, location preferences, and professional interests.',
  guidelines: 'Be professional, respectful, and focus on mutual benefit in networking connections. Share your expertise and be open to learning from others.',
  monthlyGrowth: 12.5,
  avgResponseTime: '2.3 hours',
  topLocations: ['New York', 'San Francisco', 'London', 'Toronto', 'Sydney'],
  peakHours: ['9:00 AM', '12:00 PM', '6:00 PM'],
};

// Mock users data
const generateMockUsers = (): IntentionUser[] => {
  const names = [
    'Sarah Johnson', 'Michael Chen', 'Emily Davis', 'David Wilson', 'Jessica Brown',
    'Alex Rodriguez', 'Maria Garcia', 'James Smith', 'Lisa Wang', 'Robert Taylor'
  ];

  const locations = ['New York', 'San Francisco', 'London', 'Toronto', 'Sydney', 'Berlin', 'Tokyo', 'Paris'];

  return Array.from({ length: 150 }, (_, i) => ({
    id: `intention-user-${i + 1}`,
    userId: `user-${i + 100}`,
    userName: names[i % names.length] + (Math.floor(i / names.length) > 0 ? ` ${Math.floor(i / names.length)}` : ''),
    userEmail: `${names[i % names.length].toLowerCase().replace(' ', '.')}${Math.floor(i / names.length) > 0 ? Math.floor(i / names.length) : ''}@example.com`,
    userAvatar: Math.random() > 0.3 ? `https://images.unsplash.com/photo-${1500000000000 + i}?w=150&h=150&fit=crop&crop=face` : undefined,
    joinedAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: Math.random() > 0.15 ? 'active' : 'inactive',
    matchCount: Math.floor(Math.random() * 20) + 1,
    successfulMatches: Math.floor(Math.random() * 10),
    lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    location: locations[Math.floor(Math.random() * locations.length)],
    age: Math.floor(Math.random() * (45 - 25)) + 25,
  }));
};

export function IntentionDetails({ intentionId }: IntentionDetailsProps) {
  const navigate = useNavigate();
  const { formatDate } = useSettings();
  const [intention] = useState(mockIntention);
  const [users, setUsers] = useState<IntentionUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    // Simulate loading intention and users data
    setTimeout(() => {
      setUsers(generateMockUsers());
      setLoading(false);
    }, 1000);
  }, [intentionId]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || user.location === locationFilter;
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const activeUsers = users.filter(u => u.status === 'active');
  const inactiveUsers = users.filter(u => u.status === 'inactive');
  const totalMatches = users.reduce((sum, user) => sum + user.matchCount, 0);
  const totalSuccessfulMatches = users.reduce((sum, user) => sum + user.successfulMatches, 0);

  const uniqueLocations = Array.from(new Set(users.map(user => user.location))).sort();

  const handleExportUsers = () => {
    toast.success('User list exported successfully');
  };

  const getActivityStatus = (lastActive: string) => {
    const daysSince = Math.floor((Date.now() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince === 0) return { text: 'Today', color: 'text-green-600' };
    if (daysSince === 1) return { text: 'Yesterday', color: 'text-yellow-600' };
    if (daysSince <= 7) return { text: `${daysSince}d ago`, color: 'text-orange-600' };
    return { text: `${daysSince}d ago`, color: 'text-red-600' };
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-muted rounded animate-pulse" />
            <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          </div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-4 bg-muted rounded animate-pulse" />
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="h-6 w-24 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 bg-muted rounded animate-pulse" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('intentions')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: intention.color }}
              >
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{intention.name}</h1>
                  <Badge variant={intention.isDefault ? 'default' : 'secondary'}>
                    {intention.isDefault ? 'Default' : 'Custom'}
                  </Badge>
                  {intention.isPremium && (
                    <Badge variant="outline">Premium</Badge>
                  )}
                  {intention.trending && (
                    <Badge variant="secondary">Trending</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">Intention Details & User Management</p>
              </div>
            </div>
          </div>

          <Button onClick={() => navigate('intentions/edit', { intentionId })}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Intention
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <div className="text-2xl font-bold">{intention.userCount.toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    +{intention.monthlyGrowth}% this month
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Matches</p>
                  <div className="text-2xl font-bold">{totalMatches.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">
                    {totalSuccessfulMatches} successful
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <div className="text-2xl font-bold">{intention.successRate}%</div>
                  <Progress value={intention.successRate} className="h-2" />
                </div>
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Popularity</p>
                  <div className="text-2xl font-bold">{intention.popularity}%</div>
                  <Progress value={intention.popularity} className="h-2" />
                </div>
                <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                  <Star className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Intention Information */}
            <Card>
              <CardHeader>
                <CardTitle>Intention Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{intention.description}</p>
                  </div>

                  {intention.matchingCriteria && (
                    <div>
                      <h3 className="font-medium mb-2">Matching Criteria</h3>
                      <p className="text-muted-foreground leading-relaxed">{intention.matchingCriteria}</p>
                    </div>
                  )}

                  {intention.guidelines && (
                    <div>
                      <h3 className="font-medium mb-2">Guidelines</h3>
                      <p className="text-muted-foreground leading-relaxed">{intention.guidelines}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {intention.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleExportUsers}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Users
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <TabsList>
                      <TabsTrigger value="all">
                        All Users ({filteredUsers.length})
                      </TabsTrigger>
                      <TabsTrigger value="active">
                        Active ({activeUsers.length})
                      </TabsTrigger>
                      <TabsTrigger value="inactive">
                        Inactive ({inactiveUsers.length})
                      </TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-48"
                        />
                      </div>

                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={locationFilter} onValueChange={setLocationFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          {uniqueLocations.map(location => (
                            <SelectItem key={location} value={location}>{location}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {paginatedUsers.map((user) => {
                      const activityStatus = getActivityStatus(user.lastActive);
                      return (
                        <div key={user.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.userAvatar} />
                                <AvatarFallback>
                                  {user.userName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {user.userName}
                                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                    {user.status}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">{user.userEmail}</div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {user.location}
                                  </span>
                                  <span>Age {user.age}</span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Joined {formatDate(user.joinedAt)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate('users/view', { userId: user.userId })}>
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Send Message
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t">
                            <div className="text-center">
                              <div className="text-lg font-semibold">{user.matchCount}</div>
                              <div className="text-sm text-muted-foreground">Total Matches</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-green-600">{user.successfulMatches}</div>
                              <div className="text-sm text-muted-foreground">Successful</div>
                            </div>
                            <div className="text-center">
                              <div className={`text-lg font-semibold ${activityStatus.color}`}>
                                {activityStatus.text}
                              </div>
                              <div className="text-sm text-muted-foreground">Last Active</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} users
                      </span>
                      <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                        <SelectTrigger className="w-20">
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

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>

                      <div className="flex items-center gap-1">
                        {(() => {
                          const maxVisiblePages = 5;
                          const pages = [];
                          let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                          let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                          if (endPage - startPage + 1 < maxVisiblePages) {
                            startPage = Math.max(1, endPage - maxVisiblePages + 1);
                          }

                          for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                              <Button
                                key={i}
                                variant={i === currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(i)}
                                className="w-10 h-8"
                              >
                                {i}
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
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Intention Details */}
            <Card>
              <CardHeader>
                <CardTitle>Intention Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="outline">{intention.category}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={intention.status === 'active' ? 'default' : 'secondary'}>
                    {intention.status.charAt(0).toUpperCase() + intention.status.slice(1)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Age Range</span>
                  <span>{intention.ageGroup} years</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <div className="flex gap-1">
                    {intention.isDefault && <Badge variant="secondary">Default</Badge>}
                    {intention.isPremium && <Badge variant="outline">Premium</Badge>}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{formatDate(intention.createdAt)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{formatDate(intention.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Monthly Growth</span>
                    <span className="text-green-600 font-medium">+{intention.monthlyGrowth}%</span>
                  </div>
                  <Progress value={intention.monthlyGrowth} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-medium">{intention.successRate}%</span>
                  </div>
                  <Progress value={intention.successRate} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Avg Response Time</span>
                  <span className="font-medium">{intention.avgResponseTime}</span>
                </div>
              </CardContent>
            </Card>

            {/* Top Locations */}
            <Card>
              <CardHeader>
                <CardTitle>Top Locations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {intention.topLocations.map((location, index) => {
                  const percentage = Math.floor(Math.random() * 30) + 10; // Mock percentage
                  return (
                    <div key={location} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">#{index + 1}</span>
                        <span>{location}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{percentage}%</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Peak Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Peak Activity Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {intention.peakHours.map((hour, index) => (
                  <div key={hour} className="flex items-center justify-between">
                    <span>{hour}</span>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Peak</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}