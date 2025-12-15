import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Shield, Lock, Mail } from 'lucide-react';
import { useSettings } from './contexts/settings';
import { Link } from 'react-router-dom';
import { SuccessToastMessage } from './common/sonner';
import { useTranslation } from './TranslationContext';
import { useForm } from 'react-hook-form';
import SharedField from '@/components/common/SharedField';
import FormValidation from '@/utils/formValidation';
import helpers from '@/utils/helpers';
import { useAuth } from './AuthContext';
import { Avatar, AvatarImage } from './ui/avatar';

export function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { settings, adminSetting } = useSettings();
  // const [isLoading, setIsLoading] = useState(false);
  const formValidation = FormValidation();

  type FormValues = {
    email: string;
    password: string;
    remember?: boolean;
  };

  const {
    register,
    reset,
    handleSubmit,
<<<<<<< HEAD
    formState: { errors, isSubmitting, isLoading },
=======
    formState: { errors },
>>>>>>> ad107891e84ea9cdd1361feb4a2c8d799c11347d
  } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  // Update document title
  useEffect(() => {
    document.title = `Admin Login - ${settings.siteName}`;
  }, [settings.siteName]);

<<<<<<< HEAD
  const [rememberMe, setRememberMe] = useState(window?.localStorage.getItem('rememberMe') === 'true');
  const handleRememberMe = (e: boolean) => {
    window?.localStorage.setItem('rememberMe', String(e));
=======
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberMe") == 'true'
  );
  const handleRememberMe = (e) => {
    localStorage.setItem("rememberMe", e);
>>>>>>> ad107891e84ea9cdd1361feb4a2c8d799c11347d
    setRememberMe(e);
  };

  // Apply theme on mount
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  useEffect(() => {
    if (rememberMe) {
      reset({
<<<<<<< HEAD
        email: window?.localStorage.getItem('email') ?? '',
        password: window?.localStorage.getItem('password') ?? '',
        remember: true,
=======
        email: localStorage.getItem("email"),
        password: localStorage.getItem("password"),
>>>>>>> ad107891e84ea9cdd1361feb4a2c8d799c11347d
      });
    }
  }, [rememberMe, reset]);

  const handleLogin = async (data: FormValues) => {
     
    try {
<<<<<<< HEAD
      if (data.remember || rememberMe) {
        window?.localStorage.setItem('email', data.email ?? '');
        window?.localStorage.setItem('password', data.password ?? '');
      } else {
        window?.localStorage.removeItem('email');
        window?.localStorage.removeItem('password');
=======

      if (rememberMe) {
        localStorage.setItem("email", e?.email);
        localStorage.setItem("password", e?.password);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
>>>>>>> ad107891e84ea9cdd1361feb4a2c8d799c11347d
      }
      const result = await login(data.email, data.password);
      if (result?.success) {
        SuccessToastMessage({ message: result?.message });
      }
    } catch (error) {
      console.log('err', error);
    }
  };

  return (
    <div className='relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/20 p-4'>
      <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
        <img src={adminSetting?.logo} alt='background logo' className='w-[600px] opacity-[0.03] dark:opacity-[0.05]' />
      </div>
      <div className='relative w-full max-w-md space-y-6'>
        <div className='text-center space-y-2'>
          <div className='flex justify-center'>
            <div className='p-3 rounded-full bg-primary/10 dark:bg-primary/20'>
              <Avatar className='m-auto w-[130px] h-[44px] py-2 max-w-[267px]'>
                <AvatarImage src={adminSetting?.logo} alt={'logo'} className='h-[30px]' />
              </Avatar>
            </div>
          </div>
          <h1 className='text-2xl font-bold'>Let's start!</h1>
          <p className='text-muted-foreground'>It's going to take only a few minutes</p>
        </div>

        <Card>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-xl'>{t('SIGN_IN')}</CardTitle>
            <CardDescription>{t('ENTER_CRED_TO_ACCESS')}</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(handleLogin)} className='mt-3'>
            <CardContent className='space-y-4'>
              <SharedField
                id='email'
                label={t('EMAIL_ID')}
                name='email'
                type='text'
                placeholder={t('EMAIL_PLACEHOLDER')}
                icon={<Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />}
                registration={register('email', formValidation.email)}
                error={errors.email}
                required
              />

              <SharedField
                id='password'
                label={t('PASSWORD')}
                name='password'
                type='password'
                placeholder={t('PASSWORD_PLACEHOLDER')}
                icon={<Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />}
                registration={register('password', formValidation.password)}
                error={errors.password}
                required
              />

              <div className='flex justify-between'>
                <SharedField
                  name='remember'
                  id='remember'
                  label={t('REMEMBER_ME')}
                  type='checkbox'
                  checked={!!rememberMe}
                  registration={register('remember')}
                  error={errors.remember}
                  onCheckedChange={(e) => handleRememberMe(e)}
                />
                <Link to='/forgot-password' className='ml-auto text-[#6236FF] hover:text-[#9D36FF] text-sm font-medium'>
                  {t('FORGOT_PASSWORD')}?
                </Link>
              </div>

              <Separator />

              <div className='text-xs text-muted-foreground bg-muted/50 p-3 rounded-md'>
                <div className='flex items-start gap-2'>
                  <Shield className='w-3 h-3 mt-0.5 text-primary' />
                  <div>
                    <p className='font-medium'>{t('SECURITY_NOTICE')}</p>
                    <p>{t('SESSION_WILL_EXPIRE_AFTER')}</p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className='mt-3'>
              <Button type='submit' className='w-full' disabled={isSubmitting || isLoading}>
                {helpers.ternaryCondition(
                  isSubmitting || isLoading,
                  <>
                    <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2' />
                    {t('SIGNING_IN')}
                  </>,
                  <>
                    <Shield className='w-4 h-4 mr-2' />
                    {t('SIGN_IN')}
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
