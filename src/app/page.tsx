"use client"


import { Card } from "@/components/ui/card"
import { Copy, Info, Check, Shield, Database, Zap, Users, CreditCard, FileText, Settings, Trash2 } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { MobileRestriction } from "@/components/mobile-restriction"
import { useEffect, useState } from "react"
import { fetchApiDoc, type ApiDoc, API_BASE_URL } from "@/lib/api"
import React from "react"
import "./description-rich.css"

type StatusCode = {
  code: number;
  label: string;
  meaning: string;
  description: string;
};


// Utility: Render code/JSON with // comments highlighted in orange
function JsonWithComments({ code, className }: { code: string, className?: string }) {
  // Split code into lines
  return (
    <pre className={className} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
      {code.split(/\r?\n/).map((line, idx) => {
        // Find // comment in the line
        const commentIdx = line.indexOf("//");
        if (commentIdx !== -1) {
          return (
            <div key={idx}>
              <span>{line.slice(0, commentIdx)}</span>
              <span style={{ color: "orange" }}>{line.slice(commentIdx)}</span>
            </div>
          );
        } else {
          return <div key={idx}>{line}</div>;
        }
      })}
    </pre>
  );
}

// Dynamic API Content Renderer
function ApiContentRenderer({ api, onDeleteApi }: { api: ApiDoc; onDeleteApi: () => void }) {
  const isGetMethod = api.method === 'GET';
  const isPostMethod = api.method === 'POST';
  const isDeleteMethod = api.method === 'DELETE';
  const isPutMethod = api.method === 'PUT';
  const isPatchMethod = api.method === 'PATCH';
  
  const isAuthRelated = api.subtitle.toLowerCase().includes('auth') || api.subtitle.toLowerCase().includes('login');
  const isPaymentRelated = api.subtitle.toLowerCase().includes('payment') || api.subtitle.toLowerCase().includes('transaction');
  const isUserRelated = api.subtitle.toLowerCase().includes('user') || api.subtitle.toLowerCase().includes('profile');
  const isWalletRelated = api.subtitle.toLowerCase().includes('wallet') || api.subtitle.toLowerCase().includes('balance');
  const isKycRelated = api.subtitle.toLowerCase().includes('kyc') || api.subtitle.toLowerCase().includes('verification');

  // Method-specific color schemes
  const getMethodColors = () => {
    if (isGetMethod) return { bg: 'bg-green-600', text: 'text-green-400', border: 'border-green-600' };
    if (isPostMethod) return { bg: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-600' };
    if (isDeleteMethod) return { bg: 'bg-red-600', text: 'text-red-400', border: 'border-red-600' };
    if (isPutMethod) return { bg: 'bg-orange-600', text: 'text-orange-400', border: 'border-orange-600' };
    if (isPatchMethod) return { bg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-600' };
    return { bg: 'bg-zinc-600', text: 'text-zinc-400', border: 'border-zinc-600' };
  };

  const colors = getMethodColors();

  // Layout variations based on API characteristics
  const getLayoutVariant = () => {
    if (isAuthRelated) return 'auth';
    if (isPaymentRelated) return 'payment';
    if (isUserRelated) return 'user';
    if (isWalletRelated) return 'wallet';
    if (isKycRelated) return 'kyc';
    return 'default';
  };

  const layoutVariant = getLayoutVariant();

  return (
    <div className="max-w-6xl">
      {/* Header Section with Dynamic Styling */}
      <div className={`mb-8 p-6 rounded-xl border ${colors.border} bg-gradient-to-r from-zinc-800/50 to-zinc-900/50`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className={`${colors.bg} text-white px-3 py-1 rounded font-mono text-sm font-semibold`}>
                {api.method}
              </span>
              <span className="text-zinc-400 text-sm">{api.subtitle}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">{api.api_title}</h1>
            <div className="text-zinc-300 text-sm leading-relaxed">
              <div
                className="description-rich-text"
                dangerouslySetInnerHTML={{ __html: api.description }}
              />
            </div>
          </div>
                     <button
             onClick={onDeleteApi}
             title="Delete API"
             className="p-2 rounded-full bg-transparent hover:bg-red-600/20 text-zinc-400 hover:text-red-600 transition-colors"
           >
             <Trash2 className="w-6 h-6" />
           </button>
        </div>
      </div>

      {/* Dynamic Layout Based on API Type */}
      {layoutVariant === 'auth' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Endpoint */}
          <div className="space-y-6">
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Authentication Endpoint
              </h2>
              <div className="text-zinc-400 text-sm mb-4">
                {api.endpoint_description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-2 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="bg-zinc-900 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`${colors.bg} text-white px-3 py-1 rounded font-mono text-sm`}>
                    {api.method}
                  </span>
                  <code className="text-zinc-300 font-mono">{api.endpoint}</code>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Token & Role */}
          <div className="space-y-6">
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Access Control
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-zinc-900 rounded">
                  <span className="text-zinc-400 font-medium">Access Token:</span>
                  <span className="text-blue-400 font-mono">{api.accessToken}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-900 rounded">
                  <span className="text-zinc-400 font-medium">Access Role:</span>
                  <span className="text-green-400 font-mono">{api.accessRole}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {layoutVariant === 'payment' && (
        <div className="space-y-8">
          {/* Payment-specific header */}
          <div className="bg-gradient-to-r from-green-800/20 to-emerald-800/20 border border-green-700/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Payment Processing</h2>
            </div>
            <div className="text-zinc-300 text-sm">
              {api.endpoint_description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-2 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Endpoint with enhanced styling */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Transaction Endpoint</h3>
            <div className="bg-zinc-900 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`${colors.bg} text-white px-3 py-1 rounded font-mono text-sm`}>
                  {api.method}
                </span>
                <code className="text-zinc-300 font-mono">{api.endpoint}</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {layoutVariant === 'wallet' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Wallet Balance Section */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-blue-800/20 to-cyan-800/20 border border-blue-700/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Wallet Operations</h2>
              </div>
              <div className="text-zinc-300 text-sm mb-4">
                {api.endpoint_description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-2 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="bg-zinc-900 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`${colors.bg} text-white px-3 py-1 rounded font-mono text-sm`}>
                    {api.method}
                  </span>
                  <code className="text-zinc-300 font-mono">{api.endpoint}</code>
                </div>
              </div>
            </div>
          </div>

          {/* Access Control */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Access Control</h3>
            <div className="space-y-3">
              <div className="p-3 bg-zinc-900 rounded">
                <span className="text-zinc-400 text-sm">Token:</span>
                <div className="text-blue-400 font-mono text-sm mt-1">{api.accessToken}</div>
              </div>
              <div className="p-3 bg-zinc-900 rounded">
                <span className="text-zinc-400 text-sm">Role:</span>
                <div className="text-green-400 font-mono text-sm mt-1">{api.accessRole}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {layoutVariant === 'user' && (
        <div className="space-y-8">
          {/* User Profile Header */}
          <div className="bg-gradient-to-r from-purple-800/20 to-pink-800/20 border border-purple-700/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">User Management</h2>
            </div>
            <div className="text-zinc-300 text-sm">
              {api.endpoint_description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-2 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Endpoint and Access */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">API Endpoint</h3>
              <div className="bg-zinc-900 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`${colors.bg} text-white px-3 py-1 rounded font-mono text-sm`}>
                    {api.method}
                  </span>
                  <code className="text-zinc-300 font-mono">{api.endpoint}</code>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Permissions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-zinc-900 rounded">
                  <span className="text-zinc-400 text-sm">Token:</span>
                  <span className="text-blue-400 font-mono text-sm">{api.accessToken}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-900 rounded">
                  <span className="text-zinc-400 text-sm">Role:</span>
                  <span className="text-green-400 font-mono text-sm">{api.accessRole}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {layoutVariant === 'kyc' && (
        <div className="space-y-8">
          {/* KYC Verification Header */}
          <div className="bg-gradient-to-r from-orange-800/20 to-red-800/20 border border-orange-700/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">KYC Verification</h2>
            </div>
            <div className="text-zinc-300 text-sm">
              {api.endpoint_description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-2 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Endpoint and Security */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Verification Endpoint</h3>
              <div className="bg-zinc-900 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`${colors.bg} text-white px-3 py-1 rounded font-mono text-sm`}>
                    {api.method}
                  </span>
                  <code className="text-zinc-300 font-mono">{api.endpoint}</code>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Security Requirements</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-zinc-900 rounded">
                  <span className="text-zinc-400 text-sm">Token:</span>
                  <span className="text-blue-400 font-mono text-sm">{api.accessToken}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-900 rounded">
                  <span className="text-zinc-400 text-sm">Role:</span>
                  <span className="text-green-400 font-mono text-sm">{api.accessRole}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Default Layout for other APIs */}
      {layoutVariant === 'default' && (
        <div className="space-y-8">
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Endpoint</h2>
            <div className="text-zinc-400 text-sm mb-6">
              {api.endpoint_description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-2 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`${colors.bg} text-white px-3 py-1 rounded font-mono text-sm`}>
                  {api.method}
                </span>
                <code className="text-zinc-300 font-mono">{api.endpoint}</code>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Access Control</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-zinc-900 rounded">
                <span className="text-zinc-400 text-sm">Access Token:</span>
                <div className="text-blue-400 font-mono text-sm mt-1">{api.accessToken}</div>
              </div>
              <div className="p-3 bg-zinc-900 rounded">
                <span className="text-zinc-400 text-sm">Access Role:</span>
                <div className="text-green-400 font-mono text-sm mt-1">{api.accessRole}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Body */}
      {api.request_body && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 mt-10">Request Body</h3>
          <JsonWithComments
            code={typeof api.request_body === 'string' ? api.request_body : JSON.stringify(api.request_body, null, 2)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-sm text-zinc-300 font-mono overflow-x-auto"
          />
        </div>
      )}

      {/* Request Body Schema */}
      {api.request_body_schema && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Request Body Schema</h3>
          <JsonWithComments
            code={typeof api.request_body_schema === 'string' ? api.request_body_schema : JSON.stringify(api.request_body_schema, null, 2)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-sm text-indigo-300 font-mono overflow-x-auto"
          />
        </div>
      )}

      {/* Response Body */}
      {api.response_body && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Response Body</h3>
          <JsonWithComments
            code={typeof api.response_body === 'string' ? api.response_body : JSON.stringify(api.response_body, null, 2)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-sm text-green-400 font-mono overflow-x-auto"
          />
        </div>
      )}

      {/* Path Parameters */}
      {api.path_parameters && api.path_parameters.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Path Parameters</h3>
          <div className="bg-zinc-800 border-zinc-700 rounded-lg p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-sm font-semibold text-zinc-300 bg-zinc-700">Name</th>
                  <th className="px-3 py-2 text-sm font-semibold text-zinc-300 bg-zinc-700">Type</th>
                  <th className="px-3 py-2 text-sm font-semibold text-zinc-300 bg-zinc-700">Required</th>
                  <th className="px-3 py-2 text-sm font-semibold text-zinc-300 bg-zinc-700">Description</th>
                </tr>
              </thead>
              <tbody>
                {api.path_parameters.map((param, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-zinc-700">
                    <td className="px-3 py-2 text-sm text-white">{param.name}</td>
                    <td className="px-3 py-2 text-sm text-zinc-300">{param.type}</td>
                    <td className="px-3 py-2 text-sm text-zinc-300">{param.required ? "Yes" : "No"}</td>
                    <td className="px-3 py-2 text-sm text-zinc-300">{param.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
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
  const [showStatusCodes, setShowStatusCodes] = useState(false);
  const [statusCodes, setStatusCodes] = useState<StatusCode[]>([]);
  const [loadingStatusCodes, setLoadingStatusCodes] = useState(false);
  // Static time labels to prevent flickering


  const handleApiSelect = async (apiId: string) => {
    console.log('handleApiSelect called with:', apiId);
    setSelectedApiId(apiId)
    setIsGetStartedOpen(false)
    setShowStatusCodes(false)
    setLoading(true)
    try {
      const apiDoc = await fetchApiDoc(apiId)
      console.log('Fetched API doc:', apiDoc);
      setSelectedApi(apiDoc)
    } catch (error) {
      console.error('Failed to fetch API documentation:', error)
      setSelectedApi(null)
    } finally {
      setLoading(false)
    }
  }

  const handleGetStartedClick = () => {
    setSelectedApi(null)
    setSelectedApiId(null)
    setIsGetStartedOpen(true)
    setShowStatusCodes(false)
  }

  const handleContributeSuccess = () => {
    // Refresh sidebar data to show new API
    setSidebarRefreshTrigger(prev => prev + 1)
    
    // Also refresh current API if one is selected
    if (selectedApiId) {
      handleApiSelect(selectedApiId)
    }
  }

  const handleStatusCodesClick = async () => {
    setShowStatusCodes(true);
    setIsGetStartedOpen(false);
    setSelectedApi(null);
    setSelectedApiId(null);
    setLoadingStatusCodes(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/docs/status-codes`);
      const data = await res.json();
      setStatusCodes(data);
    } catch (e) {
      setStatusCodes([]);
    } finally {
      setLoadingStatusCodes(false);
    }
  };

  const handleDeleteApi = async () => {
    if (!selectedApi?._id) return;
    if (!window.confirm("Are you sure you want to delete this API? This action cannot be undone.")) return;
    try {
      await fetch(`${API_BASE_URL}/api/docs/${selectedApi._id}`, { method: "DELETE" });
      setSelectedApi(null);
      setSelectedApiId(null);
      setIsGetStartedOpen(true);
      setSidebarRefreshTrigger(prev => prev + 1);
    } catch (e) {
      alert("Failed to delete API.");
    }
  };

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
        onStatusCodesClick={handleStatusCodesClick}
        isStatusCodesOpen={showStatusCodes}
      />

      {/* Main Content with left margin for fixed sidebar */}
      <div className="flex-1 ml-64 p-8 pt-10" style={{ backgroundColor: "#0D0E0F" }}>
        {showStatusCodes ? (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6 text-left mt-10">HTTP Status Codes</h1>
            {loadingStatusCodes ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-sm font-semibold text-zinc-300 bg-zinc-800">Code</th>
                      <th className="px-3 py-2 text-sm font-semibold text-zinc-300 bg-zinc-800">Label</th>
                      <th className="px-3 py-2 text-sm font-semibold text-zinc-300 bg-zinc-800">Meaning</th>
                      <th className="px-3 py-2 text-sm font-semibold text-zinc-300 bg-zinc-800">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(8)].map((_, idx) => (
                      <tr key={idx} className={
                        "transition-colors " +
                        (idx % 2 === 0 ? "bg-zinc-900" : "bg-zinc-800")
                      }>
                        <td className="px-3 py-2">
                          <div className="h-5 w-10 bg-zinc-700 rounded animate-pulse"></div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="h-5 w-20 bg-zinc-700 rounded animate-pulse"></div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="h-5 w-24 bg-zinc-700 rounded animate-pulse"></div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="h-5 w-40 bg-zinc-700 rounded animate-pulse"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-sm font-semibold text-zinc-300 bg-zinc-800">Code</th>
                      <th className="px-3 py-2 text-sm font-semibold text-zinc-300 bg-zinc-800">Label</th>
                      <th className="px-3 py-2 text-sm font-semibold text-zinc-300 bg-zinc-800">Meaning</th>
                      <th className="px-3 py-2 text-sm font-semibold text-zinc-300 bg-zinc-800">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statusCodes.map((sc, idx) => (
                      <tr
                        key={sc.code}
                        className={
                          "transition-colors hover:bg-zinc-800 " +
                          (idx % 2 === 0 ? "bg-zinc-900" : "bg-zinc-800")
                        }
                      >
                        <td className="px-3 py-2">
                          <span
                            className={
                              "inline-block px-2 py-0.5 rounded text-xs font-semibold " +
                              (sc.code >= 200 && sc.code < 300
                                ? "bg-green-600 text-white"
                                : sc.code >= 400 && sc.code < 500
                                ? "bg-yellow-500 text-zinc-900"
                                : sc.code >= 500
                                ? "bg-red-600 text-white"
                                : "bg-zinc-700 text-zinc-200")
                            }
                          >
                            {sc.code}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-sm text-white font-medium">{sc.label}</td>
                        <td className="px-3 py-2 text-sm text-indigo-400">{sc.meaning}</td>
                        <td className="px-3 py-2 text-sm text-zinc-300">{sc.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
                  ) : selectedApi ? (
            <ApiContentRenderer api={selectedApi} onDeleteApi={handleDeleteApi} />
          ) : (
          <div className="max-w-6xl">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-6 mt-10 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
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
