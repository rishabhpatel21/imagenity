import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wand2, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { NavLink } from './navigation/NavLink';
import { navItems } from './navigation/NavItems';

interface NavbarProps {
  onSignUpClick: () => void;
}

export function Navbar({ onSignUpClick }: NavbarProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
          >
            <Wand2 className="w-8 h-8 text-white animate-pulse-glow" />
            <span className="font-bold text-xl bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Imagenity
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink key={item.label} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Sign Up Button */}
          <div className="hidden md:block">
            {user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/editor')}
                className="px-6 py-2.5 bg-gradient-to-r from-white to-gray-200 text-black rounded-full font-medium hover:shadow-lg hover:shadow-white/20 transition-all duration-300"
              >
                Go to Editor
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSignUpClick}
                className="px-6 py-2.5 bg-gradient-to-r from-white to-gray-200 text-black rounded-full font-medium hover:shadow-lg hover:shadow-white/20 transition-all duration-300"
              >
                Sign up
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          height: isMobileMenuOpen ? 'auto' : 0
        }}
        className="md:hidden bg-black/95 overflow-hidden"
      >
        <div className="px-4 py-4 space-y-4">
          {navItems.map((item) => (
            <NavLink 
              key={item.label} 
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          {!user && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onSignUpClick();
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-6 py-2.5 bg-gradient-to-r from-white to-gray-200 text-black rounded-full font-medium"
            >
              Sign up
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
}