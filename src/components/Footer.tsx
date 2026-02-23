export default function Footer() {
    return (
        <footer className="w-full border-t border-white/10 bg-ct-black py-8 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col items-center md:items-start">
                    <p className="font-heading text-lg font-bold text-white">Cryptotakkies</p>
                    <p className="text-sm text-ct-light/60">Visual Studio v1.0</p>
                </div>

                <div className="flex items-center gap-4 text-sm text-ct-light/60">
                    <a href="https://cryptotakkies.nl" target="_blank" rel="noopener noreferrer" className="hover:text-ct-mint transition-colors">
                        Website
                    </a>
                    <span>&middot;</span>
                    <a href="https://cryptotakkies.nl/services" target="_blank" rel="noopener noreferrer" className="hover:text-ct-mint transition-colors">
                        Services
                    </a>
                </div>
            </div>
        </footer>
    );
}
