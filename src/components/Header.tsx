import { Waves } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <Waves className="h-6 w-6 text-white" />
        </div>
        
        <nav className="ml-auto flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Twitter
          </a>
        </nav>
      </div>
    </header>
  );
};
