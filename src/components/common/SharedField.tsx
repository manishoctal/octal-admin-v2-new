// components/FormField.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type FieldType = "text" | "email" | "password" | "textarea" | "select" | "checkbox" | "radio";

interface FormFieldProps {
    id: string;
    label: string;
    name: string,
    type: FieldType;
    placeholder?: string;
    options?: { label: string; value: string }[]; // for select or radio
    registration: UseFormRegisterReturn;
    error?: FieldError;
    disabled?: boolean;
    required?: boolean;
    icon?: React.ReactNode;
}

const FormField = ({
    id,
    label,
    type,
    placeholder,
    options = [],
    registration,
    error,
    disabled,
    required,
    name,
    icon,...rest
}: FormFieldProps) => {



    const [showPassword, setShowPassword] = useState(false);
    const renderInput = () => {
        const baseClasses = `${icon ? "pl-10" : ""} ${error?.[name] ? "border-destructive focus-visible:ring-destructive/20" : ""}`;


        switch (type) {
            case "textarea":
                return (
                    <Textarea
                        id={id}
                        placeholder={placeholder}
                        name={name}
                        disabled={disabled}
                        className={baseClasses}
                        {...registration}
                    />
                );
            case "select":
                return (
                    <select
                        id={id}
                        name={name}
                        disabled={disabled}
                        className={`w-full border rounded px-3 py-2 ${baseClasses}`}
                        {...registration}
                    >
                        <option value="">Select {label}</option>
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );
            case "checkbox":
                return (
                    <div className="flex items-center space-x-2">
                        <Checkbox id={id} name={name} disabled={disabled} {...registration} {...rest} />
                        <Label htmlFor={id}>{label}{required && "*"}</Label>
                    </div>
                );
            case "radio":
                return (
                    <div className="space-y-2">
                        <Label>{label}{required && "*"}</Label>
                        <RadioGroup {...registration} name={name}>
                            {options.map((opt) => (
                                <div className="flex items-center space-x-2" key={opt.value}>
                                    <RadioGroupItem value={opt.value} id={`${id}-${opt.value}`} />
                                    <Label htmlFor={`${id}-${opt.value}`}>{opt.label}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                );
            case 'password':
                return (
                    <div className="relative">
                        {icon && (
                            <span className="">
                                {icon}
                            </span>
                        )}
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            id={id}
                            name={name}
                            placeholder={placeholder}
                            autoComplete={id}
                            disabled={disabled}
                            className={baseClasses}
                            {...registration}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                );

            default:
                return (
                    <div className="relative">
                        {icon && (
                            <span className="">
                                {icon}
                            </span>
                        )}
                        <Input
                            id={id}
                            name={name}
                            type={type}
                            placeholder={placeholder}
                            autoComplete={id}
                            disabled={disabled}
                            className={`${baseClasses}`}
                            {...registration}
                        />
                    </div>
                );
        }
    };

    return type === "checkbox" ? (
        <div className="space-y-1">{renderInput()}</div>
    ) : (
        <div className="space-y-2">
            {type !== "radio" && type !== "checkbox" && (
                <Label htmlFor={id}>
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </Label>
            )}
            {renderInput()}
            {error?.[name] && <p className="text-sm text-destructive">{error?.[name]?.message}</p>}
        </div>
    );
};

export default FormField
