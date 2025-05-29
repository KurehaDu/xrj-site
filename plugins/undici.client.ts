export default defineNuxtPlugin(() => {
  if (import.meta.client && globalThis) {
    try {
      const undiciSymbol = Symbol.for('undici.globalDispatcher.1')
      
      if ((globalThis as any)[undiciSymbol]) {
        const currentDispatcher = (globalThis as any)[undiciSymbol]
        
        ;(globalThis as any)[undiciSymbol] = new currentDispatcher.constructor({
          allowH2: true,
          keepAliveTimeout: 10000,
          keepAliveMaxTimeout: 10000,
        })
      }
    } catch (error) {
      console.warn('Failed to enable HTTP/2 support:', error)
    }
  }
}) 