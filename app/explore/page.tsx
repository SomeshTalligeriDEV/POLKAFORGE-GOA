"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import OfflineIndicator from "@/components/offline-indicator"
import RepoList from "@/components/repo-list"
import StatsDashboard from "@/components/stats-dashboard"
import TrendingRepos from "@/components/trending-repos"
import ActivityFeed from "@/components/activity-feed"
import NFTGallery from "@/components/nft-gallery"
import DocViewer from "@/components/doc-viewer"
import { repositoryStorage } from "@/lib/storage"
import { polkadotDocs, docCategories, searchDocs, getDocsByCategory } from "@/lib/polkadot-docs"
import { useWallet } from "@/hooks/use-wallet"
import type { Repository } from "@/lib/types"
import type { PolkadotDoc } from "@/lib/polkadot-docs"
import { Search, Filter, BookOpen, Code, Sparkles, TrendingUp, Activity, Clock, Tag, ChevronRight } from "lucide-react"

export default function ExplorePage() {
  const { connected } = useWallet()
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDoc, setSelectedDoc] = useState<PolkadotDoc | null>(null)
  const [filteredDocs, setFilteredDocs] = useState<PolkadotDoc[]>(polkadotDocs)

  useEffect(() => {
    const timer = setTimeout(() => {
      const allRepos = repositoryStorage.getAll()
      setRepos(allRepos)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let docs = polkadotDocs

    if (searchQuery) {
      docs = searchDocs(searchQuery)
    } else if (selectedCategory !== "all") {
      docs = getDocsByCategory(selectedCategory)
    }

    setFilteredDocs(docs)
  }, [searchQuery, selectedCategory])

  const sections = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "repositories", label: "Repositories", icon: Code },
    { id: "documentation", label: "Documentation", icon: BookOpen },
    { id: "nfts", label: "NFT Gallery", icon: Sparkles },
    { id: "activity", label: "Activity", icon: Activity },
  ]

  return (
    <div className="relative min-h-screen bg-white">
      <div className="relative z-10">
        <Header />
        <OfflineIndicator />

        <div className="container py-8">
          {/* Hero Section */}
          <section className="text-center py-16">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold mb-6 text-gray-900 animate-fadeIn">Explore PolkaForge</h1>
              <p className="text-xl text-gray-700 mb-8 animate-slideIn">
                Discover repositories, documentation, NFTs, and the vibrant Polkadot ecosystem
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="badge bg-[#e6007a] text-white text-lg px-6 py-3 animate-pulse">
                  🔗 Polkadot Ecosystem
                </div>
                <div className="badge bg-gray-200 text-gray-800 text-lg px-6 py-3">📚 Comprehensive Docs</div>
                <div className="badge bg-gray-200 text-gray-800 text-lg px-6 py-3">🎨 NFT Gallery</div>
                <div className="badge bg-gray-200 text-gray-800 text-lg px-6 py-3">📊 Live Analytics</div>
              </div>
            </div>
          </section>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-100 rounded-full p-1 border border-gray-200">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                    activeSection === section.id
                      ? "bg-[#e6007a] text-white shadow-lg"
                      : "hover:bg-gray-200 text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <section.icon size={18} />
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          {activeSection === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <StatsDashboard />
              </div>
              <div className="space-y-8">
                <TrendingRepos />
                <ActivityFeed />
              </div>
            </div>
          )}

          {activeSection === "repositories" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">All Repositories</h2>
                {connected && (
                  <a href="/new" className="btn btn-primary">
                    <Sparkles size={16} className="mr-2" />
                    Create New
                  </a>
                )}
              </div>
              <RepoList repos={repos} loading={loading} />
            </div>
          )}

          {activeSection === "documentation" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Polkadot Documentation</h2>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search documentation..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-[#e6007a] focus:ring-2 focus:ring-[#e6007a]/20 transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="pl-10 pr-8 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-[#e6007a] focus:ring-2 focus:ring-[#e6007a]/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="all">All Categories</option>
                      {docCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Documentation Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocs.map((doc, index) => (
                  <div
                    key={doc.id}
                    className="card bg-white border border-gray-200 hover:border-[#e6007a]/50 cursor-pointer transition-all duration-300 hover:scale-105 animate-fadeIn shadow-md"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            doc.difficulty === "beginner"
                              ? "bg-green-100 text-green-600"
                              : doc.difficulty === "intermediate"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-red-100 text-red-600"
                          }`}
                        >
                          <BookOpen size={20} />
                        </div>
                        <div>
                          <span className="badge bg-gray-200 text-gray-800 text-xs">{doc.category}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-gray-900">{doc.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{doc.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {doc.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="badge bg-[#e6007a]/10 text-[#e6007a] text-xs">
                          {tag}
                        </span>
                      ))}
                      {doc.tags.length > 3 && (
                        <span className="badge bg-gray-200 text-gray-800 text-xs">+{doc.tags.length - 3}</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {doc.readTime} min read
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag size={12} />
                        {doc.difficulty}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredDocs.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen size={48} className="mx-auto opacity-30 mb-4" />
                  <h3 className="text-xl font-medium mb-2 text-gray-900">No documentation found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          )}

          {activeSection === "nfts" && <NFTGallery />}

          {activeSection === "activity" && (
            <div className="max-w-4xl mx-auto">
              <ActivityFeed />
            </div>
          )}

          {/* Team Section */}
          <section className="py-20 bg-white rounded-3xl mt-16">
            <div className="container mx-auto px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">🎨 Created by the Dream Team</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">Meet the innovative minds behind PolkaForge</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {/* Somesh - Lead Dev & Blockchain */}
                <div className="group">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-yellow-200 hover:-translate-y-2">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        ⚡
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">somesh.s.talligeri</h3>
                      <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                        <span className="text-lg">⚡</span>
                        Pikachu NFT
                      </div>
                      <p className="text-yellow-600 font-semibold text-lg">Lead Dev & Blockchain</p>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-gray-500 text-sm">Architecting the future of decentralized development</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Jeevan - Design */}
                <div className="group">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        🌊
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">jeevan</h3>
                      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                        <span className="text-lg">🌊</span>
                        Squirtle NFT
                      </div>
                      <p className="text-blue-600 font-semibold text-lg">Design</p>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-gray-500 text-sm">Creating stunning visual experiences</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aaditya - Frontend */}
                <div className="group">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-2">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        🌿
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">aaditya</h3>
                      <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                        <span className="text-lg">🌿</span>
                        Bulbasaur NFT
                      </div>
                      <p className="text-green-600 font-semibold text-lg">Frontend</p>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-gray-500 text-sm">Crafting beautiful user experiences</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nikhil - Backend */}
                <div className="group">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 hover:-translate-y-2">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        🔥
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">nikhil</h3>
                      <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                        <span className="text-lg">🔥</span>
                        Charmander NFT
                      </div>
                      <p className="text-red-600 font-semibold text-lg">Backend</p>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-gray-500 text-sm">Building robust infrastructure and APIs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Stats */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">4</div>
                  <div className="text-gray-600">Team Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">100+</div>
                  <div className="text-gray-600">Commits</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
                  <div className="text-gray-600">Dedication</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">∞</div>
                  <div className="text-gray-600">Innovation</div>
                </div>
              </div>

              {/* Team Quote */}
              <div className="mt-16 text-center">
                <blockquote className="text-2xl font-medium text-gray-700 italic max-w-3xl mx-auto">
                  "Building the future of decentralized development, one commit at a time."
                </blockquote>
                <div className="mt-4 text-gray-500">— The PolkaForge Dream Team</div>
              </div>
            </div>
          </section>
        </div>

        {/* Documentation Viewer Modal */}
        {selectedDoc && <DocViewer doc={selectedDoc} onClose={() => setSelectedDoc(null)} />}
      </div>
    </div>
  )
}
