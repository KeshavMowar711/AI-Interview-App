import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Calendar, ChevronRight, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@clerk/clerk-react'; // 1. Import Clerk Auth

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const navigate = useNavigate();
  
  // 2. Grab the user's ID
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    // Only attempt to fetch if Clerk has finished loading and we have an ID
    if (!isLoaded || !userId) return;

    const fetchHistory = async () => {
      try {
        // 3. Append the userId as a query parameter!
        const res = await fetch(`http://localhost:5000/api/interviews?userId=${userId}`);
        if (res.ok) setSessions(await res.json());
      } catch (err) { 
        console.error(err); 
      } finally { 
        setIsLoading(false); 
      }
    };
    
    fetchHistory();
  }, [userId, isLoaded]);

  // DETAILED VIEW (No changes to the UI here, just the data source!)
  if (selectedSession) {
    return (
      <div className="relative min-h-[90vh] p-4 md:p-8">
        <div className="fixed top-0 left-0 w-full h-full bg-slate-50 -z-20"></div>
        <div className="fixed top-20 right-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 -z-10"></div>
        
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedSession(null)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{selectedSession.jobRole}</h2>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-1 mt-1">
                  <Calendar className="w-3.5 h-3.5" /> {new Date(selectedSession.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className="px-4 py-1.5 bg-indigo-100 text-indigo-700 font-bold rounded-full border border-indigo-200 shadow-sm">
              {selectedSession.qaPairs.length} Records
            </span>
          </div>

          <div className="space-y-6">
            {selectedSession.qaPairs.map((qa, i) => (
              <div key={i} className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-6 md:p-8 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-violet-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Prompt {i + 1}
                  </h4>
                  <div className="prose prose-slate md:prose-lg max-w-none text-slate-900 font-medium leading-relaxed">
                    <ReactMarkdown>{qa.question}</ReactMarkdown>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your Response</h4>
                  <p className="text-slate-700 font-medium whitespace-pre-wrap">{qa.userAnswer}</p>
                </div>
                
                <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider">AI Analysis</h4>
                    <span className="text-xs font-black px-3 py-1 bg-white text-indigo-700 rounded-full shadow-sm border border-indigo-100">
                      Score: {qa.score}/10
                    </span>
                  </div>
                  <div className="prose prose-slate max-w-none text-indigo-900 leading-relaxed">
                    <ReactMarkdown>{qa.aiFeedback}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // GRID VIEW
  return (
    <div className="relative min-h-[90vh] p-4 md:p-8">
      <div className="fixed top-10 left-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 pointer-events-none -z-10"></div>
      
      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        <div className="pb-4 border-b border-slate-200/60">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Session History</h2>
          <p className="text-base text-slate-500 mt-2 font-medium">Review your past evaluations and metrics.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-white">
             <h3 className="text-xl font-bold text-slate-700">No sessions found</h3>
             <p className="text-slate-500 mt-2">Start a new interview to populate your dashboard!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {sessions.map((session) => (
              <div 
                key={session._id} onClick={() => setSelectedSession(session)}
                className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer transform hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{session.jobRole}</h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                    <Calendar className="w-3.5 h-3.5" /> {new Date(session.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">
                    {session.qaPairs.length} {session.qaPairs.length === 1 ? 'Prompt' : 'Prompts'}
                  </p>
                  <div className="p-1.5 rounded-full bg-slate-50 group-hover:bg-indigo-100 transition-colors">
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;