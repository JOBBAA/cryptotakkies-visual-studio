'use client';

import { useState } from 'react';

type FormProps = {
    type: 'carousel' | 'podcast' | 'presentation' | 'article' | 'quote' | 'animated-social';
    onSubmit: (data: any) => void;
    isGenerating: boolean;
};

export default function GeneratorForm({ type, onSubmit, isGenerating }: FormProps) {
    // Shared fields
    const [topic, setTopic] = useState('');
    const [variant, setVariant] = useState('dark');
    const [align, setAlign] = useState<'left' | 'center' | 'right'>('left');
    const [backgroundAI, setBackgroundAI] = useState(false);
    const [resolution, setResolution] = useState('1080x1080');

    // Carousel-specific
    const [slideCount, setSlideCount] = useState(5);

    // Podcast-specific
    const [subtitle, setSubtitle] = useState('');
    const [episodeNumber, setEpisodeNumber] = useState('');

    // Quote-specific
    const [attribution, setAttribution] = useState('');
    const [useHandwriting, setUseHandwriting] = useState(false);

    const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-ct-mint focus:ring-1 focus:ring-ct-mint transition-all";
    const selectClass = "w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ct-mint focus:ring-1 focus:ring-ct-mint transition-all appearance-none";
    const labelClass = "text-sm font-medium text-ct-light/80";

    const renderVariantSelect = () => (
        <div className="space-y-2">
            <label className={labelClass}>Kleurvariant</label>
            <select value={variant} onChange={(e) => setVariant(e.target.value)} className={selectClass}>
                <option value="dark">Dark (Donkergroen)</option>
                <option value="light">Light (Lichtgroen)</option>
                <option value="accent">Accent (Mintgroen)</option>
            </select>
        </div>
    );

    const renderAlignSelect = () => (
        <div className="space-y-2">
            <label className={labelClass}>Uitlijning</label>
            <select value={align} onChange={(e) => setAlign(e.target.value as any)} className={selectClass}>
                <option value="left">Links</option>
                <option value="center">Midden</option>
                <option value="right">Rechts</option>
            </select>
        </div>
    );

    const renderSizeSelect = () => (
        <div className="space-y-2">
            <label className={labelClass}>Afmeting</label>
            <select value={resolution} onChange={(e) => setResolution(e.target.value)} className={selectClass}>
                <option value="1080x1080">1080 × 1080 (Instagram)</option>
                <option value="1280x720">1280 × 720 (YouTube)</option>
                <option value="1080x1440">1080 × 1440 (Story/Portrait)</option>
                <option value="2000x800">2000 × 800 (Banner)</option>
            </select>
        </div>
    );

    const renderFields = () => {
        switch (type) {
            case 'carousel':
                return (
                    <>
                        <div className="space-y-2">
                            <label className={labelClass}>Onderwerp</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className={inputClass}
                                placeholder="Bijv. 3 lessen van de bullmarkt"
                                required
                            />
                            <p className="text-xs text-white/40">AI genereert automatisch slides op basis van dit onderwerp.</p>
                        </div>

                        <div className="space-y-2">
                            <label className={labelClass}>Aantal slides</label>
                            <input
                                type="number"
                                min={3}
                                max={10}
                                value={slideCount}
                                onChange={(e) => setSlideCount(Number(e.target.value))}
                                className={inputClass}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {renderVariantSelect()}
                            {renderAlignSelect()}
                        </div>
                    </>
                );

            case 'podcast':
                return (
                    <>
                        <div className="space-y-2">
                            <label className={labelClass}>Podcast Titel</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className={inputClass}
                                placeholder="Bijv. Stablecoins & Banken"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className={labelClass}>Ondertitel / Quote</label>
                            <input
                                type="text"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                className={inputClass}
                                placeholder="Bijv. ING en Europa bouwen het geld van de toekomst"
                            />
                            <p className="text-xs text-white/40">Wordt als quote onder de titel getoond op een witte strip.</p>
                        </div>

                        <div className="space-y-2">
                            <label className={labelClass}>Aflevering #</label>
                            <input
                                type="number"
                                value={episodeNumber}
                                onChange={(e) => setEpisodeNumber(e.target.value)}
                                className={inputClass}
                                placeholder="55"
                                min={1}
                            />
                        </div>

                        <div className="mt-1 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                            <p className="text-xs text-yellow-400/80">
                                Podcast thumbnails worden gegenereerd in de standaard Cryptotakkies stijl (geel/zwart). Beide formaten (1080×1080 + 1280×720) worden automatisch aangemaakt.
                            </p>
                        </div>
                    </>
                );

            case 'quote':
                return (
                    <>
                        <div className="space-y-2">
                            <label className={labelClass}>Onderwerp</label>
                            <textarea
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className={`${inputClass} min-h-[100px] resize-none`}
                                placeholder="Bijv. Waarom decentralisatie belangrijk is"
                                required
                            />
                            <p className="text-xs text-white/40">AI genereert een pakkende quote op basis van dit onderwerp.</p>
                        </div>

                        <div className="space-y-2">
                            <label className={labelClass}>Attributie (optioneel)</label>
                            <input
                                type="text"
                                value={attribution}
                                onChange={(e) => setAttribution(e.target.value)}
                                className={inputClass}
                                placeholder="Bijv. Satoshi Nakamoto"
                            />
                        </div>

                        {renderSizeSelect()}

                        <div className="grid grid-cols-2 gap-4">
                            {renderVariantSelect()}
                            {renderAlignSelect()}
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer group mt-2">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={useHandwriting}
                                    onChange={(e) => setUseHandwriting(e.target.checked)}
                                />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${useHandwriting ? 'bg-ct-mint' : 'bg-white/10 group-hover:bg-white/20'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${useHandwriting ? 'translate-x-4' : ''}`}></div>
                            </div>
                            <span className="text-sm text-ct-light/80">Handwriting font (Gochi Hand)</span>
                        </label>
                    </>
                );

            case 'animated-social':
                return (
                    <>
                        <div className="space-y-2">
                            <label className={labelClass}>Titel Slide</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className={inputClass}
                                placeholder="Bijv. De 3 fases van de markt"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className={labelClass}>Ondertitel Slide</label>
                            <input
                                type="text"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                className={inputClass}
                                placeholder="Bijv. Wat doet smart money?"
                                required
                            />
                        </div>
                        {renderVariantSelect()}
                    </>
                );

            case 'presentation':
            case 'article':
            default:
                return (
                    <>
                        <div className="space-y-2">
                            <label className={labelClass}>Onderwerp</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className={inputClass}
                                placeholder={type === 'presentation' ? "Bijv. Bitcoin als asset class" : "Bijv. De toekomst van DeFi"}
                                required
                            />
                            <p className="text-xs text-white/40">AI genereert automatisch content op basis van dit onderwerp.</p>
                        </div>
                        {renderVariantSelect()}
                    </>
                );
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            type,
            useAI: true,
            topic,
            variant,
            align,
            backgroundAI,
            resolution,
            useHandwriting,
            attribution,
            subtitle,
            episodeNumber,
            slideCount,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 flex flex-col h-full">
            {/* Dynamic Fields per Type */}
            <div className="space-y-4">
                {renderFields()}
            </div>

            {/* Background AI Toggle */}
            <div className="mt-2 pt-4 border-t border-white/5">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={backgroundAI}
                            onChange={() => setBackgroundAI(!backgroundAI)}
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${backgroundAI ? 'bg-indigo-500' : 'bg-white/10 group-hover:bg-white/20'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${backgroundAI ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <div>
                        <span className="text-sm text-ct-light/80 block">AI Achtergrond</span>
                        <span className="text-xs text-ct-light/40 block">Genereer unieke achtergrond (~20 sec)</span>
                    </div>
                </label>
            </div>

            <div className="mt-auto pt-6">
                <button
                    type="submit"
                    disabled={isGenerating || !topic.trim()}
                    className="w-full bg-ct-mint hover:bg-ct-mint-hover text-black font-semibold py-3.5 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Bezig met genereren...
                        </>
                    ) : (
                        'Genereren'
                    )}
                </button>
            </div>
        </form>
    );
}
