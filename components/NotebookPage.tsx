import React from 'react';
import { ImageIcon, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { GeneratedImage } from '../types';

interface NotebookPageProps {
  title: string;
  content: string;
  images: GeneratedImage[];
  imageLoading: boolean;
}

const NotebookPage: React.FC<NotebookPageProps> = ({ title, content, images, imageLoading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-white min-h-[600px] shadow-sm rounded-lg overflow-hidden border border-slate-200 relative"
    >
      {/* Notebook margin line */}
      <div className="absolute top-0 bottom-0 left-12 w-px bg-red-200 hidden md:block z-0"></div>

      <div className="p-8 md:pl-20 relative z-10">
        <div className="mb-6 pb-4 border-b-2 border-slate-100 flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Topic Notes</span>
            <h1 className="text-3xl font-serif text-slate-800 mt-1">{title}</h1>
          </div>
          <div className="text-slate-400 font-mono text-xs hidden sm:block">
            {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Dynamic Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {imageLoading ? (
            <>
              <div className="h-48 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-3 animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                <span className="text-xs font-medium">Generating Diagram 1...</span>
              </div>
              <div className="h-48 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-3 animate-pulse delay-150">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                <span className="text-xs font-medium">Generating Diagram 2...</span>
              </div>
            </>
          ) : images.length > 0 ? (
            images.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative aspect-video bg-slate-100">
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-500/90 text-white p-1.5 rounded-md shadow-sm">
                    <ImageIcon className="w-3 h-3" />
                  </div>
                </div>
                <div className="p-3 bg-slate-50/50 border-t border-slate-100">
                  <p className="text-xs text-slate-600 font-medium text-center">{img.caption}</p>
                </div>
              </motion.div>
            ))
          ) : null}
        </div>

        <article className="prose prose-emerald prose-lg max-w-none text-slate-700 leading-relaxed overflow-hidden">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-3xl font-extrabold text-emerald-950 mt-4 mb-6" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-emerald-900 mt-8 mb-4 border-b border-emerald-200 pb-2" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-emerald-800 mt-6 mb-3" {...props} />,
              p: ({ node, ...props }) => <p className="mb-4 text-lg" {...props} />,
              ul: ({ node, ...props }) => <ul className="ml-6 list-disc mb-4 space-y-2" {...props} />,
              ol: ({ node, ...props }) => <ol className="ml-6 list-decimal mb-4 space-y-2" {...props} />,
              li: ({ node, ...props }) => <li className="text-slate-700" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-semibold text-emerald-900" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </motion.div>
  );
};

export default NotebookPage;