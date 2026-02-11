import { useState } from 'react';

// Hook for handling form submissions with modals
export const useFormSubmission = () => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');
  const [statusTitle, setStatusTitle] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showSuccess = (title: string, message: string) => {
    setStatusType('success');
    setStatusTitle(title);
    setStatusMessage(message);
    setShowStatusModal(true);
  };

  const showError = (title: string, message: string) => {
    setStatusType('error');
    setStatusTitle(title);
    setStatusMessage(message);
    setShowStatusModal(true);
  };

  const handleSubmit = async (
    submitFunction: () => Promise<void>,
    successTitle: string = 'Berhasil!',
    successMessage: string = 'Data berhasil disimpan.',
    errorTitle: string = 'Gagal!',
    errorMessage: string = 'Terjadi kesalahan saat menyimpan data.'
  ) => {
    setIsSubmitting(true);
    try {
      await submitFunction();
      showSuccess(successTitle, successMessage);
    } catch {
      showError(errorTitle, errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    showSuccess,
    showError,
    handleSubmit,
    isSubmitting,
    showStatusModal,
    setShowStatusModal,
    showConfirmModal,
    setShowConfirmModal,
    statusType,
    statusTitle,
    statusMessage,
  };
};