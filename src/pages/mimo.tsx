import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import mimoLogo from '../assets/mimoLogo.png';
import keychain1 from "../assets/keychain1.jpg";
import keychain2 from "../assets/keychain2.jpg";
import keychain3 from "../assets/keychain3.jpg";

const Mimo: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const collections = [
    { src: keychain2 , alt : "Keychain 2" },
    { src: keychain3, alt: "Keychain 3" },
    { src: keychain1, alt: "Keychain 1" },
  ];
  
  return ( 
     
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      {/* Navigation - Sticky */}
      <nav className="sticky top-0 z-50 flex items-center justify-between p-6 lg:px-12 bg-white/80 backdrop-blur-md border-b border-white/30 shadow-sm">
        <div className="font-bold text-2xl text-gray-900 tracking-wider
        ">
          MINI MOOD
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-10 text-gray-800">
          <a href='' className="hover:text-gray-900 transition-colors font-semibold text-lg">
            Home
          </a>
          <a href='catalog' className="hover:text-gray-900 transition-colors font-semibold text-lg">
            Catalog
          </a>
          <a href='about' className="hover:text-gray-900 transition-colors font-semibold text-lg">
            About
          </a>
          <a href='contact' className="hover:text-gray-900 transition-colors font-semibold text-lg">
            Contact
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-3 text-gray-800 bg-white/20 rounded-lg backdrop-blur-sm"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm p-6 md:hidden z-50 border-b border-white/30">
            <div className="flex flex-col space-y-4">
              <a href='home' className="text-gray-800 hover:text-gray-900 font-semibold text-left py-2 px-4 rounded-lg hover:bg-white/30 transition-colors">
                Home
              </a>
              <a href='catalog' className="text-gray-800 hover:text-gray-900 font-semibold text-left py-2 px-4 rounded-lg hover:bg-white/30 transition-colors">
                Catalog
              </a>
              <a href='about' className="text-gray-800 hover:text-gray-900 font-semibold text-left py-2 px-4 rounded-lg hover:bg-white/30 transition-colors">
                About
              </a>
              <a href='contact' className="text-gray-800 hover:text-gray-900 font-semibold text-left py-2 px-4 rounded-lg hover:bg-white/30 transition-colors">
                Contact
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <section id='home'>
        <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
          {/* Left Content */}
          <div className="space-y-8 lg:space-y-12 mt-4">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6x2 text-center font-black text-gray-900 leading-tight tracking-tight mb-4">
                MINI MOOOOOOOD
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 font-medium tracking-wide text-center">
                custom keychain
              </p>
            </div>
          </div>

          {/* Right Content - Miffy Character */}
          <div className="flex justify-center lg:justify-end items-center">
            <div className="relative">
              {/* Main Miffy Character */}
              <div className="w-80 h-60 lg:w-60 lg:h-80x flex items-center justify-center">
                 <img src={mimoLogo} alt="Deskripsi gambar" className="w-full object-cover h-78 " />
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-200/50 rounded-full animate-bounce delay-100"></div>
              <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-pink-200/50 rounded-full animate-bounce delay-300"></div>
              <div className="absolute top-1/4 -left-8 w-4 h-4 bg-purple-200/50 rounded-full animate-bounce delay-500"></div>
            </div>
          </div>
        </div>
      </div>

        <div className="bg-white text-center font-sans">
      {/* OUR COLLECTION */}
      <section className="py-10">
        <h2 className="text-2xl font-bold mb-1">Galeri Atmin</h2>
        <p className="text-gray-600 italic mb-6">Start from 5k !!!</p>

        <div className="bg-blue-100 rounded-xl max-w-5xl mx-auto p-6 flex flex-col md:flex-row gap-6 justify-center">
          {collections.map((item, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-60 object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>

      {/* OUR PHILOSOPHY */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold mb-4">PESAN ATMIN</h2>
        <p className="text-gray-700 leading-relaxed">
         Kita percaya tiap momen tuh punya ceritanya sendiri. 
         Mini Mood ada buat ngabadin cerita itu jadi gantungan kunci akrilik yang cute,
         aesthetic, dan totally personal. Dari foto favorit sampe detail kecilnya, 
         semua dibuat biar kamu bisa bawa kenangan seru ke mana pun kamu pergi.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold">MM</span>
            <span className="text-gray-300">MINIMOOD</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">Kenangan Dalam Genggaman</p>
          <div className="flex gap-4 text-gray-400 text-2xl">
          <FaInstagram className="cursor-pointer hover:text-pink-500 transition" />
          <FaWhatsapp className="cursor-pointer hover:text-black transition" />
          </div>
        </div>
      </footer>
    </div>
      </section> 
    </div>
  );
};

export default Mimo;