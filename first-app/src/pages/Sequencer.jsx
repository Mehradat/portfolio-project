import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import Header from "../components/Header";
import Footer from "../components/Footer";

const steps = 16;

const pianoOrder = ["do", "re", "mi", "fa", "sol", "la", "si"];
const pianoKeyCodeMap = {
  KeyA: "do",
  KeyS: "re",
  KeyD: "mi",
  KeyF: "fa",
  KeyG: "sol",
  KeyH: "la",
  KeyJ: "si",
};

const keyboardGuide = [
  { keyLabel: "A", note: "do" },
  { keyLabel: "S", note: "re" },
  { keyLabel: "D", note: "mi" },
  { keyLabel: "F", note: "fa" },
  { keyLabel: "G", note: "sol" },
  { keyLabel: "H", note: "la" },
  { keyLabel: "J", note: "si" },
];

const pianoKeyColors = {
  do: "bg-rose-300 text-rose-950 hover:bg-rose-200",
  re: "bg-orange-300 text-orange-950 hover:bg-orange-200",
  mi: "bg-amber-300 text-amber-950 hover:bg-amber-200",
  fa: "bg-lime-300 text-lime-950 hover:bg-lime-200",
  sol: "bg-cyan-300 text-cyan-950 hover:bg-cyan-200",
  la: "bg-indigo-300 text-indigo-950 hover:bg-indigo-200",
  si: "bg-fuchsia-300 text-fuchsia-950 hover:bg-fuchsia-200",
};

const formatNoteLabel = (note) => note.charAt(0).toUpperCase() + note.slice(1);

