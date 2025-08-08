import { toast as sonnerToast } from 'sonner';
import { toast as dismissToast } from 'sonner';

type ToastProps = {
    title: string,
    id: string,
}

export function dismissTextModal(toast: Omit<ToastProps, 'id'>) {
    return sonnerToast.custom((id: string) => (
        <Toast title={toast.title} id={id} />
    ));
}

function Toast({ title, id }: ToastProps) {   
    return (
        <div className="flex rounded-lg bg-white shadow-lg ring-1 ring-black/5 w-full md:max-w-[364px] items-center p-4">
            <div className="flex flex-1 items-center">
                <div className="w-full">
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                    <button
                        className="text-sm py-1 px-2 mt-2 bg-[#303030] text-white-500 hover:text-black rounded-sm"
                        onClick={() => dismissToast.dismiss(id)}
                    >
                    Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}