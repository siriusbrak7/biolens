import React, { useState } from 'react';
import { LabData } from '../types';
import { FlaskConical, ClipboardCheck, AlertTriangle, Play, Check } from 'lucide-react';

interface VirtualLabProps {
  labData: LabData;
}

const VirtualLab: React.FC<VirtualLabProps> = ({ labData }) => {
  const [step, setStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [experimentStarted, setExperimentStarted] = useState(false);

  const toggleStep = (index: number) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(prev => prev.filter(i => i !== index));
    } else {
      setCompletedSteps(prev => [...prev, index]);
    }
  };

  const progress = Math.round((completedSteps.length / labData.procedure.length) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-8">
          <div className="flex items-center gap-3 mb-2 text-emerald-400">
            <FlaskConical className="w-6 h-6" />
            <span className="uppercase tracking-widest font-bold text-sm">Virtual Lab Simulation</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">{labData.title}</h1>
          <p className="text-slate-300 text-lg leading-relaxed">{labData.objective}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Left Panel: Info & Materials */}
          <div className="bg-slate-50 p-6 lg:border-r border-slate-200 space-y-8">
            <div>
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Safety First
              </h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
                {labData.safety}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-3">Materials Needed</h3>
              <ul className="space-y-2">
                {labData.materials.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-700 text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-6 border-t border-slate-200">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Experiment Progress</div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div 
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-slate-500 mt-1">{progress}% Complete</div>
            </div>
          </div>

          {/* Right Panel: Procedure */}
          <div className="lg:col-span-2 p-6 lg:p-8">
            {!experimentStarted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                  <FlaskConical className="w-10 h-10 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Ready to begin?</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mt-2">
                    Review the materials and safety guidelines on the left before starting the procedure.
                  </p>
                </div>
                <button 
                  onClick={() => setExperimentStarted(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-200 hover:scale-105"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Start Experiment
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <ClipboardCheck className="w-6 h-6 text-emerald-600" />
                  Procedure
                </h3>
                
                <div className="space-y-4">
                  {labData.procedure.map((stepText, index) => {
                    const isCompleted = completedSteps.includes(index);
                    return (
                      <div 
                        key={index} 
                        onClick={() => toggleStep(index)}
                        className={`
                          relative flex gap-4 p-4 rounded-xl border transition-all cursor-pointer group
                          ${isCompleted ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 hover:border-emerald-300'}
                        `}
                      >
                        <div className={`
                          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors
                          ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-slate-400 group-hover:border-emerald-400 group-hover:text-emerald-400'}
                        `}>
                          {isCompleted ? <Check className="w-5 h-5" /> : <span className="font-bold">{index + 1}</span>}
                        </div>
                        <div className="flex-1">
                          <p className={`text-slate-700 leading-relaxed ${isCompleted ? 'text-emerald-900' : ''}`}>
                            {stepText}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {progress === 100 && (
                  <div className="mt-8 bg-green-100 text-green-800 p-6 rounded-xl text-center animate-pulse">
                    <h4 className="font-bold text-lg mb-2">Experiment Complete! 🎉</h4>
                    <p>You have successfully completed all steps of the procedure. Analyze your data in your notebook.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualLab;
