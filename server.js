const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'utenti.json');

// Frasi random per l'oroscopo
const frasiOroscopo = [
    "Oggi la Luna favorisce i tuoi progetti più ambiziosi.",
    "Un incontro inaspettato cambierà la tua prospettiva settimanale.",
    "Prenditi un momento per te stesso: il corpo ne ha bisogno.",
    "Le stelle suggeriscono prudenza nelle spese oggi.",
    "L'energia creativa è al massimo, sfruttala per il lavoro!"
];

// Funzione per determinare il segno zodiacale
function getSegnoZodiacale(data) {
    const d = new Date(data);
    const giorno = d.getDate();
    const mese = d.getMonth() + 1;

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
    return "Pesci";
}

// Rotta per ottenere tutti gli utenti
app.get('/api/utenti', (req, res) => {
    if (!fs.existsSync(DATA_FILE)) return res.json([]);
    const data = fs.readFileSync(DATA_FILE);
    res.json(JSON.parse(data));
});

// Rotta per salvare un utente
app.post('/api/utenti', (req, res) => {
    const { nome, cognome, email, dataNascita } = req.body;
    const nuovoUtente = {
        id: Date.now(),
        nome,
        cognome,
        email,
        dataNascita,
        segno: getSegnoZodiacale(dataNascita),
        oroscopo: frasiOroscopo[Math.floor(Math.random() * frasiOroscopo.length)]
    };

    let utenti = [];
    if (fs.existsSync(DATA_FILE)) {
        utenti = JSON.parse(fs.readFileSync(DATA_FILE));
    }
    utenti.push(nuovoUtente);
    fs.writeFileSync(DATA_FILE, JSON.stringify(utenti, null, 2));
    res.redirect('/');
});

// Rotta per eliminare un utente
app.delete('/api/utenti/:id', (req, res) => {
    let utenti = JSON.parse(fs.readFileSync(DATA_FILE));
    utenti = utenti.filter(u => u.id != req.params.id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(utenti, null, 2));
    res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server attivo su http://localhost:${PORT}`));