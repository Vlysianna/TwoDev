import React, { useState } from 'react';
import { ChevronLeft, FileText } from 'lucide-react';
import NavbarAsesor from '../../components/NavAsesor';

// Main Component
export default function Template2() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const questions = [
    {
      id: 1,
      question: "Apa kepanjangan dari OOP dalam pemrograman?",
      options: [
        { id: 'A', text: 'Object-Oriented Program' },
        { id: 'B', text: 'Object-Oriented Programming', correct: true },
        { id: 'C', text: 'Operational Oriented Programming' },
        { id: 'D', text: 'Object-Opsin Program' }
      ]
    },
    {
      id: 2,
      question: "Bahasa pemrograman manakah yang termasuk bahasa pemrograman berorientasi objek?",
      options: [
        { id: 'A', text: 'HTML' },
        { id: 'B', text: 'CSS' },
        { id: 'C', text: 'Java', correct: true },
        { id: 'D', text: 'SQL' }
      ]
    },
    {
      id: 3,
      question: "Fungsi utama dari database adalah...",
      options: [
        { id: 'A', text: 'Mengelola tampilan website', correct: true },
        { id: 'B', text: 'Menyimpan dan mengelola data' },
        { id: 'C', text: 'Mengelola koneksi server' },
        { id: 'D', text: 'Menyediakan program aplikasi' }
      ]
    },
    {
      id: 4,
      question: "Manakah dari bentuk yang termasuk version control system?",
      options: [
        { id: 'A', text: 'Git' },
        { id: 'B', text: 'SVN' },
        { id: 'C', text: 'Mercurial' },
        { id: 'D', text: 'Semua jawaban benar' }
      ]
    },
    {
      id: 5,
      question: "Apa kepanjangan dari OOP dalam pemrograman?",
      options: [
        { id: 'A', text: 'Object-Oriented Program' },
        { id: 'B', text: 'Object-Oriented Programming', correct: true },
        { id: 'C', text: 'Operational Oriented Programming' },
        { id: 'D', text: 'Object-Opsin Program' }
      ]
    },
    {
      id: 6,
      question: "Bahasa pemrograman manakah yang termasuk bahasa pemrograman berorientasi objek?",
      options: [
        { id: 'A', text: 'HTML' },
        { id: 'B', text: 'CSS' },
        { id: 'C', text: 'Java', correct: true },
        { id: 'D', text: 'SQL' }
      ]
    },
    {
      id: 7,
      question: "Fungsi utama dari database adalah...",
      options: [
        { id: 'A', text: 'Mengelola tampilan website', correct: true },
        { id: 'B', text: 'Menyimpan dan mengelola data' },
        { id: 'C', text: 'Mengelola koneksi server' },
        { id: 'D', text: 'Menyediakan program aplikasi' }
      ]
    },
    {
      id: 8,
      question: "Manakah dari bentuk yang termasuk version control system?",
      options: [
        { id: 'A', text: 'Git' },
        { id: 'B', text: 'SVN' },
        { id: 'C', text: 'Mercurial' },
        { id: 'D', text: 'Semua jawaban benar' }
      ]
    },
    {
      id: 10,
      question: "Apa kepanjangan dari OOP dalam pemrograman?",
      options: [
        { id: 'A', text: 'Object-Oriented Program' },
        { id: 'B', text: 'Object-Oriented Programming', correct: true },
        { id: 'C', text: 'Operational Oriented Programming' },
        { id: 'D', text: 'Object-Opsin Program' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-white">
          <NavbarAsesor title='Hasil asesmen' icon={<ChevronLeft size={20} />} />
        </div>
        
        <div className="space-y-8 px-4 sm:px-6 lg:px-8 xl:px-40 py-4 sm:py-8">

          {/* Header Section - White Box */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
              {/* Avatar Section */}
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-medium text-sm">A</span>
              </div>
              
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 flex-1">
                {/* User Info Section */}
                <div className="min-w-0 lg:min-w-[160px]">
                  <h2 className="font-medium text-gray-800 mb-1">Asesi</h2>
                  <p className="text-sm text-gray-500 truncate">asesi@gmail.com</p>
                </div>
                
                {/* Vertical Divider - Hidden on mobile */}
                <div className="hidden lg:block h-12 w-px bg-gray-200"></div>
                
                {/* Course Info Section */}
                <div className="flex-1 min-w-0">
                  {/* Mobile Layout - Stacked */}
                  <div className="lg:hidden">
                    <h1 className="text-lg font-semibold text-gray-800 mb-1">
                      Uji Kompetensi Sertifikat (USK)
                    </h1>
                    <div className="text-xs text-gray-400 mb-3">
                      Assessment awal : 10 / 10 Soal
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Completion</span>
                      <span className="text-sm font-medium text-orange-600">100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#E77D35] h-2 rounded-full w-full"></div>
                    </div>
                  </div>

                  {/* Desktop Layout - Original */}
                  <div className="hidden lg:block">
                    <div className="flex items-center justify-between mb-0">
                      <div>
                        <h1 className="text-lg font-semibold text-gray-800 mb-1">
                          Uji Kompetensi Sertifikat (USK)
                        </h1>
                        <div className="text-xs text-gray-400">
                          Assessment awal : 10 / 10 Soal
                        </div>
                      </div>
                      {/* Completion label di atas progress bar */}
                      <div className="flex justify-end mb-0 mr-34">
                        <span className="text-sm text-gray-500">Completion</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 mr-36">
                          <span className="text-sm font-medium text-orange-600">100%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mr-36">
                      <div className="w-1/2 bg-gray-200 rounded-full h-2">
                        <div className="bg-[#E77D35] h-3 rounded-full w-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Questions - Single Box */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="space-y-6 lg:space-y-8">
              {questions.map((question, index) => (
                <div key={question.id} className={`${index !== 0 ? 'pt-6 lg:pt-8 border-t border-gray-200' : ''}`}>
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-800 mb-2">Soal no.{question.id}</h3>
                    <p className="text-gray-700 leading-relaxed">{question.question}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {question.options.map((option: any) => {
                      const isSelected = selectedAnswers[question.id] === option.id;
                      const isCorrect = option.correct;
                      
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleAnswerSelect(question.id, option.id)}
                          className={`p-3 sm:p-4 rounded-lg border text-left transition-all text-sm sm:text-base ${
                            isCorrect 
                              ? 'bg-orange-50 border-orange-200 text-orange-700'
                              : isSelected
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span className="font-medium mr-2">{option.id}.</span>
                          <span className="break-words">{option.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}