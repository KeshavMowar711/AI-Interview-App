import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, RefreshCw, AlertCircle, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { interviewId, jobRole } = location.state || {};

  const [question, setQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!jobRole) return navigate('/');
    generateNewQuestion();
  }, [jobRole, navigate]);

  const generateNewQuestion = async () => {
    setIsGenerating(true); setError(''); setFeedback(null); setUserAnswer('');
    try {
      const res = await fetch('http://localhost:5000/api/generate-question', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobRole })
      });
      const data = await res.json();
      res.ok ? setQuestion(data.question) : setError(data.error);
    } catch { setError('Connection failed.'); } finally { setIsGenerating(false); }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setIsGrading(true); setError('');
    try {
      const res = await fetch('http://localhost:5000/api/grade-answer', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewId, question, userAnswer })
      });
      const data = await res.json();
      res.ok ? setFeedback(data) : setError(data.error);
    } catch { setError('Connection failed.'); } finally { setIsGrading(false); }
  };

  return (
    <div className="relative min-h-[90vh] p-4 md:p-8">
      
      {/* Ambient Background Glows */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        
        {/* Header Glass Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Active Interview Session</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Role: <span className="text-indigo-600 font-bold">{jobRole}</span></p>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 border border-indigo-200 ${isGenerating || isGrading ? 'animate-pulse' : ''}`}>
            <Terminal className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {error && (
          <div className="bg-red-50/90 backdrop-blur-md text-red-600 p-4 rounded-2xl flex items-center gap-3 border border-red-200 font-medium shadow-sm">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        {/* Workspace Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden">
          
          {/* Question Area */}
          <div className="p-6 md:p-8 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <h3 className="text-xs font-bold text-violet-600 uppercase tracking-wider">AI Prompt</h3>
            </div>
            
            {isGenerating ? (
              <div className="h-20 flex items-center text-slate-400 font-medium animate-pulse">Compiling technical scenario...</div>
            ) : (
              <div className="prose prose-slate md:prose-lg max-w-none text-slate-800 font-medium leading-relaxed">
                <ReactMarkdown>{question}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Action Area */}
          <div className="p-6 md:p-8">
            {!isGenerating && !feedback && (
              <div className="space-y-4">
                <textarea
                  value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Draft your solution here..."
                  className="w-full h-48 p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:bg-white focus:ring-0 focus:border-indigo-500 outline-none resize-none text-slate-700 font-medium transition-all text-lg placeholder:text-slate-400"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSubmitAnswer} disabled={isGrading || !userAnswer.trim()}
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-indigo-500/30 transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {isGrading ? 'Evaluating Response...' : 'Submit Answer'}
                    {!isGrading && <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Feedback Area */}
            {feedback && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    <h3 className="text-lg font-bold text-slate-900">Evaluation Results</h3>
                  </div>
                  <div className="px-4 py-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 font-black rounded-full border border-emerald-200 shadow-sm">
                    Score: {feedback.score}/10
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">AI Analysis</h4>
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <ReactMarkdown>{feedback.feedback}</ReactMarkdown>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3">Suggested Improvement</h4>
                    <div className="prose prose-indigo max-w-none text-indigo-900 bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                      <ReactMarkdown>{feedback.improvement}</ReactMarkdown>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={generateNewQuestion}
                    className="bg-white border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Next Prompt
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;