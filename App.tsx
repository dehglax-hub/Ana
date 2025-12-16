import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { generateLogo } from './services/geminiService';
import { ImageFile, GenerationState } from './types';
import { Wand2, Loader2, Download, AlertCircle, RefreshCw, Briefcase, BrainCircuit, Upload, ImageIcon } from 'lucide-react';

// Helper to read file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Return raw base64 without the data URL prefix
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

const App: React.FC = () => {
  const [mainLogo, setMainLogo] = useState<ImageFile | null>(null);
  const [fontRef, setFontRef] = useState<ImageFile | null>(null);
  const [generationState, setGenerationState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    resultImage: null,
  });

  const handleUploadMain = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      const previewUrl = URL.createObjectURL(file);
      setMainLogo({ file, previewUrl, base64 });
      setGenerationState(prev => ({ ...prev, error: null }));
    } catch (e) {
      console.error(e);
      setGenerationState(prev => ({ ...prev, error: "Failed to process main logo image." }));
    }
  };

  const handleUploadFont = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      const previewUrl = URL.createObjectURL(file);
      setFontRef({ file, previewUrl, base64 });
      setGenerationState(prev => ({ ...prev, error: null }));
    } catch (e) {
      console.error(e);
      setGenerationState(prev => ({ ...prev, error: "Failed to process font reference image." }));
    }
  };

  const handleGenerate = async () => {
    if (!mainLogo) return;

    setGenerationState({ isLoading: true, error: null, resultImage: null });

    // Constructed prompt based on specific user requirements
    const prompt = `
      Act as a professional senior logo designer. Redesign the provided logo for a Business Development Institute named "ANA SHARIF".
      
      STRICT REQUIREMENTS:
      1. STYLE: Create a clean, modern VECTOR art style logo. Flat design, high geometric precision.
      2. COMPOSITION: Completely REMOVE the dome/mosque background from the original image.
      3. SYMBOLISM: Create a new symbol that represents "Business Development" and "Smart Intelligence" (AI). Use abstract concepts like connecting nodes, upward growth charts, stylized brain circuitry, or a hexagon grid. 
      4. CONCEPT: The design must be conceptual, unique, and memorable. Avoid clichés like standard lightbulbs or generic gears. It should look like a premium tech-business consultancy brand.
      5. TEXT: The text must read "ANA SHARIF".
      6. TYPOGRAPHY: STRICTLY mimic the font style, weight, and serifs of the text in the second provided image.
      7. LANGUAGE: ENGLISH ONLY. Do not use any Persian/Arabic script.
      
      Output a high-quality, professional logo on a white background.
    `;

    try {
      const result = await generateLogo(
        mainLogo.base64,
        fontRef?.base64 || null,
        prompt
      );
      setGenerationState({ isLoading: false, error: null, resultImage: result });
    } catch (error: any) {
      setGenerationState({
        isLoading: false,
        error: error.message || "Something went wrong. Please try again.",
        resultImage: null
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                Ana Sharif
              </h1>
              <p className="text-xs font-medium text-slate-500">Logo Re-Imaginer</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Intro Section */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Business Intelligence Brand Redesign</h2>
            <p className="text-indigo-100 max-w-2xl text-sm leading-relaxed opacity-90">
              Upload the current logo and a typography reference. Our AI will strip the old dome design, 
              vectorize the concept, and inject "Smart Business" symbolism while strictly adhering to your 
              requested font style.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Upload size={18} className="text-indigo-600" />
                Input Assets
              </h3>
              
              <div className="space-y-6">
                <ImageUploader
                  id="main-logo"
                  label="1. Current Logo (To Redesign)"
                  subLabel="The logo with the dome to replace"
                  image={mainLogo}
                  onUpload={handleUploadMain}
                  onRemove={() => setMainLogo(null)}
                  required
                />
                
                <ImageUploader
                  id="font-ref"
                  label="2. Typography Reference"
                  subLabel="Image containing the desired font style"
                  image={fontRef}
                  onUpload={handleUploadFont}
                  onRemove={() => setFontRef(null)}
                />
              </div>

              <div className="mt-8">
                <button
                  onClick={handleGenerate}
                  disabled={!mainLogo || generationState.isLoading}
                  className={`w-full py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-semibold text-white shadow-lg transition-all transform active:scale-95
                    ${!mainLogo || generationState.isLoading 
                      ? 'bg-slate-300 cursor-not-allowed shadow-none text-slate-500' 
                      : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:shadow-indigo-500/25'
                    }`}
                >
                  {generationState.isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Reimagining...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate New Logo
                    </>
                  )}
                </button>
                {!mainLogo && (
                  <p className="text-xs text-center text-slate-400 mt-3">
                    Please upload the current logo to begin.
                  </p>
                )}
              </div>
            </div>

            {/* Guidelines Card */}
            <div className="bg-slate-100 p-5 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-700 text-sm mb-3 flex items-center gap-2">
                <Briefcase size={16} />
                Design Rules Applied:
              </h4>
              <ul className="text-xs space-y-2 text-slate-600">
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span> Vector art style
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span> Remove dome/mosque background
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span> Add Smart Business/AI symbols
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span> Use reference font for "ANA SHARIF"
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span> English text only (No Persian)
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full min-h-[500px] flex flex-col overflow-hidden relative">
              
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <ImageIcon size={18} className="text-indigo-600" />
                  Generated Result
                </h3>
                {generationState.resultImage && (
                   <a 
                     href={generationState.resultImage} 
                     download="ana-sharif-reimagined.png"
                     className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 transition-colors"
                   >
                     <Download size={14} />
                     Download
                   </a>
                )}
              </div>

              <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
                {generationState.isLoading ? (
                  <div className="text-center space-y-4">
                    <div className="relative w-20 h-20 mx-auto">
                      <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-slate-500 font-medium animate-pulse">Designing concept...</p>
                  </div>
                ) : generationState.error ? (
                  <div className="text-center max-w-sm mx-auto p-6 bg-red-50 rounded-xl border border-red-100">
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                    <p className="text-red-700 font-medium mb-1">Generation Failed</p>
                    <p className="text-red-600/80 text-sm">{generationState.error}</p>
                    <button 
                      onClick={handleGenerate}
                      className="mt-4 px-4 py-2 bg-white text-red-600 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : generationState.resultImage ? (
                  <div className="relative w-full h-full flex items-center justify-center group">
                    <img 
                      src={generationState.resultImage} 
                      alt="Generated Logo" 
                      className="max-w-full max-h-[600px] object-contain shadow-2xl rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="text-center text-slate-400">
                    <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Wand2 className="w-10 h-10 text-slate-300" />
                    </div>
                    <p className="text-lg font-medium text-slate-500">Ready to create</p>
                    <p className="text-sm">Upload your files and click generate to see the magic.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;