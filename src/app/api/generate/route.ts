import { NextResponse } from "next/server";
import {
    buildPodcastPrompt,
    buildCarouselPrompt,
    buildQuotePrompt,
    buildArticlePrompt,
} from "@/lib/ct-prompts";

/**
 * Generate visuals using Gemini AI — runs 100% on Vercel, no Python/VPS needed.
 * Same pattern as Bitcoin Alpha Admin's generate-thumbnail route.
 */

async function generateWithGemini(
    apiKey: string,
    prompt: string,
    model: string = "gemini-2.0-flash-exp"
): Promise<{ base64: string; mimeType: string } | null> {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseModalities: ["IMAGE", "TEXT"],
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[gemini] ${model} error:`, errorText);
            return null;
        }

        const data = await response.json();
        const parts = data.candidates?.[0]?.content?.parts;
        if (parts) {
            for (const part of parts) {
                if (part.inlineData) {
                    return {
                        base64: part.inlineData.data,
                        mimeType: part.inlineData.mimeType || "image/png",
                    };
                }
            }
        }
        return null;
    } catch (e) {
        console.error(`[gemini] ${model} failed:`, e);
        return null;
    }
}

// Model cascade — try newer models first, fall back to older ones
// Model cascade — Nano Banana 2 (gemini-3.1-flash) as primary
const MODELS = [
    "gemini-3.1-flash-image-preview",
    "gemini-3-pro-image-preview",
    "gemini-2.5-flash-image",
];

async function generateImage(apiKey: string, prompt: string): Promise<{ base64: string; mimeType: string; model: string } | null> {
    for (const model of MODELS) {
        const result = await generateWithGemini(apiKey, prompt, model);
        if (result) {
            return { ...result, model };
        }
    }
    return null;
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { type, topic, variant, subtitle, episodeNumber, attribution, resolution } = data;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { success: false, error: "GEMINI_API_KEY is niet geconfigureerd." },
                { status: 500 }
            );
        }

        if (!topic) {
            return NextResponse.json(
                { success: false, error: "Onderwerp/titel is vereist." },
                { status: 400 }
            );
        }

        const images: string[] = [];
        const models: string[] = [];

        switch (type) {
            case "podcast": {
                // Generate both YouTube (16:9) and Square (1:1) formats
                const ep = episodeNumber || 1;
                const sub = subtitle || "Cryptotakkies Podcast";

                for (const format of ["youtube", "square"] as const) {
                    const prompt = buildPodcastPrompt(topic, sub, ep, format);
                    const result = await generateImage(apiKey, prompt);
                    if (result) {
                        images.push(`data:${result.mimeType};base64,${result.base64}`);
                        models.push(result.model);
                    }
                }
                break;
            }

            case "carousel": {
                // For carousel, generate a single hook slide as preview
                const prompt = buildCarouselPrompt(topic, topic, "", 1, 5);
                const result = await generateImage(apiKey, prompt);
                if (result) {
                    images.push(`data:${result.mimeType};base64,${result.base64}`);
                    models.push(result.model);
                }
                break;
            }

            case "quote": {
                const prompt = buildQuotePrompt(topic, attribution, variant, resolution || '1080x1080');
                const result = await generateImage(apiKey, prompt);
                if (result) {
                    images.push(`data:${result.mimeType};base64,${result.base64}`);
                    models.push(result.model);
                }
                break;
            }

            case "article": {
                const prompt = buildArticlePrompt(topic);
                const result = await generateImage(apiKey, prompt);
                if (result) {
                    images.push(`data:${result.mimeType};base64,${result.base64}`);
                    models.push(result.model);
                }
                break;
            }

            default:
                return NextResponse.json(
                    { success: false, error: `Onbekend type: ${type}` },
                    { status: 400 }
                );
        }

        if (images.length === 0) {
            return NextResponse.json(
                { success: false, error: "Geen enkel model kon een afbeelding genereren. Probeer het opnieuw." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            images,
            models,
            filesGenerated: images.length,
        });

    } catch (error: any) {
        console.error("[generate] Error:", error);
        return NextResponse.json(
            { success: false, error: "Generatie mislukt", details: error.message },
            { status: 500 }
        );
    }
}
