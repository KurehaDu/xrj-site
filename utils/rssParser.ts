import Parser from 'rss-parser'

interface RSSItem {
  title?: string
  content?: string
  contentSnippet?: string
  guid?: string
  link?: string
  isoDate?: string
  pubDate?: string
}

interface RSSFeed {
  title?: string
  description?: string
  link?: string
  image?: {
    title?: string
  }
  items?: RSSItem[]
}

export function cleanContentSnippet(content: string, maxLength = 100): string {
  if (!content) return ''
  
  let cleaned = content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p>/gi, '\n\n')
  
  cleaned = cleaned.replace(/<[^>]*>/g, '')
  
  cleaned = cleaned.replace(/^(\s*-\s*)+/, '')
  
  cleaned = cleaned
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/[ \t]+/g, ' ') 
    .trim()
  
  if (cleaned.length > maxLength) {
    const truncated = cleaned.substring(0, maxLength)
    const lastNewline = truncated.lastIndexOf('\n')
    if (lastNewline > maxLength * 0.7) {
      return truncated.substring(0, lastNewline) + '...'
    }
    return truncated + '...'
  }
  
  return cleaned
}

/**
 * 从 string 解析 RSS XML
 * 使用 rss-parser 库，更稳定可靠
 */
export async function rssParserString(xmlString: string): Promise<RSSFeed> {
  try {
    const parser = new Parser()
    const feed = await parser.parseString(xmlString)
    
    return {
      title: feed.title?.trim() || '',
      description: feed.description?.trim() || '',
      link: feed.link?.trim() || '',
      items: feed.items?.map((item: any) => ({
        title: item.title?.trim() || '',
        link: item.link?.trim() || '',
        pubDate: item.pubDate?.trim() || '',
        contentSnippet: cleanContentSnippet(item.contentSnippet || item.content || ''),
        content: item.content?.trim() || '',
        guid: item.guid?.trim() || ''
      })) || []
    }
  } catch (error) {
    console.error('RSS解析失败:', error)
    throw error
  }
}

export function manualRssParser(rssData: string): RSSFeed {
  try {
    rssData = rssData.replace(/^\uFEFF/, '')
    rssData = rssData.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') 
    rssData = rssData.trim()
    
    if (rssData.toLowerCase().startsWith('<!doctype html') || 
        rssData.toLowerCase().startsWith('<html')) {
      throw new Error('数据是HTML而不是RSS XML')
    }
    
    if (!rssData.startsWith('<?xml')) {
      throw new Error('数据不是有效的XML格式')
    }

    const rssMatch = rssData.match(/<rss[^>]*>([\s\S]*)<\/rss>/i)
    if (!rssMatch) {
      throw new Error('未找到RSS根元素')
    }
    
    const channelMatch = rssMatch[1].match(/<channel[^>]*>([\s\S]*)<\/channel>/i)
    if (!channelMatch) {
      throw new Error('未找到channel元素')
    }
    
    const titleMatch = channelMatch[1].match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    const descMatch = channelMatch[1].match(/<description[^>]*>([\s\S]*?)<\/description>/i)
    const linkMatch = channelMatch[1].match(/<link[^>]*>([\s\S]*?)<\/link>/i)
    
    const feedTitle = titleMatch?.[1]?.trim() || ''
    const feedDesc = descMatch?.[1]?.trim() || ''
    const feedLink = linkMatch?.[1]?.trim() || ''
    
    const itemMatches = channelMatch[1].match(/<item[^>]*>[\s\S]*?<\/item>/gi)
    if (!itemMatches || itemMatches.length === 0) {
      return {
        title: feedTitle,
        description: feedDesc,
        link: feedLink,
        items: []
      }
    }
    
    const items = itemMatches.map((itemStr) => {
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
        content: description,
        link,
        pubDate,
        isoDate: pubDate,
        guid
      }
    })
    
    return {
      title: feedTitle,
      description: feedDesc,
      link: feedLink,
      items
    }
    
  } catch (error) {
    console.error('手动RSS解析失败:', error)
    throw error
  }
} 