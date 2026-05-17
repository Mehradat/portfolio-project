import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Game1() {
    const GRID_SIZE = 10;
    const BOX_COUNT = GRID_SIZE * GRID_SIZE;
    
    const [targetBox, setTargetBox] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [message, setMessage] = useState("Click 'Start Game' to begin!");
    const [volume, setVolume] = useState(0);
    const [attemptsLeft, setAttemptsLeft] = useState(3);
    const [startTime, setStartTime] = useState<number>(0);
    const [finalTime, setFinalTime] = useState<number>(0);
    const [feedback, setFeedback] = useState("");
    const [scoreHistory, setScoreHistory] = useState<Array<{ score: number; date: string; time: string }>>([]);
    const [timeLeft, setTimeLeft] = useState(60);
    
    // Audio refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const nextNoteTimeRef = useRef<number>(0);
    const timerIDRef = useRef<number | null>(null);
    const schedulerTimerRef = useRef<number | null>(null);

    // Initialize game
    useEffect(() => {
        // Load scores from localStorage
        const savedScores = localStorage.getItem('drumGameScores');
        if (savedScores) {
            setScoreHistory(JSON.parse(savedScores));
        }

        // Cleanup audio on unmount
        return () => {
            stopAudio();
        };
    }, []);

    // Timer logic
    useEffect(() => {
        if (gameStarted && !gameOver && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && gameStarted && !gameOver) {
            setGameOver(true);
            setFinalTime(60);
            setMessage("Time's up! Game Over.");
            setFeedback("Too slow! 🐢");
            stopAudio();
            saveScore(0, 60);
        }
    }, [timeLeft, gameStarted, gameOver]);

    const saveScore = (newScore: number, timeTaken: number) => {
        const newEntry = {
            score: newScore,
            date: new Date().toLocaleDateString(),
            time: `${timeTaken.toFixed(1)}s`
        };
        
        const updatedHistory = [newEntry, ...scoreHistory].slice(0, 10); // Keep top 10 recent
        setScoreHistory(updatedHistory);
        localStorage.setItem('drumGameScores', JSON.stringify(updatedHistory));
    };

    const startGame = () => {
        const newTarget = Math.floor(Math.random() * BOX_COUNT);
        setTargetBox(newTarget);
        setGameOver(false);
        setGameStarted(true);
        setAttemptsLeft(3);
        setTimeLeft(60);
        setStartTime(Date.now());
        setFeedback("Move your mouse...");
        setMessage("Find the hidden drum! 60s remaining.");
        
        // Initialize Audio Context on user gesture
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            audioContextRef.current = new AudioContext();
        }
        
        startAudio();
    };

    const startAudio = () => {
        if (!audioContextRef.current) return;
        
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }

        // Master Gain for volume control (distance based)
        const masterGain = audioContextRef.current.createGain();
        masterGain.gain.value = 0;
        masterGain.connect(audioContextRef.current.destination);
        gainNodeRef.current = masterGain;

        nextNoteTimeRef.current = audioContextRef.current.currentTime;
        scheduler();
    };

    const stopAudio = () => {
        if (schedulerTimerRef.current) {
            clearTimeout(schedulerTimerRef.current);
        }
        if (gainNodeRef.current) {
            gainNodeRef.current.disconnect();
            gainNodeRef.current = null;
        }
    };

    // Scheduling the drum beat
    const scheduler = () => {
        if(!audioContextRef.current) return;

        while (nextNoteTimeRef.current < audioContextRef.current.currentTime + 0.1) {
            playDrum(nextNoteTimeRef.current);
            nextNoteTimeRef.current += 0.5; // Tempo: 120 BPM = 0.5s per beat
        }
        schedulerTimerRef.current = window.setTimeout(scheduler, 25);
    };

    const playDrum = (time: number) => {
        if (!audioContextRef.current || !gainNodeRef.current) return;

        const osc = audioContextRef.current.createOscillator();
        const oscGain = audioContextRef.current.createGain();

        osc.connect(oscGain);
        oscGain.connect(gainNodeRef.current);

        // Kick drum synthesis
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);

        oscGain.gain.setValueAtTime(1, time);
        oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

        osc.start(time);
        osc.stop(time + 0.5);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!gameStarted || gameOver || targetBox === null) return;

        // Calculate distance to target
        const targetElement = document.getElementById(`box-${targetBox}`);
        if (!targetElement) return;

        const targetRect = targetElement.getBoundingClientRect();
        const targetCenter = {
            x: targetRect.left + targetRect.width / 2,
            y: targetRect.top + targetRect.height / 2
        };

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const distance = Math.sqrt(
            Math.pow(mouseX - targetCenter.x, 2) + Math.pow(mouseY - targetCenter.y, 2)
        );

        // Normalize distance to volume (0 to 1)
        // Max distance is roughly the diagonal of the screen, say 1000px for safety
        const maxDistance = 800; // Adjust as needed
        
        // "Bold" audio: using an exponential decay for distance so it gets loud very fast when close
        // and stays quiet when far.
        // Clamp distance to avoid division by zero
        const safeDistance = Math.max(1, distance);
        const volumeFactor = Math.max(0, 1 - (safeDistance / maxDistance));
        // Power of 3 makes the curve steeper - quiet for longer, then ramps up
        const finalVolume = Math.pow(volumeFactor, 4); 

        setVolume(finalVolume);
        
        // Update feedback message based on distance
        if (distance < 50) {
            setFeedback("Too Close! 🔥");
        } else if (distance < 150) {
            setFeedback("Close 🤏");
        } else if (distance < 300) {
            setFeedback("A Bit Far 😐");
        } else if (distance < 500) {
            setFeedback("Far 🚶");
        } else {
            setFeedback("Too Far 🏔️");
        }

        if (gainNodeRef.current && audioContextRef.current) {
            // Smooth transition
            gainNodeRef.current.gain.setTargetAtTime(finalVolume, audioContextRef.current.currentTime, 0.1);
        }
    };

    const playWrongSound = () => {
        if (!audioContextRef.current) return;
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(100, audioContextRef.current.currentTime);
        oscillator.frequency.linearRampToValueAtTime(50, audioContextRef.current.currentTime + 0.3);

        gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3);

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        oscillator.start();
        oscillator.stop(audioContextRef.current.currentTime + 0.3);
    };

    const handleBoxClick = (index: number) => {
        if (!gameStarted || gameOver) return;

        if (index === targetBox) {
            const timeTaken = (Date.now() - startTime) / 1000;
            setFinalTime(timeTaken);
            // Base score 1000, minus 10 per second
            const timeBonus = Math.max(0, Math.floor(1000 - timeTaken * 10));
            const newScore = score + 500 + timeBonus;
            
            setScore(newScore);
            setMessage(`You found it!`);
            setFeedback("WINNER! 🎉");
            setGameOver(true);
            saveScore(newScore, timeTaken);
            stopAudio();
            // Play success sound?
            playSuccessSound();
        } else {
             playWrongSound();
             const newAttempts = attemptsLeft - 1;
             setAttemptsLeft(newAttempts);
             if (newAttempts <= 0) {
                 const timeTaken = (Date.now() - startTime) / 1000;
                 setFinalTime(timeTaken);
                 setGameOver(true);
                 setMessage("Game Over!");
                 setFeedback("Maybe next time... 💀");
                 saveScore(0, timeTaken);
                 stopAudio();
             } else {
                 setMessage(`Wrong box! ${newAttempts} attempts remaining.`);
             }
        }
    };

    const playSuccessSound = () => {
        if (!audioContextRef.current) return;
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(440, audioContextRef.current.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioContextRef.current.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.5, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        
        oscillator.start();
        oscillator.stop(audioContextRef.current.currentTime + 0.5);
    };

    const resetGame = () => {
        setScore(0);
        startGame();
    };

    const playAgain = () => {
        startGame();
    };

    return (
        <div className="min-h-screen flex flex-col bg-transparent text-slate-900 dark:text-white transition-colors duration-500" onMouseMove={handleMouseMove}>
            <Header />
            
            <main className="flex-grow flex flex-col lg:flex-row items-center lg:items-start justify-center p-4 gap-8">
                {/* Game Area */}
                <div className="flex flex-col items-center">
                    <div className="mb-4 text-center">
                        <h1 className="text-3xl font-bold mb-2">Hidden Drum Game</h1>
                        <p className="text-xl mb-2">{message}</p>
                        {gameStarted && !gameOver && (
                            <div className="flex flex-col gap-2 mb-4">
                                <div className="text-2xl font-bold text-yellow-500 animate-pulse">{feedback}</div>
                                <div className="flex gap-4 justify-center text-lg">
                                    <span className={`${attemptsLeft === 1 ? 'text-red-500 font-bold' : ''}`}>Attempts: {attemptsLeft}</span>
                                    <span className={`${timeLeft < 10 ? 'text-red-500 font-bold animate-pulse' : ''}`}>Time: {timeLeft}s</span>
                                </div>
                            </div>
                        )}
                        
                        {!gameStarted && (
                            <button 
                                onClick={startGame}
                                className="bg-green-500 hover:bg-green-600 dark:bg-green-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Start Game
                            </button>
                        )}
                    </div>

                    <div 
                        className="grid gap-2 p-4 bg-white dark:bg-gray-800 shadow-md dark:shadow-none rounded-lg shadow-lg"
                        style={{ 
                            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` 
                        }}
                    >
                        {Array.from({ length: BOX_COUNT }).map((_, index) => (
                            <div
                                key={index}
                                id={`box-${index}`}
                                onClick={() => handleBoxClick(index)}
                                className={`
                                    w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer 
                                    transition-colors duration-200
                                    ${gameStarted && !gameOver ? 'hover:bg-gray-200 dark:hover:bg-gray-600' : ''}
                                    ${gameOver && index === targetBox ? 'bg-yellow-400 animate-pulse' : 'bg-gray-100 dark:bg-gray-700'}
                                `}
                            >
                                {/* Content Hidden */}
                            </div>
                        ))}
                    </div>
                    
                    {gameStarted && !gameOver && (
                        <div className="mt-4 w-full">
                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 mb-2 overflow-hidden border border-gray-300 dark:border-gray-600">
                                <div 
                                    className={`h-full transition-all duration-1000 ease-linear ${timeLeft < 10 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}
                                    style={{ width: `${(timeLeft / 60) * 100}%` }}
                                ></div>
                            </div>
                            <div className="text-center font-mono text-xl">
                                {timeLeft}s Remaining
                            </div>
                        </div>
                    )}

                    <div className="mt-8 font-bold text-2xl">
                        <p>Score: {score}</p>
                    </div>
                </div>

                {/* Scoreboard Area */}
                <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-none p-6 rounded-lg shadow-lg w-full max-w-sm">
                    <h2 className="text-2xl font-bold mb-4 text-center border-b border-gray-300 dark:border-gray-600 pb-2">Score History</h2>
                    <div className="space-y-3">
                        {scoreHistory.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400 text-center">No games played yet.</p>
                        ) : (
                            scoreHistory.map((entry, index) => (
                                <div 
                                    key={index} 
                                    className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700/50 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <div className="flex flex-col">
                                        <span className={`font-bold ${entry.score > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {entry.score > 0 ? 'WIN' : 'LOSS'}
                                        </span>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">{entry.date}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-mono font-bold text-yellow-400">{entry.score} pts</span>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">{entry.time}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {scoreHistory.length > 0 && (
                        <button 
                            onClick={() => {
                                localStorage.removeItem('drumGameScores');
                                setScoreHistory([]);
                            }}
                            className="mt-4 w-full text-sm text-gray-600 dark:text-gray-400 hover:text-slate-900 dark:text-white underline"
                        >
                            Clear History
                        </button>
                    )}
                </div>

                {/* Game Over Modal */}
                {gameOver && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-none p-8 rounded-xl border border-gray-300 dark:border-gray-600 shadow-2xl text-center max-w-md w-full animate-fade-in">
                            <h2 className="text-4xl font-bold mb-4">{attemptsLeft > 0 ? "You Won!" : "Game Over"}</h2>
                            <div className="text-7xl mb-6">{attemptsLeft > 0 ? "🏆" : "☠️"}</div>
                            
                            <div className="space-y-4 text-xl mb-8 bg-gray-100 dark:bg-gray-700/50 p-6 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Time Taken:</span>
                                    <span className="font-mono">{finalTime.toFixed(1)}s</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Attempts Left:</span>
                                    <span className="font-mono text-green-400">{attemptsLeft}</span>
                                </div>
                                <div className="border-t border-gray-300 dark:border-gray-600 my-2"></div>
                                <div className="flex justify-between items-center text-2xl font-bold text-yellow-400">
                                    <span>Total Score:</span>
                                    <span>{score}</span>
                                </div>
                            </div>

                            <button 
                                onClick={playAgain}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                            >
                                Play Again
                            </button>
                        </div>
                    </div>
                )} 
            </main>
            
            <Footer />
        </div>
    );
};

export default Game1;
