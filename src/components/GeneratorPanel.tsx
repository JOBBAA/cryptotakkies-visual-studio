'use client';

import { useState } from 'react';
import { Layers, Mic, Presentation as IconPresentation, FileText, Quote, Image as ImageIcon } from 'lucide-react';
import GeneratorForm from './GeneratorForm';

const GENERATOR_TYPES = [
    { id: 'carousel', name: 'LinkedIn Carousel', icon: Layers },
    { id: 'podcast', name: 'Podcast Thumbnail', icon: Mic },
    { id: 'presentation', name: 'Presentatie', icon: IconPresentation },
    { id: 'article', name: 'Artikel / Blog OG', icon: FileText },
    { id: 'quote', name: 'Social Quote', icon: Quote },
] as const;

type GeneratorType = typeof GENERATOR_TYPES[number]['id'];

export default function GeneratorPanel() {
    const [activeTab, setActiveTab] = useState<GeneratorType>('carousel');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResults, setGeneratedResults] = useState<string[]>([]);

    const handleGenerate = async (formData: any) => {
        setIsGenerating(true);
        setGeneratedResults([]);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Er ging iets mis tijdens het genereren.');
            }

            if (data.images && data.images.length > 0) {
                setGeneratedResults(data.images);
            } else {
                alert('Genereren was succesvol maar we konden de images niet direct ophalen.');
            }

        } catch (error: any) {
            console.error(error);
            alert(`Fout bij genereren: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto glass-dark rounded-3xl overflow-hidden shadow-2xl border border-white/10">

            {/* Tabs / Header */}
            <div className="border-b border-white/10 bg-black/20 p-4 overflow-x-auto scrollbar-hide">
                <nav className="flex space-x-2 min-w-max">
                    {GENERATOR_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isActive = activeTab === type.id;

                        return (
                            <button
                                key={type.id}
                                onClick={() => {
                                    setActiveTab(type.id);
                                    setGeneratedResults([]); // Clear results on switch
                                }}
                                className={`
                  flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${isActive
                                        ? 'bg-ct-mint text-black shadow-md border border-ct-mint/50'
                                        : 'text-ct-light/70 hover:text-white hover:bg-white/5 border border-transparent'}
                `}
                            >
                                <Icon className={`h-4 w-4 ${isActive ? 'text-black' : 'text-ct-light/50'}`} />
                                {type.name}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
                {/* Left Column: Form */}
                <div className="w-full lg:w-5/12 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-white/10 overflow-y-auto bg-black/20">
                    <div className="mb-6 pb-6 border-b border-white/10">
                        <h2 className="text-2xl font-heading font-bold text-white mb-2">
                            {GENERATOR_TYPES.find(t => t.id === activeTab)?.name}
                        </h2>
                        <p className="text-sm text-ct-light/60">
                            Vul het onderwerp in en genereer direct je visual.
                        </p>
                    </div>

                    <GeneratorForm
                        type={activeTab}
                        onSubmit={handleGenerate}
                        isGenerating={isGenerating}
                    />
                </div>

                {/* Right Column: Preview */}
                <div className="w-full lg:w-7/12 p-6 lg:p-8 bg-black/40 flex flex-col items-center justify-center min-h-[500px]">
                    <div className="w-full flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-ct-light/50 flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" /> Live Preview
                        </h3>
                        {generatedResults.length > 0 && (
                            <button className="text-xs bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-lg text-white font-medium border border-white/10">
                                Download Resultaat
                            </button>
                        )}
                    </div>

                    <div className={`
            border border-white/10 border-dashed rounded-2xl w-full h-full flex flex-col items-center justify-center p-8 text-center transition-all bg-black/50
            ${isGenerating ? 'animate-pulse bg-ct-mint/5 border-ct-mint/30' : ''}
          `}>
                        {isGenerating ? (
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full border-4 border-ct-mint/20 border-t-ct-mint animate-spin mb-4"></div>
                                <p className="text-ct-mint font-medium animate-pulse">Genereren...</p>
                                <p className="text-xs text-ct-light/40 mt-2 text-balance">Content aan het genereren... (wacht 15-30 sec)</p>
                            </div>
                        ) : generatedResults.length > 0 ? (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-4 overflow-y-auto pt-4">
                                {generatedResults.map((src, i) => (
                                    <div key={i} className="relative w-[360px] max-w-full aspect-square rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#111] flex flex-shrink-0 items-center justify-center">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={src} alt={`Generated result ${i + 1}`} className="w-full h-full object-contain" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5">
                                    <IconPresentation className="h-8 w-8 text-white/20" />
                                </div>
                                <p className="text-ct-light/60 font-medium mb-2">Klaar om te creëren</p>
                                <p className="text-xs text-ct-light/40 max-w-xs text-balance">
                                    Vul links je onderwerp in en klik op Genereren — je on-brand visual verschijnt hier binnen enkele seconden.
                                </p>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
