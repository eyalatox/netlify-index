'use client';

import Link from "next/link";
import { Linkedin, Twitter, Youtube, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-black font-bold text-sm">OX</span>
              </div>
              <span className="text-xl font-semibold">OXsecurity</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-xs">
              Automatically block risks introduced into the pipeline and ensure the integrity of each workload, all from a single location.
            </p>
            
            {/* Trust Badges */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-400">G2</span>
              </div>
              <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-400">SOC</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/capabilities" className="text-gray-400 hover:text-white transition-colors">Capabilities</Link></li>
              <li><Link href="/use-cases" className="text-gray-400 hover:text-white transition-colors">Use Cases</Link></li>
              <li><Link href="/integrations" className="text-gray-400 hover:text-white transition-colors">Integrations</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/learning-center" className="text-gray-400 hover:text-white transition-colors">Learning Center</Link></li>
              <li><Link href="/documentation" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/changelog" className="text-gray-400 hover:text-white transition-colors">Changelog</Link></li>
              <li><Link href="/webinars" className="text-gray-400 hover:text-white transition-colors">Webinars</Link></li>
              <li><Link href="/ebooks" className="text-gray-400 hover:text-white transition-colors">eBooks</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/leadership" className="text-gray-400 hover:text-white transition-colors">Leadership</Link></li>
              <li><Link href="/newsroom" className="text-gray-400 hover:text-white transition-colors">Newsroom</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/events" className="text-gray-400 hover:text-white transition-colors">Events</Link></li>
              <li><Link href="/community" className="text-gray-400 hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md">
            <h3 className="font-semibold text-white mb-2">Newsletter Signup</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter to get more free tips and news</p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <Link href="/linkedin" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link href="/twitter" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="/youtube" className="text-gray-400 hover:text-white transition-colors">
              <Youtube className="w-5 h-5" />
            </Link>
            <Link href="/instagram" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-gray-400 text-sm">
            Copyright © 2024 OXsecurity. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
