import logoWhite from "../assets/logo-white.png";

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 mt-24 border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8 lg:gap-12">
          
          {/* Brand Info (takes up more space) */}
          <div className="md:col-span-12 lg:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-6 h-12 flex items-center justify-center md:justify-start">
              <img 
                src={logoWhite} 
                alt="Logo" 
                className="h-full w-auto object-contain" 
              />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-8">
              Crafting digital experiences with passion and precision. 
              Let's connect and build something extraordinary together. 
              A journey of code, design, and music.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/mehradata"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border border-slate-800 hover:bg-yellow-400 hover:border-yellow-400 transition-all duration-300 text-slate-400 hover:text-slate-900"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/mehradata_music/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border border-slate-800 hover:bg-yellow-400 hover:border-yellow-400 transition-all duration-300 text-slate-400 hover:text-slate-900"
                aria-label="Instagram"
                title="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
              </a>
              {/* GitHub */}
              <a 
                href="https://github.com/Mehradat"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border border-slate-800 hover:bg-yellow-400 hover:border-yellow-400 transition-all duration-300 text-slate-400 hover:text-slate-900"
                aria-label="GitHub"
                title="GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
              </a>
              {/* WhatsApp */}
              <a 
                href="https://wa.me/+16479926422"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border border-slate-800 hover:bg-yellow-400 hover:border-yellow-400 transition-all duration-300 text-slate-400 hover:text-slate-900"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M11.999 0C5.372 0 0 5.373 0 12.001c0 2.12.553 4.195 1.597 6L.266 24l6.16-1.61A11.968 11.968 0 0 0 12 24c6.626 0 11.999-5.373 11.999-12S18.625 0 11.999 0zm0 22.002c-1.848 0-3.66-.496-5.253-1.436l-.376-.223-3.905 1.022 1.042-3.805-.245-.39A9.975 9.975 0 0 1 2 12C2 6.486 6.486 2 12 2c5.513 0 9.999 4.486 9.999 10s-4.486 10-9.999 10zm5.494-7.514c-.301-.151-1.782-.882-2.059-.983-.277-.102-.479-.151-.68.151-.202.302-.781.983-.957 1.185-.176.202-.353.227-.654.076a8.163 8.163 0 0 1-2.404-1.488 9.034 9.034 0 0 1-1.664-2.062c-.176-.302-.019-.465.132-.616.136-.135.302-.352.453-.529.151-.176.202-.302.302-.503.1-.202.05-.378-.025-.529-.076-.151-.68-1.637-.932-2.242-.246-.59-.496-.51-.68-.52-.176-.01-.378-.01-.58-.01-.202 0-.529.076-.806.378-.277.302-1.058 1.033-1.058 2.518 0 1.486 1.083 2.922 1.234 3.123.151.202 2.13 3.256 5.161 4.56.721.311 1.284.496 1.724.636.724.23 1.382.197 1.899.119.581-.088 1.782-.729 2.034-1.436.252-.707.252-1.312.176-1.436-.076-.126-.277-.202-.579-.353z"/></svg>
              </a>
              {/* Mail/Gmail */}
              <a 
                href="mailto:mehrad.ata@gmail.com"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border border-slate-800 hover:bg-yellow-400 hover:border-yellow-400 transition-all duration-300 text-slate-400 hover:text-slate-900"
                aria-label="Email"
                title="Email"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </a>
            </div>
          </div>

          {/* Spacer for Desktop */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Quick Links */}
          <div className="md:col-span-6 lg:col-span-3 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="/" className="hover:text-yellow-400 transition-colors">Home</a></li>
              <li><a href="/projects" className="hover:text-yellow-400 transition-colors">Projects</a></li>
              <li><a href="/music" className="hover:text-yellow-400 transition-colors">Music</a></li>
              <li><a href="/game" className="hover:text-yellow-400 transition-colors">Game</a></li>
              <li><a href="/about" className="hover:text-yellow-400 transition-colors">About</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-6 lg:col-span-3 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Get in Touch</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="block text-slate-500 mb-1 pointer-events-none uppercase text-xs font-bold tracking-widest">Email</span>
                <a href="mailto:mehrad.ata@gmail.com" className="hover:text-yellow-400 text-slate-300 transition-colors text-base">
                  mehrad.ata@gmail.com
                </a>
              </li>
              <li>
                <span className="block text-slate-500 mb-1 pointer-events-none uppercase text-xs font-bold tracking-widest">Location</span>
                <span className="text-slate-300 text-base">Oakville, Canada</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 flex flex-col md:flex-row items-center justify-between border-t border-slate-800/80 gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Mehrad Ata. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm text-center md:text-right font-medium">
            Designed & Built by Mehrad
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
