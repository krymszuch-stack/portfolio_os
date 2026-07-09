import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Increase body size limit to support file uploads for OCR (PDF, PNG, etc.)
  app.use(express.json({ limit: "25mb" }));

  // Initialize GoogleGenAI client (Telemetry requires User-Agent header)
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // CV / LinkedIn profile AI parsing compiler route with OCR & synonym bounding
  app.post("/api/parse-cv", async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      const { text, fileData, mimeType } = req.body;

      if (!text && !fileData) {
        return res.status(400).json({ error: "Brak danych tekstowych lub pliku CV do analizy." });
      }

      let contents: any[] = [];

      const systemInstruction = `
        Jesteś zaawansowanym asystentem i kompilatorem PortfolioOS. Twój cel to przeanalizowanie CV (tekstu, profilu LinkedIn, pliku PDF lub zrzutu ekranu/obrazu) i przygotowanie ustrukturyzowanych danych do bazy systemu operacyjnego portfolio.
        
        Zasady kompilacji i OCR:
        1. Jeśli przekazano plik (fileData), dokonaj najpierw dokładnego OCR tekstu i zidentyfikuj wszystkie sekcje.
        2. Przeanalizuj każde słowo, przetłumacz sekcje na elegancki i profesjonalny język polski.
        3. Każdy element (umiejętność, technologia, rola) musi być szczegółowo opisany oraz zawierać powiązaną tablicę synonimów (synonyms), które pozwolą później na łączenie zmiennych (np. "React" ma synonimy ["ReactJS", "React.js", "Frontend", "JSX", "JavaScript UI"]).
        
        Schemat wyjściowy (zwróć TYLKO czysty obiekt JSON zgodny z tym szablonem, bez dodatkowych komentarzy czy kodu markdown):
        {
          "bio": {
            "fullName": "Imię i nazwisko",
            "title": "Tytuł zawodowy (np. Senior Full-Stack Engineer)",
            "biography": "Profesjonalny, inspirujący biogram po polsku",
            "skills": [
              {
                "name": "React",
                "level": "expert" lub "advanced" lub "intermediate",
                "synonyms": ["ReactJS", "React.js", "Frontend", "JSX"]
              }
            ],
            "contactInfo": {
              "email": "kontakt@example.com",
              "phone": "123-456-789",
              "location": "Warszawa, Polska",
              "linkedin": "",
              "github": ""
            }
          },
          "projects": [
            {
              "title": "Nazwa projektu / systemu",
              "description": "Szczegółowy opis projektu, Twojej roli i efektów biznesowych lub technicznych po polsku",
              "role": "Główna rola (np. Lead Developer)",
              "techStack": ["React", "TypeScript", "Node.js"],
              "synonyms": ["Vite", "SPA", "Frontend Architecture"]
            }
          ],
          "certificates": [
            {
              "title": "Nazwa certyfikatu lub szkolenia",
              "issuer": "Instytucja certyfikująca (np. Google)",
              "date": "Rok uzyskania (np. 2025)",
              "url": ""
            }
          ],
          "timeline": [
            {
              "year": "Przedział czasowy (np. 2024 - Obecnie)",
              "role": "Stanowisko",
              "company": "Nazwa firmy / organizacji",
              "description": "Opis głównych obowiązków i osiągnięć po polsku"
            }
          ]
        }
      `;

      if (fileData && mimeType) {
        // Multi-modal support (PDF, Image) for OCR
        contents.push({
          inlineData: {
            data: fileData,
            mimeType: mimeType
          }
        });
        contents.push({
          text: `Przeanalizuj załączony dokument CV/LinkedIn za pomocą OCR i dopasuj do schematu. ${text ? "Dodatkowe informacje uzupełniające: " + text : ""}`
        });
      } else {
        // Text content parser
        contents.push({
          text: `Wyciągnij dane z poniższego profilu lub tekstu CV i sformatuj jako JSON: \n\n${text}`
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json"
        }
      });

      const textOutput = response.text || "{}";
      const cleanJson = JSON.parse(textOutput.trim());
      res.json(cleanJson);
    } catch (error: any) {
      console.error("[COMPILER ERROR] Błąd przetwarzania CV:", error);
      res.status(500).json({ error: error.message || "Błąd wewnętrzny kompilatora CV." });
    }
  });

  // Serve static assets or use Vite's development middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SYSTEM RUNNING] PortfolioOS server started on http://0.0.0.0:${PORT}`);
  });
}

startServer();
