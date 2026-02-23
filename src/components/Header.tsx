import Link from "next/link";
import { Layers } from "lucide-react";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-ct-black/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <Layers className="h-6 w-6 text-ct-mint" />
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-heading text-xl font-bold tracking-tight text-white">
                            Cryptotakkies
                        </span>
                        <span className="rounded-full bg-ct-mint/10 px-2 py-0.5 text-xs font-medium text-ct-mint border border-ct-mint/20">
                            Visual Studio
                        </span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="#generator" className="text-sm font-medium text-ct-light/80 hover:text-ct-mint transition-colors">
                        Generator
                    </Link>
                </nav>
            </div>
        </header>
    );
}
