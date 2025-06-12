"use client"

import { useState } from "react"
import type { PolkadotDoc } from "@/lib/polkadot-docs"
import { Clock, User, Tag, BookOpen, Code, Copy, Check, ExternalLink } from "lucide-react"

interface DocViewerProps {
  doc: PolkadotDoc
  onClose: () => void
}

export default function DocViewer({ doc, onClose }: DocViewerProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopyCode = async (code: string, title: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(title)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500"
      case "intermediate":
        return "bg-yellow-500"
      case "advanced":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-6 text-white">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mb-4 mt-8 text-gray-100">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mb-3 mt-6 text-gray-200">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-800 px-2 py-1 rounded text-[#e6007a] font-mono text-sm">$1</code>')
      .replace(/```[\s\S]*?```/g, "") // Remove code blocks (handled separately)
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-300 leading-relaxed">')
      .replace(/^(.+)$/gm, '<p class="mb-4 text-gray-300 leading-relaxed">$1</p>')
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#e6007a] to-[#552bbf] p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen size={24} className="text-white" />
                <h1 className="text-2xl font-bold text-white">{doc.title}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getDifficultyColor(doc.difficulty)}`}
                >
                  {doc.difficulty}
                </span>
              </div>
              <p className="text-pink-100 text-lg mb-4">{doc.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-pink-100">
                <div className="flex items-center gap-1">
                  <User size={14} />
                  {doc.author}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {doc.readTime} min read
                </div>
                <div className="flex items-center gap-1">
                  <Tag size={14} />
                  {doc.category}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-white hover:text-pink-200 transition-colors text-2xl font-bold ml-4"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-200px)]">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: formatContent(doc.content) }}
            />

            {/* Code Examples */}
            {doc.examples && doc.examples.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-white">Code Examples</h2>
                <div className="space-y-6">
                  {doc.examples.map((example, index) => (
                    <div key={index} className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                      <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
                        <div className="flex items-center gap-3">
                          <Code size={16} className="text-[#e6007a]" />
                          <span className="font-medium text-white">{example.title}</span>
                          <span className="badge badge-secondary text-xs">{example.language}</span>
                        </div>
                        <button
                          onClick={() => handleCopyCode(example.code, example.title)}
                          className="btn btn-secondary btn-sm flex items-center gap-1"
                        >
                          {copiedCode === example.title ? <Check size={14} /> : <Copy size={14} />}
                          {copiedCode === example.title ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <div className="p-4 overflow-x-auto">
                        <pre className="text-sm text-gray-300">
                          <code>{example.code}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-gray-900 border-l border-gray-800 p-6">
            <div className="space-y-6">
              {/* Tags */}
              <div>
                <h3 className="font-bold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {doc.tags.map((tag) => (
                    <span key={tag} className="badge badge-primary text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-bold text-white mb-3">Quick Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white">{doc.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Difficulty:</span>
                    <span className="text-white capitalize">{doc.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Read Time:</span>
                    <span className="text-white">{doc.readTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Updated:</span>
                    <span className="text-white">{doc.lastUpdated}</span>
                  </div>
                </div>
              </div>

              {/* External Links */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-bold text-white mb-3">Related Links</h3>
                <div className="space-y-2">
                  <a
                    href="https://docs.polkadot.network"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#e6007a] hover:text-pink-400 transition-colors text-sm"
                  >
                    <ExternalLink size={14} />
                    Official Docs
                  </a>
                  <a
                    href="https://substrate.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#e6007a] hover:text-pink-400 transition-colors text-sm"
                  >
                    <ExternalLink size={14} />
                    Substrate Docs
                  </a>
                  <a
                    href="https://wiki.polkadot.network"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#e6007a] hover:text-pink-400 transition-colors text-sm"
                  >
                    <ExternalLink size={14} />
                    Polkadot Wiki
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
