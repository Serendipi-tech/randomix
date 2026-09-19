# Profilo — considerazioni & piano

Stato e decisioni sulla macro-voce **Profilo** di `docs/SUBROAD.md` (sezione MICRO → "Pagina Profilo" + "Pagina Impostazioni").

## Contesto

- File attuale: `mobile/src/app/(app)/(tabs)/profile.tsx`.
- Componenti coinvolti: `ProfileHeader` (`components/molecules/profile-header.tsx`), `PageHeader`, `Input`, `Button`, `AVATAR_PRESETS`.
- Hook: `useProfile()` (`utils/useProfile.ts`) → query `me`, mutation `updateProfile(username?, avatarUrl?, language?)`. **Non gestisce email/password.**
- Nessuna pagina Impostazioni esiste ancora (nessuna route trovata).
- Backend `Report` (bug/feedback/segnalazioni) esiste già nello schema Prisma ma **non è ancora esposto** via resolver/mutation GraphQL né consumato da mobile.

## Stato attuale checklist SUBROAD

| Task                              | Stato           | Note                                                                     |
| --------------------------------- | --------------- | ------------------------------------------------------------------------ |
| Togliere "Colors"                 | ✅ fatto        | bottone debug rimosso                                                    |
| Spostare Logout                   | ✅ fatto        | icona in alto a destra + `ConfirmSheet` di conferma                      |
| Modifica avatar                   | ✅ presente     | picker preset già funzionante in editing inline                          |
| Far sparire page title "profile"  | ✅ fatto        | `PageHeader` sostituito da barra azioni senza titolo                     |
| Rendere la pagina bella           | ✅ fatto        | vedi §4 — `settings.tsx` resta piatto per scelta (pagina utility, non un momento identitario) |
| Aggiungere statistiche account    | ✅ fatto        | vedi §3                                                                  |
| Aggiungere sezione feedback e bug | 🟡 DA DISCUTERE | vedi §5                                                                  |
| Pagina Impostazioni               | ✅ fatto        | `mobile/src/app/(app)/settings.tsx`, vedi §2                             |

## 1. Header Profilo (deciso)

- Rimuovere il bottone "Colors".
- Rimuovere/nascondere il titolo pagina del `PageHeader`.
- Due icone in alto nell'header del Profilo:
  - **Logout** → apre dialog di conferma sì/no prima di eseguire
  - **Impostazioni** → naviga alla nuova route Impostazioni
- Nessun bottone in fondo pagina per queste due azioni.

## 2. Pagina Impostazioni (nuova route)

✅ Implementata in `mobile/src/app/(app)/settings.tsx` (schermata sibling di `colors-showcase`, fuori dal tab group). Raggiunta dall'icona ⚙️ nella barra azioni del Profilo.

> Nota architetturale: l'auth NON usa Supabase Auth — è custom (`User.passwordHash` + JWT firmato con `jose`, verificato in `web/src/lib/jwt.ts`). Il reset password (OTP via email) è già in produzione per il flusso "password dimenticata" da loggati fuori (`usePasswordReset.ts`, `auth-recover-face.tsx`, mutations `requestPasswordReset`/`resetPassword` in `web/graphql/models/user/user.mutations.ts`).

| Voce              | Fattibilità attuale                                               | Note                                                                                                                                                                                                                                                                              |
| ----------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modifica username | ✅ pronto                                                         | già gestito da `updateProfile`                                                                                                                                                                                                                                                    |
| Modifica avatar   | ✅ pronto                                                         | resta nel Profilo (editing inline), non spostato in Impostazioni                                                                                                                                                                                                                  |
| Modifica email    | ✅ fatto                                                          | `requestEmailChange(newEmail)` → OTP alla nuova casella → `confirmEmailChange(otp)`. Campi `pendingEmail`/`emailChangeToken`/`emailChangeTokenExpiry` su `User`, hook `useEmailChange.ts`                                                                                        |
| Modifica password | ✅ fatto                                                          | `changePassword(oldPassword, newPassword)` autenticata via `ctx.userId`. UI a 3 input, la conferma è validazione solo client-side. Hook `useChangePassword.ts`                                                                                                                    |
| Pagamenti         | ⛔ non esiste ancora backend (Fase 4 Monetizzazione non iniziata) | per ora voce nascosta, nessun placeholder                                                                                                                                                                                                                                         |

## 3. Statistiche account — ✅ implementato

Hero stats scelte (3): N° liste, N° elementi completati, N° amici.

- **N° amici**: client-side — `useMyFriends().friends.length` (hook/query già esistente).
- **N° liste** e **N° elementi completati**: campi calcolati aggiunti al tipo `User` (`web/graphql/models/user/index.ts`), stesso pattern di `List.itemCount`/`Item.ratingsCount`: `listsCount` (`t.relationCount('lists')`) e `completedItemsCount` (`prisma.user_Item.count({ where: { userId, status: 'COMPLETED' } })`). Aggiunti alla query `ME` esistente (`packages/graphql-schema/gql_crud/user/user.queries.ts`) — nessuna richiesta in più lato mobile.

