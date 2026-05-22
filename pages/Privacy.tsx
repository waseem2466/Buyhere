import React from 'react';
import { Shield, Lock, Eye, FileText, Server } from 'lucide-react';
import { APP_NAME } from '../constants';

const Privacy: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
       {/* Header */}
       <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-600 dark:text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>
       </div>

       <div className="space-y-8 animate-fade-in-up">
          {/* Section 1: Introduction */}
          <div className="glass-panel p-8 rounded-3xl">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
                   <Shield size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">1. Introduction</h2>
             </div>
             <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
               Welcome to {APP_NAME}. We respect your privacy and are committed to protecting your personal data. 
               This privacy policy will inform you as to how we look after your personal data when you visit our website 
               and tell you about your privacy rights and how the law protects you.
             </p>
          </div>

          {/* Section 2: Information Collected */}
          <div className="glass-panel p-8 rounded-3xl">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                   <Eye size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">2. Information We Collect</h2>
             </div>
             <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
               We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
             </p>
             <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-2">
               <li><span className="font-semibold text-gray-800 dark:text-gray-200">Identity Data:</span> includes name, username, or similar identifier.</li>
               <li><span className="font-semibold text-gray-800 dark:text-gray-200">Contact Data:</span> includes billing address, delivery address, email address, and telephone numbers.</li>
               <li><span className="font-semibold text-gray-800 dark:text-gray-200">Technical Data:</span> includes internet protocol (IP) address, browser type and version, time zone setting, and location.</li>
               <li><span className="font-semibold text-gray-800 dark:text-gray-200">Usage Data:</span> includes information about how you use our website, products, and services.</li>
             </ul>
          </div>

          {/* Section 3: Usage */}
          <div className="glass-panel p-8 rounded-3xl">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                   <Server size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">3. How We Use Your Data</h2>
             </div>
             <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
               We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
             </p>
             <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-2">
               <li>Where we need to perform the contract we are about to enter into or have entered into with you (processing your order).</li>
               <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
               <li>Where we need to comply with a legal or regulatory obligation.</li>
             </ul>
          </div>

           {/* Section 4: Security */}
           <div className="glass-panel p-8 rounded-3xl">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-full text-pink-600 dark:text-pink-400">
                   <Lock size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">4. Data Security</h2>
             </div>
             <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
               We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
             </p>
          </div>
          
          {/* Section 5: Cookies */}
          <div className="glass-panel p-8 rounded-3xl">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400">
                   <FileText size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">5. Cookies</h2>
             </div>
             <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
               Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site. By continuing to browse the site, you are agreeing to our use of cookies.
             </p>
          </div>
       </div>
    </div>
  );
};

export default Privacy;