import React, { useState } from 'react';
import { Unit, Topic } from '../types';
import { ChevronDown, ChevronRight, BookOpen, Dna } from 'lucide-react';

interface SidebarProps {
  curriculum: Unit[];
  currentUnitId: string | null;
  currentTopicId: string | null;
  onSelectTopic: (unit: Unit, topic: Topic) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  curriculum, 
  currentUnitId, 
  currentTopicId, 
  onSelectTopic,
  isOpen,
  toggleSidebar
}) => {
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => ({
      ...prev,
      [unitId]: !prev[unitId]
    }));
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Content */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-30 w-72 bg-emerald-900 text-emerald-50 shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
        flex flex-col
      `}>
        <div className="p-6 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Dna className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">BioLens</h1>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {curriculum.map((unit) => {
            const isExpanded = expandedUnits[unit.id] || currentUnitId === unit.id;
            return (
              <div key={unit.id} className="rounded-lg overflow-hidden border border-emerald-800/30">
                <button
                  onClick={() => toggleUnit(unit.id)}
                  className={`
                    w-full flex items-center justify-between p-3 text-left transition-colors
                    ${currentUnitId === unit.id ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-800/50 text-emerald-100'}
                  `}
                >
                  <span className="font-medium text-sm pr-2">{unit.name}</span>
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {isExpanded && (
                  <div className="bg-emerald-950/30 py-1">
                    {unit.topics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => {
                          onSelectTopic(unit, topic);
                          if (window.innerWidth < 768) toggleSidebar();
                        }}
                        className={`
                          w-full flex items-center p-2 pl-4 text-sm transition-colors border-l-2
                          ${currentTopicId === topic.id 
                            ? 'border-emerald-400 bg-emerald-800/30 text-emerald-200' 
                            : 'border-transparent text-emerald-400 hover:text-emerald-200 hover:bg-emerald-900/30'}
                        `}
                      >
                        <BookOpen className="w-3 h-3 mr-2 opacity-70" />
                        {topic.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-emerald-800 text-xs text-emerald-400 text-center">
          Powered by Gemini AI
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
