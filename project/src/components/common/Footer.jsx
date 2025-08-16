import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white transition-colors duration-200">
      <div className="container-max section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-500 text-white p-2 rounded-lg">
                <span className="font-bold text-lg">BMB</span>
              </div>
              <span className="font-bold text-xl">BookMyBox</span>
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Your premier destination for booking sports facilities. 
              Find and book the perfect sports box for your game.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-primary-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-primary-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-primary-500 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/boxes" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  Browse Boxes
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Sports */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Sports</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/boxes?sport=cricket" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  Cricket
                </Link>
              </li>
              <li>
                <Link to="/boxes?sport=football" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  Football
                </Link>
              </li>
              <li>
                <Link to="/boxes?sport=tennis" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  Tennis
                </Link>
              </li>
              <li>
                <Link to="/boxes?sport=badminton" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  Badminton
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-primary-500" />
                <span className="text-gray-400 dark:text-gray-500">support@bookmybox.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-primary-500" />
                <span className="text-gray-400 dark:text-gray-500">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-primary-500" />
                <span className="text-gray-400 dark:text-gray-500">Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            © {currentYear} BookMyBox. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer