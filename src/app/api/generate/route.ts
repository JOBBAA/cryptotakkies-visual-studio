import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const {
            type, topic, variant, backgroundAI,
            align, useHandwriting, attribution,
            subtitle, episodeNumber, slideCount
        } = data;

        const projectRoot = path.join(process.cwd(), '..');
        const pythonScript = path.join(projectRoot, 'generate.py');

        // Build the command arguments — AI is always on
        let args = [type];

        if (topic) {
            args.push(`--topic "${topic.replace(/"/g, '\\"')}"`);
            args.push('--ai');
        }

        // Type-specific arguments
        if (type === 'podcast') {
            if (subtitle) args.push(`--subtitle "${subtitle.replace(/"/g, '\\"')}"`);
            if (episodeNumber) args.push(`--episode ${episodeNumber}`);
        } else if (type === 'quote') {
            if (attribution) args.push(`--attribution "${attribution.replace(/"/g, '\\"')}"`);
            if (useHandwriting) args.push('--handwriting');
        } else if (type === 'carousel') {
            if (slideCount && slideCount !== 5) args.push(`--slides ${slideCount}`);
        }

        if (variant && variant !== 'dark') {
            args.push(`--variant ${variant}`);
        }

        if (align && ['left', 'center', 'right'].includes(align)) {
            args.push(`--align ${align}`);
        }

        if (backgroundAI) {
            args.push('--bg-ai');
        }

        args.push('--yes');

        const commandStr = `uv run "${pythonScript}" ${args.join(' ')}`;
        console.log(`Executing: ${commandStr}`);

        try {
            const { stdout, stderr } = await execAsync(commandStr, {
                cwd: projectRoot,
                timeout: 120000, // 2 minute timeout
            });
            console.log('Python output:', stdout);
            if (stderr) console.error('Python stderr:', stderr);

            // Parse output paths from CLI output
            const savedFiles: string[] = [];
            const lines = stdout.split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                // Match lines that end with .png or .jpg (output file paths)
                if (trimmed.match(/\.(png|jpg|jpeg)$/i) && fs.existsSync(trimmed)) {
                    savedFiles.push(trimmed);
                }
                // Also try "Opgeslagen als: ..." format
                if (trimmed.includes('Opgeslagen als:')) {
                    const filePath = trimmed.split('Opgeslagen als:')[1]?.trim();
                    if (filePath && fs.existsSync(filePath)) {
                        savedFiles.push(filePath);
                    }
                }
            }

            // Convert images to base64 for preview
            const images: string[] = [];
            const uniqueFiles = [...new Set(savedFiles)];
            for (const file of uniqueFiles) {
                const buffer = fs.readFileSync(file);
                const base64 = buffer.toString('base64');
                images.push(`data:image/png;base64,${base64}`);
            }

            return NextResponse.json({ success: true, command: commandStr, images });

        } catch (execError: any) {
            console.error("Execution error:", execError);
            return NextResponse.json(
                { success: false, error: 'Generatie mislukt', details: execError.message },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error("API error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
