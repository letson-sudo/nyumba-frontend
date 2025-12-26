// import React, { useState, useEffect, useRef } from "react";
// import { Search, Lock, Clock, Loader2, MapPin, Sparkles, X, History, TrendingUp } from "lucide-react";

// const SearchAndFilter = ({
//   searchLocation,
//   onSearchChange,
//   hasActiveAccess = false,
//   subscriptionStatus = "none",
//   daysRemaining = 0,
//   onSearchResults,
//   userLocation = null,
// }) => {
//   const [isSearching, setIsSearching] = useState(false);
//   const [searchError, setSearchError] = useState(null);
//   const [searchContext, setSearchContext] = useState(null);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [suggestions, setSuggestions] = useState([]);
//   const [searchHistory, setSearchHistory] = useState([]);
//   const [isFocused, setIsFocused] = useState(false);

//   const searchInputRef = useRef(null);
//   const debounceTimerRef = useRef(null);
//   const suggestionsRef = useRef(null);

//   const LARAVEL_API_BASE = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000';

//   // Load search history from localStorage on mount
//   useEffect(() => {
//     const savedHistory = localStorage.getItem('property_search_history');
//     if (savedHistory) {
//       try {
//         setSearchHistory(JSON.parse(savedHistory));
//       } catch (e) {
//         console.error('Failed to load search history:', e);
//       }
//     }
//   }, []);

//   // Save search to history
//   const saveToHistory = (query) => {
//     if (!query.trim()) return;

//     const newHistory = [
//       query.trim(),
//       ...searchHistory.filter(item => item !== query.trim())
//     ].slice(0, 10);

//     setSearchHistory(newHistory);
//     localStorage.setItem('property_search_history', JSON.stringify(newHistory));
//   };

//   // Clear search history
//   const clearHistory = () => {
//     setSearchHistory([]);
//     localStorage.removeItem('property_search_history');
//   };

//   // Generate suggestions based on input
//   const generateSuggestions = (input) => {
//     if (!input || input.length < 2) return [];

//     const lowercaseInput = input.toLowerCase();
//     const allSuggestions = [];

//     // Location-based suggestions
//     const locations = ['lilongwe', 'blantyre', 'zomba', 'mzuzu', 'mangochi'];
//     locations.forEach(loc => {
//       if (loc.includes(lowercaseInput)) {
//         allSuggestions.push(`house in ${loc}`);
//         allSuggestions.push(`apartment ${loc}`);
//       }
//     });

//     // Price-based suggestions
//     if (lowercaseInput.match(/\d/)) {
//       const numbers = lowercaseInput.match(/\d+/g);
//       if (numbers) {
//         const num = numbers[0];
//         allSuggestions.push(`${num}k house`);
//         allSuggestions.push(`${num}k apartment`);
//         if (userLocation?.city) {
//           allSuggestions.push(`${num}k in ${userLocation.city}`);
//         }
//       }
//     }

//     // Property type suggestions
//     const propertyTypes = ['house', 'apartment', 'rental', 'land', 'commercial'];
//     propertyTypes.forEach(type => {
//       if (type.includes(lowercaseInput)) {
//         allSuggestions.push(type);
//         if (userLocation?.city) {
//           allSuggestions.push(`${type} in ${userLocation.city}`);
//         }
//       }
//     });

//     // Keyword suggestions
//     if (lowercaseInput.includes('bed')) {
//       allSuggestions.push('3 bedroom house', '2 bedroom apartment', '4 bedroom villa');
//     }

//     return allSuggestions.slice(0, 8);
//   };

//   // Handle input change with debounced search
//   const handleInputChange = (value) => {
//     onSearchChange(value);

//     // Generate suggestions
//     const newSuggestions = generateSuggestions(value);
//     setSuggestions(newSuggestions);
//     setShowSuggestions(true);

//     // Clear existing timer
//     if (debounceTimerRef.current) {
//       clearTimeout(debounceTimerRef.current);
//     }

//     // Don't auto-search if input is too short
//     if (!value || value.trim().length < 3) {
//       return;
//     }

