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
| Togliere "Colors"                 | ⛔ da fare      | bottone debug → link a `colors-showcase`                                 |
| Spostare Logout                   | ⛔ da fare      | **deciso**: icona in alto nell'header profilo (non più bottone in fondo) |
| Modifica avatar                   | ✅ presente     | picker preset già funzionante in editing inline                          |
| Far sparire page title "profile"  | ⛔ da fare      | rimuovere/nascondere `PageHeader` title                                  |
| Rendere la pagina bella           | ⛔ da fare      | redesign, va fatto per ultimo (dopo struttura+dati)                      |
| Aggiungere statistiche account    | ✅ fatto        | vedi §3                                                                  |
| Aggiungere sezione feedback e bug | 🟡 DA DISCUTERE | vedi §4                                                                  |
| Pagina Impostazioni               | ⛔ da fare      | nuova route, vedi §2                                                     |

## 1. Header Profilo (deciso)

- Rimuovere il bottone "Colors".
- Rimuovere/nascondere il titolo pagina del `PageHeader`.
- Due icone in alto nell'header del Profilo:
  - **Logout** → apre dialog di conferma sì/no prima di eseguire
  - **Impostazioni** → naviga alla nuova route Impostazioni
- Nessun bottone in fondo pagina per queste due azioni.

## 2. Pagina Impostazioni (nuova route)

Da creare in `mobile/src/app/(app)/(tabs)/...` (da definire se dentro il tab group o come schermata modale/stack sopra il Profilo).

> Nota architetturale: l'auth NON usa Supabase Auth — è custom (`User.passwordHash` + JWT firmato con `jose`, verificato in `web/src/lib/jwt.ts`). Il reset password (OTP via email) è già in produzione per il flusso "password dimenticata" da loggati fuori (`usePasswordReset.ts`, `auth-recover-face.tsx`, mutations `requestPasswordReset`/`resetPassword` in `web/graphql/models/user/user.mutations.ts`).

| Voce              | Fattibilità attuale                                               | Note                                                                                                                                                                                                                                                                              |
| ----------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modifica username | ✅ pronto                                                         | già gestito da `updateProfile`                                                                                                                                                                                                                                                    |
| Modifica avatar   | ✅ pronto                                                         | può restare qui o restare nel Profilo — da decidere dove vive l'editing avatar dopo lo spostamento                                                                                                                                                                                |
| Modifica email    | ⛔ nuovo lavoro backend                                           | **deciso**: mutation `requestEmailChange(newEmail)` → invia OTP alla nuova casella → `confirmEmailChange(otp)` applica il cambio. Stesso pattern di `resetPasswordToken`/`Expiry`, ma per email (serve campo `pendingEmail` + token/expiry dedicati, non riusare quelli password) |
| Modifica password | ⛔ nuovo lavoro backend                                           | **deciso**: nuova mutation `changePassword(oldPassword, newPassword)`, autenticata (usa `ctx.userId`). UI con 3 input: vecchia password, nuova password, conferma nuova password (la conferma è solo validazione client-side, non va al backend)                                  |
| Pagamenti         | ⛔ non esiste ancora backend (Fase 4 Monetizzazione non iniziata) | per ora voce nascosta, nessun placeholder                                                                                                                                                                                                                                         |

## 3. Statistiche account — ✅ implementato

Hero stats scelte (3): N° liste, N° elementi completati, N° amici.

- **N° amici**: client-side — `useMyFriends().friends.length` (hook/query già esistente).
- **N° liste** e **N° elementi completati**: campi calcolati aggiunti al tipo `User` (`web/graphql/models/user/index.ts`), stesso pattern di `List.itemCount`/`Item.ratingsCount`: `listsCount` (`t.relationCount('lists')`) e `completedItemsCount` (`prisma.user_Item.count({ where: { userId, status: 'COMPLETED' } })`). Aggiunti alla query `ME` esistente (`packages/graphql-schema/gql_crud/user/user.queries.ts`) — nessuna richiesta in più lato mobile.

Componente: nuovo atom `StatTile` (`mobile/src/components/atoms/stat-tile.tsx`), wrapper leggero su `CardShell` (variante `callout`, riuso — non un guscio nuovo), icona + numero + label. Renderizzato in riga sotto `ProfileHeader` in `profile.tsx`.

## 4. Feedback & Bug — RIMANDATO

Non affrontato in questo giro. Il modello `Report` esiste già in `web/prisma/schema/report.prisma` (`reportType`: BUG/FEEDBACK/REPORT, `status`, `attachedFiles`) ma zero resolver/mutation. Da riprendere in un giro successivo.

## Ordine di lavoro proposto

1. Pulizia header Profilo (Colors, title, icone Logout con conferma + Impostazioni)
2. Backend: `changePassword`, `requestEmailChange`/`confirmEmailChange` (+ campi Prisma `pendingEmail`/token/expiry)
3. Pagina Impostazioni: username/avatar (riuso) + form password + form cambio email
4. Statistiche: scegliere le 3-4 metriche definitive e cablarle nel Profilo
5. Redesign visivo finale della pagina Profilo
6. (Rimandato) Feedback & bug

## Decisioni ancora aperte

Nessuna — tutti i punti sono stati chiusi. Editing avatar/username resta nel Profilo (invariato rispetto a oggi), Impostazioni ospita solo email/password/pagamenti(nascosto).
