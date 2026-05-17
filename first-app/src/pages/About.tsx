import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
// @ts-ignore
import meImage from '../assets/images/me.png'; 
import { API_URL } from "../config";
import {
    DRAW_PATH,
    DRAW_PATH_TRANSITION,
    FADE_IN,
    FADE_IN_UP,
    FLOATING_BLOB,
    FLOATING_BLOB_TRANSITION,
    GRADIENT_TEXT_REVEAL,
    GRADIENT_TEXT_TRANSITION,
    HERO_ACCENT_LINE,
    HERO_INTRO,
    HERO_LINE_TRANSITION,
    HERO_PORTRAIT,
    HERO_PORTRAIT_TRANSITION,
    PHILOSOPHY_ORB,
    PHILOSOPHY_ORB_TRANSITION,
    REVEAL_TRANSITION,
    TEXT_FADE_TRANSITION,
    TEXT_REVEAL_TRANSITION,
    TIMELINE_ITEM,
    TIMELINE_VIEWPORT,
} from '../config';

const skills = [
  {
        category: "Web & Software Development",
    items: [
            { name: "HTML5 / CSS3 / JavaScript", level: 96 },
            { name: "Bootstrap / Tailwind CSS / Sass / Less", level: 94 },
            { name: "jQuery / AJAX", level: 88 },
            { name: "PHP / MySQL (fundamentals)", level: 76 },
            { name: "Python (foundational)", level: 72 },
            { name: "WordPress Development", level: 84 },
    ]
  },
  {
        category: "Design & UX",
    items: [
            { name: "Responsive & Mobile-First Design", level: 96 },
            { name: "UI/UX Implementation", level: 90 },
            { name: "Prototyping & Wireframing", level: 86 },
            { name: "Figma / Canva", level: 88 },
            { name: "Cross-Browser Compatibility", level: 89 },
            { name: "Creative Problem Solving", level: 93 },
    ]
  }
];

const education = [
    {
        year: "2025 - 2026",
        title: "Interactive Media Management (Graduate Certificate)",
        school: "Sheridan College, Canada",
    },
    {
        year: "2024 - 2025",
        title: "Web Design & Front-End Development (Certificate)",
        school: "Tehran Institute of Technology, Tehran, Iran",
    },
    {
        year: "2013 - 2017",
        title: "Performance of Persian Music (Bachelor of Arts)",
        school: "University of Art, Tehran",
    },
];

const professionalExperience = [
  {
        year: "May 2024 - Aug 2025",
        role: "Web Developer",
        company: "Iranian Leasing Company — Tehran, Iran | Contract, Full-time | On-site",
        desc: "Designed and developed responsive, multi-page websites using HTML5, CSS3, JavaScript, Bootstrap (Framework), Tailwind CSS, Less, and Sass. Applied front-end development, front-end design, responsive web design, and mobile-first principles to translate UI designs into production-ready code with a focus on usability, performance, and maintainability. Also worked with jQuery, AJAX, and cross-browser implementation to deliver interactive, scalable, and user-centered digital experiences."
  },
  {
        year: "2015 - 2025",
        role: "Music Instructor (Part-time)",
        company: "Multiple Institutes — Tehran, Iran",
        desc: "Taught Ney, Piano, and Pop Vocal techniques; delivered instruction in music theory, harmony, solfege, and sight-reading; prepared students for performances and formal evaluations."
  },
  {
        year: "Jun 2022 - May 2024",
        role: "Sales Associate",
        company: "Iranian Leasing Company — Tehran, Iran | Full-time",
        desc: "Delivered customer-focused sales solutions in a fast-paced environment and strengthened communication, teamwork, and client relationship management skills."
    },
    {
        year: "Apr 2021 - Jun 2023",
        role: "Sales Associate",
        company: "Leasing Shahr Company — Tehran, Iran | Full-time",
        desc: "Supported commercial leasing processes and client presentations while strengthening negotiation, customer service, and sales operations skills."
    },
    {
        year: "Nov 2017 - Jun 2019",
        role: "Sales Associate & Customer Service Representative",
        company: "Iran Khodro Authorized Dealership",
        desc: "Assisted customers with vehicle sales and purchase decisions, managed documentation, follow-ups, and coordination with sales and finance teams."
  }
];

