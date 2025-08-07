import React from 'react';
import { Phone, MapPin, Clock, Mail, MessageSquare } from 'lucide-react';

const FootLanding = () => {
  return (
    <footer className="bg-orange-500 text-white px-4 sm:px-6 py-6 w-full">

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Kontak Admin */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              <h3 className="font-semibold text-sm sm:text-base md:text-lg">Kontak Admin</h3>
            </div>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                <span className="break-all">Whatsapp: +62812-1234-5678</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                <span className="break-all">Email: lspsmkn24jkt@gmail.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                <span>Instagram: @twodev.id</span>
              </div>
            </div>
          </div>

          {/* Lembaga Tertaut */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <h3 className="font-semibold text-sm sm:text-base md:text-lg">Lembaga Tertaut</h3>
            </div>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <div>Lembaga Sertifikasi Profesi</div>
              <div>SMK Negeri 24 Jakarta</div>
              <div>Badan Nasional Sertifikasi Profesi</div>
            </div>
          </div>

          {/* Alamat */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              <h3 className="font-semibold text-sm sm:text-base md:text-lg">Alamat</h3>
            </div>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <div>SMK Negeri 24 Jakarta</div>
              <div>Jalan Bambu Hitam, Bambu Apus</div>
              <div>Cipayung, RT.7 / RW.3</div>
            </div>
          </div>

          {/* Map */}
          <div className="md:col-span-2 lg:col-span-1 flex justify-start lg:justify-end">
            <div className="bg-white rounded-lg p-2 shadow-lg w-full max-w-[180px]">
              <div className="w-full aspect-video bg-gray-100 rounded flex items-center justify-center relative overflow-hidden">
                {/* Simplified map representation */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
                <div className="absolute top-2 left-2 w-1 h-1 bg-red-500 rounded-full"></div>
                <div className="absolute top-4 right-3 w-0.5 h-0.5 bg-red-400 rounded-full"></div>
                <div className="absolute bottom-3 left-4 w-0.5 h-0.5 bg-red-400 rounded-full"></div>
                <div className="absolute bottom-2 right-2 w-1 h-1 bg-red-500 rounded-full"></div>
                {/* Grid lines to simulate map */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-4 grid-rows-3 h-full w-full">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="border border-gray-300 border-opacity-30"></div>
                    ))}
                  </div>
                </div>
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 z-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FootLanding;