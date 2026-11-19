COSE DA FARE

- bottomSheet che prevedono salvataggio > devono verificare se è effettivamente cambiato qualcosa o no per mettere disable al button in caso di mancanza di modifiche;
- manca la parte di visualizzazione di recensione dei soli amici (se ce ne sono);
- inserimento immagini con upload SE si ha il pacchetto corretto (dopo aver definito i pacchetti)
- inserire sezione in admin per creare e definire i pacchetti di abbonamenti da rilasciare in modo da definire limiti e permessi in modo dinamico
  > fattori da considerare nei pacchetti:
        - n° liste creabili
        - n° item per lista
        - inserimento immagini in item (on/off)
        - nascondere item alle persone (on/off)
        - n° gruppi creabili (in futuro)
        - n° gruppi a cui poter partecipare (in futuro)
        - ads in app (on/off)
        - priorità supporto cliente ("basso", "medio", "alto")
  > stabilire di conseguenza una tipizzazione standard per model Membership > limitations Json
- aggiunta dei limiti sulla base del pacchetto acquistato (controlli dei limiti in base al pacchetto cliente: model Membership > limitations Json)
- creare pagina lato user per visualizzare, scegliere e abbonarsi al pacchetto
- randomizzatore della lista da rifare completamente (UI)
- le categorie perché sono in italiano??? item listitem > devono seguire la lingua dell'app
- singole icone per le categorie degli item…? (forse, non urgente)
- toast informativi conferma, error, ecc (es. aggiunta item ecc ecc)
- terminare di definire le icone delle categorie delle liste
  > non hanno tutte un'icona diversa ma dovrebbero
- verificare funzionamento di "hide list from friends"
- inserire "hide item from friends" (dipende dal pacchetto membership)
- anteprima della lista va fatta con il numero corretto di item dentro (in modifica lista) ( e il bottone/freccia buh, da valutare )
- abilitare modifica degli item che adesso è necessaria
- nella pagina delle liste c'è 1 lists - 3 items e va tolto
- appena è possibile inserire le immagini in item dovrà essere inserita la funzionalità di upload in client (button in app) + BE (dipende da membership)
- alla creazione di nuovi item o liste, le stat del profilo non si aggiornano; aggiornando la pagina non riesce più a caricare nulla e l'utente è costretto a logout-login per riaccedere al profilo
- il refresh di "randomizer acceptance" non è istantaneo ma dovrebbe esserlo > IL PROFILO INTERO deve aggiornarsi tutto in tempo reale e non lo fa
- icona profilo e icona amici vanno differenziate (sono uguali nella navbar)
- da rifare completamente l'esterno dell'app (UX)

NOTIFICHE > implementare asap

- di sistema > inviabili tramite pannello admin online web (c'è > verificare completezza)
- manca pagina notifiche user (è vuota)
  > utilizzare componenti e stile/tema app
- richieste di amicizia (completare in sezione notifiche)

AMICI > tutta da cambiare

- rifare intera grafica
- cambiare le mini card amici
  > sono troppo ingombranti > verificare l'utilizzo del componente apposito
  > valutare se visualizzare le sole img e nome con eventuale barra di ricerca
- cambiare visualizzazione del profilo amico
  > grafica come il profilo personale MA con le statistiche in relazione alle mie E personali > statistiche in accordion con tab "solo sue" e "mie e sue" + bottone per visualizzare le sue liste (non nascoste)
- aggiungere possibilità di rimozione amico dalla pagina profile amico

GRUPPI

- valutare difficoltà e mole di lavoro nella definizione della sezione gruppi e relative funzionalità per MVP per decidere se farlo subito o rimandare l'intera sezione a post MVP
