import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  const navigate = useNavigate();
  
  return (
    <section className="min-h-screen relative overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 via-transparent to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300">
              Powered by Azure Computer Vision
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-6xl sm:text-7xl font-bold mb-8 leading-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
              Create stunning visuals with
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              AI-powered text placement
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            Automatically detect subjects and place text behind them. Perfect for social media, marketing materials, and creative projects.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/editor')}
              className="group px-8 py-4 bg-gradient-to-r from-white to-gray-200 text-black rounded-full font-medium hover:shadow-lg hover:shadow-white/20 transition-all duration-300 flex items-center gap-2"
            >
              Start Creating Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <a
              href="#how-it-works"
              className="text-gray-400 hover:text-white transition-colors px-8 py-4"
            >
              See how it works
            </a>
          </motion.div>
        </div>

        {/* Preview Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=630&fit=crop"
            alt="Text Behind Image Demo"
            className="w-full h-auto rounded-xl shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}