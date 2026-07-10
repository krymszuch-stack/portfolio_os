/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Certificate, TimelineItem, DesktopIcon } from '../types';

export interface SuggestedItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface IndustryCategory {
  id: 'tech' | 'craft' | 'agriculture' | 'gardening' | 'creative' | 'business' | 'general';
  name: string;
  label: string;
  emoji: string;
  keywords: string[];
  suggestedSections: SuggestedItem[];
  questions: {
    id: string;
    question: string;
    placeholder: string;
    type: 'text' | 'textarea' | 'select';
    options?: string[];
  }[];
  // Optional matched sub-profession details dynamically attached on matching
  matchedProfession?: {
    id: string;
    title: string;
    emoji: string;
  };
}

export interface DictionaryProfession {
  id: string;
  title: string;
  categoryId: 'tech' | 'craft' | 'agriculture' | 'gardening' | 'creative' | 'business' | 'general';
  emoji: string;
  requiredAll?: string[]; // All these normalized keywords must be present
  anyOf?: string[];       // At least one of these normalized keywords must be present
  bioTemplate: (name: string, answers: any) => string;
  projects: Project[];
  certificates: Certificate[];
  timeline: TimelineItem[];
}

export const industryCategories: IndustryCategory[] = [
  {
    id: 'tech',
    name: 'Technologia i IT',
    label: 'Programiści, administratorzy, projektanci UX, testerzy',
    emoji: '💻',
    keywords: [
      'programowanie', 'programista', 'developer', 'kod', 'it', 'software', 
      'admin', 'devops', 'web', 'aplikacje', 'technologie', 'frontend', 
      'backend', 'cybersecurity', 'tester', 'bazy danych', 'ai', 'computer',
      'informatyk', 'informatyka', 'fullstack', 'hardware', 'cyber'
    ],
    suggestedSections: [
      { id: 'github', name: 'Repozytorium GitHub', description: 'Automatyczne pobieranie projektów i statystyk z Twoich repozytoriów kodu', enabled: true },
      { id: 'linkedin', name: 'Profil zawodowy LinkedIn', description: 'Profesjonalna sieć kontaktów i historia zatrudnienia', enabled: true },
      { id: 'techStack', name: 'Stos technologiczny (Tech Stack)', description: 'Wizualne tagi i ikony technologii, w których się specjalizujesz', enabled: true },
      { id: 'projects', name: 'Katalog projektów kodowych', description: 'Szczegółowa lista realizowanych projektów technicznych', enabled: true },
      { id: 'timeline', name: 'Historia doświadczenia IT', description: 'Chronologiczna ścieżka Twojej kariery deweloperskiej', enabled: true }
    ],
    questions: [
      { id: 'techStack', question: 'W jakich językach i technologiach głównie pracujesz?', placeholder: 'np. React, TypeScript, Node.js, Python, AWS', type: 'text' },
      { id: 'experienceLevel', question: 'Jaki jest Twój poziom doświadczenia zawodowego?', placeholder: 'Wybierz poziom...', type: 'select', options: ['Junior (Początkujący)', 'Mid (Samodzielny)', 'Senior (Zaawansowany)', 'Lead / Architekt'] },
      { id: 'githubUsername', question: 'Twój login na GitHub (do zaciągania projektów):', placeholder: 'np. adrianowicz11', type: 'text' },
      { id: 'linkedinUsername', question: 'Twój profil LinkedIn (nazwa użytkownika):', placeholder: 'np. in/adrian-kowalski', type: 'text' }
    ]
  },
  {
    id: 'craft',
    name: 'Usługi lokalne i Rzemiosło',
    label: 'Budownictwo, remonty, hydraulika, stolarstwo, mechanika, fryzjerstwo',
    emoji: '🛠️',
    keywords: [
      'usługi', 'budowlane', 'wykończenia', 'remonty', 'hydraulik', 'elektryk', 
      'rzemiosło', 'stolarz', 'fryzjer', 'kosmetyczka', 'mechanik', 'warsztat', 
      'malarz', 'auto', 'naprawa', 'uslugi', 'budowlanka', 'krawiec', 'piekarz',
      'budowa', 'meble', 'stolarstwo', 'hydraulika', 'remont', 'fryzjerstwo', 'salon'
    ],
    suggestedSections: [
      { id: 'phone', name: 'Szybki kontakt telefoniczny', description: 'Bezpośredni numer telefonu widoczny dla klientów na pierwszym planie', enabled: true },
      { id: 'address', name: 'Lokalizacja działalności', description: 'Adres warsztatu lub obszar dojazdu do klienta', enabled: true },
      { id: 'gallery', name: 'Galeria zrealizowanych prac', description: 'Zdjęcia i opisy gotowych realizacji dla klientów', enabled: true },
      { id: 'reviews', name: 'Opinie zadowolonych klientów', description: 'Referencje i oceny gwiazdkowe od zleceniodawców', enabled: true },
      { id: 'map', name: 'Interaktywna mapa dojazdu', description: 'Wskazówki dojazdu do punktu usługowego', enabled: true }
    ],
    questions: [
      { id: 'phone', question: 'Podaj numer telefonu dla bezpośredniego kontaktu z klientami:', placeholder: 'np. +48 500 600 700', type: 'text' },
      { id: 'address', question: 'Podaj adres lub miasto w którym świadczysz usługi:', placeholder: 'np. ul. Lipowa 12, Warszawa lub woj. mazowieckie', type: 'text' },
      { id: 'priceRange', question: 'Jak wyceniasz swoje usługi dla klientów?', placeholder: 'np. Wycena indywidualna, darmowy kosztorys, stawka od 80 zł/h', type: 'text' },
      { id: 'workingHours', question: 'Podaj godziny otwarcia / dostępności:', placeholder: 'np. Pon - Pt: 8:00 - 18:00, Sob: 9:00 - 14:00', type: 'text' }
    ]
  },
  {
    id: 'agriculture',
    name: 'Rolnictwo i Hodowla',
    label: 'Rolnicy, hodowcy, agroturystyka, producenci żywności ekologicznej',
    emoji: '🚜',
    keywords: [
      'rolnictwo', 'rolnik', 'gospodarstwo', 'rolne', 'uprawa', 'uprawianie', 'hodowla', 
      'nawożenie', 'nawozenie', 'miód', 'pasieka', 'plony', 'warzywa', 'owoce', 'traktor', 
      'eko', 'ziemia', 'agroturystyka', 'produkty naturalne', 'mleko', 'ser', 'wieś',
      'rolny', 'zbiory', 'ekologiczne', 'pasieki', 'pszczoły', 'sadownictwo', 'pole', 'kombajn'
    ],
    suggestedSections: [
      { id: 'phone', name: 'Kontakt bezpośredni', description: 'Telefon kontaktowy dla odbiorców produktów i dostawców', enabled: true },
      { id: 'address', name: 'Lokalizacja gospodarstwa', description: 'Dokładny adres lub region prowadzenia upraw/hodowli', enabled: true },
      { id: 'gallery', name: 'Galeria produktów i plonów', description: 'Prezentacja plonów, maszyn, pól uprawnych lub zwierząt', enabled: true },
      { id: 'certificates', name: 'Certyfikaty Jakości i Eko', description: 'Wizualne atesty ekologiczne oraz certyfikaty żywności', enabled: true }
    ],
    questions: [
      { id: 'phone', question: 'Podaj numer telefonu do zamówień lub kontaktu:', placeholder: 'np. +48 601 702 803', type: 'text' },
      { id: 'address', question: 'Adres lub region Twojego gospodarstwa:', placeholder: 'np. Lipno, woj. kujawsko-pomorskie', type: 'text' },
      { id: 'farmType', question: 'Co jest głównym produktem Twojego gospodarstwa?', placeholder: 'np. naturalny miód rzepakowy i lipowy, ekologiczne warzywa, sery kozie', type: 'text' },
      { id: 'farmSize', question: 'Jakiej wielkości jest Twoje gospodarstwo / pasieka?', placeholder: 'np. Pasieka 60 uli, gospodarstwo rodzinne 15 hektarów', type: 'text' }
    ]
  },
  {
    id: 'gardening',
    name: 'Ogrodnictwo i Pielęgnacja Zieleni',
    label: 'Ogrodnicy, architekci krajobrazu, szkółki roślin, usługi pielęgnacji ogrodów i trawników',
    emoji: '🌿',
    keywords: [
      'podlewanie', 'ogrodnictwo', 'ogrodnik', 'ogród', 'ogrody', 'ogrodowe', 
      'kwiaty', 'trawnik', 'trawniki', 'sadzenie', 'szklarnia', 'rabaty', 
      'pielęgnacja ogrodu', 'przycinanie', 'drzewka', 'rośliny', 'rosliny', 
      'krzewy', 'florystyka', 'zielone', 'architektura krajobrazu'
    ],
    suggestedSections: [
      { id: 'phone', name: 'Szybki kontakt telefoniczny', description: 'Bezpośredni numer telefonu widoczny dla klientów na pierwszym planie', enabled: true },
      { id: 'address', name: 'Obszar świadczenia usług', description: 'Zasięg dojazdu do klientów lub adres stacjonarnej szkółki', enabled: true },
      { id: 'gallery', name: 'Galeria ogrodów i aranżacji', description: 'Zdjęcia zrealizowanych ogrodów, trawników i kompozycji roślinnych', enabled: true },
      { id: 'reviews', name: 'Opinie od miłośników zieleni', description: 'Referencje od zadowolonych właścicieli pięknych ogrodów', enabled: true },
      { id: 'map', name: 'Mapa dojazdu do biura lub szkółki', description: 'Ułatwienie klientom dotarcia do Twojej siedziby', enabled: true }
    ],
    questions: [
      { id: 'phone', question: 'Podaj numer telefonu dla klientów potrzebujących pomocy w ogrodzie:', placeholder: 'np. +48 501 202 303', type: 'text' },
      { id: 'address', question: 'Podaj lokalizację lub obszar świadczenia usług ogrodniczych:', placeholder: 'np. Poznań i okolice (do 30 km)', type: 'text' },
      { id: 'gardenServices', question: 'Jakie usługi ogrodnicze głównie świadczysz lub jakie rośliny hodujesz?', placeholder: 'np. projektowanie ogrodów, pielęgnacja trawników, podlewanie roślin, montaż nawadniania', type: 'text' },
      { id: 'seasonalAvailability', question: 'W jakich miesiącach prowadzisz główne prace ogrodowe?', placeholder: 'np. marzec - listopad, usługi całoroczne', type: 'text' }
    ]
  },
  {
    id: 'creative',
    name: 'Branża kreatywna i Sztuka',
    label: 'Fotografowie, graficy, malarze, muzycy, twórcy wideo, projektanci',
    emoji: '🎨',
    keywords: [
      'fotografia', 'fotograf', 'grafika', 'zdjęcia', 'sztuka', 'muzyka', 
      'video', 'wideo', 'projektowanie', 'design', 'malarstwo', 'rysunek', 
      'artysta', 'creative', 'twórca', 'muzyk', 'scena', 'reklama', 'branding',
      'filmy', 'montaż', 'zdjecia', 'copywriter', 'pisanie', 'social media'
    ],
    suggestedSections: [
      { id: 'gallery', name: 'Galeria prac i projektów', description: 'Wizualne kafelki prezentujące Twoje najlepsze dzieła, zdjęcia lub projekty graficzne', enabled: true },
      { id: 'instagram', name: 'Galeria zdjęć z Instagrama', description: 'Dynamiczna siatka zdjęć z Twojego konta Instagram', enabled: true },
      { id: 'reviews', name: 'Opinie od klientów i kuratorów', description: 'Referencje i słowa uznania od osób, z którymi współpracujesz', enabled: true },
      { id: 'timeline', name: 'Kamienie milowe kariery', description: 'Wywiady, wystawy, nagrody i ważne punkty w Twojej artystycznej drodze', enabled: true }
    ],
    questions: [
      { id: 'creativeFocus', question: 'W jakiej konkretnie dziedzinie sztuki lub kreacji się specjalizujesz?', placeholder: 'np. Fotografia ślubna, Ilustracja dziecięca, Reżyseria wideo', type: 'text' },
      { id: 'equipment', question: 'Na jakim sprzęcie lub w jakim oprogramowaniu głównie pracujesz?', placeholder: 'np. Adobe Photoshop, Illustrator, aparat Sony A7IV z obiektywami GM', type: 'text' },
      { id: 'bookingText', question: 'Jak klienci mogą zarezerwować termin lub kupić Twoje prace?', placeholder: 'np. Wolne terminy na ten sezon, zapytania proszę kierować przez formularz', type: 'text' },
      { id: 'instagramUsername', question: 'Podaj swoją nazwę użytkownika na Instagramie (bez @):', placeholder: 'np. wiktor_kadr', type: 'text' }
    ]
  },
  {
    id: 'business',
    name: 'Doradztwo, Biznes i Edukacja',
    label: 'Konsultanci, marketerzy, księgowi, prawnicy, trenerzy, korepetytorzy',
    emoji: '👔',
    keywords: [
      'doradztwo', 'biznes', 'finanse', 'marketing', 'konsultant', 'szkolenia', 
      'księgowość', 'ksiegowa', 'prawnik', 'edukacja', 'trener', 'coach', 
      'korepetycje', 'angielski', 'nauka', 'kancelaria', 'doradca', 'reklama',
      'podatki', 'audyt', 'analiza', 'seo', 'pozycjonowanie', 'strategia'
    ],
    suggestedSections: [
      { id: 'linkedin', name: 'Integracja z LinkedIn', description: 'Profesjonalne streszczenie Twojego doświadczenia oraz sieci kontaktów', enabled: true },
      { id: 'services', name: 'Zakres usług doradczych', description: 'Podział na obszary konsultacji wraz z korzyściami dla klienta', enabled: true },
      { id: 'certificates', name: 'Certyfikaty i Akredytacje', description: 'Zweryfikowane uprawnienia zawodowe potwierdzające profesjonalizm', enabled: true },
      { id: 'timeline', name: 'Historia doświadczenia biznesowego', description: 'Kariera korporacyjna lub kluczowe kamienie milowe Twojej firmy', enabled: true },
      { id: 'calendar', name: 'Kalendarz rezerwacji spotkań', description: 'Integracja terminów do szybkiego zapisu na konsultacje wstępne', enabled: true }
    ],
    questions: [
      { id: 'linkedinUsername', question: 'Twój profil LinkedIn (nazwa użytkownika):', placeholder: 'np. in/jan-kowalski-marketing', type: 'text' },
      { id: 'consultingType', question: 'W jakim obszarze doradzasz lub pomagasz swoim klientom?', placeholder: 'np. Doradztwo finansowe dla firm, SEO marketing B2B, Korepetycje z matematyki', type: 'text' },
      { id: 'experienceYears', question: 'Ile lat doświadczenia posiadasz w swojej branży?', placeholder: 'np. Ponad 8 lat doświadczenia w audytach finansowych', type: 'text' },
      { id: 'consultingMethod', question: 'Jak wygląda współpraca z Tobą? (np. online, stacjonarnie)', placeholder: 'np. Konsultacje online przez Google Meet / stacjonarnie w Warszawie', type: 'text' }
    ]
  },
  {
    id: 'general',
    name: 'Własny profil / Inna branża',
    label: 'Uniwersalne portfolio osobiste, blog lub wizytówka hobbystyczna',
    emoji: '✨',
    keywords: [],
    suggestedSections: [
      { id: 'aboutMe', name: 'Opis mojej sylwetki', description: 'Przedstaw się światu i opisz swoje główne zainteresowania', enabled: true },
      { id: 'gallery', name: 'Galeria ciekawych zdjęć', description: 'Wizualne zaprezentowanie Twoich projektów lub pasji', enabled: true },
      { id: 'contact', name: 'Szybki formularz kontaktowy', description: 'Dedykowana sekcja umożliwiająca wysłanie maila bezpośrednio do Ciebie', enabled: true },
      { id: 'phone', name: 'Numer telefonu (opcjonalnie)', description: 'Dla osób chcących ułatwić bezpośredni kontakt telefoniczny', enabled: false }
    ],
    questions: [
      { id: 'tagline', question: 'Jakie jest Twoje główne motto życiowe lub krótkie hasło?', placeholder: 'np. Pasjonat podróży, piszący o technologii i życiu codziennym', type: 'text' },
      { id: 'aboutMeText', question: 'Napisz kilka zdań o sobie:', placeholder: 'Cześć! Zajmuję się wieloma rzeczami i pasjonuję się sportem...', type: 'textarea' },
      { id: 'contactEmail', question: 'Podaj swój adres e-mail do kontaktu:', placeholder: 'np. kontakt@mojadomena.pl', type: 'text' }
    ]
  }
];

