"use client"

import { useEffect, useState } from "react"
import { Monitor, Smartphone } from "lucide-react"

export function MobileRestriction() {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isSmallScreen = window.innerWidth < 768
      
      setIsMobile(isMobileDevice || isSmallScreen)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!mounted) {
    return null
  }

  if (!isMobile) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-zinc-900 flex items-center justify-center z-[9999] p-2 sm:p-4">
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 sm:p-8 w-full max-w-xs sm:max-w-md text-center">
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="relative">
            <Smartphone className="h-12 w-12 sm:h-16 sm:w-16 text-red-400 mb-2" />
            <Monitor className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 absolute -bottom-2 -right-2" />
          </div>
        </div>
        
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">
          Restricted Access
        </h1>
        
        <p className="text-zinc-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
          This documentation portal is designed for desktop viewing only. 
          Please access this site on a desktop or laptop computer for the best experience.
        </p>
    
        
        <div className="text-zinc-400 text-xs sm:text-sm">
          {/* <p>Current device: {isMobile ? 'Mobile/Tablet' : 'Desktop'}</p> */}
          {/* <p>Screen width: {window.innerWidth}px</p> */}
        </div>
      </div>
    </div>
  )
} 