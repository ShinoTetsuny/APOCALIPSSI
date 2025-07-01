import React from 'react';
import { FileText, Brain, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Document Analyzer</h1>
              <p className="text-sm text-gray-600">Analyse intelligente de documents</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Navigation */}
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

            {/* User section */}
            {isAuthenticated() && user && (
              <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-indigo-100 rounded-full">
                    <User className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Bonjour, {user.username}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Déconnexion"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 