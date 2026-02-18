#  Book Finder

Book Finder è un'applicazione web moderna e reattiva per la ricerca di libri, che integra dati provenienti da **Open Library** e  **Google Books API** . Il progetto permette di esplorare i libri di tendenza, effettuare ricerche mirate e visualizzare dettagli approfonditi come descrizioni, numero di pagine e valutazioni.

##  Funzionalità

* **Esplorazione Trend:** All'avvio, l'app mostra i libri più popolari della settimana tramite il sistema di trending di Open Library.
* **Ricerca Avanzata:** Filtra i libri per titolo, autore, anno di pubblicazione e genere (soggetto).
* **Paginazione:** Navigazione fluida tra i risultati della ricerca.
* **Caching Intelligente:** * Utilizza `sessionStorage` per memorizzare i trend settimanali, riducendo le chiamate API al ricaricamento della pagina.
  * Memorizza l'ultimo libro selezionato per permettere la visualizzazione dei dettagli in una pagina dedicata.
* **Integrazione API Multiple:**
  * **Open Library:** Usata per la ricerca principale, i trend e le copertine.
  * **Google Books:** Usata per arricchire la scheda libro con descrizioni, categorie, rating e link all'anteprima.

---

##  Struttura Tecnologica

Il progetto è sviluppato in  **JavaScript , HTML e CSS** seguendo un approccio a moduli.

### Architettura dei File

* `index.html`: Punto di ingresso principale con l'interfaccia di ricerca e la griglia dei risultati.
* `dettagli.html`: Pagina dedicata all'esposizione dettagliata di un singolo volume.
* `style.css`: Design system personalizzato con supporto per layout grid/flex e componenti UI (badge, loader, card).
* `richiesteAPI.js`: Modulo logico che contiene la classe `Libro` e tutte le funzioni di fetch asincrone.

---

## Logica del Codice

### La Classe `Libro`

Il cuore dell'applicazione è la classe `Libro`. Essa funge da "ponte" tra i diversi formati dati delle API.

* **Costruttore:** Normalizza i dati grezzi ricevuti da Open Library.
* **`getCoverUrl(size)`:** Genera dinamicamente l'URL della copertina gestendo i casi di immagine mancante.
* **`getDettagli()`:** Metodo asincrono che interroga Google Books (usando l'ISBN o la combinazione Titolo+Autore) per popolare i dati mancanti come la descrizione e il rating.

### Logica del Modulo `richiesteAPI.js`

* **`generaURL(filtri, limite, pagina)`** Costruisce l'URL di ricerca per Open Library.
  **Parametri** : `filtri` (Object: titolo, autore, anno, soggetto), `limite` (Number), `pagina` (Number).
  **Ritorna** : `String` (URL completo di query string).
* **`cercaLibro(URLrichiesta)`** Esegue la fetch e modella i dati della ricerca.
  **Parametri** : `URLrichiesta` (String).
  **Ritorna** : `Promise<Libro[]>` (Array di istanze della classe `Libro`).
* **`getNumLibri(URL)`** Recupera il totale dei risultati disponibili per una query.
  **Parametri** : `URL` (String).
  **Ritorna** : `Promise<Number>` (valore `numFound`).
* **`cercaLibriTrend(periodo)`** Recupera i libri popolari del momento.
  **Parametri** : `periodo` (String: "daily", "weekly" o "monthly").
  **Ritorna** : `Promise<Libro[]>` (Array di istanze della classe `Libro`).
* **`Libro.getDettagli()`** Arricchisce l'istanza corrente con dati extra da Google Books.
  **Parametri** : Nessuno (utilizza `this.isbn`, `this.titolo` e `this.autorePrincipale`).
  **Ritorna** : `Promise<void>` (aggiorna le proprietà dell'oggetto `this`).

### Gestione degli Stati

* **Loading:** Un loader animato viene mostrato durante ogni transazione asincrona per migliorare la User Experience.
* **Error Handling:** Gestione dei fallimenti di rete o risultati vuoti tramite messaggi all'utente e log in console.

## Sviluppi Futuri

* [ ] Aggiunta di una sezione "Preferiti" salvata nel `localStorage`.
* [ ] Implementazione di un sistema di autocomplete reale per il campo "Genere".
* [ ] Dark Mode persistente basata sulla preferenza dell'utente.

---

## Licenza

Progetto creato a scopo didattico. Le API utilizzate appartengono ai rispettivi fornitori (Open Library & Google).

progetto creato da Zilioli Christian e Mattia Esborni
