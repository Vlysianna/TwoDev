import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppRouter from './routes/AppRouter'
import Sidebar from './components/SideAdmin'
import NavLanding from './components/NavLanding'
import FootLanding from './components/FootLanding'
import SideAsesor from './components/SideAsesor'
import VerifikasiPage from './pages/admin/verifikasi'
import RegisterPage from './pages/admin/register'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppRouter />
      <div className="relative min-h-screen">
        {/* <NavLanding />   */}
        <main>
          <SideAsesor />
        </main>
        {/* <FootLanding /> */}
      </div>
    </>
  )
}

export default App
