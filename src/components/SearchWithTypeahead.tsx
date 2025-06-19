import React, { useState, useEffect, useRef } from 'react';
import { Search, Tv, User, Hash, MessageSquare, Loader2, Users, Sparkles, TrendingUp, Clock, Star, ChevronRight, Filter } from 'lucide-react';
import { generateSearchSuggestions, isOpenAIAvailable, getLocalSuggestions, SearchSuggestion } from '../services/openai';
import { performAISearch, SearchResult } from '../services/searchService';

interface SearchWithTypeaheadProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  onSearchResults?: (results: SearchResult[]) => void;
}

export const SearchWithTypeahead: React.FC<SearchWithTypeaheadProps> = ({
  searchQuery,
  onSearchChange,
  onSuggestionSelect,
  onSearchResults
}) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'results'>('suggestions');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openAIEnabled, setOpenAIEnabled] = useState(false);

  useEffect(() => {
    setOpenAIEnabled(isOpenAIAvailable());
  }, []);

  // Generate suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        let aiSuggestions: SearchSuggestion[] = [];
        
        if (openAIEnabled) {
          try {
            aiSuggestions = await generateSearchSuggestions(searchQuery);
          } catch (error) {
            console.error('Error fetching AI suggestions:', error);
          }
        }
        
        const localSuggestions = getLocalSuggestions(searchQuery);
        const combinedSuggestions = aiSuggestions.length > 0 ? aiSuggestions : localSuggestions;
        
        setSuggestions(combinedSuggestions);
        setShowDropdown(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions(getLocalSuggestions(searchQuery));
        setShowDropdown(true);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, openAIEnabled]);

  // Perform search
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.length < 3) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await performAISearch(searchQuery, {
          limit: 12,
          includeContent: false
        });
        
        setSearchResults(response.results);
        onSearchResults?.(response.results);
        
        if (response.results.length > 0 && showDropdown) {
          setActiveTab('results');
        }
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(performSearch, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearchResults, showDropdown]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    const currentItems = activeTab === 'results' ? searchResults : suggestions;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < currentItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : currentItems.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < currentItems.length) {
          if (activeTab === 'results') {
            handleResultClick(searchResults[selectedIndex]);
          } else {
            handleSuggestionClick(suggestions[selectedIndex]);
          }
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        if (suggestions.length > 0 && searchResults.length > 0) {
          e.preventDefault();
          setActiveTab(prev => prev === 'suggestions' ? 'results' : 'suggestions');
          setSelectedIndex(-1);
        }
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onSearchChange(suggestion.text);
    setShowDropdown(false);
    setSelectedIndex(-1);
    onSuggestionSelect?.(suggestion);
    inputRef.current?.focus();
  };

  const handleResultClick = (result: SearchResult) => {
    onSearchChange(result.title);
    setShowDropdown(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Group suggestions by type
  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.type]) acc[suggestion.type] = [];
    acc[suggestion.type].push(suggestion);
    return acc;
  }, {} as Record<string, SearchSuggestion[]>);

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'tv_show':
        return <Tv className="w-4 h-4 text-purple-500" />;
      case 'actor':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'genre':
        return <Hash className="w-4 h-4 text-green-500" />;
      case 'character':
        return <Users className="w-4 h-4 text-indigo-500" />;
      case 'topic':
        return <MessageSquare className="w-4 h-4 text-orange-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  const getResultIcon = (matchType: SearchResult['match_type']) => {
    switch (matchType) {
      case 'title':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'tv_show':
        return <Tv className="w-4 h-4 text-purple-500" />;
      case 'content':
        return <Hash className="w-4 h-4 text-green-500" />;
      case 'semantic':
        return <Sparkles className="w-4 h-4 text-orange-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  const isDarkMode = true; // Get this from props or context if needed

  return (
    <div className="relative flex-1 max-w-2xl mx-6" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search TV Posts"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0 || searchResults.length > 0) {
              setShowDropdown(true);
            }
          }}
          className="w-full bg-gray-800 border border-gray-700 rounded-full py-2 pl-10 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {isLoading && (
            <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
          )}
          {openAIEnabled && !isLoading && (
            <div className="flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-purple-400 font-medium">AI</span>
            </div>
          )}
          {!openAIEnabled && !isLoading && (
            <div className="w-2 h-2 bg-yellow-400 rounded-full" title="Using local suggestions - OpenAI not configured" />
          )}
        </div>
      </div>

      {/* Enhanced Dropdown */}
      {showDropdown && (suggestions.length > 0 || searchResults.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-sm">
          {/* Tabs */}
          {suggestions.length > 0 && searchResults.length > 0 && (
            <div className="flex border-b border-gray-700 bg-gray-900">
              <button
                onClick={() => {
                  setActiveTab('suggestions');
                  setSelectedIndex(-1);
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'suggestions'
                    ? 'text-purple-400 bg-gray-800 border-b-2 border-purple-500'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Suggestions ({suggestions.length})</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab('results');
                  setSelectedIndex(-1);
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'results'
                    ? 'text-purple-400 bg-gray-800 border-b-2 border-purple-500'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Results ({searchResults.length})</span>
                </div>
              </button>
            </div>
          )}

          <div className="max-h-96 overflow-y-auto">
            {/* Search Results Tab */}
            {activeTab === 'results' && searchResults.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-900 border-b border-gray-700 flex items-center space-x-2">
                  <TrendingUp className="w-3 h-3" />
                  <span>Search Results</span>
                </div>
                {searchResults.map((result, index) => (
                  <button
                    key={`result-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-all duration-150 flex items-start space-x-3 group ${
                      index === selectedIndex ? 'bg-gray-700 border-r-2 border-purple-500' : 'hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getResultIcon(result.match_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-200 truncate text-sm group-hover:text-purple-400 transition-colors">
                          {result.title}
                        </span>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {formatTimestamp(result.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
                        <span className="bg-purple-900 text-purple-300 px-2 py-1 rounded-full font-medium">
                          {result.tv_show}
                        </span>
                        {result.season && result.episode && (
                          <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded-full">
                            S{result.season}E{result.episode}
                          </span>
                        )}
                        <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded-full">
                          {result.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span>by {result.author}</span>
                        <span className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{result.votes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{result.comment_count}</span>
                        </span>
                        <div className="flex items-center space-x-1 ml-auto">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span>{Math.round(result.relevance_score)}% match</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors flex-shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            )}

            {/* Suggestions Tab */}
            {activeTab === 'suggestions' && suggestions.length > 0 && (
              <div className="py-2">
                {Object.keys(groupedSuggestions).length > 1 ? (
                  // Grouped display
                  Object.entries(groupedSuggestions).map(([type, typeSuggestions]) => (
                    <div key={type}>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-900 border-b border-gray-700 flex items-center space-x-2">
                        {getSuggestionIcon(type as SearchSuggestion['type'])}
                        <span>{type.replace('_', ' ')}s</span>
                        <span className="text-gray-500">({typeSuggestions.length})</span>
                      </div>
                      {typeSuggestions.map((suggestion, index) => {
                        const globalIndex = suggestions.indexOf(suggestion);
                        return (
                          <SuggestionItem
                            key={`${type}-${index}`}
                            suggestion={suggestion}
                            index={globalIndex}
                            selectedIndex={selectedIndex}
                            onClick={handleSuggestionClick}
                            getSuggestionIcon={getSuggestionIcon}
                          />
                        );
                      })}
                    </div>
                  ))
                ) : (
                  // Simple list
                  suggestions.map((suggestion, index) => (
                    <SuggestionItem
                      key={`suggestion-${index}`}
                      suggestion={suggestion}
                      index={index}
                      selectedIndex={selectedIndex}
                      onClick={handleSuggestionClick}
                      getSuggestionIcon={getSuggestionIcon}
                    />
                  ))
                )}
              </div>
            )}

            {/* Empty State */}
            {activeTab === 'suggestions' && suggestions.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <p className="text-sm">No suggestions found</p>
              </div>
            )}

            {activeTab === 'results' && searchResults.length === 0 && searchQuery.length >= 3 && (
              <div className="px-4 py-8 text-center text-gray-400">
                <Filter className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <p className="text-sm">No results found</p>
                <p className="text-xs text-gray-500 mt-1">Try different keywords</p>
              </div>
            )}
          </div>
          
          {/* Enhanced Footer */}
          <div className="px-4 py-3 text-xs text-gray-400 bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {openAIEnabled ? (
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  <span className="text-purple-400 font-medium">AI-powered search</span>
                </div>
              ) : (
                <span>💡 Add OpenAI API key for smarter suggestions</span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {suggestions.length > 0 && searchResults.length > 0 && (
                <span className="text-gray-500">Press Tab to switch tabs</span>
              )}
              {(searchResults.length > 0 || suggestions.length > 0) && (
                <span className="text-gray-300 font-medium">
                  {activeTab === 'results' ? `${searchResults.length} results` : `${suggestions.length} suggestions`}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SuggestionItemProps {
  suggestion: SearchSuggestion;
  index: number;
  selectedIndex: number;
  onClick: (suggestion: SearchSuggestion) => void;
  getSuggestionIcon: (type: SearchSuggestion['type']) => React.ReactNode;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({
  suggestion,
  index,
  selectedIndex,
  onClick,
  getSuggestionIcon
}) => (
  <button
    onClick={() => onClick(suggestion)}
    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-all duration-150 flex items-center space-x-3 group ${
      index === selectedIndex ? 'bg-gray-700 border-r-2 border-purple-500' : 'hover:bg-gray-700'
    }`}
  >
    <div className="flex-shrink-0">
      {getSuggestionIcon(suggestion.type)}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center space-x-2 mb-1">
        <span className="font-medium text-gray-200 truncate group-hover:text-purple-400 transition-colors">
          {suggestion.text}
        </span>
        <span className="text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded-full flex-shrink-0">
          {suggestion.type.replace('_', ' ')}
        </span>
        {suggestion.metadata?.year && (
          <span className="text-xs text-gray-500 flex-shrink-0">
            {suggestion.metadata.year}
          </span>
        )}
      </div>
      {suggestion.description && (
        <p className="text-sm text-gray-400 truncate mb-1">
          {suggestion.description}
        </p>
      )}
      {suggestion.metadata?.network && (
        <p className="text-xs text-purple-400 font-medium">
          {suggestion.metadata.network}
        </p>
      )}
    </div>
    <div className="flex items-center space-x-2 flex-shrink-0">
      {suggestion.confidence && (
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${
            suggestion.confidence > 0.8 ? 'bg-green-400' :
            suggestion.confidence > 0.6 ? 'bg-yellow-400' :
            suggestion.confidence > 0.4 ? 'bg-orange-400' : 'bg-gray-400'
          }`} />
          <span className="text-xs text-gray-500">
            {Math.round(suggestion.confidence * 100)}%
          </span>
        </div>
      )}
      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
    </div>
  </button>
);