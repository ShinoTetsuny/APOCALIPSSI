import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthWrapper from './components/AuthWrapper';
import FileUpload from './components/FileUpload';
import AnalysisResults from './components/AnalysisResults';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { analyzeDocument } from './services/apiService';

// Composant principal de l'application avec authentification
const MainApp = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated, loading: authLoading } = useAuth();

  const handleFileUpload = async (uploadedFile) => {
    setFile(uploadedFile);
    setError(null);
    setAnalysis(null);
    setLoading(true);

    try {
      const result = await analyzeDocument(uploadedFile);
      setAnalysis(result);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'analyse');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysis(null);
    setError(null);
  };

  // Affichage du chargement pendant la vérification de l'authentification
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié, afficher les composants d'authentification
  if (!isAuthenticated()) {
    return <AuthWrapper />;
  }

  // Application principale pour les utilisateurs authentifiés
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          {/* Section d'upload */}
          <div className="animate-fade-in">
            <FileUpload 
              onFileUpload={handleFileUpload}
              disabled={loading}
              file={file}
            />
          </div>

          {/* Section de chargement */}
          {loading && (
            <div className="animate-fade-in">
              <LoadingSpinner />
            </div>
          )}

          {/* Section d'erreur */}
          {error && (
            <div className="animate-fade-in">
              <ErrorMessage 
                message={error} 
                onRetry={() => handleFileUpload(file)}
                onReset={handleReset}
              />
            </div>
          )}

          {/* Section des résultats */}
          {analysis && !loading && (
            <div className="animate-fade-in">
              <AnalysisResults 
                analysis={analysis}
                filename={file?.name}
                onReset={handleReset}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>&copy; 2025 Document Analyzer. Analyse intelligente de documents avec IA.</p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App; 