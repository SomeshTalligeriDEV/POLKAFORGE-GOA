'use client';

import { motion } from 'framer-motion';
import { 
  Shield, 
  Database, 
  Award, 
  Coins, 
  GitBranch, 
  Users, 
  Bot, 
  Zap 
} from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Shield,
      title: 'Decentralized Security',
      description: 'Built on Polkadot blockchain with enterprise-grade security and immutable code storage.',
      color: 'from-purple-500 to-blue-500'
    },
    {
      icon: Database,
      title: 'IPFS Storage',
      description: 'Permanent, distributed file storage using IPFS with Pinata integration for reliability.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Award,
      title: 'NFT Certificates',
      description: 'Automatic SoulBound NFT minting for every contribution, creating provable work history.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Coins,
      title: 'DOT Rewards',
      description: 'Earn DOT tokens for contributions, bounty completions, and community participation.',
      color: 'from-green-500 to-teal-500'
    }
  ];

  const additionalFeatures = [
    {
      icon: GitBranch,
      title: 'Git Operations',
      description: 'Full Git functionality with fork, clone, push, and pull operations on the blockchain.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Invite collaborators via wallet address or email with granular permission controls.'
    },
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Gemini AI integration for code review, error fixing, and intelligent suggestions.'
    },
    {
      icon: Zap,
      title: 'Live Deploy',
      description: 'Deploy your projects to decentralized hosting with Vercel/Netlify integration.'
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose PolkaForge?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of collaborative development with blockchain-powered features
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {additionalFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-md"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-gray-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}