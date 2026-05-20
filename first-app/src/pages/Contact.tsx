import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { API_URL } from "../config";
import {
  FLOATING_BLOB,
  FLOATING_BLOB_TRANSITION,
  REVEAL_FROM_LEFT,
  REVEAL_FROM_RIGHT,
  REVEAL_TRANSITION,
} from '../config';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      setIsSent(true);
      setFormData({ name: "", email: "", mobile: "", message: "" });

      setTimeout(() => setIsSent(false), 5000);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const inputClasses = "w-full bg-slate-50 dark:bg-slate-900/50 border-b-2 border-slate-200 dark:border-slate-200 dark:border-white/10 px-4 py-3 outline-none transition-all duration-300 focus:border-yellow-400 focus:bg-white dark:bg-transparent placeholder-slate-400";
  const labelClasses = "block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider";

  return (
    <div className="min-h-screen transition-colors duration-500  bg-transparent dark:bg-transparent font-sans text-slate-800 dark:text-white selection:bg-yellow-200">
      <Header className="text-slate-900 dark:text-white" />

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Text & Info */}
          <motion.div 
            variants={REVEAL_FROM_LEFT}
            initial="hidden"
            animate="visible"
            transition={REVEAL_TRANSITION}
          >
            <div className="relative mb-12">
               <motion.div 
                 className="absolute -left-4 -top-4 w-20 h-20 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                 animate={FLOATING_BLOB.animate}
                 transition={FLOATING_BLOB_TRANSITION(0)}
               />
               <h1 className="text-6xl font-serif font-bold text-slate-900 dark:text-white mb-6 relative z-10">
                 Let's Start a <br/>
                 <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-500 to-amber-600">Conversation.</span>
               </h1>
            </div>

            <p className="text-xl text-slate-700 dark:text-slate-300 mb-12 leading-relaxed">
              Whether you have a project in mind, a question about my work, or just want to discuss the intersection of music and code — I'm all ears.
            </p>

            <div className="space-y-8">
              
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center rounded-full text-slate-400 group-hover:bg-yellow-400 group-hover:text-slate-900 dark:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:scale-110">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">Email Me</h3>
                  <a href="mailto:hello@madelyntorff.com" className="text-slate-500 dark:text-slate-400 group-hover:text-yellow-600 transition-colors">mehrad.ata@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center rounded-full text-slate-400 group-hover:bg-yellow-400 group-hover:text-slate-900 dark:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:scale-110">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">Location</h3>
                  <p className="text-slate-500 dark:text-slate-400 group-hover:text-yellow-600 transition-colors">Remote / Oakville, On, Ca</p>
                </div>
              </div>

            </div>
          </motion.div>


          {/* Right Column: Form */}
          <motion.div 
            variants={REVEAL_FROM_RIGHT}
            initial="hidden"
            animate="visible"
            transition={{ ...REVEAL_TRANSITION, delay: 0.2 }}
            className="bg-white dark:bg-transparent rounded-[2.5rem] p-8 lg:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-200 dark:border-white/10 relative overflow-hidden"
          >
             {/* Decorative blob in form corner */}
            <div className="absolute -top-12.5 -right-12.5 w-32 h-32 bg-yellow-50 rounded-full blur-2xl pointer-events-none"></div>
            
            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-8">Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              
              <div className="group">
                <label htmlFor="name" className={labelClasses}>Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                  placeholder="John Doe"
                />
              </div>

              <div className="group">
                <label htmlFor="email" className={labelClasses}>Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                  placeholder="john@example.com"
                />
              </div>

<div className="group">
  <label className={labelClasses}>Mobile Number</label>

  <PhoneInput
    country={'ca'}
    value={formData.mobile}
    onChange={(phone) =>
      setFormData({ ...formData, mobile: phone })
    }
    inputClass="!w-full !py-3 !px-4 !bg-slate-50 dark:bg-slate-900/50 !border-b-2 !border-slate-200 dark:border-slate-200 dark:border-white/10 focus:!border-yellow-400 !outline-none"
    containerClass="w-full"
  />
</div>

              <div className="group">
                <label htmlFor="message" className={labelClasses}>How can I help?</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className={`${inputClasses} resize-none`}
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || isSent}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2
                  ${isSent 
                    ? 'bg-green-500 text-slate-900 dark:text-white shadow-green-200 cursor-default' 
                    : isSubmitting
                      ? 'bg-slate-200 dark:bg-slate-800 dark:bg-white/20 text-slate-500 dark:text-slate-400 cursor-wait'
                      : 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white hover:bg-yellow-400 hover:text-slate-900 dark:hover:text-slate-900 dark:hover:bg-yellow-400 hover:-translate-y-1'
                  }
                `}
              >
                {isSubmitting ? (
                   <span className="flex items-center gap-2">
                     <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     Sending...
                   </span>
                ) : isSent ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Message Sent!
                  </span>
                ) : (
                  <>
                    Send Message 
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </>
                )}
              </button>

            </form>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
