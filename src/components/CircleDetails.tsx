import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { CheckCircle, XCircle, Clock, Image as ImageIcon} from 'lucide-react';
import { apiGet, apiPost } from '@/utils/apiFetch';
import { ErrorToastMessage, SuccessToastMessage } from './common/sonner';
import apiPath from '@/utils/apiPath';
import { showFormattedDate } from './common/showFormattedDate';
import helpers from '@/utils/helpers';

interface JoinRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  message: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected'|'accepted';
}
interface CircleDetailsProps {
  circleId: string;
}

export function CircleDetails({ showAddDialog }: CircleDetailsProps) {
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [tabs, setTabs] = useState('pending')

  const handleRequestAction = (request: JoinRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
  };



  useEffect(() => {
    loadUserReports();
  }, [tabs]);

  const loadUserReports = async () => {
    try {
      const paylaod = { status: tabs=='approved'?'accepted':tabs }
      setLoading(true);
      const resp = await apiGet(apiPath.getCircleJoinRequest + '/' + showAddDialog?._id, paylaod);
      if (resp?.data?.success) {
        setJoinRequests(resp?.data?.results);
      }
    } catch (error) {
      ErrorToastMessage({ message: 'Failed to load circle request' })
    } finally {
      setLoading(false);
    }
  };


  const [isSubmit, setIsSubmit] = useState(false)
  const confirmRequestAction = async () => {
    if (!selectedRequest || !actionType) return;

    try {
      const paylaod = {
        circleId: selectedRequest?.circleId,
        userId: selectedRequest?.userId,
        action: actionType=='approve'?'accept':actionType
      }
      setIsSubmit(true);
      const resp = await apiPost(apiPath.acceptRejectCircleRequest, paylaod);
      if (resp?.data?.success) {
        SuccessToastMessage({ message: resp?.data?.message })
        loadUserReports()
      }
    } catch (error) {
      ErrorToastMessage({ message: 'Failed to apply action on circle' })
    } finally {
      setIsSubmit(false);
    }
    setSelectedRequest(null);
    setActionType(null);
  };


  if (loading) {
    return (
      <div className="">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-muted rounded animate-pulse" />
            <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          </div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className='px-2 pt-3'>
                <div className="flex items-center justify-between">
                  <CardTitle>Join Requests</CardTitle>

                </div>
              </CardHeader>
              <CardContent className='px-2 [&:last-child]:pb-2'>
                <Tabs value={tabs} className="space-y-4" onValueChange={setTabs}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <TabsList>
                      <TabsTrigger value="pending" className="flex items-center gap-2 cursor-pointer">
                        <Clock className="w-4 h-4" />
                        Pending ({joinRequests?.pendingRequest})
                      </TabsTrigger>
                      <TabsTrigger value="approved" className="flex items-center gap-2 cursor-pointer" >
                        <CheckCircle className="w-4 h-4" />
                        Accepted ({joinRequests?.acceptedRequest})
                      </TabsTrigger>
                      <TabsTrigger value="rejected" className="flex items-center gap-2 cursor-pointer" >
                        <XCircle className="w-4 h-4" />
                        Rejected ({joinRequests?.rejectedRequest})
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="pending" className='max-h-[300px] overflow-y-auto'>
                    <div className="space-y-4">
                      {joinRequests?.docs?.map((request) => (
                        <RequestCard
                          key={request?._id}
                          request={request}
                          onAction={handleRequestAction}
                          formatDate={showFormattedDate}

                        />
                      ))}

                      {joinRequests?.docs?.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No pending requests found
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="approved" className='max-h-[200px] overflow-y-auto'>
                    <div className="space-y-4">
                      {joinRequests?.docs?.map((request) => (
                        <RequestCard
                          key={request?._id}
                          request={request}
                          formatDate={showFormattedDate}
                          readonly
                        />
                      ))}

                      {joinRequests?.docs?.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No approved requests found
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="rejected" className='max-h-[200px] overflow-y-auto'>
                    <div className="space-y-4">
                      {joinRequests?.docs?.map((request) => (
                        <RequestCard
                          key={request?._id}
                          request={request}
                          formatDate={showFormattedDate}
                          readonly
                        />
                      ))}

                      {joinRequests?.docs?.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No rejected requests found
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to {actionType === 'approve' ? 'approve' : 'reject'} ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              The join request from {selectedRequest?.userName},
              {actionType === 'approve' && ' They will be added to the circle immediately.'}
              {actionType === 'reject' && ' This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={actionType === 'approve' ? '' : 'bg-destructive text-destructive-foreground'}
              onClick={confirmRequestAction}
              disabled={isSubmit}
            >
              {actionType === 'approve' ? isSubmit ? 'Approving' : 'Approve' : isSubmit ? 'Rejecting' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// RequestCard component for displaying individual join requests
function RequestCard({
  request,
  onAction,
  formatDate,
  readonly = false
}: {
  request: JoinRequest;
  onAction?: (request: JoinRequest, action: 'approve' | 'reject') => void;
  formatDate: (date: string) => string;
  readonly?: boolean;
}) {
  const StatusIcon = getStatusIcon(request?.status);

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={request?.userProfilePic} />
            <AvatarFallback>
              {helpers.capitalizeFirstWord(request?.userName)?.split(' ')?.map(n => n[0])?.join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{helpers.capitalizeFirstWord(request?.userName)}</div>
            <div className="text-sm text-muted-foreground">{request?.userEmail}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={getStatusColor(request?.status)} className="flex items-center gap-1">
            <StatusIcon className="w-3 h-3" />
            {request?.status?.charAt(0)?.toUpperCase() + request?.status?.slice(1)}
          </Badge>
          <span className="text-sm text-muted-foreground">{formatDate(request?.circleCreatedAt)}</span>
        </div>
      </div>

      {request.message && (
        <div className="bg-muted/50 rounded p-3">
          <p className="text-sm italic">"{request?.message}"</p>
        </div>
      )}

      {!readonly && request?.status === 'pending' && onAction && (
        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            onClick={() => onAction(request, 'approve')}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onAction(request, 'reject')}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: JoinRequest['status']) {
  switch (status) {
    case 'pending': return 'warning' as const;
    case 'accepted': return 'default' as const;
    case 'rejected': return 'destructive' as const;
    default: return 'outline' as const;
  }
}

function getStatusIcon(status: JoinRequest['status']) {
  switch (status) {
    case 'pending': return Clock;
    case 'approved' :case 'accepted': return CheckCircle;
    case 'rejected': return XCircle;
    default: return Clock;
  }
}