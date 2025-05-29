export default defineNuxtPlugin(() => {
  if (import.meta.server) {
    try {
      const undiciSymbol = Symbol.for('undici.globalDispatcher.1')
      
      if ((globalThis as any)[undiciSymbol]) {
        const currentDispatcher = (globalThis as any)[undiciSymbol]
        
        ;(globalThis as any)[undiciSymbol] = new currentDispatcher.constructor({
          allowH2: true,                    
          keepAliveTimeout: 30000,
          headersTimeout: 30000,
          connections: 20,
          connect: {
            timeout: 30000,
            rejectUnauthorized: true
          }
        })
      }
    } catch (error) {
      console.warn('Failed to configure undici:', error)
    }
  }
}) 