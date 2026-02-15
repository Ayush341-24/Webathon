import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHelper = location.pathname === "/helper-dashboard";

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-border z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <span className="font-bold text-xl text-foreground">QuickHelp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isHelper ? (
              <>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  About
                </Link>
                <Link
                  to="/book"
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Book Service
                </Link>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Contact Us
                </Link>
                <Link
                  to="/help"
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Help
                </Link>
                <Link
                  to="/helper-dashboard"
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                >
                  Helper Portal
                </Link>
                {localStorage.getItem("token") ? (
                  <Link
                    to="/profile"
                    className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium"
                  >
                    Profile
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    Login
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/helper-dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/"
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                >
                  User Portal
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border"
          >
            <div className="px-4 py-4 space-y-3">
              {!isHelper ? (
                <>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors font-medium"
                  >
                    About
                  </Link>
                  <Link
                    to="/book"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors font-medium"
                  >
                    Book Service
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors font-medium"
                  >
                    Contact Us
                  </Link>
                  <Link
                    to="/help"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors font-medium"
                  >
                    Help
                  </Link>
                  <Link
                    to="/helper-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                  >
                    Helper Portal
                  </Link>
                  {localStorage.getItem("token") ? (
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors font-medium"
                    >
                      Profile
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      Login
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to="/helper-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                  >
                    User Portal
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
