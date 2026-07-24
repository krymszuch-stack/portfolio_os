import './BentoHub.css';
import React, { useEffect, useRef } from 'react';
import { Project, OSConfig } from '../types';

interface BentoHubProps {
  projects: Project[];
  config: OSConfig;
  openApp: (appId: 'bio' | 'projects' | 'dashboard' | 'certificates' | 'settings' | 'contact' | 'wizard' | 'terminal') => void;
  isOwner: boolean;
}

export const BentoHub: React.FC<BentoHubProps> = ({ projects, config, openApp, isOwner }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const websiteScrollRef = useRef<HTMLDivElement>(null);
  const projectScrollRef = useRef<HTMLDivElement>(null);

  // Split projects into Websites and Projects
  const websiteProjects = projects.filter(p => 
    p.tags.some(t => ['website', 'web', 'frontend', 'app', 'saas', 'crm', 'osiągnięcie', 'osiagniecie'].includes(t.toLowerCase()))
  );
  const otherProjects = projects.filter(p => !websiteProjects.includes(p));

  const displayWebsites = websiteProjects.length > 0 ? websiteProjects : projects.slice(0, Math.ceil(projects.length / 2));
  const displayProjects = otherProjects.length > 0 ? otherProjects : projects.slice(Math.ceil(projects.length / 2));

  // Custom Cursor Tracker
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Hover effect scale
    const interactiveElements = document.querySelectorAll('a, button, .group');
    const handleMouseEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = 'translate(-50%, -50%) scale(2.5)';
        cursorRef.current.style.backgroundColor = 'rgba(176, 198, 255, 0.1)';
        cursorRef.current.style.borderColor = 'rgba(176, 198, 255, 0.5)';
      }
    };
    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorRef.current.style.backgroundColor = 'transparent';
        cursorRef.current.style.borderColor = '#b0c6ff';
      }
    };

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [projects, config]);

  // Horizontal scroll wheel listener for carousels
  useEffect(() => {
    const attachWheelListener = (ref: React.RefObject<HTMLDivElement | null>) => {
      const el = ref.current;
      if (!el) return;

      const handleWheel = (e: WheelEvent) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
        }
      };

      el.addEventListener('wheel', handleWheel, { passive: false });
      return () => el.removeEventListener('wheel', handleWheel);
    };

    const cleanupWebsites = attachWheelListener(websiteScrollRef);
    const cleanupProjects = attachWheelListener(projectScrollRef);

    return () => {
      cleanupWebsites?.();
      cleanupProjects?.();
    };
  }, [projects]);

  // Dynamic values
  const brandName = "Witaj!";
  const fullName = config.fullName || config.ownerName || 'Adrian Koziński';
  const role = config.portfolioRole || config.professionalRole || 'Senior Full Stack Web Developer';
  const locationText = config.address || '26 lat Kraków, Polska';

  // Dynamic tags for CV card
  const cvTags = projects.flatMap(p => p.tags).filter((v, i, a) => a.indexOf(v) === i).slice(0, 5);
  const tagsString = cvTags.length > 0 ? cvTags.join(', ') : 'React, TypeScript, Node.js, Tailwind';

  // Helper to map project tags to Material Symbol icons
  const getProjectIcon = (project: Project): string => {
    const tags = project.tags.map(t => t.toLowerCase());
    if (tags.some(t => ['cloud', 'aws', 'azure', 'serverless', 'api', 'upload'].includes(t))) return 'cloud_upload';
    if (tags.some(t => ['terminal', 'cli', 'library', 'npm', 'backend', 'core', 'code'].includes(t))) return 'terminal';
    if (tags.some(t => ['chat', 'message', 'social', 'forum', 'communication'].includes(t))) return 'chat_bubble';
    if (tags.some(t => ['notification', 'alert', 'push', 'signal', 'realtime'].includes(t))) return 'notifications_active';
    if (tags.some(t => ['database', 'sql', 'postgres', 'mongo'].includes(t))) return 'database';
    if (tags.some(t => ['security', 'auth', 'crypt', 'e2ee'].includes(t))) return 'lock';
    return 'code';
  };

  // Helper to map icon color classes
  const getProjectColorClass = (index: number): string => {
    const colors = ['text-[#b0c6ff]', 'text-[#b6ccc0]', 'text-[#bbcac0]', 'text-[#ffb4ab]'];
    return colors[index % colors.length];
  };

  // Default fallbacks for background images
  const defaultBgImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzoFBTwCVm0P0Asq2rmJLug1PIYXjkHsB89-wIE7VcAXHn6lM_bPTe7a4xmZGVnuIEZnh1jTbfJoe-SwFzTFNFs5EdNE0IwNW07u9XdZ5NiNG8PdyND55fLrjDnd3THShElKCCY7_porYMeC0veqw6dhoP7Zu_C81l8xYsugIS7kAQYr_NYtB_LIETA6igPW-l_aWeb5CLoqWliaX3e5IHwO81qlGrxkNzY-K8Z6E5BT26C7arRGaq';
  const avatarFallback = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHcdVMiRAVgNyfcsdPGU3X5HMsheKu6BDd6YmITx8c10GtXODuYIUUu9xpSVZyY4Fx9ushLG2w87rCZvbJd5Gk2__MK2ofKo81uqxTnfzqoy5fNj6tFguCN5G3iHatKP9a4TA1vv29hkjgNz7EiECj3PI7C9Aea5jwOYfOOXJ4WMsds8CHEFjuC8KbT-JTpXijVq4aXI19FYeq71tiMB4Qx5SM_Ky33VgN_SlLOIMaC68ujVn7Xps_';

  return (
    <>
      {/* Stylesheet injector for Material Symbols */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      
      {/* Dynamic Scoped Styles */}


      <div className="bento-scope text-on-surface pb-32">
        {/* Background Layers */}
        <div className="hero-bg" style={{ backgroundImage: `url('${config.avatarUrl || defaultBgImage}')` }}></div>
        <div className="ambient-glow"></div>

        {/* Top App Bar */}
        <header className="fixed top-0 left-0 right-0 z-40 animate-fade-up">
          <nav className="flex justify-between items-center w-full px-8 py-4 max-w-[1100px] mx-auto">
            <div className="font-semibold text-2xl text-white tracking-tight flex items-center gap-2">
              {brandName}
              {isOwner && (
                <span className="text-[9px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 uppercase tracking-widest font-mono">Właściciel</span>
              )}
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => openApp('bio')} 
                className="font-sans text-sm text-primary border-b-2 border-primary pb-1 transition-all duration-300 cursor-pointer"
              >
                Wizytówka
              </button>
              <a 
                href="#achievements" 
                className="font-sans text-sm text-slate-400 hover:text-white transition-all duration-300"
              >
                Osiągnięcia
              </a>
              <a 
                href="#projects" 
                className="font-sans text-sm text-slate-400 hover:text-white transition-all duration-300"
              >
                Projekty
              </a>
              <button 
                onClick={() => openApp('contact')} 
                className="font-sans text-sm text-slate-400 hover:text-white transition-all duration-300 cursor-pointer"
              >
                Wesprzyj mnie!
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => openApp('contact')} 
                className="hover:bg-white/10 backdrop-blur-sm rounded-lg p-2 transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center"
                title="Napisz do mnie"
              >
                <span className="material-symbols-outlined text-primary text-xl">mail</span>
              </button>
              <button 
                onClick={() => openApp('terminal')} 
                className="hover:bg-white/10 backdrop-blur-sm rounded-lg p-2 transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center"
                title="Uruchom Terminal"
              >
                <span className="material-symbols-outlined text-primary text-xl">code</span>
              </button>
            </div>
          </nav>
        </header>

        {/* Main Content Layout */}
        <main className="min-h-screen flex items-center justify-center pt-28 pb-12 px-4 md:px-8">
          <div className="glass-container w-full max-w-[1100px] rounded-[32px] p-6 md:p-12 overflow-hidden relative shadow-2xl opacity-0 animate-fade-up delay-100">
            
            {/* Grid Layout Header */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              
              {/* Profile Identity Card */}
              <div className="lg:col-span-7 glass-inner rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative group/idcard">
                <div className="relative shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/10 shadow-lg bg-slate-900">
                    <img 
                      className="w-full h-full object-cover" 
                      alt={fullName} 
                      src={config.avatarUrl || avatarFallback} 
                    />
                  </div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-[#0d1a14] active-glow status-pulse"></div>
                </div>
                
                <div className="text-center md:text-left">
                  <h1 className="font-bold text-3xl md:text-5xl text-white mb-2 tracking-tight">{fullName}</h1>
                  <p className="font-semibold text-lg md:text-xl text-primary opacity-90 mb-4">{role}</p>
                  
                  <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span className="font-sans text-sm">{locationText}</span>
                  </div>
                </div>

                {/* Quick Edit Overlay for Identity */}
                {isOwner && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); openApp('settings'); }}
                    className="absolute top-4 right-4 p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/30 text-purple-300 transition-all hover:scale-110 cursor-pointer shadow-lg z-20 flex items-center justify-center"
                    title="Edytuj profil w PortfolioOS"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                )}
              </div>

              {/* Action Cards */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                
                {/* CV Resume Uploader / Viewer Card */}
                <button 
                  onClick={() => {
                    if (config.cvUrl) {
                      window.open(config.cvUrl, '_blank');
                    } else {
                      openApp('bio');
                    }
                  }}
                  className="col-span-2 glass-inner rounded-[24px] p-6 flex items-center gap-4 hover-card-effect transition-all duration-300 group text-left cursor-pointer w-full relative"
                >
                  <div className="bg-blue-500/20 text-blue-400 p-4 rounded-2xl active-glow transition-all duration-300 group-hover:scale-110 shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Przejdź do CV!</h3>
                    <p className="font-mono text-xs text-slate-400 mt-1 line-clamp-1">{tagsString}</p>
                  </div>
                  
                  {isOwner && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); openApp('bio'); }}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-purple-500/25 hover:bg-purple-500/45 border border-purple-500/30 text-purple-300 transition-all cursor-pointer z-20 flex items-center justify-center"
                      title="Edytuj dane CV/Biografię"
                    >
                      <span className="material-symbols-outlined text-[12px]">edit</span>
                    </button>
                  )}
                </button>

                {/* Contact Card */}
                <button 
                  onClick={() => openApp('contact')}
                  className="glass-inner rounded-[24px] p-6 flex items-center gap-4 hover-card-effect transition-all duration-300 group text-left cursor-pointer relative"
                >
                  <div className="bg-primary/20 text-primary p-4 rounded-2xl transition-all duration-300 group-hover:bg-primary/30 shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Postaw kawę</h3>
                    <p className="font-mono text-[10px] text-slate-400 mt-0.5">Wesprzyj mnie</p>
                  </div>

                  {isOwner && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); openApp('contact'); }}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-purple-500/25 hover:bg-purple-500/45 border border-purple-500/30 text-purple-300 transition-all cursor-pointer z-20 flex items-center justify-center"
                      title="Zarządzaj integracją kontaktu"
                    >
                      <span className="material-symbols-outlined text-[11px]">edit</span>
                    </button>
                  )}
                </button>

                {/* System Wizard Creator Card */}
                <button 
                  onClick={() => openApp('wizard')}
                  className="glass-inner rounded-[24px] p-6 flex flex-col items-center justify-center gap-2 hover-card-effect transition-all duration-300 group cursor-pointer text-center relative"
                >
                  <span className="material-symbols-outlined text-primary text-3xl transition-all duration-300 group-hover:rotate-12">language</span>
                  <span className="font-mono text-xs text-white">Kreator OS</span>

                  {isOwner && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); openApp('wizard'); }}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-purple-500/25 hover:bg-purple-500/45 border border-purple-500/30 text-purple-300 transition-all cursor-pointer z-20 flex items-center justify-center"
                      title="Otwórz Kreator AI"
                    >
                      <span className="material-symbols-outlined text-[11px]">edit</span>
                    </button>
                  )}
                </button>

              </div>
            </div>

            {/* Websites Section */}
            <section id="achievements" className="mb-8 opacity-0 animate-fade-up delay-200 relative group/achievements">
              <div className="flex justify-between items-center mb-4 pr-12">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Osiągnięcia</h2>
                  {isOwner && (
                    <button 
                      onClick={() => openApp('projects')}
                      className="p-1 rounded bg-purple-500/10 hover:bg-purple-500/35 border border-purple-500/20 text-purple-400 transition-colors cursor-pointer flex items-center justify-center"
                      title="Zarządzaj osiągnięciami/stronami"
                    >
                      <span className="material-symbols-outlined text-xs">edit</span>
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => openApp('projects')} 
                  className="font-mono text-xs text-primary hover:underline transition-all duration-300 cursor-pointer"
                >
                  Pokaż wszystkie ({projects.length})
                </button>
              </div>
              
              <div 
                ref={websiteScrollRef}
                className="flex overflow-x-auto gap-4 no-scrollbar pb-4 -mx-2 px-2 snap-x"
              >
                {displayWebsites.map(proj => (
                  <div 
                    key={proj.id} 
                    onClick={() => {
                      if (proj.link) window.open(proj.link, '_blank');
                      else openApp('projects');
                    }}
                    className="min-w-[280px] max-w-[280px] group cursor-pointer snap-start"
                  >
                    <div className="glass-inner rounded-xl overflow-hidden aspect-video relative mb-3 hover-card-effect transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end p-4">
                        <span className="text-white text-xs font-semibold translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1">
                          View Live Project <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </span>
                      </div>
                      {/* ⚡ Bolt Performance: Lazy load project thumbnails to improve initial page load and save network bandwidth */}
                      <img 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        alt={proj.title} 
                        src={proj.thumbnail || defaultBgImage}
                        loading="lazy"
                      />
                    </div>
                    <h4 className="font-semibold text-sm text-slate-200 group-hover:text-primary transition-colors duration-300 truncate">
                      {proj.title}
                    </h4>
                  </div>
                ))}

                {displayWebsites.length === 0 && (
                  <div className="text-slate-500 italic py-6 text-sm">Brak projektów osiągnięć.</div>
                )}
              </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="opacity-0 animate-fade-up delay-300 relative group/projects">
              <div className="flex justify-between items-center mb-4 pr-12">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Aktualne projekty</h2>
                  {isOwner && (
                    <button 
                      onClick={() => openApp('projects')}
                      className="p-1 rounded bg-purple-500/10 hover:bg-purple-500/35 border border-purple-500/20 text-purple-400 transition-colors cursor-pointer flex items-center justify-center"
                      title="Zarządzaj projektami"
                    >
                      <span className="material-symbols-outlined text-xs">edit</span>
                    </button>
                  )}
                </div>
              </div>
              
              <div 
                ref={projectScrollRef}
                className="flex overflow-x-auto gap-4 no-scrollbar pb-4 -mx-2 px-2 snap-x"
              >
                {displayProjects.map((proj, idx) => (
                  <div 
                    key={proj.id} 
                    onClick={() => {
                      if (proj.link) window.open(proj.link, '_blank');
                      else openApp('projects');
                    }}
                    className="min-w-[280px] max-w-[280px] group cursor-pointer snap-start"
                  >
                    <div className="glass-inner rounded-xl p-6 h-44 flex flex-col justify-center items-center gap-4 relative overflow-hidden transition-all duration-300 hover-card-effect">
                      <span className={`material-symbols-outlined text-5xl ${getProjectColorClass(idx)} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                        {getProjectIcon(proj)}
                      </span>
                      <div className="text-center w-full">
                        <h4 className="font-bold text-base text-white group-hover:text-primary transition-colors duration-300 truncate">
                          {proj.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 max-w-[240px] mx-auto">
                          {proj.description || 'Brak opisu.'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {displayProjects.length === 0 && (
                  <div className="text-slate-500 italic py-6 text-sm">Brak innych projektów.</div>
                )}
              </div>
            </section>

          </div>
        </main>

        {/* Bottom Social Bar Dock */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
          <nav className="flex items-center gap-3 social-dock px-6 py-3 rounded-[24px] shadow-2xl animate-fade-up">
            {config.githubUsername && (
              <a 
                href={`https://github.com/${config.githubUsername}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(87,140,255,0.4)] shadow-lg group relative cursor-pointer"
                title="GitHub"
              >
                <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-[0_0_8px_rgba(255,255,255,0.8)] group-hover:shadow-[0_0_12px_rgba(87,140,255,0.8)] transition-all">
                  <svg className="w-7 h-7 fill-black" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
              </a>
            )}

            {config.linkedinUsername && (
              <a 
                href={`https://linkedin.com/in/${config.linkedinUsername}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(10,102,194,0.4)] shadow-lg group relative cursor-pointer"
                title="LinkedIn"
              >
                <div className="w-10 h-10 bg-[#0a66c2] rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
              </a>
            )}

            {config.twitterUsername && (
              <a 
                href={`https://x.com/${config.twitterUsername}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] shadow-lg group relative cursor-pointer"
                title="X (Twitter)"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-950 border border-white/10 flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] group-hover:border-[#b0c6ff]/35 group-hover:shadow-[0_0_12px_rgba(176,198,255,0.3)] transition-all">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
              </a>
            )}

            {config.telegramUsername && (
              <a 
                href={`https://t.me/${config.telegramUsername}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(34,139,230,0.4)] shadow-lg group relative cursor-pointer"
                title="Telegram"
              >
                <div className="w-9 h-9 bg-gradient-to-b from-[#33a8e2] to-[#179cde] rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 fill-white mr-0.5 mt-0.5" viewBox="0 0 24 24">
                    <path d="M23.91 2.38a.93.93 0 00-.91-.12L1.08 9.94a.92.92 0 00-.06 1.68l5.57 2.14 2.16 6.84a.93.93 0 001.53.42l3.24-2.88 5.48 4.05c.42.31.99.16 1.22-.32L24.16 3.19a.94.94 0 00-.25-.81zm-7.66 9.87l-7.79-5.11 8.92-5.75c.16-.1.35.14.2.26l-7.68 6.94v2.79c0 .24.17.43.4.45l2.09-1.83 3.86 2.85 2.94-10.46-2.94 10.46z"/>
                  </svg>
                </div>
                <span className="text-[6.5px] text-slate-400 font-mono tracking-widest uppercase mt-0.5 group-hover:text-[#33a8e2] transition-colors leading-none">Telegram</span>
              </a>
            )}

            {config.instagramUsername && (
              <a 
                href={`https://instagram.com/${config.instagramUsername}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(225,48,108,0.4)] shadow-lg group relative cursor-pointer"
                title="Instagram"
              >
                <div className="w-10 h-10 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 fill-none stroke-white stroke-[2.2]" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
              </a>
            )}

            {config.discordId && (
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(88,101,242,0.4)] shadow-lg group relative cursor-pointer"
                title="Discord"
              >
                <div className="w-10 h-10 bg-[#5865f2] rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084-.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
                  </svg>
                </div>
              </a>
            )}

            {config.phone && (
              <a 
                href={`tel:${config.phone}`} 
                className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(76,175,80,0.4)] shadow-lg group relative cursor-pointer"
                title="Call Phone"
              >
                <div className="w-10 h-10 bg-[#4caf50] rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M20 22.622l-3.276-3.276c-.08-.08-.19-.122-.3-.122h-.446c-1.036 0-2.028-.403-2.76-1.135L8.91 13.782c-.732-.732-1.135-1.724-1.135-2.76v-.446c0-.11-.042-.22-.122-.3L4.378 7.002A5.02 5.02 0 0 1 3 3.5c0-2.761 2.239-5 5-5a5.02 5.02 0 0 1 3.5 1.378l3.276 3.276c.08.08.122.19.122.3v.446c0 1.036.403 2.028 1.135 2.76l4.307 4.307c.732.732 1.135 1.724 1.135 2.76v.446c0 .11.042.22.122.3l3.276 3.276A5.02 5.02 0 0 1 23 20.5c0 2.761-2.239 5-5 5a5.02 5.02 0 0 1-3-1.378z"/>
                  </svg>
                </div>
              </a>
            )}
          </nav>

          {/* Quick Edit Overlay for Social Dock */}
          {isOwner && (
            <button 
              onClick={(e) => { e.stopPropagation(); openApp('settings'); }}
              className="p-3.5 rounded-full bg-purple-500/25 hover:bg-purple-500/45 border border-purple-500/30 text-purple-300 transition-all hover:scale-110 cursor-pointer shadow-lg flex items-center justify-center shrink-0"
              title="Edytuj social media"
            >
              <span className="material-symbols-outlined text-sm">settings</span>
            </button>
          )}
        </div>

        {/* Tracking custom cursor effect */}
        <div ref={cursorRef} className="custom-cursor hidden md:block" id="cursor"></div>
      </div>
    </>
  );
};
