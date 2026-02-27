'use client';

import { motion } from "framer-motion";
import { ArrowRight, Palette } from "lucide-react";

export default function Hero() {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-ct-gray/50 border border-white/5 py-16 sm:py-20 px-6 sm:px-12 text-center lg:px-16 flex flex-col items-center">
            {/* Background gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-ct-mint/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-ct-green/30 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-ct-mint/30 bg-ct-mint/10 px-4 py-1.5 text-sm font-medium text-ct-mint mb-8"
            >
                <Palette className="h-4 w-4" />
                <span>Cryptotakkies Studio</span>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="max-w-3xl font-heading text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6"
            >
                Maak <span className="text-ct-mint">on-brand visuals</span> in seconden.
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-2xl text-lg leading-8 text-ct-light/70 mb-10"
            >
                Van LinkedIn carousels tot podcast thumbnails en social quotes.
                Genereer strakke Cryptotakkies content met één klik.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <a
                    href="#generator"
                    className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-ct-mint px-8 py-3.5 text-sm font-semibold text-black shadow-sm transition-all hover:bg-ct-mint-hover"
                >
                    Start Genereren
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
            </motion.div>

            {/* Vector person illustration — subtle brand touch */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 0.35, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute bottom-4 right-8 hidden lg:block pointer-events-none"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/vectors/person-writing.png"
                    alt=""
                    className="h-36 w-auto drop-shadow-lg"
                />
            </motion.div>
        </div>
    );
}
