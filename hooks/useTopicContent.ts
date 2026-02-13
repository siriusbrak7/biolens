import { useState, useEffect } from 'react';
import { Unit, Topic, GeneratedContent, GeneratedImage } from '../types';
import { generateTopicContent, generateBiologyImage } from '../services/geminiService';

// Simple in-memory cache to prevent redundant API calls
const contentCache = new Map<string, { content: GeneratedContent, images: GeneratedImage[] }>();

export const useTopicContent = (currentUnit: Unit, currentTopic: Topic) => {
    const [content, setContent] = useState<GeneratedContent | null>(null);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            const cacheKey = `${currentUnit.id}-${currentTopic.id}`;

            // Check cache first
            if (contentCache.has(cacheKey)) {
                const cached = contentCache.get(cacheKey)!;
                setContent(cached.content);
                setGeneratedImages(cached.images);
                setLoading(false);
                setImageLoading(false);
                return;
            }

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
                    const validImages = results.filter((img): img is GeneratedImage => img !== null);
                    setGeneratedImages(validImages);

                    // Store in cache
                    contentCache.set(cacheKey, { content: data, images: validImages });
                    setImageLoading(false);
                } else {
                    // Store in cache without images
                    contentCache.set(cacheKey, { content: data, images: [] });
                }
            } catch (err) {
                console.error(err);
                setError("Failed to generate content. The AI may be experiencing high demand (429 Rate Limit). Please wait a moment and try again.");
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