//     // Debounced auto-search
//     if (hasActiveAccess) {
//       debounceTimerRef.current = setTimeout(() => {
//         performSearch(value);
//       }, 800);
//     }
//   };

//   // Click outside to close suggestions
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
//           searchInputRef.current && !searchInputRef.current.contains(event.target)) {
//         setShowSuggestions(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Perform the actual search
//   const performSearch = async (query) => {
//     if (!hasActiveAccess || !query?.trim()) return;

//     setIsSearching(true);
//     setSearchError(null);
//     setSearchContext(null);

//     try {
//       saveToHistory(query);

//       const queryParams = new URLSearchParams({
//         q: query.trim(),
//         t: new Date().getTime(),
//         per_page: 12,
//         sort_by: 'created_at',
//         sort_order: 'desc',
//         ...(userLocation?.city && { user_city: userLocation.city }),
//         ...(userLocation?.region && { user_region: userLocation.region }),
//         ...(userLocation?.country && { user_country: userLocation.country }),
//       });

//       const apiUrl = `${LARAVEL_API_BASE}/api/search/properties?${queryParams}`;

//       const response = await fetch(apiUrl, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//           ...(userLocation?.city && { 'X-User-City': userLocation.city }),
//           ...(userLocation?.region && { 'X-User-Region': userLocation.region }),
//           ...(userLocation?.country && { 'X-User-Country': userLocation.country }),
//         },
//         credentials: 'include',
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => null);
//         throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();

//       if (result.query_analysis) {
//         setSearchContext({
//           strategy: result.search_strategy,
//           userLocationUsed: result.query_analysis.user_location_used,
//           location: result.query_analysis.location,
//           priceStartsWith: result.query_analysis.price_starts_with,
//           keywords: result.query_analysis.keywords,
//         });
//       }

//       if (onSearchResults) {
//         onSearchResults({
//           data: result,
//           query: query.trim(),
//           queryAnalysis: result.query_analysis,
//           userLocation: result.user_location,
//           searchStrategy: result.search_strategy,
//           timestamp: new Date().toISOString()
//         });
//       }

//     } catch (error) {
//       console.error('Search API error:', error);
//       setSearchError(error.message);

//       if (onSearchResults) {
//         onSearchResults({
//           error: error.message,
//           query: query.trim(),
//           timestamp: new Date().toISOString()
//         });
//       }
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   // Handle form submission
//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     setShowSuggestions(false);
//     performSearch(searchLocation);
//   };

//   // Handle selecting a suggestion
//   const handleSelectSuggestion = (suggestion) => {
//     onSearchChange(suggestion);
//     setShowSuggestions(false);
//     performSearch(suggestion);
//   };

//   // Trending searches
//   const trendingSearches = [
//     "200k house in zomba",
//     "apartment blantyre",
//     "500-700k lilongwe",
//     "affordable rental",
//     "3 bedroom house",
//     ...(userLocation?.city ? [`house in ${userLocation.city}`] : [])
//   ].slice(0, 6);

//   const handleQuickExampleClick = (example) => {
//     onSearchChange(example);
//     setShowSuggestions(false);
//     performSearch(example);
//   };

//   const getSearchPlaceholder = () => {
//     if (!hasActiveAccess) {
//       if (subscriptionStatus === "processing" || subscriptionStatus === "pending")
//         return "Payment processing...";
//       if (subscriptionStatus === "active" && daysRemaining === 0)
//         return "Subscription expired - Renew to search";
//       if (subscriptionStatus === "canceled")
//         return "Subscription canceled";
//       return "Subscribe to search";
//     }

//     if (userLocation?.city) {
//       return `Search in ${userLocation.city}... Try "200k house" or "apartment"`;
//     }

//     return "Search properties... Try '200k house' or 'apartment blantyre'";
//   };

//   const getSearchContextText = () => {
//     if (!searchContext) return null;

//     const { strategy, userLocationUsed, location, priceStartsWith, keywords } = searchContext;

