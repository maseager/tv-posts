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

// Mock data for search results
const mockPosts: Omit<SearchResult, 'relevance_score' | 'match_type'>[] = [
  {
    id: '1',
    title: 'Breaking Bad Season 5 Finale Discussion',
    tv_show: 'Breaking Bad',
    season: 5,
    episode: 16,
    content: 'What an incredible ending to one of the greatest TV series ever made. Walter White\'s journey comes full circle.',
    author: 'tvfanatic92',
    votes: 245,
    comment_count: 89,
    timestamp: '2024-01-15T10:30:00Z',
    category: 'discussion'
  },
  {
    id: '2',
    title: 'Stranger Things 4 Theory: Will Byers Connection',
    tv_show: 'Stranger Things',
    season: 4,
    episode: null,
    content: 'I think Will still has a connection to the Upside Down that hasn\'t been fully explored.',
    author: 'hawkinsexplorer',
    votes: 156,
    comment_count: 67,
    timestamp: '2024-01-14T15:45:00Z',
    category: 'theory'
  },
  {
    id: '3',
    title: 'The Office Best Episodes Ranked',
    tv_show: 'The Office',
    season: null,
    episode: null,
    content: 'My personal ranking of the top 10 episodes from The Office US version.',
    author: 'dundermifflin',
    votes: 89,
    comment_count: 34,
    timestamp: '2024-01-13T09:20:00Z',
    category: 'ranking'
  },
  {
    id: '4',
    title: 'Game of Thrones Season 8 Retrospective',
    tv_show: 'Game of Thrones',
    season: 8,
    episode: null,
    content: 'Looking back at Season 8 with fresh eyes - was it really that bad?',
    author: 'winteriscoming',
    votes: 312,
    comment_count: 156,
    timestamp: '2024-01-12T18:15:00Z',
    category: 'review'
  },
  {
    id: '5',
    title: 'House of the Dragon vs Game of Thrones',
    tv_show: 'House of the Dragon',
    season: 1,
    episode: null,
    content: 'Comparing the new series to the original - which one do you prefer?',
    author: 'dragonrider',
    votes: 198,
    comment_count: 78,
    timestamp: '2024-01-11T14:30:00Z',
    category: 'comparison'
  },
  {
    id: '6',
    title: 'Wednesday Addams Character Analysis',
    tv_show: 'Wednesday',
    season: 1,
    episode: null,
    content: 'Jenna Ortega\'s portrayal of Wednesday is absolutely perfect. Let\'s discuss her character development.',
    author: 'nevermore_student',
    votes: 134,
    comment_count: 45,
    timestamp: '2024-01-10T11:45:00Z',
    category: 'analysis'
  },
  {
    id: '7',
    title: 'The Mandalorian Season 3 Episode 8 Review',
    tv_show: 'The Mandalorian',
    season: 3,
    episode: 8,
    content: 'The season finale was epic! Din Djarin\'s journey continues to amaze.',
    author: 'thisIsTheWay',
    votes: 267,
    comment_count: 92,
    timestamp: '2024-01-09T20:00:00Z',
    category: 'review'
  },
  {
    id: '8',
    title: 'Better Call Saul Ending Explained',
    tv_show: 'Better Call Saul',
    season: 6,
    episode: 13,
    content: 'The series finale perfectly wrapped up Jimmy McGill\'s story. Here\'s my interpretation.',
    author: 'slippinJimmy',
    votes: 189,
    comment_count: 67,
    timestamp: '2024-01-08T16:30:00Z',
    category: 'explanation'
  },
  {
    id: '9',
    title: 'Friends Reunion Special Thoughts',
    tv_show: 'Friends',
    season: null,
    episode: null,
    content: 'The reunion brought back so many memories. What did everyone think?',
    author: 'centralPerkFan',
    votes: 145,
    comment_count: 89,
    timestamp: '2024-01-07T13:15:00Z',
    category: 'discussion'
  },
  {
    id: '10',
    title: 'The Last of Us Episode 3 Emotional Impact',
    tv_show: 'The Last of Us',
    season: 1,
    episode: 3,
    content: 'Bill and Frank\'s story was beautifully told. This episode hit different.',
    author: 'survivorStory',
    votes: 298,
    comment_count: 112,
    timestamp: '2024-01-06T19:45:00Z',
    category: 'discussion'
  },
  {
    id: '11',
    title: 'The Bear Season 2 Stress Levels',
    tv_show: 'The Bear',
    season: 2,
    episode: null,
    content: 'This show gives me anxiety in the best way possible. The kitchen chaos is so realistic.',
    author: 'chefLife',
    votes: 167,
    comment_count: 54,
    timestamp: '2024-01-05T12:30:00Z',
    category: 'discussion'
  },
  {
    id: '12',
    title: 'Succession Series Finale Analysis',
    tv_show: 'Succession',
    season: 4,
    episode: 10,
    content: 'The Roy family saga ends perfectly. Logan\'s legacy and the kids\' futures.',
    author: 'waystarRoyco',
    votes: 234,
    comment_count: 98,
    timestamp: '2024-01-04T17:20:00Z',
    category: 'analysis'
  },
  {
    id: '13',
    title: 'Euphoria Season 2 Cinematography',
    tv_show: 'Euphoria',
    season: 2,
    episode: null,
    content: 'The visual style of this show is absolutely stunning. Every frame is art.',
    author: 'visualArtist',
    votes: 178,
    comment_count: 43,
    timestamp: '2024-01-03T14:45:00Z',
    category: 'technical'
  },
  {
    id: '14',
    title: 'The Crown Season 6 Historical Accuracy',
    tv_show: 'The Crown',
    season: 6,
    episode: null,
    content: 'How accurate is the portrayal of recent royal events? Let\'s fact-check.',
    author: 'royalWatcher',
    votes: 123,
    comment_count: 67,
    timestamp: '2024-01-02T10:15:00Z',
    category: 'analysis'
  },
  {
    id: '15',
    title: 'Ozark Series Ending Discussion',
    tv_show: 'Ozark',
    season: 4,
    episode: 14,
    content: 'The Byrde family\'s story concludes. Did they get what they deserved?',
    author: 'laundryExpert',
    votes: 201,
    comment_count: 85,
    timestamp: '2024-01-01T21:30:00Z',
    category: 'discussion'
  }
];

