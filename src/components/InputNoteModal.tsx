import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { X, Check } from 'lucide-react';

interface InputNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (note: string) => Promise<void>; // async save function
    loading: boolean;
    title: string;
    initialNote?: string;
}

interface FormValues {
    note: string;
}

const InputNoteModal: React.FC<InputNoteModalProps> = ({
    isOpen,
    onClose,
    onSave,
    loading,
    title,
    initialNote = '',
}) => {
    const { control, handleSubmit, formState } = useForm<FormValues>({
        values: { note: initialNote },
        mode: 'onChange',
    });

    if (!isOpen) return null;

    const onSubmit = async (data: FormValues) => {
        await onSave(data.note);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/60">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                    <label className="block text-gray-700 mb-2 text-start">Catatan Tambahan</label>
                    <Controller
                        name="note"
                        control={control}
                        render={({ field }) => (
                            <>
                                    <input
                                        type="text"
                                        {...field}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                                            : 'border-gray-300 focus:ring-orange-500'
                                            } mb-1`}
                                    />
                            </>
                        )}
                    />

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formState.isValid}
                            className="flex items-center gap-2 px-4 py-2 text-white rounded-md text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 bg-[#E77D35]"
                        >
                            {loading && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            )}
                            {loading ? 'Menyimpan...' : <><Check size={16} /> Simpan</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InputNoteModal;
