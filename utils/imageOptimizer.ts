
/**
 * Optimizes Unsplash image URLs by setting the width parameter.
 * Default width is 1080px.
 */
export const optimizeUnsplashUrl = (url: string, width: number = 1080): string => {
  if (!url || !url.includes('images.unsplash.com')) return url;
  
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('w', width.toString());
    urlObj.searchParams.set('q', '80');
    urlObj.searchParams.set('auto', 'format');
    urlObj.searchParams.set('fit', 'crop');
    return urlObj.toString();
  } catch (e) {
    return url;
  }
};
