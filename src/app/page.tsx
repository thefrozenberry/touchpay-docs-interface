"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, Info, Check, Shield, Database, Zap, Users, CreditCard, FileText, Settings } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { MobileRestriction } from "@/components/mobile-restriction"
import { useEffect, useState } from "react"
import { fetchApiDoc, type ApiDoc } from "@/lib/api"

// Skeleton Loading Component
function ContentSkeleton() {
  return (
    <div className="max-w-4xl">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-9 bg-zinc-700 rounded mb-4 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-6 bg-zinc-700 rounded animate-pulse"></div>
          <div className="h-6 bg-zinc-700 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>

      {/* Endpoints Section Skeleton */}
      <div className="mb-8">
        <div className="h-6 bg-zinc-700 rounded mb-4 animate-pulse"></div>
        <div className="h-5 bg-zinc-700 rounded mb-6 w-2/3 animate-pulse"></div>
        
        {/* API Endpoint Skeleton */}
        <div className="bg-zinc-800 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-16 bg-zinc-700 rounded animate-pulse"></div>
            <div className="h-5 w-48 bg-zinc-700 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-8 bg-zinc-700 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Request Body Skeleton */}
      <div className="mb-8">
        <div className="h-6 bg-zinc-700 rounded mb-4 animate-pulse"></div>
        
        <div className="bg-zinc-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-12 bg-zinc-700 rounded animate-pulse"></div>
            <div className="h-8 w-16 bg-zinc-700 rounded animate-pulse"></div>
          </div>
          
          <div className="space-y-2">
            <div className="h-4 bg-zinc-700 rounded animate-pulse"></div>
            <div className="h-4 bg-zinc-700 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-zinc-700 rounded w-4/5 animate-pulse"></div>
            <div className="h-4 bg-zinc-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-zinc-700 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Path Parameters Skeleton */}
      <div>
        <div className="h-6 bg-zinc-700 rounded mb-4 animate-pulse"></div>
        <Card className="bg-zinc-800 border-zinc-700">
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="h-4 bg-zinc-700 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-zinc-700 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-zinc-700 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-zinc-700 rounded w-32 animate-pulse"></div>
              </div>
              <div className="flex gap-4">
                <div className="h-4 bg-zinc-700 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-zinc-700 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-zinc-700 rounded w-12 animate-pulse"></div>
                <div className="h-4 bg-zinc-700 rounded w-40 animate-pulse"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function Home() {
  const [selectedApi, setSelectedApi] = useState<ApiDoc | null>(null)
  const [selectedApiId, setSelectedApiId] = useState<string | null>(null)
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  const [copiedEndpoint, setCopiedEndpoint] = useState(false)
  const [copiedJson, setCopiedJson] = useState(false)
  const [copiedCurl, setCopiedCurl] = useState(false)
  const [sidebarRefreshTrigger, setSidebarRefreshTrigger] = useState(0)

  const handleApiSelect = async (apiId: string) => {
    setSelectedApiId(apiId)
    setIsGetStartedOpen(false)
    setLoading(true)
    try {
      const apiDoc = await fetchApiDoc(apiId)
      setSelectedApi(apiDoc)
    } catch (error) {
      console.error('Failed to fetch API documentation:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGetStartedClick = () => {
    setSelectedApi(null)
    setSelectedApiId(null)
    setIsGetStartedOpen(true)
  }

  const handleContributeSuccess = () => {
    // Refresh sidebar data to show new API
    setSidebarRefreshTrigger(prev => prev + 1)
    
    // Also refresh current API if one is selected
    if (selectedApiId) {
      handleApiSelect(selectedApiId)
    }
  }

  const copyToClipboard = async (text: string, setCopied: (value: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  // Default content when no API is selected
  const defaultContent = {
    api_title: "TouchPay Internal API Documentation",
    description:
      "Welcome to the internal developer documentation for TouchPay's core APIs. This portal is intended for engineering teams building and maintaining our fintech infrastructure, including services such as UPI routing, transaction processing, wallet management, settlement workflows, KYC, authentication, and risk evaluation modules. All APIs documented here are private and governed by internal access policies and RBAC rules.",
    endpoint_description:
      "Browse the categorized endpoints in the sidebar to view endpoint specifications, required headers, request/response formats, parameter details, rate limits, and internal usage notes. Each API is version-controlled and aligned with our internal service registry. Use this portal as the source of truth for service integrations, debugging, or testing against staging environments. Please ensure all usage complies with our InfoSec, audit, and RBI compliance requirements."
  }
  
  

  const currentContent = selectedApi || defaultContent

  return (
    <>
      {/* Mobile Restriction Overlay */}
      <MobileRestriction />

      {/* Fixed Header */}
      <Header onApiSelect={handleApiSelect} onContributeSuccess={handleContributeSuccess} />

      {/* Fixed Sidebar */}
      <AppSidebar 
        onApiSelect={handleApiSelect} 
        selectedApiId={selectedApiId || undefined} 
        onGetStartedClick={handleGetStartedClick}
        isGetStartedOpen={isGetStartedOpen}
        refreshTrigger={sidebarRefreshTrigger}
      />

      {/* Main Content with left margin for fixed sidebar */}
      <div className="flex-1 ml-64 p-8 pl-20 pt-10" style={{ backgroundColor: "#0D0E0F" }}>
        {loading ? (
          <ContentSkeleton />
        ) : selectedApi ? (
          <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">
                {currentContent.api_title}
              </h1>
              <div className="text-zinc-400 text-sm leading-relaxed">
                {currentContent.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* End points section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">End point</h2>
              <div className="text-zinc-400 text-sm mb-6">
                {selectedApi.endpoint_description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-2 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* API Endpoint */}
              <div className="bg-zinc-800 rounded-lg p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-zinc-600 text-white hover:bg-zinc-700">
                    {selectedApi.method}
                  </Badge>
                  <code className="text-zinc-300 font-mono">{selectedApi.endpoint}</code>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-zinc-400 hover:text-white relative"
                  onClick={() => copyToClipboard(selectedApi.endpoint, setCopiedEndpoint)}
                >
                  {copiedEndpoint ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copiedEndpoint && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-bounce">
                      Copied!
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {/* Request Body */}
            {selectedApi.request_body && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Request Body</h3>

                <Tabs defaultValue="json" className="w-full">
                  <TabsList className="bg-zinc-800 border-zinc-700">
                    <TabsTrigger value="json" className="data-[state=active]:bg-zinc-700">
                      json
                    </TabsTrigger>
                    <TabsTrigger value="curl" className="data-[state=active]:bg-zinc-700">
                      cURL
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="json" className="mt-4">
                    <div className="relative">
                      <Badge className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700">JSON</Badge>
                      <Card className="bg-zinc-800 border-zinc-700 p-0">
                        <div className="p-6">
                          <pre className="text-sm text-zinc-300 font-mono leading-relaxed">
                            <div className="flex">
                              <div className="text-zinc-500 select-none w-8 text-right mr-4 flex-shrink-0">
                                {JSON.stringify(selectedApi.request_body, null, 2).split('\n').map((_, i) => (
                                  <div key={i + 1}>{i + 1}</div>
                                ))}
                              </div>
                              <div className="flex-1 overflow-x-auto">
                                {JSON.stringify(selectedApi.request_body, null, 2).split('\n').map((line, index) => {
                                  // Apply syntax highlighting to JSON
                                  const highlightedLine = line.replace(
                                    /(".*?"):\s*([^,\s]+)/g,
                                    '<span class="text-orange-400">$1</span>: <span class="text-orange-400">$2</span>'
                                  ).replace(
                                    /(".*?"):\s*(".*?")/g,
                                    '<span class="text-blue-400">$1</span>: <span class="text-blue-400">$2</span>'
                                  );
                                  
                                  return (
                                    <div 
                                      key={index} 
                                      dangerouslySetInnerHTML={{ __html: highlightedLine }}
                                      className="whitespace-pre"
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </pre>
                        </div>
                      </Card>
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-zinc-400 hover:text-white p-1 relative"
                          onClick={() => copyToClipboard(JSON.stringify(selectedApi.request_body, null, 2), setCopiedJson)}
                        >
                          {copiedJson ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          {copiedJson && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-bounce">
                              Copied!
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="curl" className="mt-4">
                    <Card className="bg-zinc-800 border-zinc-700">
                      <div className="p-6">
                        <pre className="text-sm text-zinc-300 font-mono">
                          <span className="text-blue-400">curl</span> -X <span className="text-green-400">{selectedApi.method}</span> <span className="text-blue-400">https://core.touchpay.one</span><span className="text-green-400">{selectedApi.endpoint}</span>
                        </pre>
                      </div>
                    </Card>
                    <div className="mt-2 flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-zinc-400 hover:text-white relative"
                        onClick={() => copyToClipboard(`curl -X ${selectedApi.method} https://core.touchpay.one${selectedApi.endpoint}`, setCopiedCurl)}
                      >
                        {copiedCurl ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {copiedCurl && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-bounce">
                            Copied!
                          </div>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Response Body */}
            {selectedApi.response_body && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Response Body</h3>
                <Card className="bg-zinc-800 border-zinc-700">
                  <div className="p-6">
                    <pre className="text-sm text-zinc-300 font-mono leading-relaxed">
                      <div className="flex">
                        <div className="text-zinc-500 select-none w-8 text-right mr-4 flex-shrink-0">
                          {JSON.stringify(selectedApi.response_body, null, 2).split('\n').map((_, i) => (
                            <div key={i + 1}>{i + 1}</div>
                          ))}
                        </div>
                        <div className="flex-1 overflow-x-auto">
                          {JSON.stringify(selectedApi.response_body, null, 2).split('\n').map((line, index) => (
                            <div key={index} className="text-green-400 whitespace-pre">{line}</div>
                          ))}
                        </div>
                      </div>
                    </pre>
                  </div>
                </Card>
              </div>
            )}

            {/* Path Parameters */}
            {selectedApi.path_parameters && selectedApi.path_parameters.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Path Parameters</h3>
                <Card className="bg-zinc-800 border-zinc-700">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-700 hover:bg-zinc-800">
                        <TableHead className="text-zinc-300">Parameter</TableHead>
                        <TableHead className="text-zinc-300">Type</TableHead>
                        <TableHead className="text-zinc-300">Required</TableHead>
                        <TableHead className="text-zinc-300">Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedApi.path_parameters.map((param, index) => (
                        <TableRow key={index} className="border-zinc-700 hover:bg-zinc-750">
                          <TableCell>
                            <code className="bg-zinc-700 px-2 py-1 rounded text-sm text-zinc-300">{param.name}</code>
                          </TableCell>
                          <TableCell className="text-green-400">{param.type}</TableCell>
                          <TableCell className="text-zinc-300">{param.required ? "yes" : "no"}</TableCell>
                          <TableCell className="text-zinc-400">{param.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )}

            {/* Token and Role Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Token and Role</h3>
              <Card className="bg-zinc-800 border-zinc-700">
                <div className="p-6">
                  <pre className="text-sm text-zinc-300 font-mono leading-relaxed">
                    <div className="flex">
                      <div className="text-zinc-500 select-none w-8 text-right mr-4">
                        {Array.from({ length: 4 }, (_, i) => (
                          <div key={i + 1}>{i + 1}</div>
                        ))}
                      </div>
                      <div className="flex-1">
                        <div>{"{"}</div>
                        <div>
                          {" "}
                          <span className="text-blue-400">"accessToken"</span>:{" "}
                          <span className="text-orange-400">"{selectedApi.accessToken || ""}"</span>,
                        </div>
                        <div>
                          {" "}
                          <span className="text-blue-400">"accessRole"</span>:{" "}
                          <span className="text-orange-400">"{selectedApi.accessRole || ""}"</span>
                        </div>
                        <div>{"}"}</div>
                      </div>
                    </div>
                  </pre>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-6 mt-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TouchPay Internal API Documentation
              </h1>
              <p className="text-zinc-300 text-xl leading-relaxed max-w-4xl mx-auto">
                Welcome to the internal developer documentation for TouchPay's core APIs. This portal is intended for engineering teams building and maintaining our fintech infrastructure.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card className="bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <div className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">UPI Routing</h3>
                  <p className="text-zinc-400 text-sm">Advanced UPI transaction routing and processing infrastructure</p>
                </div>
              </Card>

              <Card className="bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                <div className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Transaction Processing</h3>
                  <p className="text-zinc-400 text-sm">High-performance transaction processing and settlement workflows</p>
                </div>
              </Card>

              <Card className="bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
                <div className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Wallet Management</h3>
                  <p className="text-zinc-400 text-sm">Comprehensive digital wallet and account management systems</p>
                </div>
              </Card>

              <Card className="bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <div className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">KYC & Authentication</h3>
                  <p className="text-zinc-400 text-sm">Secure identity verification and authentication services</p>
                </div>
              </Card>

              <Card className="bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
                <div className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Risk Evaluation</h3>
                  <p className="text-zinc-400 text-sm">Advanced risk assessment and fraud detection algorithms</p>
                </div>
              </Card>

              <Card className="bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
                <div className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Settlement Workflows</h3>
                  <p className="text-zinc-400 text-sm">Automated settlement and reconciliation processes</p>
                </div>
              </Card>
            </div>

            {/* Info Section */}
            <div className="bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 rounded-2xl p-8 border border-zinc-700/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Info className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-0">Internal Access Only</h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
