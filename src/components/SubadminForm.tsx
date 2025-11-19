import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, Save, X } from 'lucide-react';
import { toast } from "sonner";
import { useTranslation } from './TranslationContext';
import { MODULES, ACTIONS, MODULE_LABELS, ACTION_LABELS, MODULE_ACTIONS } from './PermissionContext';
import { subadminAPI, } from './AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import FormValidation from '@/utils/formValidation';
import SharedField from '@/components/common/SharedField'
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import helpers from '@/utils/helpers';
interface SubadminFormProps {
  mode: 'add' | 'edit';
  subadminId?: string;
}

interface SubadminFormData {
  name: string;
  email: string;
  password: string;
  role: 'subadmin' | 'moderator' | 'viewer';
  status: 'active' | 'inactive';
  permissions: string[];
}


type FormValues = {
  firstName: string;
  lastName: string;
  mobile: number;
  countryCode: string;
  email: string;
  address: string;
};


export default function SubadminForm({ mode }: SubadminFormProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const formValidation = FormValidation()
  const [countryCode] = useState("in");


  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {},
  });
  const [formData, setFormData] = React.useState<SubadminFormData>({
    name: '',
    email: '',
    password: '',
    role: 'viewer',
    status: 'active',
    permissions: []
  });


  const [loading, setLoading] = React.useState(false);
  const inputRef = useRef(null);

  const location = useLocation()
  const subadminId = location?.state

  // Load subadmin data in edit mode
  React.useEffect(() => {
    if (mode === 'edit' && subadminId) {
      reset({ ...subadminId, permissions: subadminId.permission, mobile: helpers.ternaryCondition(subadminId?.countryCode, subadminId.countryCode + subadminId?.mobile, "na"), })
      setFormData({
        firstName: subadminId?.firstName,
        lastName: subadminId?.lastName,
        email: subadminId.email,
        role: subadminId.role,
        permissions: subadminId.permission || []
      });

    } else if (mode == 'edit' && !subadminId) {
      navigate('/subadmins')

    }
  }, [mode, subadminId]);


  // const handlePermissionChange = (module: string, action: string, checked: boolean) => {
  //   const permissionKey = `${module}:${action}`;
  //   const viewPermission = `${module}:view`;
  //   const dependentActions = ["Add", "edit", "delete"];

  //   setFormData(prev => {
  //     let updatedPermissions = [...prev.permissions];
  //     const exists = updatedPermissions?.includes(permissionKey);

  //     if (checked) {
  //       if (!exists) {
  //         updatedPermissions.push(permissionKey);
  //       }

  //       if (dependentActions.includes(action) && !updatedPermissions?.includes(viewPermission)) {
  //         updatedPermissions.push(viewPermission);
  //       }
  //     } else {
  //       updatedPermissions = updatedPermissions.filter(p => p !== permissionKey);
  //       if (action === "view") {
  //         updatedPermissions = updatedPermissions.filter(
  //           p => !dependentActions.some(dep => p === `${module}:${dep}`)
  //         );
  //       }
  //     }

  //     return {
  //       ...prev,
  //       permissions: updatedPermissions
  //     };
  //   });
  // };


  const removePermission = (permissions: string[], key: string) =>
    permissions.filter(p => p !== key);

  const removeDependentPermissions = (permissions: string[], module: string, deps: string[]) =>
    permissions.filter(p => !deps.some(dep => p === `${module}:${dep}`));

  const addPermission = (permissions: string[], key: string) =>
    permissions.includes(key) ? permissions : [...permissions, key];

  const handlePermissionChange = (module: string, action: string, checked: boolean) => {
    const permissionKey = `${module}:${action}`;
    const viewPermission = `${module}:view`;
    const dependentActions = ["Add", "edit", "delete"];

    setFormData(prev => {
      let updated = [...prev.permissions];

      if (checked) {
        updated = addPermission(updated, permissionKey);

        const requiresView = dependentActions.includes(action);
        if (requiresView) {
          updated = addPermission(updated, viewPermission);
        }
      } else {
        updated = removePermission(updated, permissionKey);

        const isView = action === "view";
        if (isView) {
          updated = removeDependentPermissions(updated, module, dependentActions);
        }
      }

      return { ...prev, permissions: updated };
    });
  };



  const hasModulePermission = (module: string, action: string): boolean => {
    return formData?.permissions?.includes(`${module}:${action}`);
  };


  const handleAddSubadmin = async (e: React.FormEvent) => {

    setLoading(true);
    e.mobile = e?.mobile?.substring(inputRef?.current?.state.selectedCountry?.countryCode?.length, e?.mobile?.toString()?.length);
    e.countryCode = inputRef?.current?.state.selectedCountry?.countryCode;
    try {

      const payload = {
        ...e,
        permission: JSON.stringify(formData.permissions)
      }
      if (mode === 'add') {
        await subadminAPI.createSubadmin(payload as any, navigate);
      } else {
        await subadminAPI.updateSubadmin(subadminId?._id!, payload, navigate);
      }

    } catch (error) {
      toast.error(mode === 'add' ? 'Failed to create subadmin' : 'Failed to update subadmin');
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/subadmins');
  };

  const pageTitle = mode === 'add' ? 'Create Sub Admin' : 'Edit Sub Admin';





  const inputStyle: React.CSSProperties = {
    color: '#111827',
    backgroundColor: '#f9fafb',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    height: '2.25rem',
    width: '100%',
    minWidth: 0,
    fontSize: '1rem',
    display: 'flex',
    outline: 'none',
    transition: 'color 0.2s, box-shadow 0.2s',

  };




  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold">{pageTitle}</h2>
          <p className="text-muted-foreground">
            {mode === 'add'
              ? 'Create a new sub admin account with specific permissions'
              : `Edit sub admin details and permissions`
            }
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleAddSubadmin)} className="space-y-6 ">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 xl:grid-cols-4 gap-4">


              <SharedField
                id="firstName"
                label={t('FIRST_NAME')}
                name={'firstName'}
                type="text"
                placeholder={t('FIRST_NAME_PLACEHOLDER')}
                registration={register("firstName", formValidation.firstName)}
                error={errors}
                required
              />

              <SharedField
                id="lastName"
                label={t('LAST_NAME')}
                name={'lastName'}
                type="text"
                placeholder={t('LAST_NAME_PLACEHOLDER')}
                registration={register("lastName", formValidation.lastName)}
                error={errors}
                required
              />

              <SharedField
                id="email"
                label={t('EMAIL_ID')}
                name={'email'}
                disabled={mode === 'edit'}
                type="text"
                placeholder={t('SUBADMIN_EMAIL_PLACEHOLDER')}
                registration={register("email", formValidation.email)}
                error={errors}
                required
              />

              <div className="">
                <Label htmlFor={'mobile'} className='mb-2'>
                  {t('MOBILE_NO')}
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  control={control}
                  name="mobile"
                  rules={{
                    required: "Please enter mobile no.",
                    validate: (value) => {
                      const inputValue = value?.toString()?.slice(inputRef?.current?.state?.selectedCountry?.countryCode?.length, value?.length);
                      if (inputValue?.length < 8) {
                        return "Mobile number must be at least 8 digits.";
                      } else if (inputValue?.length > 12) {
                        return "Mobile number must not exceed 15 digits.";
                      }
                    },
                  }}
                  render={({ field: { ref, ...field } }) => (
                    <PhoneInput
                      {...field}
                      inputExtraProps={{
                        ref,
                        required: true,
                        autoFocus: true,
                      }}
                      ref={inputRef}
                      inputStyle={{
                        ...inputStyle,
                        width: "100%",
                        height: "32px",
                      }}
                      style={{ borderRadius: "20px" }}
                      country={countryCode}
                      enableSearch={false}
                      onlyCountries={["in"]}
                      countryCodeEditable={false}
                    />
                  )}
                />
                {errors?.mobile && <p className="text-sm text-destructive mt-1">{errors?.mobile?.message}</p>}
              </div>

              <SharedField
                id="address"
                label={t('ADDRESS_NAME')}
                name={'address'}
                type="textarea"
                placeholder={t('ADDRESS_PLACEHOLDER')}
                registration={register("address", formValidation.address)}
                error={errors}
                required
              />

            </div>

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Customize access permissions for each module. Role-based permissions are pre-selected but can be modified.
            </p>
          </CardHeader>
          <CardContent className=''>
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-100  dark:bg-gray-800">
                    <th className="px-4 py-2 text-left">Module</th>
                    {Object.values(ACTIONS).map((action) => (
                      <th key={action} className="px-4 py-2 text-center w-[250px]">
                        {ACTION_LABELS[action] == 'Edit' ? ACTION_LABELS[action] + ' / Update Status' : ACTION_LABELS[action]}
                      </th>
                    ))}
                    <th className="px-4 py-2 text-center">All</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(MODULES).map(([key, module]) => {
                    if ((module === MODULES.SUBADMINS || module === MODULES.ERROR_LOGS) && formData.role !== "subadmin") {
                      return null;
                    }
                    const allowedActions = MODULE_ACTIONS[module] || [];
                    return (
                      <tr key={module} className="border-t">
                        <td className="px-4 py-2 font-medium">{MODULE_LABELS[module]}</td>
                        {Object.values(ACTIONS).map((action) => (
                          <td key={action} className="px-4 py-2 text-center">
                            {allowedActions.includes(
                              Object.keys(ACTIONS).find((k) => ACTIONS[k] === action) as keyof typeof ACTIONS
                            ) ? (
                              <Checkbox
                                id={`${module}-${action}`}
                                checked={hasModulePermission(module, action)}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(module, action, checked as boolean)
                                }
                              />
                            ) : (
                              "-"
                            )}
                          </td>
                        ))}

                        <td className="px-4 py-2 text-center">
                          {allowedActions.length > 1 ? (
                            <Checkbox
                              id={`${module}-all`}
                              checked={allowedActions.every((a) =>
                                hasModulePermission(module, ACTIONS[a])
                              )}
                              onCheckedChange={(checked) =>
                                allowedActions.forEach((a) =>
                                  handlePermissionChange(module, ACTIONS[a], checked as boolean)
                                )
                              }
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>


          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
            <X className="w-4 h-4 mr-2" />
            {t('CANCEL')}
          </Button>

          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? t('SAVING') : mode == 'add' ? t('CREATE_SUBADMIN') : t('UPDATE_SUBADMIN')}
          </Button>
        </div>
      </form>
    </div>
  );
}