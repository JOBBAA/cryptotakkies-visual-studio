'use client';

import { useState } from 'react';
import { Layers, Mic, Presentation as IconPresentation, FileText, Quote, Image as ImageIcon, Download, CheckCircle } from 'lucide-react';
import GeneratorForm from './GeneratorForm';

const GENERATOR_TYPES = [
    { id: 'carousel', name: 'LinkedIn Carousel', icon: Layers },
    { id: 'podcast', name: 'Podcast Thumbnail', icon: Mic },
    { id: 'presentation', name: 'Presentatie', icon: IconPresentation },
    { id: 'article', name: 'Artikel / Blog OG', icon: FileText },
    { id: 'quote', name: 'Social Quote', icon: Quote },
] as const;

type GeneratorType = typeof GENERATOR_TYPES[number]['id'];

// Resolution to aspect ratio mapping for preview
const ASPECT_RATIOS: Record<string, string> = {
    '1080x1080': 'aspect-square',
    '1280x720': 'aspect-video',
    '1080x1440': 'aspect-[3/4]',
    '2000x800': 'aspect-[5/2]',
};

export default function GeneratorPanel() {
    const [activeTab, setActiveTab] = useState<GeneratorType>('carousel');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResults, setGeneratedResults] = useState<string[]>([]);
    const [currentResolution, setCurrentResolution] = useState('1080x1080');
    const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);

    const handleGenerate = async (formData: any) => {
        setIsGenerating(true);
        setGeneratedResults([]);
        setCurrentResolution(formData.resolution || '1080x1080');

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

    // Download a single image
    const handleDownload = async (dataUrl: string, index: number) => {
        setDownloadingIndex(index);
        try {
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const typeName = activeTab;
            const timestamp = new Date().toISOString().slice(0, 10);
            a.download = `cryptotakkies-${typeName}-${timestamp}-${index + 1}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
        }
        setTimeout(() => setDownloadingIndex(null), 1500);
    };

    // Download all images
    const handleDownloadAll = async () => {
        for (let i = 0; i < generatedResults.length; i++) {
            await handleDownload(generatedResults[i], i);
            // Small delay between downloads
            await new Promise(r => setTimeout(r, 300));
        }
    };

    const aspectClass = ASPECT_RATIOS[currentResolution] || 'aspect-square';

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
                                    setGeneratedResults([]);
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
                <div className="w-full lg:w-7/12 p-6 lg:p-8 bg-black/40 flex flex-col min-h-[500px]">
                    <div className="w-full flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-ct-light/50 flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" /> Live Preview
                        </h3>
                        {generatedResults.length > 0 && (
                            <button
                                onClick={handleDownloadAll}
                                className="text-xs bg-ct-mint/20 hover:bg-ct-mint/30 transition-colors px-4 py-2 rounded-lg text-ct-mint font-medium border border-ct-mint/30 flex items-center gap-2"
                            >
                                <Download className="h-3.5 w-3.5" />
                                {generatedResults.length === 1 ? 'Download' : `Download alle (${generatedResults.length})`}
                            </button>
                        )}
                    </div>

                    <div className={`
                        border border-white/10 border-dashed rounded-2xl w-full flex-1 flex flex-col items-center justify-center p-6 text-center transition-all bg-black/50
                        ${isGenerating ? 'animate-pulse bg-ct-mint/5 border-ct-mint/30' : ''}
                    `}>
                        {isGenerating ? (
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full border-4 border-ct-mint/20 border-t-ct-mint animate-spin mb-4"></div>
                                <p className="text-ct-mint font-medium animate-pulse">Genereren...</p>
                                <p className="text-xs text-ct-light/40 mt-2 text-balance">AI genereert achtergrond → tekst overlay → vector poppetje (~20-30 sec)</p>
                            </div>
                        ) : generatedResults.length > 0 ? (
                            <div className="w-full flex flex-col items-center gap-6 overflow-y-auto">
                                {generatedResults.map((src, i) => (
                                    <div key={i} className="relative group w-full max-w-lg">
                                        <div className={`relative w-full ${aspectClass} rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black`}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={src} alt={`Generated result ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                                        </div>
                                        {/* Per-image download button */}
                                        <button
                                            onClick={() => handleDownload(src, i)}
                                            className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 backdrop-blur-sm text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-white/10"
                                            title="Download"
                                        >
                                            {downloadingIndex === i ? (
                                                <CheckCircle className="h-4 w-4 text-ct-mint" />
                                            ) : (
                                                <Download className="h-4 w-4" />
                                            )}
                                        </button>
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
