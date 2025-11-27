import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ArrowLeft, Phone, Calendar, Venus, UserCog, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import helpers from '@/utils/helpers';
import { showFormattedDate } from './common/showFormattedDate';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastActive: string;
  orders: number;
  totalSpent: number;
  walletBalance: number;
  avatar?: string;
}



export function UserDetails() {
  const location = useLocation()
  const userId = location?.state


  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (userId) {
      setUser(userId);
      setLoading(false);
    } else {
      navigate('/users')
    }
  }, [userId]);



  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'pending': return 'warning';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 bg-muted rounded-full animate-pulse" />
                <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                <div className="h-5 w-24 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="h-6 w-32 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold">User Not Found</h2>
            <p className="text-muted-foreground">The requested user could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold">User Details</h2>
            <p className="text-muted-foreground">View and manage user information</p>
          </div>
        </div>

      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user?.profilePic} />
                {helpers.ternaryCondition(user?.fullName,<AvatarFallback className="text-lg">
                  {user?.fullName?.split(' ')?.map(n => n[0])?.join('')?.toUpperCase()}
                </AvatarFallback>,
                <span className="flex size-full items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white font-medium"><User className='h-5 w-5'/></span>)}
              </Avatar>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{helpers.capitalizeFirstWord(user?.fullName)}</h3>
                <p className="text-muted-foreground">{user?.email}</p>
                <Badge variant={getStatusColor(user?.status)} className="mt-2">
                  {helpers.capitalizeFirstWord(user?.status)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <UserCog className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">User ID</p>
                    <p className="text-sm text-muted-foreground">{user?.userId || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">(+{user?.countryCode}) {user?.mobile}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Venus className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Gender</p>
                    <p className="text-sm text-muted-foreground">{helpers.capitalizeFirstWord(user?.gender)}</p>
                  </div>
                </div>
              </div>


            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Join Date</p>
                    <p className="text-sm text-muted-foreground">{showFormattedDate(user?.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">KYC Status</p>
                    <Badge variant={getStatusColor(user?.kycStatus)} className="">
                      {helpers.capitalizeFirstWord(user?.kycStatus)}
                    </Badge>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>


        </div>
      </div>


    </div>
  );
}