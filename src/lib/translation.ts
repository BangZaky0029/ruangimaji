
/**
 * Simple translation service using Google's unofficial GTX API
 * Includes persistent caching via LocalStorage to minimize API calls.
 */

const CACHE_KEY = 'ruang_imaji_translation_cache';

// Load cache from localStorage
const getCache = (): Record<string, string> => {
    try {
        return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    } catch {
        return {};
    }
};

const saveToCache = (text: string, translated: string) => {
    const cache = getCache();
    cache[text] = translated;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

export const translateToIndo = async (text: string): Promise<string> => {
    if (!text) return text;

    const cache = getCache();
    if (cache[text]) return cache[text];

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=id&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        const translated = data[0][0][0];

        if (translated) {
            saveToCache(text, translated);
            return translated;
        }
        return text;
    } catch (error) {
        console.warn(`Translation failed for: "${text}"`, error);
        return text; // Fallback to original
    }
};
