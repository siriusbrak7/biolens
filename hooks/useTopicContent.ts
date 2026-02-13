import { useState, useEffect } from 'react';
import { Unit, Topic, GeneratedContent, GeneratedImage } from '../types';
import { generateTopicContent, generateBiologyImage } from '../services/geminiService';

export const useTopicContent = (currentUnit: Unit, currentTopic: Topic) => {
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      setContent(null);
      setGeneratedImages([]);
      
      try {
        const data = await generateTopicContent(currentUnit.name, currentTopic.name);
        
        if (!data) {
          throw new Error("No content generated");
        }
        
        setContent(data);

        // Fetch multiple images in parallel if visuals are provided
        if (data.visuals && data.visuals.length > 0) {
          setImageLoading(true);
          
          const imagePromises = data.visuals.map(async (visual) => {
            try {
              const url = await generateBiologyImage(visual.prompt);
              return url ? { url, caption: visual.caption } : null;
            } catch (err) {
              console.error("Failed to generate image:", err);
              return null;
            }
          });

          const results = await Promise.all(imagePromises);
          // Filter out failed image generations (nulls)
          setGeneratedImages(results.filter((img): img is GeneratedImage => img !== null));
          setImageLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to generate content. Please check your API key in .env.local.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [currentUnit.id, currentTopic.id]);

  return {
    content,
    generatedImages,
    loading,
    imageLoading,
    error
  };
};
