import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import CreatePage from './pages/CreatePage'
import OpenPage from './pages/OpenPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreatePage />} />
        <Route path="/open" element={<OpenPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)