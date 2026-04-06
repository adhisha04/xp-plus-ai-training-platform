import HeroSection from '@/components/home/HeroSection';
import HowItWorks from '@/components/home/HowItWorks';
import FeaturesOverview from '@/components/home/FeaturesOverview';
import CategoriesPreview from '@/components/home/CategoriesPreview';
import XPSystemOverview from '@/components/home/XPSystemOverview';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <HowItWorks />
      <FeaturesOverview />
      <CategoriesPreview />
      <XPSystemOverview />
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Gain Experience?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Start your journey today and build the skills you need for real life.
            </p>

            <Link to="/scenarios">
              <Button
                size="lg"
                className="bg-[#3A7BFF] hover:bg-[#2a6ae8] text-white font-semibold px-10 py-6 text-lg rounded-xl group"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#3A7BFF] to-[#23C4C7] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">XP</span>
              </div>
              <span className="text-white font-bold text-xl">XP PLUS</span>
            </div>
            
            {/* Copyright */}
            <p className="text-gray-500 text-sm">
              © 2026 XP PLUS. All rights reserved.
            </p>
            
            {/* Links */}
            <div className="flex items-center gap-6">
              <Link 
                to="/dashboard" 
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Dashboard
              </Link>

              <Link 
                to="/my-scenarios" 
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                My Scenarios
              </Link>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}