'use client';

import { useState } from 'react';
import { Player } from '@remotion/player';
import { MySlide, MySlideProps } from '../../remotion/MySlide';

export default function SlideGenerator() {
    const [theme, setTheme] = useState<MySlideProps['theme']>('dark');
    const [titleText, setTitleText] = useState('De 3 fases van de markt');
    const [subtitleText, setSubtitleText] = useState('Wat doet smart money?');

    return (
        <main className="min-h-screen bg-[#111] p-8 text-white flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-8 text-[#f44106]">Crypto Takkies Slide Generator</h1>

            <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
                {/* Editor Panel */}
                <div className="flex-1 bg-[#222] p-6 rounded-xl border border-white/10 flex flex-col gap-4">
                    <h2 className="text-xl font-bold mb-4">Slide Content</h2>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Theme</label>
                        <select
                            value={theme}
                            onChange={(e) => setTheme(e.target.value as MySlideProps['theme'])}
                            className="w-full bg-[#111] border border-white/20 rounded p-2 text-white"
                        >
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                            <option value="accent">Accent (Orange)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Title</label>
                        <textarea
                            value={titleText}
                            onChange={(e) => setTitleText(e.target.value)}
                            className="w-full bg-[#111] border border-white/20 rounded p-2 text-white h-24"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Subtitle</label>
                        <input
                            value={subtitleText}
                            onChange={(e) => setSubtitleText(e.target.value)}
                            type="text"
                            className="w-full bg-[#111] border border-white/20 rounded p-2 text-white"
                        />
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="flex-1 flex flex-col gap-4 items-center">
                    <div className="bg-[#222] p-4 rounded-xl border border-white/10 shadow-2xl overflow-hidden w-full flex justify-center">
                        <Player
                            component={MySlide}
                            inputProps={{
                                titleText,
                                subtitleText,
                                theme,
                            }}
                            durationInFrames={150}
                            fps={30}
                            compositionWidth={1080}
                            compositionHeight={1080}
                            style={{
                                width: '100%',
                                maxWidth: '500px',
                                aspectRatio: '1/1',
                                borderRadius: '8px'
                            }}
                            controls
                            loop
                            autoPlay
                        />
                    </div>
                    <p className="text-sm text-gray-500">Live Preview: 1080x1080px (1:1 Ratio)</p>
                </div>
            </div>
        </main>
    );
}
