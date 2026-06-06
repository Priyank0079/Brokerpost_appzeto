import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import LandingNavbar from '../components/home/LandingNavbar';
import LandingFooter from '../components/home/LandingFooter';
import { Loader2 } from 'lucide-react';

const PrivacyPolicy = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchConfig = async () => {
      try {
        const response = await api.get('/landing-config');
        if (response.success && response.data?.legalPages?.privacyPolicy?.content) {
          setContent(response.data.legalPages.privacyPolicy.content);
        } else {
          setContent('Privacy Policy content not available.');
        }
      } catch (err) {
        console.error('Failed to fetch config', err);
        setContent('Error loading privacy policy.');
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans">
      <LandingNavbar />
      
      <main className="max-w-4xl mx-auto px-6 py-20 mt-16">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h1 className="text-2xl md:text-3xl font-serif text-[#1a365d] mb-8 pb-6 border-b border-slate-100">
            Privacy Policy
          </h1>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-[#c8962a]" size={32} />
              <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">Loading...</p>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-[#1a365d] prose-a:text-[#c8962a] whitespace-pre-wrap text-slate-600">
              {content}
            </div>
          )}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default PrivacyPolicy;