/**
 * Normalizes input string by mapping Polish characters to ASCII equivalents,
 * lowering case, and stripping excessive punctuation.
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accent diacritics
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Comprehensive professional dictionary mapping detailed combination patterns
 * to specific occupations with customized bio templates, manual projects,
 * verified certificates, and career timelines.
 */
export const professionalDictionary: DictionaryProfession[] = [
  {
    id: 'wedding-photographer',
    title: 'Fotograf Ślubny',
    categoryId: 'creative',
    emoji: '📸',
    requiredAll: ['zdjec', 'slub'],
    anyOf: ['fotograf', 'fotografia', 'sesj', 'wesele', 'zdjecia', 'aparaty', 'kamery', 'wesela', 'slubny'],
    bioTemplate: (name, answers) => `Profesjonalny fotograf ślubny. Zatrzymuję w kadrze Wasze najpiękniejsze chwile, emocje i unikalny urok ślubnej ceremonii. Główny obszar działania: ${answers.creativeFocus || 'sesje ślubne, plenerowe i reportaże'}. Sprzęt: ${answers.equipment || 'najwyższej klasy aparaty bezlusterkowe Sony i jasne obiektywy GM'}.`,
    projects: [
      {
        id: 'proj-photo-1',
        title: 'Reportaż ślubny: Alicja & Tomasz',
        description: 'Kompleksowa relacja fotograficzna obejmująca przygotowania panny młodej, uroczystość kościelną oraz wesele do białego rana.',
        tags: ['Fotografia Ślubna', 'Reportaż', 'Portret'],
        type: 'manual'
      },
      {
        id: 'proj-photo-2',
        title: 'Romantyczna sesja plenerowa w Tatrach',
        description: 'Zdjęcia plenerowe wykonane o wschodzie słońca na tle majestatycznych szczytów górskich.',
        tags: ['Plener Ślubny', 'Góry', 'Artystyczne'],
        type: 'manual'
      }
    ],
    certificates: [
      {
        id: 'cert-photo-1',
        title: 'Akredytacja do Fotografowania Uroczystości Liturgicznych',
        issuer: 'Kuria Metropolitalna',
        date: '2024',
        description: 'Zezwolenie na profesjonalne fotografowanie ceremonii ślubnych w kościołach.',
        verified: true
      }
    ],
    timeline: [
      {
        id: 'time-photo-1',
        period: '2021 - Obecnie',
        role: 'Główny Fotograf Ślubny',
        company: `${name} Photography`,
        description: 'Realizacja ponad 120 udanych reportaży ślubnych, sesji partnerskich oraz rodzinnych z zachowaniem najwyższych standardów estetyki.'
      }
    ]
  },
  {
    id: 'gardener',
    title: 'Ogrodnik / Projektant Zieleni',
    categoryId: 'gardening',
    emoji: '🌱',
    requiredAll: ['ogrod', 'podlewanie'],
    anyOf: ['ogrodnictwo', 'ogrodnik', 'trawnik', 'nawadnianie', 'roslin', 'sadzenie', 'zieleni', 'przycinanie', 'krzewy', 'kwiaty'],
    bioTemplate: (name, answers) => `Projektant ogrodów i dyplomowany ogrodnik. Specjalizuję się w tworzeniu tętniących życiem ogrodów przydomowych oraz nowoczesnych systemów podlewania. Zakres prac: ${answers.gardenServices || 'pielęgnacja trawników, automatyczne systemy nawadniania i aranżacja rabat'}. Dostępność: ${answers.seasonalAvailability || 'Całoroczne doradztwo, realizacja prac od marca do listopada'}.`,
    projects: [
      {
        id: 'proj-garden-1',
        title: 'Montaż automatycznego nawadniania Hunter',
        description: 'Kompleksowe zaprojektowanie i instalacja oszczędnego systemu zraszaczy rotacyjnych oraz linii kroplujących dla rabat.',
        tags: ['Systemy nawadniania', 'Ogród', 'Automatyka'],
        type: 'manual'
      },
      {
        id: 'proj-garden-2',
        title: 'Aranżacja ogrodu w stylu nowoczesnym',
        description: 'Nasadzenia krzewów ozdobnych, ułożenie darni z rolki, przygotowanie ściółkowania korą sosnową i montaż oświetlenia LED.',
        tags: ['Projektowanie', 'Trawniki z rolki', 'Nasadzenia'],
        type: 'manual'
      }
    ],
    certificates: [
      {
        id: 'cert-garden-1',
        title: 'Certyfikowany Projektant Systemów Nawadniających',
        issuer: 'Hunter Industries Polska',
        date: '2024',
        description: 'Licencja uprawniająca do projektowania zaawansowanych hydraulicznie, zautomatyzowanych systemów nawadniania.',
        verified: true
      }
    ],
    timeline: [
      {
        id: 'time-garden-1',
        period: '2020 - Obecnie',
        role: 'Właściciel / Architekt Krajobrazu',
        company: `${name} Ogrody i Pielęgnacja`,
        description: 'Niezależne realizacje ponad 50 ogrodów przydomowych, montaż systemów podlewania trawników oraz doradztwo fitosanitarne.'
      }
    ]
  },
  {
    id: 'web-developer',
    title: 'Web Developer / Programista React',
    categoryId: 'tech',
    emoji: '⚛️',
    requiredAll: ['react', 'stron'],
    anyOf: ['programista', 'frontend', 'javascript', 'typescript', 'kod', 'nextjs', 'web', 'html', 'css', 'sklep', 'aplikacje'],
    bioTemplate: (name, answers) => `Frontend Developer z pasją do tworzenia interaktywnych stron i aplikacji webowych. Główne technologie: ${answers.techStack || 'React, TypeScript, Next.js, Tailwind CSS'}. Poziom: ${answers.experienceLevel || 'Mid Frontend Engineer'}.`,
    projects: [
      {
        id: 'proj-web-1',
        title: 'Responsywna platforma e-commerce',
        description: 'Nowoczesny sklep internetowy z koszykiem zakupowym, modułem filtrowania produktów na żywo oraz pełną integracją płatności online.',
        tags: ['React', 'Next.js', 'Stripe', 'Tailwind'],
        type: 'manual'
      },
      {
        id: 'proj-web-2',
        title: 'SaaS Dashboard Engine',
        description: 'Panel administracyjny dla biznesu z dynamicznymi wykresami w czasie rzeczywistym i modularnym panelem ustawień użytkownika.',
        tags: ['TypeScript', 'Recharts', 'React Context'],
        type: 'github'
      }
    ],
    certificates: [
      {
        id: 'cert-web-1',
        title: 'Meta Front-End Developer Certificate',
        issuer: 'Meta / Coursera',
        date: '2024',
        description: 'Zweryfikowane kompetencje w zakresie programowania interfejsów w React, optymalizacji wydajności i testowania kodu.',
        verified: true
      }
    ],
    timeline: [
      {
        id: 'time-web-1',
        period: '2022 - Obecnie',
        role: 'Frontend Developer',
        company: 'Innovate Software House',
        description: 'Praca nad dużymi aplikacjami webowymi, refaktoryzacja kodu do TypeScript, bliska współpraca z zespołem projektantów UI/UX.'
      }
    ]
  },
  {
    id: 'ai-engineer',
    title: 'Inżynier AI / Python Developer',
    categoryId: 'tech',
    emoji: '🤖',
    requiredAll: ['python', 'ai'],
    anyOf: ['sztuczna', 'inteligencja', 'machine', 'learning', 'modele', 'dane', 'analiza', 'data', 'science', 'deep', 'nlp'],
    bioTemplate: (name, answers) => `Software Engineer & AI specialist. Projektuję inteligentne aplikacje, trenuję modele uczenia maszynowego i wdrażam algorytmy analizy danych. Główne technologie: ${answers.techStack || 'Python, PyTorch, TensorFlow, Google Cloud Platform'}.`,
    projects: [
      {
        id: 'proj-ai-1',
        title: 'Autonomiczny analizator dokumentacji PDF',
        description: 'System NLP wykorzystujący wielkie modele językowe do automatycznego streszczania, kategoryzowania i wyciągania metadanych z faktur.',
        tags: ['Python', 'LangChain', 'Gemini API', 'VectorDB'],
        type: 'manual'
      },
      {
        id: 'proj-ai-2',
        title: 'Model predykcji cen nieruchomości',
        description: 'Algorytm regresyjny analizujący trendy rynkowe i szacujący wycenę lokali mieszkalnych na podstawie ponad 40 zmiennych.',
        tags: ['Python', 'Scikit-Learn', 'Pandas', 'FastAPI'],
        type: 'github'
      }
    ],
    certificates: [
      {
        id: 'cert-ai-1',
        title: 'Google Cloud Certified Professional Machine Learning Engineer',
        issuer: 'Google Cloud',
        date: '2025',
        description: 'Potwierdzenie kompetencji w budowaniu, optymalizowaniu i produkcyjnym wdrażaniu modeli ML na chmurze GCP.',
        verified: true
      }
    ],
    timeline: [
      {
        id: 'time-ai-1',
        period: '2023 - Obecnie',
        role: 'AI Software Engineer',
        company: 'DeepMinded Analytics',
        description: 'Opracowywanie algorytmów analizujących dane klientów, budowa mikroserwisów opartych o sztuczną inteligencję oraz optymalizacja modeli NLP.'
      }
    ]
  },
  {
    id: 'beekeeper',
    title: 'Pszczelarz / Właściciel Pasieki',
    categoryId: 'agriculture',
    emoji: '🐝',
    requiredAll: ['pasieka', 'miod'],
    anyOf: ['pszczoly', 'pszczelarz', 'ul', 'ule', 'miody', 'pszczelarstwo', 'gospodarstwo', 'rolne'],
    bioTemplate: (name, answers) => `Właściciel ekologicznej, rodzinnej pasieki. Z pasją pozyskujemy naturalne, zdrowe miody i dbamy o dobrostan rodzin pszczelich w czystym regionie kraju. Specjalizacja: ${answers.farmType || 'naturalny miód rzepakowy, akacjowy, spadziowy i pyłek pszczeli'}. Rozmiar pasieki: ${answers.farmSize || 'Rodzinna pasieka z kilkudziesięcioma uli drewnianymi'}.`,
    projects: [
      {
        id: 'proj-bee-1',
        title: 'Zbiór miodów odmianowych (Miodobranie)',
        description: 'Sezonowe wirowanie miodu rzepakowego, lipowego oraz rzadkich miodów leśnych z zachowaniem rzemieślniczych standardów.',
        tags: ['Miodobranie', 'Tradycja', 'Ekologiczne'],
        type: 'manual'
      },
      {
        id: 'proj-bee-2',
        title: 'Edukacja i warsztaty "Sekrety Życia Pszczół"',
        description: 'Organizacja warsztatów dla dzieci i dorosłych połączona z degustacją miodów bezpośrednio z naszej pasieki.',
        tags: ['Edukacja', 'Agroturystyka', 'Warsztaty'],
        type: 'manual'
      }
    ],
    certificates: [
      {
        id: 'cert-bee-1',
        title: 'Certyfikat Gospodarstwa Pasiecznego Najwyższej Jakości',
        issuer: 'Polski Związek Pszczelarski',
        date: '2024',
        description: 'Atest potwierdzający czystość mikrobiologiczną produktów, tradycyjne metody produkcji oraz weterynaryjny nadzór pasieki.',
        verified: true
      }
    ],
    timeline: [
      {
        id: 'time-bee-1',
        period: '2019 - Obecnie',
        role: 'Główny Pszczelarz / Założyciel',
        company: `Pasieka Tradycyjna ${name}`,
        description: 'Prowadzenie uli w pasiekach stacjonarnych i wędrownych, dystrybucja miodów naturalnych bezpośrednio do konsumentów oraz produkcja świec woskowych.'
      }
    ]
  },
  {
    id: 'orchardist',
    title: 'Sadownik / Właściciel Sadu',
    categoryId: 'agriculture',
    emoji: '🍎',
    requiredAll: ['sad', 'owoce'],
    anyOf: ['sadownictwo', 'jablka', 'gruszki', 'sliwki', 'truskawki', 'borowki', 'maliny', 'drzewa owocowe', 'rolnictwo'],
    bioTemplate: (name, answers) => `Dyplomowany sadownik prowadzący rodzinne sady owocowe. Dostarczamy najwyższej jakości owoce deserowe oraz ekologiczne soki tłoczone bez cukru i ulepszaczy. Produkty: ${answers.farmType || 'jabłka deserowe, gruszki i 100% naturalny sok tłoczony'}. Skala produkcji: ${answers.farmSize || 'Sady owocowe o powierzchni kilkunastu hektarów'}.`,
    projects: [
      {
        id: 'proj-orchard-1',
        title: 'Wdrożenie zintegrowanej ochrony biologicznej sadu',
        description: 'Zastąpienie tradycyjnych oprysków chemicznych metodami biologicznymi przyjaznymi dla pszczół i środowiska.',
        tags: ['Ekologia', 'Zrównoważone Sadownictwo'],
        type: 'manual'
      },
      {
        id: 'proj-orchard-2',
        title: 'Uruchomienie tłoczni soków owocowych "Z Sadu"',
        description: 'Inwestycja w nowoczesną linię produkcyjną soków tłoczonych na zimno bezpośrednio po zbiorach.',
        tags: ['Soki tłoczone', 'Nowoczesne Maszyny'],
        type: 'manual'
      }
    ],
    certificates: [
      {
        id: 'cert-orchard-1',
        title: 'Certyfikat Zintegrowanej Produkcji Roślin (IP)',
        issuer: 'Państwowa Inspekcja Ochrony Roślin i Nasiennictwa',
        date: '2025',
        description: 'Urzędowy atest potwierdzający najwyższe standardy higieniczne i minimalne, w pełni bezpieczne stosowanie nawozów.',
        verified: true
      }
    ],
    timeline: [
      {
        id: 'time-orchard-1',
        period: '2015 - Obecnie',
        role: 'Zarządca Sadu / Właściciel',
        company: `Gospodarstwo Sadownicze ${name}`,
        description: 'Nadzór nad całorocznym cyklem wegetacyjnym, zbiory owoców deserowych oraz rozwój regionalnej marki naturalnych soków.'
      }
    ]
  },
  {
    id: 'grain-farmer',
    title: 'Rolnik Zbożowy / Gospodarstwo Rolne',
    categoryId: 'agriculture',
    emoji: '🌾',
    requiredAll: ['zboze', 'plony'],
    anyOf: ['rolnictwo', 'rolnik', 'kombajn', 'traktor', 'nawozenie', 'uprawa', 'pszenica', 'zyto', 'pole', 'rolne'],
    bioTemplate: (name, answers) => `Nowoczesny rolnik prowadzący zaawansowane gospodarstwo rolne. Stawiam na rolnictwo precyzyjne, optymalizację nawożenia i ekologiczne dbanie o żyzność gleby. Główne uprawy: ${answers.farmType || 'pszenica konsumpcyjna, rzepak i kukurydza'}. Wielkość gospodarstwa: ${answers.farmSize || 'Wielkoobszarowe gospodarstwo rodzinne'}.`,
    projects: [
      {
        id: 'proj-grain-1',
        title: 'Żniwa zbożowe z systemem GPS i rolnictwem precyzyjnym',
        description: 'Sprawne przeprowadzenie zbiorów pszenicy z mapowaniem plonu w czasie rzeczywistym przy użyciu nawigacji GPS w kombajnie.',
        tags: ['Rolnictwo Precyzyjne', 'Żniwa', 'Pszenica'],
        type: 'manual'
      },
      {
        id: 'proj-grain-2',
        title: 'Zastosowanie organicznego płodozmianu i nawozów naturalnych',
        description: 'Wprowadzenie poplonów i nawożenia obornikiem w celu naturalnego odbudowania próchnicy w glebie.',
        tags: ['Gleba', 'Nawożenie organiczne', 'Eko'],
        type: 'manual'
      }
    ],
    certificates: [
      {
        id: 'cert-grain-1',
        title: 'Certyfikat Dobrej Praktyki Rolniczej GlobalGAP',
        issuer: 'TÜV Rheinland',
        date: '2024',
        description: 'Międzynarodowy standard poświadczający najwyższą higienę i bezpieczeństwo żywności w produkcji rolniczej.',
        verified: true
      }
    ],
    timeline: [
      {
        id: 'time-grain-1',
        period: '2012 - Obecnie',
        role: 'Główny Gospodarz',
        company: `Gospodarstwo Rolne ${name}`,
        description: 'Zarządzanie parkiem maszynowym, agrotechnika pól uprawnych, negocjacje z odbiorcami hurtowymi oraz dbanie o tradycję rodzinną.'
      }
    ]
  },
  {
    id: 'carpenter',
    title: 'Stolarz Meblowy',
    categoryId: 'craft',
    emoji: '🪚',
    requiredAll: ['stolarz', 'meble'],
    anyOf: ['stolarka', 'meblowy', 'drewno', 'drewniane', 'szafy', 'kuchnie', 'kuchnia', 'blaty', 'schody', 'drzwi', 'wymiar'],
    bioTemplate: (name, answers) => `Rzemieślnik i stolarz meblowy. Tworzę wysokiej jakości meble na wymiar oraz unikalne konstrukcje z litego drewna. Moja specjalność: ${answers.priceRange || 'kuchnie na wymiar, szafy wnękowe i dębowe blaty jadalniane'}. Godziny pracy: ${answers.workingHours || 'Poniedziałek - Piątek: 8:00 - 18:00'}.`,
    projects: [
      {
        id: 'proj-carp-1',
        title: 'Zabudowa kuchenna w stylu nowoczesnym na wymiar',
        description: 'Wykonanie mebli kuchennych z frontami lakierowanymi, ukrytymi uchwytami, ergonomicznym cargo oraz blatami z litego dębu.',
        tags: ['Kuchnia na wymiar', 'Meble', 'Lakier'],
        type: 'manual'
      },
      {
        id: 'proj-carp-2',
        title: 'Stół jadalniany z dębu bagiennego i żywicy epoksydowej',
        description: 'Ręcznie polerowany, artystyczny stół dębowy wykonany według indywidualnego projektu inwestora.',
        tags: ['Rękodzieło', 'Lite drewno', 'Żywica'],
        type: 'manual'
      }
    ],
    certificates: [
      {
        id: 'cert-carp-1',
        title: 'Dyplom Mistrza Stolarstwa',
        issuer: 'Izba Rzemieślnicza',
        date: '2023',
        description: 'Najwyższy stopień kwalifikacji zawodowych potwierdzający kunszt stolarski oraz uprawnienia do nauki zawodu uczniów.',
        verified: true
      }
    ],
    timeline: [
      {
        id: 'time-carp-1',
        period: '2020 - Obecnie',
        role: 'Właściciel / Mistrz Stolarski',
        company: `${name} Stolarka Artystyczna`,
        description: 'Projektowanie w programach CAD, obróbka tarcicy, montaż mebli u klientów na terenie całego województwa oraz budowa renomy lokalnej.'
      }
    ]
  },
  {
    id: 'electrician',
    title: 'Elektryk / Instalator SEP',
    categoryId: 'craft',
    emoji: '⚡',
    requiredAll: ['elektryk', 'instalacje'],
    anyOf: ['elektryczne', 'prad', 'kabel', 'pomiary', 'sep', 'rozdzielnica', 'pogotowie', 'awaria', 'oswietlenie', 'pomiary sep'],
    bioTemplate: (name, answers) => `Uprawniony instalator i elektryk z uprawnieniami SEP eksploatacji i dozoru. Oferuję bezawaryjne, w pełni bezpieczne instalacje elektryczne, odgromowe i Smart Home. Ceny: ${answers.priceRange || 'darmowa wycena i dojazd do klienta, faktura VAT'}. Kontakt: ${answers.phone || 'dostępny pod telefonem w nagłych awariach'}.`,
    projects: [
      {
        id: 'proj-elec-1',
        title: 'Kompleksowa instalacja elektryczna w nowym domu jednorodzinnym',
        description: 'Zaprojektowanie i montaż instalacji zasilającej, internetowej, instalacji odgromowej oraz pełnej rozdzielnicy z zabezpieczeniami przepięciowymi.',
        tags: ['Elektryka', 'Rozdzielnica', 'Budowa'],
        type: 'manual'
      },
      {
        id: 'proj-elec-2',
        title: 'Modernizacja i pomiary okresowe w kamienicy',
        description: 'Wymiana starej instalacji aluminiowej na bezpieczną miedzianą wraz z wykonaniem urzędowego protokołu pomiarów rezystancji.',
        tags: ['Pomiary SEP', 'Remont', 'Bezpieczeństwo'],
        type: 'manual'
      }
    ],
    certificates: [
      {
        id: 'cert-elec-1',
        title: 'Certyfikat Kwalifikacyjny SEP G1/E i G1/D do 1kV',
        issuer: 'Stowarzyszenie Elektryków Polskich',
        date: '2025',
        description: 'Państwowe uprawnienia do wykonywania prac instalacyjnych, montażu, pomiarów oraz nadzoru nad urządzeniami elektrycznymi.',
        verified: true
      }
    ],
    timeline: [
      {
        id: 'time-elec-1',
        period: '2021 - Obecnie',
        role: 'Właściciel / Instalator Elektryk',
        company: `Elektro-Instal ${name}`,
        description: 'Wykonawstwo instalacji w domach jednorodzinnych, biurach i lokalach usługowych, usuwanie awarii i montaż oświetlenia LED.'
      }
    ]
  },
  {
    id: 'plumber',
    title: 'Hydraulik / Instalator Sanitarny',
    categoryId: 'craft',
    emoji: '🔧',
    requiredAll: ['hydraulik', 'ogrzewanie'],
    anyOf: ['rury', 'sanitarne', 'pompa ciepla', 'kanalizacja', 'zlewy', 'woda', 'wodociagi', 'kotlownia', 'podlogowka', 'instalator'],
    bioTemplate: (name, answers) => `Doświadczony hydraulik i instalator systemów sanitarnych. Specjalizuję się w montażu pomp ciepła, ogrzewania podłogowego oraz instalacji wodno-kanalizacyjnych. Dostępność: ${answers.workingHours || 'Zgłoszenia awaryjne 24/7, standardowe montaże Pon-Pt'}. Obszar działania: ${answers.address || 'lokalnie z dojazdem do klienta'}.`,
    projects: [
      {
        id: 'proj-plumb-1',
        title: 'Montaż pompy ciepła i ogrzewania podłogowego',
        description: 'Dobór i profesjonalna instalacja pompy ciepła split oraz rozłożenie ogrzewania podłogowego w budynku o pow. 160m2.',
        tags: ['Ogrzewanie podłogowe', 'Pompa ciepła', 'Instalacja CO'],
        type: 'manual'
      },
      {
        id: 'proj-plumb-2',
        title: 'Instalacja wodno-kanalizacyjna w łazience',
        description: 'Rozprowadzenie rur metodą zgrzewaną, montaż stelaży podtynkowych oraz podłączenie odpływów liniowych.',
        tags: ['Wod-Kan', 'Stelaże podtynkowe', 'Instalacje'],
        type: 'manual'
      }
    ],
    certificates: [
      {
        id: 'cert-plumb-1',
        title: 'Uprawnienia Instalatora Autoryzowanego Viessmann',
        issuer: 'Viessmann Academy',
        date: '2024',
        description: 'Oficjalny certyfikat uprawniający do montażu, uruchamiania i serwisu gwarancyjnego kotłów oraz pomp ciepła marki Viessmann.',
        verified: true
      }
    ],
    timeline: [
      {
        id: 'time-plumb-1',
        period: '2019 - Obecnie',
        role: 'Główny Hydraulik / Właściciel',
        company: `Serwis Sanitarno-Grzewczy ${name}`,
        description: 'Usługi hydrauliczne dla osób prywatnych i deweloperów, modernizacje kotłowni oraz całoroczne pogotowie hydrauliczne.'
      }
    ]
  },
  {
    id: 'renovator',
    title: 'Wykończenia Wnętrz / Ekipa Remontowa',
    categoryId: 'craft',
    emoji: '🧱',
    requiredAll: ['remont', 'wykonczenia'],
    anyOf: ['malowanie', 'szpachlowanie', 'plytki', 'glazura', 'gips', 'karton', 'regipsy', 'flizowanie', 'panele', 'gładzie', 'szpachla'],
    bioTemplate: (name, answers) => `Specjalista wykończeń wnętrz. Realizuję remonty łazienek, salonów i całych mieszkań "pod klucz". Cechuje mnie precyzja, dotrzymywanie terminów i dbanie o czystość podczas prac. Wycena: ${answers.priceRange || 'Darmowa wycena na miejscu budowy, doradztwo materiałowe'}.`,
    projects: [
      {
        id: 'proj-ren-1',
        title: 'Wykończenie salonu i jadalni z sufitem napinanym',
        description: 'Bezpyłowe szpachlowanie gładzią polimerową, profesjonalne malowanie natryskowe, montaż nowoczesnego sufitu z taśmami LED.',
        tags: ['Gładzie gipsowe', 'Malowanie natryskowe', 'Sufity LED'],
        type: 'manual'
      },
      {
        id: 'proj-ren-2',
        title: 'Remont łazienki w płytkach wielkoformatowych',
        description: 'Precyzyjne docinanie i ukosowanie płytek gresowych 120x60, montaż odpływu ściennego oraz hydroizolacja dwuskładnikowa.',
        tags: ['Flizowanie', 'Gres wielkoformatowy', 'Hydroizolacja'],
        type: 'manual'
      }
    ],
    certificates: [
      {
        id: 'cert-ren-1',
        title: 'Certyfikat Profesjonalnego Wykonawcy Atlas',
        issuer: 'Grupa Atlas',
        date: '2024',
        description: 'Szkolenie z zakresu hydroizolacji, klejenia okładzin ceramicznych dużych formatów i prawidłowego przygotowywania podłoży budowlanych.',
        verified: true
      }
    ],
    timeline: [
      {
        id: 'time-ren-1',
        period: '2018 - Obecnie',
        role: 'Lider Zespołu Wykończeniowego',
        company: `${name} Remonty Pod Klucz`,
        description: 'Koordynacja kompleksowych prac remontowych, nadzór nad terminami dostaw materiałów oraz dbanie o 100% zadowolenie inwestorów.'
      }
    ]
  },
  {
    id: 'mechanic',
    title: 'Mechanik Samochodowy',
    categoryId: 'craft',
    emoji: '🚗',
    requiredAll: ['mechanik', 'naprawa'],
    anyOf: ['samochody', 'auto', 'warsztat', 'silnik', 'diagnostyka', 'zawieszenie', 'hamulce', 'skrzynia', 'wymiana oleju', 'samochodowy'],
    bioTemplate: (name, answers) => `Dyplomowany mechanik samochodowy i pasjonat motoryzacji. Oferuję pełen zakres napraw silnikowych, zawieszeń oraz diagnostyki komputerowej pojazdów osobowych i dostawczych. Szybkie terminy: ${answers.workingHours || 'Warsztat czynny Pon-Pt 8:00 - 17:00, Sob: 8:00 - 13:00'}.`,
    projects: [
      {
        id: 'proj-mech-1',
        title: 'Kompleksowy remont silnika i głowicy 2.0 TDI',
        description: 'Wymiana pierścieni tłokowych, panewek, planowanie głowicy, wymiana uszczelniaczy oraz montaż nowego zestawu rozrządu.',
        tags: ['Silnik', 'Remont główny', 'TDI'],
        type: 'manual'
      },
      {
        id: 'proj-mech-2',
        title: 'Diagnostyka komputerowa i usunięcie błędu DPF/EGR',
        description: 'Skanowanie protokołem OBD2, czyszczenie chemiczne filtra cząstek stałych oraz kalibracja zaworu recyrkulacji spalin.',
        tags: ['Diagnostyka', 'DPF', 'Elektronika'],
        type: 'manual'
      }
    ],
    certificates: [
      {
        id: 'cert-mech-1',
        title: 'Certyfikat Diagnosty Układów Common Rail i Elektroniki',
        issuer: 'Bosch Training Center',
        date: '2024',
        description: 'Szkolenie z zakresu diagnozowania awarii nowoczesnych układów wtryskowych oraz czujników pokładowych CAN.',
        verified: true
      }
    ],
    timeline: [
      {
        id: 'time-mech-1',
        period: '2017 - Obecnie',
        role: 'Właściciel / Główny Mechanik',
        company: `Auto Serwis ${name}`,
        description: 'Prowadzenie niezależnego warsztatu mechaniki pojazdowej, inwestycje w markowy sprzęt diagnostyczny i zaufanie rzeszy stałych klientów.'
      }
    ]
  },
  {
    id: 'graphic-designer',
    title: 'Grafik / UI Designer',
    categoryId: 'creative',
    emoji: '🎨',
    requiredAll: ['grafik', 'projektowanie'],
    anyOf: ['grafika', 'logo', 'ilustracja', 'plakat', 'identyfikacja', 'figma', 'visual', 'photoshop', 'illustrator', 'branding', 'interfejsy'],
    bioTemplate: (name, answers) => `Projektant graficzny i UI Designer. Pomagam markom wyróżnić się na rynku dzięki przemyślanej, nowoczesnej identyfikacji wizualnej i pięknym interfejsom. Narzędzia: ${answers.equipment || 'Figma, Adobe Photoshop, Adobe Illustrator'}. Sposób pracy: ${answers.bookingText || 'Szybkie terminy realizacji, pełen profesjonalizm i darmowy brief'}.`,
    projects: [
      {
        id: 'proj-graph-1',
        title: 'Branding i księga znaku dla startupu technologicznego "Aero"',
        description: 'Stworzenie unikalnego logo, dobór krojów pisma, palety barw oraz makiety papeterii i postów społecznościowych.',
        tags: ['Branding', 'Logo', 'Księga znaku'],
        type: 'manual'
      },
      {
        id: 'proj-graph-2',
        title: 'Projekt interfejsu aplikacji mobilnej do zdrowego żywienia',
        description: 'Przygotowanie kompletnego projektu UI/UX w programie Figma obejmującego ponad 40 ekranów z interaktywnym prototypem.',
        tags: ['Figma', 'UI/UX', 'Mobile App'],
        type: 'manual'
      }
    ],
    certificates: [
      {
        id: 'cert-graph-1',
        title: 'Google UX Design Professional Certificate',
        issuer: 'Google / Coursera',
        date: '2024',
        description: 'Certyfikat potwierdzający kompetencje w projektowaniu zorientowanym na użytkownika, makietowaniu, badaniach UX i tworzeniu prototypów.',
        verified: true
      }
    ],
    timeline: [
      {
        id: 'time-graph-1',
        period: '2021 - Obecnie',
        role: 'Freelance Graphic Designer',
        company: `${name} Design Studio`,
        description: 'Stała współpraca z firmami z Polski i zagranicy, dostarczanie grafik reklamowych, projektowanie stron i dbanie o spójność marek.'
      }
    ]
  },
  {
    id: 'video-editor',
    title: 'Montażysta Wideo / Twórca Filmów',
    categoryId: 'creative',
    emoji: '🎬',
    requiredAll: ['wideo', 'montaz'],
    anyOf: ['video', 'filmy', 'kamera', 'youtube', 'tiktok', 'reklamy', 'rolki', 'reels', 'promocyjne', 'nagrania'],
    bioTemplate: (name, answers) => `Twórca filmowy i profesjonalny montażysta wideo. Zamieniam surowe nagrania w angażujące historie, idealnie dopasowane do platform społecznościowych i kampanii reklamowych. Specjalizacja: ${answers.creativeFocus || 'reklamy produktowe, dynamiczne rolki na TikTok/Instagram i filmy na YouTube'}. Oprogramowanie: ${answers.equipment || 'Adobe Premiere Pro, After Effects, DaVinci Resolve'}.`,
    projects: [
      {
        id: 'proj-vid-1',
        title: 'Film promocyjny marki modowej "Velvet"',
        description: 'Pełny montaż, profesjonalny color grading, dopasowanie licencjonowanej muzyki i stworzenie efektownych przejść.',
        tags: ['Reklama', 'Color Grading', 'Premiere Pro'],
        type: 'manual'
      },
      {
        id: 'proj-vid-2',
        title: 'Seria 15 rolek dynamicznych zwiększających zasięg',
        description: 'Przygotowanie formatów pionowych o wysokiej retencji uwagi: automatyczne napisy, szybkie cięcia i dźwiękowe efekty SFX.',
        tags: ['Reels', 'TikTok', 'Montaż pionowy'],
        type: 'manual'
      }
    ],
    certificates: [
      {
        id: 'cert-vid-1',
        title: 'DaVinci Resolve Certified End User',
        issuer: 'Blackmagic Design',
        date: '2024',
        description: 'Oficjalne potwierdzenie umiejętności korekcji barwnej, montażu oraz obróbki dźwięku w DaVinci Resolve.',
        verified: true
      }
    ],
    timeline: [
      {
        id: 'time-vid-1',
        period: '2022 - Obecnie',
        role: 'Montażysta & Creator',
        company: `${name} Film & Cut`,
        description: 'Niezależna produkcja wideo, współpraca z agencjami reklamowymi, montowanie kursów online i dbanie o wysokie zaangażowanie widzów.'
      }
    ]
  },
  {
    id: 'marketing-specialist',
    title: 'Konsultant ds. Marketingu i SEO',
    categoryId: 'business',
    emoji: '📈',
    requiredAll: ['marketing', 'reklama'],
    anyOf: ['ads', 'facebook', 'social', 'media', 'seo', 'pozycjonowanie', 'pr', 'google ads', 'instagram', 'leady', 'ruch', 'konwersje'],
    bioTemplate: (name, answers) => `Ekspert marketingu online. Pomagam małym i średnim firmom zdobywać płatnych klientów za pomocą kampanii Google/Facebook Ads oraz pozycjonowania stron w Google. Specjalizacja: ${answers.consultingType || 'kampanie Ads, audyty SEO oraz audyty lejków konwersji'}. Doświadczenie: ${answers.experienceYears || 'Wieloletnie doświadczenie z budżetami reklamowymi'}.`,
    projects: [
      {
        id: 'proj-mark-1',
        title: 'Kampania Google Ads: wzrost ROAS do 450%',
        description: 'Optymalizacja słów kluczowych i kreacji reklamowych dla sklepu internetowego, co przyniosło rekordowy zwrot z inwestycji.',
        tags: ['Google Ads', 'E-commerce', 'ROAS'],
        type: 'manual'
      },
      {
        id: 'proj-mark-2',
        title: 'Pozycjonowanie i wzrost organiczny witryny usługowej',
        description: 'Dogłębny audyt SEO, optymalizacja treści i link building, skutkujące awansem na TOP 3 na kluczowe frazy branżowe.',
        tags: ['SEO', 'Google organic', 'Optymalizacja'],
        type: 'manual'
      }
    ],
    certificates: [
      {
        id: 'cert-mark-1',
        title: 'Certyfikat Profesjonalny Google Ads',
        issuer: 'Google Skillshop',
        date: '2025',
        description: 'Oficjalny certyfikat potwierdzający zaawansowaną wiedzę z zakresu sieci wyszukiwania i reklam produktowych Google.',
        verified: true
      }
    ],
    timeline: [
      {
        id: 'time-mark-1',
        period: '2020 - Obecnie',
        role: 'Główny Strateg Marketingowy',
        company: `${name} Marketing Partners`,
        description: 'Zarządzanie budżetami reklamowymi klientów, audyty SEO, konfiguracja narzędzi analitycznych Google Analytics 4 oraz doradztwo B2B.'
      }
    ]
  },
  {
    id: 'accountant',
    title: 'Księgowa / Biuro Rachunkowe',
    categoryId: 'business',
    emoji: '📊',
    requiredAll: ['ksiegow', 'podatki'],
    anyOf: ['rachunkowosc', 'ksiegowa', 'rachunkowe', 'faktury', 'pit', "vat", "zus", "kadr", "rozliczenia", "fakturowanie"],
    bioTemplate: (name, answers) => `Licencjonowana księgowa i doradca finansowy. Oferuję skrupulatne i nowoczesne usługi księgowe dla jednoosobowych działalności (JDG) oraz spółek z o.o. Doświadczenie: ${answers.experienceYears || 'ponad 10 lat doświadczenia w księgowości i rozliczeniach podatkowych'}. Standard pracy: ${answers.consultingMethod || 'pełne rozliczenia online, kontakt przez aplikację oraz system KSeF'}.`,
    projects: [
      {
        id: 'proj-acc-1',
        title: 'Audyt podatkowy i optymalizacja formy opodatkowania firmy',
        description: 'Przeprowadzenie dogłębnej analizy przychodów i kosztów klienta, przynoszące ponad 15 000 zł rocznych oszczędności na podatkach i składkach.',
        tags: ['Doradztwo podatkowe', 'JDG', 'Optymalizacja'],
        type: 'manual'
      },
      {
        id: 'proj-acc-2',
        title: 'Wdrożenie elektronicznego obiegu dokumentów (KSeF ready)',
        description: 'Przejście na bezpapierowy obieg faktur, integracja OCR i bezpieczna chmura do archiwizacji dokumentacji klientów.',
        tags: ['KSeF', 'Digitalizacja', 'Biuro Online'],
        type: 'manual'
      }
    ],
    certificates: [
      {
        id: 'cert-acc-1',
        title: 'Certyfikat Głównego Księgowego',
        issuer: 'Stowarzyszenie Księgowych w Polsce (SKwP)',
        date: '2024',
        description: 'Prestiżowy certyfikat potwierdzający kwalifikacje zgodne z polskimi standardami rachunkowości oraz etyką zawodową.',
        verified: true
      }
    ],
    timeline: [
      {
        id: 'time-acc-1',
        period: '2019 - Obecnie',
        role: 'Właścicielka Biura Rachunkowego',
        company: `${name} Rachunkowość i Doradztwo`,
        description: 'Prowadzenie ksiąg rachunkowych, KPiR, rozliczenia VAT, reprezentowanie klientów przed Urzędami Skarbowymi i ZUS.'
      }
    ]
  },
  {
    id: 'chef',
    title: 'Kucharz / Szef Kuchni / Catering',
    categoryId: 'craft',
    emoji: '👨‍🍳',
    requiredAll: ['gotowanie'],
    anyOf: ['kuchnia', 'jedzenie', 'kucharz', 'catering', 'przepisy', 'potrawy', 'restauracja', 'smaki', 'menu', 'wypieki', 'szef kuchni', 'pieczenie', 'gotowanie'],
    bioTemplate: (name, answers) => `Profesjonalny szef kuchni i kreator smaków. Oferuję kompleksowe usługi cateringowe, warsztaty kulinarne oraz doradztwo gastronomiczne. Główne specjalizacje: ${answers.priceRange || 'catering eventowy, kolacje prywatne i nowoczesne menu'}. Dostępność: ${answers.workingHours || 'Zlecenia całoroczne, elastyczne godziny pracy'}.`,
    projects: [
      {
        id: 'proj-chef-1',
        title: 'Catering premium dla bankietu biznesowego',
        description: 'Zaprojektowanie, przygotowanie i serwowanie spersonalizowanego menu finger food oraz dań gorących dla 120 gości.',
        tags: ['Catering', 'Finger Food', 'Biznes'],
        type: 'manual'
      },
      {
        id: 'proj-chef-2',
        title: 'Autorskie warsztaty kulinarne: Kuchnia Śródziemnomorska',
        description: 'Przeprowadzenie serii praktycznych szkoleń z przygotowywania świeżych owoców morza, domowego makaronu i deserów.',
        tags: ['Warsztaty', 'Edukacja', 'Kuchnia Włoska'],
        type: 'manual'
      }
    ],
    certificates: [
      {
        id: 'cert-chef-1',
        title: 'Certyfikat Mistrza Sztuki Kulinarnej',
        issuer: 'Międzynarodowe Stowarzyszenie Gastronomiczne',
        date: '2024',
        description: 'Potwierdzenie najwyższych kwalifikacji w zakresie tradycyjnych i nowoczesnych technik kulinarnych oraz HACCP.',
        verified: true
      }
    ],
    timeline: [
      {
        id: 'time-chef-1',
        period: '2021 - Obecnie',
        role: 'Prywatny Szef Kuchni & Konsultant',
        company: `${name} Culinary Solutions`,
        description: 'Tworzenie unikalnych menu dla restauracji, obsługa przyjęć prywatnych oraz prowadzenie doradztwa produktowego.'
      }
    ]
  }
];

