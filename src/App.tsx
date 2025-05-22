import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RootLayout from './layout/RootLayout'
import HomePage from './pages/Home'
import SimulationPage from './pages/Simulation'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="simulate" element={<SimulationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App