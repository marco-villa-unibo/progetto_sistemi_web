### Pre-requisites

- [Node.js](https://nodejs.org/en/download) v16 or above

### Instructions

1. Clone the repository with this branch. (progetto privato)

git clone https://github.com/marco-villa-unibo/progetto_sistemi_web.git

2. Install dependencies.

npm install

3. Run Express.js server. (dal folder "progetto_sistemi_web/be")

# for Windows

npm run dev:win

# for Linux / macOS

npm run dev

- Il back-end si attiva sulla porta 8080 e per funzionare ha bisogno di un DB mysql.

- [swagger](http://localhost:8080/api/v1/api-docs/)

### CONNETTERE IL DATABASE

Per connettere il DB:
1 - assicurati di avere installato mysql e di aver attivo il processo mysql.
2 - nel folder "be" rinomina il ".env.example" in ".env"
3 - completalo con username e password per il database

Una volta fatto questo la connessione dovrebbe essere impostata correttamente.

## GENERAZIONE RISORSE FRONT-END

Per generare le risorse per il front-end puoi utilizzare il file "be/\_data/front-end/shop.yaml".
Puoi tranquillamente ignorare tutti gli altri file .yaml nella cartella.

# Prossimi passi

nei prossimi giorni lavoro ad una procedura di inizializzazione così ti puoi concentrare solo su front-end.

# TODO:

ok - utilizzo variabili ambiente per connessione DB
ok - implementare documentazione swagger da yaml
ok - implementare generazione modelli da yaml
ok - mail service
ok - aggiornare shop.yaml per front-end
ok - implementare ORM
ok - procedura inizializzazione DB (dati)
ok - images (upload / download)
ok - autenticazione JWT
ok - user sign-up
ok - differenziare permessi auth per ruoli
ok - proteggere tutte le routes mancanti
ok - refactor Product (service/controller)
ok - refactor User (service/controller)
ok - carrello
ok - ordini

- caricamento avatar per gli user
- script e automazione primo lancio e seeding DB
- test unitari
- tet integrazione