/**
 * Searches the professional dictionary and evaluates keywords to find the most specific match.
 */
export function findBestProfession(inputText: string): DictionaryProfession | undefined {
  if (!inputText || inputText.trim() === '') return undefined;
  
  const normalizedInput = normalizeText(inputText);
  
  let bestProf: DictionaryProfession | undefined = undefined;
  let maxScore = 0;
  
  for (const prof of professionalDictionary) {
    let score = 0;
    
    // 1. Required ALL check (yields large bonus)
    if (prof.requiredAll && prof.requiredAll.length > 0) {
      const allMatched = prof.requiredAll.every(kw => {
        const normKw = normalizeText(kw);
        return normalizedInput.includes(normKw);
      });
      if (allMatched) {
        score += 35; // Significant bonus for exact intersection (e.g. "ogród" + "podlewanie")
      }
    }
    
    // 2. Any of check (incremental points per keyword)
    if (prof.anyOf && prof.anyOf.length > 0) {
      for (const kw of prof.anyOf) {
        const normKw = normalizeText(kw);
        if (normalizedInput.includes(normKw)) {
          score += 6;
        }
      }
    }

    // 3. Exact title check
    const normTitle = normalizeText(prof.title);
    if (normalizedInput.includes(normTitle)) {
      score += 25;
    }
    
    if (score > maxScore && score >= 6) { // Requires a minimum keyword match
      maxScore = score;
      bestProf = prof;
    }
  }
  
  return bestProf;
}

