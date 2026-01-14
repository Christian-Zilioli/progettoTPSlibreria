import fetch from "node-fetch";

async function getOdds() {
  try {
    const response = await fetch("https://sports-api.cloudbet.com/pub/v2/odds/sports/soccer", {
      headers: {
        "X-API-Key": process.env.CLOUDBET_KEY,
        "Content-Type": "application/json"
      }
    });
    const odds = await response.json();
    console.log(odds);
  } catch (err) {
    console.error("Errore API:", err);
  }
}

