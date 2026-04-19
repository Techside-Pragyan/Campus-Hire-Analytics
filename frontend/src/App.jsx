import React, { useState } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie
} from 'recharts';
import { 
  LayoutDashboard, UserCircle, FileText, TrendingUp, CheckCircle2, XCircle, 
  Upload, BrainCircuit, Sparkles, ChevronRight, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = "http-://localhost:8000"; // Note: will be fixed to http in final run if needed

const App = () => {
  const [formData, setFormData] = useState({
    CGPA: 8.5,
    Internships: 2,
    Projects: 3,
    Workshops: 1,
    AptitudeScore: 85,
    CommunicationSkills: 80,
    ProgrammingSkills: 90,
    Extracurriculars: 1
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'resume'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'CGPA' || name === 'AptitudeScore' || name === 'CommunicationSkills' || name === 'ProgrammingSkills' 
        ? parseFloat(value) 
        : parseInt(value)
    }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:8000/predict`, formData);
      setResult(response.data);
    } catch (error) {
      console.error("Prediction failed", error);
      alert("Make sure the backend is running at http://localhost:8000");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formDataFile = new FormData();
    formDataFile.append('file', file);

    try {
      const response = await axios.post(`http://localhost:8000/analyze-resume`, formDataFile);
      setResult(response.data.prediction);
      setFormData(response.data.extracted_data);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Failed to analyze resume. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 glass m-4 mr-0 flex flex-col p-6 hidden lg:flex">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-accent-cyan rounded-lg">
            <BrainCircuit size={24} color="#000" />
          </div>
          <h2 className="font-extrabold text-xl tracking-tight">HireAI</h2>
        </div>

        <nav className="space-y-4 flex-1">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <NavItem icon={<UserCircle size={20}/>} label="Student Profile" />
          <NavItem icon={<FileText size={20}/>} label="Resume Analysis" />
          <NavItem icon={<TrendingUp size={20}/>} label="Industry Trends" />
        </nav>

        <div className="mt-auto p-4 glass rounded-xl bg-opacity-20 border-white/5">
          <p className="text-xs text-dim mb-2">Powered by</p>
          <p className="font-bold text-sm">Advanced ML Ops</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Placement Analytics</h1>
            <p className="text-dim">Predict your career milestone with AI precision</p>
          </div>
          <div className="flex gap-4">
            <button className="glass px-4 py-2 text-sm flex items-center gap-2">
              <Sparkles size={16} className="text-accent-cyan" />
              v2.0 Beta
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass p-6">
              <div className="flex gap-4 mb-6 p-1 bg-white/5 rounded-xl">
                <button 
                  onClick={() => setActiveTab('manual')}
                  className={`flex-1 py-2 text-sm rounded-lg transition-all ${activeTab === 'manual' ? 'bg-white/10 shadow-lg' : 'text-dim'}`}
                >
                  Manual Entry
                </button>
                <button 
                  onClick={() => setActiveTab('resume')}
                  className={`flex-1 py-2 text-sm rounded-lg transition-all ${activeTab === 'resume' ? 'bg-white/10 shadow-lg' : 'text-dim'}`}
                >
                  AI Resume Scan
                </button>
              </div>

              {activeTab === 'manual' ? (
                <form onSubmit={handlePredict} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="CGPA (6-10)" name="CGPA" value={formData.CGPA} onChange={handleInputChange} type="number" step="0.01" />
                    <Input label="Aptitude (0-100)" name="AptitudeScore" value={formData.AptitudeScore} onChange={handleInputChange} type="number" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Internships" name="Internships" value={formData.Internships} onChange={handleInputChange} type="number" />
                    <Input label="Projects" name="Projects" value={formData.Projects} onChange={handleInputChange} type="number" />
                  </div>
                  <Input label="Programming (0-100)" name="ProgrammingSkills" value={formData.ProgrammingSkills} onChange={handleInputChange} type="number" />
                  <Input label="Communication (0-100)" name="CommunicationSkills" value={formData.CommunicationSkills} onChange={handleInputChange} type="number" />
                  
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-4">
                    {loading ? "Analyzing..." : "Generate Prediction"}
                    <ChevronRight size={18} />
                  </button>
                </form>
              ) : (
                <div className="text-center py-10">
                  <div className="mb-6 flex justify-center">
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }} 
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-20 h-20 rounded-full bg-accent-cyan/10 flex items-center justify-center border-2 border-dashed border-accent-cyan/50"
                    >
                      <Upload size={32} className="text-accent-cyan" />
                    </motion.div>
                  </div>
                  <h3 className="font-bold mb-2">Upload Resume</h3>
                  <p className="text-xs text-dim mb-6">Drop your PDF resume here for deep feature extraction</p>
                  <label className="btn-primary inline-flex cursor-pointer">
                    Select PDF
                    <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                  </label>
                </div>
              )}
            </div>

            <div className="glass p-6 bg-gradient-to-br from-accent-purple/10 to-transparent">
              <h3 className="card-title text-sm font-bold"><Info size={16} /> How it works</h3>
              <p className="text-xs leading-relaxed text-dim">
                Our AI model uses XGBoost and SHAP to analyze over 20+ parameters including academic consistency, project complexity, and soft skill metrics to provide high-fidelity prediction.
              </p>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="glass h-[500px] flex flex-col items-center justify-center text-center p-10"
                >
                  <div className="p-6 rounded-full bg-white/5 mb-6">
                    <TrendingUp size={48} className="text-dim opacity-20" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Waiting for Data</h2>
                  <p className="text-dim max-w-sm">Complete the form or upload a resume to see your placement probability and key influencing factors.</p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="space-y-6"
                >
                  {/* Summary Card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass p-8 flex items-center justify-between overflow-hidden relative">
                      <div className="z-10">
                        <p className="text-dim text-sm font-semibold mb-1">PREDICTION STATUS</p>
                        <h2 className={`text-4xl font-extrabold ${result.prediction === 'Placed' ? 'text-green-400' : 'text-red-400'}`}>
                          {result.prediction.toUpperCase()}
                        </h2>
                        <p className="text-xs mt-2 flex items-center gap-1">
                          {result.prediction === 'Placed' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          Confidence Level: {result.probability}%
                        </p>
                      </div>
                      <div className="absolute -right-10 opacity-10">
                         {result.prediction === 'Placed' ? <CheckCircle2 size={160} /> : <XCircle size={160} />}
                      </div>
                    </div>

                    <div className="glass p-8">
                      <p className="text-dim text-sm font-semibold mb-2">PROBABILITY SCORE</p>
                      <div className="flex items-end gap-3">
                         <span className="text-5xl font-black gradient-text">{result.probability}%</span>
                         <div className="flex-1 h-3 bg-white/5 rounded-full mb-3 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${result.probability}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-accent-cyan to-accent-blue"
                            />
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Insights Card */}
                  <div className="glass p-6">
                    <h3 className="card-title">
                      <Sparkles size={20} className="text-accent-cyan" /> 
                      Explainable AI Insights
                    </h3>
                    <p className="text-dim text-sm mb-6">These factors contributed most to your prediction result based on SHAP values.</p>
                    
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={result.all_factors}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="feature" 
                            type="category" 
                            stroke="#a0a0a0" 
                            fontSize={12}
                            width={120}
                          />
                          <Tooltip 
                            contentStyle={{ background: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#00f2fe' }}
                          />
                          <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                            {result.all_factors.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.contribution > 0 ? '#4facfe' : '#ff4f4f'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="glass p-6">
                    <h3 className="card-title">Actionable Recommendations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <RecommendationBox 
                        title="Skill Boost" 
                        text={result.probability < 70 ? "Focus on competitive programming and system design." : "Keep polishing your advanced tech stack."} 
                      />
                      <RecommendationBox 
                        title="Projects" 
                        text="Add 1-2 high-impact full-stack projects to your portfolio." 
                        highlight
                      />
                      <RecommendationBox 
                        title="Certifications" 
                        text="Acquire industry-standard certifications in Cloud or Data Science." 
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20' : 'text-dim hover:bg-white/5'}`}>
    {icon}
    <span className="font-semibold text-sm">{label}</span>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="input-group">
    <label>{label}</label>
    <input {...props} />
  </div>
);

const RecommendationBox = ({ title, text, highlight = false }) => (
  <div className={`p-4 rounded-xl border ${highlight ? 'border-accent-cyan/30 bg-accent-cyan/5' : 'border-white/5 bg-white/5'}`}>
    <h4 className="font-bold text-sm mb-2 uppercase tracking-wider">{title}</h4>
    <p className="text-xs text-dim leading-relaxed">{text}</p>
  </div>
);

export default App;