export interface MatchedProfessionResult {
  profession: DictionaryProfession;
  confidence: number;
  relativePercentage: number;
}

/**
 * Searches the professional dictionary and evaluates keywords to find the top 3 matches with confidence scores and relative probabilities.
 */
export function findTopMatchedProfessions(inputText: string): MatchedProfessionResult[] {
  if (!inputText || inputText.trim() === '') return [];
  
  const normalizedInput = normalizeText(inputText);
  const results: { profession: DictionaryProfession; confidence: number; score: number }[] = [];
  
  for (const prof of professionalDictionary) {
    let score = 0;
    
    // 1. Required ALL check (yields large bonus)
    if (prof.requiredAll && prof.requiredAll.length > 0) {
      const allMatched = prof.requiredAll.every(kw => {
        const normKw = normalizeText(kw);
        return normalizedInput.includes(normKw);
      });
      if (allMatched) {
        score += 35; // Significant bonus for exact intersection (e.g. "ogród" + "podlewanie")
      }
    }
    
    // 2. Any of check (incremental points per keyword)
    if (prof.anyOf && prof.anyOf.length > 0) {
      for (const kw of prof.anyOf) {
        const normKw = normalizeText(kw);
        if (normalizedInput.includes(normKw)) {
          score += 6;
        }
      }
    }

    // 3. Exact title check
    const normTitle = normalizeText(prof.title);
    if (normalizedInput.includes(normTitle)) {
      score += 25;
    }
    
    if (score >= 6) { // Requires a minimum keyword match
      const confidence = Math.min(score / 50, 1.0);
      results.push({
        profession: prof,
        confidence,
        score
      });
    }
  }
  
  // Sort descending by score
  results.sort((a, b) => b.score - a.score);
  
  const topThree = results.slice(0, 3);
  const totalScore = topThree.reduce((sum, item) => sum + item.score, 0);
  
  return topThree.map(item => {
    const relativePercentage = totalScore > 0 
      ? Math.round((item.score / totalScore) * 100) 
      : 100;
    return {
      profession: item.profession,
      confidence: item.confidence,
      relativePercentage
    };
  });
}

