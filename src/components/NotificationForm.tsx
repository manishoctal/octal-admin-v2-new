import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import {
    Send,
    AlertCircle,
    Users,
    User,
    X,
    CheckCircle,
    Loader2
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { apiPost } from '@/utils/apiFetch';
import apiPath from '@/utils/apiPath';
import { ErrorToastMessage, SuccessToastMessage } from './common/sonner';
import helpers from '@/utils/helpers';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface NotificationFormProps {
    onSubmit: (data: NotificationFormData) => void;
    onCancel: () => void;
    loadNotifications: () => void;
    users: User[];
}

interface NotificationFormData {
    title: string;
    message: string;
    sendTo: 'all' | 'specific';
    specificUsers?: string[];
}


export function NotificationForm({ loadNotifications, onCancel, users }: NotificationFormProps) {
    const [formData, setFormData] = useState<NotificationFormData>({
        title: '',
        message: '',
        sendTo: 'all',
        specificUsers: []
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedUserSearch, setSelectedUserSearch] = useState('');

    // Character limits
    const TITLE_MAX_LENGTH = 200;
    const MESSAGE_MAX_LENGTH = 350;

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData?.title?.trim()) {
            newErrors.title = 'Title is required.';
        } else if (formData?.title?.trim()?.length > TITLE_MAX_LENGTH) {
            newErrors.title = `Title must be less than ${TITLE_MAX_LENGTH} characters.`;
        }

        const doc = new DOMParser().parseFromString(formData?.message, "text/html");
        const text = doc?.body?.textContent || "";
        if (!text?.trim()) {
            newErrors.message = 'Description is required.';
        } else if (text?.trim()?.length > MESSAGE_MAX_LENGTH) {
            newErrors.message = `Description must be less than ${MESSAGE_MAX_LENGTH} characters.`;
        }

        if (formData?.sendTo === 'specific' && (!formData?.specificUsers || formData?.specificUsers?.length === 0)) {
            newErrors.specificUsers = 'Please select at least one user.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors)?.length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                title: formData?.title,
                description: formData?.message,
                sendTo: helpers.ternaryCondition(formData?.sendTo == 'all', 'user', 'specifiedUser'),
                ...(helpers.ternaryCondition(formData?.sendTo == 'all', [], { users: formData?.specificUsers }))
            }

            const resp = await apiPost(apiPath.getNotifications + '/send-notification', payload);
            if (resp?.data?.success) {
                SuccessToastMessage({ message: resp?.data?.message })
                loadNotifications()
                onCancel()
                return
            }
            ErrorToastMessage({ message: resp?.data?.message || 'Failed to send notification' });

        } catch (error) {
            ErrorToastMessage({ message: error?.response?.data?.message || 'Failed to send notification' });
        } finally {
            setIsSubmitting(false);
        }
    };



    const handleSendToChange = (value: 'all' | 'specific') => {
        console.log('value', formData)

        setFormData(prev => ({
            ...prev,
            sendTo: value,
            specificUsers: value === 'all' ? [] : prev?.specificUsers
        }));
        if (errors?.specificUsers) {
            setErrors(prev => ({ ...prev, specificUsers: '' }));
        }
    };

    const handleUserSelect = (userId: string) => {
        const isSelected = formData?.specificUsers?.includes(userId);

        if (isSelected) {
            setFormData(prev => ({
                ...prev,
                specificUsers: prev?.specificUsers?.filter(id => id !== userId) || []
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                specificUsers: [...(prev?.specificUsers || []), userId]
            }));
        }

        if (errors.specificUsers) {
            setErrors(prev => ({ ...prev, specificUsers: '' }));
        }
    };

    const removeUser = (userId: string) => {
        setFormData(prev => ({
            ...prev,
            specificUsers: prev?.specificUsers?.filter(id => id !== userId) || []
        }));
    };

    const getSelectedUsers = () => {
        return users?.filter(user => formData?.specificUsers?.includes(user?._id)) || [];
    };

    const getFilteredUsers = () => {
        if (!selectedUserSearch) return users;
        console.log('users', users)
        return users?.filter(user =>
            user?.name?.toLowerCase()?.includes(selectedUserSearch?.toLowerCase()) ||
            user?.email?.toLowerCase()?.includes(selectedUserSearch?.toLowerCase())
        );
    };

    // Get plain text length for character counting
    const getMessageLength = (message) => {
        const div = document.createElement('div');
        div.innerHTML = message;
        return div.textContent?.length || 0;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                    Title<span className='text-red-500'>*</span>
                </Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                        setFormData(prev => ({ ...prev, title: e?.target?.value }));
                        if (errors?.title) {
                            setErrors(prev => ({ ...prev, title: '' }));
                        }
                    }}
                    placeholder="Enter Notification Title"
                    maxLength={TITLE_MAX_LENGTH}
                    className={errors?.title ? 'border-destructive' : ''}
                />
                <div className="flex justify-between text-xs">
                    {errors?.title && (
                        <span className="text-destructive flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors?.title}
                        </span>
                    )}
                    <span className={`ml-auto ${formData?.title?.length > TITLE_MAX_LENGTH * 0.9 ? 'text-destructive' : 'text-muted-foreground'
                        }`}>
                        {formData?.title?.length}/{TITLE_MAX_LENGTH}
                    </span>
                </div>
            </div>

            {/* Send To Selection */}
            <div className="space-y-4">
                <Label className="text-sm font-medium">Send To<span className='text-red-500'>*</span></Label>

                <div className="grid grid-cols-1 gap-4">

                    <div className={`p-4 border rounded-lg cursor-pointer transition-colors ${formData.sendTo === 'all'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleSendToChange('all')}
                    >
                        <div className="flex items-center space-x-3">
                            <input type='checkbox'
                                className="
                                w-5 h-5 rounded appearance-none cursor-pointer
                                border relative
                                bg-white border-gray-400
                                dark:bg-gray-900 dark:border-gray-500
                            
                                checked:bg-black checked:border-black
                                dark:checked:bg-white dark:checked:border-white
                            
                                after:hidden
                                after:content-['✓']
                                after:absolute after:inset-0
                                after:flex after:items-center after:justify-center
                                after:text-sm after:font-bold
                            after:left-1
                                checked:[&:after]:block
                                after:text-white
                                dark:checked:after:text-black
                              "
                                checked={formData?.sendTo == 'all'}
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span className="font-medium">All Users</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Send notification to all registered users
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Specific Users Option */}
                    <div className={`p-4 border rounded-lg cursor-pointer transition-colors ${formData.sendTo === 'specific'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                        }`} onClick={() => handleSendToChange('specific')}>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <input type='checkbox'
                                    className="
                                    w-5 h-5 rounded appearance-none cursor-pointer
                                    border relative
                                    bg-white border-gray-400
                                    dark:bg-gray-900 dark:border-gray-500
                                    checked:bg-black checked:border-black
                                    dark:checked:bg-white dark:checked:border-white
                                    after:hidden
                                    after:content-['✓']
                                    after:absolute after:inset-0
                                    after:flex after:items-center after:justify-center
                                    after:text-sm after:font-bold
                                    after:left-1
                                    checked:[&:after]:block
                                    after:text-white
                                    dark:checked:after:text-black
                                  "
                                    checked={formData?.sendTo == 'specific'}

                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span className="font-medium">Specific Users</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Select individual users to receive the notification
                                    </p>
                                </div>
                            </div>

                            {formData?.sendTo === 'specific' && (
                                <div className="ml-7 space-y-3">
                                    <Input
                                        placeholder="Search users by name or email..."
                                        value={selectedUserSearch}
                                        onChange={(e) => setSelectedUserSearch(e?.target?.value)}
                                        className='bg-white '
                                    />

                                    {getSelectedUsers()?.length > 0 && (
                                        <div>
                                            <p className="text-sm font-medium mb-2">Selected Users ({getSelectedUsers()?.length})</p>
                                            <div className="flex flex-wrap gap-2 ">
                                                {getSelectedUsers()?.map(user => (
                                                    <Badge key={user?._id} variant="secondary" className="gap-1 bg-white dark:bg-black cursor-default">
                                                        {helpers.capitalizeFirstWord(user?.name)}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeUser(user?._id)}
                                                            className="ml-1 hover:text-destructive cursor-pointer"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="max-h-40 overflow-y-auto border border-white rounded-lg bg-white dark:bg-black">
                                        {getFilteredUsers()?.map(user => (
                                            <div
                                                key={user?._id}
                                                className={`p-2 flex items-center justify-between hover:bg-muted cursor-pointer border-b sm:border-b-0 ${formData.specificUsers?.includes(user?._id) ? 'bg-primary/5' : ''
                                                    }`}
                                                onClick={() => handleUserSelect(user?._id)}
                                            >
                                                <div>
                                                    <p className="text-sm font-medium">{helpers.capitalizeFirstWord(user?.name)}</p>
                                                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                                                </div>
                                                {formData?.specificUsers?.includes(user?._id) && (
                                                    <CheckCircle className="w-4 h-4 text-primary" />
                                                )}
                                            </div>
                                        ))}
                                        {getFilteredUsers()?.length === 0 && (
                                            <div className="p-4 text-center text-muted-foreground">
                                                <p className="text-sm">No users found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {errors.specificUsers && (
                    <div className="text-destructive text-sm flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.specificUsers}
                    </div>
                )}
            </div>

            {/* Message Field */}
            <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">
                    Notification Description <span className='text-red-500'>*</span>
                </Label>
                <div className="border rounded-lg overflow-hidden "> 
                    <ReactQuill
                        value={formData?.message}
                        onChange={(value) => {
                            setFormData(prev => ({ ...prev, message: value }));
                            if (errors?.message) {
                                setErrors(prev => ({ ...prev, message: '' }));
                            }
                        }}

                        modules={{
                            toolbar: [
                                [{ header: '1' }, { header: '2' }, { font: [] }],
                                [{ size: [] }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [
                                    { list: 'ordered' },
                                    { list: 'bullet' },
                                    { indent: '-1' },
                                    { indent: '+1' },
                                ],
                                ['link'],
                                ['clean'],
                            ],
                        }}
                        theme="snow"
                        placeholder="Enter Notification Description..."

                        className='overflow-hidden bg-white dark:bg-black my-quill'
                    />

                </div>
                <div className="flex justify-between text-xs">
                    {errors?.message && (
                        <span className="text-destructive flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors?.message}
                        </span>
                    )}
                    <span className={`ml-auto ${getMessageLength(formData?.message) > MESSAGE_MAX_LENGTH * 0.9 ? 'text-destructive' : 'text-muted-foreground'
                        }`}>
                        {getMessageLength(formData?.message)}/{MESSAGE_MAX_LENGTH}
                    </span>
                </div>
            </div>



            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            Send Notification
                        </>
                    )}
                </Button>
            </div>

            {/* Custom styles for React Quill */}
            <style jsx global>{`
        .ql-editor {
          min-height: 120px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14px;
          line-height: 1.6;
        }
        
        .ql-toolbar {
          border-top: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          border-radius: 0.5rem 0.5rem 0 0;
        }
        
        .ql-container {
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          border-radius: 0 0 0.5rem 0.5rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .dark .ql-toolbar {
          border-color: #374151;
          background-color: #1f2937;
          color: #f9fafb;
        }
        
        .dark .ql-container {
          border-color: #374151;
          background-color: #111827;
        }
        
        .dark .ql-editor {
          color: #f9fafb;
        }
        
        .dark .ql-snow .ql-stroke {
          stroke: #9ca3af;
        }
        
        .dark .ql-snow .ql-fill {
          fill: #9ca3af;
        }
        
        .dark .ql-snow .ql-picker-label {
          color: #f9fafb;
        }
        
        .dark .ql-snow .ql-picker-options {
          background-color: #1f2937;
          border-color: #374151;
        }
      `}</style>
        </form>
    );
}