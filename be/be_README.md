ciao Leo,

# LANCIARE SERVER

Per lanciare il server ti basta posizionarti nel folder "progetto_sistemi_web/be" e lanciare il comando "tsc" seguito dal comando "npm start-server".

Il back-end si attiva sulla porta 8080 e per funzionare ha bisogno di un DB mysql.

# CONNETTERE IL DATABASE

Per connettere il DB:
1 - assicurati di avere lanciato il processo mysql.
2 - nel folder "be" rinomina il ".env copy" in ".env"
3 - completalo con username e password per il database

Una volta fatto questo la connessione dovrebbe essere impostata correttamente.

# Prossimi passi

nei prossimi giorni lavoro ad una procedura di inizializzazione così ti puoi concentrare solo su front-end.

# TODO:

ok - utilizzo variabili ambiente per connessione DB

- procedura inizializzazione DB (dati)
- implementare documentazione swagger da yaml
- implementare generazione modelli da yaml
