import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">About LoveLogic</h3>
            <p className="text-gray-600">
              Exploring the data behind modern dating to help understand relationship patterns
              and user behaviors in the digital age.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-purple-600">
                  Data Story
                </Link>
              </li>
              <li>
                <Link to="/swipe-game" className="text-gray-600 hover:text-purple-600">
                  Swipe Game
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Info</h3>
            <p className="text-gray-600">
              A Data Visualization Project by Viz212 (COM-480)<br />
              EPFL - Spring 2025
            </p>
            <div className="mt-4 flex space-x-4">
              <a
                href="https://github.com/yourusername/your-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-purple-600"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">
            © 2025 LoveLogic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;