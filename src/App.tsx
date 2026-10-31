/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import DisclaimerBanner from './components/DisclaimerBanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MarketAnalysis from './pages/MarketAnalysis';
import ChartAnalyzer from './pages/ChartAnalyzer';
import AiAssistant from './pages/AiAssistant';
import RiskManagement from './pages/RiskManagement';
import MyReports from './pages/MyReports';
import WatchlistPage from './pages/WatchlistPage';
import PortfolioDashboard from './pages/PortfolioDashboard';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-[#070514] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
          <DisclaimerBanner />
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/market" element={<MarketAnalysis />} />
              <Route path="/analyzer" element={<ChartAnalyzer />} />
              <Route path="/assistant" element={<AiAssistant />} />
              <Route path="/risk" element={<RiskManagement />} />
              <Route path="/reports" element={<MyReports />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/portfolio" element={<PortfolioDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}