//     if (strategy.includes('user_location')) {
//       return `📍 Showing properties near you in ${userLocation?.city}`;
//     }

//     if (location && priceStartsWith) {
//       return `🔍 Found properties in ${location} with prices starting from ${priceStartsWith}`;
//     }

//     if (location) {
//       return `📍 Searching in ${location}`;
//     }

//     if (priceStartsWith) {
//       return `💰 Properties around ${priceStartsWith}K`;
//     }

//     return "🔍 Searching across all properties";
//   };

//   const getStrategyBadgeColor = (strategy) => {
//     const colors = {
//       'malawi_dataset_exact_match': 'bg-green-100 text-green-800',
//       'user_location_based_search': 'bg-blue-100 text-blue-800',
//       'user_location_fallback_search': 'bg-purple-100 text-purple-800',
//       'direct_location_search': 'bg-orange-100 text-orange-800',
//       'keyword_broad_search': 'bg-yellow-100 text-yellow-800',
//       'fallback_broad_search': 'bg-gray-100 text-gray-800',
//     };
//     return colors[strategy] || 'bg-gray-100 text-gray-800';
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//       {/* User Location Indicator */}
//       {hasActiveAccess && userLocation?.city && (
//         <div className="mb-4 p-3 rounded-lg text-sm bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 border border-blue-200">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <MapPin className="w-4 h-4 mr-2" />
//               <span>
//                 <strong>Location detected:</strong> {userLocation.city}
//                 {userLocation.region && `, ${userLocation.region}`}
//               </span>
//             </div>
//             <Sparkles className="w-4 h-4 text-blue-500" />
//           </div>
//         </div>
//       )}

//       {/* Subscription Status Banner */}
//       {!hasActiveAccess && (
//         <div
//           className={`mb-4 p-3 rounded-lg text-sm ${
//             subscriptionStatus === "processing" || subscriptionStatus === "pending"
//               ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
//               : subscriptionStatus === "active" && daysRemaining === 0
//               ? "bg-red-50 text-red-800 border border-red-200"
//               : "bg-blue-50 text-blue-800 border border-blue-200"
//           }`}
//         >
//           <div className="flex items-center">
//             {subscriptionStatus === "processing" || subscriptionStatus === "pending" ? (
//               <Clock className="w-4 h-4 mr-2" />
//             ) : (
//               <Lock className="w-4 h-4 mr-2" />
//             )}
//             <span>
//               {subscriptionStatus === "processing" || subscriptionStatus === "pending"
//                 ? "Payment is being processed. Search will be available once confirmed."
//                 : subscriptionStatus === "active" && daysRemaining === 0
//                 ? "Your subscription has expired. Renew to continue searching."
//                 : "Subscribe to unlock search features."}
//             </span>
//           </div>
//         </div>
//       )}

//       {/* Days Remaining Warning */}
//       {hasActiveAccess && daysRemaining <= 7 && daysRemaining > 0 && (
//         <div className="mb-4 p-3 rounded-lg text-sm bg-orange-50 text-orange-800 border border-orange-200">
//           <div className="flex items-center">
//             <Clock className="w-4 h-4 mr-2" />
//             <span>
//               Your subscription expires in {daysRemaining} day
//               {daysRemaining !== 1 ? "s" : ""}. Renew to continue access.
//             </span>
//           </div>
//         </div>
//       )}

//       {/* Search Error Display */}
//       {searchError && (
//         <div className="mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-800 border border-red-200">
//           <div className="flex items-center">
//             <Lock className="w-4 h-4 mr-2" />
//             <span>Search failed: {searchError}</span>
//           </div>
//         </div>
//       )}

//       {/* Search Context Display */}
//       {searchContext && (
//         <div className="mb-4 p-3 rounded-lg text-sm bg-gray-50 border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <span>{getSearchContextText()}</span>
//             </div>
//             <span className={`text-xs px-2 py-1 rounded ${getStrategyBadgeColor(searchContext.strategy)}`}>
//               {searchContext.strategy.replace(/_/g, ' ')}
//             </span>
//           </div>
//         </div>
//       )}

