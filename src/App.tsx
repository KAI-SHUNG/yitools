import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DivinationPage from './pages/DivinationPage'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/divination" element={<DivinationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
