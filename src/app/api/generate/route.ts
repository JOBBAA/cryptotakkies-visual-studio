import { NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import {
    buildPodcastPrompt,
    buildCarouselPrompt,
    buildQuotePrompt,
    buildArticlePrompt,
} from "@/lib/ct-prompts";

/**
 * Cryptotakkies Visual Generator — Compositing Pipeline
 * 
 * Flow:
 * 1. AI (Gemini) generates background/atmosphere image
 * 2. Server composites vector people overlay (real brand PNGs)
 * 3. Server composites text overlay using SVG (real brand font styling)
 * 4. Returns final composed image
 */

// ─── Vector People ─────────────────────────────────────────────
const VECTOR_COUNT = 8;

function getRandomVectorPath(): string {
    const index = Math.floor(Math.random() * VECTOR_COUNT) + 1;
    const paddedIndex = String(index).padStart(2, "0");
    return path.join(process.cwd(), "public", "vectors", `person-${paddedIndex}.png`);
}

// ─── Gemini AI ─────────────────────────────────────────────────
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

// Model cascade
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

// ─── Resolution Parser ─────────────────────────────────────────
function parseResolution(res: string): { width: number; height: number } {
    const [w, h] = res.split("x").map(Number);
    return { width: w || 1080, height: h || 1080 };
}

// ─── Composite: Add Vector Person Overlay ──────────────────────
async function compositeVectorPerson(
    baseBuffer: Buffer,
    targetWidth: number,
    targetHeight: number
): Promise<Buffer> {
    const vectorPath = getRandomVectorPath();

    if (!fs.existsSync(vectorPath)) {
        console.warn(`[composite] Vector not found: ${vectorPath}`);
        return baseBuffer;
    }

    // Resize vector person to ~22% of canvas height, preserving aspect ratio
    const personHeight = Math.round(targetHeight * 0.22);
    const personBuffer = await sharp(vectorPath)
        .resize({ height: personHeight, fit: "inside" })
        .png()
        .toBuffer();

    const personMeta = await sharp(personBuffer).metadata();
    const personW = personMeta.width || 150;

    // Position: bottom-right corner with padding
    const padding = Math.round(targetWidth * 0.04);
    const left = targetWidth - personW - padding;
    const top = targetHeight - personHeight - padding;

    return sharp(baseBuffer)
        .composite([{
            input: personBuffer,
            left: Math.max(0, left),
            top: Math.max(0, top),
            blend: "over",
        }])
        .png()
        .toBuffer();
}

// ─── Composite: Add Text Overlay via SVG ───────────────────────
// Configure fontconfig to find our custom fonts
const fontsConfPath = path.join(process.cwd(), "fonts.conf");
if (fs.existsSync(fontsConfPath)) {
    process.env.FONTCONFIG_FILE = fontsConfPath;
}

async function compositeQuoteText(
    baseBuffer: Buffer,
    quoteText: string,
    attribution: string | undefined,
    targetWidth: number,
    targetHeight: number,
): Promise<Buffer> {

    // Calculate font sizes relative to canvas
    const quoteFontSize = Math.round(targetWidth * 0.048);
    const attrFontSize = Math.round(targetWidth * 0.022);
    const quoteMarkSize = Math.round(targetWidth * 0.18);
    const padding = Math.round(targetWidth * 0.08);
    const maxTextWidth = targetWidth - (padding * 2);

    // Word-wrap the quote text
    const words = quoteText.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    const charsPerLine = Math.floor(maxTextWidth / (quoteFontSize * 0.48));

    for (const word of words) {
        if ((currentLine + " " + word).length > charsPerLine && currentLine) {
            lines.push(currentLine.trim());
            currentLine = word;
        } else {
            currentLine += (currentLine ? " " : "") + word;
        }
    }
    if (currentLine) lines.push(currentLine.trim());

    // Build SVG text lines
    const lineHeight = quoteFontSize * 1.3;
    const totalTextHeight = lines.length * lineHeight;
    const textStartY = (targetHeight - totalTextHeight) / 2 + quoteFontSize;

    const escapeXml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    // Font family — fontconfig should resolve 'ABCFavorit-Ultra' from fonts.conf
    // Falls back to Impact (available on most systems) which has similar condensed black look
    const brandFontFamily = "'ABCFavorit-Ultra', 'Impact', 'Arial Black', sans-serif";

    const textLines = lines.map((line, i) =>
        `<text x="${targetWidth / 2}" y="${textStartY + (i * lineHeight)}" 
            text-anchor="middle" 
            font-family="${brandFontFamily}" 
            font-weight="900" 
            font-size="${quoteFontSize}" 
            fill="white" 
            letter-spacing="-0.5"
        >${escapeXml(line.toLowerCase())}</text>`
    ).join("\n");

    // Attribution line
    const attrLine = attribution ?
        `<text x="${targetWidth / 2}" y="${textStartY + (lines.length * lineHeight) + attrFontSize * 2.5}" 
            text-anchor="middle" 
            font-family="'Helvetica', 'Arial', sans-serif" 
            font-weight="400" 
            font-size="${attrFontSize}" 
            fill="rgba(255,255,255,0.55)" 
            letter-spacing="2"
        >— ${escapeXml(attribution).toUpperCase()}</text>` : "";

    // Decorative quote mark
    const quoteMark = `<text x="${padding * 0.7}" y="${textStartY - lineHeight * 0.3}" 
        font-family="Georgia, 'Times New Roman', serif" 
        font-size="${quoteMarkSize}" 
        fill="#2ECC71" 
        opacity="0.3"
    >"</text>`;

    // Subtle brand name at top
    const logoText = `<text x="${padding}" y="${padding * 0.7}" 
        font-family="${brandFontFamily}" 
        font-weight="900" 
        font-size="14" 
        fill="rgba(255,255,255,0.2)" 
        letter-spacing="3"
    >cryptotakkies</text>`;

    const svgOverlay = Buffer.from(`<svg width="${targetWidth}" height="${targetHeight}" xmlns="http://www.w3.org/2000/svg">
${quoteMark}
${textLines}
${attrLine}
${logoText}
</svg>`);

    return sharp(baseBuffer)
        .composite([{
            input: svgOverlay,
            blend: "over",
        }])
        .png()
        .toBuffer();
}

// ─── Main POST Handler ─────────────────────────────────────────
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
                const prompt = buildCarouselPrompt(topic, topic, "", 1, 5);
                const result = await generateImage(apiKey, prompt);
                if (result) {
                    images.push(`data:${result.mimeType};base64,${result.base64}`);
                    models.push(result.model);
                }
                break;
            }

            case "quote": {
                const res = resolution || "1080x1080";
                const { width, height } = parseResolution(res);

                // Step 1: Generate background with AI (no text, no characters)
                const bgPrompt = buildQuotePrompt(topic, attribution, variant, res);
                const bgResult = await generateImage(apiKey, bgPrompt);

                if (bgResult) {
                    // Decode AI base64 to buffer
                    const rawBuffer = Buffer.from(bgResult.base64, "base64");

                    // Resize to exact target dimensions
                    const resizedBuffer = await sharp(rawBuffer)
                        .resize(width, height, { fit: "cover" })
                        .png()
                        .toBuffer();

                    // Step 2: Composite text overlay with brand typography
                    const textBuffer = await compositeQuoteText(resizedBuffer, topic, attribution, width, height);

                    // Step 3: Composite vector person overlay
                    const finalBuffer = await compositeVectorPerson(textBuffer, width, height);

                    const finalBase64 = finalBuffer.toString("base64");
                    images.push(`data:image/png;base64,${finalBase64}`);
                    models.push(bgResult.model);
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
