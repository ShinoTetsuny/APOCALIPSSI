import React from 'react';
import { FileText, CheckCircle, Lightbulb, RefreshCw, Download } from 'lucide-react';

const AnalysisResults = ({ analysis, filename, onReset }) => {
  const { summary, keyPoints, suggestions, metadata } = analysis;

  // Fonction pour télécharger le résumé
  const downloadSummary = () => {
    const content = `
ANALYSE DU DOCUMENT: ${filename}
==========================================

RÉSUMÉ
------
${summary}

POINTS CLÉS
-----------
${keyPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}

SUGGESTIONS D'ACTIONS
--------------------
${suggestions.map((suggestion, index) => `${index + 1}. ${suggestion}`).join('\n')}

MÉTADONNÉES
-----------
Date d'analyse: ${new Date(metadata?.analysisDate).toLocaleString('fr-FR')}
Taille du texte: ${metadata?.textLength?.toLocaleString()} caractères

Généré le ${new Date().toLocaleString('fr-FR')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analyse-${filename.replace(/\.[^/.]+$/, "")}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* En-tête des résultats */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Analyse terminée
              </h2>
              <p className="text-sm text-gray-600">
                {filename} • {metadata?.textLength?.toLocaleString()} caractères analysés
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={downloadSummary}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Télécharger</span>
            </button>
            
            <button
              onClick={onReset}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Nouvelle analyse</span>
            </button>
          </div>
        </div>
      </div>

      {/* Résumé */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary-100 rounded-lg">
            <FileText className="h-5 w-5 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Résumé</h3>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">
            {summary}
          </p>
        </div>
      </div>

      {/* Points clés */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CheckCircle className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Points clés</h3>
        </div>
        
        <div className="space-y-3">
          {keyPoints.map((point, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-medium text-blue-600">
                  {index + 1}
                </span>
              </div>
              <p className="text-gray-700">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions d'actions */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Suggestions d'actions</h3>
        </div>
        
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-medium text-yellow-600">
                  {index + 1}
                </span>
              </div>
              <p className="text-gray-700">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Métadonnées */}
      {metadata && (
        <div className="card bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Date d'analyse:</span>
              <p>{new Date(metadata.analysisDate).toLocaleString('fr-FR')}</p>
            </div>
            <div>
              <span className="font-medium">Taille du texte:</span>
              <p>{metadata.textLength?.toLocaleString()} caractères</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults; 