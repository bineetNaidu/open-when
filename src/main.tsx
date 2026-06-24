import './index.css'
import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import CreatePage from './pages/CreatePage'
import OpenPage from './pages/OpenPage'
import HowItWorksPage from './pages/HowItWorksPage'
import OnboardingModal from './components/OnboardingModal'
import HelpButton from './components/HelpButton'

const SESSION_STORAGE_NAME = "open-whn-onboarding-seen"

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Show modal on first visit each session
    const seen = sessionStorage.getItem(SESSION_STORAGE_NAME)
    if (!seen) setShowOnboarding(true)
  }, [])

  function dismissOnboarding() {
    sessionStorage.setItem(SESSION_STORAGE_NAME, '1')
    setShowOnboarding(false)
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CreatePage />} />
          <Route path="/open" element={<OpenPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
        </Routes>
        <HelpButton />
      </BrowserRouter>

      {/* First visit modal */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingModal onDone={dismissOnboarding} />
        )}
      </AnimatePresence>
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)