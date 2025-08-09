import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sidebar from './components/SideAdmin'
import NavLanding from './components/NavLanding'
import FootLanding from './components/FootLanding'
import SideAsesor from './components/SideAsesor'

function App() {


  return (
    <>
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
