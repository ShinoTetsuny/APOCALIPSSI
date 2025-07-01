import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';

const FileUpload = ({ onFileUpload, disabled, file }) => {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      let message = 'Erreur lors de l\'upload du fichier';
      
      if (error.code === 'file-invalid-type') {
        message = 'Seuls les fichiers PDF, Word (.docx) et texte (.txt) sont acceptés';
      } else if (error.code === 'file-too-large') {
        message = 'Le fichier est trop volumineux (max 10MB)';
      }
      
      alert(message);
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
      'text/rtf': ['.rtf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return '📄';
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📕';
      case 'docx':
      case 'doc':
        return '📘';
      case 'txt':
        return '📝';
      case 'rtf':
        return '📄';
      default:
        return '📄';
    }
  };

  return (
    <div className="card">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Analysez votre document
        </h2>
        <p className="text-gray-600">
          Glissez-déposez votre fichier ou cliquez pour le sélectionner
        </p>
      </div>

      {!file ? (
        <div
          {...getRootProps()}
          className={`dropzone ${
            isDragActive ? 'dropzone-active' : ''
          } ${
            isDragReject ? 'dropzone-reject' : ''
          } ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-primary-100 rounded-full">
              <Upload className="h-8 w-8 text-primary-600" />
            </div>
            
            <div className="text-center">
              {isDragActive ? (
                <p className="text-primary-600 font-medium">
                  Déposez le fichier ici...
                </p>
              ) : isDragReject ? (
                <p className="text-red-600 font-medium">
                  Type de fichier non supporté
                </p>
              ) : (
                <>
                  <p className="text-gray-700 font-medium mb-2">
                    Glissez-déposez votre document ici
                  </p>
                  <p className="text-gray-500 text-sm">
                    ou cliquez pour sélectionner un fichier
                  </p>
                </>
              )}
            </div>
            
            <div className="text-xs text-gray-500 text-center">
              <div className="mb-1">Formats supportés :</div>
              <div className="flex flex-wrap justify-center gap-1">
                <span className="bg-gray-100 px-2 py-1 rounded">PDF</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Word (.docx)</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Texte (.txt)</span>
                <span className="bg-gray-100 px-2 py-1 rounded">RTF</span>
              </div>
              <div className="mt-2">Max 10MB</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-green-200 bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="text-xl">{getFileIcon(file.name)}</div>
              </div>
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-600">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onFileUpload(null)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={disabled}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {!disabled && (
            <div className="mt-4 text-center">
              <button
                onClick={() => onFileUpload(file)}
                className="btn btn-primary"
              >
                Analyser le document
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-primary-600 mb-1">📁</div>
          <h3 className="font-medium text-gray-900 mb-1">Upload Document</h3>
          <p className="text-sm text-gray-600">
            PDF, Word, Texte - Glissez-déposez ou sélectionnez
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 mb-1">🤖</div>
          <h3 className="font-medium text-gray-900 mb-1">Analyse IA</h3>
          <p className="text-sm text-gray-600">
            Notre IA analyse et extrait les informations clés
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600 mb-1">📊</div>
          <h3 className="font-medium text-gray-900 mb-1">Résultats</h3>
          <p className="text-sm text-gray-600">
            Obtenez un résumé structuré et des suggestions
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload; 