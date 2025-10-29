
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

import { Alert, AlertDescription } from './ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  ArrowLeft,
  Camera,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Edit,
  Save,
  RotateCcw,
  InfoIcon,
  Globe,
  Lock,
  Heart,
  UserRound,
  ImageUp,
} from 'lucide-react';
import { useAuth } from './AuthContext';

import { useLocation, useNavigate } from 'react-router-dom';
import apiPath from '@/utils/apiPath';
import { apiPost, apiPut } from '@/utils/apiFetch';
import axios from 'axios';
import { showFormattedDate } from './common/showFormattedDate';
import { Badge } from './ui/badge';
import helpers from '@/utils/helpers';
import { ErrorToastMessage, SuccessToastMessage } from './common/sonner';
import { ACTIONS, MODULES, PermissionGate } from './PermissionContext';
interface ProfileFormData {
  name: string;
  email: string;
  avatar?: string;
}

interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  size?: number;
  dimensions?: { width: number; height: number };
}

export function IntentionForm({ mode }: CircleFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation()
  const circle = location?.state
  const isAdd = location?.pathname == '/intentions/create'
  const isEdit = location?.pathname == '/intentions/edit'
  const isView = location?.pathname == '/intentions/view'

  const [isEditing, setIsEditing] = useState(isAdd || isEdit || false);

  useEffect(() => {
    setIsEditing(isAdd || isEdit || false)
  }, [isAdd, isEdit, isView])

  useEffect(() => {
    if ((mode == 'edit' || mode == 'view') && !circle) {
      navigate('/intentions')
    }
  }, [mode, circle])



  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageLoading1, setImageLoading1] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [dragActive1, setDragActive1] = useState(false);
  const [key, setKey] = useState("");
  const [url, setURL] = useState("");
  const [key1, setKey1] = useState("");
  const [url1, setURL1] = useState("");
  const [formData, setFormData] = useState<ProfileFormData>({
    name: location?.state?.name || '',
    avatar: location?.state?.icon || '',
    image: location?.state?.image || ''
  });


  const [originalData] = useState<ProfileFormData>({
    name: location?.state?.name || '',
    avatar: location?.state?.icon || '',
    image: location?.state?.image || ''
  });


  useEffect(() => {
    setFormData({
      name: location?.state?.name || '',
      avatar: location?.state?.icon || '',
      image: location?.state?.image || ''
    })
  }, [user])

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRefImage = useRef<HTMLInputElement>(null);

  // Image validation constants
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const MAX_DIMENSIONS = { width: 2048, height: 2048 };
  const MIN_DIMENSIONS = { width: 100, height: 100 };

  // Validate image file
  const validateImage = async (file: File): Promise<ImageValidationResult> => {
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'Please upload a valid image file (JPEG, PNG, or WebP)'
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `Image size must be less than ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB`
      };
    }

    // Check image dimensions
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const { width, height } = img;

        if (width > MAX_DIMENSIONS.width || height > MAX_DIMENSIONS.height) {
          resolve({
            isValid: false,
            error: `Image dimensions must be less than ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height}px`
          });
        } else if (width < MIN_DIMENSIONS.width || height < MIN_DIMENSIONS.height) {
          resolve({
            isValid: false,
            error: `Image dimensions must be at least ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height}px`
          });
        } else {
          resolve({
            isValid: true,
            size: file.size,
            dimensions: { width, height }
          });
        }
      };

      img.onerror = () => {
        resolve({
          isValid: false,
          error: 'Invalid image file'
        });
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Handle image upload

  const [file, setFile] = useState()
  const [file1, setFile1] = useState()

  const handleImageUpload = async (file: File) => {
    setImageLoading(true);
    setError('');

    try {
      const validation = await validateImage(file);

      if (!validation.isValid) {
        setError(validation.error || 'Invalid image file');
        return;
      }

      if (file) {
        setFile(file)
        const payloadPre = {
          contentType: file?.type,
          folder: "intent",
        };
        const path = apiPath.generatePreSignUrl;
        const result = await apiPost(path, payloadPre);
        if (result?.data?.success) {
          setKey(result?.data?.results?.key);
          setURL(result?.data?.results?.url);
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            setFormData(prev => ({ ...prev, avatar: result }));
          };
          reader.readAsDataURL(file);

        }
      }
    } catch (error) {
      setError(error?.response?.data?.message || 'Failed to process image. Please try again.');
    } finally {
      setImageLoading(false);
    }
  }


  const handleImageUpload1 = async (file: File) => {
    setImageLoading1(true);
    setError('');

    try {

      const validation = await validateImage(file);
      if (!validation.isValid) {
        setError(validation.error || 'Invalid image file');
        return;
      }

      if (file) {


        setFile1(file)
        const payloadPre = {
          contentType: file?.type,
          folder: "intent",
        };
        const path = apiPath.generatePreSignUrl;
        const result = await apiPost(path, payloadPre);
        if (result?.data?.success) {
          setKey1(result?.data?.results?.key);
          setURL1(result?.data?.results?.url);
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            setFormData(prev => ({ ...prev, image: result }));
          };
          reader.readAsDataURL(file);

        }
      }
    } catch (error) {
      setError(error?.response?.data?.message || 'Failed to process image. Please try again.');
    } finally {
      setImageLoading1(false);
    }
  }

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };


  const handleFileChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload1(file);
    }
  }

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);


  const handleDragImage = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive1(true);
    } else if (e.type === "dragleave") {
      setDragActive1(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleImageUpload(files[0]);
    }
  }, []);


  const handleDropImage = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive1(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleImageUpload1(files[0]);
    }
  }, []);


  // Handle form submission


  const addCircle = async (payload) => {
    let resp
    try {
      resp = isEdit ? await apiPut(apiPath.getIntent + '/' + circle?._id, payload) : await apiPost(apiPath.getIntent, payload)
      if (resp?.data?.success) {
        SuccessToastMessage({ message: resp?.data?.message })
        setIsEditing(false)
        setURL('')
        setKey('')
        setFile('')
        setURL1('')
        setKey1('')
        setFile1('')
        navigate('/intentions')
      }

    } catch (err) {
      ErrorToastMessage({ message: err?.response?.data?.message })
    } finally {
      setLoading(false);
    }


  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Validate form
      if (!formData?.name?.trim()) {
        setError('Name is required.');
        return;
      }

      if (formData?.name?.length < 2) {
        setError('Name must be at least 2 characters long.');
        return;
      }

      if (formData?.name?.length > 50) {
        setError('Name must be less than 50 characters.');
        return;
      }

      if (!formData?.avatar) {
        setError('Intent icon is required.');
        return;
      }
      // if (!formData?.image) {
      //   setError('Intent image is required.');
      //   return;
      // }

      setLoading(true);



      const uploadFile = (file: File, uploadUrl: string) => {
        return new Promise<string>(async (resolve, reject) => {
          try {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);

            reader.onloadend = async () => {
              try {
                const binaryData = reader.result;
                const contentType = file?.type || "application/octet-stream";

                const resp = await axios.put(uploadUrl, binaryData, {
                  headers: {
                    "Content-Type": contentType,
                  },
                });

                if (resp?.status === 200) {
                  resolve(uploadUrl);
                } else {
                  reject(new Error("Upload failed"));
                }
              } catch (err) {
                reject(err);
              }
            };
          } catch (err) {
            reject(err);
          }
        });
      };

      let uploadedIconKey: string | undefined;
      // let uploadedImageKey: string | undefined;
      if (file) {
        uploadedIconKey = await uploadFile(file, url);
      }
      // if (file1) {
      //   uploadedImageKey = await uploadFile(file1, url1);
      // }

      addCircle({
        name: formData?.name,
        icon:helpers.ternaryCondition(key,key,undefined),
        // image:helpers.ternaryCondition(key1,key1,undefined),
      });
    } catch (error) {
      setError(error?.response?.data?.message || 'Failed to update intent. Please try again.');

    }
  };


  // Handle cancel editing
  const handleCancel = () => {
    setFormData({ name: '', avatar: '', image: '' });
    setError('');
    setFile('')
    setFile1('')
  };

  // Remove avatar
  const handleRemoveAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: '' }));
    setFile('')
  };

  const handleRemoveAvatarImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setFile1('')
  };


  // Check if form has changes
  const hasChanges = () => {
    const nameNotEmpty = formData?.name?.trim() !== "";
    const avatarNotEmpty = formData?.avatar?.trim() !== "";
    // const imageNotEmpty = formData?.image?.trim() !== "";
    const nameChanged = formData?.name !== originalData?.name;
    const avatarChanged = formData?.avatar !== originalData?.avatar;
    // const imageChanged = formData?.image !== originalData?.image;

    return nameNotEmpty && avatarNotEmpty  && (nameChanged || avatarChanged);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => { navigate(-1) }}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div>
            <h1 className="text-3xl font-bold">
              {isAdd ? 'Create New Intent' : isEdit ? 'Edit Intent' : 'View Intent'}
            </h1>
            <p className="text-muted-foreground">
              {isAdd ? 'Create a new intent for users to join and engage' : isEdit ? 'Update intent information and settings' : 'View intent information'}

            </p>
          </div>
        </div>
        {isView && (
          <PermissionGate module={MODULES.EVENTS} action={ACTIONS.EDIT}>
            <Button onClick={() => navigate(`/intentions/edit`, { state: { ...circle } })} className="gap-2">
              <Edit className="w-4 h-4" />
              Edit Intent
            </Button>
          </PermissionGate>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Profile Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Basic Information
              </CardTitle>

            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6 mt-3">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}



                {/* Profile Image Section */}
                <div className='grid grid-cols-1 sm:grid-cols-1 gap-2'>
                  <div className="space-y-4 mt-2 ">
                    <Label>Intent Icon<span className='text-red-500'>*</span></Label>
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="w-20 h-20">
                          {formData?.avatar ? (
                            <AvatarImage src={formData?.avatar} alt={formData?.name} />
                          ) : (
                            <span className="bg-muted flex size-full items-center justify-center rounded-full text-lg"><ImageUp className='h-12 w-8' /></span>
                          )}
                        </Avatar>
                        {imageLoading && (
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                          </div>
                        )}
                      </div>

                      {isEditing && (
                        <div className="flex-1 space-y-3">
                          {/* Drag and Drop Area */}
                          <div
                            className={`
                            border-2 border-dashed rounded-lg p-4 text-center transition-colors
                            ${dragActive
                                ? 'border-primary bg-primary/5'
                                : 'border-muted-foreground/25 hover:border-primary/50'
                              }
                          `}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                          >
                            <div className="space-y-2">
                              <Camera className="w-8 h-8 mx-auto text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">
                                  Drag and drop your image here, or{' '}
                                  <button
                                    type="button"
                                    className="text-primary hover:underline"
                                    onClick={() => fileInputRef.current?.click()}
                                  >
                                    browse
                                  </button>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  JPEG, PNG or WebP • Max 5MB • Min 100x100px
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={imageLoading}
                              className="gap-2"
                            >
                              <Upload className="w-4 h-4" />
                              Upload Image
                            </Button>
                            {formData?.avatar && file && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleRemoveAvatar}
                                disabled={imageLoading}
                                className="gap-2 text-destructive hover:text-destructive"
                              >
                                <X className="w-4 h-4" />
                                Remove
                              </Button>
                            )}
                          </div>

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept={ALLOWED_TYPES.join(',')}
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>

                    {!isEditing && formData?.avatar && (
                      <p className="text-sm text-muted-foreground">
                        Intent icon set • Click "Edit Intent" to change
                      </p>
                    )}
                  </div>


                  {/* <div className="space-y-4 mt-2 ">
                    <Label>Intent Image<span className='text-red-500'>*</span></Label>
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="w-20 h-20">
                          {formData?.image ? (
                            <AvatarImage src={formData?.image} alt={formData?.name} />
                          ) : (
                            <span className="bg-muted flex size-full items-center justify-center rounded-full text-lg"><ImageUp className='h-12 w-8' /></span>
                          )}
                        </Avatar>
                        {imageLoading1 && (
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                          </div>
                        )}
                      </div>

                      {isEditing && (
                        <div className="flex-1 space-y-3">
                          <div
                            className={`
                            border-2 border-dashed rounded-lg p-4 text-center transition-colors
                            ${dragActive
                                ? 'border-primary bg-primary/5'
                                : 'border-muted-foreground/25 hover:border-primary/50'
                              }
                          `}
                            onDragEnter={handleDragImage}
                            onDragLeave={handleDragImage}
                            onDragOver={handleDragImage}
                            onDrop={handleDropImage}
                          >
                            <div className="space-y-2">
                              <Camera className="w-8 h-8 mx-auto text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">
                                  Drag and drop your image here, or{' '}
                                  <button
                                    type="button"
                                    className="text-primary hover:underline"
                                    onClick={() => fileInputRefImage.current?.click()}
                                  >
                                    browse
                                  </button>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  JPEG, PNG or WebP • Max 5MB • Min 100x100px
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRefImage.current?.click()}
                              disabled={imageLoading1}
                              className="gap-2"
                            >
                              <Upload className="w-4 h-4" />
                              Upload Image
                            </Button>
                            {formData?.image && file1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleRemoveAvatarImage}
                                disabled={imageLoading1}
                                className="gap-2 text-destructive hover:text-destructive"
                              >
                                <X className="w-4 h-4" />
                                Remove
                              </Button>
                            )}
                          </div>

                          <input
                            ref={fileInputRefImage}
                            type="file"
                            accept={ALLOWED_TYPES.join(',')}
                            onChange={handleFileChangeImage}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>

                    {!isEditing && formData?.image && (
                      <p className="text-sm text-muted-foreground">
                        Intent image set • Click "Edit Intent" to change
                      </p>
                    )}
                  </div> */}

                </div>
                {/* Name Field */}

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                  <div className="space-y-2">
                    <Label htmlFor="name">Intent Name<span className='text-red-500'>*</span></Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter Intent Name"
                      value={formData?.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={isView || loading}
                      className="h-11"
                      maxLength={50}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Display intent name</span>
                      <span>{formData?.name?.length}/50</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {!isView && (
                  <div className="flex gap-3 pt-4">

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={loading}
                      className="flex-1 gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || !hasChanges()}
                      className="flex-1 gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-4">


          {helpers.andCondition(!isAdd, <Card>
            <CardHeader>
              <CardTitle>Intent Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={circle?.status === 'active' ? 'default' : 'secondary'}>
                  {circle?.status?.charAt(0)?.toUpperCase() + circle?.status?.slice(1)}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{showFormattedDate(circle?.createdAt)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{showFormattedDate(circle?.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>)}

          {helpers.andCondition(!isView, <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Image Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>JPEG, PNG, or WebP format</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Maximum file size: 5MB</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Minimum: 100x100 pixels</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Maximum: 2048x2048 pixels</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Square images work best</span>
                </div>
              </div>
            </CardContent>
          </Card>)}


        </div>
      </div>
    </div>
  );
}