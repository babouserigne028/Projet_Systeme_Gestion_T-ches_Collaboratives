const Footer = () => {
  return (
    <footer
      className="bg-white border-t border-gray-100"
      style={{ fontFamily: "'Baloo 2', cursive" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo et copyright */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg,#D4AF37,#f5d060)",
              }}
            >
              <span className="text-[#171717] font-bold text-xs">✓</span>
            </div>
            <span className="text-sm font-semibold text-[#171717]">
              ESMT <span style={{ color: "#D4AF37" }}>Task Manager</span>
            </span>
            <span className="text-xs text-gray-500">
              © {new Date().getFullYear()}
            </span>
          </div>

          {/* Liens rapides */}
          <div className="flex items-center gap-4 text-xs">
            <a
              href="#"
              className="text-gray-600 hover:text-[#D4AF37] transition-colors"
            >
              Confidentialité
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-[#D4AF37] transition-colors"
            >
              Contact
            </a>
            <span className="text-gray-400">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
