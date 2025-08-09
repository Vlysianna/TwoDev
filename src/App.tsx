import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
<<<<<<< HEAD
import Sidebar from './components/SideAdmin'
import NavLanding from './components/NavAdmin'
=======
import AppRouter from './routes/AppRouter'
import Sidebar from './components/SideAdmin'
import NavLanding from './components/NavLanding'
>>>>>>> 3a08db64c6aa520457d68732f3775171cbc1f88a
import FootLanding from './components/FootLanding'
import SideAsesor from './components/SideAsesor'

function App() {
<<<<<<< HEAD
  

  return (
    <>
    <div className="relative min-h-screen">
  {/* <NavLanding />   */}
  <main>        
    <SideAsesor />
  </main>
  {/* <FootLanding /> */}
</div>
=======
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
>>>>>>> 3a08db64c6aa520457d68732f3775171cbc1f88a
    </>
  )
}

<<<<<<< HEAD
export default App
=======
export default App
>>>>>>> 3a08db64c6aa520457d68732f3775171cbc1f88a