export const performAISearch = async (
  query: string, 
  options: SearchOptions = {}
): Promise<AISearchResponse> => {
  const startTime = Date.now();
  
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
    
    const results = performLocalSearch(query, options);
    
    return {
      results: results.slice(0, options.limit || 20),
      enhanced_query: query,
      suggestions: generateLocalSuggestions(query),
      total_count: results.length,
      search_time_ms: Date.now() - startTime
    };

  } catch (error) {
    console.error('Search failed:', error);
    
    return {
      results: [],
      enhanced_query: query,
      suggestions: [],
      total_count: 0,
      search_time_ms: Date.now() - startTime
    };
  }
};

function performLocalSearch(query: string, options: SearchOptions = {}): SearchResult[] {
  const lowerQuery = query.toLowerCase();
  
  // Filter posts based on search query
  let filteredPosts = mockPosts.filter(post => {
    // Apply category filter
    if (options.category && options.category !== 'all' && post.category !== options.category) {
      return false;
    }
    
    // Search in multiple fields
    const searchFields = [
      post.title,
      post.tv_show,
      post.author,
      post.category,
      options.includeContent ? post.content : ''
    ].filter(Boolean);
    
    return searchFields.some(field => 
      field?.toLowerCase().includes(lowerQuery)
    );
  });
  
  // Calculate relevance scores and match types
  const results: SearchResult[] = filteredPosts.map(post => ({
    ...post,
    relevance_score: calculateLocalRelevanceScore(post, query),
    match_type: determineMatchType(post, query)
  }));
  
  // Sort by relevance score
  return results.sort((a, b) => b.relevance_score - a.relevance_score);
}

function calculateLocalRelevanceScore(post: any, query: string): number {
  let score = 0;
  const lowerQuery = query.toLowerCase();
  
  // Exact title match gets highest score
  if (post.title?.toLowerCase() === lowerQuery) {
    score += 200;
  } else if (post.title?.toLowerCase().includes(lowerQuery)) {
    score += 100;
  }
  
  // TV show match
  if (post.tv_show?.toLowerCase() === lowerQuery) {
    score += 150;
  } else if (post.tv_show?.toLowerCase().includes(lowerQuery)) {
    score += 80;
  }
  
  // Content match (if included)
  if (post.content?.toLowerCase().includes(lowerQuery)) {
    score += 60;
  }
  
  // Author match
  if (post.author?.toLowerCase().includes(lowerQuery)) {
    score += 40;
  }
  
  // Category match
  if (post.category?.toLowerCase().includes(lowerQuery)) {
    score += 30;
  }
  
  // Popularity bonus (engagement metrics)
  score += Math.min(post.votes || 0, 100) * 0.5;
  score += Math.min((post.comment_count || 0) * 2, 50);
  
  // Recency bonus (newer posts get slight boost)
  const postDate = new Date(post.timestamp);
  const daysSincePost = (Date.now() - postDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSincePost < 7) {
    score += 20;
  } else if (daysSincePost < 30) {
    score += 10;
  }
  
  return Math.round(score);
}

function determineMatchType(post: any, query: string): SearchResult['match_type'] {
  const lowerQuery = query.toLowerCase();
  
  if (post.title?.toLowerCase().includes(lowerQuery)) {
    return 'title';
  }
  if (post.tv_show?.toLowerCase().includes(lowerQuery)) {
    return 'tv_show';
  }
  if (post.content?.toLowerCase().includes(lowerQuery)) {
    return 'content';
  }
  
  return 'semantic';
}

function generateLocalSuggestions(query: string): string[] {
  const suggestions: string[] = [];
  const lowerQuery = query.toLowerCase();
  
  // Add common TV-related suggestions
  if (lowerQuery.includes('season')) {
    suggestions.push(`${query} finale`, `${query} episodes`, `${query} review`);
  }
  
  if (lowerQuery.includes('episode')) {
    suggestions.push(`${query} discussion`, `${query} recap`, `${query} analysis`);
  }
  
  // Add show-specific suggestions
  const shows = ['Breaking Bad', 'Stranger Things', 'The Office', 'Game of Thrones', 'House of the Dragon'];
  shows.forEach(show => {
    if (show.toLowerCase().includes(lowerQuery)) {
      suggestions.push(`${show} theories`, `${show} episodes`, `${show} characters`);
    }
  });
  
  // Add genre-based suggestions
  const genres = ['drama', 'comedy', 'thriller', 'sci-fi', 'fantasy'];
  genres.forEach(genre => {
    if (lowerQuery.includes(genre)) {
      suggestions.push(`best ${genre} shows`, `${genre} recommendations`);
    }
  });
  
  return suggestions.slice(0, 5);
}