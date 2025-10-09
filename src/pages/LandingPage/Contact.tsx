import React from "react";
import FootLanding from "../../components/FootLanding";
import NavLanding from "../../components/NavLanding";

const Contact: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavLanding />

      <main className="flex-grow bg-gray-50 py-10 px-4 sm:px-10">
        {/* Contact Info */}
        <div className="max-w-7xl mx-auto mb-10">
          <h2 className="text-2xl font-bold mb-4">Contact Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-gray-700">
            <div>
              <p className="text-gray-500">Address :Jl. Bambu Hitam Rt.3 Rw.1 <br />
                Kelurahan Bambu Apus Kecamatan Cipayung, Kota Jakarta Timur, <br />
                Daerah Khusus IbuKota Jakarta 13890.</p>              
            </div>
            <div>
              <p className="text-gray-500">Phone :(021) 8441976</p>
             
            </div>
            <div>
              <p className="text-gray-500">Email :smkn24jkt@gmail.com</p>
              
            </div>
            <div>
              <p className="text-gray-500">Website : <a
                  href="https://www.smkn24jkt.sch.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >https://www.smkn24jkt.sch.id
                </a></p>
              
            </div>
          </div>
        </div>

        {/* Map + Form */}
        <div className="mb-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Map */}
          <div className="w-full h-full">
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

          {/* Contact Form */}
          <form
            className="  rounded-lg  flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              // console.log("Form submitted");
            }}
          >
            <input
              type="text"
              placeholder="Nama"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Subcat"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <textarea
              placeholder="Catatan"
              rows={4}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
            ></textarea>
            <button
              type="submit"
              className="border border-orange-500 text-orange-500 px-6 py-2 rounded-md hover:bg-orange-500 hover:text-white transition"
            >
              Kirim
            </button>
          </form>
        </div>
      </main>

      <FootLanding />
    </div>
  );
};

export default Contact;
