
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import SharedField from '@/components/common/SharedField'
import {
  Settings as SettingsIcon,
  Save,
  Globe,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Moon,
  Sun,
  Shield,
  Palette,
  Calendar,
  AlertTriangle,
  CheckCircle,
  CalendarCog,
  Type
} from 'lucide-react';
import { useSettings, SettingsData } from './SettingsContext';
import apiPath from '@/utils/apiPath';
import { apiGet, apiPut } from '@/utils/apiFetch';
import { Controller, useForm } from "react-hook-form"

import { useTranslation } from './TranslationContext';
import FormValidation from '@/utils/formValidation';
import { ErrorToastMessage, SuccessToastMessage } from './common/sonner';

export function Settings() {
  const { settings, updateSettings, } = useSettings();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    defaultValues: {},
  });


  const [hasChanges, setHasChanges] = useState(isDirty || false);
  const [tempSettings, setTempSettings] = useState<SettingsData>(settings);
  const [theme, setTheme] = useState<SettingsData>(settings?.theme);

  const [fontFamily, setFontFamily] = useState<SettingsData>(settings?.fontFamily);
  const [fontSize, setFontSize] = useState<SettingsData>(settings?.fontSize);
  
  
  const { t } = useTranslation()
  const formValidation = FormValidation()
  type FormValues = {
    email: string;
    password: string;
    siteName: string;
    dateFormat: string;
    currencySymbol: string;
    companyName: string;
    supportEmail: string;
    maintenance: string;
    linkedinLink: string;
    youtubeLink: string;
    facebookLink: string;
    instagramLink: string;
    twitterLink: string;
  };



  React.useEffect(() => {
    setTempSettings(settings);
    setTheme(settings?.theme)
    setFontSize(settings?.fontSize)
    setFontFamily(settings?.fontFamily)
  }, [settings]);


  const getSettingDta = async () => {
    try {
      const resp = await apiGet(apiPath.getSetting)
      if (resp?.data?.success) {
        reset(resp?.data?.results)
        const localStorageData = localStorage.getItem('adminPanelSettings')
        if (!localStorageData) {
          const data = { ...resp?.data?.results, maintenanceMode: resp?.data?.results?.maintenance }

          localStorage.setItem('adminPanelSettings', JSON.stringify(data))
          setTempSettings((prev) => ({ ...prev, ...data }))
        } else {
          let parsedyData = JSON.parse(localStorageData)
          if (parsedyData?.dateFormat !== resp?.data?.results?.dateFormat) {

            const data = { ...resp?.data?.results, maintenanceMode: resp?.data?.results?.maintenance }

            localStorage.setItem('adminPanelSettings', JSON.stringify(data))
            setTempSettings((prev) => ({ ...prev, ...data }))

          }
        }
      }

    } catch (err) {
      console.log('errrrrr', err)
    }

  }


  useEffect(() => {
    getSettingDta()
  }, [settings])




  const handleSettingChange = (key: keyof SettingsData, value: any) => {
    setTempSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };



  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (UK)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
    { value: 'DD MMM YYYY', label: 'DD MMM YYYY (Jan 15, 2024)' },
  ];

  const currencies = [
    { value: '$', label: '$ (USD)' },
    { value: '€', label: '€ (EUR)' },
    { value: '£', label: '£ (GBP)' },
    { value: '¥', label: '¥ (JPY/CNY)' },
    { value: '₹', label: '₹ (INR)' },
    { value: '₽', label: '₽ (RUB)' },
  ];



  const handleUpdate = async (e) => {
    setIsSaving(true)
    try {
      const resp = await apiPut(apiPath.getSetting, { ...e, maintenance: tempSettings?.maintenanceMode })
      if (resp?.data?.success) {
        updateSettings({ ...resp?.data?.results, maintenanceMode: resp?.data?.results?.maintenance, enableAnimations: tempSettings?.enableAnimations, fontFamily:fontFamily||tempSettings?.fontFamily,fontSize:fontSize||tempSettings?.fontSize, compactMode: tempSettings?.compactMode, theme: theme || settings?.theme });
        SuccessToastMessage({ message: resp?.data?.message })

        setHasChanges(false)
      }
    } catch (err) {
      ErrorToastMessage({ message: err?.response?.data?.message || 'Failed to update setting.' })
    } finally {
      setIsSaving(false)

    }

  }

  return (
    <form onSubmit={handleSubmit(handleUpdate)}>
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Settings</h2>
            <p className="text-muted-foreground">Manage your application settings and configuration</p>
          </div>
          <div className="sm:flex items-center gap-2 ">
            <Button type='submit' disabled={!isDirty && !hasChanges && (!theme || theme == settings?.theme)&&(!fontFamily || fontFamily == settings?.fontFamily)&&(!fontSize || fontSize == settings?.fontSize)} className="w-full sm:w-auto mt-1 sm:mt-0">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">System Status</p>
                  <div className="flex items-center gap-2">
                    {tempSettings?.maintenanceMode ? (
                      <>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-amber-600">Maintenance</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Online</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Currency</p>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">{currencies?.find(res => res?.value == tempSettings?.currencySymbol)?.label}</span>
                  </div>
                </div>

                <div className="py-[8px] px-[16px] rounded-lg bg-pink-50 dark:bg-pink-950/20">
                  <span className="text-pink-600 text-xl font-bold">
                    {tempSettings?.currencySymbol}
                  </span>
                </div>

              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Date Format</p>
                  <div className="flex items-center gap-2">
                    <CalendarCog className="h-4 w-4 text-slate-500" />
                    <span className="">{tempSettings?.dateFormat}</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Theme</p>
                  <div className="flex items-center gap-2">
                    {settings?.theme === 'dark' ? (
                      <>
                        <Moon className="h-4 w-4 text-slate-500" />
                        <span>Dark</span>
                      </>
                    ) : settings?.theme === 'light' ? (
                      <>
                        <Sun className="h-4 w-4 text-yellow-500" />
                        <span>Light</span>
                      </>
                    ) : (
                      <>
                        <Palette className="h-4 w-4 text-blue-500" />
                        <span>System</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                  <Palette className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="space-y-2">
                <SharedField
                  id="siteName"
                  label={t('SITE_NAME')}
                  name="siteName"
                  type="text"
                  placeholder={t('ENTER_SITE_NAME')}
                  registration={register('siteName', formValidation.siteName)}
                  error={errors}
                  required
                />
              </div>


              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label>Date Format<span className='text-red-500'>*</span></Label>
                  <Controller
                    name="dateFormat"
                    control={control}
                    rules={{ required: "Date format is required." }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          className={
                            errors?.dateFormat
                              ? "border-destructive focus-visible:ring-destructive/20"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select Date Format" />
                        </SelectTrigger>
                        <SelectContent>
                          {dateFormats.map((format) => (
                            <SelectItem key={format.value} value={format.value}>
                              {format.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors?.dateFormat && (
                    <p className="text-sm text-destructive">
                      {errors.dateFormat.message as string}
                    </p>
                  )}
                </div>


                <div className="space-y-2">
                  <Label>Currency Symbol<span className='text-red-500'>*</span></Label>
                  <Controller
                    name="currencySymbol"
                    control={control}
                    rules={{ required: "Currency symbol is required." }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          className={
                            errors?.currencySymbol
                              ? "border-destructive focus-visible:ring-destructive/20"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies?.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors?.currencySymbol && (
                    <p className="text-sm text-destructive">
                      {errors.currencySymbol.message as string}
                    </p>
                  )}
                </div>


                <div className="space-y-2">
                  <Label htmlFor="fontSize" >
                    Font Size
                  </Label>
                  <Select
                    value={fontSize||settings?.fontSize}
                    onValueChange={(value: 'small' | 'medium' | 'large' | 'extra-large') => setFontSize(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (12px)</SelectItem>
                      <SelectItem value="medium">Medium (14px)</SelectItem>
                      <SelectItem value="large">Large (16px)</SelectItem>
                      <SelectItem value="extra-large">Extra Large (18px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontFamily" >
                    Font Family
                  </Label>
                  <Select
                    value={fontFamily||settings?.fontFamily}
                    onValueChange={(value: 'system' | 'sans-serif' | 'serif' | 'monospace') => setFontFamily(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System Default</SelectItem>
                      <SelectItem value="sans-serif">Sans Serif</SelectItem>
                      <SelectItem value="serif">Serif</SelectItem>
                      <SelectItem value="monospace">Monospace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>



              </div>

            </CardContent>
          </Card>


          {/* Theme & Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Theme & Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={theme || settings?.theme} onValueChange={(value: 'light' | 'dark' | 'system') => { setTheme(value) }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />


              <div className="grid grid-cols-1  sm:grid-cols-1 gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableAnimations">Show Animations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable smooth transitions and animations throughout the interface
                    </p>
                  </div>
                  <div>
                    <Switch
                      id="enableAnimations"
                      checked={tempSettings.enableAnimations}
                      onCheckedChange={(checked) => handleSettingChange('enableAnimations', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Use compact layout for tables and lists</p>
                  </div>
                  <div>
                    <Switch
                      checked={tempSettings.compactMode}
                      onCheckedChange={(checked) => handleSettingChange('compactMode', checked)}
                    />
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>



          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <SharedField
                    id="companyName"
                    label={t('COMPANY_NAME')}
                    name="companyName"
                    type="text"
                    placeholder={t('ENTER_COMPANY_NAME')}
                    registration={register('companyName', formValidation.companyName)}
                    error={errors}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <SharedField
                    id="supportEmail"
                    label={t('EMAIL_ID')}
                    name="supportEmail"
                    type="text"
                    placeholder={t('EMAIL_PLACEHOLDER')}
                    registration={register('supportEmail', formValidation.email)}
                    error={errors}
                    required
                  />
                </div>

              </div>

            </CardContent>
          </Card>


          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Put site in maintenance mode</p>
                </div>
                <Switch
                  checked={tempSettings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                />
              </div>
            </CardContent>
          </Card>

        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Social Media Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <SharedField
                id="facebookLink"
                label={<><Facebook className="w-4 h-4 text-blue-600 mr-1" /><span>Facebook</span></>}
                name="facebookLink"
                type="text"
                placeholder={'Enter Facebook Link'}
                registration={register('facebookLink', formValidation.facebookLink)}
                error={errors}
                required
              />
            </div>

            <div className="space-y-2">
              <SharedField
                id="twitterLink"
                label={<><Twitter className="w-4 h-4 text-blue-400 mr-1" /><span className=''>Twitter</span></>}
                name="twitterLink"
                type="text"
                placeholder={'Enter Twitter Link'}
                registration={register('twitterLink', formValidation.twitterLink)}
                error={errors}
                required
              />
            </div>

            <div className="space-y-2">
              <SharedField
                id="instagramLink"
                label={<><Instagram className="w-4 h-4 text-pink-600 mr-1" /><span className=''>Instagram</span></>}
                name="instagramLink"
                type="text"
                placeholder={'Enter Instagram Link'}
                registration={register('instagramLink', formValidation.instagramLink)}
                error={errors}
                required
              />



            </div>

            <div className="space-y-2">
              <SharedField
                id="linkedinLink"
                label={<><Linkedin className="w-4 h-4 text-blue-700 mr-1" /><span className=''>LinkedIn</span></>}
                name="linkedinLink"
                type="text"
                placeholder={'Enter Linkedin Link'}
                registration={register('linkedinLink', formValidation.linkedinLink)}
                error={errors}
                required
              />
            </div>

            <div className="space-y-2">
              <SharedField
                id="youtubeLink"
                label={<><Youtube className="w-4 h-4 text-red-600 mr-1" /><span className=''>YouTube</span></>}
                name="youtubeLink"
                type="text"
                placeholder={'Enter Youtube Link'}
                registration={register('youtubeLink', formValidation.youtubeLink)}
                error={errors}
                required
              />

            </div>
          </CardContent>
        </Card>

      </div>
    </form >
  );
}