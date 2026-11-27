# ERRORI-APERTI.md — Randomix

> Errori noti e non ancora risolti, trovati fuori dalle ondate. Formato delle schede allineato a
> [`TODO-MODELLO.md`](TODO-MODELLO.md), così da poter essere spostate in [`TODO.md`](TODO.md) quando
> vengono assegnate a un'ondata. Legenda dei segni: vedi la prefazione di [`TODO.md`](TODO.md).

---

## E01

- [x] [FIX] `TagCreateSheet`: `setColor` tipizzato come unione di letterali invece di `string`
- 🏷️ Area: 📋 Liste e item
- ✅ Fatto (trovato il 22/11/2026 durante il pull di allineamento, chiuso il 24/11/2026) · Urgenza 🟢 · Rischio 🟢 · Effort 🟢
- [`TagCreateSheet.tsx:49`](../mobile/src/components/organisms/TagCreateSheet.tsx#L49), [`TagCreateSheet.tsx:56`](../mobile/src/components/organisms/TagCreateSheet.tsx#L56), [`TagCreateSheet.tsx:109`](../mobile/src/components/organisms/TagCreateSheet.tsx#L109)
- **Problema**: 2 errori TypeScript in `npx tsc --noEmit` su `mobile/` (il progetto compila comunque:
  Metro non fa il typecheck, quindi l'errore non si vede a runtime).

  ```
  TagCreateSheet.tsx(56,14): error TS2345: Argument of type 'string' is not assignable to parameter
    of type 'SetStateAction<"rgb(255, 73, 90)" | ... | "#c1e63d">'.
  TagCreateSheet.tsx(109,9): error TS2322: Type 'Dispatch<SetStateAction<"rgb(255, 73, 90)" | ...>>'
    is not assignable to type '(color: string) => void'.
  ```

  **Causa radice**: `palette` nasce da `Object.values(colors.extraColors)`, dove `extraColors` ha valori
  tipizzati come letterali. Quindi `useState(palette[0])` (riga 49) non inferisce `string` ma l'unione
  dei 19 colori della palette. Da lì due conseguenze:
  - riga 56 — `setColor(editingTag?.color ?? palette[0])`: `editingTag.color` arriva dal backend come
    `string` generica, non assegnabile all'unione di letterali;
  - riga 109 — `onSelect={setColor}`: `ColorPickerSheet` dichiara `onSelect: (color: string) => void`,
    e `Dispatch<SetStateAction<unione>>` non è compatibile (parametro controvariante).

  **Cosa fare**: annotare esplicitamente lo stato — `useState<string>(palette[0])`. Da verificare che
  sia la scelta giusta e non il contrario (cioè restringere `ColorPickerSheet.onSelect` all'unione):
  `ColorPickerSheet` è un componente condiviso e riceve `colors` da più chiamanti, quindi `string` è
  probabilmente corretto, ma va confermato prima di toccare qualcosa.

  **Attenzione**: `ColorPickerSheet` è un componente esistente e condiviso — se la soluzione scelta
  richiede di modificarlo, serve il permesso esplicito del titolare (regola CLAUDE.md).

  **Fatto quando**: `cd mobile && npx tsc --noEmit` non riporta più errori su `TagCreateSheet.tsx`,
  e la scelta del colore funziona sia in creazione sia in modifica di un tag esistente.

- **Note**: errore **preesistente**, non introdotto dal pull del 22/11/2026 — `TagCreateSheet.tsx` non è
  stato toccato né dai 43 commit scaricati né dal lavoro locale in corso sul randomizer.

  **Consegnato** (commit `d14f949`): annotato `useState<string>(palette[0])` alla riga 49, con commento
  sul perché serve. Verificata la direzione opposta prima di procedere: `ColorPickerSheet` riceve
  `colors` da più chiamanti, quindi `string` è corretto e il componente condiviso non è stato toccato.
  `npx tsc --noEmit` su `mobile/` esce pulito.

---

## E02

- [!] [SEC] L'email di registrazione non viene mai verificata
- 🏷️ Area: 🔐 Autenticazione
- ⏳ Da fare (trovato il 24/11/2026, verificando i flussi email) · Urgenza 🔴 · Rischio 🔴 · Effort 🟡
- [`user.mutations.ts:27`](../web/graphql/models/user/user.mutations.ts#L27) (`registerWithCredentials`), [`user.mutations.ts:111`](../web/graphql/models/user/user.mutations.ts#L111) (`requestPasswordReset`)
- **Problema**: `registerWithCredentials` crea l'utente e restituisce subito un `AuthPayload` valido,
  senza inviare nessuna email e senza marcare l'indirizzo come da confermare. Non esiste un campo
  tipo `emailVerified` nello schema. Chiunque può quindi registrarsi con l'indirizzo di un'altra
  persona.

  Il problema non si ferma all'account fasullo: `requestPasswordReset` manda l'OTP all'indirizzo
  registrato. Se qualcuno registra per primo l'email di un altro, quando il legittimo proprietario
  prova a usare quell'indirizzo lo trova occupato; e viceversa, un indirizzo registrato da altri
  diventa un account che il proprietario dell'email può prendersi via recupero password. In entrambe
  le direzioni la titolarità dell'account non è dimostrata da nessuno.

  **Cosa fare**: aggiungere `emailVerified Boolean @default(false)` (più token e scadenza, sullo stesso
  schema già usato da `resetPasswordToken`) e inviare un OTP di conferma alla registrazione. Da
  decidere se bloccare il login finché non è verificata o solo limitare le funzioni: la seconda è più
  gentile con l'onboarding, la prima è più sicura. `loginWithGoogle` può segnare `emailVerified: true`
  direttamente, visto che l'indirizzo arriva già verificato da Google.

  **Fatto quando**: un account appena registrato risulta non verificato finché non si inserisce l'OTP
  ricevuto, e la verifica avviene via Google senza passaggi extra per chi entra con l'OAuth.

- **Note**: non urgente finché l'app è chiusa e in sviluppo, **da chiudere prima della pubblicazione**.
  L'infrastruttura email c'è già e funziona (`sendPasswordResetEmail`), quindi il lavoro è lo schema
  più una mutation di conferma, non il canale di invio.

---

## E03

- [!] [SEC] Il cambio password non avvisa il proprietario dell'account
- 🏷️ Area: 🔐 Autenticazione
- ⏳ Da fare (trovato il 24/11/2026, verificando i flussi email) · Urgenza 🟡 · Rischio 🟡 · Effort 🟢
- [`user.mutations.ts:170`](../web/graphql/models/user/user.mutations.ts#L170) (`changePassword`), [`email.ts`](../web/src/lib/email.ts)
- **Problema**: `changePassword` verifica la vecchia password, scrive il nuovo hash e finisce lì. Non
  parte nessuna email. Stesso discorso per `resetPassword`, che chiude il recupero senza confermare
  nulla all'utente.

  Conseguenza: se qualcuno entra in un account (sessione lasciata aperta, password riusata altrove) e
  cambia la password, il proprietario non ha **nessun segnale** finché non prova a entrare e non ci
  riesce più. Una notifica trasforma un furto silenzioso in qualcosa di immediatamente visibile, ed è
  la ragione per cui ogni servizio serio la manda.

  **Cosa fare**: una terza funzione in `email.ts` sul modello delle due esistenti — nessun OTP, solo un
  avviso "la password è stata cambiata, se non sei stato tu recuperala subito" — chiamata sia da
  `changePassword` sia da `resetPassword`. Serve un template in `src/lib/emailTemplates/`, coerente con
  `passwordReset.ts` e `emailChange.ts`.

  **Attenzione**: l'invio non deve poter far fallire il cambio password. La mutation va a buon fine
  anche se l'SMTP è giù: l'avviso si manda in un `try/catch` che ingoia l'errore, non prima della
  risposta.

  **Fatto quando**: dopo un cambio password, sia dal profilo sia da recupero, arriva un'email di avviso
  all'indirizzo dell'account, e un SMTP irraggiungibile non impedisce comunque il cambio.

- **Note**: dipende da `SMTP_*` configurate in produzione (vedi E04); senza quelle non parte nessuna
  delle email, incluse quelle che già esistono.

---

## E04

- [?] [TODO] Verificare che le variabili SMTP siano configurate su Vercel
- 🏷️ Area: 🔐 Autenticazione
- ⏸️ In attesa di un dato del titolare (aperto il 24/11/2026) · Urgenza 🟡 · Rischio 🟡 · Effort 🟢
- [`email.ts:5`](../web/src/lib/email.ts#L5)
- **Problema**: `SMTP_HOST`, `SMTP_USER` e `SMTP_PASS` sono presenti in `web/.env` (locale) ma non è
  stato verificato se esistono nell'ambiente di produzione. Se mancano, `transporter.sendMail` fallisce
  e **recupero password e cambio email non funzionano** per gli utenti reali, pur essendo cablati
  correttamente nel codice.

  Nota sul default: in assenza di `SMTP_HOST` il transporter cade su `smtp.gmail.com:587`, che con
  Gmail richiede una **App Password** dedicata, non la password normale dell'account.

  **Cosa fare**: `vercel env ls`, oppure la dashboard del progetto. Se mancano, aggiungerle e
  rideployare.

  **Fatto quando**: una richiesta di recupero password fatta dall'app pubblicata recapita davvero
  l'email.

- **Note**: non è un difetto del codice ma una verifica di configurazione; aperta qui perché E03 e il
  recupero password esistente ne dipendono.

---

## E05

- [!] [SEC] La robustezza della password è controllata solo nel client
- 🏷️ Area: 🔐 Autenticazione
- ⏳ Da fare (trovato il 24/11/2026, analisi dei resolver) · Urgenza 🔴 · Rischio 🔴 · Effort 🟢
- [`user.mutations.ts:27`](../web/graphql/models/user/user.mutations.ts#L27) (`registerWithCredentials`), [`user.mutations.ts:136`](../web/graphql/models/user/user.mutations.ts#L136) (`resetPassword`), [`user.mutations.ts:170`](../web/graphql/models/user/user.mutations.ts#L170) (`changePassword`), [`useAuthForms.ts`](../mobile/src/utils/useAuthForms.ts)
- **Problema**: i controlli su lunghezza, lettera, numero e simbolo vivono solo in `useAuthForms`
  (`getPasswordStrength`), cioè nell'app. Le tre mutation che scrivono un `passwordHash` prendono la
  stringa e la passano direttamente a `bcrypt.hash`, senza verificare niente. Una chiamata GraphQL
  diretta — e la `x-api-key` per farla è dentro il bundle, vedi E08 — registra un account con password
  di un carattere.

  Vale lo stesso per `username`: il minimo di 3 caratteri è solo client-side.

  **Cosa fare**: portare `getPasswordStrength` (o una sua gemella) lato server e usarla nelle tre
  mutation, lanciando `GraphQLError` con un codice dedicato. Il controllo client resta per il feedback
  immediato, ma non è più l'unico. Attenzione a non invalidare le password già esistenti: la regola
  si applica solo in scrittura, mai al login.

  **Fatto quando**: una `registerWithCredentials` con password `a`, inviata direttamente all'endpoint,
  viene rifiutata.

- **Note**: il più facile da chiudere del gruppo E05–E08, e quello che toglie più superficie.

---

## E06

- [!] [SEC] Nessun rate limiting su nessun endpoint
- 🏷️ Area: 🔐 Autenticazione
- ⏳ Da fare (trovato il 24/11/2026, analisi dei resolver) · Urgenza 🔴 · Rischio 🔴 · Effort 🟡
- [`route.ts`](../web/src/app/api/graphql/route.ts), [`user.mutations.ts`](../web/graphql/models/user/user.mutations.ts)
- **Problema**: cercato in tutto `graphql/`, `src/lib/` e `src/app/api/` — non esiste nessuna forma di
  limite, contatore o throttling. Tre conseguenze concrete:
  - `loginWithCredentials` è forzabile a tentativi illimitati (il costo bcrypt 12 rallenta, non ferma);
  - `requestPasswordReset` permette a chiunque di far partire email a raffica verso l'indirizzo di
    un'altra persona, con in più il costo SMTP;
  - `resetPassword` consente di provare gli OTP senza freno (vedi E07, che da solo non sarebbe grave).

  **Cosa fare**: limite per IP e per account sugli endpoint pubblici. Non serve infrastruttura
  dedicata: basta una tabella con finestra temporale, oppure Upstash Redis dal Marketplace Vercel se
  si preferisce non toccare il DB principale. Da decidere insieme.

  **Fatto quando**: superata la soglia, l'endpoint risponde con un errore di limite invece di
  processare il tentativo, e la soglia si azzera dopo la finestra.

- **Note**: è il moltiplicatore di E07. Chiudendo questo, l'OTP a 6 cifre torna accettabile.

---

## E07

- [!] [SEC] OTP di recupero password senza limite di tentativi
- 🏷️ Area: 🔐 Autenticazione
- ⏳ Da fare (trovato il 24/11/2026, analisi dei resolver) · Urgenza 🟡 · Rischio 🔴 · Effort 🟢
- [`user.mutations.ts:111`](../web/graphql/models/user/user.mutations.ts#L111) (`requestPasswordReset`), [`user.mutations.ts:136`](../web/graphql/models/user/user.mutations.ts#L136) (`resetPassword`)
- **Problema**: l'OTP è numerico a 6 cifre (un milione di combinazioni) e resta valido **un'ora**.
  `resetPassword`, se il codice non combacia, lancia l'errore e finisce lì: nessun contatore di
  tentativi falliti, nessuna invalidazione del token, nessun blocco. Unito all'assenza di rate
  limiting (E06), lo spazio delle combinazioni è esauribile dentro la finestra di validità.

  Il codice è conservato come hash SHA-256, il che è corretto: il problema non è la conservazione ma
  l'assenza di un freno sui tentativi.

  **Cosa fare**: contatore di tentativi falliti sulla riga utente; superata la soglia (3–5),
  azzerare `resetPasswordToken` e obbligare a richiedere un codice nuovo. In più, accorciare la
  validità: un'ora è generosa, 15 minuti bastano. I campi necessari stanno accanto a quelli già
  presenti (`resetPasswordToken`, `resetPasswordTokenExpiry`).

  **Fatto quando**: dopo N codici sbagliati il token non è più utilizzabile nemmeno se poi si indovina,
  e serve una nuova richiesta.

- **Note**: da valutare insieme a E06; chiudendo entrambi il flusso di recupero diventa solido.

---

## E08

- [?] [SEC] La `x-api-key` non è una barriera di sicurezza
- 🏷️ Area: 🔐 Autenticazione
- ⏸️ In attesa di una decisione del titolare (aperto il 24/11/2026) · Urgenza 🟡 · Rischio 🟡 · Effort 🔴
- [`route.ts`](../web/src/app/api/graphql/route.ts) (`checkApiKey`), [`apollo.ts:14`](../mobile/src/lib/apollo.ts#L14)
- **Problema**: la chiave è `EXPO_PUBLIC_CLIENT_API_KEY`. Il prefisso `EXPO_PUBLIC_` significa che Expo
  la incorpora nel bundle in fase di build: chiunque scarichi l'app può estrarla. Il nome "api key"
  suggerisce una protezione che non c'è.

  Non è un difetto in sé — come filtro contro il traffico casuale funziona — ma è **l'unica cosa
  davanti agli endpoint pubblici** di E05, E06 ed E07, e non va contata come difesa quando si
  valutano quelli.

  **Cosa fare**: niente, consapevolmente, oppure sostituirla con qualcosa che regga davvero (App
  Attest su iOS, Play Integrity su Android). È una scelta di costo/beneficio: l'alternativa è
  parecchio lavoro per un'app ancora chiusa. **Decisione del titolare.**

  **Fatto quando**: deciso se tenerla come filtro (e documentato che non è una difesa) o sostituirla.

- **Note**: registrata soprattutto perché non venga usata come giustificazione per rimandare E05–E07.

---

## E09

- [?] [TODO] `DATABASE_URL` punta al pooler Supabase in *session mode*: 15 connessioni in tutto
- 🏷️ Area: 🗄️ Database e infrastruttura
- ⏸️ In attesa di chi ha accesso alle env di Vercel (aperto il 27/11/2026) · Urgenza 🟡 · Rischio 🟡 · Effort 🟢
- [`builder.ts:12`](../web/graphql/builder.ts#L12), `web/.env` (`DATABASE_URL`), env di produzione su Vercel
- **Problema**: la stringa di connessione usa `aws-0-eu-west-1.pooler.supabase.com:**5432**`, cioè il
  pooler in *session mode*, che tiene al massimo **15 client contemporanei** (`pool_size: 15`). Ogni
  istanza serverless calda su Vercel e ogni processo locale (dev server, script) si prende una o più
  sessioni e le tiene; esaurite le 15, qualsiasi query nuova muore con:

  ```
  (EMAXCONNSESSION) max clients reached in session mode - max clients are limited to pool_size: 15
  ```

  Visto dal vivo il 27/11/2026: l'app mostrava pagine vuote a rotazione (notifiche e liste in errore,
  profilo funzionante) e lo stesso errore arrivava anche a uno script locale sul DB. **Non è un bug
  del codice applicativo**: le query sono corrette, è il pool che le rifiuta.

  **Mitigazione già fatta** (`web/graphql/builder.ts`): il `Pool` di node-postgres era creato senza
  opzioni, quindi usava il suo default di **10 connessioni per istanza** — due lambda calde bastavano a
  saturare il pooler. Ora il massimo è 3 per istanza con rilascio dopo 10s di inattività, e il
  `PrismaClient` viene riusato tramite `globalThis` in sviluppo (prima ogni hot-reload di
  `npm run dev` ne lasciava dietro uno con le connessioni ancora aperte). Questo riduce il consumo ma
  **non toglie il tetto**.

  **Aggiramento in atto (27/11/2026)**: non potendo toccare le env di produzione, `builder.ts`
  riscrive la stringa a runtime (`toTransactionPooler`), sostituendo `:5432` con `:6543` prima di
  passarla al driver. Verificato in locale: le sei query parallele di `profileStats` passano senza
  errori sul transaction mode. **Funziona, ma la configurazione sta nel posto sbagliato**: va spostata
  nella variabile d'ambiente e la funzione va tolta.

  **Cosa fare**: mettere la porta **6543** direttamente in `DATABASE_URL`, cioè il pooler in
  *transaction mode*, e rimuovere `toTransactionPooler` da `builder.ts`:

  ```
  postgresql://<user>:<password>@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
  ```

  Va cambiata sia in `web/.env` sia nelle env di produzione su Vercel, poi serve un redeploy. Fatto
  questo, la riscrittura nel codice diventa un no-op e va cancellata.
  Compatibilità: il progetto usa il driver adapter `@prisma/adapter-pg`, e `pg` non usa prepared
  statement con nome, quindi il transaction mode non rompe nulla. Le transazioni interattive
  (`prisma.$transaction` con callback) non sono usate nei resolver; se un domani servissero, vanno
  sulla connessione diretta, non sul pooler.

  **Fatto quando**: `DATABASE_URL` in produzione è sulla 6543, `toTransactionPooler` non esiste più e
  l'app regge i refresh ripetuti senza più `EMAXCONNSESSION`.

- **Note**: l'alternativa è alzare il `pool_size`, che però dipende dalla dimensione di compute del
  progetto Supabase, quindi significa passare a un piano superiore. L'altra strada già prevista in
  [`CLAUDE.md`](../CLAUDE.md) è Prisma Accelerate come layer di pooling, ma è un cambio più grosso.
  L'area 🗄️ non esiste nella legenda di [`TODO.md`](TODO.md): aggiunta qui perché il problema non
  appartiene a nessuna funzione dell'app.

---

## N01 — Nota: il lint non è una fonte affidabile allo stato attuale

Non è un errore ma serve saperlo, per non perdere tempo. `npx eslint .` su `mobile/` riporta **160
problemi**, ma **93 dei 109 errori** sono le regole `react-hooks/refs` e `react-hooks/immutability`
introdotte da `eslint-config-expo` 57: leggono `sharedValue.value = x` di Reanimated come una
mutazione proibita, quando è l'API normale della libreria. Sono falsi positivi.

Del resto: 16 `set-state-in-effect` sono il pattern legittimo "precompila il form all'apertura della
sheet"; 22 `exhaustive-deps` sono per lo più "esegui una volta al mount" voluti; 54 problemi su 160
stanno tutti in `colors-showcase.tsx`, che è una vetrina di sviluppo. Gli unici avanzi reali sono **14
variabili inutilizzate**, concentrate in `group/[id].tsx`.

Prima di usare il lint come metro di qualità andrebbero silenziate le due regole su Reanimated in
`eslint.config.js`, altrimenti il rumore nasconde gli avvisi veri.

(Nota: `eslint-config-expo` è arrivato col pull del 24/11/2026 ma non era installato — serve `npm
install` perché il lint parta.)
