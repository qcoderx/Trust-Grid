// components/Footer.jsx
const Footer = () => {
    return (
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} TrustGrid for Developers. All rights reserved.
            </div>
            
            {/* Links */}
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                Documentation
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                API Reference
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                Support
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;