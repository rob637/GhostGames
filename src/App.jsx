import { Routes, Route } from 'react-router-dom'
import { ExperimentalProvider } from './contexts/ExperimentalContext'
import { PremiumProvider } from './contexts/PremiumContext'
import { ToastContainer } from './components/Toast'
import UpgradeModal from './components/UpgradeModal'
import Home from './pages/Home'
import Game from './pages/Game'
import SoloGame from './pages/SoloGame'
import PartyGame from './pages/PartyGame'

function App() {
  return (
    <ExperimentalProvider>
      <PremiumProvider>
        <ToastContainer />
        <UpgradeModal />
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play/:gameId" element={<Game />} />
            <Route path="/solo/:gameType" element={<SoloGame />} />
            <Route path="/party/:gameId" element={<PartyGame />} />
          </Routes>
        </div>
      </PremiumProvider>
    </ExperimentalProvider>
  )
}

export default App