function Sequencer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [drumVolume, setDrumVolume] = useState(0);
  const [pianoVolume, setPianoVolume] = useState(0);
  const [currentStep, setCurrentStep] = useState(-1);
  const [activePianoNotes, setActivePianoNotes] = useState([]);

  const [grid, setGrid] = useState({
    kick: Array(steps).fill(false),
    snare: Array(steps).fill(false),
    hihat: Array(steps).fill(false),
  });

  const playersRef = useRef(null);
  const sequenceRef = useRef(null);
  const audioReadyRef = useRef(false);
  const transportReadyRef = useRef(false);
  const gridRef = useRef(grid);

  const getPlayerSafe = (name) => {
    try {
      if (!playersRef.current) return null;
      return playersRef.current.player(name);
    } catch {
      return null;
    }
  };

  // sync grid
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  // BPM
  useEffect(() => {
    if (!transportReadyRef.current) return;
    Tone.Transport.bpm.rampTo(bpm, 0.05);
  }, [bpm]);

  useEffect(() => {
    const kick = getPlayerSafe("kick");
    const snare = getPlayerSafe("snare");
    const hihat = getPlayerSafe("hihat");
    if (!kick || !snare || !hihat) return;

    kick.volume.value = drumVolume;
    snare.volume.value = drumVolume;
    hihat.volume.value = drumVolume;
  }, [drumVolume]);

  useEffect(() => {
    const doPlayer = getPlayerSafe("do");
    const re = getPlayerSafe("re");
    const mi = getPlayerSafe("mi");
    const fa = getPlayerSafe("fa");
    const sol = getPlayerSafe("sol");
    const la = getPlayerSafe("la");
    const si = getPlayerSafe("si");
    if (!doPlayer || !re || !mi || !fa || !sol || !la || !si) return;

    doPlayer.volume.value = pianoVolume;
    re.volume.value = pianoVolume;
    mi.volume.value = pianoVolume;
    fa.volume.value = pianoVolume;
    sol.volume.value = pianoVolume;
    la.volume.value = pianoVolume;
    si.volume.value = pianoVolume;
  }, [pianoVolume]);

  // setup
  useEffect(() => {
    const audioContext = Tone.getContext();
    audioContext.lookAhead = 0.005;
    audioContext.updateInterval = 0.005;

    playersRef.current = new Tone.Players({
      kick: "/kick.mp3",
      snare: "/snare.mp3",
      hihat: "/hihat.mp3",
      do: "/c2.mp3",
      re: "/d2.mp3",
      mi: "/e2.mp3",
      fa: "/f2.mp3",
      sol: "/g2.mp3",
      la: "/a2.mp3",
      si: "/b2.mp3",
    }).toDestination();

    Tone.loaded().then(() => {
      audioReadyRef.current = true;
    });

    const sequenceSteps = Array.from({ length: steps }, (_, i) => i);

    sequenceRef.current = new Tone.Sequence((time, step) => {
      const currentGrid = gridRef.current;

      Tone.Draw.schedule(() => {
        setCurrentStep(step);
      }, time);

      if (currentGrid.kick[step])
        playersRef.current.player("kick").start(time);

      if (currentGrid.snare[step])
        playersRef.current.player("snare").start(time);

      if (currentGrid.hihat[step])
        playersRef.current.player("hihat").start(time);
    }, sequenceSteps, "16n");

    Tone.Transport.loop = true;
    Tone.Transport.loopEnd = "1m";

    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      sequenceRef.current?.dispose();
      playersRef.current?.dispose();
      sequenceRef.current = null;
      playersRef.current = null;
      transportReadyRef.current = false;
    };
  }, []);

  // unlock audio once so keyboard notes can fire instantly
  useEffect(() => {
    const unlockAudio = async () => {
      if (audioReadyRef.current && Tone.getContext().state === "running") return;

      await Tone.start();
      await Tone.loaded();
      audioReadyRef.current = true;
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    return () => window.removeEventListener("pointerdown", unlockAudio);
  }, []);

  // piano play
  const playPianoNote = (note) => {
    if (!playersRef.current || !audioReadyRef.current) return;

    const player = playersRef.current.player(note);
    player.stop();
    player.start(Tone.immediate());

    setActivePianoNotes((prev) => [...new Set([...prev, note])]);

    setTimeout(() => {
      setActivePianoNotes((prev) => prev.filter((n) => n !== note));
    }, 150);
  };

  // keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;

      const note = pianoKeyCodeMap[e.code];
      if (!note) return;

      e.preventDefault();
      if (Tone.getContext().state !== "running") {
        Tone.start().then(() => {
          audioReadyRef.current = true;
          playPianoNote(note);
        });
        return;
      }

      playPianoNote(note);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // toggle
  const toggleStep = (row, i) => {
    setGrid((prev) => ({
      ...prev,
      [row]: prev[row].map((v, idx) => (idx === i ? !v : v)),
    }));
  };

  // play
  const handlePlay = async () => {
    await Tone.start();
    await Tone.loaded();
    audioReadyRef.current = true;
    transportReadyRef.current = true;

    if (!isPlaying) {
      Tone.Transport.position = 0;
      Tone.Transport.bpm.value = bpm;
      sequenceRef.current.start(0);
      Tone.Transport.start();
      setIsPlaying(true);
    } else {
      Tone.Transport.stop();
      sequenceRef.current.stop();
      setCurrentStep(-1);
      setIsPlaying(false);
    }
  };

  const clearPattern = () => {
    setGrid({
      kick: Array(steps).fill(false),
      snare: Array(steps).fill(false),
      hihat: Array(steps).fill(false),
    });
    setCurrentStep(-1);
  };

  // UI row
  const renderRow = (rowName) => (
    <div className="flex gap-2 mb-4">
      {grid[rowName].map((active, i) => (
        <div
          key={i}
          onClick={() => toggleStep(rowName, i)}
          className={`w-10 h-10 rounded-lg cursor-pointer transition-all duration-200
            ${i > 0 && i % 4 === 0 ? "ml-4" : ""}
            ${
              active
                ? "bg-yellow-400 shadow-[0_0_20px_#facc15] scale-110"
                : "bg-slate-700 hover:bg-slate-600"
            }
            ${currentStep === i ? "ring-2 ring-white" : ""}
          `}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-800 text-white flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-4 lg:px-8 lg:py-6">
        <div className="h-full w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          <div className="min-h-0 flex flex-col items-center">
          <h1 className="text-4xl lg:text-6xl mb-2 font-extrabold tracking-tight text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-300 drop-shadow-[0_0_18px_rgba(34,211,238,0.45)]">
              Interactive Music Lab
            </span>
          </h1>
          <p className="text-slate-300 text-center max-w-2xl mb-3 text-sm lg:text-base leading-relaxed">
            Build your groove with drums, then jam live piano on top. Click the pads to write a loop,
            press Play, and perform melodies in real time.
          </p>

          <div>
            <p className="text-center text-base lg:text-lg font-semibold tracking-wide text-cyan-200 mb-3">
              Time to build your own drum groove. Click the pads and shape your beat.
            </p>
            <p className="text-yellow-400">Kick</p>
            {renderRow("kick")}

            <p className="text-yellow-400">Snare</p>
            {renderRow("snare")}

            <p className="text-yellow-400">Hi-hat</p>
            {renderRow("hihat")}
          </div>

          <div className="w-full max-w-3xl mt-2 mb-2 rounded-xl border border-cyan-500/30 bg-slate-900/50 px-4 py-3">
            <p className="text-cyan-300 font-semibold mb-2 text-center">Keyboard Piano Guide</p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs lg:text-sm">
              {keyboardGuide.map((item) => (
                <span
                  key={item.keyLabel}
                  className="px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-300/30"
                >
                  {item.keyLabel} = {formatNoteLabel(item.note)}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-cyan-300 text-center mb-2">Play piano with keyboard: A S D F G H J</p>
            <p className="text-slate-300 text-center text-sm mb-3">Do Re Mi Fa Sol La Si</p>
            <div className="flex gap-2">
              {pianoOrder.map((note) => (
                <button
                  key={note}
                  onClick={() => {
                    if (Tone.getContext().state !== "running") {
                      Tone.start().then(() => {
                        audioReadyRef.current = true;
                        playPianoNote(note);
                      });
                      return;
                    }

                    playPianoNote(note);
                  }}
                  className={`w-12 h-20 lg:w-14 lg:h-24 rounded-lg border border-white/30 font-semibold transition-all duration-150 
                    ${
                      activePianoNotes.includes(note)
                        ? "bg-white text-black -translate-y-1 scale-105 shadow-[0_0_24px_rgba(255,255,255,0.65)]"
                        : pianoKeyColors[note]
                    }`}
                >
                  {formatNoteLabel(note)}
                </button>
              ))}
            </div>
          </div>
        </div>

          <aside className="w-full lg:w-[320px] rounded-2xl border border-cyan-400/30 bg-slate-950/70 backdrop-blur-sm p-4 lg:p-5 shadow-[0_0_30px_rgba(34,211,238,0.16)]">
            <p className="text-cyan-300 font-semibold mb-4">Mixer & Tempo</p>

          <div className="flex gap-2 mb-4">
            <button
              onClick={handlePlay}
              className="flex-1 px-4 py-3 bg-yellow-400 text-black font-bold rounded-xl"
            >
              {isPlaying ? "Stop" : "Play"}
            </button>
            <button
              onClick={clearPattern}
              className="px-4 py-3 bg-slate-700 text-white font-bold rounded-xl"
            >
              Clear
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-200 mb-1">BPM: {bpm}</p>
              <input
                className="w-full"
                type="range"
                min="60"
                max="180"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
              />
            </div>

            <div>
              <p className="text-sm text-slate-200 mb-1">Drum Volume: {drumVolume} dB</p>
              <input
                className="w-full"
                type="range"
                min="-24"
                max="6"
                value={drumVolume}
                onChange={(e) => setDrumVolume(Number(e.target.value))}
              />
            </div>

            <div>
              <p className="text-sm text-slate-200 mb-1">Piano Volume: {pianoVolume} dB</p>
              <input
                className="w-full"
                type="range"
                min="-24"
                max="6"
                value={pianoVolume}
                onChange={(e) => setPianoVolume(Number(e.target.value))}
              />
            </div>
          </div>
          </aside>
        </div>
      </main>
      <Footer />
      </div>
  );
};

export default Sequencer;