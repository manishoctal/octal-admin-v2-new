import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Shield, Key, Lock } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useSettings } from './contexts/settings';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '@/utils/apiFetch';
import apiPath from '@/utils/apiPath';
import { SuccessToastMessage } from './common/sonner';
import helpers from '@/utils/helpers';

export function ChangePassword() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { settings } = useSettings();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const getStrengthText = (strength: number) => {
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Fair';
    if (strength < 80) return 'Good';
    return 'Strong';
  };

  const validateForm = () => {
    setError('');

    if (!currentPassword) {
      setError('Current password is required.');
      return false;
    }

    if (!newPassword) {
      setError('New password is required.');
      return false;
    }

    if (!confirmPassword) {
      setError('Confirm new password is required.');
      return false;
    }

    if (newPassword?.length < 8) {
      setError('New password must be at least 8 characters long.');
      return false;
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from current password.');
      return false; 
    }

    if (newPassword !== confirmPassword) {
      setError('Confirm password do not match with new password.');
      return false;
    }

    if (passwordStrength < 90) {
      setError('New password is too weak. Please choose a stronger password.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await apiPost(apiPath.changePassword, {
        oldPassword: currentPassword,
        newPassword: newPassword,
      });

      if (res?.data?.success) {
        setSuccess(true);
        SuccessToastMessage({ message: res?.data?.message })
        logout();
        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }

    } catch (error) {
      setError(error?.response?.data?.message || 'Failed to change password. Please try again.');

    } finally {
      setLoading(false);
    }
  };



  if (success) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => { navigate(-1) }}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold">Password Changed</h2>
            <p className="text-muted-foreground">Your password has been successfully updated</p>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="shadow-lg border-0 bg-card">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Password Updated Successfully!</h3>
                <p className="text-sm text-muted-foreground">
                  Your password has been changed. Make sure to use your new password for future logins.
                </p>

                <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-left">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    <strong>Security tip:</strong> Keep your password secure and don't share it with anyone.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Button onClick={() => navigate('/settings')} className="w-full">
                    Back to Settings
                  </Button>
                  <Button onClick={() => navigate('/dashboard')} variant="outline" className="w-full">
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 pt-4">
      <div className="flex items-center gap-4">
        {helpers.andCondition(user?.isPasswordSet, <>
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold">Change Password</h2>
            <p className="text-muted-foreground">Update your account password</p>
          </div>
        </>)}
      </div>

      <div className={`max-w-md mx-auto ${helpers.andCondition(!user?.isPasswordSet, 'pt-8')}`}>
        <Card className="shadow-lg border-0 bg-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Update Password
            </CardTitle>
            <CardDescription>
              Enter your current password and choose a new secure password for your {settings.siteName} account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 mt-3">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password<span className='text-red-500'>*</span></Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Enter Your Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={loading}
                    className="h-11 pr-10"
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-10 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password<span className='text-red-500'>*</span></Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter Your New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    className="h-11 pr-10"
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-10 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {newPassword && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Password strength:</span>
                      <span className={`font-medium ${helpers.ternaryCondition(passwordStrength < 30 , 'text-red-600', 
                        helpers.ternaryCondition(passwordStrength < 60 , 'text-yellow-600' ,helpers.ternaryCondition(passwordStrength < 80 , 'text-blue-600' , 'text-green-600')))}`}>
                        {getStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <Progress
                      value={passwordStrength}
                      className="h-2"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password<span className='text-red-500'>*</span></Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Enter Your Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="h-11 pr-10"
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-10 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Password requirements:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Different from current password</li>
                    <li>• Mix of uppercase and lowercase letters</li>
                    <li>• At least one number</li>
                    <li>• Special characters recommended</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="flex gap-2 pt-2">

                <Button
                  type="submit"
                  disabled={loading || passwordStrength < 90}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-4">
          <Alert className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200 text-sm">
              <strong>Security reminder:</strong> After changing your password, you’ll be logged out for security reasons. Please log in again using your new password. Don’t forget to update any saved passwords in your browser or password manager
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}