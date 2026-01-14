
/**
 * EchoMasters Neural Cache Utility
 * Manages Cache API for binary audio and synthetic text responses.
 */

const CACHE_NAME = 'echomasters-v1-cache';

export const cacheHelper = {
  /**
   * Stores a blob (like PCM audio) in the cache with a unique key.
   */
  async putBlob(key: string, data: Uint8Array, mimeType: string) {
    try {
      const cache = await caches.open(CACHE_NAME);
      const response = new Response(data, {
        headers: { 
          'Content-Type': mimeType,
          'Content-Length': data.length.toString(),
          'X-Cache-Date': new Date().toISOString()
        },
      });
      await cache.put(new Request(key), response);
    } catch (e) {
      console.error('Neural Cache Put Error:', e);
    }
  },

  /**
   * Retrieves a blob from the cache.
   */
  async getBlob(key: string): Promise<Uint8Array | null> {
    try {
      const cache = await caches.open(CACHE_NAME);
      const response = await cache.match(new Request(key));
      if (!response) return null;
      const buffer = await response.arrayBuffer();
      return new Uint8Array(buffer);
    } catch (e) {
      return null;
    }
  },

  /**
   * Stores generated text in the cache.
   */
  async putText(key: string, text: string) {
    const data = new TextEncoder().encode(text);
    await this.putBlob(key, data, 'text/plain');
  },

  /**
   * Retrieves generated text from the cache.
   */
  async getText(key: string): Promise<string | null> {
    const data = await this.getBlob(key);
    if (!data) return null;
    return new TextDecoder().decode(data);
  }
};
