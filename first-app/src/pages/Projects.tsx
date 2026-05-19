import React, { useState, useEffect } from "react";
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

const optimizeCloudinaryUrl = (url: string, width = 800) => {
  if (!url || !url.includes("cloudinary.com")) return url;
  if (url.includes("/upload/f_auto")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
};

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
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

  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Fetch data from backend
  useEffect(() => {
    fetch(`${API_URL}/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA:", data);
        setProjects(data);
        // Start fading out the loader softly
        setIsFadingOut(true);
        // Remove loader from DOM after transition completes
        setTimeout(() => {
          setIsLoading(false);
        }, 700);
      })
      .catch((err) => {
        console.log(err);
        setIsFadingOut(true);
        setTimeout(() => setIsLoading(false), 700);
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

      <main className="max-w-7xl mx-auto px-6 py-12 relative min-h-[60vh]">
        {/* Animated Loading Overlay */}
        {isLoading && (
          <div 
            className={`absolute inset-0 z-10 flex flex-col items-center justify-center bg-transparent transition-opacity duration-700 ease-in-out ${
              isFadingOut ? "opacity-0" : "opacity-100"
            }`}
          >
            {/* Terminal Window Theme Loader */}
            <div className="w-80 sm:w-96 bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-slate-700 font-mono">
              {/* Terminal Header */}
              <div className="bg-[#2d2d2d] px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                <div className="ml-2 text-[#858585] text-xs font-semibold tracking-wider">bash - mehradata </div>
              </div>
              {/* Terminal Body */}
              <div className="p-5 text-sm sm:text-base flex flex-col gap-3">
                <div className="flex gap-2 items-center text-[#50fa7b]">
                  <span className="text-[#ff79c6]">~</span>
                  <span className="text-white">$</span>
                  <span className="text-[#8be9fd]">fetch_projects()</span>
                </div>
                
                <div className="flex text-[#bd93f9]">
                  <span className="mr-2">&gt;</span>
                  <span>Connecting to database...</span>
                </div>

                <div className="flex text-[#f1fa8c]">
                  <span className="mr-2">&gt;</span>
                  <div className="flex items-center gap-1">
                    <span>Downloading awesomeness</span>
                    <span className="flex space-x-1 ml-1 items-b">
                      <span className="w-1.5 h-1.5 bg-[#f1fa8c] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-[#f1fa8c] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-[#f1fa8c] rounded-full animate-bounce"></span>
                    </span>
                  </div>
                </div>

                <div className="flex mt-1 text-white">
                  <span className="w-2.5 h-5 bg-white animate-pulse"></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content with Fade-in Effect */}
        <div className={`transition-opacity duration-700 ease-in-out ${isLoading && !isFadingOut ? "opacity-0 invisible" : "opacity-100 visible"}`}>
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
                    ? "bg-yellow-400 text-black border-yellow-400"
                    : "bg-white dark:bg-transparent text-gray-500 dark:text-slate-400 border-gray-200 dark:border-gray-700/50 hover:border-yellow-400/50 dark:hover:border-yellow-400/50"
                } transition-colors duration-300`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects */}
          <div className="space-y-16">
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
                          src={optimizeCloudinaryUrl(currentImage, 800)}
                          alt={project.title}
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
        </div>
        </div>
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
            src={optimizeCloudinaryUrl(lightboxImages[lightboxIndex], 1920)}
            alt={`Project image ${lightboxIndex + 1}`}
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
                  <img src={optimizeCloudinaryUrl(img, 150)} alt={`Thumbnail ${idx + 1}`} draggable="false" className="w-full h-full object-cover pointer-events-none select-none" />
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