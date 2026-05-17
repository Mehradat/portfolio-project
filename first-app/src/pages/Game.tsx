import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Game() {
    const navigate = (href: string) => {
        if (window.location.pathname === href) return;
        window.history.pushState({}, '', href);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    return (
        <div className="min-h-screen flex flex-col bg-transparent text-slate-900 dark:text-white transition-colors duration-500">
            <Header />
            
            <main className="flex-grow flex flex-col items-center justify-center p-8">
                <div className="max-w-4xl w-full text-center mb-16">
                     <h1 className="text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse">
                        Game Center
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">Challenge your senses and beat the high score!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full px-4 items-stretch">
                    {/* Game 1 Card */}
                    <a
                        href="/game1"
                        className="block group h-full"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/game1');
                        }}
                    >
                        <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-none rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-2xl hover:border-yellow-400 relative h-full flex flex-col">
                            <div className="h-56 bg-gradient-to-br from-purple-900 to-indigo-900 flex flex-col items-center justify-center group-hover:from-purple-800 group-hover:to-indigo-800 transition-colors shrink-0">
                                <span className="text-8xl mb-2 group-hover:scale-110 transition-transform duration-300">🥁</span>
                            </div>
                            <div className="p-8 flex flex-col flex-grow">
                                <h2 className="text-3xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors">Hidden Drum</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow text-base">Find the hidden drum by listening to the sound! The closer you get, the louder it becomes. Can you find it before time runs out?</p>
                                <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
                                    <span className="text-sm text-gray-500">Difficulty: Medium</span>
                                    <span className="inline-flex items-center text-yellow-500 font-bold group-hover:translate-x-1 transition-transform text-base">
                                        Play Now <span className="ml-2">→</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </a>

                    {/* Game 2: Sequencer */}
                    <div
                        className="block group cursor-pointer h-full"
                        onClick={() => navigate('/sequencer')}
                    >
                        <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-none rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-2xl hover:border-cyan-400 relative h-full flex flex-col">
                             <div className="absolute top-0 right-0 bg-cyan-500 text-black font-bold px-3 py-1 rounded-bl-lg text-sm uppercase tracking-wider z-10">
                                Live
                            </div>
                            <div className="h-56 bg-gradient-to-br from-cyan-900 to-blue-900 flex flex-col items-center justify-center group-hover:from-cyan-800 group-hover:to-blue-800 transition-colors shrink-0">
                                <span className="text-8xl mb-2 group-hover:scale-110 transition-transform duration-300">🎛️</span>
                            </div>
                            <div className="p-8 flex flex-col flex-grow">
                                <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-cyan-300 transition-colors">Interactive Music Lab</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow text-base">Build drum loops, play colorful piano notes, and control BPM and volumes in real time.</p>
                                <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
                                     <span className="text-sm text-gray-500">Difficulty: Creative</span>
                                    <span className="inline-flex items-center text-cyan-400 font-bold group-hover:translate-x-1 transition-transform text-base">
                                        Play Now <span className="ml-2">→</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default Game;
