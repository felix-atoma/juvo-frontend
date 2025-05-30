import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RootLayout from './layout/RootLayout'
import HomePage from './pages/Home'
import SimulationPage from './pages/Simulation'
import VoiceSimulationPage from './pages/VoiceSimulationPage'
import ErrorBoundary from './pages/ErrorBoundary'
import React from 'react'

// Optionally use lazy loading for better performance
// const SimulationPage = lazy(() => import('./pages/Simulation'))
// const VoiceSimulationPage = lazy(() => import('./pages/VoiceSimulationPage'))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <ErrorBoundary>
              <RootLayout />
            </ErrorBoundary>
          }
        >
          <Route 
            index 
            element={
              <ErrorBoundary>
                <HomePage />
              </ErrorBoundary>
            } 
          />
          <Route 
            path="simulate" 
            element={
              <ErrorBoundary>
                {/* Wrap lazy-loaded components in Suspense */}
                {/* <Suspense fallback={<LoadingSpinner />}> */}
                  <SimulationPage />
                {/* </Suspense> */}
              </ErrorBoundary>
            } 
          />
          <Route 
            path="voice" 
            element={
              <ErrorBoundary>
                {/* <Suspense fallback={<LoadingSpinner />}> */}
                  <VoiceSimulationPage />
                {/* </Suspense> */}
              </ErrorBoundary>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App