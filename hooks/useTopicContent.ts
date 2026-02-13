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
        let isMounted = true;

        const fetchContent = async (retryCount = 0) => {
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

                if (!isMounted) return;

                if (!data) {
                    throw new Error("No content generated");
                }

                setContent(data);

                // Fetch visual aids if provided
                if (data.visuals && data.visuals.length > 0) {
                    setImageLoading(true);

                    // Stagger the image calls to avoid quota issues
                    const imageResults: GeneratedImage[] = [];

                    for (const visual of data.visuals) {
                        if (!isMounted) break;

                        // Wait 1.5 seconds before generating each image to stay under the 10 RPM multimodal limit
                        await new Promise(resolve => setTimeout(resolve, 1500));

                        try {
                            const url = await generateBiologyImage(visual.prompt);
                            if (url) {
                                imageResults.push({ url, caption: visual.caption });
                            }
                        } catch (err) {
                            console.error("Failed to generate image:", err);
                        }
                    }

                    if (isMounted) {
                        setGeneratedImages(imageResults);
                        contentCache.set(cacheKey, { content: data, images: imageResults });
                        setImageLoading(false);
                    }
                } else {
                    if (isMounted) {
                        contentCache.set(cacheKey, { content: data, images: [] });
                    }
                }
            } catch (err: any) {
                if (!isMounted) return;

                console.error(err);

                // Basic exponential backoff if it's a 429 and we're under retry limit
                if (err.message?.includes('429') && retryCount < 2) {
                    const delay = Math.pow(2, retryCount) * 3000;
                    setTimeout(() => fetchContent(retryCount + 1), delay);
                    return;
                }

                setError(err.message?.includes('429')
                    ? "BioLens is experiencing high traffic. Generating biology diagrams takes extra capacity. Please wait 30 seconds and try again."
                    : "Failed to generate content. Please check your connection and API key."
                );
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchContent();

        return () => {
            isMounted = false;
        };
    }, [currentUnit.id, currentTopic.id]);

    return {
        content,
        generatedImages,
        loading,
        imageLoading,
        error
    };
};
