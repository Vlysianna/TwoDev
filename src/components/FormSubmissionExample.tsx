import { useState } from 'react';
import StatusModal from './StatusModal';
import ConfirmModal from './ConfirmModal';
import { useFormSubmission } from '@/hooks/useFormSubmission';

// Example component showing how to use the form submission hook
const ExampleFormComponent = () => {
  const {
    handleSubmit,
    isSubmitting,
    showStatusModal,
    setShowStatusModal,
    showConfirmModal,
    setShowConfirmModal,
    statusType,
    statusTitle,
    statusMessage,
  } = useFormSubmission();

  const [showConfirm, setShowConfirm] = useState(false);

  const submitData = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate random success/failure for demo
    if (Math.random() > 0.5) {
      throw new Error('Simulated error');
    }
  };

  const handleFormSubmit = () => {
    setShowConfirm(false);
    handleSubmit(
      submitData,
      'Data Berhasil Disimpan!',
      'Data formulir telah berhasil disimpan ke database.',
      'Gagal Menyimpan Data!',
      'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.'
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Contoh Form dengan Modal</h2>
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nama"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded"
        />
        
        <button
          onClick={() => setShowConfirm(true)}
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded text-white ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#E77D35] hover:bg-orange-600'
          }`}
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
        </button>
      </div>

      {/* Status Modal */}
      <StatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        type={statusType}
        title={statusTitle}
        message={statusMessage}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleFormSubmit}
        title="Konfirmasi Simpan Data"
        message="Apakah Anda yakin ingin menyimpan data ini?"
      />
    </div>
  );
};

export default ExampleFormComponent;