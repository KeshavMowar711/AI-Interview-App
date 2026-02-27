import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, Code2, Lock } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react'; // 1. Import Clerk Auth

const Home = () => {
  const [jobRole, setJobRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // 2. Grab the user's ID securely from Clerk
  const { userId, isLoaded } = useAuth();

  const handleStartInterview = async (e) => {
    e.preventDefault();
    if (!jobRole.trim() || !userId) return;
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/start-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 3. Send the userId to MongoDB so it knows who owns this session!
        body: JSON.stringify({ jobRole, clerkUserId: userId }), 
      });

      const data = await response.json();
      if (response.ok && data.interviewId) {
        navigate('/interview', { state: { interviewId: data.interviewId, jobRole } });
      } else {
        alert(data.error || 'Connection error.');
      }
    } catch (error) {
      alert('Failed to reach backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center p-4">
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-violet-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-30"></div>

      <div className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_40px_-15px_rgba(79,70,229,0.15)] border border-white p-8 space-y-8 relative z-10">
        
        <div className="space-y-3">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
            <Code2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Configure Session</h1>
          <p className="text-base text-slate-500">Enter your target role to generate a dynamic technical scenario.</p>
        </div>

        <form onSubmit={handleStartInterview} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="role" className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Target Role
            </label>
            <input
              id="role"
              type="text"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="e.g., Senior Node.js Developer"
              className="w-full px-5 py-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus:bg-white focus:ring-0 focus:border-indigo-500 text-slate-900 outline-none transition-all font-medium text-lg placeholder:text-slate-400"
              required
              disabled={!userId} // Disable typing if not logged in
            />
          </div>

          {!isLoaded ? (
             <div className="w-full py-4 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
          ) : userId ? (
            <button
              type="submit"
              disabled={isLoading || !jobRole.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-lg font-bold py-4 px-4 rounded-xl shadow-lg shadow-indigo-500/30 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Initialize Interview'}
              {!isLoading && <ArrowRight className="w-6 h-6" />}
            </button>
          ) : (
            <div className="w-full bg-slate-100 text-slate-500 text-sm font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-200">
              <Lock className="w-4 h-4" /> Please Sign In to Start
            </div>
          )}
        </form>

      </div>
    </div>
  );
};

export default Home;