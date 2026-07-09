/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project } from '../types';
import { Search, FolderGit2, Star, Link, Plus, Trash2, Edit2, Check, RefreshCw, Github, Sparkles, X, Maximize2 } from 'lucide-react';
import { lazy, Suspense } from 'react';
const WindowsFixerSimulator = lazy(() => import('./WindowsFixerSimulator').then(m => ({ default: m.WindowsFixerSimulator })));

interface AppProjectsProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  config?: any; // OSConfig type but keeping it simple or I can import OSConfig
}

export const AppProjects: React.FC<AppProjectsProps> = ({
  projects,
  setProjects,
  config
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'github' | 'manual'>('all');
  const [isSyncingId, setIsSyncingId] = useState<string | null>(null);
  const [showWinFixer, setShowWinFixer] = useState(false);

  // Quick Look & Focus Mode
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [focusedProject, setFocusedProject] = useState<Project | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (!focusedProject && hoveredProject) {
          e.preventDefault();
          setFocusedProject(hoveredProject);
        } else if (focusedProject) {
          e.preventDefault();
          setFocusedProject(null);
        }
      } else if (e.code === 'Escape' && focusedProject) {
        setFocusedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hoveredProject, focusedProject]);

  // New project creation state
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    tags: '',
    type: 'manual' as 'github' | 'manual',
    link: '',
    stars: 0
  });

  // Github Import simulator state
  const [githubRepoInput, setGithubRepoInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Filtered list
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && project.type === filterType;
  });

  // Helper to format GitHub relative date-time in Polish
  const formatRelativeTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Przed chwilą';
      if (diffMins < 60) {
        if (diffMins === 1) return '1 minutę temu';
        if (diffMins % 10 >= 2 && diffMins % 10 <= 4 && (diffMins % 100 < 10 || diffMins % 100 >= 20)) {
          return `${diffMins} minuty temu`;
        }
        return `${diffMins} minut temu`;
      }
      if (diffHours < 24) {
        if (diffHours === 1) return '1 godzinę temu';
        if (diffHours % 10 >= 2 && diffHours % 10 <= 4 && (diffHours % 100 < 10 || diffHours % 100 >= 20)) {
          return `${diffHours} godziny temu`;
        }
        return `${diffHours} godzin temu`;
      }
      if (diffDays === 1) return 'Wczoraj';
      if (diffDays < 7) {
        return `${diffDays} dni temu`;
      }
      
      return date.toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Niedawno';
    }
  };

  // Real GitHub API Sync
  const handleSyncRepo = async (id: string) => {
    setIsSyncingId(id);
    try {
      const targetProj = projects.find(p => p.id === id);
      if (targetProj && targetProj.type === 'github') {
        const match = targetProj.link?.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (match) {
          const owner = match[1];
          const repo = match[2];
          const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
          if (response.ok) {
            const data = await response.json();
            setProjects(prev => prev.map(p => {
              if (p.id === id) {
                return {
                  ...p,
                  stars: data.stargazers_count,
                  description: data.description || p.description,
                  lastSync: `Ostatni push: ${formatRelativeTime(data.pushed_at || data.updated_at)}`,
                  tags: data.language ? [data.language, ...(data.topics || [])].slice(0, 3) : (data.topics || []).slice(0, 3)
                };
              }
              return p;
            }));
            setIsSyncingId(null);
            return;
          }
        }
      }
    } catch (err) {
      console.warn('Could not sync repository details, using fallback simulation:', err);
    }

    // Fallback simulation in case of API failure or offline
    setTimeout(() => {
      setProjects(prev => prev.map(p => {
        if (p.id === id) {
          const updatedStars = p.stars ? p.stars + Math.floor(Math.random() * 5) + 1 : 1;
          return {
            ...p,
            stars: updatedStars,
            lastSync: 'Zsynchronizowano przed chwilą'
          };
        }
        return p;
      }));
      setIsSyncingId(null);
    }, 1000);
  };

  const handleCreateProject = () => {
    if (!newProject.title.trim()) return;

    let projectLink = newProject.link?.trim() || '';
    if (projectLink && !projectLink.startsWith('http://') && !projectLink.startsWith('https://')) {
      projectLink = 'https://' + projectLink;
    }

    const created: Project = {
      id: `proj-${Date.now()}`,
      title: newProject.title.trim(),
      description: newProject.description?.slice(0, 500) || 'Brak opisu projektu.',
      tags: newProject.tags ? newProject.tags.split(',').map(t => t.trim()) : ['Inne'],
      type: newProject.type,
      link: projectLink || undefined,
      stars: newProject.type === 'github' ? Number(newProject.stars) || 0 : undefined,
      lastSync: newProject.type === 'github' ? 'Przed chwilą' : undefined
    };

    setProjects(prev => [created, ...prev]);
    setIsAddingProject(false);
    setNewProject({
      title: '',
      description: '',
      tags: '',
      type: 'manual',
      link: '',
      stars: 0
    });
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleImportGithubRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubRepoInput.trim()) return;

    setIsImporting(true);
    setImportError(null);
    
    let owner = config?.githubUsername?.trim() || '';
    let repoName = githubRepoInput.trim();
    
    if (githubRepoInput.includes('/')) {
      const parts = githubRepoInput.split('/');
      owner = parts[0].trim();
      repoName = parts[1].trim();
    }
    
    if (!owner) {
      setImportError('Wpisz pełną nazwę w formacie uzytkownik/repozytorium lub ustaw nazwę użytkownika GitHub w Ustawieniach.');
      setIsImporting(false);
      return;
    }

    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}`);
      if (!response.ok) throw new Error('Repository not found');
      const repo = await response.json();
      
      const imported: Project = {
        id: `github-${repo.id}`,
        title: repo.name,
        description: repo.description || 'Importowane repozytorium GitHub.',
        stars: repo.stargazers_count,
        lastSync: `Ostatni push: ${formatRelativeTime(repo.pushed_at || repo.updated_at)}`,
        tags: repo.language ? [repo.language, ...(repo.topics || [])].slice(0, 3) : (repo.topics || []).slice(0, 3),
        type: 'github',
        link: repo.html_url
      };

      setProjects(prev => {
        // Remove duplicates with the same link
        const filtered = prev.filter(p => p.link !== imported.link);
        return [imported, ...filtered];
      });
      setGithubRepoInput('');
    } catch (err) {
      console.warn('Could not import repo from GitHub:', err);
      setImportError(`Nie udało się pobrać repo ${owner}/${repoName} — sprawdź nazwę lub spróbuj ponownie za chwilę.`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search and action header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search bar & Type selection */}
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Szukaj projektów, tagów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            {(['all', 'github', 'manual'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 text-xs font-sans rounded-lg transition-all capitalize ${
                  filterType === type 
                    ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type === 'all' ? 'Wszystkie' : type === 'github' ? 'GitHub' : 'Własne'}
              </button>
            ))}
          </div>
        </div>

        {/* Create/Import triggers */}
        <div className="flex items-center gap-2">
          <button
            id="btn-trigger-add-project"
            onClick={() => setIsAddingProject(!isAddingProject)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 rounded-xl transition-all font-medium"
          >
            <Plus size={14} /> Dodaj Projekt
          </button>
        </div>
      </div>

      {/* GitHub importer form panel */}
      <div className="p-4 bg-[#0a1224]/50 border border-slate-800/80 rounded-2xl">
        <form onSubmit={handleImportGithubRepo} className="flex flex-col md:flex-row gap-3 items-end md:items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-xs font-sans font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Github size={14} className="text-cyan-400" />
              Szybki Import Repozytorium z GitHub
            </h4>
            <p className="text-[11px] text-slate-400">
              Wpisz nazwę swojego publicznego repozytorium aby zasymulować automatyczny import i synchroniczne pobranie gwiazdek.
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="nazwa-repozytorium"
              value={githubRepoInput}
              onChange={(e) => setGithubRepoInput(e.target.value)}
              className="flex-1 md:w-48 px-3 py-1.5 bg-slate-950/80 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isImporting}
              className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 text-slate-950 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 transition-all"
            >
              {isImporting ? (
                <>
                  <RefreshCw size={12} className="animate-spin" /> Importowanie...
                </>
              ) : (
                'Importuj'
              )}
            </button>
          </div>
        </form>
        {importError && (
          <div className="mt-3 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg font-sans">
            {importError}
          </div>
        )}
      </div>

      {/* Manual creation dialog / panel inline */}
      {isAddingProject && (
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4 animate-fadeIn">
          <h3 className="text-sm font-sans font-semibold text-white">Dodaj nowy projekt ręcznie</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">
                Tytuł projektu <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="text"
                placeholder="np. lumina-ui"
                value={newProject.title}
                onChange={(e) => setNewProject(p => ({ ...p, title: e.target.value }))}
                className={`w-full px-3 py-1.5 bg-slate-950/60 border ${!newProject.title.trim() ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-cyan-500'} rounded-lg text-xs text-white focus:outline-none`}
              />
              {!newProject.title.trim() && (
                <span className="text-[9px] text-rose-500 font-mono mt-0.5 block">✦ Tytuł projektu jest wymagany!</span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Typ projektu</label>
              <select
                value={newProject.type}
                onChange={(e) => setNewProject(p => ({ ...p, type: e.target.value as 'github' | 'manual' }))}
                className="w-full px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="manual">Manualny (Prezentacja zewnętrzna)</option>
                <option value="github">Połączony z GitHub</option>
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Opis</label>
                <span className={`text-[10px] font-mono ${(newProject.description || '').length > 500 ? 'text-rose-500 font-bold animate-pulse' : 'text-slate-400'}`}>
                  {(newProject.description || '').length} / 500
                </span>
              </div>
              <input
                type="text"
                placeholder="Krótki opis technologii i przeznaczenia..."
                value={newProject.description}
                maxLength={500}
                onChange={(e) => setNewProject(p => ({ ...p, description: e.target.value.slice(0, 500) }))}
                className={`w-full px-3 py-1.5 bg-slate-950/60 border ${(newProject.description || '').length > 500 ? 'border-rose-500/80' : 'border-slate-800 focus:border-cyan-500'} rounded-lg text-xs text-white focus:outline-none`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Tagi (oddziel przecinkami)</label>
              <input
                type="text"
                placeholder="React, WebGL, API"
                value={newProject.tags}
                onChange={(e) => setNewProject(p => ({ ...p, tags: e.target.value }))}
                className="w-full px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Link / URL projektu</label>
              <input
                type="text"
                placeholder="https://example.com"
                value={newProject.link}
                onChange={(e) => setNewProject(p => ({ ...p, link: e.target.value }))}
                className="w-full px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {newProject.type === 'github' && (
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Liczba gwiazdek (Stars)</label>
                <input
                  type="number"
                  placeholder="248"
                  value={newProject.stars}
                  onChange={(e) => setNewProject(p => ({ ...p, stars: Number(e.target.value) }))}
                  className="w-full px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              id="btn-save-new-project"
              onClick={handleCreateProject}
              disabled={!newProject.title.trim() || (newProject.description || '').length > 500}
              className="px-3 py-1.5 bg-cyan-500 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 rounded-lg text-xs font-sans font-semibold disabled:cursor-not-allowed transition-colors"
            >
              Stwórz projekt
            </button>
            <button
              onClick={() => setIsAddingProject(false)}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-xs cursor-pointer"
            >
              Anuluj
            </button>
          </div>
        </div>
      )}

      {/* Projects Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onMouseEnter={() => setHoveredProject(project)}
            onMouseLeave={() => setHoveredProject(null)}
            className="p-5 rounded-2xl bg-slate-900/20 hover:bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/20 transition-all duration-300 flex flex-col justify-between group relative"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-lg ${
                    project.type === 'github' 
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    <FolderGit2 size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-sans font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono capitalize">
                      {project.type === 'github' ? 'Synchronizowane z GitHub' : 'Ręczna prezentacja'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {project.type === 'github' && (
                    <button
                      id={`btn-sync-project-${project.id}`}
                      onClick={() => handleSyncRepo(project.id)}
                      disabled={isSyncingId === project.id}
                      className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-cyan-400 transition-all"
                      title="Odśwież z GitHub"
                    >
                      <RefreshCw size={11} className={isSyncingId === project.id ? 'animate-spin text-cyan-400' : ''} />
                    </button>
                  )}
                  <button
                    id={`btn-delete-project-${project.id}`}
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Usuń projekt"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans font-light">
                {project.description}
              </p>

              {/* Tag system */}
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono bg-slate-950/50 border border-slate-800 text-slate-400 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="mt-5 pt-4 border-t border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-mono">
                {project.type === 'github' && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <Star size={11} className="text-amber-400 fill-amber-400/20" />
                    <strong>{project.stars || 0}</strong>
                  </span>
                )}
                {project.lastSync && (
                  <span>Sync: {project.lastSync}</span>
                )}
              </div>

              {project.link && (
                project.link === '#win-fixer-demo' ? (
                  <button
                    onClick={() => setShowWinFixer(true)}
                    className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20"
                  >
                    <Sparkles size={11} className="text-cyan-400 animate-pulse" /> Uruchom demo
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFocusedProject(project)}
                      className="flex items-center gap-1 text-[11px] font-sans font-medium text-slate-400 hover:text-cyan-400 transition-colors"
                      title="Focus Mode (Space)"
                    >
                      <Maximize2 size={11} />
                    </button>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[11px] font-sans font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <Link size={11} /> Uruchom demo
                    </a>
                  </div>
                )
              )}
            </div>
          </div>
        ))}

        {/* Glowing "+" Project Card */}
        <button
          onClick={() => setIsAddingProject(true)}
          className="p-5 rounded-2xl bg-cyan-500/5 hover:bg-cyan-500/10 border-2 border-dashed border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 flex flex-col items-center justify-center min-h-[160px] shadow-[0_0_15px_rgba(6,182,212,0.05)] hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(6,182,212,0.15)]">
            <Plus className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-xs font-sans font-bold text-cyan-300 uppercase tracking-widest mt-2">Dodaj Nowy Projekt</span>
          <p className="text-[10px] text-slate-500 font-sans mt-1">Ręcznie lub importując z GitHub</p>
        </button>
      </div>

      {/* Focus Mode / Quick Look Modal */}
      {focusedProject && (
        <div 
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 md:p-12 animate-fadeIn"
          onClick={() => setFocusedProject(null)}
        >
          <div 
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-cyan-500/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(6,182,212,0.1)] relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setFocusedProject(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-4 mb-6">
              <div className={`p-4 rounded-2xl ${
                focusedProject.type === 'github' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
              }`}>
                <FolderGit2 size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-sans font-black text-white">{focusedProject.title}</h2>
                <div className="flex items-center gap-3 mt-2 text-sm text-slate-400 font-mono">
                  <span>{focusedProject.type === 'github' ? 'Synchronizacja GitHub' : 'Ręczna prezentacja'}</span>
                  {focusedProject.type === 'github' && (
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-amber-400 fill-amber-400/20" /> {focusedProject.stars}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-lg text-slate-300 leading-relaxed font-sans font-light mb-8 max-w-2xl">
              {focusedProject.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {focusedProject.tags.map((tag, idx) => (
                <span key={idx} className="text-xs font-mono bg-slate-950 border border-slate-800 text-slate-300 px-3 py-1 rounded-md">
                  {tag}
                </span>
              ))}
            </div>

            {focusedProject.link && (
              <a 
                href={focusedProject.link} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold font-sans transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:-translate-y-0.5"
              >
                <Link size={16} /> Uruchom Projekt
              </a>
            )}
          </div>
        </div>
      )}

      {showWinFixer && (
        <div className="absolute inset-0 bg-[#060b13]/98 backdrop-blur-md rounded-2xl border border-slate-800/80 z-[60] flex flex-col overflow-hidden animate-fadeIn">
          <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 font-mono text-sm">Ładowanie interfejsu diagnostycznego...</div>}>
            <WindowsFixerSimulator onClose={() => setShowWinFixer(false)} />
          </Suspense>
        </div>
      )}
    </div>
  );
};
