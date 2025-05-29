import { rssParserString, manualRssParser, cleanContentSnippet } from '~/utils/rssParser'
import { timeFormat } from '~/utils/timeFormat'

interface DynamicItem {
  title?: string
  contentSnippet?: string
  link?: string
  isoDate?: string
  guid?: string
}

/**
 * B站动态获取composable
 */
export function useBiliDynamic(uid: string) {
  const runtimeConfig = useRuntimeConfig()

  // 如果没有配置uid，则禁用动态功能
  if (!uid) {
    return {
      dynamic: ref<DynamicItem[]>([]),
      loading: ref(false),
      error: ref<string | null>(null),
      enableDynamic: false,
    }
  }

  const dynamic = ref<DynamicItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchDynamic = async () => {
    if (!uid) return

    loading.value = true
    error.value = null

    try {
      const response = await fetch(`/api/rss?uid=${uid}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      let rssData = await response.text()
      
      rssData = rssData.replace(/^\uFEFF/, '') // 移除BOM
      rssData = rssData.replace(/^[\s\r\n]*/, '') // 移除开头的所有空白字符
      rssData = rssData.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // 移除控制字符
      rssData = rssData.trim() // 去除首尾空白
      
      const xmlDeclIndex = rssData.indexOf('<?xml')
      if (xmlDeclIndex > 0) {
        rssData = rssData.substring(xmlDeclIndex)
      }
      
      let parsedFeed
      let parseMethod = ''
      
      try {
        // 方法1：优先使用 rss-parser 库（更稳定）
        parsedFeed = await rssParserString(rssData)
        parseMethod = 'rss-parser'
      } catch (rssParserError: any) {
        
        try {
          // 方法2：备用手动解析
          parsedFeed = manualRssParser(rssData)
          parseMethod = 'manual'
        } catch (manualError: any) {
          
          // 方法3：最后尝试更宽松的手动解析
          try {
            const rssContentMatch = rssData.match(/<rss[\s\S]*?<\/rss>/i)
            if (!rssContentMatch) {
              throw new Error('无法找到RSS内容')
            }
            
            const rssContent = rssContentMatch[0]
            const itemMatches = rssContent.match(/<item[\s\S]*?<\/item>/gi)
            
            if (!itemMatches || itemMatches.length === 0) {
              throw new Error('RSS中无动态条目')
            }
            
            const items = itemMatches.slice(0, 3).map((itemStr) => {
              const titleMatch = itemStr.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
              const linkMatch = itemStr.match(/<link[^>]*>([\s\S]*?)<\/link>/i)
              const descMatch = itemStr.match(/<description[^>]*>([\s\S]*?)<\/description>/i)
              const pubDateMatch = itemStr.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)
              const guidMatch = itemStr.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i)
              
              const title = titleMatch?.[1]?.trim() || ''
              const link = linkMatch?.[1]?.trim() || ''
              const description = descMatch?.[1]?.trim() || ''
              const pubDate = pubDateMatch?.[1]?.trim() || ''
              const guid = guidMatch?.[1]?.trim() || ''
              
              return {
                title,
                contentSnippet: cleanContentSnippet(description),
                link,
                isoDate: pubDate ? timeFormat(pubDate, 'YYYY-MM-DD HH:mm:ss') : '',
                guid
              }
            })
            
            dynamic.value = items
            return
            
          } catch (relaxedError: any) {
            throw new Error(`所有解析方法都失败了: rss-parser(${rssParserError.message}), manual(${manualError.message}), relaxed(${relaxedError.message})`)
          }
        }
      }
      
      if (!parsedFeed?.items || parsedFeed.items.length === 0) {
        dynamic.value = []
        return
      }
      
      const items = parsedFeed.items.slice(0, 3).map((item) => ({
        title: item.title || '',
        contentSnippet: item.contentSnippet || 
          (item.content ? cleanContentSnippet(item.content) : ''),
        link: item.link || '',
        isoDate: item.pubDate ? timeFormat(item.pubDate, 'YYYY-MM-DD HH:mm:ss') : (item.isoDate || ''),
        guid: item.guid || ''
      }))
      
      dynamic.value = items
      
    } catch (err: any) {
      error.value = `获取动态失败: ${err.message || '未知错误'}`
    } finally {
      loading.value = false
    }
  }

  // 页面挂载时获取数据
  onMounted(() => {
    fetchDynamic()
  })

  return {
    dynamic: readonly(dynamic),
    loading: readonly(loading),
    error: readonly(error),
    enableDynamic: true,
    refresh: fetchDynamic
  }
} 