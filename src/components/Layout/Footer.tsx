import React from 'react';
import { Package, Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">CrossWise</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">Everything you need to sell globally</h3>
            <p className="text-gray-400 mb-6">Comprehensive tools and features to make cross-border trade simple and efficient.</p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Package className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Product Compliance</h4>
                  <p className="text-gray-400 text-sm">Automated compliance checks and documentation for hassle-free exports.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Duty Estimation</h4>
                  <p className="text-gray-400 text-sm">Accurate duty calculations for multiple destinations.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Document Generation</h4>
                  <p className="text-gray-400 text-sm">One-click export document generation for smooth customs clearance.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/product" className="text-gray-400 hover:text-orange-500 transition-colors">Products</a></li>
              <li><a href="/dashboard" className="text-gray-400 hover:text-orange-500 transition-colors">Dashboard</a></li>
              <li><a href="/documents" className="text-gray-400 hover:text-orange-500 transition-colors">Documents</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Support</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-orange-500" />
                <span className="text-gray-400 text-sm">navneetagrawal471@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-orange-500" />
                <span className="text-gray-400 text-sm">+91 xxxxx xxxxx</span>
              </div>
              <div className="flex space-x-3 mt-4">
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 CrossWise. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;