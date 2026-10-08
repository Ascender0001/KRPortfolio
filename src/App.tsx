import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { ScrollProgress } from './components/ScrollProgress'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Projects } from './components/Projects'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

function App() {
  return (
    <>
      <a className="skip-link" href="#hero">
        Ugrás a tartalomra
      </a>
      <Navbar />
      <ScrollProgress />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
