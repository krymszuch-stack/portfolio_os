# Przygotowanie Aplikacji pod Microsoft Entra ID (Azure AD)

Aby integracja z logowaniem Microsoft działała poprawnie we własnej domenie i chmurze Azure, konieczne jest odpowiednie skonfigurowanie aplikacji w **Microsoft Entra ID** (wcześniej znane jako Azure Active Directory).

Poniżej znajdziesz kroki konfiguracji dla Twojego środowiska.

## Krok 1: Rejestracja Aplikacji (App Registration)
1. Zaloguj się do portalu Azure: [https://portal.azure.com](https://portal.azure.com)
2. W pasku wyszukiwania wpisz **Microsoft Entra ID** i wybierz usługę.
3. W menu po lewej stronie kliknij **Rejestracje aplikacji** (App registrations).
4. Kliknij **Nowa rejestracja** (New registration).
5. Podaj nazwę aplikacji, np. `PortfolioOS`.
6. W sekcji **Obsługiwane typy kont** wybierz:
   - *Konta w dowolnym katalogu organizacyjnym i osobiste konta Microsoft (np. Skype, Xbox)* — jeśli aplikacja ma być dostępna dla wszystkich.
   - LUB *Konta tylko w tym katalogu organizacyjnym* (Single-tenant) — jeśli jest to zamknięte środowisko.
7. W sekcji **Identyfikator URI przekierowania (opcjonalnie)**:
   - Z listy rozwijanej platformy wybierz **Aplikacja jednostronicowa (SPA - Single-page application)**.
   - Wpisz swój adres URL produkcyjny: `https://oathcry.com/` (oraz `http://localhost:5173/` dla testów lokalnych).
8. Kliknij **Zarejestruj** (Register).

## Krok 2: Pobranie Identyfikatorów (Client ID i Tenant ID)
Na stronie przeglądu (Overview) właśnie utworzonej aplikacji znajdziesz:
- **Identyfikator aplikacji (klienta)** / Application (client) ID -> Ten ciąg znaków to Twój `VITE_MICROSOFT_CLIENT_ID`.
- **Identyfikator katalogu (dzierżawy)** / Directory (tenant) ID -> To Twój `VITE_MICROSOFT_TENANT_ID` (jeśli wybrałeś Single-tenant). Jeśli wybrałeś opcję dla wszystkich, wpisz `common`.

Wprowadź te wartości do pliku `.env.local` na swoim dysku lub do konfiguracji zmiennych środowiskowych u dostawcy hostingu (Azure Static Web Apps).

## Krok 3: Konfiguracja Uprawnień API (API Permissions)
Aplikacja MSAL prosi o zakres uprawnień w pliku `microsoftAuth.ts`: `Mail.Send`, `Calendars.ReadWrite`, `Contacts.ReadWrite`, `User.Read`.
Aby użytkownicy mogli się logować bez błędu *unauthorized_client* lub braku zgody:

1. W menu zarejestrowanej aplikacji (Microsoft Entra ID) wybierz **Uprawnienia interfejsu API** (API permissions).
2. Kliknij **Dodaj uprawnienie** (Add a permission).
3. Wybierz **Microsoft Graph** -> **Uprawnienia delegowane** (Delegated permissions).
4. Wyszukaj i zaznacz następujące uprawnienia:
   - `User.Read`
   - `Mail.Send`
   - `Calendars.ReadWrite`
   - `Contacts.ReadWrite`
5. Kliknij **Dodaj uprawnienia** (Add permissions).
6. Na koniec kliknij przycisk **Udziel zgody administratora dla firmy...** (Grant admin consent for...), aby zapobiec pokazywaniu ostrzeżeń użytkownikom podczas logowania.

## Krok 4: Tokeny i Weryfikacja (Opcjonalnie)
Jeśli używasz spersonalizowanego logowania, upewnij się w zakładce **Uwierzytelnianie** (Authentication), że opcje powiązane z przepływami na przyznawanie niejawne (Implicit grant) dla aplikacji jednostronicowych NIE SĄ zaznaczone, ponieważ biblioteka MSAL v2+ używa nowoczesnego przepływu *PKCE*, który jest bezpieczniejszy i włączony domyślnie dla platformy SPA.

## Konfiguracja Firebase (Zapasowo)
Pamiętaj, że kod używa bezpośrednio `@azure/msal-browser` do uwierzytelniania. Jeśli korzystasz gdzieś w głębi kodu z funkcji powiązanych z Firebase i Microsoftem razem (obecnie zastąpione), upewnij się, że Twoja domena `oathcry.com` jest na liście Authorized Domains w Firebase Console. MSAL działa w pełni niezależnie.