Componente: `ProfileStatsPanel` (`mobile/src/components/molecules/profile-stats-panel.tsx`) — vedi §4 per l'evoluzione del design (sostituisce le 3 `StatTile` iniziali, rimosse).

## 4. Redesign visivo — ✅ fatto

Direzione "Hero verticale", decisa con `frontend-design`:

- **Hero**: `ProfileHeader` riscritta — avatar 96px che sfonda il bordo superiore della card (`Avatar` esteso con `size` opzionale), username/email centrati sotto, badge matita in overlay per l'edit.
- **Statistiche**: `ProfileStatsPanel` — righe raggruppate per relazione (liste+elementi+media, completati/totale, amici) invece di tile ripetute; chip icona a gradiente mono-tono per riga; guscio con bordo a gradiente (`CardShell` variante `gradient`, nuova — bordo sottile 2px `secondary→secondaryGradient` attorno a un interno pieno normale, non un fill totale: la prima versione con fill era illeggibile).
- **Form di editing**: ora dentro `CardShell` (default), errore via `FormError`, transizione `FadeIn` all'apertura — coerente col resto invece dello stile originale pre-redesign.
- **Motion**: entrata a cascata (`FadeInDown`) coerente col linguaggio già usato in Home/Draw.
- **`settings.tsx`**: resta piatto per scelta deliberata — pagina di inserimento dati (email/password), non un momento identitario; il gradiente riservato a Hero/Statistiche perderebbe di significato se applicato ovunque. Anche i due rilievi UX minori lì sono risolti: bottoni disabilitati a campo vuoto, bottone "Cancel" per tornare allo step email dall'OTP mantenendo il valore digitato.
- Il widget semi-trasparente visto in uno screenshot di verifica: confermato, è un tool del browser, non del markup — chiuso.

Fix collaterali emersi durante il redesign, non specifici del Profilo ma applicati ovunque:

- `utils/color.ts` (`hexToRgba`/`darkenColor`): non gestiva input `rgb(...)` — bug pre-esistente che rendeva nere le tinte di `primary`/`secondary` in light mode in 11+ punti dell'app.
- `Input.tsx`: `TextInput` senza `backgroundColor` esplicito — su web (dove diventa un `<input>` reale) lasciava intravedere lo sfondo bianco di default del browser dietro al container tintato. Nessun impatto su nativo.
- `global.css`: autofill di Chrome/Edge (`:-webkit-autofill`) forzava uno sfondo bianco sui campi email/password compilati dal browser, superiore in specificità a qualunque style prop — richiesto un box-shadow inset dedicato. Colori hardcoded sul tema dark (default dell'app, non sincronizzato col DOM) — da rivedere se il tema light diventa uso comune.

## 5. Feedback & Bug — RIMANDATO

Non affrontato in questo giro. Il modello `Report` esiste già in `web/prisma/schema/report.prisma` (`reportType`: BUG/FEEDBACK/REPORT, `status`, `attachedFiles`) ma zero resolver/mutation. Da riprendere in un giro successivo.

## Ordine di lavoro

1. ✅ Pulizia header Profilo (Colors, title, icone Logout con conferma + Impostazioni)
2. ✅ Backend: `changePassword`, `requestEmailChange`/`confirmEmailChange` (+ campi Prisma `pendingEmail`/token/expiry), `prisma db push` applicato
3. ✅ Pagina Impostazioni: form password + form cambio email (username/avatar restano nel Profilo)
4. ✅ Statistiche: liste / elementi completati / amici
5. ✅ Redesign visivo finale della pagina Profilo (direzione "Hero verticale")
6. (Rimandato) Feedback & bug — vedi `docs/features/user_feedback/`

## Nota: schema Prisma sbloccato

Per far passare `prisma db push` sono stati parcheggiati due file WIP che rendevano l'intero
schema non validabile (errori preesistenti dal commit `2aeb8b6`, non legati al Profilo):

- `web/prisma/schema/item copy.prisma` → `item copy.prisma.draft`
- `web/prisma/schema/categories.prisma` → `categories.prisma.draft`

Prisma carica **ogni** `.prisma` della cartella: la bozza ridefiniva `User_Item` in conflitto con
`item.prisma`, e `Category` aveva un `@@index` su un campo relazionale (invalido). Entrambi
appartengono alle macro-voci SUBROAD *"Risistemare le logiche degli item"* e *"Le categorie devono
diventare dei Model"*. I file sono intatti: basta rimettere l'estensione `.prisma` per riprenderli,
ma vanno completati prima (la bozza referenzia un `itemId` che non dichiara, e `ListCategory` usa
ancora l'enum `CATEGORY` invece del nuovo model).

## Decisioni ancora aperte

Nessuna. L'unica macro-voce non affrontata in questo giro è Feedback & Bug (punto 6, rimandato).
