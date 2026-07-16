#!/usr/bin/env bash
# Uruchom z głównego katalogu repo portfolio_os: bash fix_ci_and_sync.sh
set -e

if [ ! -f "package.json" ]; then
  echo "Uruchom ten skrypt z głównego katalogu repozytorium portfolio_os (tam gdzie jest package.json)."
  exit 1
fi

BRANCH="fix/ci-typecheck-and-fake-sync-data"
git checkout -b "$BRANCH"

FILE1="src/components/AppCertificates.tsx"
FILE2="src/components/AppProjects.tsx"

python3 - "$FILE1" <<'PYEOF'
import sys
path = sys.argv[1]
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (
        '<span htmlFor="addCertIssuer" className="text-[10px] text-slate-400 uppercase font-mono">Wystawca</span>\n              <input\n                type="text"\n                placeholder="np. Linux Foundation / Google / Meta"',
        '<label htmlFor="addCertIssuer" className="text-[10px] text-slate-400 uppercase font-mono">Wystawca</label>\n              <input\n                id="addCertIssuer"\n                type="text"\n                placeholder="np. Linux Foundation / Google / Meta"'
    ),
    (
        '<span htmlFor="addCertDescription" className="text-[10px] text-slate-400 uppercase font-mono">Krótki opis</span>',
        '<label htmlFor="addCertDescription" className="text-[10px] text-slate-400 uppercase font-mono">Krótki opis</label>'
    ),
    (
        '<textarea\n                placeholder="Zagadnienia objęte certyfikacją..."',
        '<textarea\n                id="addCertDescription"\n                placeholder="Zagadnienia objęte certyfikacją..."'
    ),
    (
        '<span htmlFor="check-verified" className="text-xs text-slate-300">Zweryfikowany (Sygnowany kryptograficznie)</span>',
        '<label htmlFor="check-verified" className="text-xs text-slate-300">Zweryfikowany (Sygnowany kryptograficznie)</label>'
    ),
]

for old, new in replacements:
    if old not in content:
        print(f"BLAD: nie znaleziono fragmentu w {path}:\n{old[:90]}")
        sys.exit(1)
    content = content.replace(old, new)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"OK: {path} poprawiony (3x span -> label + brakujace id)")
PYEOF

python3 - "$FILE2" <<'PYEOF'
import sys
path = sys.argv[1]
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1) nowy stan syncError, obok isSyncingId
old_state = "  const [isSyncingId, setIsSyncingId] = useState<string | null>(null);"
new_state = old_state + "\n  const [syncError, setSyncError] = useState<string | null>(null);"
if old_state not in content:
    print("BLAD: nie znaleziono deklaracji isSyncingId")
    sys.exit(1)
content = content.replace(old_state, new_state)

# 2) usuniecie zmyslonego fallbacku w handleSyncRepo
old_fallback = """    // Fallback simulation in case of API failure or offline
    setTimeout(() => {
      setProjects(prev => prev.map(p => {
        if (p.id === id) {
          const updatedStars = p.stars ? p.stars + Math.floor(Math.random() * 5) + 1 : 1;
          return {
            ...p,
            stars: updatedStars,
            lastSync: 'Zsynchronizowano przed chwila'
          };
        }
        return p;
      }));
      setIsSyncingId(null);
    }, 1000);"""

# uwzgledniamy tez wersje z polskim znakiem 'chwilą'
old_fallback_pl = old_fallback.replace("chwila", "chwilą")

new_fallback = """    // API failure or offline - show a real error instead of fabricating data
    console.warn(`Nie udalo sie zsynchronizowac repozytorium (id: ${id})`);
    setSyncError('Nie udalo sie odswiezyc danych - sprobuj ponownie za chwile.');
    setIsSyncingId(null);"""

if old_fallback_pl in content:
    content = content.replace(old_fallback_pl, new_fallback)
elif old_fallback in content:
    content = content.replace(old_fallback, new_fallback)
else:
    print("BLAD: nie znaleziono bloku fallback w handleSyncRepo - sprawdz plik recznie.")
    sys.exit(1)

# 3) wyswietlenie syncError w UI, obok importError
old_ui = """        {importError && (
          <div className="mt-3 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg font-sans">
            {importError}
          </div>
        )}"""
new_ui = old_ui + """
        {syncError && (
          <div className="mt-3 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg font-sans">
            {syncError}
          </div>
        )}"""
if old_ui not in content:
    print("BLAD: nie znaleziono bloku importError w JSX")
    sys.exit(1)
content = content.replace(old_ui, new_ui)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"OK: {path} poprawiony (syncError state + naprawiony handleSyncRepo + UI)")
PYEOF

echo ""
echo "Uruchamiam typecheck i lint dla pewnosci..."
npm run typecheck
npm run lint

git add "$FILE1" "$FILE2"
git commit -m "fix: napraw blad typecheck w AppCertificates.tsx (span->label) i usun zmyslone dane w handleSyncRepo"
git push -u origin "$BRANCH"

if command -v gh &> /dev/null; then
  gh pr create \
    --title "Fix: CI typecheck + zmyslone dane w handleSyncRepo" \
    --body "Naprawia 3 bledy typecheck w AppCertificates.tsx (span->label + brakujace id) oraz usuwa fabrykowanie danych (losowe gwiazdki + falszywy czas synchronizacji) przy nieudanej synchronizacji repo w AppProjects.tsx. Dodaje realny komunikat bledu (syncError) zamiast tego." \
    --base main
else
  echo ""
  echo "gh CLI nie jest zainstalowane - otworz PR recznie:"
  echo "  https://github.com/krymszuch-stack/portfolio_os/pull/new/$BRANCH"
fi
