import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import NotebookPage from './components/NotebookPage';
import FlashcardDeck from './components/FlashcardDeck';
import CheckpointQuiz from './components/CheckpointQuiz';
import VirtualLab from './components/VirtualLab';
import { Unit, Topic, GeneratedContent, TabType } from './types';
import { CURRICULUM } from './constants';
import { generateTopicContent, generateBiologyImage } from './services/geminiService';
import { BookText, GraduationCap, Microscope, BrainCircuit, Menu, Loader2, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUnit, setCurrentUnit] = useState<Unit>(CURRICULUM[0]);
  const [currentTopic, setCurrentTopic] = useState<Topic>(CURRICULUM[0].topics[0]);
  const [activeTab, setActiveTab] = useState<TabType>('notes');
  const [content, setContent] = useState<GeneratedContent | null>(null);
  
  // Store multiple images with their captions
  const [generatedImages, setGeneratedImages] = useState<{url: string, caption: string}[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      setContent(null); 
      setGeneratedImages([]); // Clear previous images
      
      try {
        const data = await generateTopicContent(currentUnit.name, currentTopic.name);
        setContent(data);

        // COMMENTED OUT IMAGE GENERATION - KEEP THE REST
        /*
        // Fetch multiple images in parallel if visuals are provided
        if (data && data.visuals && data.visuals.length > 0) {
          setImageLoading(true);
          
          const imagePromises = data.visuals.map(async (visual) => {
            const url = await generateBiologyImage(visual.prompt);
            return url ? { url, caption: visual.caption } : null;
          });

          const results = await Promise.all(imagePromises);
          // Filter out failed image generations (nulls)
          setGeneratedImages(results.filter((img): img is {url: string, caption: string} => img !== null));
          setImageLoading(false);
        } else {
          setImageLoading(false);
        }
        */
      } catch (err) {
        console.error(err);
        setError("Failed to generate content. Please check your API key in .env.local.");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [currentUnit.id, currentTopic.id]);

  const handleSelectTopic = (unit: Unit, topic: Topic) => {
    setCurrentUnit(unit);
    setCurrentTopic(topic);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs = [
    { id: 'notes', label: 'Notes', icon: BookText },
    { id: 'flashcards', label: 'Flashcards', icon: BrainCircuit },
    { id: 'checkpoints', label: 'Checkpoints', icon: GraduationCap },
    { id: 'lab', label: 'Virtual Lab', icon: Microscope },
  ];

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans overflow-hidden">
      <Sidebar 
        curriculum={CURRICULUM}
        currentUnitId={currentUnit.id}
        currentTopicId={currentTopic.id}
        onSelectTopic={handleSelectTopic}
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 p-4 md:hidden flex items-center justify-between z-10 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-slate-800 truncate px-2">{currentTopic.name}</span>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </header>

        {/* Tab Navigation - Sticky */}
        <div className="bg-white border-b border-slate-200 shadow-sm z-10 shrink-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 md:space-x-8 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`
                      flex items-center gap-2 py-4 px-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap
                      ${isActive 
                        ? 'border-emerald-500 text-emerald-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                    `}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'fill-emerald-100' : ''}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-5xl mx-auto h-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-emerald-600 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <Loader2 className="w-12 h-12 animate-spin relative z-10" />
                </div>
                <div className="flex items-center space-x-2 text-lg font-medium animate-pulse">
                  <Sparkles className="w-5 h-5" />
                  <span>Synthesizing biological data with Gemini AI...</span>
                </div>
                <p className="text-slate-500 text-sm">Using gemini-2.5-flash for reasoning</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg text-center max-w-lg mx-auto mt-20">
                <h3 className="text-lg font-bold mb-2">Error Loading Content</h3>
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-900 rounded-md text-sm font-medium transition-colors"
                >
                  Reload App
                </button>
              </div>
            ) : content ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                {activeTab === 'notes' && (
                  <NotebookPage 
                    title={currentTopic.name} 
                    content={content.notes} 
                    images={generatedImages}
                    imageLoading={imageLoading}
                  />
                )}
                {activeTab === 'flashcards' && (
                  <FlashcardDeck cards={content.flashcards} />
                )}
                {activeTab === 'checkpoints' && (
                  <CheckpointQuiz questions={content.checkpoints} />
                )}
                {activeTab === 'lab' && (
                  <VirtualLab labData={content.lab} />
                )}
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;