const musicHighlights = [
    {
        title: "Selected Projects & Collaborations",
        items: [
            "Performance for Participation Project, Fajr International Music Festival (2014)",
            "Bachelor’s Thesis Performance — Solo & Ensemble works based on Bayat-e Esfahan and Dastgah-e Homayun (2017)",
            "Expert performer and collaborator on National Radio projects, including recording and redevelopment (2017–2018)",
            "Performer in Aiaran, composed by Ahmad Pejman, conducted by Mohammadreza Fayyaz (2017)",
            "International live performance, Chicha Verna Exhibition — Italy (2022)",
        ],
    },
    {
        title: "Instrument Specialties",
        items: [
            "Ney — Persian Woodwind Instrument (2004 – Present)",
            "Piano (2004 – Present)",
            "Keyboard (2001 – Present)",
            "Drums (2016 – 2018)",
            "Pop & Foley Singing (2005 – Present)",
        ],
    },
    {
        title: "Teaching & Instruction Areas",
        items: [
            "Instrumental Training: Ney & Piano",
            "Ear Training: Solfege & Sight-Reading",
            "Music Theory & Analysis",
            "Contemporary Pop Vocal Techniques",
            "Historical Studies: Iranian & Global Music",
            "Organology: Iranian & World Instruments",
            "Digital Music Production (Logic Pro)",
            "Vocal Performance & Composition",
        ],
    },
    {
        title: "Core Music Competencies",
        items: [
            "Multi-Instrumentalist: Ney & Piano",
            "Composition & Arrangement (Pop & Contemporary Styles)",
            "Vocal Performance & Artistic Expression",
            "Music Education & Student Development",
            "Digital Music Production (Logic Pro)",
            "Ear Training, Solfege & Sight-Reading",
        ],
    },
];

