import  { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
    ArrowLeft,
    Save,
    AlertCircle,
    CheckCircle,
    Loader2,
    Shield,
    NotepadText,
} from "lucide-react";
import { toast } from "sonner";
import {
    usePermissions,
    MODULES,
    ACTIONS,
    PermissionGate,
} from "./PermissionContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "./TranslationContext";
import TextEditor from "./common/TextEditor";
import { useForm } from "react-hook-form";
import { apiPost } from "@/utils/apiFetch";
import apiPath from "@/utils/apiPath";
import { showFormattedDate } from "./common/showFormattedDate";
import helpers from "@/utils/helpers";
import { ErrorToastMessage, SuccessToastMessage } from "./common/sonner";


interface EmailTemplate {
    id: string;
    name: string;
    metaKeyword: string;
    metaTitle: string;
    metaDescription: string;
    content: string;
    type: "transactional" | "marketing" | "system";
    status: "active" | "draft" | "archived";
    variables: string[];
    lastModified: string;
    modifiedBy: string;
    version: number;
}

interface TemplateVariable {
    name: string;
    description: string;
    example: string;
    required: boolean;
}



type FormValues = {
    title: string;
    subject: string;
};
export function StaticContentEditor() {
    const navigate = useNavigate();
    const location = useLocation();
    const editItem = location?.state
    let currentPath = location?.pathname
    let type = currentPath == '/static-content/view'
    const { hasPermission } = usePermissions();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [template, setTemplate] =
        useState<EmailTemplate>();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const { t } = useTranslation()
    // Permission checks
    const canEdit = hasPermission(
        MODULES.STATIC_CONTENT,
        ACTIONS.EDIT,
    );

    console.log('editItem',editItem)





    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormValues>({
        mode: 'onChange',
        shouldFocusError: true,
    });

    // Get template ID from URL (in a real app, this would come from router params)

    useEffect(() => {
        const loadTemplate = async () => {
            try {
                setLoading(true);
                await new Promise((resolve) =>
                    setTimeout(resolve, 800),
                );
                setTemplate({
                    ...editItem,
                    name: editItem?.title,
                });

            } catch (error) {
                console.warn('error',error)
                setError("Failed to load template");
                toast.error("Failed to load template");
            } finally {
                setLoading(false);
            }
        };


        if(editItem){
            loadTemplate();
        }else{
            navigate('/static-content')
        }
        
    }, [editItem]);




    if (!canEdit&&!type) {
        return (
            <div className="p-4 lg:p-6 flex flex-col items-center justify-center min-h-[400px]">
                <Shield className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">{t('ACCESS_DENIED')}</h2>
                <p className="text-muted-foreground text-center">
                    {t('YOU_DONT_HAVE_PERMISSION')} {t('STATIC_CONTENT')?.toLowerCase()}.
                </p>
            </div>
        );
    }




    const handleSave = async (e) => {

        if (!template?.metaTitle?.trim()||!template?.metaKeyword?.trim()||!template?.metaDescription?.trim()) {
            setError(
                "Meta title, description and keyword are required.",
            );
            return;
        }

        setSaving(true);
        setError("");

        try {
            const resp =await apiPost(apiPath?.getStaticContent + '/update/' + editItem?._id, { content: e?.description, metaTitle: template?.metaTitle?.trim(), metaKeyword: template?.metaKeyword?.trim(),metaDescription: template?.metaDescription?.trim(), })
            if (resp?.data?.success) {
                SuccessToastMessage({ message: resp?.data?.message })
                setSuccess(true);
              
                // Auto redirect after success
                setTimeout(() => {
                    navigate("/static-content");
                }, 2000);

            }
        } catch (error) {
            setError(error?.response?.data?.message);
            ErrorToastMessage({message:error?.response?.data?.message})
        } finally {
            setSaving(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="bg-gray-900 text-white">
                    <div className="container-fluid mx-auto px-4 py-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(-1)}
                                className="bg-white text-gray-900 hover:bg-gray-100"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <h1 className="text-xl font-medium">
                                Edit an Static Content
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Loading Content */}



                <div className="flex flex-col lg:flex-row gap-6 p-6 w-full">
                    {/* Main Section */}
                    <div className="flex-1 space-y-6">
                        {/* Header Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="h-10 bg-muted rounded animate-pulse" />
                            <div className="h-10 bg-muted rounded animate-pulse" />
                        </div>

                        {/* Rich Text Area */}
                        <div className="h-[300px] bg-muted rounded animate-pulse" />
                        <div className="h-[300px] bg-muted rounded animate-pulse" />
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-[300px] space-y-6">
                        {/* Available Variables */}
                        <div className="space-y-2">
                            <div className="h-6 w-2/3 bg-muted rounded animate-pulse" />
                            {[...new Array(5)].map((_, i) => (
                                <div key={i} className="h-10 bg-muted rounded animate-pulse" />
                            ))}
                        </div>

                        {/* Template Info Card */}
                        <div className="space-y-2 p-4 border rounded bg-background">
                            <div className="h-5 w-1/2 bg-muted rounded animate-pulse" />
                            {[...new Array(4)].map((_, i) => (
                                <div key={i} className="h-4 w-full bg-muted rounded animate-pulse" />
                            ))}
                        </div>

                    </div>
                </div>



            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gray-900 text-white">
                <div className="container-fluid mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(-1)}
                                className="bg-white text-gray-900 hover:bg-gray-100"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <div>
                                <h1 className="text-xl font-medium">
                                Edit an Static Content
                                </h1>
                                <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                                    <button
                                        onClick={() => navigate("/static-content")}
                                        className="hover:text-white transition-colors cursor-pointer"
                                    >
                                        Static Content
                                    </button>
                                    <span>/</span>
                                    <span>Edit Static Content</span>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-fluid mx-auto p-4 ">
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="mb-6 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                            Static content saved successfully! Redirecting to
                            static content list...
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Editor */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Template Details */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <Label
                                            htmlFor="templateName"
                                            className="text-sm font-medium"
                                        >
                                            Title<span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="templateName"
                                            disabled
                                            maxLength={200}
                                            value={template?.name}
                                            onChange={(e) =>
                                                setTemplate((prev) => ({
                                                    ...prev,
                                                    name: e.target.value,
                                                }))
                                            }
                                            className="mt-1"
                                            placeholder="Enter Title"
                                        />
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="subject"
                                            className="text-sm font-medium"
                                        >
                                            Meta Title<span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="subject"
                                            maxLength={500}
                                            disabled={type}
                                            value={template?.metaTitle}
                                            onChange={(e) =>
                                                setTemplate((prev) => ({
                                                    ...prev,
                                                    metaTitle: e.target.value,
                                                }))
                                            }
                                            className="mt-1"
                                            placeholder="Enter Meta Title"
                                        />
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="metaKeyword"
                                            className="text-sm font-medium"
                                        >
                                            Meta Keyword<span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="metaKeyword"
                                            maxLength={500}
                                            disabled={type}
                                            value={template?.metaKeyword}
                                            onChange={(e) =>
                                                setTemplate((prev) => ({
                                                    ...prev,
                                                    metaKeyword: e.target.value,
                                                }))
                                            }
                                            className="mt-1"
                                            placeholder="Enter Meta Keyword"
                                        />
                                    </div>


                                    <div>
                                        <Label
                                            htmlFor="metaDescription"
                                            className="text-sm font-medium"
                                        >
                                            Meta Description<span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="metaDescription"
                                            maxLength={500}
                                            disabled={type}
                                            value={template?.metaDescription}
                                            onChange={(e) =>
                                                setTemplate((prev) => ({
                                                    ...prev,
                                                    metaDescription: e.target.value,
                                                }))
                                            }
                                            className="mt-1"
                                            placeholder="Enter Meta Description"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Content Editor */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Content<span className="text-red-500">*</span>
                                </CardTitle>
                                <CardDescription>
                                    Use the rich text editor to compose your email
                                    content. Insert variables using the panel on
                                    the right.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>

                                <TextEditor
                                    name='description'
                                    controlField={control}
                                    defaultValue={editItem?.content}
                                    placeholder='Write something...'
                                    readOnly={type}
                                    errors={errors}
                                />

                            </CardContent>
                        </Card>

                        {/* Keywords/Variables Used */}

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Content Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Status:
                                    </span>
                                    <Badge
                                        variant={
                                            template?.status === "active"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {helpers.capitalizeFirstWord(template?.status)}
                                    </Badge>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Created At:
                                    </span>
                                    <span>
                                        {showFormattedDate(template?.createdAt)}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Updated At:
                                    </span>
                                    <span>
                                        {showFormattedDate(template?.updatedAt)}
                                    </span>
                                </div>

                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    {helpers.ternaryCondition(type,
                                     <PermissionGate module={MODULES.STATIC_CONTENT} action={ACTIONS.EDIT}>
                                        <Button
                                            type='button'
                                            className="w-full gap-2"
                                            onClick={() => { navigate(`/static-content/edit`, { state: editItem, replace: true }) }}
                                        >
                                            Edit
                                        </Button></PermissionGate>,
                                        <Button
                                            type='submit'
                                            onClick={handleSubmit(handleSave)}
                                            disabled={saving}
                                            className="w-full gap-2"
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    Save
                                                </>
                                            )}
                                        </Button>
                                    )}



                                    <Button
                                        variant="ghost"
                                        onClick={() => navigate("/static-content")}
                                        className="w-full gap-2"
                                    >
                                        <NotepadText className="w-4 h-4" />
                                        Back to Static Content
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

