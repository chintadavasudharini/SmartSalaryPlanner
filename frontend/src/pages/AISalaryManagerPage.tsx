import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import api from '../services/api';
import { Bot, Send, Sparkles, CheckCircle2, MessageSquare, Lightbulb } from 'lucide-react';

export const AISalaryManagerPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loadingRecs, setLoadingRecs] = useState(true);

  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    fetchAIRecommendations();
  }, []);

  const fetchAIRecommendations = async () => {
    try {
      const res = await api.get('/ai/recommendations');
      setRecommendations(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRecs(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: userMsg });
      setChatHistory(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { sender: 'ai', text: 'Error communicating with AI service layer.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const sampleQuestions = [
    'How can I save more each month?',
    'Where am I spending too much?',
    'How should I divide my salary?',
    'Can I afford a new laptop goal?'
  ];

  const handleSampleClick = (q: string) => {
    setChatInput(q);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">AI Salary Manager</h1>
              <p className="text-sm text-slate-500">Personalized AI financial planning assistant powered by Gemini API</p>
            </div>
          </div>
        </div>

        {/* Personalized Recommendations Section */}
        <Card title="Personalized Financial Recommendations" subtitle="Generated from your real Firestore financial data">
          {loadingRecs ? (
            <div className="p-8 text-center text-slate-500 text-sm">Analyzing financial data with Gemini AI...</div>
          ) : recommendations ? (
            <div className="space-y-6">
              {recommendations.ai_powered && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> Gemini API Powered Recommendations
                </div>
              )}

              <div className="prose prose-slate max-w-none text-xs leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-200 whitespace-pre-wrap">
                {recommendations.recommendations_text}
              </div>

              {recommendations.key_takeaways && (
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" /> Actionable Key Takeaways
                  </h4>
                  <ul className="space-y-2">
                    {recommendations.key_takeaways.map((takeaway: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                        <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </Card>

        {/* Interactive AI Chat Assistant */}
        <Card title="Ask AI Financial Planning Assistant" subtitle="Get tailored answers using your actual monthly metrics">
          <div className="space-y-4">
            {/* Quick Sample Questions */}
            <div className="flex flex-wrap gap-2">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSampleClick(q)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat Box */}
            <div className="h-64 overflow-y-auto bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
              {chatHistory.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
                  Ask a question above to start consulting your AI Salary Manager...
                </div>
              ) : (
                chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xl p-3 rounded-xl text-xs ${
                        msg.sender === 'user'
                          ? 'bg-sky-600 text-white font-medium'
                          : 'bg-white text-slate-800 border border-slate-200 shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="text-xs text-slate-400 italic">Gemini AI is generating advice...</div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask e.g. How can I save more or reduce my EMI ratio?"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold text-xs shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> Ask
              </button>
            </form>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
