import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { 
  ArrowLeft, Edit, Calendar, MapPin, Clock, DollarSign, Users, 
  CheckCircle, XCircle, User, Search, Download, Mail, MoreHorizontal,
  Globe, Lock, Star, Image as ImageIcon, ChevronLeft, ChevronRight
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useRouter } from './Router';
import { useSettings } from './SettingsContext';
import { toast } from "sonner";

interface RSVP {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  rsvpDate: string;
  status: 'confirmed' | 'waitlist' | 'cancelled';
  checkedIn: boolean;
  checkInTime?: string;
  paymentStatus?: 'paid' | 'pending' | 'refunded';
  amount?: number;
}

interface EventDetailsProps {
  eventId: string;
}

// Mock data for event details
const mockEvent = {
  id: 'event-1',
  name: 'Annual Tech Conference 2024',
  description: 'Join us for the biggest technology conference of the year featuring industry leaders, innovative workshops, and networking opportunities. This three-day event will cover the latest trends in AI, cloud computing, cybersecurity, and more.',
  date: '2024-06-15',
  time: '09:00',
  endDate: '2024-06-17',
  endTime: '18:00',
  location: 'Tech Hub Convention Center',
  venue: 'Main Auditorium',
  accessType: 'premium' as const,
  status: 'upcoming' as const,
  rsvpCount: 324,
  maxAttendees: 500,
  category: 'Conference',
  tags: ['featured', 'trending', 'certification'],
  createdAt: '2024-03-01',
  updatedAt: '2024-03-15',
  organizerId: 'user-1',
  organizerName: 'Sarah Johnson',
  organizerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b820?w=150&h=150&fit=crop&crop=face',
  price: 199,
  currency: 'USD',
  isFeature: true,
  bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
  registrationDeadline: '2024-06-10',
  eventInstructions: 'Please bring a valid ID and your registration confirmation. Parking is available on-site. Coffee and lunch will be provided.',
  requiresApproval: false,
  allowWaitlist: true,
  sendReminders: true,
  attendeesCount: 298,
  waitlistCount: 26,
  totalRevenue: 64602,
  checkedInCount: 0,
};

// Mock RSVP data
const generateMockRSVPs = (): RSVP[] => {
  const statuses: RSVP['status'][] = ['confirmed', 'waitlist', 'cancelled'];
  const paymentStatuses: RSVP['paymentStatus'][] = ['paid', 'pending', 'refunded'];
  const names = [
    'Alex Chen', 'Maria Garcia', 'David Kim', 'Emma Thompson', 'James Wilson',
    'Sophia Rodriguez', 'Michael Brown', 'Olivia Davis', 'Daniel Lee', 'Isabella Martinez',
    'William Taylor', 'Charlotte Anderson', 'Benjamin White', 'Amelia Harris', 'Lucas Clark',
    'Mia Lewis', 'Henry Walker', 'Evelyn Hall', 'Alexander Allen', 'Harper Young'
  ];
  
  return Array.from({ length: 350 }, (_, i) => {
    const status = i < 298 ? 'confirmed' : i < 324 ? 'waitlist' : 'cancelled';
    const paymentStatus = status === 'confirmed' ? 
      (Math.random() > 0.1 ? 'paid' : 'pending') : 
      status === 'cancelled' ? 'refunded' : undefined;
    
    return {
      id: `rsvp-${i + 1}`,
      userId: `user-${i + 100}`,
      userName: names[i % names.length] + (Math.floor(i / names.length) > 0 ? ` ${Math.floor(i / names.length)}` : ''),
      userEmail: `${names[i % names.length].toLowerCase().replace(' ', '.')}${Math.floor(i / names.length) > 0 ? Math.floor(i / names.length) : ''}@example.com`,
      userAvatar: Math.random() > 0.4 ? `https://images.unsplash.com/photo-${1500000000000 + i}?w=150&h=150&fit=crop&crop=face` : undefined,
      rsvpDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: status,
      checkedIn: false,
      paymentStatus: paymentStatus,
      amount: paymentStatus === 'paid' || paymentStatus === 'refunded' ? 199 : paymentStatus === 'pending' ? 199 : undefined,
    };
  });
};

