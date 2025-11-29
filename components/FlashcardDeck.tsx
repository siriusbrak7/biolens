import React, { useState } from 'react';
import { Flashcard } from '../types';
import { ArrowLeft, ArrowRight, RotateCw, HelpCircle } from 'lucide-react';

interface FlashcardDeckProps {
  cards: Flashcard[];
}

const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 200);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (!cards || cards.length === 0) {
    return <div className="text-center p-10 text-slate-500">No flashcards available.</div>;
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] max-w-2xl mx-auto p-4">
      <div className="mb-6 flex items-center justify-between w-full px-4 text-emerald-800">
        <span className="font-mono text-sm font-bold bg-emerald-100 px-3 py-1 rounded-full">
          Card {currentIndex + 1} of {cards.length}
        </span>
        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <HelpCircle size={16} />
          <span>Click card to flip</span>
        </div>
      </div>

      <div 
        className="relative w-full aspect-[3/2] cursor-pointer perspective-1000 group"
        onClick={handleFlip}
      >
        <div className={`
          relative w-full h-full transition-all duration-500 transform-style-3d shadow-xl rounded-2xl
          ${isFlipped ? 'rotate-y-180' : ''}
        `}>
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white border-2 border-emerald-100 rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-sm group-hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-4">Term</h3>
            <p className="text-3xl font-serif text-slate-800">{currentCard.front}</p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden bg-emerald-600 rounded-2xl rotate-y-180 flex flex-col items-center justify-center p-8 text-center text-white">
            <h3 className="text-sm font-bold text-emerald-200 uppercase tracking-widest mb-4">Definition</h3>
            <p className="text-xl leading-relaxed">{currentCard.back}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-8 mt-10">
        <button 
          onClick={handlePrev}
          className="p-4 rounded-full bg-white border border-emerald-100 text-emerald-600 hover:bg-emerald-50 hover:scale-105 transition-all shadow-sm"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <button 
          onClick={handleFlip}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-100 text-emerald-800 font-medium hover:bg-emerald-200 transition-colors"
        >
          <RotateCw className="w-5 h-5" />
          <span>Flip</span>
        </button>

        <button 
          onClick={handleNext}
          className="p-4 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105 transition-all shadow-md shadow-emerald-200"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default FlashcardDeck;
