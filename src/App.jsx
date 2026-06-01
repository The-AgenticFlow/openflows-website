import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home/Home'
import About from '@/pages/About/About'
import Agents from '@/pages/Agents/Agents'
import AgentDetail from '@/pages/AgentDetail/AgentDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/agents/:agentId" element={<AgentDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
