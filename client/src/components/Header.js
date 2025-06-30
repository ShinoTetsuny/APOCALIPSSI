import React from 'react';
import { FileText, Brain } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary-100 rounded-lg">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PDF Analyzer</h1>
              <p className="text-sm text-gray-600">Analyse intelligente de documents</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="#features" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Fonctionnalités
            </a>
            <a 
              href="#how-it-works" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Comment ça marche
            </a>
            <a 
              href="#contact" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 