/**
 * Classifies industry and assigns appropriate Category.
 * Dynamically updates with matched profession metadata if found.
 */
export function classifyIndustry(inputText: string): IndustryCategory {
  if (!inputText || inputText.trim() === '') {
    return industryCategories.find(c => c.id === 'general') || industryCategories[industryCategories.length - 1];
  }

  // First check our detailed professional combination dictionary
  const bestProf = findBestProfession(inputText);
  if (bestProf) {
    const category = industryCategories.find(c => c.id === bestProf.categoryId);
    if (category) {
      return {
        ...category,
        matchedProfession: {
          id: bestProf.id,
          title: bestProf.title,
          emoji: bestProf.emoji
        }
      };
    }
  }

  // Fallback to standard single keyword matches
  const cleanInput = normalizeText(inputText);
  let bestCategory = industryCategories.find(c => c.id === 'general') || industryCategories[industryCategories.length - 1];
  let maxMatches = 0;

  for (const category of industryCategories) {
    if (category.id === 'general') continue;
    
    let matches = 0;
    for (const keyword of category.keywords) {
      const normKw = normalizeText(keyword);
      if (cleanInput.includes(normKw)) {
        matches++;
      }
    }
    
    if (matches > maxMatches) {
      maxMatches = matches;
      bestCategory = category;
    }
  }

  return bestCategory;
}

