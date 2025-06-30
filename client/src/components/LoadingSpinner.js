import React from 'react';
import { Loader2, Brain, FileText } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="card">
      <div className="text-center py-12">
        {/* Animation de chargement */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="h-8 w-8 text-primary-600 animate-pulse-slow" />
            </div>
          </div>
        </div>

        {/* Texte de chargement */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Analyse en cours...
          </h3>
          
          <p className="text-gray-600 max-w-md mx-auto">
            Notre IA analyse votre document PDF. Cela peut prendre quelques instants.
          </p>

          {/* Étapes du processus */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm text-gray-600">Upload</span>
              </div>
              
              <div className="w-8 h-1 bg-gray-300"></div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center animate-pulse">
                  <Loader2 className="h-4 w-4 text-primary-600 animate-spin" />
                </div>
                <span className="text-sm font-medium text-primary-600">Analyse</span>
              </div>
              
              <div className="w-8 h-1 bg-gray-300"></div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Brain className="h-4 w-4 text-gray-400" />
                </div>
                <span className="text-sm text-gray-400">Résultats</span>
              </div>
            </div>
          </div>

          {/* Conseils */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-blue-700">
              💡 <strong>Conseil:</strong> Plus le document est long, plus l'analyse prendra de temps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 