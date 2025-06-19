import { supabase } from '../lib/supabase'

export interface SearchResult {
  id: string
  title: string
  tv_show: string
  season?: number
  episode?: number
  content?: string
  author: string
  votes: number
  comment_count: number
  timestamp: string
  category: string
  relevance_score: number
  match_type: 'title' | 'content' | 'tv_show' | 'semantic'
}

export interface AISearchResponse {
  results: SearchResult[]
  enhanced_query: string
  suggestions: string[]
  total_count: number
  search_time_ms: number
}

export interface SearchOptions {
  category?: string
  limit?: number
  includeContent?: boolean
}

export const performAISearch = async (
  query: string, 
  options: SearchOptions = {}
): Promise<AISearchResponse> => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    
    if (!supabaseUrl) {
      throw new Error('Supabase URL not configured')
    }

    const apiUrl = `${supabaseUrl}/functions/v1/ai-search`
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        query,
        category: options.category,
        limit: options.limit || 20,
        includeContent: options.includeContent || false,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Search failed with status ${response.status}`)
    }

    const data: AISearchResponse = await response.json()
    return data

  } catch (error) {
    console.error('AI search failed:', error)
    
    // Fallback to local search
    return performLocalSearch(query, options)
  }
}

export const performLocalSearch = async (
  query: string, 
  options: SearchOptions = {}
): Promise<AISearchResponse> => {
  const startTime = Date.now()
  
  try {
    let supabaseQuery = supabase
      .from('posts')
      .select(`
        id,
        title,
        tv_show,
        season,
        episode,
        ${options.includeContent ? 'content,' : ''}
        author,
        votes,
        comment_count,
        timestamp,
        category
      `)

    // Apply category filter
    if (options.category && options.category !== 'all') {
      supabaseQuery = supabaseQuery.eq('category', options.category)
    }

    // Perform text search
    const searchConditions = [
      `title.ilike.%${query}%`,
      `tv_show.ilike.%${query}%`,
      `author.ilike.%${query}%`,
      `category.ilike.%${query}%`
    ]
    
    if (options.includeContent) {
      searchConditions.push(`content.ilike.%${query}%`)
    }
    
    const { data, error } = await supabaseQuery
      .or(searchConditions.join(','))
      .order('created_at', { ascending: false })
      .limit(options.limit || 20)

    if (error) {
      throw error
    }

    // Calculate relevance scores
    const results: SearchResult[] = (data || []).map(post => ({
      ...post,
      relevance_score: calculateLocalRelevanceScore(post, query),
      match_type: determineMatchType(post, query)
    }))

    return {
      results: results.sort((a, b) => b.relevance_score - a.relevance_score),
      enhanced_query: query,
      suggestions: generateLocalSuggestions(query),
      total_count: results.length,
      search_time_ms: Date.now() - startTime
    }

  } catch (error) {
    console.error('Local search failed:', error)
    
    return {
      results: [],
      enhanced_query: query,
      suggestions: [],
      total_count: 0,
      search_time_ms: Date.now() - startTime
    }
  }
}

function calculateLocalRelevanceScore(post: any, query: string): number {
  let score = 0
  const lowerQuery = query.toLowerCase()
  
  // Title match
  if (post.title?.toLowerCase().includes(lowerQuery)) {
    score += 100
  }
  
  // TV show match
  if (post.tv_show?.toLowerCase().includes(lowerQuery)) {
    score += 80
  }
  
  // Content match
  if (post.content?.toLowerCase().includes(lowerQuery)) {
    score += 60
  }
  
  // Popularity bonus
  score += Math.min(post.votes || 0, 50)
  score += Math.min((post.comment_count || 0) * 2, 30)
  
  return score
}

function determineMatchType(post: any, query: string): SearchResult['match_type'] {
  const lowerQuery = query.toLowerCase()
  
  if (post.title?.toLowerCase().includes(lowerQuery)) {
    return 'title'
  }
  if (post.tv_show?.toLowerCase().includes(lowerQuery)) {
    return 'tv_show'
  }
  if (post.content?.toLowerCase().includes(lowerQuery)) {
    return 'content'
  }
  
  return 'semantic'
}

function generateLocalSuggestions(query: string): string[] {
  const suggestions: string[] = []
  const lowerQuery = query.toLowerCase()
  
  // Add common TV-related suggestions
  if (lowerQuery.includes('season')) {
    suggestions.push(`${query} finale`, `${query} episodes`, `${query} review`)
  }
  
  if (lowerQuery.includes('episode')) {
    suggestions.push(`${query} discussion`, `${query} recap`, `${query} analysis`)
  }
  
  // Add genre-based suggestions
  const genres = ['drama', 'comedy', 'thriller', 'sci-fi', 'fantasy']
  genres.forEach(genre => {
    if (lowerQuery.includes(genre)) {
      suggestions.push(`best ${genre} shows`, `${genre} recommendations`)
    }
  })
  
  return suggestions.slice(0, 5)
}