import React from 'react';
import { Phone, MapPin, Clock, Mail, MessageSquare } from 'lucide-react';

const FootLanding = () => {
  return (
    <footer className="bg-[#E77D35] text-white px-4 sm:px-6 py-6 w-full">

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Kontak Admin */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              <h3 className="font-semibold text-sm sm:text-base md:text-lg">Kontak Admin</h3>
            </div>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm font-light">
              <div className="flex items-start gap-2">                
                <span className="break-all">Whatsapp: +62812-1234-5678</span>
              </div>
              <div className="flex items-start gap-2">                
                <span className="break-all">Email: lspsmkn24jkt@gmail.com</span>
              </div>
              <div className="flex items-start gap-2">                
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
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm font-light">
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
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm font-light">
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
                <div className="w-full h-80">
            <iframe
  title="Location Map"
 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3361.429257455506!2d106.89715947418402!3d-6.321756161858795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ed39f3a3c44d%3A0x83f2c08168c334bb!2sSMKN%2024%20Jakarta!5e1!3m2!1sid!2sid!4v1754964923691!5m2!1sid!2sid"
  height="100%"
  width="100%"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>

          </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FootLanding;