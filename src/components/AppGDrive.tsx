import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, FileText, Image as ImageIcon, File, Trash2, Upload, 
  Plus, Search, ArrowLeft, ExternalLink, Lock, HelpCircle, 
  RefreshCw, FileSpreadsheet, PlaySquare, Eye, X, Check, CloudLightning
} from 'lucide-react';
import { initAuth, googleSignIn, logout, getAccessToken } from '../lib/googleAuth';
import { User } from 'firebase/auth';

export const AppGDrive: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  
  // File lists and navigation state
  const [files, setFiles] = useState<any[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [folderPath, setFolderPath] = useState<Array<{ id: string; name: string }>>([
    { id: 'root', name: 'Mój dysk' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  
  // Forms state
  const [newFolderName, setNewFolderName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // File Upload reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Authenticate on load
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, cachedToken) => {
        setUser(user);
        setToken(cachedToken);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch files whenever currentFolder changes
  useEffect(() => {
    if (token) {
      fetchFiles();
    }
  }, [currentFolder, token]);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg('Nie udało się zalogować przez Google. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
      setFiles([]);
      setSelectedFile(null);
      setFolderPath([{ id: 'root', name: 'Mój dysk' }]);
      setCurrentFolder('root');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFiles = async (search = '') => {
    if (!token) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      let q = `'${currentFolder}' in parents and trashed = false`;
      if (search) {
        q = `name contains '${search}' and trashed = false`;
      }
      
      const queryParams = new URLSearchParams({
        q: q,
        pageSize: '40',
        fields: 'files(id, name, mimeType, size, webViewLink, iconLink, createdTime, thumbnailLink)',
        orderBy: 'folder,name'
      });

      const response = await fetch(`https://www.googleapis.com/drive/v3/files?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch files from Google Drive');
      }

      const data = await response.ok ? await response.json() : null;
      if (data && data.files) {
        setFiles(data.files);
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setErrorMsg('Błąd podczas pobierania plików. Upewnij się, że masz stabilne połączenie.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFiles(searchQuery);
  };

  const handleFolderClick = (folderId: string, folderName: string) => {
    setCurrentFolder(folderId);
    setFolderPath(prev => [...prev, { id: folderId, name: folderName }]);
    setSearchQuery('');
    setSelectedFile(null);
  };

  const handleBreadcrumbClick = (index: number) => {
    const clickedPath = folderPath[index];
    setCurrentFolder(clickedPath.id);
    setFolderPath(folderPath.slice(0, index + 1));
    setSearchQuery('');
    setSelectedFile(null);
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim() || !token) return;
    
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const metadata = {
        name: newFolderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: currentFolder !== 'root' ? [currentFolder] : []
      };

      const response = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metadata)
      });

      if (!response.ok) throw new Error('Failed to create folder');

      setNewFolderName('');
      setIsCreatingFolder(false);
      setSuccessMsg(`Folder "${newFolderName}" został utworzony!`);
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchFiles();
    } catch (err) {
      console.error(err);
      setErrorMsg('Nie udało się utworzyć folderu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    const confirmed = window.confirm(
      `Czy na pewno chcesz usunąć plik "${fileName}" z Google Drive? Ta operacja przeniesie plik do kosza.`
    );
    if (!confirmed) return;

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete file');

      setSelectedFile(null);
      setSuccessMsg(`Usunięto plik "${fileName}"!`);
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchFiles();
    } catch (err) {
      console.error(err);
      setErrorMsg('Nie udało się usunąć pliku.');
    } finally {
      setIsLoading(false);
    }
  };

  // Drag and drop upload handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    if (!token) return;
    setIsUploading(true);
    setErrorMsg(null);
    try {
      const metadata = {
        name: file.name,
        parents: currentFolder !== 'root' ? [currentFolder] : []
      };

      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', file);

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      setSuccessMsg(`Pomyślnie przesłano plik "${file.name}"!`);
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchFiles();
    } catch (err) {
      console.error(err);
      setErrorMsg('Nie udało się przesłać pliku.');
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') {
      return <Folder className="text-yellow-500 fill-yellow-500/10" size={20} />;
    }
    if (mimeType.startsWith('image/')) {
      return <ImageIcon className="text-pink-400" size={20} />;
    }
    if (mimeType.includes('pdf') || mimeType.includes('document')) {
      return <FileText className="text-blue-400" size={20} />;
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
      return <FileSpreadsheet className="text-emerald-400" size={20} />;
    }
    if (mimeType.includes('video') || mimeType.includes('mp4')) {
      return <PlaySquare className="text-purple-400" size={20} />;
    }
    return <File className="text-slate-400" size={20} />;
  };

  const formatBytes = (bytes: string | undefined) => {
    if (!bytes) return 'Folder';
    const b = parseInt(bytes, 10);
    if (b === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return parseFloat((b / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Sign-In Screen (Official Google styling matched to Portfolio OS style)
  if (needsAuth) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center select-none bg-slate-950/20 backdrop-blur-md">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-6">
          <CloudLightning className="w-8 h-8 text-blue-400 animate-pulse" />
        </div>
        <h3 className="text-lg font-sans font-bold text-white mb-2">Google Drive - Portfolio OS</h3>
        <p className="text-xs text-white/40 max-w-sm mb-6 leading-relaxed">
          Połącz się ze swoim dyskiem Google Drive, aby przeglądać i zarządzać plikami bezpośrednio w swoim unikalnym środowisku systemowym.
        </p>
        
        {errorMsg && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400 max-w-xs">
            {errorMsg}
          </div>
        )}

        <button 
          onClick={handleLogin}
          disabled={isLoading}
          className="flex items-center gap-3 bg-white hover:bg-slate-100 text-slate-900 px-5 py-2.5 rounded-xl font-medium text-xs font-sans tracking-wide transition-all shadow-lg shadow-white/5 active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
          </svg>
          {isLoading ? 'Łączenie...' : 'Zaloguj przez Google'}
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col font-sans select-none overflow-hidden text-sm relative">
      {/* Messages Banner */}
      {successMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500/20 border border-green-500/30 rounded-xl px-4 py-2.5 text-xs text-green-300 flex items-center gap-2 backdrop-blur-md shadow-lg shadow-green-500/10">
          <Check size={14} /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-2.5 text-xs text-red-300 flex items-center gap-2 backdrop-blur-md shadow-lg shadow-red-500/10">
          <HelpCircle size={14} /> {errorMsg}
        </div>
      )}

      {/* Explorer Header / Toolbar */}
      <div className="p-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 bg-black/10 select-none">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs overflow-x-auto max-w-full">
          {folderPath.map((folder, index) => (
            <React.Fragment key={folder.id}>
              {index > 0 && <span className="text-white/20">/</span>}
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  index === folderPath.length - 1 
                    ? 'bg-white/10 text-white font-semibold' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Create Folder & Upload Buttons */}
          <button
            onClick={() => setIsCreatingFolder(true)}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer"
          >
            <Plus size={14} /> Nowy Folder
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer shadow-md shadow-blue-600/10"
          >
            <Upload size={14} /> {isUploading ? 'Wysyłanie...' : 'Prześlij plik'}
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={() => fetchFiles()}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Odśwież pliki"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={handleLogout}
            className="text-[10px] uppercase font-bold text-rose-400/80 hover:text-rose-400 bg-rose-500/5 hover:bg-rose-500/15 border border-rose-500/10 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ml-1"
          >
            Odłącz
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Explorer Content & Drop Zone */}
        <div 
          className={`flex-1 p-5 overflow-y-auto relative transition-colors ${
            dragActive ? 'bg-blue-500/10 border-2 border-dashed border-blue-500' : ''
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {/* Quick Search */}
          <form onSubmit={handleSearch} className="mb-4 relative">
            <Search className="absolute left-3 top-2.5 text-white/30" size={16} />
            <input
              type="text"
              placeholder="Szukaj plików w bieżącej lokalizacji..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/5 focus:border-blue-500/40 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-white/20 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  fetchFiles();
                }}
                className="absolute right-3 top-2.5 text-white/30 hover:text-white"
              >
                Clear
              </button>
            )}
          </form>

          {/* Create Folder Overlay Form */}
          {isCreatingFolder && (
            <div className="mb-5 bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md">
              <h4 className="text-xs font-bold text-white mb-2">Utwórz nowy folder</h4>
              <form onSubmit={handleCreateFolder} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nazwa folderu..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/20 outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all cursor-pointer"
                >
                  Stwórz
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingFolder(false)}
                  className="bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all cursor-pointer"
                >
                  Anuluj
                </button>
              </form>
            </div>
          )}

          {/* Files List/Grid */}
          {isLoading && files.length === 0 ? (
            <div className="h-full flex items-center justify-center text-white/40 text-xs">
              <RefreshCw className="animate-spin mr-2" size={16} /> Wczytywanie plików z Twojego Google Drive...
            </div>
          ) : files.length === 0 ? (
            <div className="h-[250px] flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl text-center p-6 text-white/30">
              <Folder size={36} className="text-white/10 mb-3" />
              <p className="text-xs font-medium">Brak plików w tej lokalizacji</p>
              <p className="text-[10px] text-white/15 mt-1">Przeciągnij i upuść pliki tutaj, aby przesłać</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {files.map(file => (
                <div
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  onDoubleClick={() => {
                    if (file.mimeType === 'application/vnd.google-apps.folder') {
                      handleFolderClick(file.id, file.name);
                    } else if (file.webViewLink) {
                      window.open(file.webViewLink, '_blank');
                    }
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center text-center cursor-pointer select-none transition-all ${
                    selectedFile?.id === file.id
                      ? 'bg-blue-500/10 border-blue-500/40 shadow-lg'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 mb-3">
                    {getFileIcon(file.mimeType)}
                  </div>
                  <span className="text-xs font-medium text-white max-w-full truncate mb-1 px-1" title={file.name}>
                    {file.name}
                  </span>
                  <span className="text-[10px] text-white/40">
                    {formatBytes(file.size)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected File Details Panel (Sliding Sidebar) */}
        {selectedFile && (
          <div className="w-72 border-l border-white/5 bg-black/15 p-5 flex flex-col overflow-y-auto backdrop-blur-md">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Szczegóły pliku</h4>
              <button 
                onClick={() => setSelectedFile(null)}
                className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex flex-col items-center text-center p-3 mb-4 rounded-xl bg-white/5">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-white/5 mb-3">
                {getFileIcon(selectedFile.mimeType)}
              </div>
              <h5 className="text-xs font-bold text-white break-all max-w-full leading-tight">
                {selectedFile.name}
              </h5>
              <span className="text-[10px] text-white/40 mt-1">
                {selectedFile.mimeType}
              </span>
            </div>

            <div className="space-y-3 text-xs border-b border-white/5 pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-white/40">Rozmiar:</span>
                <span className="text-white font-medium">{formatBytes(selectedFile.size)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Utworzono:</span>
                <span className="text-white font-medium">
                  {new Date(selectedFile.createdTime).toLocaleDateString('pl-PL')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">ID pliku:</span>
                <span className="text-white font-mono text-[9px] truncate max-w-[120px]" title={selectedFile.id}>
                  {selectedFile.id}
                </span>
              </div>
            </div>

            <div className="mt-auto space-y-2">
              {selectedFile.webViewLink && (
                <a
                  href={selectedFile.webViewLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs text-center transition-all shadow-md shadow-blue-600/10"
                >
                  <ExternalLink size={12} /> Otwórz w Google Drive
                </a>
              )}
              
              <button
                onClick={() => handleDeleteFile(selectedFile.id, selectedFile.name)}
                className="flex items-center justify-center gap-1.5 w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 font-bold py-2 rounded-lg text-xs text-center transition-all cursor-pointer"
              >
                <Trash2 size={12} /> Przenieś do kosza
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
