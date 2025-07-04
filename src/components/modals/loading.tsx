import { toast as sonnerToast } from 'sonner';

type ToastProps = {
    title: string;
    id: string;
}

export function loadingModal(toast: Omit<ToastProps, 'id'>) {
    return sonnerToast.custom((id: string) => (
        <Toast title={toast.title} id={id} />
    ), {
        duration: Infinity, // Keep loading toast until manually dismissed
    });
}

// Helper to dismiss the loading toast
export function dismissLoading(toastId: string | number) {
    sonnerToast.dismiss(toastId);
}

// Error toast
export function error(title: string) {
    return sonnerToast.custom((id: string) => (
        <Toast title={title} id={id} variant="error" />
    ), {
        duration: 5000,
    });
}

type ToastVariant = 'loading' | 'error';

function Toast({ title, id, variant = 'loading' }: ToastProps & { variant?: ToastVariant }) {
    const getStyles = () => {
        switch (variant) {
            case 'error':
                return 'bg-red-50 ring-red-200 text-red-800';
            default:
                return 'bg-white ring-black/5 text-gray-900';
        }
    };

    return (
        <div className={`flex rounded-lg shadow-lg ring-1 w-full md:max-w-[364px] items-center p-4 ${getStyles()}`}>
            {variant === 'loading' && (
                <div className="mr-3">
                    <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                </div>
            )}
            <p className="text-sm font-medium">{title}</p>
        </div>
    );
}