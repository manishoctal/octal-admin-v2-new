import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Shield, Key } from 'lucide-react';
import { useSettings } from './contexts/settings';
import { useNavigate, useParams } from 'react-router-dom';
import { apiPost } from '@/utils/apiFetch';
import apiPath from '@/utils/apiPath';
import { ErrorToastMessage, SuccessToastMessage } from './common/sonner';
import { Avatar, AvatarImage } from './ui/avatar';

interface PasswordResetProps {
  token: string;
}

export function PasswordReset({ token }: PasswordResetProps) {
  const params = useParams()
  token = params?.token
  const navigate = useNavigate();
  const { settings,adminSetting } = useSettings();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState('');
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

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

  const passwordStrength = getPasswordStrength(password);


  const getStrengthText = (strength: number) => {
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Fair';
    if (strength < 80) return 'Good';
    return 'Strong';
  };

;



  const validateForm = () => {
    setError('');

    if (!password) {
      setError('Password is required.');
      return false;
    }

    if (!confirmPassword) {
      setError('Confirm password is required.');
      return false;
    }

    if (password?.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Confirm password do not match with new password.');
      return false;
    }

    if (passwordStrength < 90) {
      setError('Password is too weak. Please choose a stronger password.');
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

      console.log('sdfsdfsdf', password)

      const resp = await apiPost(apiPath.resetPassword + '/' + token, { password: password })
      console.log('resp', resp)
      if (resp?.data?.success) {
        SuccessToastMessage({ message: resp?.data?.message })
        navigate('/login');
        setLoading(false);
        return
      }
      ErrorToastMessage({ message: resp?.data?.message })
      setLoading(false);

    }
    catch (error) {
      setError(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };


  if (passwordResetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Password Reset Successful!</h1>
            <p className="text-muted-foreground">
              Your password has been successfully updated.
            </p>
          </div>

          <Card className="shadow-lg border-0 bg-card">
            <CardContent className="pt-6 space-y-4">
              <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  You can now log in with your new password. You'll be redirected to the login page automatically.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleBackToLogin}
                className="w-full"
              >
                Continue to login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Password reset form
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/20 p-4">

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={adminSetting?.logo}
          alt="background logo"
          className="w-[600px] opacity-[0.03] dark:opacity-[0.05]"
        />
      </div>

      <div className="relative w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10 dark:bg-primary/20">
            <Avatar className="m-auto w-[130px] h-[44px] py-2 max-w-[267px]">
              <AvatarImage src={adminSetting?.logo} alt={'logo'} className='h-[30px]' />
            </Avatar>
          </div>
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Set New Password</h1>
          <p className="text-muted-foreground">
            Enter a strong password for your {settings.siteName} account.
          </p>
        </div>

        {/* Password Form */}
        <Card className="shadow-lg border-0 bg-card">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Create New Password</CardTitle>
            <CardDescription className="text-center">
              Choose a strong password to secure your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  New Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="h-11 pr-10"
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-10 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Password Strength */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Password strength:</span>
                      <span
                        className={`font-medium ${passwordStrength < 30
                          ? 'text-red-600'
                          : passwordStrength < 60
                            ? 'text-yellow-600'
                            : passwordStrength < 80
                              ? 'text-blue-600'
                              : 'text-green-600'
                          }`}
                      >
                        {getStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <Progress value={passwordStrength} className="h-2" />
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm New Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Enter Confirm Password"
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
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Password Guidelines */}
              <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Password requirements:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Mix of uppercase and lowercase letters</li>
                    <li>• At least one number</li>
                    <li>• Special characters recommended</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11"
                disabled={loading || passwordStrength < 90}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating password...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Update password
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to Login */}
        <div className="text-center">
          <Button onClick={handleBackToLogin} variant="ghost" className="text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Button>
        </div>
      </div>
    </div>

  );
}