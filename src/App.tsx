import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RootLayout from './layout/RootLayout'
import HomePage from './pages/Home'
import SimulationPage from './pages/Simulation'
import VoiceSimulationPage from './pages/VoiceSimulationPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="simulate" element={<SimulationPage />} />
          <Route path="voice" element={<VoiceSimulationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App