//       {/* Search Form */}
//       <form onSubmit={handleSearchSubmit} className="relative">
//         <div className="flex gap-4">
//           {/* Search Input */}
//           <div className="flex-1 relative">
//             <div className="relative">
//               <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder={getSearchPlaceholder()}
//                 className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl transition-all ${
//                   hasActiveAccess
//                     ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400"
//                     : "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
//                 }`}
//                 value={searchLocation || ""}
//                 onChange={(e) => hasActiveAccess && handleInputChange(e.target.value)}
//                 onFocus={() => {
//                   setIsFocused(true);
//                   if (searchLocation || searchHistory.length > 0) {
//                     setShowSuggestions(true);
//                   }
//                 }}
//                 disabled={!hasActiveAccess}
//                 autoComplete="off"
//               />
//               {searchLocation && hasActiveAccess && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     onSearchChange('');
//                     setShowSuggestions(false);
//                     searchInputRef.current?.focus();
//                   }}
//                   className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               )}
//               {isSearching && (
//                 <Loader2 className="w-4 h-4 absolute right-10 top-3.5 text-blue-500 animate-spin" />
//               )}
//             </div>

//             {/* Suggestions Dropdown */}
//             {showSuggestions && hasActiveAccess && (isFocused || searchLocation) && (
//               <div
//                 ref={suggestionsRef}
//                 className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto"
//               >
//                 {/* Search History */}
//                 {searchHistory.length > 0 && !searchLocation && (
//                   <div className="p-2">
//                     <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500">
//                       <div className="flex items-center">
//                         <History className="w-3 h-3 mr-1" />
//                         Recent Searches
//                       </div>
//                       <button
//                         type="button"
//                         onClick={clearHistory}
//                         className="text-blue-600 hover:text-blue-800"
//                       >
//                         Clear
//                       </button>
//                     </div>
//                     {searchHistory.map((item, index) => (
//                       <button
//                         key={`history-${index}`}
//                         type="button"
//                         onClick={() => handleSelectSuggestion(item)}
//                         className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
//                       >
//                         <Clock className="w-4 h-4 text-gray-400" />
//                         <span className="text-gray-700">{item}</span>
//                       </button>
//                     ))}
//                   </div>
//                 )}

//                 {/* Suggestions */}
//                 {suggestions.length > 0 && searchLocation && (
//                   <div className="p-2 border-t border-gray-100">
//                     <div className="flex items-center px-3 py-2 text-xs font-semibold text-gray-500">
//                       <Sparkles className="w-3 h-3 mr-1" />
//                       Suggestions
//                     </div>
//                     {suggestions.map((item, index) => (
//                       <button
//                         key={`suggestion-${index}`}
//                         type="button"
//                         onClick={() => handleSelectSuggestion(item)}
//                         className="w-full text-left px-3 py-2.5 hover:bg-blue-50 rounded-lg flex items-center gap-3 transition-colors group"
//                       >
//                         <Search className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
//                         <span className="text-gray-700 group-hover:text-blue-700">{item}</span>
//                       </button>
//                     ))}
//                   </div>
//                 )}

//                 {/* Trending Searches */}
//                 {!searchLocation && searchHistory.length === 0 && (
//                   <div className="p-2">
//                     <div className="flex items-center px-3 py-2 text-xs font-semibold text-gray-500">
//                       <TrendingUp className="w-3 h-3 mr-1" />
//                       Trending Searches
//                     </div>
//                     {trendingSearches.map((item, index) => (
//                       <button
//                         key={`trending-${index}`}
//                         type="button"
//                         onClick={() => handleSelectSuggestion(item)}
//                         className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
//                       >
//                         <TrendingUp className="w-4 h-4 text-gray-400" />
//                         <span className="text-gray-700">{item}</span>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Search Submit Button */}
//           <button
//             type="submit"
//             disabled={!hasActiveAccess || !searchLocation?.trim()}
//             className={`px-8 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 ${
//               hasActiveAccess && searchLocation?.trim()
//                 ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl"
//                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
//             }`}
//           >
//             <Search className="w-4 h-4" />
//           </button>
//         </div>
//       </form>

