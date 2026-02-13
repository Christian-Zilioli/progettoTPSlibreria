export class Libro{
  constructor(data){
    this.id = data.key; 
    this.titolo = data.title;
    this.anno = data.first_publish_year || "N/A";
    this.autori = data.author_name ? data.author_name.join(", ") : "Autore sconosciuto";
    this.isbn = (data.isbn && data.isbn.length > 0) ? data.isbn[0] : null;
    this.soggetti = data.subject ? data.subject.slice(0, 5) : [];
    this.coverId = data.cover_i;
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
    console.Error(URLrichiesta);
    return [];
  }
}

export function generaURL(filtri = {}, limite, pagina){
  if(!Number.isInteger(limite) && limite <= 0) throw new TypeError("Il limite deve essere un numero intero maggiore di 0");
  if(!Number.isInteger(pagina) && pagina <= 0) throw new TypeError("La pagina deve essere un numero intero maggiore di 0");

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
  if(queryParams.size === 2)queryParams.append("q", "random");
  
  return `https://openlibrary.org/search.json?${queryParams}`;
}

export async function getNumLibri(URL){
  try{
    const response = await fetch(URL)
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();

    return data["numFound"];
  }catch (e) {
    console.error("Errore nella scoperta:", e);
    console.Error(URL);
    return 1;
  }
}
