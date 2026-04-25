import { useState, useEffect } from "react";

import logoWhite from "../assets/logo-white.png";
import logoBlack from "../assets/logo-black.png";
import { API_URL } from "../config";

function Header({ className = "text-white" }: { className?: string }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuSpinKey, setMenuSpinKey] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const navigate = (href: string) => {
    if (window.location.pathname === href) return;
    window.history.pushState({}, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
    setCurrentPath(href);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check if user is authenticated
    fetch(`${API_URL}/api/check-auth`)
      .then((res) => res.json())
      .then((data) => {
        if (data.isAuthenticated) {
          setIsAdmin(true);
        }
      })
      .catch(() => {
        // Silently fail if not authenticated or server down
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      // Redirect to home and reload to clear state
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header 
      className={`sticky top-0 z-[100] md:relative md:z-auto font-sans transition-all duration-300 border-b ${
        scrolled 
          ? className.includes("text-slate-9") || className.includes("text-black") 
            ? "bg-white/95 backdrop-blur-md shadow-sm border-slate-200" 
            : "bg-slate-950/95 backdrop-blur-md shadow-md border-white/10"
          : className.includes("text-slate-9") || className.includes("text-black")
            ? "bg-transparent border-slate-200"
            : "bg-transparent border-white/10"
      } ${className}`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <button
          type="button"
          className="shrink-0 transition-opacity hover:opacity-80 flex items-center justify-center bg-transparent border-none p-0 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img 
            src={className.includes("text-slate-9") || className.includes("text-black") ? logoBlack : logoWhite} 
            alt="Logo" 
            className="h-10 sm:h-14 w-auto object-contain bg-transparent" 
          />
        </button>

        <button
          type="button"
          className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-current bg-transparent opacity-80 transition hover:opacity-100"
          onClick={() => {
            setIsMenuOpen((value) => !value);
            setMenuSpinKey((value) => value + 1);
          }}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Toggle navigation</span>
          <span key={menuSpinKey} className="flex flex-col gap-1.5 animate-[spin_700ms_ease-in-out]">
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
          </span>
        </button>

        <nav
          className={`absolute left-0 top-full z-50 w-full px-4 pt-3 md:static md:w-auto md:px-0 md:pt-0 md:pointer-events-auto ${isMenuOpen ? "pointer-events-auto opacity-100 translate-y-0 scale-100 max-h-[80vh]" : "pointer-events-none opacity-0 -translate-y-4 scale-95 max-h-0 md:opacity-100 md:translate-y-0 md:scale-100 md:max-h-none"} transform origin-top transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:transition-none`}
        >
          <div className="rounded-3xl border border-white/10 bg-slate-950/95 text-white p-4 shadow-2xl backdrop-blur-xl md:border-0 md:bg-transparent md:text-inherit md:p-0 md:shadow-none">
            <ul className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8 lg:gap-10 xl:gap-12">
              {[
                { name: "Home", href: "/" },
                { name: "My Projects", href: "/projects" },
                { name: "My Music", href: "/music" },
                { name: "Game", href: "/game" },
                { name: "Contact", href: "/contact" },
                { name: "About", href: "/about" }
              ].map((item) => {
                const isActive = currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href));
                return (
                  <li key={item.name} className="relative group">
                    <a
                      href={item.href}
                      className={`block px-3 py-2 text-sm sm:text-base transition-colors hover:text-yellow-400 md:px-0 md:py-0 ${isActive ? "text-yellow-400" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(item.href);
                      }}
                    >
                      {item.name}
                    </a>
                    <span className="absolute left-3 -bottom-1 h-0.5 w-0 bg-yellow-400 transition-all duration-300 ease-out group-hover:w-[calc(100%-1.5rem)] md:left-0 md:-bottom-2 md:group-hover:w-full"></span>
                  </li>
                );
              })}

              {isAdmin && (
                <>
                  <li className="relative group">
                    <a 
                      href="/admin-panel" 
                      className="flex items-center gap-2 px-3 py-2 text-sm sm:text-base transition-colors hover:text-yellow-400 md:px-0 md:py-0"
                      title="Admin Panel"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="3" x2="9" y2="21"></line>
                      </svg>
                      <span>Admin Panel</span>
                    </a>
                  </li>
                  
                  <li className="relative group">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 text-sm sm:text-base transition-colors hover:text-red-400 cursor-pointer md:px-0 md:py-0"
                      title="Logout"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;