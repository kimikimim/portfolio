import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Projects from './pages/Projects'
import CodingTest from './pages/CodingTest'
import Interview from './pages/Interview'
import AICompare from './pages/AICompare'
import DevReads from './pages/DevReads'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/projects"    element={<Projects />} />
          <Route path="/coding-test" element={<CodingTest />} />
          <Route path="/interview"   element={<Interview />} />
          <Route path="/ai-compare"  element={<AICompare />} />
          <Route path="/dev-reads"   element={<DevReads />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
