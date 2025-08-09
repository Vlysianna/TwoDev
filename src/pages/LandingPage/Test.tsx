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
          {/* Konten Utama ya buyunggggggggggggggggggggggggg */}
        </div>
      </div>
    </div>
  )
}


export default Test