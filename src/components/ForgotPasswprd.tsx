import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { useSettings } from './SettingsContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from './TranslationContext';
import SharedField from '@/components/common/SharedField'
import { useForm } from 'react-hook-form';
import FormValidation from "@/utils/formValidation";
import helpers from '@/utils/helpers';
import { apiPost } from '@/utils/apiFetch';
import apiPath from '@/utils/apiPath';
import { ErrorToastMessage, SuccessToastMessage } from './common/sonner';
import { Avatar, AvatarImage } from './ui/avatar';
export function ForgotPassword() {
  const navigate = useNavigate();
  const { settings,adminSetting } = useSettings();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const formValidation = FormValidation()
  type FormValues = {
    email: string;
  };
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {},
  });


  const handleResetSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    try {
      const resp = await apiPost(apiPath.forgetPassword, e)
      if (resp?.data?.success) {
        setEmailSent(true);
        setEmail(e?.email);
        SuccessToastMessage({ message: resp?.data?.message })
        return
      }

    } catch (error) {
      console.log('------err------', error)
      ErrorToastMessage({ message: error?.response?.data?.message })
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleResendEmail = () => {
    setEmailSent(false);
    setEmail('');
  };

  if (emailSent) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/20 p-4">

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src={adminSetting?.logo||"/images/logo.svg"}
            alt="background logo"
            className="w-[600px] opacity-[0.03] dark:opacity-[0.05]"
          />
        </div>

        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">{t('CHECK_YOUR_MAIL')}</h1>
            <p className="text-muted-foreground">
              {t('WE_HAVE_SENT_RESET_INST')} <strong>{email}</strong>
            </p>
          </div>

          <Card className="shadow-lg border-0 bg-card">
            <CardContent className="pt-6 space-y-4">
              <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <strong>{t('NEXT_STEPS')}</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Check your email inbox (and spam folder)</li>
                    <li>• Click the reset link in the email</li>
                    <li>• Follow the instructions to create a new password</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  variant="outline"
                  className="w-full"
                >
                  {t('SEND_ANOTHER_EMAIL')}
                </Button>

                <Button
                  onClick={handleBackToLogin}
                  variant="ghost"
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("BACK_TO_LOGIN")}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {t('DIDNOT_RECEIVE_EMAIL')} {' '}
              <button
                onClick={handleResendEmail}
                className="text-primary hover:underline"
              >
                {t('TRY_AGAIN')}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (

    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/20 p-4">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={adminSetting?.logo||"/images/logo.svg"}
          alt="background logo"
          className="w-[600px] opacity-[0.03] dark:opacity-[0.05]"
        />
      </div>
      <div className="relative w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10 dark:bg-primary/20">
            <Avatar className="m-auto w-[130px] h-[44px] py-2 max-w-[267px]">
              <AvatarImage src={adminSetting?.logo||'/images/logo.svg'} alt={'logo'} className='h-[30px]' />
            </Avatar>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Forgot your password?</h1>
          <p className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Reset Form */}
        <Card className="shadow-lg border-0 bg-card">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Enter your {settings.siteName} account email
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(handleResetSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <SharedField
                id="email"
                label={t('EMAIL_ID')}
                name={'email'}
                type="text"
                placeholder={t('EMAIL_PLACEHOLDER')}
                icon={<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />}
                registration={register("email", formValidation.email)}
                error={errors}
                required
              />

              <Button
                type="submit"
                className="w-full h-11 cursor-pointer"
                disabled={loading}
              >
                {helpers.ternaryCondition(loading,
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('SENDING')}
                  </>,
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    {t('SEND_EMAIL')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to Login */}
        <div className="text-center">
          <Button
            onClick={handleBackToLogin}
            variant="ghost"
            className="text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('BACK_TO_LOGIN')}
          </Button>
        </div>

        {/* Support Info */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Having trouble? Contact support at{" "}
            <a
              href={`mailto:${helpers.orCondition(settings?.supportEmail, 'support@example.com')}`}
              className="text-primary hover:underline"
            >
              {helpers.orCondition(settings?.supportEmail, 'support@example.com')}
            </a>
          </p>
        </div>
      </div>
    </div>

  );
}