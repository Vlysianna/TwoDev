import './App.css'
import NavLanding from './components/NavLanding'
import FootLanding from './components/FootLanding'


function LandingPage() {
  

  return (
    <>
    <div className="relative min-h-screen">
  <NavLanding />  
  <main>            
    <img src="public\bgsklh.png" alt="" className='w-full blur-sm '/>
  </main>
  <FootLanding />
</div>
    </>
  )
}

export default LandingPage
