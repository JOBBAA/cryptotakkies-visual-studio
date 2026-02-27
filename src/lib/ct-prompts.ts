/**
 * Cryptotakkies Visual Generator — AI Prompt Templates
 * 
 * These prompts are sent to Gemini AI to generate brand-consistent visuals.
 * Each type (podcast, carousel, quote, article) has its own style guide.
 */

// ─── Brand Constants ───────────────────────────────────────────
const CT_BRAND = `
BRAND IDENTITY — CRYPTOTAKKIES:
- Brand name: Cryptotakkies
- Tagline: "Nieuwsgierigheid is de beste investering"
- Primary colors: Dark Green (#1B5E3B), Mint Green (#2ECC71), White (#FFFFFF)
- Accent: Light Green (#E8F0EE)
- Typography style: Bold condensed titles, clean body text
- Personality: "De slimme broer die het simpel uitlegt" — educational, streetwise, accessible
- Visual language: Playful doodle arts, hand-drawn accents, bold typography, flat vector character illustrations
- Content topics: Crypto, Bitcoin, blockchain, DeFi, Web3 — explained in simple Dutch

VECTOR CHARACTER STYLE (when including people):
The brand uses flat, modern vector illustrations of diverse young professionals. Style characteristics:
- Flat design with no outlines, using solid color fills
- Characters wear brand colors: dark green (#1B5E3B) and mint green (#2ECC71) clothing
- Clean, minimal faces with warm skin tones
- Characters are depicted doing educational activities: reading books, holding tablets/laptops, writing in notebooks, carrying backpacks
- Style reference: modern corporate illustration, similar to Notion or Slack illustrations but in Cryptotakkies green tones
- Characters should feel approachable, young, and studious — matching the "smart brother" brand personality
`;

// ─── Podcast Thumbnail ─────────────────────────────────────────
export const PODCAST_PROMPT = `Create a podcast thumbnail image in [FORMAT] format ([RESOLUTION]).

${CT_BRAND}

PODCAST THUMBNAIL REQUIREMENTS:
This is for a YouTube/Spotify podcast episode. The thumbnail must include:

1. BACKGROUND: A warm, vibrant yellow gradient background (from #F7E24B center to #FFFDE7 edges), filling the entire canvas edge to edge. Add subtle radial light burst or starburst pattern in slightly darker yellow tones for visual depth.

2. TITLE TEXT: Display the podcast title "[TITLE]" prominently in bold, black, condensed uppercase typography. The title should be the largest text element. For the LAST WORD of each line, place it on a dark (#1A1A1A) highlight box with white text — creating a bold accent effect.

3. SUBTITLE STRIP: Below the title, add a horizontal white strip/banner across the width. On this strip, display the subtitle text "[SUBTITLE]" in dark text, wrapped in curly quotes ("...").

4. EPISODE BADGE: Display a dark square badge (#1A1A1A) with white text showing "#[EPISODE]" — the episode number.

5. LOGO AREA: Leave space in the top-left corner for a logo overlay. Do NOT generate a logo — just leave breathing room there.

6. DECORATIVE ELEMENTS: Scatter subtle starburst/spike doodle shapes in light yellow tones across the background, especially in corners and edges. These should be semi-transparent and decorative, not distracting.

STYLE: Bold, energetic, eye-catching YouTube thumbnail. High contrast black text on yellow. Think: popular Dutch podcast thumbnails with strong typography. The overall mood should be inviting, educational, and energetic.

CRITICAL: The text must be perfectly legible, spelled correctly, and prominently displayed. This is a text-heavy design — the typography IS the design.

Text to display:
- Title: [TITLE]
- Subtitle: [SUBTITLE]  
- Episode: #[EPISODE]

No other text, watermarks, or logos. The Cryptotakkies logo will be added separately.`;

// ─── Carousel Slide ─────────────────────────────────────────────
export const CAROUSEL_PROMPT = `Create a social media carousel slide image in 1:1 format (1080x1080 pixels).

${CT_BRAND}

CAROUSEL SLIDE REQUIREMENTS:
This is slide [SLIDE_NUM] of a LinkedIn/Instagram educational carousel about: [TOPIC]

BACKGROUND: Use a deep dark green (#1B5E3B) background that fills the entire canvas. Add subtle texture or grain for depth.

CONTENT FOR THIS SLIDE:
- Title: "[SLIDE_TITLE]"
- Body text: "[SLIDE_BODY]"

LAYOUT:
- Leave the top 15% clear for a logo overlay (do NOT generate a logo)
- Title in bold white condensed typography, positioned in the upper portion
- Body text in clean white regular font below the title
- Add a subtle slide number indicator: [SLIDE_NUM]/[TOTAL_SLIDES]
- Add subtle decorative doodle elements (hand-drawn arrows, stars, underlines) in mint green (#2ECC71) as accents
- OPTIONAL: If appropriate for the topic, include a small flat vector character illustration in the bottom-right corner. The character should be in the Cryptotakkies style (dark green/mint green clothing, flat design, no outlines) and doing something related to the slide content (e.g. reading, pointing, thinking). The character should be ~20% of the canvas height and not overlap with text.

STYLE: Clean, educational, premium. Think: high-quality LinkedIn carousel from a professional crypto educator. Bold typography, lots of whitespace, easy to read at small sizes.

CRITICAL: All text must be perfectly legible and correctly spelled. Keep it clean and minimal.`;

