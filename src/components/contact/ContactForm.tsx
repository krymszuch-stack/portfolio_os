import React, { useState } from 'react';
import { Send, Check } from 'lucide-react';

interface ContactFormProps {
  onSubmit: (formData: { name: string; email: string; subject: string; message: string }) => void;
  isSending: boolean;
  isSent: boolean;
  onResetSent: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, isSending, isSent, onResetSent }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    onSubmit(formData);
    // Note: We don't clear form data here immediately because the parent might need it,
    // or we might want to keep it if there's an error. 
    // If it's successful, parent will eventually re-render or we can clear it.
    // Actually, AppContact was clearing it on success, we will move clearing to parent 
    // or expose a ref, but passing a callback is easier.
  };

  // We can clear local state when isSent becomes true, but effect might be better.
  React.useEffect(() => {
    if (isSent) {
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  }, [isSent]);

  if (isSent) {
    return (
      <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4 animate-fadeIn">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
          <Check size={24} />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-sans font-bold text-white">Wiadomość wysłana pomyślnie!</h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
            Dziękuję za kontakt. Wiadomość została dostarczona pomyślnie przy użyciu wybranego protokołu wysyłki. Odpiszę na podany adres e-mail tak szybko, jak to możliwe.
          </p>
        </div>
        <button
          onClick={onResetSent}
          className="px-4 py-1.5 backdrop-blur-md bg-slate-900/60 text-xs font-sans font-medium text-slate-200 border border-white/10 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Wyślij kolejną wiadomość
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="contact-name" className="block text-[10px] text-slate-400 uppercase font-mono tracking-wider">Twoje imię / nazwa firmy</label>
          <input
            id="contact-name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
            placeholder="np. Jan Kowalski"
            className="w-full px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="contact-email" className="block text-[10px] text-slate-400 uppercase font-mono tracking-wider">Adres e-mail *</label>
          <input
            id="contact-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
            placeholder="np. jan@domena.com"
            className="w-full px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="contact-subject" className="block text-[10px] text-slate-400 uppercase font-mono tracking-wider">Temat wiadomości</label>
        <input
          id="contact-subject"
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData(f => ({ ...f, subject: e.target.value }))}
          placeholder="np. Zapytanie o projekt strony portfolio"
          className="w-full px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="contact-message" className="block text-[10px] text-slate-400 uppercase font-mono tracking-wider">Treść wiadomości *</label>
        <textarea
          id="contact-message"
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData(f => ({ ...f, message: e.target.value }))}
          placeholder="Napisz krótko nad jakim projektem pracujesz i czego potrzebujesz..."
          className="w-full px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={isSending}
        className="w-full py-2.5 px-4 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-sans font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/10 transition-all cursor-pointer"
      >
        {isSending ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            Wysyłanie bezpiecznego pakietu pocztowego...
          </>
        ) : (
          <>
            <Send size={13} /> Wyślij Wiadomość
          </>
        )}
      </button>
    </form>
  );
};
