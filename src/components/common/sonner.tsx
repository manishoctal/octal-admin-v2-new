import { toast } from 'sonner';

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastProps {
  message?: string;
  description?: string;
  action?: ToastAction;
}

function ToastMessage({ message, description, action }: ToastProps): void {
  toast(message || 'Something went wrong', {
    description,
    action: action || {
      label: 'X',
      onClick: () => console.log('Undo'),
    },
    className: 'custom-toast',
  });
}

function SuccessToastMessage({ message, description, action }: ToastProps): void {
  toast(message || 'Operation successful', {
    description,
    action: action || {
      label: 'X',
      onClick: () => console.log('Undo'),
    },
    className: 'custom-toast-success',
  });
}

function ErrorToastMessage({ message, description, action }: ToastProps): void {
  toast(message || 'Something went wrong', {
    description,
    action: action || {
      label: 'X',
      onClick: () => console.log('Undo'),
    },
    className: 'custom-toast-error',
  });
}

function WarnToastMessage({ message, description, action }: ToastProps): void {
  toast(message || 'Warning', {
    description,
    action: action || {
      label: 'X',
      onClick: () => console.log('Undo'),
    },
    className: 'custom-toast-warn',
  });
}

export {
  ErrorToastMessage,
  SuccessToastMessage,
  ToastMessage,
  WarnToastMessage,
};
