# PROFILO PERSONALE

- Lists, Completed e Friends devono essere messi gli uni di fianco agli altri e non a lista.

---

# NOTIFICHE

- L'icona nella Navbar deve mostrare il numerino se ci sono notifiche non lette.
- La pagina Notifiche deve prevedere sistema Letto/Non Letto e possibilità di aprire meglio le notifiche per leggerle.

---

# AMICI

- Modificare sistema di aggiunta amici (con + e Bottomsheet invece di search in bella vista?).

## Profilo Amico:

- Se clicco su un profilo amico, quando riclicco la Navbar su "Amici" non mi aggiorna la vista ma rimane dove sono sul profilo dell'amico, rendendomi impossibile cambiare schermata.
- Nel caso di cui sopra, mi dice "Couldn't load this profile. Please try again."
- Nella pagina dell'amico si può togliere l'header comune e mettere "Rimuovi amico" e "Indietro" in space-between col nome amico.
- Il nome amico può avere truncate se esaurisce lo spazio disponibile.
- Nelle statistiche amico e "Compare" va tolta la statistica che riguarda l'accettazione del randomizzatore o meno.
- Nelle statistiche amico, nella sezione "Compare" NON devono essere ripetute le statistiche dell'amico.
- Nelle statistiche amico, nella sezione "Compare" le statistiche che vengono mostrate devono essere diverse. [DA-VALUTARE]
- Nel profilo dell'amico c'è l'elenco delle liste: deve essere cliccabile e devo poter vedere i suoi elementi, quando non nascosti, e le sue liste, se non nascoste.

## Impostazioni
- L'area "Email" e "Send code" non si capisce che cosa fanno. Bisogna verificare se funziona. Fare in accordion magari.
- La sezione di "Cambio password" dev'essere meno evidente. Magari si può fare un accordion.
- Sezione "Payments" deve dire quando scade il piano (SE scade) e poter ricondurre alla pagina dei piani facilmente. "Learn more" è orribile. T07 dice che è stata creata una pagina in merito alle Membership ma non c'è, e se c'è non è raggiungibile e quindi verificabile. Se è quello che si vede da "Learn More", è orribile. Va omologata agli standard mobile.

---

# GRUPPI

Minimo essenziale per i gruppi:
- creazione e modifica dei gruppi (in base ai limiti di membership);
- aggiunta e rimozione membri con relative notifiche;
- elenco di membri pulita e semplice e visualizzazione dei loro profili come fossero Amici;
- possibilità di vedere statistiche condivise fra i membri del gruppo (come quelle Amici ma con più persone, dopo che saranno state rifinite);
- possibilità di creare liste in comune, del tipo:
    - lista con merge automatico di tutti i membri, sulla base di una categoria unica (es. tutti hanno Libri, viene creata una lista con nome a scelta che ne unisca il contenuto), ma nessuna modifica agli item presi dagli altri membri (non posso correggerli e/o aggiungere immagini se non mi appartengono);
    - aggiunta elementi manuale secondo possibilità del creatore (se ho membership che mi consente immagini possono aggiungerle);
    - raggruppamento item simili (automatico se il match del nome è del 100% oppure manuale se ci sono differenze e lo decide chi fa il merge); [DA-RIVEDERE-MEGLIO] > potenzialmente serve un nuovo model con join sugli elementi delle persone;


---

# HOME

- Se cerco di creare una nuova Lista e ho già raggiunto il limite, se clicco sul + mi deve apparire una BottomSheet che mi avvisa che non posso andare avanti. Se voglio proseguire devo acquistare una membership, dev'esserci un bottone che mi ci porta al click.

## Dettaglio Lista
- Il Randomizzatore della lista dev'essere completamente rifatto.
- La modifica/creazione della lista deve avere la categoria obbligatoria (e con *).

### Dettaglio Item

- Dev'essere possibile bloccare un singolo elemento per "nasconderlo" agli altri, SE la mia membership me lo permette.
- Non tutte le categorie degli item hanno le icone. Va fixato. Risulta fatto in T12, ma bisogna verificare perché sul mobile non appatta.
- Capire perché il cambio di status (Not started / In progress / Completed) è lento.
- Fra icona Tag e icona Trash serve un'icona Pencil che, al click, apra la pagina di modifica dell'item. All'interno dev'essere possibile modificare: categoria dell'item, nome, descrizione, e per chi ha la membership adeguata dev'essere possibile aggiungere un'immagine (mettere placeholder dell'area upload e basta, perché al momento non è implementata la logica backend).
    - L'area upload dev'essere visibile PER TUTTI, ma deve risultare oscura/bloccata/con lucchetto per chi non ha la membership adeguata. Dev'essere anche presente un "suggerimento" che possa indirizzare l'utente alla pagina membership.

---

# IN GENERALE
- Tutto ciò che riguarda le Membership e gli upgrades devono usare i botoni, le card, e gli accent di colore Cyan come da idee trovate in showcase-colors.
- Aggiungere al Randomizzatore generale il "Carta Forbice Pietra"