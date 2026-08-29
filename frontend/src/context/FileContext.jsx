import React, { createContext, useContext, useState } from 'react';

const FileContext = createContext(null);

export function FileProvider({ children }) {
  const [sharedFile, setSharedFile] = useState(null);
  const [fileMetadata, setFileMetadata] = useState(null);

  const setFile = (file) => {
    if (!file) {
      setSharedFile(null);
      setFileMetadata(null);
      return;
    }

    setSharedFile(file);
    setFileMetadata({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      extension: file.name.split('.').pop()?.toLowerCase() || '',
    });
  };

  const clearFile = () => {
    setSharedFile(null);
    setFileMetadata(null);
  };

  return (
    <FileContext.Provider value={{ sharedFile, fileMetadata, setFile, clearFile }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFileContext() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within a FileProvider');
  }
  return context;
}
