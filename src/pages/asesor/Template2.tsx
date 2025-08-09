import React, { useState } from 'react';
import { ChevronLeft, FileText } from 'lucide-react';
import NavbarAsesi from '../../components/NavbarAsesi';
import { Link } from 'react-router-dom';

export default function Template2() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <NavbarAsesi title='Permohonan Sertifikasi Kompetensi' icon={<FileText size={20} />} />
        </div>

        <div className="space-y-8 px-4 sm:px-6 lg:px-8 xl:px-40 py-4 sm:py-8 ">
            {/* Konten Utama ada Disini */}
        </div>
      </div >
    </div >
  );
}