// ─── Social Quote ───────────────────────────────────────────────
export const QUOTE_PROMPT = `Create a social media quote card in 1:1 format (1080x1080 pixels).

${CT_BRAND}

QUOTE CARD REQUIREMENTS:
Design an inspiring, shareable quote card for Instagram/LinkedIn.

BACKGROUND: [VARIANT_BG]

QUOTE TEXT: Display this quote prominently:
"[QUOTE_TEXT]"

[ATTRIBUTION_LINE]

LAYOUT:
- Large opening quotation mark (") as a decorative element in mint green (#2ECC71), positioned top-left
- Quote text centered, in bold white typography
- Attribution (if present) in smaller, lighter text below the quote
- Leave top area for logo overlay
- Add subtle hand-drawn doodle accents (underlines, stars, arrows) in green tones
- OPTIONAL: Include a small flat vector character silhouette or illustration in one corner. The character should be in Cryptotakkies brand colors (dark green/mint), sitting or standing in a thoughtful/contemplative pose. Keep small (~15% of canvas) and subtle — the quote text is the hero.

STYLE: Clean, inspiring, shareable. The quote should be the hero element. Think: motivational crypto education content for social media.

CRITICAL: The quote text must be perfectly legible and correctly spelled. Typography is the main design element.`;

// ─── Article Thumbnail ──────────────────────────────────────────
export const ARTICLE_PROMPT = `Create a blog article thumbnail in 16:9 format (1200x630 pixels).

${CT_BRAND}

ARTICLE THUMBNAIL REQUIREMENTS:
Design a compelling thumbnail for a blog article about: [TOPIC]

1. SUBJECT: Choose a single powerful visual metaphor that represents the topic. Render it in high-contrast black and white with a halftone dot pattern effect, like a vintage newspaper print.

2. CUTOUT EFFECT: The subject should appear as a physical cutout pasted onto the background, with a thick outline stroke (mint green #2ECC71 or white #FFFFFF) around its contour.

3. BACKGROUND: Deep dark green (#1B5E3B) filling the entire canvas. Add vintage paper grain texture. Scatter small thematic icons or doodles as dark silhouettes in the background.

4. TEXT AREA: Leave the bottom 30% relatively clear for a title overlay. Do NOT include any text — the title will be added separately.

STYLE: Premium editorial illustration. Dark, bold, crypto-native. Think: editorial magazine cover meets crypto education brand.

No text, no letters, no watermarks, no logos in the image.`;

// ─── Variant Backgrounds ────────────────────────────────────────
const VARIANT_BACKGROUNDS: Record<string, string> = {
    dark: "Deep dark green (#1B5E3B) solid fill with subtle grain texture",
    light: "Light green (#E8F0EE) solid fill with subtle grain texture",
    accent: "Mint green (#2ECC71) gradient with subtle grain texture",
};

// ─── Format Configs ─────────────────────────────────────────────
export const FORMATS = {
    podcast_youtube: { id: "16:9", resolution: "1280x720", width: 1280, height: 720 },
    podcast_square: { id: "1:1", resolution: "1080x1080", width: 1080, height: 1080 },
    carousel: { id: "1:1", resolution: "1080x1080", width: 1080, height: 1080 },
    quote: { id: "1:1", resolution: "1080x1080", width: 1080, height: 1080 },
    article: { id: "16:9", resolution: "1200x630", width: 1200, height: 630 },
} as const;

// ─── Prompt Builders ────────────────────────────────────────────

export function buildPodcastPrompt(
    title: string,
    subtitle: string,
    episode: number,
    format: "youtube" | "square" = "youtube"
): string {
    const fmt = format === "youtube" ? FORMATS.podcast_youtube : FORMATS.podcast_square;
    return PODCAST_PROMPT
        .replace("[FORMAT]", fmt.id)
        .replace("[RESOLUTION]", fmt.resolution)
        .replaceAll("[TITLE]", title)
        .replaceAll("[SUBTITLE]", subtitle || "Cryptotakkies Podcast")
        .replaceAll("[EPISODE]", String(episode));
}

export function buildCarouselPrompt(
    topic: string,
    slideTitle: string,
    slideBody: string,
    slideNum: number,
    totalSlides: number
): string {
    return CAROUSEL_PROMPT
        .replace("[TOPIC]", topic)
        .replace("[SLIDE_TITLE]", slideTitle)
        .replace("[SLIDE_BODY]", slideBody)
        .replaceAll("[SLIDE_NUM]", String(slideNum))
        .replace("[TOTAL_SLIDES]", String(totalSlides));
}

export function buildQuotePrompt(
    quoteText: string,
    attribution?: string,
    variant: string = "dark"
): string {
    return QUOTE_PROMPT
        .replace("[QUOTE_TEXT]", quoteText)
        .replace("[VARIANT_BG]", VARIANT_BACKGROUNDS[variant] || VARIANT_BACKGROUNDS.dark)
        .replace("[ATTRIBUTION_LINE]", attribution
            ? `Attribution: "— ${attribution}"`
            : "No attribution needed.");
}

export function buildArticlePrompt(topic: string): string {
    return ARTICLE_PROMPT.replace("[TOPIC]", topic);
}
