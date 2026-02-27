import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"; // NEW
import Home from './pages/Home';
import Interview from './pages/Interview';
import Dashboard from './pages/Dashboard';

const Navbar = () => (
  <nav className="bg-white/80 backdrop-blur-md border-b border-indigo-50/50 px-6 py-4 sticky top-0 z-50 shadow-sm">
    <div className="max-w-5xl mx-auto flex justify-between items-center">
      <Link to="/" className="text-xl font-black tracking-tight flex items-center gap-2">
        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-1.5 rounded-lg shadow-md shadow-indigo-500/20">
          <BrainCircuit className="w-5 h-5 text-white" />
        </div>
        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          AI-Interview
        </span>
      </Link>
      
      <div className="flex items-center gap-6">
        {/* Only show Dashboard link if the user is signed in */}
        <SignedIn>
          <Link to="/dashboard" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
            History Dashboard
          </Link>
          <UserButton />
        </SignedIn>

        {/* Show a sleek Login button if they are signed out */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  </nav>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;