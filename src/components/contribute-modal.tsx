"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Plus, Trash2, Save, Loader2 } from "lucide-react"
import { createApiDoc, type ApiDoc } from "@/lib/api"

interface ContributeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface PathParameter {
  name: string
  type: string
  required: boolean
  description: string
}

const HTTP_METHODS = ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'] as const
const ACCESS_TOKEN_OPTIONS = ['required', 'not required'] as const
const ACCESS_ROLE_OPTIONS = ['admin', 'superadmin', 'user', 'employee', 'none'] as const

export function ContributeModal({ isOpen, onClose, onSuccess }: ContributeModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    subtitle: "",
    api_title: "",
    method: "GET" as const,
    endpoint: "",
    endpoint_description: "",
    description: "",
    request_body: "",
    response_body: "",
    path_parameters: [] as PathParameter[],
    accessToken: "required" as const,
    accessRole: "admin" as const,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleJsonChange = (field: 'request_body' | 'response_body', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const addPathParameter = () => {
    setFormData(prev => ({
      ...prev,
      path_parameters: [...prev.path_parameters, {
        name: "",
        type: "string",
        required: true,
        description: ""
      }]
    }))
  }

  const updatePathParameter = (index: number, field: keyof PathParameter, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      path_parameters: prev.path_parameters.map((param, i) => 
        i === index ? { ...param, [field]: value } : param
      )
    }))
  }

  const removePathParameter = (index: number) => {
    setFormData(prev => ({
      ...prev,
      path_parameters: prev.path_parameters.filter((_, i) => i !== index)
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData._id.trim()) newErrors._id = "ID is required"
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.subtitle.trim()) newErrors.subtitle = "Subtitle is required"
    if (!formData.api_title.trim()) newErrors.api_title = "API title is required"
    if (!formData.endpoint.trim()) newErrors.endpoint = "Endpoint is required"
    if (!formData.endpoint_description.trim()) newErrors.endpoint_description = "Endpoint description is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"

    // Validate JSON fields
    if (formData.request_body.trim()) {
      try {
        JSON.parse(formData.request_body)
      } catch {
        newErrors.request_body = "Invalid JSON format"
      }
    }

    if (formData.response_body.trim()) {
      try {
        JSON.parse(formData.response_body)
      } catch {
        newErrors.response_body = "Invalid JSON format"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const apiData = {
        ...formData,
        request_body: formData.request_body.trim() ? JSON.parse(formData.request_body) : undefined,
        response_body: formData.response_body.trim() ? JSON.parse(formData.response_body) : undefined,
      }

      const result = await createApiDoc(apiData)
      
      if (result) {
        onSuccess?.()
        onClose()
        // Reset form
        setFormData({
          _id: "",
          title: "",
          subtitle: "",
          api_title: "",
          method: "GET",
          endpoint: "",
          endpoint_description: "",
          description: "",
          request_body: "",
          response_body: "",
          path_parameters: [],
          accessToken: "required",
          accessRole: "admin",
        })
      }
    } catch (error) {
      console.error('Failed to create API:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-700">
          <h2 className="text-xl font-semibold text-white">Create New API Documentation</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white mb-4">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">API ID (Slug)</label>
                <input
                  type="text"
                  value={formData._id}
                  onChange={(e) => handleInputChange('_id', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., update-batch-job"
                />
                {errors._id && <p className="text-red-400 text-sm mt-1">{errors._id}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Category Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Speech API"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Batch Processing"
                />
                {errors.subtitle && <p className="text-red-400 text-sm mt-1">{errors.subtitle}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">API Title</label>
                <input
                  type="text"
                  value={formData.api_title}
                  onChange={(e) => handleInputChange('api_title', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Update Batch Job"
                />
                {errors.api_title && <p className="text-red-400 text-sm mt-1">{errors.api_title}</p>}
              </div>
            </div>

            {/* API Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white mb-4">API Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">HTTP Method</label>
                  <select
                    value={formData.method}
                    onChange={(e) => handleInputChange('method', e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {HTTP_METHODS.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Access Token</label>
                  <select
                    value={formData.accessToken}
                    onChange={(e) => handleInputChange('accessToken', e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ACCESS_TOKEN_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Endpoint</label>
                <input
                  type="text"
                  value={formData.endpoint}
                  onChange={(e) => handleInputChange('endpoint', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., /v1/speech/batch/{batchId}"
                />
                {errors.endpoint && <p className="text-red-400 text-sm mt-1">{errors.endpoint}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Access Role</label>
                <select
                  value={formData.accessRole}
                  onChange={(e) => handleInputChange('accessRole', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ACCESS_ROLE_OPTIONS.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium text-white">Descriptions</h3>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Endpoint Description</label>
              <textarea
                value={formData.endpoint_description}
                onChange={(e) => handleInputChange('endpoint_description', e.target.value)}
                rows={3}
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of what this endpoint does..."
              />
              {errors.endpoint_description && <p className="text-red-400 text-sm mt-1">{errors.endpoint_description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Full Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed description of the API functionality..."
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* JSON Bodies */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium text-white">Request & Response</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Request Body (JSON)</label>
                <textarea
                  value={formData.request_body}
                  onChange={(e) => handleJsonChange('request_body', e.target.value)}
                  rows={8}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder='{\n  "key": "value"\n}'
                />
                {errors.request_body && <p className="text-red-400 text-sm mt-1">{errors.request_body}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Response Body (JSON)</label>
                <textarea
                  value={formData.response_body}
                  onChange={(e) => handleJsonChange('response_body', e.target.value)}
                  rows={8}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder='{\n  "success": true\n}'
                />
                {errors.response_body && <p className="text-red-400 text-sm mt-1">{errors.response_body}</p>}
              </div>
            </div>
          </div>

          {/* Path Parameters */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Path Parameters</h3>
              <Button
                type="button"
                onClick={addPathParameter}
                variant="outline"
                size="sm"
                className="text-black hover:text-black/70 bg-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Parameter
              </Button>
            </div>

            <div className="space-y-3">
              {formData.path_parameters.map((param, index) => (
                <Card key={index} className="bg-zinc-800 border-zinc-700 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Name</label>
                      <input
                        type="text"
                        value={param.name}
                        onChange={(e) => updatePathParameter(index, 'name', e.target.value)}
                        className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-white text-sm"
                        placeholder="parameterName"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Type</label>
                      <select
                        value={param.type}
                        onChange={(e) => updatePathParameter(index, 'type', e.target.value)}
                        className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-white text-sm"
                      >
                        <option value="string">string</option>
                        <option value="number">number</option>
                        <option value="boolean">boolean</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Required</label>
                      <select
                        value={param.required.toString()}
                        onChange={(e) => updatePathParameter(index, 'required', e.target.value === 'true')}
                        className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-white text-sm"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
                        <input
                          type="text"
                          value={param.description}
                          onChange={(e) => updatePathParameter(index, 'description', e.target.value)}
                          className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-white text-sm"
                          placeholder="Parameter description"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() => removePathParameter(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-zinc-700">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="text-black hover:text-black/70 bg-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create API
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 