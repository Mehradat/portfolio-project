import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_URL } from "../config";

// Define project type
interface Project {
  _id: string; // مهم: Mongo اینو میده نه id
  title: string;
  category: string;
  description: string;
  keyFeatures: string[];
  techStack: string[];
  image: string;
  images?: string[];
}

const categories = [
  "All Projects",
  "Music + Code Integration",
  "Full-Stack Development",
  "Front-End Showcase",
];

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Projects");
  const [projectSlideIndex, setProjectSlideIndex] = useState<Record<string, number>>({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Swipe handling states
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Mouse drag scrolling for thumbnails
  const [isDraggingThumbnails, setIsDraggingThumbnails] = useState(false);
  const thumbnailContainerRef = React.useRef<HTMLDivElement>(null);
  const dragStartX = React.useRef(0);
  const dragScrollLeft = React.useRef(0);
  const hasDragged = React.useRef(false);

  // Fetch data from backend
  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_URL}/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA:", data);
        setProjects(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  // Automatically scroll to the active thumbnail in the lightbox
  useEffect(() => {
    if (isLightboxOpen && lightboxImages.length > 0) {
      const thumb = document.getElementById(`lightbox-thumb-${lightboxIndex}`);
      if (thumb) {
        thumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [lightboxIndex, isLightboxOpen, lightboxImages.length]);

  const filteredProjects =
    activeCategory === "All Projects"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const getProjectImages = (project: Project) => {
    if (project.images && project.images.length > 0) {
      return project.images;
    }
    return project.image ? [project.image] : [];
  };

  const openLightbox = (project: Project, startIndex: number = 0) => {
    const images = getProjectImages(project);

    if (images.length === 0) return;

    setLightboxImages(images);
    setLightboxIndex(startIndex);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxImages([]);
    setLightboxIndex(0);
  };

  const nextImage = () => {
    if (lightboxImages.length === 0) return;
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const prevImage = () => {
    if (lightboxImages.length === 0) return;
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  const nextProjectImage = (projectId: string, total: number) => {
    if (total <= 1) return;
    setProjectSlideIndex((prev) => ({
      ...prev,
      [projectId]: ((prev[projectId] ?? 0) + 1) % total,
    }));
  };

  const prevProjectImage = (projectId: string, total: number) => {
    if (total <= 1) return;
    setProjectSlideIndex((prev) => ({
      ...prev,
      [projectId]: ((prev[projectId] ?? 0) - 1 + total) % total,
    }));
  };

  const setProjectImageIndex = (projectId: string, index: number) => {
    setProjectSlideIndex((prev) => ({
      ...prev,
      [projectId]: index,
    }));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEndProject = (projectId: string, total: number) => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      nextProjectImage(projectId, total);
    } else if (isRightSwipe) {
      prevProjectImage(projectId, total);
    }
  };

  const handleTouchEndLightbox = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-500  bg-transparent dark:bg-transparent font-sans text-slate-800 dark:text-white">
      <Header className="text-slate-900 dark:text-white" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-serif font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Projects
          </h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-lg border-2 ${
                activeCategory === cat
                  ? "bg-yellow-400 text-black"
                  : "bg-white dark:bg-transparent text-gray-500 dark:text-slate-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center min-h-[50vh] w-full"
            >
              <div className="relative w-40 h-40 flex items-center justify-center mb-8">
                {/* Outer rotating dashed ring */}
                <motion.svg
                  className="absolute inset-0 w-full h-full text-slate-300 dark:text-slate-700"
                  viewBox="0 0 100 100"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                >
                  <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
                </motion.svg>
                
                {/* Inner rotating gradient-like SVG */}
                <motion.svg
                  className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)]"
                  viewBox="0 0 100 100"
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                >
                  <defs>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#eab308" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="46" fill="none" stroke="url(#ringGrad)" strokeWidth="2" strokeDasharray="70 150" strokeLinecap="round" />
                </motion.svg>

                {/* Center Equalizer / Bar Animation */}
                <div className="flex items-center justify-center gap-1.5 h-12 z-10">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ["20%", "100%", "20%"] }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: i * 0.1 }}
                      className="w-1.5 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                    />
                  ))}
                </div>
              </div>

              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-xl font-bold tracking-[0.3em] text-slate-800 dark:text-white uppercase"
              >
                Loading
              </motion.div>
              <div className="text-sm text-slate-500 dark:text-slate-400 tracking-widest mt-3 uppercase">
                Please wait
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-16"
            >
          {filteredProjects.map((project) => (
            <div key={project._id} className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
              <div className="w-full lg:w-7/12">
                {(() => {
                  const images = getProjectImages(project);
                  const currentIndex = projectSlideIndex[project._id] ?? 0;
                  const safeIndex = images.length > 0 ? Math.min(currentIndex, images.length - 1) : 0;
                  const currentImage = images[safeIndex] || "";

                  return (
                    <>
                      <div 
                        className="group relative rounded-xl overflow-hidden border border-slate-300 dark:border-white/20/90 shadow-[0_14px_35px_rgba(15,23,42,0.22)] hover:border-yellow-500/80 hover:shadow-[0_18px_45px_rgba(234,179,8,0.4)] dark:hover:border-yellow-400/80 dark:hover:shadow-[0_18px_45px_rgba(234,179,8,0.24)] transition-all duration-300 aspect-[16/10] bg-slate-100 dark:bg-slate-800/50"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={() => handleTouchEndProject(project._id, images.length)}
                      >
                        <img
                          src={currentImage}
                          alt={project.title}
                          loading="lazy"
                          decoding="async"
                          className="cursor-pointer w-full h-full object-cover object-top"
                          onClick={() => openLightbox(project, safeIndex)}
                        />

                        <div className="pointer-events-none absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/45 text-white text-xs font-semibold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          View Image
                        </div>

                        {images.length > 1 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                            <div className="flex items-center justify-between gap-3">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  prevProjectImage(project._id, images.length);
                                }}
                                className="px-3 py-1.5 text-sm rounded-lg bg-slate-800 dark:bg-white/20 text-white hover:bg-white/30"
                              >
                                Previous
                              </button>
                              <span className="text-xs font-medium text-white">
                                {safeIndex + 1} / {images.length}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  nextProjectImage(project._id, images.length);
                                }}
                                className="px-3 py-1.5 text-sm rounded-lg bg-slate-800 dark:bg-white/20 text-white hover:bg-white/30"
                              >
                                Next
                              </button>
                            </div>

                            <div className="flex justify-center gap-2 mt-3">
                              {images.map((_, idx) => (
                                <button
                                  key={`${project._id}-dot-${idx}`}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setProjectImageIndex(project._id, idx);
                                  }}
                                  className={`h-2.5 rounded-full transition-all ${
                                    idx === safeIndex ? "w-6 bg-yellow-400" : "w-2.5 bg-white/60 hover:bg-white dark:bg-transparent"
                                  }`}
                                  aria-label={`Go to image ${idx + 1}`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                    </>
                  );
                })()}
              </div>

              <div className="w-full lg:w-5/12 bg-white/70 dark:bg-slate-900/40 p-6 md:p-8 rounded-2xl backdrop-blur-md shadow-lg border border-white/50 dark:border-white/10">
                  <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                  {project.title}
                </h2>

                <p className="text-slate-800 dark:text-slate-300 mb-6 leading-relaxed">
                  {project.description}
                </p>

                <div className="mb-4">
                  <strong className="text-slate-900 dark:text-white text-lg inline-block mb-3">Features:</strong>
                  <ul className="list-disc ml-5 space-y-1 text-slate-700 dark:text-slate-300 mb-6">
                    {project.keyFeatures.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong className="text-slate-900 dark:text-white text-lg inline-block mb-2">Tech:</strong>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {project.techStack.map((t) => (
                      <span
                        key={t}
                        className="bg-white dark:bg-slate-800/80 px-4 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 shadow-sm font-medium text-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {isLightboxOpen && lightboxImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEndLightbox}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-6 right-6 text-slate-900 dark:text-white text-3xl leading-none hover:text-yellow-300"
            aria-label="Close"
          >
            x
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 md:left-8 text-slate-900 dark:text-white text-4xl px-3 py-2 rounded-full bg-white/80 dark:bg-white/10 hover:bg-slate-800 dark:bg-white/20 hover:text-yellow-300"
            aria-label="Previous image"
          >
            ‹
          </button>

          <img
            src={lightboxImages[lightboxIndex]}
            alt={`Project image ${lightboxIndex + 1}`}
            loading="lazy"
            decoding="async"
            className="max-w-[95vw] max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 md:right-8 text-slate-900 dark:text-white text-4xl px-3 py-2 rounded-full bg-white/80 dark:bg-white/10 hover:bg-slate-800 dark:bg-white/20 hover:text-yellow-300"
            aria-label="Next image"
          >
            ›
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 w-full max-w-[95vw] md:max-w-2xl px-4">
            <div className="text-slate-900 dark:text-white text-sm bg-black/50 px-4 py-2 rounded-full mb-1 shrink-0">
              {lightboxIndex + 1} / {lightboxImages.length}
            </div>

            <div 
              ref={thumbnailContainerRef}
              className={`flex items-center justify-start md:justify-center gap-3 bg-black/60 px-4 py-3 rounded-2xl md:rounded-full w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden transition-all select-none ${
                isDraggingThumbnails ? "cursor-grabbing snap-none" : "cursor-grab snap-x snap-mandatory"
              }`}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsDraggingThumbnails(true);
                hasDragged.current = false;
                if (thumbnailContainerRef.current) {
                  dragStartX.current = e.pageX - thumbnailContainerRef.current.offsetLeft;
                  dragScrollLeft.current = thumbnailContainerRef.current.scrollLeft;
                }
              }}
              onMouseLeave={() => {
                if (isDraggingThumbnails) setIsDraggingThumbnails(false);
              }}
              onMouseUp={() => {
                if (isDraggingThumbnails) {
                  // We delay setting this to false so click events have time to read the state
                  setTimeout(() => setIsDraggingThumbnails(false), 50);
                }
              }}
              onMouseMove={(e) => {
                if (!isDraggingThumbnails || !thumbnailContainerRef.current) return;
                e.preventDefault(); // Prevent text selection/image dragging
                
                const x = e.pageX - thumbnailContainerRef.current.offsetLeft;
                const walk = (x - dragStartX.current) * 2; // Scroll speed multiplier
                if (Math.abs(walk) > 10) { // Threshold to count as a drag
                  hasDragged.current = true;
                }
                
                thumbnailContainerRef.current.scrollLeft = dragScrollLeft.current - walk;
              }}
            >
              {lightboxImages.map((img, idx) => (
                <button
                  key={`lightbox-thumb-${idx}`}
                  id={`lightbox-thumb-${idx}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Prevent click if we dragged
                    if (hasDragged.current) {
                      e.preventDefault();
                      return;
                    }
                    setLightboxIndex(idx);
                  }}
                  className={`shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 ${isDraggingThumbnails ? "snap-align-none" : "snap-center"} ${
                    idx === lightboxIndex 
                      ? "border-yellow-400 w-16 h-16 md:w-20 md:h-20 shadow-[0_0_15px_rgba(250,204,21,0.5)] z-10" 
                      : "border-transparent w-12 h-12 md:w-14 md:h-14 opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} loading="lazy" decoding="async" draggable="false" className="w-full h-full object-cover pointer-events-none select-none" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Projects;