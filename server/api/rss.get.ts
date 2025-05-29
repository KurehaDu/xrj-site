export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const uid = query.uid as string

  const runtimeConfig = useRuntimeConfig()

  if (!uid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bilibili UID is required'
    })
  }

  const rssHubBaseUrl = runtimeConfig.public.rssBaseUrl

  if (!rssHubBaseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'RSSHub base URL is not configured'
    })
  }

  const targetUrl = `${rssHubBaseUrl}/bilibili/user/dynamic/${uid}`

  try {
    const tls = await import('tls')
    const { URL } = await import('url')
    
    const url = new URL(targetUrl)
    
    const response = await new Promise<string>((resolve, reject) => {
      const socket = tls.connect({
        host: url.hostname,
        port: 443,
        rejectUnauthorized: true,
        timeout: 30000
      }, () => {
        const request = [
          `GET ${url.pathname}${url.search} HTTP/1.1`,
          `Host: ${url.hostname}`,
          'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
          'Accept: application/rss+xml, application/xml, text/xml, */*',
          'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8',
          'Accept-Encoding: identity',
          'Cache-Control: no-cache',
          'Connection: close',
          '',
          ''
        ].join('\r\n')
        
        socket.write(request)
      })
      
      let data = ''
      socket.on('data', (chunk) => {
        data += chunk.toString()
      })
      
      socket.on('end', () => {
        resolve(data)
      })
      
      socket.on('error', reject)
      socket.on('timeout', () => {
        socket.destroy()
        reject(new Error('Request timeout'))
      })
    })
    
    const parts = response.split('\r\n\r\n')
    const headers = parts[0]
    const body = parts.slice(1).join('\r\n\r\n')
    
    const statusLine = headers.split('\r\n')[0]
    const statusCode = parseInt(statusLine.split(' ')[1])
    
    if (statusCode !== 200) {
      throw new Error(`HTTP ${statusCode}: ${statusLine}`)
    }
    
    event.node.res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    event.node.res.setHeader('Cache-Control', 'public, max-age=300') // 5分钟缓存
    
    return body
  } catch (error: any) {
    console.error(`Error fetching RSS feed from ${targetUrl}:`, error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: `Failed to fetch RSS feed: ${error.message}`,
    })
  }
}) 