//       {/* Trending/Quick Search Pills */}
//       {hasActiveAccess && !searchLocation && (
//         <div className="mt-4">
//           <div className="text-xs text-gray-500 mb-2 flex items-center">
//             <TrendingUp className="w-3 h-3 mr-1" />
//             Trending searches
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {trendingSearches.map((example, index) => (
//               <button
//                 key={index}
//                 type="button"
//                 onClick={() => handleQuickExampleClick(example)}
//                 className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 px-3 py-1.5 rounded-full text-xs hover:from-blue-100 hover:to-cyan-100 transition-all border border-blue-200 hover:border-blue-300 hover:shadow-sm"
//               >
//                 {example}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Footer Note */}
//       <div className="mt-4 text-xs text-gray-500 text-center">
//         {!hasActiveAccess && (
//           <span>
//             {subscriptionStatus === "processing" || subscriptionStatus === "pending"
//               ? "Search features will activate once payment is confirmed"
//               : subscriptionStatus === "active" && daysRemaining === 0
//               ? "Subscription expired - All search features disabled"
//               : "Premium search features - Subscribe to unlock property search"}
//           </span>
//         )}
//         {hasActiveAccess && daysRemaining <= 3 && daysRemaining > 0 && (
//           <span className="text-orange-600 font-medium">
//             ⚠️ Premium access expires in {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchAndFilter;









import React, { useState, useEffect, useRef } from "react";
import { Search, Lock, Clock, Loader2, MapPin, Sparkles, X, History, TrendingUp, Filter } from "lucide-react";

const SearchAndFilter = ({
  searchLocation,
  onSearchChange,
  hasActiveAccess = false,
  subscriptionStatus = "none",
  daysRemaining = 0,
  onSearchResults,
  userLocation = null,
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [searchMode, setSearchMode] = useState('general'); // general, natural, advanced, multi
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Advanced search filters
  const [advancedFilters, setAdvancedFilters] = useState({
    title: '',
    description: '',
    location: '',
    min_price: '',
    max_price: '',
  });

  const searchInputRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const suggestionsRef = useRef(null);

  const LARAVEL_API_BASE = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000';

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('property_search_history');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load search history:', e);
      }
    }
  }, []);

  // Save search to history
  const saveToHistory = (query) => {
    if (!query.trim()) return;

    const newHistory = [
      query.trim(),
      ...searchHistory.filter(item => item !== query.trim())
    ].slice(0, 10);

    setSearchHistory(newHistory);
    localStorage.setItem('property_search_history', JSON.stringify(newHistory));
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('property_search_history');
  };

  // Generate suggestions based on input
  const generateSuggestions = (input) => {
    if (!input || input.length < 2) return [];

    const lowercaseInput = input.toLowerCase();
    const allSuggestions = [];

    // Location-based suggestions
    const locations = ['lilongwe', 'blantyre', 'zomba', 'mzuzu', 'mangochi'];
    locations.forEach(loc => {
      if (loc.includes(lowercaseInput)) {
        allSuggestions.push(`house in ${loc}`);
        allSuggestions.push(`apartment ${loc}`);
      }
    });

    // Property type suggestions
    const propertyTypes = ['house', 'apartment', 'rental', 'land', 'commercial'];
    propertyTypes.forEach(type => {
      if (type.includes(lowercaseInput)) {
        allSuggestions.push(type);
        if (userLocation?.city) {
          allSuggestions.push(`${type} in ${userLocation.city}`);
        }
      }
    });

    return allSuggestions.slice(0, 8);
  };

  // Handle input change with debounced search
  const handleInputChange = (value) => {
    onSearchChange(value);

    // Generate suggestions
    const newSuggestions = generateSuggestions(value);
    setSuggestions(newSuggestions);
    setShowSuggestions(true);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Don't auto-search if input is too short
    if (!value || value.trim().length < 3) {
      return;
    }

    // Debounced auto-search
    if (hasActiveAccess) {
      debounceTimerRef.current = setTimeout(() => {
        performSearch(value);
      }, 800);
    }
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Perform the actual search based on search mode
  const performSearch = async (query) => {
    if (!hasActiveAccess || (!query?.trim() && searchMode !== 'advanced')) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      if (query) saveToHistory(query);

      let apiUrl = '';
      const baseParams = new URLSearchParams({
        t: new Date().getTime(),
        per_page: 12,
        sort_by: 'created_at',
        sort_order: 'desc',
      });

      // Build URL based on search mode
      switch (searchMode) {
        case 'natural':
          apiUrl = `${LARAVEL_API_BASE}/api/search/natural?query=${encodeURIComponent(query)}&${baseParams}`;
          break;

        case 'advanced':
          const advParams = new URLSearchParams(baseParams);
          Object.entries(advancedFilters).forEach(([key, value]) => {
            if (value) advParams.append(key, value);
          });
          apiUrl = `${LARAVEL_API_BASE}/api/search/advanced?${advParams}`;
          break;

        case 'multi':
          // Format: title:value,description:value,location:value
          const searchParts = [];
          if (advancedFilters.title) searchParts.push(`title:${advancedFilters.title}`);
          if (advancedFilters.description) searchParts.push(`description:${advancedFilters.description}`);
          if (advancedFilters.location) searchParts.push(`location:${advancedFilters.location}`);

          const multiParams = new URLSearchParams(baseParams);
          if (searchParts.length > 0) {
            multiParams.append('search', searchParts.join(','));
          }
          if (advancedFilters.min_price) multiParams.append('min_price', advancedFilters.min_price);
          if (advancedFilters.max_price) multiParams.append('max_price', advancedFilters.max_price);

          apiUrl = `${LARAVEL_API_BASE}/api/search/multi?${multiParams}`;
          break;

        default: // general search
          baseParams.append('q', query.trim());
          apiUrl = `${LARAVEL_API_BASE}/api/search/properties?${baseParams}`;
      }

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (onSearchResults) {
        onSearchResults({
          data: result,
          query: query?.trim() || 'advanced search',
          searchMode: searchMode,
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      console.error('Search API error:', error);
      setSearchError(error.message);

      if (onSearchResults) {
        onSearchResults({
          error: error.message,
          query: query?.trim() || 'advanced search',
          timestamp: new Date().toISOString()
        });
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    performSearch(searchLocation);
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = (suggestion) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
    performSearch(suggestion);
  };

  // Trending searches
  const trendingSearches = [
    "2 bedrooms in mzuzu",
    "apartment blantyre",
    "house with pool",
    "affordable rental",
    "modern house lilongwe",
    ...(userLocation?.city ? [`house in ${userLocation.city}`] : [])
  ].slice(0, 6);

  const handleQuickExampleClick = (example) => {
    setSearchMode('natural');
    onSearchChange(example);
    setShowSuggestions(false);
    performSearch(example);
  };

  const getSearchPlaceholder = () => {
    if (!hasActiveAccess) {
      if (subscriptionStatus === "processing" || subscriptionStatus === "pending")
        return "Payment processing...";
      if (subscriptionStatus === "active" && daysRemaining === 0)
        return "Subscription expired - Renew to search";
      if (subscriptionStatus === "canceled")
        return "Subscription canceled";
      return "Subscribe to search";
    }

    switch (searchMode) {
      case 'natural':
        return "Try: '2 bedrooms in mzuzu' or 'house with pool under 500000'";
      case 'advanced':
        return "Use filters below for advanced search";
      case 'multi':
        return "Multi-field search active - use filters below";
      default:
        return "Search properties... Try 'house blantyre' or 'apartment'";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      {/* Search Error Display */}
      {searchError && (
        <div className="mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-800 border border-red-200">
          <div className="flex items-center">
            <Lock className="w-4 h-4 mr-2" />
            <span>Search failed: {searchError}</span>
          </div>
        </div>
      )}

      {/* Search Mode Selector */}
      {hasActiveAccess && (
        <div className="mb-4 flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setSearchMode('general')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              searchMode === 'general'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            General Search
          </button>
          <button
            type="button"
            onClick={() => setSearchMode('natural')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              searchMode === 'natural'
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-1" />
            Natural Language
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchMode('advanced');
              setShowAdvancedFilters(true);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              searchMode === 'advanced'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4 inline mr-1" />
            Advanced
          </button>
        </div>
      )}

      {/* Advanced Filters */}
      {hasActiveAccess && (searchMode === 'advanced' || searchMode === 'multi') && showAdvancedFilters && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Advanced Filters</h3>
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Title keywords..."
              value={advancedFilters.title}
              onChange={(e) => setAdvancedFilters({ ...advancedFilters, title: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Location..."
              value={advancedFilters.location}
              onChange={(e) => setAdvancedFilters({ ...advancedFilters, location: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Description keywords..."
              value={advancedFilters.description}
              onChange={(e) => setAdvancedFilters({ ...advancedFilters, description: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min price"
                value={advancedFilters.min_price}
                onChange={(e) => setAdvancedFilters({ ...advancedFilters, min_price: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Max price"
                value={advancedFilters.max_price}
                onChange={(e) => setAdvancedFilters({ ...advancedFilters, max_price: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => performSearch('')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={() => setAdvancedFilters({
                title: '',
                description: '',
                location: '',
                min_price: '',
                max_price: '',
              })}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Search Input Section */}
      {(searchMode === 'general' || searchMode === 'natural') && (
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={getSearchPlaceholder()}
                className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl transition-all ${
                  hasActiveAccess
                    ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400"
                    : "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                value={searchLocation || ""}
                onChange={(e) => hasActiveAccess && handleInputChange(e.target.value)}
                onFocus={() => {
                  setIsFocused(true);
                  if (searchLocation || searchHistory.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchSubmit(e);
                  }
                }}
                disabled={!hasActiveAccess}
                autoComplete="off"
              />
              {searchLocation && hasActiveAccess && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    setShowSuggestions(false);
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {isSearching && (
                <Loader2 className="w-4 h-4 absolute right-10 top-3.5 text-blue-500 animate-spin" />
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && hasActiveAccess && (isFocused || searchLocation) && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto"
              >
                {/* Search History */}
                {searchHistory.length > 0 && !searchLocation && (
                  <div className="p-2">
                    <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500">
                      <div className="flex items-center">
                        <History className="w-3 h-3 mr-1" />
                        Recent Searches
                      </div>
                      <button
                        type="button"
                        onClick={clearHistory}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Clear
                      </button>
                    </div>
                    {searchHistory.map((item, index) => (
                      <button
                        key={`history-${index}`}
                        type="button"
                        onClick={() => handleSelectSuggestion(item)}
                        className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
                      >
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{item}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                {suggestions.length > 0 && searchLocation && (
                  <div className="p-2 border-t border-gray-100">
                    <div className="flex items-center px-3 py-2 text-xs font-semibold text-gray-500">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Suggestions
                    </div>
                    {suggestions.map((item, index) => (
                      <button
                        key={`suggestion-${index}`}
                        type="button"
                        onClick={() => handleSelectSuggestion(item)}
                        className="w-full text-left px-3 py-2.5 hover:bg-blue-50 rounded-lg flex items-center gap-3 transition-colors group"
                      >
                        <Search className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                        <span className="text-gray-700 group-hover:text-blue-700">{item}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            type="button"
            onClick={handleSearchSubmit}
            disabled={!hasActiveAccess || !searchLocation?.trim()}
            className={`px-8 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 ${
              hasActiveAccess && searchLocation?.trim()
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Trending Pills */}
      {hasActiveAccess && !searchLocation && searchMode === 'natural' && (
        <div className="mt-4">
          <div className="text-xs text-gray-500 mb-2 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            Try these natural language searches
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleQuickExampleClick(example)}
                className="bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-3 py-1.5 rounded-full text-xs hover:from-purple-100 hover:to-pink-100 transition-all border border-purple-200 hover:border-purple-300 hover:shadow-sm"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
