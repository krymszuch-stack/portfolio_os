import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, AlignLeft, Users, Trash2, Plus, 
  HelpCircle, RefreshCw, X, Check, CalendarDays, ChevronLeft, ChevronRight,
  Sparkles, Video
} from 'lucide-react';
import { initAuth, googleSignIn, logout, getAccessToken } from '../lib/googleAuth';
import { User } from 'firebase/auth';

export const AppCalendar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Calendar Events and Navigation State
  const [events, setFiles] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  
  // Date Picker and mini-calendar view state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  
  // Event form state
  const [eventForm, setEventForm] = useState({
    summary: '',
    location: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '12:00',
    endDate: new Date().toISOString().split('T')[0],
    endTime: '13:00',
    attendeeEmail: ''
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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

  // Fetch calendar events
  useEffect(() => {
    if (token) {
      fetchEvents();
    }
  }, [token]);

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
      setErrorMsg('Nie udało się połączyć z Kalendarzem Google. Spróbuj ponownie.');
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
      setSelectedEvent(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async () => {
    if (!token) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // Fetch events from today onwards
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const timeMin = now.toISOString();

      const queryParams = new URLSearchParams({
        orderBy: 'startTime',
        singleEvents: 'true',
        timeMin: timeMin,
        maxResults: '25'
      });

      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }

      const data = await response.json();
      if (data && data.items) {
        setFiles(data.items);
      }
    } catch (err: any) {
      console.error('Calendar fetch error:', err);
      setErrorMsg('Wystąpił problem z wczytaniem wydarzeń z Twojego kalendarza.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!eventForm.summary.trim()) {
      setErrorMsg('Tytuł wydarzenia jest wymagany.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const startIso = `${eventForm.startDate}T${eventForm.startTime}:00`;
      const endIso = `${eventForm.endDate}T${eventForm.endTime}:00`;

      // Check date validity
      if (new Date(startIso) >= new Date(endIso)) {
        setErrorMsg('Czas zakończenia wydarzenia musi być po czasie rozpoczęcia.');
        setIsLoading(false);
        return;
      }

      const eventBody: any = {
        summary: eventForm.summary,
        location: eventForm.location,
        description: eventForm.description,
        start: {
          dateTime: startIso,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: endIso,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      if (eventForm.attendeeEmail.trim()) {
        eventBody.attendees = [{ email: eventForm.attendeeEmail.trim() }];
      }

      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventBody)
      });

      if (!response.ok) {
        throw new Error('Failed to create calendar event');
      }

      setIsAddingEvent(false);
      setEventForm({
        summary: '',
        location: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        startTime: '12:00',
        endDate: new Date().toISOString().split('T')[0],
        endTime: '13:00',
        attendeeEmail: ''
      });
      setSuccessMsg(`Wydarzenie "${eventForm.summary}" zostało dodane!`);
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchEvents();
    } catch (err) {
      console.error(err);
      setErrorMsg('Nie udało się dodać wydarzenia do Twojego Kalendarza Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string, eventSummary: string) => {
    const confirmed = window.confirm(
      `Czy na pewno chcesz usunąć wydarzenie "${eventSummary}" z Kalendarza Google? Ta akcja jest nieodwracalna.`
    );
    if (!confirmed) return;

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      setSelectedEvent(null);
      setSuccessMsg(`Usunięto wydarzenie "${eventSummary}"!`);
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchEvents();
    } catch (err) {
      console.error(err);
      setErrorMsg('Nie udało się usunąć wydarzenia.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for rendering event times legibly
  const formatEventTime = (event: any) => {
    const start = event.start?.dateTime || event.start?.date;
    const end = event.end?.dateTime || event.end?.date;
    if (!start) return '';

    const startDate = new Date(start);
    const endDate = new Date(end);

    const formattedDate = startDate.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    if (event.start?.date) {
      return `${formattedDate} • Cały dzień`;
    }

    const formattedStartTime = startDate.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const formattedEndTime = endDate.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `${formattedDate} • ${formattedStartTime} - ${formattedEndTime}`;
  };

  // Mini Month Picker Helpers
  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const startDayOfWeek = (date: Date) => {
    // 0 = Sunday, 1 = Monday, etc. Adjust so Monday is 0
    let day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day &&
           today.getMonth() === currentMonth.getMonth() &&
           today.getFullYear() === currentMonth.getFullYear();
  };

  const hasEventOnDay = (day: number) => {
    return events.some(event => {
      const start = event.start?.dateTime || event.start?.date;
      if (!start) return false;
      const d = new Date(start);
      return d.getDate() === day &&
             d.getMonth() === currentMonth.getMonth() &&
             d.getFullYear() === currentMonth.getFullYear();
    });
  };

  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const start = event.start?.dateTime || event.start?.date;
      if (!start) return false;
      const d = new Date(start);
      return d.getDate() === day &&
             d.getMonth() === currentMonth.getMonth() &&
             d.getFullYear() === currentMonth.getFullYear();
    });
  };

  const monthNames = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

  // Render sign in
  if (needsAuth) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center select-none bg-slate-950/20 backdrop-blur-md">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6">
          <CalendarDays className="w-8 h-8 text-emerald-400 animate-pulse" />
        </div>
        <h3 className="text-lg font-sans font-bold text-white mb-2">Kalendarz Google - Portfolio OS</h3>
        <p className="text-xs text-white/40 max-w-sm mb-6 leading-relaxed">
          Zintegruj swój Kalendarz Google, aby śledzić spotkania, zaplanowane sprinty, i dodawać nowe wydarzenia bezpośrednio z Twojego interaktywnego pulpitu.
        </p>

        {errorMsg && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400 max-w-xs">
            {errorMsg}
          </div>
        )}

        <button 
          onClick={handleLogin}
          disabled={isLoading}
          className="flex items-center gap-3 bg-white hover:bg-slate-100 text-slate-900 px-5 py-2.5 rounded-xl font-medium text-xs font-sans tracking-wide transition-all shadow-lg shadow-white/5 cursor-pointer disabled:opacity-50"
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

  // Days calculations for grid
  const daysCount = daysInMonth(currentMonth);
  const startDay = startDayOfWeek(currentMonth);
  const blankDays = Array(startDay).fill(null);
  const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);

  return (
    <div className="h-full flex flex-col font-sans select-none overflow-hidden text-sm relative">
      {/* Alert Banners */}
      {successMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500/20 border border-green-500/30 rounded-xl px-4 py-2.5 text-xs text-green-300 flex items-center gap-2 backdrop-blur-md shadow-lg">
          <Check size={14} /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-2.5 text-xs text-red-300 flex items-center gap-2 backdrop-blur-md shadow-lg">
          <HelpCircle size={14} /> {errorMsg}
        </div>
      )}

      {/* Toolbar / Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/10">
        <div className="flex items-center gap-3">
          <CalendarDays className="text-emerald-400" size={18} />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Mój Kalendarz</h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingEvent(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer shadow-md shadow-emerald-600/15"
          >
            <Plus size={14} /> Dodaj Wydarzenie
          </button>

          <button
            onClick={fetchEvents}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Odśwież kalendarz"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={handleLogout}
            className="text-[10px] uppercase font-bold text-rose-400/80 hover:text-rose-400 bg-rose-500/5 hover:bg-rose-500/15 border border-rose-500/10 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Odłącz
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left column: Monthly Grid Planner & Add Form */}
        <div className="w-80 border-r border-white/5 p-4 flex flex-col gap-4 overflow-y-auto bg-black/5">
          
          {/* Month Navigator Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wide">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <div className="flex items-center gap-1">
              <button 
                onClick={handlePrevMonth}
                className="p-1 rounded-lg hover:bg-white/5 text-white/50 hover:text-white cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-1 rounded-lg hover:bg-white/5 text-white/50 hover:text-white cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Mini Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-white/40 pb-2 border-b border-white/5">
            <span>PN</span><span>WT</span><span>ŚR</span><span>CZ</span><span>PT</span><span>SO</span><span>ND</span>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {blankDays.map((_, index) => (
              <div key={`blank-${index}`} className="h-7" />
            ))}
            {daysArray.map(day => {
              const hasEvents = hasEventOnDay(day);
              const dayEvents = getEventsForDay(day);
              
              return (
                <button
                  key={`day-${day}`}
                  onClick={() => {
                    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                    setSelectedDay(selected);
                    if (dayEvents.length > 0) {
                      setSelectedEvent(dayEvents[0]);
                    }
                  }}
                  className={`h-7 rounded-lg text-xs flex flex-col items-center justify-center relative cursor-pointer transition-all ${
                    isToday(day) 
                      ? 'bg-emerald-500 text-slate-950 font-bold' 
                      : selectedDay && selectedDay.getDate() === day && selectedDay.getMonth() === currentMonth.getMonth()
                        ? 'bg-white/10 text-white font-semibold border border-white/10'
                        : 'text-white hover:bg-white/5'
                  }`}
                >
                  <span>{day}</span>
                  {hasEvents && !isToday(day) && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Day Agenda Status */}
          {selectedDay && (
            <div className="mt-2 bg-white/5 border border-white/5 rounded-xl p-3">
              <h5 className="text-xs font-bold text-white mb-1">
                Plan na {selectedDay.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}
              </h5>
              {getEventsForDay(selectedDay.getDate()).length === 0 ? (
                <p className="text-[10px] text-white/40">Brak zaplanowanych wydarzeń.</p>
              ) : (
                <div className="space-y-1.5 mt-2">
                  {getEventsForDay(selectedDay.getDate()).map((ev, idx) => (
                    <div 
                      key={ev.id || idx}
                      onClick={() => setSelectedEvent(ev)}
                      className="p-1.5 rounded bg-black/20 hover:bg-black/40 border-l-2 border-emerald-500 cursor-pointer text-[10px] text-white truncate"
                    >
                      {ev.summary}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center column: Events Feed / Add Event Form */}
        <div className="flex-1 p-5 overflow-y-auto">
          {isAddingEvent ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md max-w-xl mx-auto">
              <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={14} className="text-emerald-400" /> Dodaj Nowe Wydarzenie
                </h4>
                <button 
                  onClick={() => setIsAddingEvent(false)}
                  className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/5 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase mb-1">Tytuł wydarzenia *</label>
                  <input
                    type="text"
                    required
                    placeholder="np. Daily Standup, Code Review"
                    value={eventForm.summary}
                    onChange={(e) => setEventForm(prev => ({ ...prev, summary: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/25 outline-none focus:border-emerald-500/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-white/40 uppercase mb-1">Data rozpoczęcia</label>
                    <input
                      type="date"
                      required
                      value={eventForm.startDate}
                      onChange={(e) => setEventForm(prev => ({ ...prev, startDate: e.target.value, endDate: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/40 uppercase mb-1">Godzina rozpoczęcia</label>
                    <input
                      type="time"
                      required
                      value={eventForm.startTime}
                      onChange={(e) => setEventForm(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-white/40 uppercase mb-1">Data zakończenia</label>
                    <input
                      type="date"
                      required
                      value={eventForm.endDate}
                      onChange={(e) => setEventForm(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/40 uppercase mb-1">Godzina zakończenia</label>
                    <input
                      type="time"
                      required
                      value={eventForm.endTime}
                      onChange={(e) => setEventForm(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase mb-1">Lokalizacja / Link do spotkania</label>
                  <input
                    type="text"
                    placeholder="np. Google Meet, Biuro, Warszawa"
                    value={eventForm.location}
                    onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/25 outline-none focus:border-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase mb-1">Zaproś uczestnika (Email)</label>
                  <input
                    type="email"
                    placeholder="np. programista@example.com"
                    value={eventForm.attendeeEmail}
                    onChange={(e) => setEventForm(prev => ({ ...prev, attendeeEmail: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/25 outline-none focus:border-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase mb-1">Opis wydarzenia</label>
                  <textarea
                    rows={3}
                    placeholder="Krótki opis lub agenda spotkania..."
                    value={eventForm.description}
                    onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/25 outline-none resize-none focus:border-emerald-500/40"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingEvent(false)}
                    className="bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-md shadow-emerald-600/10"
                  >
                    Dodaj do Kalendarza
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Nadchodzące wydarzenia ({events.length})</h4>
              </div>

              {isLoading && events.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-white/40 text-xs">
                  <RefreshCw className="animate-spin mr-2" size={16} /> Synchronizowanie wydarzeń...
                </div>
              ) : events.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/5 rounded-2xl text-white/30">
                  <Calendar className="text-white/10 mb-3" size={32} />
                  <p className="text-xs font-medium">Brak nadchodzących wydarzeń</p>
                  <p className="text-[10px] text-white/15 mt-1">Użyj przycisku "Dodaj Wydarzenie" u góry, aby dodać pierwsze spotkanie.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {events.map((ev, index) => {
                    const isSelected = selectedEvent?.id === ev.id;
                    return (
                      <div
                        key={ev.id || index}
                        onClick={() => setSelectedEvent(ev)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg'
                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-white truncate">{ev.summary}</h5>
                            <div className="flex items-center gap-1.5 text-[10px] text-white/40 mt-1.5">
                              <Clock size={12} className="text-emerald-400" />
                              <span>{formatEventTime(ev)}</span>
                            </div>
                            {ev.location && (
                              <div className="flex items-center gap-1.5 text-[10px] text-white/40 mt-1">
                                <MapPin size={12} className="text-emerald-400/80" />
                                <span className="truncate">{ev.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column: Event Detailed view */}
        {selectedEvent && (
          <div className="w-80 border-l border-white/5 bg-black/15 p-5 flex flex-col overflow-y-auto backdrop-blur-md">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Wydarzenie szczegóły</h4>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white leading-snug">{selectedEvent.summary}</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-white/40 mt-2">
                  <Clock size={13} className="text-emerald-400" />
                  <span>{formatEventTime(selectedEvent)}</span>
                </div>
              </div>

              {selectedEvent.location && (
                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-1.5">
                    <MapPin size={13} className="text-emerald-400" /> Lokalizacja
                  </div>
                  <p className="text-[11px] text-white/60 break-all leading-tight">
                    {selectedEvent.location}
                  </p>
                  {selectedEvent.location.startsWith('http') && (
                    <a
                      href={selectedEvent.location}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase transition-colors"
                    >
                      <Video size={10} /> Dołącz do spotkania
                    </a>
                  )}
                </div>
              )}

              {selectedEvent.description && (
                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-1.5">
                    <AlignLeft size={13} className="text-emerald-400" /> Opis spotkania
                  </div>
                  <p className="text-[11px] text-white/60 break-words leading-relaxed whitespace-pre-wrap">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-2">
                    <Users size={13} className="text-emerald-400" /> Uczestnicy ({selectedEvent.attendees.length})
                  </div>
                  <div className="space-y-1.5">
                    {selectedEvent.attendees.map((attendee: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-[10px]">
                        <span className="text-white/60 truncate max-w-[150px]" title={attendee.email}>
                          {attendee.email}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                          attendee.responseStatus === 'accepted' 
                            ? 'bg-green-500/10 text-green-400' 
                            : attendee.responseStatus === 'declined'
                              ? 'bg-rose-500/10 text-rose-400'
                              : 'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {attendee.responseStatus || 'brak odpowiedzi'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto pt-4 border-t border-white/5">
              <button
                onClick={() => handleDeleteEvent(selectedEvent.id, selectedEvent.summary)}
                className="flex items-center justify-center gap-1.5 w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 font-bold py-2 rounded-lg text-xs text-center transition-all cursor-pointer"
              >
                <Trash2 size={12} /> Usuń Wydarzenie
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
