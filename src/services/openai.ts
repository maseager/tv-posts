import OpenAI from 'openai';

export interface SearchSuggestion {
  text: string;
  type: 'tv_show' | 'actor' | 'genre' | 'topic' | 'character';
  description?: string;
  confidence: number;
  metadata?: {
    year?: string;
    network?: string;
    genre?: string;
    role?: string;
  };
}

// Initialize OpenAI client only if API key is available
let openai: OpenAI | null = null;

try {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (apiKey && apiKey.trim() !== '') {
    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  }
} catch (error) {
  console.warn('OpenAI client initialization failed:', error);
}

export const generateSearchSuggestions = async (query: string): Promise<SearchSuggestion[]> => {
  // Return local suggestions if OpenAI is not available
  if (!openai) {
    console.warn('OpenAI API key not configured. Using fallback suggestions.');
    return getLocalSuggestions(query);
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a TV show search assistant. Generate 8-12 diverse, categorized search suggestions based on the user's input. 
          
          Return suggestions in this JSON format:
          [
            {
              "text": "suggestion text",
              "type": "tv_show|actor|character|genre|topic",
              "description": "brief description",
              "confidence": 0.95,
              "metadata": {
                "year": "2023",
                "network": "HBO",
                "genre": "Drama"
              }
            }
          ]
          
          Types:
          - tv_show: TV series names
          - actor: Real actor/actress names
          - character: Fictional character names
          - genre: TV genres (drama, comedy, etc.)
          - topic: Discussion topics, themes, or general terms
          
          Focus on popular and relevant TV content. Include confidence scores (0.1-1.0).
          Prioritize variety across different types and ensure high-quality, relevant suggestions.
          Include both current and classic TV content when appropriate.`
        },
        {
          role: 'user',
          content: `Generate search suggestions for: "${query}"`
        }
      ],
      max_tokens: 800,
      temperature: 0.7
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      return getLocalSuggestions(query);
    }

    try {
      // Strip markdown code block delimiters if present
      let cleanContent = content;
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const suggestions = JSON.parse(cleanContent) as SearchSuggestion[];
      return suggestions.slice(0, 12);
    } catch (parseError) {
      console.error('Error parsing AI suggestions:', parseError);
      // Always fall back to local suggestions when JSON parsing fails
      return getLocalSuggestions(query);
    }

  } catch (error) {
    console.error('Error generating search suggestions:', error);
    // Always fall back to local suggestions when API call fails
    return getLocalSuggestions(query);
  }
};

export const getLocalSuggestions = (query: string): SearchSuggestion[] => {
  const lowerQuery = query.toLowerCase();
  
  const tvShows = [
    { name: 'Breaking Bad', genre: 'Crime Drama', year: '2008-2013', network: 'AMC' },
    { name: 'Stranger Things', genre: 'Sci-Fi Horror', year: '2016-2025', network: 'Netflix' },
    { name: 'The Office', genre: 'Comedy', year: '2005-2013', network: 'NBC' },
    { name: 'Game of Thrones', genre: 'Fantasy Drama', year: '2011-2019', network: 'HBO' },
    { name: 'House of the Dragon', genre: 'Fantasy Drama', year: '2022-', network: 'HBO' },
    { name: 'Wednesday', genre: 'Comedy Horror', year: '2022-', network: 'Netflix' },
    { name: 'The Mandalorian', genre: 'Sci-Fi Adventure', year: '2019-', network: 'Disney+' },
    { name: 'Better Call Saul', genre: 'Crime Drama', year: '2015-2022', network: 'AMC' },
    { name: 'Friends', genre: 'Sitcom', year: '1994-2004', network: 'NBC' },
    { name: 'The Last of Us', genre: 'Post-Apocalyptic Drama', year: '2023-', network: 'HBO' },
    { name: 'The Bear', genre: 'Comedy Drama', year: '2022-', network: 'FX' },
    { name: 'Succession', genre: 'Drama', year: '2018-2023', network: 'HBO' },
    { name: 'Euphoria', genre: 'Teen Drama', year: '2019-', network: 'HBO' },
    { name: 'The Crown', genre: 'Historical Drama', year: '2016-2023', network: 'Netflix' },
    { name: 'Ozark', genre: 'Crime Drama', year: '2017-2022', network: 'Netflix' }
  ];

  const actors = [
    { name: 'Bryan Cranston', knownFor: 'Breaking Bad, Malcolm in the Middle' },
    { name: 'Millie Bobby Brown', knownFor: 'Stranger Things, Enola Holmes' },
    { name: 'Pedro Pascal', knownFor: 'The Mandalorian, The Last of Us' },
    { name: 'Jenna Ortega', knownFor: 'Wednesday, You' },
    { name: 'Emilia Clarke', knownFor: 'Game of Thrones' },
    { name: 'Bob Odenkirk', knownFor: 'Better Call Saul, Breaking Bad' },
    { name: 'Steve Carell', knownFor: 'The Office' },
    { name: 'Jennifer Aniston', knownFor: 'Friends' },
    { name: 'Zendaya', knownFor: 'Euphoria, Spider-Man' },
    { name: 'Jeremy Strong', knownFor: 'Succession' },
    { name: 'Claire Foy', knownFor: 'The Crown' },
    { name: 'Jason Bateman', knownFor: 'Ozark, Arrested Development' }
  ];

  const characters = [
    { name: 'Walter White', show: 'Breaking Bad' },
    { name: 'Eleven', show: 'Stranger Things' },
    { name: 'Jon Snow', show: 'Game of Thrones' },
    { name: 'Wednesday Addams', show: 'Wednesday' },
    { name: 'Din Djarin', show: 'The Mandalorian' },
    { name: 'Saul Goodman', show: 'Better Call Saul' },
    { name: 'Michael Scott', show: 'The Office' },
    { name: 'Daenerys Targaryen', show: 'Game of Thrones' }
  ];

  const genres = [
    'Drama', 'Comedy', 'Sci-Fi', 'Fantasy', 'Horror', 'Crime', 'Thriller', 
    'Romance', 'Action', 'Adventure', 'Mystery', 'Documentary', 'Animation',
    'Historical', 'Teen', 'Sitcom', 'Anthology', 'Miniseries'
  ];

  const topics = [
    'season finale', 'character development', 'plot theories', 'easter eggs',
    'behind the scenes', 'cast interviews', 'episode reviews', 'fan theories',
    'show recommendations', 'similar shows', 'best episodes', 'worst episodes'
  ];

  const suggestions: SearchSuggestion[] = [];

  // Match TV shows
  tvShows.forEach(show => {
    if (show.name.toLowerCase().includes(lowerQuery)) {
      suggestions.push({
        text: show.name,
        type: 'tv_show',
        description: `${show.genre} • ${show.year} • ${show.network}`,
        confidence: 0.95,
        metadata: {
          year: show.year,
          network: show.network,
          genre: show.genre
        }
      });
    }
  });

  // Match actors
  actors.forEach(actor => {
    if (actor.name.toLowerCase().includes(lowerQuery)) {
      suggestions.push({
        text: actor.name,
        type: 'actor',
        description: `Known for: ${actor.knownFor}`,
        confidence: 0.9,
        metadata: {
          role: actor.knownFor
        }
      });
    }
  });

  // Match characters
  characters.forEach(character => {
    if (character.name.toLowerCase().includes(lowerQuery)) {
      suggestions.push({
        text: character.name,
        type: 'character',
        description: `Character from ${character.show}`,
        confidence: 0.85,
        metadata: {
          role: character.show
        }
      });
    }
  });

  // Match genres
  genres.forEach(genre => {
    if (genre.toLowerCase().includes(lowerQuery)) {
      suggestions.push({
        text: `${genre} TV Shows`,
        type: 'genre',
        description: `Browse ${genre.toLowerCase()} series and discussions`,
        confidence: 0.8
      });
    }
  });

  // Match topics
  topics.forEach(topic => {
    if (topic.toLowerCase().includes(lowerQuery) || lowerQuery.includes(topic.toLowerCase())) {
      suggestions.push({
        text: `${query} ${topic}`,
        type: 'topic',
        description: `Discussions about ${topic}`,
        confidence: 0.75
      });
    }
  });

  // Add topic suggestions based on common search patterns
  if (lowerQuery.includes('season') || lowerQuery.includes('episode')) {
    suggestions.push({
      text: `${query} discussions`,
      type: 'topic',
      description: 'Episode discussions and reviews',
      confidence: 0.7
    });
  }

  if (lowerQuery.includes('theory') || lowerQuery.includes('ending')) {
    suggestions.push({
      text: `${query} theories`,
      type: 'topic',
      description: 'Fan theories and analysis',
      confidence: 0.7
    });
  }

  // Sort by confidence and return top suggestions
  return suggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 12);
};

export const enhanceSearchQuery = async (query: string): Promise<string> => {
  // Return original query if OpenAI is not available
  if (!openai) {
    return query;
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a search query enhancer for a TV show discussion platform. Improve the user\'s search query to be more comprehensive and likely to find relevant TV show discussions, reviews, and content. Return only the enhanced query without explanation.'
        },
        {
          role: 'user',
          content: `Enhance this search query: "${query}"`
        }
      ],
      max_tokens: 50,
      temperature: 0.3
    });

    return response.choices[0]?.message?.content?.trim() || query;
  } catch (error) {
    console.error('Error enhancing search query:', error);
    return query;
  }
};

// Export a function to check if OpenAI is available
export const isOpenAIAvailable = (): boolean => {
  return openai !== null;
};