/**
 * Generates custom seed dataset tailored exactly to the detected sub-profession
 * or selected category, complete with custom bio, projects, and certificates.
 */
export function getSeedDataForCategory(
  categoryId: IndustryCategory['id'],
  answers: { [key: string]: string },
  name: string,
  accentColor: string,
  focusInput?: string, // Exposes user's free text for detailed sub-profession matches
  customProfessionId?: string // Supports manual override selection
): {
  portfolioBio: string;
  projects: Project[];
  certificates: Certificate[];
  timeline: TimelineItem[];
  icons: DesktopIcon[];
  additionalConfig: {
    phone?: string;
    address?: string;
    instagramUsername?: string;
    githubUsername?: string;
    linkedinUsername?: string;
  };
} {
  const bioName = name || 'Mój Profil';
  let portfolioBio = '';
  let projects: Project[] = [];
  let certificates: Certificate[] = [];
  let timeline: TimelineItem[] = [];
  const additionalConfig: any = {};

  // Try matching a highly specific sub-profession from the dictionary or use custom overridden profession id
  const matchedProf = customProfessionId 
    ? professionalDictionary.find(p => p.id === customProfessionId)
    : (focusInput ? findBestProfession(focusInput) : undefined);
  
  // If we matched a specific profession AND it belongs to the selected category (preventing category-switcher conflicts)
  if (matchedProf && matchedProf.categoryId === categoryId) {
    portfolioBio = matchedProf.bioTemplate(bioName, answers);
    
    // Tailor additional configurations
    if (categoryId === 'craft' || categoryId === 'gardening' || categoryId === 'agriculture') {
      additionalConfig.phone = answers.phone || undefined;
      additionalConfig.address = answers.address || undefined;
    }
    if (categoryId === 'creative') {
      additionalConfig.instagramUsername = answers.instagramUsername || undefined;
    }
    if (categoryId === 'business') {
      additionalConfig.linkedinUsername = answers.linkedinUsername || undefined;
    }
    if (categoryId === 'tech') {
      additionalConfig.githubUsername = answers.githubUsername || undefined;
      additionalConfig.linkedinUsername = answers.linkedinUsername || undefined;
    }

    projects = matchedProf.projects;
    certificates = matchedProf.certificates;
    
    // Inject name dynamically into timeline item companies
    timeline = matchedProf.timeline.map(item => ({
      ...item,
      company: item.company.includes('${name}') ? item.company.replace('${name}', bioName) : item.company
    }));

  } else {
    // Fallback to standard category generic data generators
    switch (categoryId) {
      case 'tech':
        portfolioBio = `Jestem specjalistą IT. Moje główne technologie to: ${answers.techStack || 'React, TypeScript, Node.js'}. Aktualnie posiadam poziom doświadczenia: ${answers.experienceLevel || 'Mid Fullstack'}.`;
        additionalConfig.githubUsername = answers.githubUsername || undefined;
        additionalConfig.linkedinUsername = answers.linkedinUsername || undefined;
        
        projects = [
          {
            id: 'proj-1',
            title: 'Cyber Security Scanner',
            description: 'Skaner podatności w chmurze oparty o architekturę bezserwerową oraz automatyczne generowanie raportów PDF.',
            stars: 120,
            lastSync: 'Przed chwilą',
            tags: ['React', 'TypeScript', 'Node.js', 'AWS'],
            type: 'manual'
          },
          {
            id: 'proj-2',
            title: 'Immersive Dashboard Engine',
            description: 'Trójwymiarowy panel analityczny z dynamicznym renderowaniem danych o dużej częstotliwości.',
            stars: 345,
            lastSync: '10 minut temu',
            tags: ['TypeScript', 'Tailwind CSS', 'D3.js'],
            type: 'github'
          }
        ];

        certificates = [
          {
            id: 'cert-1',
            title: 'Google Professional Cloud Developer',
            issuer: 'Google Cloud',
            date: '2025',
            description: 'Projektowanie i wdrażanie wysoce skalowalnych systemów na Google Cloud Platform.',
            verified: true
          }
        ];

        timeline = [
          {
            id: 'time-1',
            period: '2024 - Obecnie',
            role: `${answers.experienceLevel || 'Mid'} Developer`,
            company: 'Software Enterprise Corp',
            description: 'Tworzenie aplikacji webowych w nowoczesnych technologiach, optymalizacja kodu i integracje API.'
          }
        ];
        break;

      case 'craft':
        portfolioBio = `Oferuję fachowe i rzetelne usługi lokalne. Moja specjalność to prace montażowe, instalacyjne i wykończeniowe. Sposób wyceny: ${answers.priceRange || 'indywidualna wycena'}. Godziny pracy: ${answers.workingHours || 'Pon-Pt: 8-16'}. Zapraszam do kontaktu!`;
        additionalConfig.phone = answers.phone || undefined;
        additionalConfig.address = answers.address || undefined;

        projects = [
          {
            id: 'proj-1',
            title: 'Kompleksowe wykończenie domu 140m2',
            description: 'Położenie gładzi szpachlowych, malowanie ścian, ułożenie paneli podłogowych oraz montaż oświetlenia sufitowego.',
            tags: ['Malowanie', 'Wykończenia', 'Panele'],
            type: 'manual'
          },
          {
            id: 'proj-2',
            title: 'Montaż nowoczesnej kuchni na wymiar',
            description: 'Precyzyjna instalacja szafek kuchennych, osadzenie blatów drewnianych oraz podłączenie sprzętu AGD pod zabudowę.',
            tags: ['Stolarka', 'Montaż AGD', 'Kuchnie'],
            type: 'manual'
          }
        ];

        certificates = [
          {
            id: 'cert-1',
            title: 'Certyfikat Autoryzowanego Instalatora',
            issuer: 'Stowarzyszenie Wykonawców Budowlanych',
            date: '2024',
            description: 'Potwierdzenie najwyższych standardów montażu i stosowania nowoczesnych materiałów izolacyjnych.',
            verified: true
          }
        ];

        timeline = [
          {
            id: 'time-1',
            period: '2022 - Obecnie',
            role: 'Właściciel / Główny Wykonawca',
            company: `${bioName} - Usługi Remontowo-Budowlane`,
            description: 'Niezależna działalność na rynku lokalnym, setki zadowolonych klientów i dbałość o najmniejsze detale.'
          }
        ];
        break;

      case 'agriculture':
        portfolioBio = `Prowadzę gospodarstwo rolne. Co jest głównym produktem: ${answers.farmType || 'naturalne produkty ekologiczne'}. Wielkość gospodarstwa: ${answers.farmSize || 'tradycyjna gospodarka rodzinna'}.`;
        additionalConfig.phone = answers.phone || undefined;
        additionalConfig.address = answers.address || undefined;

        projects = [
          {
            id: 'proj-1',
            title: 'Żniwa i zbiór upraw zbożowych',
            description: 'Zarządzanie tradycyjną polską gospodarką, wprowadzanie zrównoważonych metod agrotechnicznych i sprzedaż bezpośrednia.',
            tags: ['Zboża', 'Żniwa', 'Uprawa'],
            type: 'manual'
          },
          {
            id: 'proj-2',
            title: 'Wytwórstwo tradycyjnych serów wiejskich',
            description: 'Produkcja naturalnych serów z mleka od krów z wolnego wybiegu, według starej receptury babci.',
            tags: ['Eko-produkty', 'Wyroby', 'Sery'],
            type: 'manual'
          }
        ];

        certificates = [
          {
            id: 'cert-1',
            title: 'Atest Ekologiczny Żywności Bio',
            issuer: 'Krajowe Stowarzyszenie Eko-Roślin',
            date: '2024',
            description: 'Potwierdzenie braku stosowania sztucznych nawozów chemicznych i pestycydów.',
            verified: true
          }
        ];

        timeline = [
          {
            id: 'time-1',
            period: '2018 - Obecnie',
            role: 'Gospodarz',
            company: `Gospodarstwo Rolne ${bioName}`,
            description: 'Nadzór nad całorocznym cyklem wegetacyjnym, agrotechnika pól uprawnych, dbanie o tradycję rodzinną.'
          }
        ];
        break;

      case 'gardening':
        portfolioBio = `Specjalizuję się w profesjonalnym projektowaniu ogrodów i pielęgnacji terenów zielonych. Świadczone usługi: ${answers.gardenServices || 'kompleksowe projektowanie ogrodów, pielęgnacja trawników, podlewanie roślin i automatyczne nawadnianie'}. Dostępność: ${answers.seasonalAvailability || 'Sezon od wczesnej wiosny do późnej jesieni'}.`;
        additionalConfig.phone = answers.phone || undefined;
        additionalConfig.address = answers.address || undefined;

        projects = [
          {
            id: 'proj-1',
            title: 'Projekt i Realizacja Ogrodu Sensorycznego',
            description: 'Dobór roślin miododajnych, ziół, montaż automatycznego systemu podlewania kropelkowego oraz ścieżek z naturalnego kamienia.',
            tags: ['Projektowanie ogrodów', 'Systemy podlewania', 'Zieleń'],
            type: 'manual'
          },
          {
            id: 'proj-2',
            title: 'Renowacja i Pielęgnacja Trawnika Rezydencyjnego',
            description: 'Kompleksowa wertykulacja, nawożenie organiczne, dosiew trawy oraz optymalizacja harmonogramu nawadniania pod automatyczne zraszacze.',
            tags: ['Pielęgnacja trawnika', 'Nawożenie', 'Wertykulacja'],
            type: 'manual'
          }
        ];

        certificates = [
          {
            id: 'cert-1',
            title: 'Certyfikowany Projektant Ogrodów i Terenów Zieleni',
            issuer: 'Polskie Stowarzyszenie Architektów Krajobrazu',
            date: '2024',
            description: 'Profesjonalne planowanie przestrzenne ogrodów przydomowych i instalacja systemów nawadniających.',
            verified: true
          }
        ];

        timeline = [
          {
            id: 'time-1',
            period: '2021 - Obecnie',
            role: 'Główny Ogrodnik / Architekt Krajobrazu',
            company: `${bioName} - Ogrody i Pielęgnacja`,
            description: 'Zarządzanie projektami ogrodowymi, profesjonalne doradztwo w doborze roślinności, montaż i konserwacja nowoczesnych systemów podlewania.'
          }
        ];
        break;

      case 'creative':
        portfolioBio = `Zajmuję się twórczością kreatywną. Moja główna pasja i praca to: ${answers.creativeFocus || 'Fotografia, Grafika cyfrowa'}. Pracuję głównie na narzędziach: ${answers.equipment || 'Figma, Photoshop, profesjonalny aparat'}. Wolne terminy: ${answers.bookingText || 'Zapraszam do rezerwacji mailowej.'}`;
        additionalConfig.instagramUsername = answers.instagramUsername || undefined;

        projects = [
          {
            id: 'proj-1',
            title: 'Kadry Światłocienia - Autorska sesja portretowa',
            description: 'Eksperymentalny projekt fotograficzny badający zjawisko kontrastu naturalnego światła słonecznego we wnętrzach loftowych.',
            tags: ['Fotografia', 'Portret', 'Światłocień'],
            type: 'manual'
          },
          {
            id: 'proj-2',
            title: 'Projekt identyfikacji wizualnej marki "Aura"',
            description: 'Projekt logo, księgi znaku, materiałów reklamowych i interfejsu aplikacji dla marki kosmetyków ekologicznych.',
            tags: ['Branding', 'UI/UX Design', 'Figma'],
            type: 'manual'
          }
        ];

        certificates = [
          {
            id: 'cert-1',
            title: 'Wyróżnienie na Festiwalu Grafiki i Obrazu',
            issuer: 'Krajowe Stowarzyszenie Artystów',
            date: '2025',
            description: 'Srebrny medal w kategorii cyfrowej manipulacji obrazem i fotografii artystycznej.',
            verified: true
          }
        ];

        timeline = [
          {
            id: 'time-1',
            period: '2021 - Obecnie',
            role: 'Freelance Art Director',
            company: 'Studio Kreatywne ' + bioName,
            description: 'Współpraca z markami modowymi, wydawnictwami i klientami indywidualnymi w zakresie tworzenia estetycznych materiałów graficznych i foto.'
          }
        ];
        break;

      case 'business':
        portfolioBio = `Dostarczam profesjonalne doradztwo biznesowe i wsparcie strategiczne w zakresie: ${answers.consultingType || 'Finanse, marketing B2B, optymalizacja procesów'}. Doświadczenie: ${answers.experienceYears || 'Wieloletnie doświadczenie doradcze'}. Moja metoda pracy: ${answers.consultingMethod || 'Konsultacje zdalne i warsztaty'}.`;
        additionalConfig.linkedinUsername = answers.linkedinUsername || undefined;

        projects = [
          {
            id: 'proj-1',
            title: 'Optymalizacja procesów i wzrost marży o 32%',
            description: 'Dogłębny audyt operacyjny dla średniej wielkości przedsiębiorstwa produkcyjnego, redukcja kosztów logistyki i automatyzacja raportowania.',
            tags: ['Doradztwo', 'Optymalizacja', 'Finanse'],
            type: 'manual'
          },
          {
            id: 'proj-2',
            title: 'Wdrożenie strategii marketingowej B2B',
            description: 'Stworzenie od zera procesów pozyskiwania klientów (lead generation) dla firmy IT, skutkujące wzrostem zapytań o 150%.',
            tags: ['Strategia', 'Marketing B2B', 'Konsulting'],
            type: 'manual'
          }
        ];

        certificates = [
          {
            id: 'cert-1',
            title: 'Akredytowany Trener Biznesu ICC',
            issuer: 'International Coaching Community',
            date: '2023',
            description: 'Międzynarodowy certyfikat uprawniający do profesjonalnego prowadzenia sesji doradczych i coachingu biznesowego.',
            verified: true
          }
        ];

        timeline = [
          {
            id: 'time-1',
            period: '2023 - Obecnie',
            role: 'Główny Konsultant Biznesowy',
            company: `${bioName} Consulting`,
            description: 'Dostarczanie mierzalnych rezultatów dla firm handlowych i usługowych, doradztwo zarządcom oraz szkolenia z efektywności zespołów.'
          }
        ];
        break;

      default: // general
        portfolioBio = `Cześć! Witam na mojej oficjalnej wizytówce internetowej. ${answers.tagline || 'Pasjonat innowacji i kreatywnego działania'}. O mnie: ${answers.aboutMeText || 'Interesuję się nowymi trendami, podróżami i tworzeniem przydatnych projektów.'} Kontakt mailowy: ${answers.contactEmail || 'mój-email@domena.com'}`;
        
        projects = [
          {
            id: 'proj-1',
            title: 'Moja autorska strona i blog podróżniczy',
            description: 'Kolekcja relacji z podróży po Europie, bogata w porady dla backpackerów oraz praktyczne wskazówki dotyczące taniego podróżowania.',
            tags: ['Blog', 'Podróże', 'Hobby'],
            type: 'manual'
          }
        ];

        certificates = [
          {
            id: 'cert-1',
            title: 'Certyfikat Efektywnej Organizacji i Zarządzania',
            issuer: 'Akademia Umiejętności Osobistych',
            date: '2024',
            description: 'Szkolenie z zakresu planowania czasu pracy, samodzielności projektowej i komunikacji bezprzemocowej.',
            verified: true
          }
        ];

        timeline = [
          {
            id: 'time-1',
            period: '2024 - Obecnie',
            role: 'Niezależny Twórca / Pasjonat',
            company: 'Własne Inicjatywy Osobiste',
            description: 'Realizacja projektów hobbystycznych, podróże i ciągłe poszerzanie horyzontów w różnych dziedzinach.'
          }
        ];
        break;
    }
  }

  // Map icons based on category
  const icons: DesktopIcon[] = getDesktopIconsForCategory(categoryId, accentColor);

  return {
    portfolioBio,
    projects,
    certificates,
    timeline,
    icons,
    additionalConfig
  };
}

