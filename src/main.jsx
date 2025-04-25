import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LoginPage from './pages/login'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoginPage/>
  </StrictMode>,
)
