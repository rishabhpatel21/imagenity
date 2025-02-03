import React, { useState } from 'react';
import { Hero } from '../components/landing/Hero';
import { Navbar } from '../components/landing/Navbar';
import { Features } from '../components/landing/Features';
import { Contact } from '../components/landing/Contact';
import { AuthModal } from '../components/auth/AuthModal';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    navigate('/editor');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar onSignUpClick={() => setShowAuthModal(true)} />
      <Hero />
      <Features />
      <Contact />
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}