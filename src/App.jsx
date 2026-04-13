import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Projects from './pages/Projects'
import CodingTest from './pages/CodingTest'
import Interview from './pages/Interview'
import AICompare from './pages/AICompare'
import DevReads from './pages/DevReads'
import PersonalStudy  from './pages/PersonalStudy'
import Cryptography   from './pages/security/Cryptography'
import Reversing      from './pages/security/Reversing'
import Pwnable        from './pages/security/Pwnable'
import Network        from './pages/security/Network'
import DataStructure from './pages/topics/DataStructure'
import SearchSort from './pages/topics/SearchSort'
import DPGreedy from './pages/topics/DPGreedy'
import PSCollection from './pages/topics/PSCollection'
import GraphAdvanced from './pages/topics/GraphAdvanced'
import Implementation from './pages/topics/Implementation'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/projects"    element={<Projects />} />
          <Route path="/personal-study"                    element={<PersonalStudy />} />
          <Route path="/personal-study/cryptography"       element={<Cryptography />} />
          <Route path="/personal-study/reversing"          element={<Reversing />} />
          <Route path="/personal-study/pwnable"            element={<Pwnable />} />
          <Route path="/personal-study/network"            element={<Network />} />
          <Route path="/coding-test" element={<CodingTest />} />
          <Route path="/coding-test/data-structure"  element={<DataStructure />} />
          <Route path="/coding-test/search-sort"     element={<SearchSort />} />
          <Route path="/coding-test/dp-greedy"       element={<DPGreedy />} />
          <Route path="/coding-test/ps-collection"   element={<PSCollection />} />
          <Route path="/coding-test/graph-advanced"  element={<GraphAdvanced />} />
          <Route path="/coding-test/implementation"  element={<Implementation />} />
          <Route path="/interview"   element={<Interview />} />
          <Route path="/ai-compare"  element={<AICompare />} />
          <Route path="/dev-reads"   element={<DevReads />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