function getDesktopIconsForCategory(categoryId: IndustryCategory['id'], accentColor: string): DesktopIcon[] {
  const baseIcons = [
    {
      id: 'icon-bio',
      label: categoryId === 'tech' ? 'O mnie (Bio)' : categoryId === 'craft' ? 'O firmie' : categoryId === 'agriculture' ? 'Gospodarstwo' : categoryId === 'gardening' ? 'Mój Ogród' : categoryId === 'creative' ? 'Profil twórcy' : categoryId === 'business' ? 'Profil eksperta' : 'O mnie',
      appId: 'bio',
      icon: 'user',
      color: `from-purple-500/30 to-purple-500/10 hover:shadow-purple-500/20 border-purple-500/20`,
      x: 0,
      y: 0
    },
    {
      id: 'icon-projects',
      label: categoryId === 'tech' ? 'Moje Projekty' : categoryId === 'craft' ? 'Realizacje prac' : categoryId === 'agriculture' ? 'Nasze Plony' : categoryId === 'gardening' ? 'Aranżacje Ogrodów' : categoryId === 'creative' ? 'Moje Prace' : categoryId === 'business' ? 'Case Studies' : 'Galeria i Projekty',
      appId: 'projects',
      icon: 'folder',
      color: `from-cyan-500/30 to-cyan-500/10 hover:shadow-cyan-500/20 border-cyan-500/20`,
      x: 0,
      y: 1
    },
    {
      id: 'icon-certificates',
      label: categoryId === 'tech' ? 'Certyfikaty IT' : categoryId === 'craft' ? 'Uprawnienia' : categoryId === 'agriculture' ? 'Atesty Eko' : categoryId === 'gardening' ? 'Certyfikaty Zieleni' : categoryId === 'creative' ? 'Wyróżnienia' : categoryId === 'business' ? 'Certyfikaty' : 'Osiągnięcia',
      appId: 'certificates',
      icon: 'award',
      color: `from-pink-500/30 to-pink-500/10 hover:shadow-pink-500/20 border-pink-500/20`,
      x: 1,
      y: 0
    },
    {
      id: 'icon-contact',
      label: 'Napisz do mnie',
      appId: 'contact',
      icon: 'mail',
      color: `from-emerald-500/30 to-emerald-500/10 hover:shadow-emerald-500/20 border-emerald-500/20`,
      x: 1,
      y: 1
    },
    {
      id: 'icon-settings',
      label: 'Personalizacja',
      appId: 'settings',
      icon: 'settings',
      color: `from-purple-500/30 to-purple-500/10 hover:shadow-purple-500/20 border-purple-500/20`,
      x: 1,
      y: 2
    },
    {
      id: 'icon-wizard',
      label: 'Ustawienia Systemowe',
      appId: 'wizard',
      icon: 'sparkles',
      color: `from-amber-500/30 to-amber-500/10 hover:shadow-amber-500/20 border-amber-500/20`,
      x: 2,
      y: 0
    }
  ];

  // For specific categories, add/modify widgets or icons
  if (categoryId === 'business') {
    baseIcons.push({
      id: 'icon-calendar',
      label: 'Kalendarz Google',
      appId: 'calendar',
      icon: 'calendar',
      color: 'from-emerald-500/30 to-emerald-500/10 hover:shadow-emerald-500/20 border-emerald-500/20',
      x: 2,
      y: 1
    });
  } else if (categoryId === 'tech') {
    baseIcons.push({
      id: 'icon-gdrive',
      label: 'Google Drive',
      appId: 'gdrive',
      icon: 'hardDrive',
      color: 'from-blue-500/30 to-blue-500/10 hover:shadow-blue-500/20 border-blue-500/20',
      x: 2,
      y: 1
    });
  }

  return baseIcons;
}