function About() {
  const [activeTab, setActiveTab] = useState("Technical");
  const [cvUrl, setCvUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/resume`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.fileUrl) {
          setCvUrl(data.fileUrl);
        }
      })
      .catch((err) => console.error("Could not fetch CV:", err));
  }, []);

  // Mouse position for parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

  function handleMouseMove(event: React.MouseEvent) {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;
    // Calculate position from center (-1 to 1)
    x.set((clientX / innerWidth) - 0.5);
    y.set((clientY / innerHeight) - 0.5);
  }

  // Scroll animations
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  return (
    <div 
      className="min-h-screen font-sans text-white overflow-x-hidden selection:bg-yellow-200"
      onMouseMove={handleMouseMove}
    >
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative px-6 py-20 lg:py-32 overflow-hidden min-h-[90vh] flex items-center">
             
             {/* Floating Background Elements */}
                         <motion.div 
                             animate={FLOATING_BLOB.animate}
                             transition={FLOATING_BLOB_TRANSITION(0)}
                             style={{ x: useTransform(mouseX, [-0.5, 0.5], [20, -20]), y: useTransform(mouseY, [-0.5, 0.5], [20, -20]) }}
                             className="absolute top-20 right-[10%] w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
                         />
                         <motion.div 
                             animate={FLOATING_BLOB.animate}
                             transition={FLOATING_BLOB_TRANSITION(2)}
                             style={{ x: useTransform(mouseX, [-0.5, 0.5], [-30, 30]), y: useTransform(mouseY, [-0.5, 0.5], [30, -30]) }}
                             className="absolute top-[40%] right-[30%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
                         />
                         <motion.div 
                                animate={FLOATING_BLOB.animate}
                                transition={FLOATING_BLOB_TRANSITION(4)}
                                style={{ x: useTransform(mouseX, [-0.5, 0.5], [40, -40]), y: useTransform(mouseY, [-0.5, 0.5], [-40, 40]) }}
                             className="absolute bottom-20 left-[20%] w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
                         />

             <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 box-border">
                
                <motion.div 
                    variants={HERO_INTRO}
                    initial="hidden"
                    animate="visible"
                    transition={REVEAL_TRANSITION}
                >
                    <motion.div
                       variants={HERO_ACCENT_LINE}
                       initial="hidden"
                       animate="visible"
                       transition={HERO_LINE_TRANSITION}
                       className="h-1 bg-yellow-400 mb-6"
                    />
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-white mb-6 leading-tight max-w-2xl">
                        Creative Technologist. <br />
                        <motion.span 
                            variants={GRADIENT_TEXT_REVEAL}
                            initial="hidden"
                            animate="visible"
                            transition={GRADIENT_TEXT_TRANSITION}
                            className="inline-block bg-linear-to-r from-yellow-400 to-yellow-600 bg-no-repeat bg-bottom text-transparent bg-clip-text pb-1"
                            style={{ backgroundSize: "100% 100%" }}
                        >
                            Musician. Web Developer.
                        </motion.span>
                    </h1>
                    <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-lg">
                        I’m a creative developer and Interactive Media Management student at Sheridan College, building modern, responsive, and user-centered digital experiences.

                        Working across front-end and back-end development, I turn ideas and designs into clean, scalable, and high-performing applications. I focus on usability, performance, and creating seamless interactions that feel natural across all devices.

                        With over 20 years of experience in music as a performer, composer, and singer, I bring a unique creative perspective into technology. Music taught me structure, rhythm, and emotional storytelling—principles I now apply to code and user experience.

                        To me, great digital products are more than functional—they are expressive, engaging, and built to connect.
                    </p>
                    <div className="flex gap-4">
                        {cvUrl ? (
                            <motion.a 
                                href={cvUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-block bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition shadow-lg relative overflow-hidden group"
                            >
                                <span className="relative z-10">Download CV</span>
                                <div className="absolute inset-0 bg-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 z-0"></div>
                            </motion.a>
                        ) : (
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold transition shadow-lg opacity-50 cursor-not-allowed"
                            >
                                <span className="relative z-10">CV Not Available</span>
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                <motion.div 
                    style={{ 
                        x: useTransform(mouseX, [-0.5, 0.5], [-15, 15]), 
                        y: useTransform(mouseY, [-0.5, 0.5], [-15, 15]),
                        rotateY: useTransform(mouseX, [-0.5, 0.5], [-5, 5]),
                        rotateX: useTransform(mouseY, [-0.5, 0.5], [5, -5]),
                    }}
                    variants={HERO_PORTRAIT}
                    initial="hidden"
                    animate="visible"
                    transition={HERO_PORTRAIT_TRANSITION}
                    className="relative perspective-1000"
                >
                     <div className="relative z-10 transform-style-3d bg-white/10 p-4 pb-0 rounded-2xl shadow-2xl rotate-3 border border-white/10">
                        <img 
                            src={meImage} 
                            alt="Portrait" 
                            className="w-full max-w-md mx-auto rounded-tl-xl rounded-tr-xl shadow-inner relative z-10 bg-slate-800/40"
                        />
                         <div className="h-12 flex items-center justify-center font-serif italic text-slate-400">
                            Mehrad Ata
                         </div>
                     </div>
                     {/* Shadow/Back element */}
                     <motion.div 
                        style={{ 
                            x: useTransform(mouseX, [-0.5, 0.5], [10, -10]), 
                            y: useTransform(mouseY, [-0.5, 0.5], [10, -10]) 
                        }}
                        className="absolute inset-0 bg-slate-900 rounded-2xl -z-10 transform translate-x-4 translate-y-4"
                     ></motion.div>
                </motion.div>
             </div>
        </section>

        {/* Education */}
        <section className="px-6 py-24 bg-slate-900/40">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-yellow-500 uppercase tracking-[0.3em] text-xs font-bold mb-3">Education</p>
                    <h2 className="text-4xl font-serif font-bold text-white">Academic Background</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {education.map((item) => (
                        <div key={item.title} className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                            <p className="text-sm font-bold text-yellow-500 mb-3">{item.year}</p>
                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-slate-300">{item.school}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Professional Experience */}
        <section className="py-24 px-6 bg-slate-900/40 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <h2 className="text-4xl font-serif font-bold text-white mb-16 text-center">Professional Experience</h2>
                
                <div className="relative border-l-2 border-white/10 ml-4 md:ml-0 space-y-16">
                    {/* Animated Line Follower (Optional Complex Feature - kept simple for now) */}
                    
                    {professionalExperience.map((item, index) => (
                        <motion.div 
                            key={index}
                            variants={TIMELINE_ITEM(index)}
                            initial="hidden"
                            whileInView="visible"
                            viewport={TIMELINE_VIEWPORT}
                            className="relative pl-8 md:pl-0 group"
                        >
                            <div className="md:grid md:grid-cols-12 md:gap-8 items-center">
                                {/* Date (Left on Desktop) */}
                                <div className="md:col-span-3 md:text-right mb-2 md:mb-0">
                                    <span className="text-yellow-500 font-bold font-mono text-lg group-hover:text-yellow-600 transition-colors">{item.year}</span>
                                </div>
                                
                                {/* Dot */}
                                <div className="absolute -left-1.25 top-2 md:relative md:left-0 md:col-span-1 flex justify-center">
                                    <div className="w-3 h-3 bg-slate-300 rounded-full ring-4 ring-slate-100 group-hover:bg-yellow-400 group-hover:ring-yellow-200 transition-all duration-300"></div>
                                </div>

                                {/* Content (Right on Desktop) */}
                                <div className="md:col-span-8 bg-white/10 p-8 rounded-2xl shadow-sm border border-white/10 group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 relative">
                                    {/* Small arrow */}
                                    <div className="hidden md:block absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white/10 transform rotate-45 border-l border-b border-white/10"></div>
                                    
                                    <h3 className="text-xl font-bold text-white">{item.role}</h3>
                                    <h4 className="text-slate-400 text-sm mb-4 font-serif italic">{item.company}</h4>
                                    <p className="text-slate-300 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* Music Experience */}
        <section className="px-6 py-24 bg-slate-950 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '18px 18px' }}></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <p className="text-yellow-300 uppercase tracking-[0.3em] text-xs font-bold mb-3">Music Experience & Performances</p>
                    <h2 className="text-4xl font-serif font-bold">Creative Foundation</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {musicHighlights.map((section) => (
                        <div key={section.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <h3 className="text-2xl font-bold text-yellow-300 mb-4">{section.title}</h3>
                            <ul className="space-y-3 text-slate-300 leading-7 list-disc pl-5">
                                {section.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Brand Story */}
        <section className="px-6 py-24 bg-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.08),transparent_30%)]"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="max-w-3xl mb-12">
                    <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
                        My brand combines art, structure, and emotional design.
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-slate-300">
                        My story begins at the age of eleven, when music became a serious commitment. Over the years, music taught me discipline, emotional awareness, storytelling, and how to connect with people without saying a single word. When I moved into interactive media and coding, I recognized the same principles: rhythm, structure, timing, and emotion shape meaningful digital experiences.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-3xl border border-white/10 bg-slate-950 p-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.20)]">
                        <p className="text-yellow-300 text-4xl lg:text-5xl font-serif font-extrabold mb-5">My Story</p>
                        <div className="space-y-4 text-slate-300 leading-8">
                            <p>For more than two decades, music was not just something I did — it was who I was. Through performance and composition, I learned how details matter and how rhythm, timing, and structure create impact.</p>
                            <p>That creative foundation led me into Interactive Media Management and coding. Today, I design with empathy, build with structure, and create with intention so digital experiences feel both functional and emotionally resonant.</p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {[
                            {
                                title: "Creativity",
                                text: "I use music and visual thinking to shape expressive digital experiences.",
                            },
                            {
                                title: "Authenticity",
                                text: "My portfolio should reflect my real identity, not a generic template.",
                            },
                            {
                                title: "Adaptability",
                                text: "I move between artistic and technical environments with curiosity and confidence.",
                            },
                            {
                                title: "Growth",
                                text: "I keep learning and refining both my creative and technical craft.",
                            },
                        ].map((item) => (
                            <div key={item.title} className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-sm leading-7 text-slate-300">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* Philosophy */}
        <section className="py-32 px-6 bg-slate-900 text-white text-center relative overflow-hidden">
             {/* Dynamic background circles */}
             <motion.div 
                animate={PHILOSOPHY_ORB.animate}
                transition={PHILOSOPHY_ORB_TRANSITION}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-yellow-400 rounded-full blur-[120px] opacity-10 pointer-events-none"
             />

            <div className="max-w-3xl mx-auto relative z-10">
                 <motion.svg 
                          variants={DRAW_PATH}
                          initial="hidden"
                          whileInView="visible"
                          transition={DRAW_PATH_TRANSITION}
                    className="w-16 h-16 text-yellow-500 mx-auto mb-8" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                 >
                    <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.0171 16H11.9835C10.8789 16 9.98352 16.8954 9.98352 18L9.98352 21H12.0003H14.017ZM16.0335 14C17.1381 14 18.0335 14.8954 18.0335 16V18.1707C18.0465 18.2618 18.0487 18.3353 18.0267 18.3976C17.9622 18.5794 17.7663 18.847 17.1472 19.4661L17.1432 19.4701L17.139 19.4739C16.5317 20.0381 15.6322 20.8737 15.6322 20.8737L14.1678 21.0505C14.1678 21.0505 15.176 19.9678 15.7766 19.4124L15.7808 19.4085C16.0594 19.1299 16.0699 19.1097 16.071 19.1066C16.0706 19.1077 16.0664 19.0782 16.0335 18.8475V16C16.0335 16 16.0335 16 16.0335 14ZM7.96648 14C7.96648 16 7.96648 16V18.8475C7.93358 19.0782 7.92938 19.1077 7.92898 19.1066C7.93006 19.1097 7.94057 19.1299 8.21918 19.4085L8.22344 19.4124C8.82399 19.9678 9.83222 21.0505 9.83222 21.0505L8.36778 20.8737C8.36778 20.8737 7.46827 20.0381 6.861 19.4739L6.8568 19.4701L6.85285 19.4661C6.23371 18.847 6.0378 18.5794 5.97334 18.3976C5.95126 18.3353 5.95349 18.2618 5.96648 18.1707V16C5.96648 14.8954 6.86191 14 7.96648 14ZM12 2C16.4183 2 20 5.58172 20 10C20 14.4183 16.4183 18 12 18C7.58172 18 4 14.4183 4 10C4 5.58172 7.58172 2 12 2ZM12 4C8.68629 4 6 6.68629 6 10C6 13.3137 8.68629 16 12 16C15.3137 16 18 13.3137 18 10C18 6.68629 15.3137 4 12 4Z"></path>
                 </motion.svg>
                 
                 <motion.h2 
                          variants={FADE_IN_UP}
                          initial="hidden"
                          whileInView="visible"
                          transition={TEXT_REVEAL_TRANSITION}
                    className="text-3xl md:text-5xl font-serif italic mb-10 leading-snug"
                 >
                    "Technique is just the tool. <br/> <span className="text-yellow-400">Emotion is the goal.</span>"
                 </motion.h2>
                 
                 <motion.p 
                          variants={FADE_IN}
                          initial="hidden"
                          whileInView="visible"
                          transition={TEXT_FADE_TRANSITION}
                    className="text-slate-400 leading-loose font-light text-lg md:text-xl max-w-2xl mx-auto"
                 >
                    Whether I'm writing a line of code or a line of melody, the objective remains the same: to create a moment of connection. 
                    I believe the best digital products feel as natural and moving as a great song.
                 </motion.p>
            </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default About;
