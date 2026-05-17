import { type ReactNode } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

// @ts-ignore
import bgImage from "../assets/images/backgroundd.png";
// @ts-ignore
import meImage from "../assets/images/me.png";

// @ts-ignore
import icon1 from "../assets/icons/Icon.png";
// @ts-ignore
import icon2 from "../assets/icons/Icon (1).png";
// @ts-ignore
import icon3 from "../assets/icons/Icon (2).png";

import {
  REVEAL_FROM_LEFT,
  REVEAL_TRANSITION,
} from "../config";

const RevealOnScroll = ({ children, className = "", delay = 0 }: { children: ReactNode; className?: string, delay?: number }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.8, ease: "easeOut", delay }}
  >
    {children}
  </motion.div>
);

function Home() {
    return (
        <div className="text-slate-900 dark:text-white min-h-screen transition-colors duration-500 overflow-x-hidden">
      
      {/* Header outside of Hero Container to prevent z-index issues */}
      <div className="relative z-[200]">
        <Header />
      </div>

      {/* Container for Hero */}
      <div className="relative isolate overflow-clip pb-20 sm:pb-24 lg:pb-32">
        <div className="relative z-50">
            {/* Hero Section */}
            <main className="font-serif px-4 sm:px-6 lg:px-10 pt-8 sm:pt-16 lg:pt-16 lg:pb-16 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-12 min-h-[70vh] lg:min-h-137.5">
              <div className="w-full space-y-5 sm:space-y-6 lg:pl-16 xl:pl-24 max-w-2xl order-2 lg:order-1">
                <RevealOnScroll>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight text-slate-900 dark:text-white max-w-xl">
                    Hello, my name is <br /> <span className="text-yellow-500 dark:text-yellow-400">Mehrad Ata</span>
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-slate-700 dark:text-slate-300 max-w-lg mt-5 sm:mt-6 leading-relaxed">
                    Full-stack web developer focused on building responsive, user-centered digital experiences. I work across front-end and back-end development, transforming design concepts into clean, scalable, and functional code.

With a strong foundation in modern web technologies and a passion for usability and performance, I aim to create seamless experiences across all devices and platforms.

Alongside my technical work, I bring over 20 years of experience in music, which shapes my creative approach—helping me build digital products that are not only functional, but also engaging and expressive.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-7 sm:mt-8 w-full sm:w-auto">
                    <a
                      href="/projects"
                      className="inline-flex justify-center items-center bg-yellow-400 text-slate-900 px-8 py-3 rounded-lg font-medium hover:bg-yellow-300 transition shadow-[0_0_20px_rgba(250,204,21,0.5)]"
                    >
                        Projects
                    </a>
                    <a
                      href="/contact"
                      className="inline-flex justify-center items-center border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white px-8 dark:hover:bg-white dark:hover:text-slate-900 py-3 rounded-lg font-medium hover:bg-slate-100 dark:bg-transparent transition"
                    >
                        Contact
                    </a>
                    </div>
                </RevealOnScroll>
              </div>

              <div className="order-1 lg:order-2 relative w-full flex justify-center lg:justify-end lg:pr-8 xl:pr-16">
                <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
                  <img
                    src={bgImage}
                    alt="Decorative background"
                    className="absolute inset-0 h-full w-full object-contain object-center blur-md opacity-60 saturate-[3] brightness-[0.6] pointer-events-none"
                  />
                  <img
                    src={meImage}
                    alt="Me"
                    className="relative z-10 w-full h-auto object-contain drop-shadow-2xl pointer-events-auto transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-4 hover:brightness-125 hover:drop-shadow-[0_20px_50px_rgba(250,204,21,0.5)]"
                  />
                </div>
              </div>
            </main>
        </div>
      </div>
      {/* Values Section */}
      <section className="px-4 sm:px-6 lg:px-10 py-16 sm:py-20 bg-slate-100 dark:bg-slate-900/50 backdrop-blur-md">
        <RevealOnScroll>
            <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold font-serif mb-4 relative inline-block text-slate-900 dark:text-white max-w-3xl">
                Not Just a Musician. Not Just a Developer.
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-2.5 w-24 h-1 bg-yellow-400"></span>
            </h3>
            <p className="text-slate-700 dark:text-slate-300 mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed px-2">
              Creativity, authenticity, adaptability, and continuous growth guide both my music and my technology work.
            </p>
            </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {[
            {
              title: "Creativity",
              icon: icon1,
              desc: "Over 20 years of performance, composition, and instruction shaped my storytelling, rhythm, and emotional awareness.",
            },
            {
              title: "Technology",
              icon: icon2,
              desc: "I translate design concepts into clean, maintainable, and scalable code using modern web technologies.",
            },
            {
              title: "Integration",
              icon: icon3,
              desc: "I intentionally merge music and interactive media to create experiences that are both functional and emotionally resonant.",
            },
          ].map((item, index) => (
            <RevealOnScroll key={index}>
                <div
              className="relative group p-6 sm:p-7 lg:p-8 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-yellow-400 hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-default h-full backdrop-blur-sm"
                >
              <div className="w-12 h-12 bg-yellow-400/20 flex items-center justify-center rounded-lg mb-5 sm:mb-6 transition-all duration-300 group-hover:bg-yellow-400 group-hover:scale-110 group-hover:rotate-3">
                    <img src={item.icon} alt={item.title} className="w-6 h-6 object-contain invert" />
                </div>
              <h4 className="text-lg sm:text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-yellow-400 transition-colors">{item.title}</h4>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed max-w-md">
                    {item.desc}
                </p>
                </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-200 dark:bg-slate-950/80 text-slate-900 dark:text-white py-14 sm:py-16 px-4 sm:px-6 lg:px-10 border-y border-slate-200 dark:border-slate-200 dark:border-white/5">
        <RevealOnScroll>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-x divide-slate-800">
            {[
                { number: "20+", label: "Years in Music", color: "text-slate-900 dark:text-white" },
                { number: "7", label: "Licensed Tracks", color: "text-amber-400" },
                { number: "5+", label: "Dev Projects", color: "text-yellow-400" },
                { number: "∞", label: "Creative Possibilities", color: "text-yellow-400" },
            ].map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center border-none px-2">
                <span className={`text-3xl sm:text-4xl font-bold mb-2 ${stat.color}`}>
                    {stat.number}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-sm leading-snug">{stat.label}</span>
                </div>
            ))}
            </div>
        </RevealOnScroll>
      </section>

      {/* Featured Work */}
        <section className="px-4 sm:px-6 lg:px-10 py-16 sm:py-20 bg-slate-100 dark:bg-slate-900/50 backdrop-blur-md">
        <RevealOnScroll>
            <div className="text-center mb-16">
          <h3 className="text-3xl sm:text-4xl font-bold font-serif mb-4 relative inline-block text-slate-900 dark:text-white">
                Featured Work
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-2.5 w-24 h-1 bg-yellow-400"></span>
            </h3>
          <p className="text-slate-700 dark:text-slate-300 mt-4 text-sm sm:text-base leading-relaxed px-2">
                Where emotional design meets technical execution
            </p>
            </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {/* Project 1 */}
          <RevealOnScroll>
            <a href="/sequencer" className="block group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10 hover:-translate-y-2 hover:border-yellow-400 bg-white/80 dark:bg-white/5 h-full">
                <div className="h-52 sm:h-60 lg:h-64 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-500/20 dark:to-transparent flex items-center justify-center relative overflow-hidden backdrop-blur-sm border-b border-amber-200 dark:border-white/5">
                    <svg className="w-24 h-24 text-amber-500 dark:text-yellow-200 opacity-80 dark:opacity-50 transition-transform duration-500 group-hover:scale-110 drop-shadow-md dark:drop-shadow-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 22v-7"></path>
                      <path d="M4 11V2"></path>
                      <path d="M12 22v-11"></path>
                      <path d="M12 7V2"></path>
                      <path d="M20 22v-15"></path>
                      <path d="M20 3V2"></path>
                      <line x1="2" y1="11" x2="6" y2="11"></line>
                      <line x1="10" y1="15" x2="14" y2="15"></line>
                      <line x1="18" y1="7" x2="22" y2="7"></line>
                    </svg>
                </div>
                <div className="p-6 sm:p-8">
                <span className="bg-amber-100 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-300 dark:border-amber-400/30">
                    React + Tone.js
                </span>
                <h4 className="text-lg sm:text-xl font-bold mt-4 mb-2 group-hover:text-amber-400 transition-colors text-slate-900 dark:text-white">
                    Interactive Audio Sequencer
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    A browser-based step sequencer and virtual piano keyboard allowing users to compose, play, and experiment with generative beats in real-time.
                </p>
                </div>
            </a>
          </RevealOnScroll>

          {/* Project 2 */}
          <RevealOnScroll>
            <a href="/game" className="block group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-400/10 hover:-translate-y-2 hover:border-indigo-400 bg-white/80 dark:bg-white/5 h-full">
                <div className="h-52 sm:h-60 lg:h-64 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-500/20 dark:to-transparent flex items-center justify-center relative overflow-hidden backdrop-blur-sm border-b border-indigo-200 dark:border-white/5">
                    <svg className="w-24 h-24 text-indigo-500 dark:text-indigo-200 opacity-80 dark:opacity-50 transition-transform duration-500 group-hover:scale-110 shrink-0 drop-shadow-md dark:drop-shadow-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                      <path d="M6 12h4"></path>
                      <path d="M8 10v4"></path>
                      <circle cx="15" cy="13" r="1.5"></circle>
                      <circle cx="18" cy="11" r="1.5"></circle>
                    </svg>
                </div>
                <div className="p-6 sm:p-8">
                <span className="bg-indigo-100 dark:bg-indigo-400/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-300 dark:border-indigo-400/30">
                    Web Audio API + React
                </span>
                <h4 className="text-lg sm:text-xl font-bold mt-4 mb-2 group-hover:text-indigo-400 transition-colors text-slate-900 dark:text-white">
                    Rhythmic Reflex Game
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    An engaging tile-based reflex game combining spatial awareness, speed, and dynamically generated audio feedback.
                </p>
                </div>
            </a>
          </RevealOnScroll>
        </div>

        <div className="text-center mt-12">
            <RevealOnScroll>
                <a
                  href="/projects"
                  className="inline-block border-2 border-slate-300 dark:border-white/20 text-slate-900 dark:text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-100 dark:bg-transparent transition"
                >
                    View All Projects
                </a>
            </RevealOnScroll>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-200 dark:bg-slate-950/80 text-slate-900 dark:text-white py-20 sm:py-24 text-center px-4 sm:px-6 lg:px-10 border-t border-slate-200 dark:border-slate-200 dark:border-white/5">
        <RevealOnScroll>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6 px-2">
            Let's Create Something Meaningful
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 text-sm sm:text-base leading-relaxed px-2">
            Looking for someone who understands both emotional storytelling and
            technical execution?
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center bg-yellow-400 text-slate-900 px-8 sm:px-10 py-4 rounded-lg font-bold hover:bg-yellow-300 transition shadow-[0_0_20px_rgba(250,204,21,0.3)]"
            >
              Let's Connect
            </a>
        </RevealOnScroll>
      </section>

      <Footer />
    </div>
    )
}

export default Home;
