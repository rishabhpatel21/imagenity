import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, Layers, Share2, Palette, Zap } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: "AI Background Removal",
    description: "Automatically detect and remove image backgrounds with advanced AI technology"
  },
  {
    icon: Wand2,
    title: "Smart Text Placement",
    description: "Intelligently position text behind subjects for perfect compositions"
  },
  {
    icon: Layers,
    title: "Layer Management",
    description: "Full control over your design with intuitive layer management"
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share your creations instantly with customizable privacy settings"
  },
  {
    icon: Palette,
    title: "Rich Text Effects",
    description: "Add stunning effects including shadows, gradients, and outlines"
  },
  {
    icon: Zap,
    title: "Real-time Preview",
    description: "See your changes instantly with live preview updates"
  }
];

export function Features() {
  return (
    <section id="features" className="py-32 relative overflow-hidden bg-black">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent)]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70"
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
          >
            Powerful Features
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-400"
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
          >
            Everything you need to create stunning visuals
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-white/20 transition-colors relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <feature.icon className="w-10 h-10 text-purple-400 mb-6 relative z-10" />
              <h3 className="text-2xl font-semibold mb-4 text-white relative z-10">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed relative z-10">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}