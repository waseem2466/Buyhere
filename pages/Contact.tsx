import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { MAP_EMBED_URL, APP_NAME } from '../constants';

const Contact: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          We'd love to hear from you. Whether you have a question about our products, need assistance, or just want to say hello.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="glass-panel p-8 rounded-3xl h-fit animate-slide-in-right">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Send us a Message</h2>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 dark:text-white dark:border-gray-600 border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 dark:text-white dark:border-gray-600 border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  placeholder="hello@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 dark:text-white dark:border-gray-600 border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
              <textarea 
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 dark:text-white dark:border-gray-600 border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="Write your message here..."
              />
            </div>
            <button className="w-full py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>

        {/* Info & Map */}
        <div className="space-y-8 animate-fade-in-up">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300 mb-4">
                <Phone size={24} />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100">Phone</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">+94 71 933 6848</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">077 933 6848</p>
            </div>
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-pink-600 dark:text-pink-300 mb-4">
                <Mail size={24} />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100">Email</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">smileandsupplies@outlook.com</p>
            </div>
          </div>

          <div className="glass-panel p-2 rounded-3xl h-80 relative overflow-hidden">
            <iframe
              title="Location"
              src={MAP_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '20px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute bottom-4 left-4 right-4 glass-card p-4 rounded-xl flex items-start gap-3 backdrop-blur-md">
              <MapPin className="text-red-500 shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{APP_NAME} HQ</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">411/7 Kandy Road, Mollipothana, Kanthale</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;