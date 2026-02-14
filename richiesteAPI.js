export class Libro{
  constructor(dati){
    // === OpenLibrary ===
    this.id = dati.key; 
    this.titolo = dati.title;
    this.anno = dati.first_publish_year || "N/A";
    this.autori = dati.author_name ? dati.author_name.join(", ") : "Autore sconosciuto";
    this.autorePrincipale = dati.author_name?.[0] || "Autore sconosciuto";
    this.isbn = (dati.isbn && dati.isbn.length > 0) ? dati.isbn[0] : null;
    this.soggetti = dati.subject ? dati.subject.slice(0, 5) : [];
    this.coverId = dati.cover_i;
    
    // === Google Books ===
    this.descrizione = null;
    this.editore = null;
    this.pagine = null;
    this.lingua = null;
    this.previewLink = null;

    this._dettagliCaricati = false; // flag cache
  }

  getCoverUrl(size = 'M') {
    const validSizes = ['S', 'M', 'L'];
    if (!validSizes.includes(size)) {
       throw new TypeError("la grandezza dell'immagine deve essere S, M o L");
    }
    
    return this.coverId 
      ? `https://covers.openlibrary.org/b/id/${this.coverId}-${size}.jpg`
      : "https://placehold.co/150x200/eeeeee/555555?text=No+Cover";
  }

  async getDettagli() {
    if(this._dettagliCaricati) return;
    let URL = "";

    try{
      let query = "";
      if(this.isbn) query = `isbn:${this.isbn}`;
      else query = `intitle:${this.titolo}+inauthor:${this.autorePrincipale}`;

      URL = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`

      const response = await fetch(URL);
      const data = await response.json();
      if (!data.items || data.items.length === 0) throw new Error("nessun risultato google books");

      const _libro = data.items[0].volumeInfo;
      this.descrizione = _libro.description || "Nessuna descrizione";
      this.editore = _libro.publisher || "N/A";
      this.pagine = _libro.pageCount || null;
      this.lingua = _libro.language || null;
      this.previewLink = _libro.previewLink || null;

      this._dettagliCaricati = true;
      
    }catch (e) {
      this.descrizione ??= "Nessuna descrizione";
      this.editore ??= "N/A";
      this._dettagliCaricati = true;

      console.error("Errore nella scoperta:", e);
      console.error(URL);
    }
  }
}

export async function cercaLibro(URLrichiesta) {

  try {
    console.log(URLrichiesta);
    const response = await fetch(URLrichiesta);
    if (!response.ok) throw new Error("Network response was not ok");
    
    const data = await response.json();
    
    return data.docs.map(item => new Libro(item));
  } catch (e) {
    console.error("Errore nella scoperta:", e);
    console.error(URLrichiesta);
    return [];
  }
}

export function generaURL(filtri = {}, limite, pagina){
  if(!Number.isInteger(limite) || limite <= 0) throw new TypeError("Il limite deve essere un numero intero maggiore di 0");
  if(!Number.isInteger(pagina) || pagina <= 0) throw new TypeError("La pagina deve essere un numero intero maggiore di 0");

  const queryParams = new URLSearchParams();
  if (filtri.soggetto) queryParams.append("subject", filtri.soggetto);
  if (filtri.autore) queryParams.append("author", filtri.autore);
  if (filtri.titolo) queryParams.append("title", filtri.titolo);
  if(queryParams.size === 0 && filtri.anno){
    queryParams.append("q", "random");
    queryParams.append("first_publish_year", filtri.anno);
  }
  else if (filtri.anno) queryParams.append("first_publish_year", filtri.anno);

  queryParams.append("limit", limite);
  queryParams.append("page", pagina);
  if (queryParams.size == 2)  queryParams.append("q", "random");
  
  return `https://openlibrary.org/search.json?${queryParams}`;
}

export async function getNumLibri(URL){
  try{
    const response = await fetch(URL)
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();

    console.log(data.numFound)
    return data.numFound;
  }catch (e) {
    console.error("Errore nella scoperta:", e);
    console.error(URL);
    return 1;
  }
}

