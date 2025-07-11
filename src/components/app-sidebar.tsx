"use client"

import { ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { fetchSidebarData, type SidebarItem } from "@/lib/api"

interface AppSidebarProps {
  onApiSelect?: (apiId: string) => void;
  selectedApiId?: string;
  onGetStartedClick?: () => void;
  isGetStartedOpen?: boolean;
  refreshTrigger?: number; // Add this to trigger sidebar refresh
}

export function AppSidebar({ onApiSelect, selectedApiId, onGetStartedClick, isGetStartedOpen, refreshTrigger }: AppSidebarProps) {
  const [sidebarData, setSidebarData] = useState<SidebarItem[]>([])
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  const loadSidebarData = async () => {
    try {
      const data = await fetchSidebarData()
      // Reverse only the APIs array so new data appears at the bottom
      const reversedData = data.map(item => ({
        ...item,
        subtitles: item.subtitles.map(subtitle => ({
          ...subtitle,
          apis: [...subtitle.apis].reverse() // Reverse the APIs array so newest appears at bottom
        }))
      }))
      setSidebarData(reversedData)
    } catch (error) {
      console.error('Failed to load sidebar data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    loadSidebarData()
  }, [])

  // Add effect to reload data when refreshTrigger changes
  useEffect(() => {
    if (mounted && refreshTrigger) {
      setLoading(true)
      loadSidebarData()
    }
  }, [refreshTrigger, mounted])

  const toggleExpanded = (title: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(title)) {
      newExpanded.delete(title)
    } else {
      newExpanded.add(title)
    }
    setExpandedItems(newExpanded)
  }

  const handleApiClick = (apiId: string) => {
    if (onApiSelect) {
      onApiSelect(apiId)
    }
  }

  // Return loading skeleton during SSR and initial client render
  if (!mounted) {
    return (
      <div
        className="fixed left-0 top-16 bottom-0 w-64 border-r border-zinc-800 flex-shrink-0 overflow-y-auto z-40"
        style={{ backgroundColor: "#0D0E0F" }}
      >
        <div className="p-4 space-y-6 pt-8">
          <div className="animate-pulse">
            <div className="h-4 bg-zinc-700 rounded mb-3"></div>
            <div className="space-y-2">
              <div className="h-8 bg-zinc-700 rounded"></div>
              <div className="h-8 bg-zinc-700 rounded"></div>
              <div className="h-8 bg-zinc-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed left-0 top-16 bottom-0 w-64 border-r border-zinc-800 flex-shrink-0 overflow-y-auto z-40"
      style={{ backgroundColor: "#0D0E0F", width: "256px" }}
    >
      <div className="p-4 space-y-6 pt-8 w-full">

        {/* Show loading skeleton while data is being fetched */}
        {loading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-zinc-700 rounded mb-3"></div>
            <div className="space-y-2">
              <div className="h-8 bg-zinc-700 rounded"></div>
              <div className="h-8 bg-zinc-700 rounded"></div>
              <div className="h-8 bg-zinc-700 rounded"></div>
            </div>
          </div>
        ) : (
          <div>
            {/* Get Started Section */}
            <div className="mb-8 pb-6 border-b border-zinc-700">
              <button 
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  isGetStartedOpen
                    ? 'text-white bg-zinc-800'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
                onClick={onGetStartedClick}
              >
                Introduction
              </button>
            </div>

            {/* API Sections from API */}
            {sidebarData.map((item) => (
              <div key={item.title} className="mt-6">
                <h3 className="text-white text-sm font-bold mb-3">{item.title}</h3>
                <div className="space-y-1">
                  {item.subtitles.map((subtitle) => (
                    <div key={subtitle.subtitle}>
                      <button 
                        className="w-full text-left text-zinc-400 hover:text-white hover:bg-zinc-800 px-3 py-2 rounded-md text-sm flex items-center justify-between transition-colors"
                        onClick={() => toggleExpanded(`${item.title}-${subtitle.subtitle}`)}
                      >
                        <span className="flex-1">{subtitle.subtitle}</span>
                        <ChevronRight 
                          className={`h-4 w-4 transition-transform flex-shrink-0 ${
                            expandedItems.has(`${item.title}-${subtitle.subtitle}`) ? 'rotate-90' : ''
                          }`} 
                        />
                      </button>
                      {expandedItems.has(`${item.title}-${subtitle.subtitle}`) && (
                        <div className="ml-4 mt-1 space-y-1">
                          {subtitle.apis.map((api) => (
                            <button 
                              key={api._id}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                selectedApiId === api._id
                                  ? 'text-white bg-zinc-800'
                                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                              }`}
                              onClick={() => handleApiClick(api._id)}
                            >
                              {api.api_title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
