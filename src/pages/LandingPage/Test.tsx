import Navbar from "../../components/NavAdmin"
import Sidebar from "../../components/SideAdmin"

function Test() {
    const beritaImages = [
    { src: '/bgsklh.png', alt: 'Berita 1' },
    { src: '/bgsklh.png', alt: 'Berita 2' },
    { src: '/bgsklh.png', alt: 'Berita 3' },
  ];
 return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed width dan fixed position */}
      <div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-0 md:ml-0">
        {/* Navbar - Sticky di atas */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <Navbar />
        </div>

        {/* Konten Utama */}
        <div className="p-6">
          <div className="">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci voluptates iste aliquam tenetur fugiat suscipit debitis porro quod quia! Dolor minus provident facilis, natus neque magni totam explicabo dicta ullam.</p>
          </div>
            <div className="mt-4">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci voluptates iste aliquam tenetur fugiat suscipit debitis porro quod quia! Dolor minus provident facilis, natus neque magni totam explicabo dicta ullam.</p>
            </div>
             <div className="mt-10">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci voluptates iste aliquam tenetur fugiat suscipit debitis porro quod quia! Dolor minus provident facilis, natus neque magni totam explicabo dicta ullam.</p>
            </div>
             <div className="mt-50">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci voluptates iste aliquam tenetur fugiat suscipit debitis porro quod quia! Dolor minus provident facilis, natus neque magni totam explicabo dicta ullam.</p>
            </div>
             <div className="mt-80">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci voluptates iste aliquam tenetur fugiat suscipit debitis porro quod quia! Dolor minus provident facilis, natus neque magni totam explicabo dicta ullam.</p>
            </div>
            <div className="mt-100">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci voluptates iste aliquam tenetur fugiat suscipit debitis porro quod quia! Dolor minus provident facilis, natus neque magni totam explicabo dicta ullam.</p>
            </div>

                    {/* Berita Terbaru */}
        <div className="py-16 px-4 bg-white">
          <h2 className="text-2xl font-bold text-center mb-10">Berita Terbaru LSP</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {beritaImages.map((item, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-xl shadow-md group"
              >
                <div className="aspect-[3/4] w-full">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-white to-transparent flex items-end justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <img
                    src="/twodev-teks.svg"
                    alt="Wodev"
                    className="h-6 w-auto mb-4 ml-4"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden animate-fade-in-up transform hover:-translate-y-2">
                <div className="card-1 h-48 flex items-center justify-center text-6xl relative overflow-hidden">
                    👨‍💻
            
                    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-white text-center p-4">
                            <h4 className="text-lg font-bold mb-2">Skills Required:</h4>
                            <ul className="text-sm space-y-1">
                                <li>• HTML, CSS, JavaScript</li>
                                <li>• Problem solving</li>
                                <li>• Team collaboration</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                        Junior Assistant Programmer
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        Junior Assistant Programmer adalah posisi entry level di bidang pemrograman, di mana individu membantu programmer senior dalam mengembangkan perangkat lunak.
                    </p>
                    <a href="#" className="text-blue-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-blue-800">
                        Detail →
                    </a>
                </div>
            </div>

            
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden animate-fade-in-up transform hover:-translate-y-2" >
                <div className="card-2 h-48 flex items-center justify-center text-6xl relative overflow-hidden">
                    🎨
            
                    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-white text-center p-4">
                            <h4 className="text-lg font-bold mb-2">Benefits:</h4>
                            <ul className="text-sm space-y-1">
                                <li>• Mentorship program</li>
                                <li>• Flexible working hours</li>
                                <li>• Career development</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                        Junior Assistant Programmer
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        Posisi ini cocok untuk fresh graduate yang ingin memulai karir di dunia teknologi dengan bimbingan dari mentor berpengalaman.
                    </p>
                    <a href="#" className="text-blue-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-blue-800">
                        Detail →
                    </a>
                </div>
            </div>
        </div>
        </div>
      </div>
    </div>
  )
}


export default Test