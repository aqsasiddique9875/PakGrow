import React, { useState } from 'react';
import Header from './components/Header';
import SoilForm from './components/SoilForm';
import ResultsDisplay from './components/ResultsDisplay';
import CropLibrary from './components/CropLibrary';
import Reminders from './components/Reminders';
import MarketPrices from './components/MarketPrices';
import ChatBot from './components/ChatBot';
import { SoilData, SoilType, CropType, AnalysisResult } from './types';
import { analyzeSoilHealth, analyzeSoilFromImage } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'analysis' | 'library' | 'reminders' | 'market'>('analysis');
  
  const [soilData, setSoilData] = useState<SoilData>({
    soilType: SoilType.Select,
    crop: CropType.Select,
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
    phLevel: 7.0,
    moisture: 'Moist'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async (mode: 'manual' | 'image', imagePayload?: { base64: string, mimeType: string }) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let analysis: AnalysisResult;

      if (mode === 'manual') {
        // Use Thinking model (Pro) for manual detailed analysis
        analysis = await analyzeSoilHealth(soilData);
      } else {
        if (!imagePayload) throw new Error("No image data provided");
        // Use Flash Lite for fast image analysis
        analysis = await analyzeSoilFromImage(imagePayload.base64, imagePayload.mimeType, soilData.crop);
      }
      
      setResult(analysis);
    } catch (err: any) {
      console.error("Analysis Error:", err);
      let msg = "Unable to complete analysis. Please check your internet connection or API key.";
      
      const errStr = JSON.stringify(err);
      if (err?.status === 429 || errStr.includes('429') || errStr.includes('quota') || errStr.includes('RESOURCE_EXHAUSTED')) {
        msg = "High traffic or daily limit reached (Error 429). Please wait a moment and try again.";
      }
      
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 selection:bg-green-200 selection:text-green-900">
      <Header currentView={currentView} onNavigate={setCurrentView} />
      
      {/* Hero Section */}
      {currentView === 'analysis' && (
        <div className="relative pt-8 pb-32 md:pb-40 overflow-hidden">
           {/* Decorative Background Elements */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
             <div className="absolute top-20 left-10 w-72 h-72 bg-green-300/20 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
             <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
           </div>

           <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
            <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white border border-green-100 shadow-sm text-green-700 text-xs font-bold uppercase tracking-wide mb-6 hover:shadow-md transition-shadow cursor-default">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              AI-Powered Agronomy
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Cultivate <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Success</span> <br className="hidden md:block"/>
              From the Ground Up
            </h2>
             <h3 className="text-xl md:text-3xl font-urdu text-slate-500 mb-6 font-medium">
              کامیابی کی کاشت، زمین سے شروع
            </h3>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              Precision soil analysis tailored for Pakistan's crops. Get instant, expert fertilizer plans to maximize your yield potential.
            </p>
          </div>
        </div>
      )}
      
      <main className={`flex-grow w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 transition-all duration-300 ${currentView === 'analysis' ? 'max-w-[98%] 2xl:max-w-[90%] -mt-24 relative z-10' : 'max-w-7xl pt-4'}`}>
        
        {currentView === 'analysis' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
            
            {/* Left Column: Input Form */}
            {/* Adaptive width: 33% on large screens, 25% on XL screens */}
            <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 order-2 lg:order-1 transition-all duration-300 lg:h-[calc(100vh-8rem)]">
              <SoilForm 
                data={soilData} 
                onChange={setSoilData} 
                onSubmit={handleAnalysis}
                isLoading={loading}
              />
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm shadow-sm flex items-start gap-3 animate-fade-in-up">
                   <div className="bg-red-100 p-1.5 rounded-full flex-shrink-0">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                   </div>
                   <span className="font-medium">{error}</span>
                </div>
              )}
            </div>

            {/* Right Column: Results */}
            {/* Adaptive width: 66% on large screens, 75% on XL screens */}
            <div className="lg:col-span-8 xl:col-span-9 order-1 lg:order-2 transition-all duration-300">
              {loading && (
                <div className="h-[500px] w-full flex flex-col items-center justify-center bg-white rounded-[2rem] shadow-xl shadow-green-100/50 border border-green-50/50 p-8 text-center animate-pulse">
                  <div className="h-32 w-32 bg-green-50 rounded-full mb-8 relative flex items-center justify-center">
                     <div className="absolute inset-0 border-4 border-green-100 rounded-full animate-ping opacity-75"></div>
                     <svg className="w-12 h-12 text-green-200 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  </div>
                  <div className="h-4 w-48 bg-gray-100 rounded-full mb-3"></div>
                  <div className="h-3 w-32 bg-gray-50 rounded-full"></div>
                  <p className="text-green-800 font-bold mt-4">AI Thinking in progress...</p>
                </div>
              )}
              
              {!loading && !result && !error && (
                <div className="h-full min-h-[450px] flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-gray-200 p-10 text-center hover:border-green-300 hover:bg-white transition-all group duration-500">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                      <img 
                        src="https://cdn-icons-png.flaticon.com/512/2823/2823521.png" 
                        alt="Soil Icon" 
                        className="w-10 h-10 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" 
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to Analyze</h3>
                    <p className="text-gray-500 max-w-md leading-relaxed">
                      Enter your soil parameters manually or upload a photo to generate a comprehensive, AI-driven nutrient plan tailored to your needs.
                    </p>
                </div>
              )}

              {!loading && result && (
                <div className="animate-fade-in-up">
                  <ResultsDisplay result={result} soilData={soilData} />
                </div>
              )}
            </div>
          </div>
        ) : currentView === 'library' ? (
          <CropLibrary />
        ) : currentView === 'reminders' ? (
          <Reminders />
        ) : (
          <MarketPrices />
        )}

      </main>

      <ChatBot />
    </div>
  );
};

export default App;