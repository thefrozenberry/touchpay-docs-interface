"use client";

import { Button } from "@/components/ui/button"
import { Search, Bell, User, Settings, X, ArrowRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { searchApiDocs, type ApiDoc } from "@/lib/api"
import { ContributeModal } from "./contribute-modal"

interface HeaderProps {
  onApiSelect?: (apiId: string) => void;
  onContributeSuccess?: () => void;
}

export function Header({ onApiSelect, onContributeSuccess }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<ApiDoc[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isContributeOpen, setIsContributeOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery)
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const performSearch = async (query: string) => {
    setIsLoading(true)
    try {
      const results = await searchApiDocs(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchClick = () => {
    setIsSearchOpen(true)
  }

  const handleCloseSearch = () => {
    setIsSearchOpen(false)
    setSearchQuery("")
    setSearchResults([])
  }

  const handleResultClick = (apiId: string) => {
    if (onApiSelect) {
      onApiSelect(apiId)
    }
    handleCloseSearch()
  }

  // Focus search input when modal opens
  useEffect(() => {
    if (isSearchOpen) {
      const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 100)
      }
    }
  }, [isSearchOpen])

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleCloseSearch()
      }
    }

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSearchOpen])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-700 px-6 py-4"
      style={{ backgroundColor: "#0D0E0F" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold text-[28px]">touchpay.</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search documentation..."
              className="bg-zinc-700 border border-zinc-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 cursor-pointer"
              onClick={handleSearchClick}
              readOnly
            />
          </div>

          <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-700">
            <Bell className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-700">
            <Settings className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="bg-white text-black hover:bg-zinc-100 border-white"
              onClick={() => setIsContributeOpen(true)}
            >
              Contribute
            </Button>
            <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-700">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search Modal Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <div 
            ref={modalRef}
            className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[70vh] overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-4 border-b border-zinc-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search APIs, endpoints, descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  data-search-input
                  autoFocus
                />
                <button
                  onClick={handleCloseSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Search Results */}
            <div className="overflow-y-auto max-h-[60vh]">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-zinc-400 mt-2">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((result) => (
                    <div
                      key={result._id}
                      onClick={() => handleResultClick(result._id)}
                      className="p-4 hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors border-b border-zinc-700 last:border-b-0"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              result.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                              result.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                              result.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                              result.method === 'DELETE' ? 'bg-red-500/20 text-red-400' :
                              'bg-zinc-500/20 text-zinc-400'
                            }`}>
                              {result.method}
                            </span>
                            <span className="text-zinc-400 text-sm">{result.title}</span>
                          </div>
                          <h3 className="text-white font-medium mb-1">{result.api_title}</h3>
                          <p className="text-zinc-400 text-sm mb-2">{result.endpoint}</p>
                          <p className="text-zinc-500 text-xs line-clamp-2">{result.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-zinc-500 flex-shrink-0 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery.trim() ? (
                <div className="p-8 text-center">
                  <Search className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
                  <p className="text-zinc-400">No results found for "{searchQuery}"</p>
                  <p className="text-zinc-500 text-sm mt-1">Try different keywords or check spelling</p>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Search className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
                  <p className="text-zinc-400">Search for APIs, endpoints, or descriptions</p>
                  <p className="text-zinc-500 text-sm mt-1">Type to start searching...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contribute Modal */}
      <ContributeModal
        isOpen={isContributeOpen}
        onClose={() => setIsContributeOpen(false)}
        onSuccess={() => {
          // Trigger silent page reload
          onContributeSuccess?.()
          console.log('API created successfully!')
        }}
      />
    </header>
  )
}
