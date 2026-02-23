import { NextResponse } from 'next/server';

/**
 * Proxy /api/generate requests to the Python backend on the VPS.
 * 
 * In development: falls back to local `uv run` execution.
 * In production: proxies to GENERATOR_API_URL (VPS).
 */

const GENERATOR_API_URL = process.env.GENERATOR_API_URL;

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // --- Production: proxy to VPS ---
        if (GENERATOR_API_URL) {
            const response = await fetch(`${GENERATOR_API_URL}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error('[proxy] VPS error:', errorBody);
                return NextResponse.json(
                    { success: false, error: 'Generatie mislukt', details: errorBody },
                    { status: 500 }
                );
            }

            const result = await response.json();
            return NextResponse.json(result);
        }

        // --- Development: local Python execution ---
        const { exec } = await import('child_process');
        const { promisify } = await import('util');
        const path = await import('path');
        const fs = await import('fs');
        const execAsync = promisify(exec);

        const {
            type, topic, variant, backgroundAI,
            align, useHandwriting, attribution,
            subtitle, episodeNumber, slideCount
        } = data;

        const projectRoot = path.join(process.cwd(), '..');
        const pythonScript = path.join(projectRoot, 'generate.py');

        function escapeShellArg(str: string): string {
            return `"${str.replace(/"/g, '\\"')}"`;
        }

        let args: string[] = [type];

        switch (type) {
            case 'podcast':
                if (topic) args.push(`--title ${escapeShellArg(topic)}`);
                if (subtitle) args.push(`--subtitle ${escapeShellArg(subtitle)}`);
                if (episodeNumber) args.push(`--episode ${episodeNumber}`);
                break;
            case 'quote':
                if (topic) {
                    args.push(`--topic ${escapeShellArg(topic)}`);
                    args.push('--ai');
                }
                if (attribution) args.push(`--attribution ${escapeShellArg(attribution)}`);
                if (useHandwriting) args.push('--handwriting');
                if (variant && variant !== 'dark') args.push(`--variant ${variant}`);
                if (align) args.push(`--align ${align}`);
                break;
            case 'carousel':
                if (topic) {
                    args.push(`--topic ${escapeShellArg(topic)}`);
                    args.push('--ai');
                }
                if (slideCount && slideCount !== 5) args.push(`--slides ${slideCount}`);
                if (variant && variant !== 'dark') args.push(`--variant ${variant}`);
                if (align) args.push(`--align ${align}`);
                break;
            default:
                if (topic) {
                    args.push(`--topic ${escapeShellArg(topic)}`);
                    args.push('--ai');
                }
                if (variant && variant !== 'dark') args.push(`--variant ${variant}`);
                break;
        }

        if (backgroundAI) args.push('--bg-ai');
        args.push('--yes');

        const commandStr = `uv run "${pythonScript}" ${args.join(' ')}`;
        console.log(`[generate-local] ${commandStr}`);

        const { stdout, stderr } = await execAsync(commandStr, {
            cwd: projectRoot,
            timeout: 180000,
            env: { ...process.env, PYTHONUNBUFFERED: '1' },
        });

        if (stderr) console.error('[generate-local] stderr:', stderr);

        // Parse output paths
        const savedFiles: string[] = [];
        for (const line of stdout.split('\n')) {
            const trimmed = line.trim();
            if (trimmed.match(/\.(png|jpg|jpeg)$/i) && fs.existsSync(trimmed)) {
                savedFiles.push(trimmed);
            }
        }

        // Convert to base64
        const images: string[] = [];
        const uniqueFiles = [...new Set(savedFiles)];
        for (const file of uniqueFiles) {
            const buffer = fs.readFileSync(file);
            const base64 = buffer.toString('base64');
            images.push(`data:image/png;base64,${base64}`);
        }

        return NextResponse.json({
            success: true,
            images,
            paths: uniqueFiles,
            filesGenerated: uniqueFiles.length,
        });

    } catch (error: any) {
        console.error('[generate] Error:', error);
        return NextResponse.json(
            { success: false, error: 'Generatie mislukt', details: error.message },
            { status: 500 }
        );
    }
}
