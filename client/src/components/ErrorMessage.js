import React from 'react';
import { AlertCircle, RefreshCw, RotateCcw } from 'lucide-react';

const ErrorMessage = ({ message, onRetry, onReset }) => {
  return (
    <div className="card border-red-200 bg-red-50">
      <div className="text-center py-8">
        {/* Icône d'erreur */}
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        {/* Message d'erreur */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-red-900">
            Erreur lors de l'analyse
          </h3>
          
          <p className="text-red-700 max-w-md mx-auto">
            {message}
          </p>

          {/* Actions */}
          <div className="flex justify-center space-x-4 mt-6">
            {onRetry && (
              <button
                onClick={onRetry}
                className="btn btn-primary flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Réessayer</span>
              </button>
            )}
            
            {onReset && (
              <button
                onClick={onReset}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Nouveau fichier</span>
              </button>
            )}
          </div>

          {/* Conseils de dépannage */}
          <div className="mt-6 p-4 bg-white rounded-lg border border-red-200 max-w-md mx-auto">
            <h4 className="font-medium text-gray-900 mb-2">Conseils de dépannage :</h4>
            <ul className="text-sm text-gray-700 space-y-1 text-left">
              <li>• Vérifiez que le fichier est bien un PDF valide</li>
              <li>• Assurez-vous que la taille ne dépasse pas 10MB</li>
              <li>• Vérifiez votre connexion internet</li>
              <li>• Réessayez dans quelques instants</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage; 