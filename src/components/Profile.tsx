import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage } from './ui/avatar';
import {
    ArrowLeft,
    Camera,
    Upload,
    X,
    CheckCircle,
    AlertCircle,
    Loader2,
    User,
    Shield,
    Calendar,
    Edit,
    Save,
    RotateCcw,
    UserRound
} from 'lucide-react';
import { useAuth } from './AuthContext';

import { useNavigate } from 'react-router-dom';
import apiPath from '@/utils/apiPath';
import { apiPost } from '@/utils/apiFetch';
import axios from 'axios';
import helpers from '@/utils/helpers';
import { showFormattedDate } from './common/showFormattedDate'
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

export function Profile() {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [key, setKey] = useState("");
    const [url, setURL] = useState("");
    const [formData, setFormData] = useState<ProfileFormData>({
        name: user?.fullName || '',
        email: user?.email || '',
        avatar: user?.profilePic || ''
    });


    const [originalData] = useState<ProfileFormData>({
        name: user?.fullName || '',
        email: user?.email || '',
        avatar: user?.profilePic || ''
    });


    useEffect(() => {
        setFormData({
            name: user?.fullName || '',
            email: user?.email || '',
            avatar: user?.profilePic || ''
        })
    }, [user])

    const fileInputRef = useRef<HTMLInputElement>(null);

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
                    folder: "admin",
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

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

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

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files?.[0]) {
            handleImageUpload(files[0]);
        }
    }, []);


    // Handle form submission
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
            setLoading(true);

            const imageReader = new FileReader();
            if (file) {

                imageReader.readAsArrayBuffer(file);
                imageReader.onloadend = async () => {
                    const binaryData = imageReader.result;
                    const contentType = file?.type;
                    const resp = await axios.put(url, binaryData, {
                        headers: {
                            "Content-Type": contentType ? contentType : "application/octet-stream",
                        },
                    });
                    if (resp?.status === 200) {
                        updateUser({ fullName: formData?.name, profilePic: key });
                        setURL('')
                        setKey('')
                        setFile('')
                        setIsEditing(false)
                    }
                };
                return
            }
            updateUser({ fullName: formData?.name, profilePic: undefined });
            setIsEditing(false)
            setURL('')
            setKey('')
            setFile('')

        } catch (error) {
            setError(error?.response?.data?.message || 'Failed to update profile. Please try again.');

        } finally {
            setLoading(false);
        }
    };


    // Handle cancel editing
    const handleCancel = () => {
        setFormData(originalData);
        setIsEditing(false);
        setError('');
        setFile('')
    };

    // Remove avatar
    const handleRemoveAvatar = () => {
        setFormData(prev => ({ ...prev, avatar: '' }));
        setFile('')
    };



    // Check if form has changes
    const hasChanges = () => {
        return (
            formData.avatar!==''&&(formData.name !== originalData.name ||formData.avatar !== originalData.avatar)
        );
    };



    return (
        <div className="p-4 lg:p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => { navigate(-1) }}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold">My Profile</h2>
                    <p className="text-muted-foreground">Manage your personal information and profile settings</p>
                </div>
                {!isEditing && (
                    <PermissionGate module={MODULES.PROFILE} action={ACTIONS.EDIT}>
                        <Button onClick={() => setIsEditing(true)} className="gap-2">
                            <Edit className="w-4 h-4" />
                            Edit Profile
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
                                <User className="w-5 h-5" />
                                Profile Information
                            </CardTitle>
                            <CardDescription>
                                {isEditing
                                    ? 'Update your profile information below'
                                    : 'Your current profile information'
                                }
                            </CardDescription>
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
                                <div className="space-y-4 mt-2 ">
                                    <Label>Profile Image<span className='text-red-500'>*</span></Label>
                                    <div className="flex items-start gap-4">
                                        <div className="relative">
                                            <Avatar className="w-20 h-20">
                                                {formData?.avatar ? (
                                                    <AvatarImage src={formData?.avatar} alt={formData?.name} />
                                                ) : (
                                                    <span className="bg-muted flex size-full items-center justify-center rounded-full text-lg"><UserRound className='h-12 w-8'/></span>
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

                                    {!isEditing && formData.avatar && (
                                        <p className="text-sm text-muted-foreground">
                                            Profile image set • Click "Edit Profile" to change
                                        </p>
                                    )}
                                </div>

                                {/* Name Field */}

                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name<span className='text-red-500'>*</span></Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Enter Full Name"
                                            value={formData?.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e?.target?.value }))}
                                            disabled={!isEditing || loading}
                                            className="h-11"
                                            maxLength={50}
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Your display name</span>
                                            <span>{formData?.name?.length}/50</span>
                                        </div>
                                    </div>

                                    {/* Email Field (Read-only) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="h-11 bg-muted"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Email cannot be changed.
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {isEditing && (
                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancel}
                                            disabled={loading}
                                            className="flex-1 gap-2"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Cancel
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
                    {/* Account Information */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Account Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Role</span>
                                    <Badge variant="outline">{helpers.capitalizeFirstWord(user?.role)}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge variant="default">{helpers.capitalizeFirstWord(user?.status)}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Member Since</span>
                                    <span className="font-medium">
                                        {showFormattedDate(user?.createdAt)}

                                    </span>
                                </div>
                                {user?.updatedAt && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Last Updated</span>
                                        <span className="font-medium">
                                            {showFormattedDate(user?.updatedAt)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Image Requirements */}
                    <Card>
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
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-start gap-2"
                                onClick={() => navigate('/change-password')}
                            >
                                <Shield className="w-4 h-4" />
                                Change Password
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-start gap-2"
                                onClick={() => navigate('/settings')}
                            >
                                <Calendar className="w-4 h-4" />
                                Account Settings
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}