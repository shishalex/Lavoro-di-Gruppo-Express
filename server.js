// Importa il framework Express per gestire le rotte e le richieste HTTP
const express = require('express');
// Importa il modulo 'fs' (File System) per leggere e scrivere file sul disco
const fs = require('fs');
// Importa il modulo 'path' per gestire correttamente i percorsi dei file tra diversi sistemi operativi
const path = require('path');
// Inizializza l'applicazione Express
const app = express();
// Definisce la porta su cui il server rimarrà in ascolto (3000)
const PORT = 3000;

// Middleware per permettere al server di interpretare i dati inviati in formato JSON
app.use(express.json());
// Middleware per interpretare i dati inviati tramite i form HTML (URL-encoded)
app.use(express.urlencoded({ extended: true }));
// Configura la cartella 'public' per servire file statici (HTML, CSS, JS lato client)
app.use(express.static('public'));

// Definisce il percorso assoluto del file JSON dove verranno salvati i dati degli utenti
const DATA_FILE = path.join(__dirname, 'utenti.json');

// Array di stringhe contenente frasi casuali per generare l'oroscopo degli utenti
const frasiOroscopo = [
    "Oggi la Luna favorisce i tuoi progetti più ambiziosi.",
    "Un incontro inaspettato cambierà la tua prospettiva settimanale.",
    "Prenditi un momento per te stesso: il corpo ne ha bisogno.",
    "Le stelle suggeriscono prudenza nelle spese oggi.",
    "L'energia creativa è al massimo, sfruttala per il lavoro!",
    "Una sorpresa positiva arriverà nel pomeriggio.",
    "La comunicazione sarà la chiave per risolvere un malinteso.",
    "Segui l’istinto: oggi ti guiderà nella direzione giusta.",
    "Un piccolo gesto gentile porterà grandi risultati.",
    "Potresti ricevere una notizia che aspettavi da tempo.",
    "La pazienza sarà la tua arma vincente in amore.",
    "Nuove opportunità professionali si stanno avvicinando.",
    "Evita discussioni inutili e mantieni la calma.",
    "Le stelle favoriscono nuovi inizi e decisioni coraggiose.",
    "Un vecchio amico potrebbe tornare a farsi sentire.",
    "È il momento giusto per pianificare un viaggio.",
    "La tua determinazione farà la differenza oggi.",
    "Ascolta di più e parla di meno: scoprirai qualcosa di importante.",
    "Una scelta fatta con il cuore si rivelerà vincente.",
    "La fortuna premia chi osa con saggezza."
];

// Funzione che calcola il segno zodiacale partendo da una data di nascita
function getSegnoZodiacale(data) {
    // Converte la stringa della data in un oggetto Date di JavaScript
    const d = new Date(data);
    // Estrae il giorno del mese (1-31)
    const giorno = d.getDate();
    // Estrae il mese (0-11, quindi aggiungiamo 1 per avere 1-12)
    const mese = d.getMonth() + 1;

    // Logica condizionale per restituire il segno zodiacale in base a mese e giorno
    if ((mese == 3 && giorno >= 21) || (mese == 4 && giorno <= 19)) return "Ariete";
    if ((mese == 4 && giorno >= 20) || (mese == 5 && giorno <= 20)) return "Toro";
    if ((mese == 5 && giorno >= 21) || (mese == 6 && giorno <= 20)) return "Gemelli";
    if ((mese == 6 && giorno >= 21) || (mese == 7 && giorno <= 22)) return "Cancro";
    if ((mese == 7 && giorno >= 23) || (mese == 8 && giorno <= 22)) return "Leone";
    if ((mese == 8 && giorno >= 23) || (mese == 9 && giorno <= 22)) return "Vergine";
    if ((mese == 9 && giorno >= 23) || (mese == 10 && giorno <= 22)) return "Bilancia";
    if ((mese == 10 && giorno >= 23) || (mese == 11 && giorno <= 21)) return "Scorpione";
    if ((mese == 11 && giorno >= 22) || (mese == 12 && giorno <= 21)) return "Sagittario";
    if ((mese == 12 && giorno >= 22) || (mese == 1 && giorno <= 19)) return "Capricorno";
    if ((mese == 1 && giorno >= 20) || (mese == 2 && giorno <= 18)) return "Acquario";
    // Se non rientra nei casi precedenti, restituisce Pesci
    return "Pesci";
}

// Rotta GET per restituire la lista completa degli utenti salvati
app.get('/api/utenti', (req, res) => {
    // Se il file JSON non esiste ancora, restituisce un array vuoto
    if (!fs.existsSync(DATA_FILE)) return res.json([]);
    // Legge il contenuto del file JSON dal disco
    const data = fs.readFileSync(DATA_FILE);
    // Converte il contenuto (stringa) in formato JSON e lo invia al client
    res.json(JSON.parse(data));
});

// Rotta POST per creare e salvare un nuovo utente
app.post('/api/utenti', (req, res) => {
    // Estrae i dati inviati dal corpo della richiesta (destrutturazione)
    const { nome, cognome, email, dataNascita } = req.body;
    // Crea l'oggetto del nuovo utente con ID univoco e dati calcolati
    const nuovoUtente = {
        id: Date.now(), // Usa il timestamp attuale come ID univoco
        nome,
        cognome,
        email,
        dataNascita,
        // Calcola il segno zodiacale richiamando la funzione dedicata
        segno: getSegnoZodiacale(dataNascita),
        // Estrae una frase casuale dall'array delle previsioni
        oroscopo: frasiOroscopo[Math.floor(Math.random() * frasiOroscopo.length)]
    };

    // Inizializza un array per contenere la lista degli utenti
    let utenti = [];
    // Se il file esiste già, lo legge e carica gli utenti esistenti nell'array
    if (fs.existsSync(DATA_FILE)) {
        utenti = JSON.parse(fs.readFileSync(DATA_FILE));
    }
    // Aggiunge il nuovo utente all'elenco
    utenti.push(nuovoUtente);
    // Sovrascrive il file JSON con l'array aggiornato (formattato con 2 spazi per leggibilità)
    fs.writeFileSync(DATA_FILE, JSON.stringify(utenti, null, 2));
    // Reindirizza l'utente alla home page dopo il salvataggio
    res.redirect('/');
});

// Rotta DELETE per eliminare un utente specifico tramite il suo ID
app.delete('/api/utenti/:id', (req, res) => {
    // Legge e interpreta i dati degli utenti dal file
    let utenti = JSON.parse(fs.readFileSync(DATA_FILE));
    // Crea un nuovo array escludendo l'utente che ha l'id corrispondente a quello passato nell'URL
    utenti = utenti.filter(u => u.id != req.params.id);
    // Salva l'array aggiornato (senza l'utente eliminato) sul file
    fs.writeFileSync(DATA_FILE, JSON.stringify(utenti, null, 2));
    // Risponde con lo stato 200 (OK) per confermare l'avvenuta eliminazione
    res.sendStatus(200);
});

// Avvia il server e lo mette in ascolto sulla porta definita
app.listen(PORT, () => console.log(`Server attivo su http://localhost:${PORT}`));