export function EventDetails({ eventId }: EventDetailsProps) {
  const { navigate } = useRouter();
  const { formatDate, currency } = useSettings();
  const [event] = useState(mockEvent);
  const [rsvps, setRSVPs] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRSVP, setSelectedRSVP] = useState<RSVP | null>(null);
  const [actionType, setActionType] = useState<'cancel' | 'refund' | null>(null);

  useEffect(() => {
    // Simulate loading event and RSVP data
    setTimeout(() => {
      setRSVPs(generateMockRSVPs());
      setLoading(false);
    }, 1000);
  }, [eventId]);

  const filteredRSVPs = rsvps.filter(rsvp => {
    const matchesSearch = rsvp.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rsvp.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rsvp.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || rsvp.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const paginatedRSVPs = filteredRSVPs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredRSVPs.length / pageSize);

  const confirmedRSVPs = rsvps.filter(r => r.status === 'confirmed');
  const waitlistRSVPs = rsvps.filter(r => r.status === 'waitlist');
  const cancelledRSVPs = rsvps.filter(r => r.status === 'cancelled');

  const handleRSVPAction = (rsvp: RSVP, action: 'cancel' | 'refund') => {
    setSelectedRSVP(rsvp);
    setActionType(action);
  };

  const confirmRSVPAction = () => {
    if (!selectedRSVP || !actionType) return;

    if (actionType === 'cancel') {
      setRSVPs(prev => 
        prev.map(rsvp => 
          rsvp.id === selectedRSVP.id 
            ? { ...rsvp, status: 'cancelled' }
            : rsvp
        )
      );
      toast.success('RSVP cancelled successfully');
    } else if (actionType === 'refund') {
      setRSVPs(prev => 
        prev.map(rsvp => 
          rsvp.id === selectedRSVP.id 
            ? { ...rsvp, paymentStatus: 'refunded', status: 'cancelled' }
            : rsvp
        )
      );
      toast.success('Refund processed successfully');
    }

    setSelectedRSVP(null);
    setActionType(null);
  };

  const handleExportRSVPs = () => {
    toast.success('RSVP list exported successfully');
  };

  const handleSendReminder = () => {
    toast.success('Reminder sent to all confirmed attendees');
  };

  const getStatusColor = (status: RSVP['status']) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'waitlist': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getPaymentStatusColor = (status: RSVP['paymentStatus']) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'refunded': return 'destructive';
      default: return 'outline';
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const eventDate = new Date(`${date}T${time}`);
    return eventDate.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getAccessTypeIcon = (accessType: string) => {
    switch (accessType) {
      case 'free': return Globe;
      case 'premium': return DollarSign;
      case 'invite_only': return Lock;
      default: return Globe;
    }
  };

  const formatAccessType = (accessType: string) => {
    switch (accessType) {
      case 'free': return 'Free';
      case 'premium': return 'Premium';
      case 'invite_only': return 'Invite Only';
      default: return accessType;
    }
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

  const AccessTypeIcon = getAccessTypeIcon(event.accessType);

  return (
    <div className="p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('events')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{event.name}</h1>
                <Badge variant={event.isFeature ? 'default' : 'secondary'}>
                  {event.isFeature ? 'Featured' : 'Standard'}
                </Badge>
              </div>
              <p className="text-muted-foreground">Event Details & RSVP Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSendReminder}>
              <Mail className="w-4 h-4 mr-2" />
              Send Reminder
            </Button>
            <Button onClick={() => navigate('events/edit', { eventId })}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Event
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Information */}
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {event.bannerImage && (
                  <div className="aspect-video rounded-lg overflow-hidden border">
                    <img 
                      src={event.bannerImage} 
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                  </div>
                  
                  {event.eventInstructions && (
                    <div>
                      <h3 className="font-medium mb-2">Event Instructions</h3>
                      <p className="text-muted-foreground leading-relaxed">{event.eventInstructions}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RSVP Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>RSVP Management</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleExportRSVPs}>
                    <Download className="w-4 h-4 mr-2" />
                    Export List
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="confirmed" className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <TabsList>
                      <TabsTrigger value="confirmed" className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Confirmed ({confirmedRSVPs.length})
                      </TabsTrigger>
                      <TabsTrigger value="waitlist" className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Waitlist ({waitlistRSVPs.length})
                      </TabsTrigger>
                      <TabsTrigger value="cancelled" className="flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Cancelled ({cancelledRSVPs.length})
                      </TabsTrigger>
                    </TabsList>
                    
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search RSVPs..."
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
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="waitlist">Waitlist</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>

                      {event.accessType === 'premium' && (
                        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Payments</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Attendee</TableHead>
                          <TableHead>RSVP Date</TableHead>
                          <TableHead>Status</TableHead>
                          {event.accessType === 'premium' && <TableHead>Payment</TableHead>}
                          <TableHead>Check-in</TableHead>
                          <TableHead className="w-12">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedRSVPs.map((rsvp) => (
                          <TableRow key={rsvp.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={rsvp.userAvatar} />
                                  <AvatarFallback className="text-xs">
                                    {rsvp.userName.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{rsvp.userName}</div>
                                  <div className="text-sm text-muted-foreground">{rsvp.userEmail}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(rsvp.rsvpDate)}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusColor(rsvp.status)}>
                                {rsvp.status.charAt(0).toUpperCase() + rsvp.status.slice(1)}
                              </Badge>
                            </TableCell>
                            {event.accessType === 'premium' && (
                              <TableCell>
                                {rsvp.paymentStatus ? (
                                  <div>
                                    <Badge variant={getPaymentStatusColor(rsvp.paymentStatus)}>
                                      {rsvp.paymentStatus.charAt(0).toUpperCase() + rsvp.paymentStatus.slice(1)}
                                    </Badge>
                                    {rsvp.amount && (
                                      <div className="text-sm text-muted-foreground">
                                        {currency}{rsvp.amount}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">N/A</span>
                                )}
                              </TableCell>
                            )}
                            <TableCell>
                              {rsvp.checkedIn ? (
                                <div>
                                  <Badge variant="default">Checked In</Badge>
                                  {rsvp.checkInTime && (
                                    <div className="text-xs text-muted-foreground">
                                      {rsvp.checkInTime}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <Badge variant="outline">Not Checked In</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {rsvp.status !== 'cancelled' && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleRSVPAction(rsvp, 'cancel')}>
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Cancel RSVP
                                    </DropdownMenuItem>
                                    {event.accessType === 'premium' && rsvp.paymentStatus === 'paid' && (
                                      <DropdownMenuItem 
                                        className="text-destructive"
                                        onClick={() => handleRSVPAction(rsvp, 'refund')}
                                      >
                                        <DollarSign className="w-4 h-4 mr-2" />
                                        Process Refund
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredRSVPs.length)} of {filteredRSVPs.length} RSVPs
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
            {/* Event Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <div className="text-right">
                    <div className="font-medium">{formatDateTime(event.date, event.time)}</div>
                    {event.endDate && event.endTime && (
                      <div className="text-sm text-muted-foreground">
                        to {formatDateTime(event.endDate, event.endTime)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <div className="text-right">
                    <div className="font-medium">{event.location}</div>
                    {event.venue && (
                      <div className="text-sm text-muted-foreground">{event.venue}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Access Type</span>
                  <div className="flex items-center gap-2">
                    <AccessTypeIcon className="w-4 h-4" />
                    <div>
                      <Badge variant={event.accessType === 'premium' ? 'default' : 'secondary'}>
                        {formatAccessType(event.accessType)}
                      </Badge>
                      {event.accessType === 'premium' && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {currency}{event.price}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span>{event.category}</span>
                </div>
                
                {event.registrationDeadline && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Reg. Deadline</span>
                    <span>{formatDate(event.registrationDeadline)}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{formatDate(event.createdAt)}</span>
                </div>
              </CardContent>
            </Card>

            {/* RSVP Stats */}
            <Card>
              <CardHeader>
                <CardTitle>RSVP Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total RSVPs</span>
                  <span className="font-medium">{event.rsvpCount.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Confirmed</span>
                  <span className="font-medium text-green-600">{event.attendeesCount.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Waitlist</span>
                  <span className="font-medium text-orange-600">{event.waitlistCount.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Checked In</span>
                  <span className="font-medium">{event.checkedInCount.toLocaleString()}</span>
                </div>
                
                {event.maxAttendees && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Capacity</span>
                    <span>
                      {event.attendeesCount.toLocaleString()} / {event.maxAttendees.toLocaleString()}
                    </span>
                  </div>
                )}
                
                {event.accessType === 'premium' && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Revenue</span>
                    <span className="font-medium text-green-600">
                      {currency}{event.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Organizer */}
            <Card>
              <CardHeader>
                <CardTitle>Event Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={event.organizerAvatar} />
                    <AvatarFallback>
                      {event.organizerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{event.organizerName}</div>
                    <div className="text-sm text-muted-foreground">Event Organizer</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Event Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Requires approval</span>
                  <Badge variant={event.requiresApproval ? 'default' : 'secondary'}>
                    {event.requiresApproval ? 'Yes' : 'No'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Waitlist enabled</span>
                  <Badge variant={event.allowWaitlist ? 'default' : 'secondary'}>
                    {event.allowWaitlist ? 'Yes' : 'No'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Send reminders</span>
                  <Badge variant={event.sendReminders ? 'default' : 'secondary'}>
                    {event.sendReminders ? 'Yes' : 'No'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Featured event</span>
                  <Badge variant={event.isFeature ? 'default' : 'secondary'}>
                    {event.isFeature ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!selectedRSVP} onOpenChange={() => setSelectedRSVP(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'cancel' ? 'Cancel RSVP' : 'Process Refund'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionType} the RSVP for {selectedRSVP?.userName}?
              {actionType === 'cancel' && ' This will move them to the cancelled list.'}
              {actionType === 'refund' && ' This will process a refund and cancel their RSVP.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={actionType === 'refund' ? 'bg-destructive text-destructive-foreground' : ''}
              onClick={confirmRSVPAction}
            >
              {actionType === 'cancel' ? 'Cancel RSVP' : 'Process Refund'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}