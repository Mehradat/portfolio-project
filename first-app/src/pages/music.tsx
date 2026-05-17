import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_URL } from "../config";

// Use standard HTML audio or a mock since we don't have files
// Define tracks data
const tracksDefault: { id: number; title: string; genre: string; audioUrl: string }[] = [];

// Icons as components
function PlayIcon() { return (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
  );
}

function PauseIcon() { return (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
  );
}

function SkipBackIcon() { return (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="19 20 9 12 19 4 19 20"></polygon>
    <line x1="5" y1="19" x2="5" y2="5"></line>
  </svg>
  );
}

function SkipForwardIcon() { return (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 4 15 12 5 20 5 4"></polygon>
    <line x1="19" y1="5" x2="19" y2="19"></line>
  </svg>
  );
}

function VolumeIcon() { return (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
  );
}

function Music() {
  const [tracks, setTracks] = useState(tracksDefault);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [mediaDuration, setMediaDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks[currentTrackIndex] || {
    id: 0,
    title: "No Tracks Available",
    genre: "Please add a track",
    audioUrl: ""
  };

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const res = await fetch(`${API_URL}/api/music`);
        if (!res.ok) return;

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mappedTracks = data.map((item: {
            title: string;
            genre: string;
            audioUrl?: string;
          }, index: number) => ({
            id: index + 1,
            title: item.title,
            genre: item.genre,
            audioUrl: item.audioUrl || "",
          }));
          setTracks(mappedTracks);
        }
      } catch (error) {
        console.error("Failed to fetch music tracks", error);
      }
    };

    fetchMusic();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (!Number.isNaN(audio.duration)) {
        setMediaDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("durationchange", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("durationchange", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [tracks.length]);

  // Reset time when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setCurrentTime(0);
    setMediaDuration(0);
    setIsPlaying(false);
  }, [currentTrackIndex]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleNext = () => {
    if (tracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const handlePrev = () => {
    if (tracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack.audioUrl) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio playback failed", error);
    }
  };

  const effectiveDuration = mediaDuration > 0 ? mediaDuration : 0;
  const progressPercent =
    effectiveDuration > 0 ? (currentTime / effectiveDuration) * 100 : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !effectiveDuration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.min(Math.max(clickX / rect.width, 0), 1);
    const seekTime = ratio * effectiveDuration;

    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  return (
    <div className="min-h-screen transition-colors duration-500  bg-transparent dark:bg-transparent font-sans text-slate-800 dark:text-white">
      {/* Header with dark text since the background is white */}
      <Header className="text-slate-900 dark:text-white" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-serif font-bold text-slate-900 dark:text-white mb-6 relative inline-block">
            Music
            <span className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-24 h-1 bg-yellow-400"></span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 mt-4">Original compositions where melody meets technology</p>
        </div>

        {/* Player Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Player Card */}
          <div className="lg:col-span-2 bg-white dark:bg-transparent rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 lg:p-12 border border-slate-100 dark:border-slate-200 dark:border-white/10 relative overflow-hidden">
            
            {/* Track Info */}
            <div className="mb-8 relative z-10">
              <h2 className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">{currentTrack.title}</h2>
              <div className="flex items-center gap-4">
                <span className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-sm font-medium">
                  {currentTrack.genre}
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">{formatTime(effectiveDuration)}</span>
              </div>
            </div>
            {/* Visualizer Area (Mock) */}
            <div className="h-48 bg-slate-50 dark:bg-slate-900/50 rounded-2xl mb-8 flex items-end justify-center px-4 py-8 gap-1 w-full overflow-hidden">
             {/* Generate bars with deterministic heights so they don't jitter on re-render */}
             {Array.from({ length: 60 }).map((_, i) => {
                // Pseudo-random but stable height based on index
                const height = Math.max(20, 30 + Math.sin(i * 0.2 + currentTrack.id) * 40 + Math.cos(i * 0.5) * 20);
                
                // Highlight bars based on progress
                const isActive = (i / 60) * effectiveDuration < currentTime;
                
                return (
                 <div 
                   key={i} 
                   className={`w-2 rounded-t-sm transition-all duration-300 ${isActive ? 'bg-yellow-400' : 'bg-slate-200 dark:bg-slate-800 dark:bg-white/20'}`}
                   style={{ height: `${height}%` }}
                 />
                );
             })}
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div
                className="relative w-full h-2 bg-slate-200 dark:bg-slate-800 dark:bg-white/20 rounded-full cursor-pointer group"
                onClick={handleSeek}
              >
                  <div 
                    className="absolute top-0 left-0 h-full bg-slate-200 dark:bg-slate-800 dark:bg-white/20 rounded-full w-full"
                  ></div>
                   {/* Active Progress */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-yellow-400 rounded-full transition-all duration-100"
                    style={{ width: `${progressPercent}%` }}
                  >
                      {/* Playhead */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 border-2 border-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(effectiveDuration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <button 
                  onClick={handlePrev}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:bg-slate-800 dark:bg-white/20 text-slate-700 dark:text-slate-200 transition"
                >
                  <SkipBackIcon />
                </button>

                <button 
                  onClick={togglePlay}
                  disabled={!currentTrack.audioUrl}
                  className={`w-16 h-16 flex items-center justify-center rounded-full text-slate-900 dark:text-white shadow-lg shadow-yellow-200 transition transform hover:scale-105 ${
                    currentTrack.audioUrl
                      ? "bg-yellow-400 hover:bg-yellow-300"
                      : "bg-slate-200 dark:bg-slate-800 dark:bg-white/20 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>

                <button 
                   onClick={handleNext}
                   className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:bg-slate-800 dark:bg-white/20 text-slate-700 dark:text-slate-200 transition"
                >
                  <SkipForwardIcon />
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="text-slate-400">
                    <VolumeIcon />
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volume} 
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full sm:w-32 h-1.5 bg-slate-200 dark:bg-slate-800 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-slate-400"
                />
              </div>
            </div>

            {!currentTrack.audioUrl && (
              <p className="mt-4 text-sm text-amber-600">
                This track has no uploaded audio file yet.
              </p>
            )}

            <audio
              ref={audioRef}
              src={currentTrack.audioUrl}
              preload="metadata"
            />

          </div>

          {/* Playlist Sidebar */}
          <div className="lg:col-span-1">
             <div className="bg-white dark:bg-transparent rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 border border-slate-100 dark:border-slate-200 dark:border-white/10 h-full">
                <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-6">Playlist</h3>
                
                <div className="space-y-4">
                  {tracks.map((track, index) => {
                    const isActive = index === currentTrackIndex;
                    return (
                        <div 
                          key={track.id}
                          onClick={() => setCurrentTrackIndex(index)}
                          className={`
                            p-4 rounded-2xl cursor-pointer transition-all border
                            ${isActive 
                                ? 'bg-yellow-50 border-yellow-400 shadow-sm' 
                                : 'bg-slate-50 dark:bg-slate-900/50 border-transparent hover:bg-slate-100 dark:bg-slate-800/50'
                             }
                          `}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`font-bold text-lg ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                                {track.title}
                            </h4>
                            <span className={`text-sm ${isActive ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>
                              {isActive ? formatTime(effectiveDuration) : "--:--"}
                            </span>
                          </div>
                          <p className={`text-sm ${isActive ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                              {track.genre}
                          </p>
                        </div>
                    );
                  })}
                </div>
             </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Music;
