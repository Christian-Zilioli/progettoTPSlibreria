class Libro{
  constructor(data){
    this.id = data.key; 
    this.titolo = data.title;
    this.anno = data.first_publish_year || "N/A";
    this.autori = data.author_name ? data.author_name.join(", ") : "Autore sconosciuto";
    this.isbn = (data.isbn && data.isbn.length > 0) ? data.isbn[0] : null;
    this.soggetti = data.subject ? data.subject.slice(0, 5) : [];
    this.coverId = data.cover_i;
  }
  getCoverUrl(size) {
    if(!size in 'SML') throw new TypeError("la grandezza dell immagine deve essere S, M o L");
    return this.coverId 
      ? `https://covers.openlibrary.org/b/id/${this.coverId}-${size}.jpg`
      : "https://via.placeholder.com/150x200?text=No+Cover";
  }
}

async function cercaLibro(filtri = {}, limite) {
  if(!Number.isInteger(limite)) throw new TypeError("Il limite deve essere un numero intero");

  const queryParams = new URLSearchParams();
  if (filtri.soggetto) queryParams.append("subject", filtri.soggetto);
  if (filtri.anno) queryParams.append("first_publish_year", filtri.anno);
  if (filtri.autore) queryParams.append("author", filtri.autore);
  if (filtri.titolo) queryParams.append("title", filtri.titolo);
  queryParams.append("limit", limite)
  
  if (queryParams.get("limit") === String(limite) && queryParams.size === 1) {
    queryParams.append("q", "random"); 
  }

  try {
    const response = await fetch(`https://openlibrary.org/search.json?${queryParams}`);
    if (!response.ok) throw new Error("Network response was not ok");
    
    const data = await response.json();
    
    return data.docs.map(item => new Libro(item));
  } catch (e) {
    console.error("Errore nella scoperta:", e);
    return [];
  }
}