import Navbar from "../../components/NavAdmin"
import Sidebar from "../../components/SideAdmin"

export default function TambahSkema() {
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
        </div>
      </div>
    </div>
  )
}