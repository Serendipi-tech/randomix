# Profilo — spec per esecuzione multi-agente

> Deriva da `docs/PLANES/PROFILO.md` (decisioni già chiuse). Questo file è l'incarico
> autosufficiente per due agenti paralleli. Ognuno legge **solo la propria sezione** +
> il "Contratto condiviso" — non serve altro contesto della conversazione.

## Cosa NON è in questo giro

- Redesign visivo finale della pagina Profilo (nessuna spec concreta ancora).
- Feedback & bug (rimandato, vedi `docs/features/user_feedback/`).
- Pulizia header Profilo (Colors, titolo, icone Logout/Impostazioni): fatta **fuori
  dall'albero**, direttamente, non è un incarico agente.

## Contratto condiviso (vincolante per entrambi i nodi, non negoziabile)

### Mutation GraphQL

```graphql
changePassword(oldPassword: String!, newPassword: String!): Boolean!
requestEmailChange(newEmail: String!): Boolean!
confirmEmailChange(otp: String!): User!
```

- `changePassword`: richiede autenticazione. Se `oldPassword` non corrisponde →
  `GraphQLError` `code: INVALID_CREDENTIALS`, messaggio `"Invalid current password."`.
- `requestEmailChange`: richiede autenticazione. Se `newEmail` già in uso da un altro utente →
  `code: EMAIL_TAKEN`, messaggio `"Email already in use."`. Invia l'OTP alla **nuova** email,
  non a quella attuale.
- `confirmEmailChange`: richiede autenticazione. OTP invalido/scaduto → `code: INVALID_OTP`,
  messaggio `"Invalid or expired code."` (stesso pattern di `resetPassword`). Applica il
  cambio email e ritorna lo `User` aggiornato (proiezione Prisma, come `updateProfile`).

### Campi Prisma nuovi su `User` (`web/prisma/schema/user.prisma`)

```prisma
pendingEmail           String?
emailChangeToken       String?
emailChangeTokenExpiry DateTime?
```

Stessa forma di `resetPasswordToken`/`resetPasswordTokenExpiry` già presenti sul model.

### Export gql_crud attesi (nomi esatti, il nodo Mobile li importa così)

```ts
UserMutations.CHANGE_PASSWORD        // ChangePassword($oldPassword: String!, $newPassword: String!)
UserMutations.REQUEST_EMAIL_CHANGE   // RequestEmailChange($newEmail: String!)
UserMutations.CONFIRM_EMAIL_CHANGE   // ConfirmEmailChange($otp: String!) → { id username email avatarUrl language }
```

---

## Nodo A — Backend (`web/` + `packages/graphql-schema/`)

**Modello**: Sonnet. **File di proprietà esclusiva** (nessun altro nodo li tocca):

- `web/prisma/schema/user.prisma`
- `web/graphql/models/user/user.mutations.ts`
- `web/src/lib/email.ts`
- `web/src/lib/emailTemplates/emailChange.ts` (nuovo)
- `packages/graphql-schema/gql_crud/user/user.mutations.ts`

### Passi

1. **Schema**: aggiungi i 3 campi del contratto a `User` in `user.prisma` (vicino a
   `resetPasswordToken`/`resetPasswordTokenExpiry`, stesso stile). Poi esegui
   `prisma db push` da `web/` per applicarlo al DB reale.

2. **`changePassword`**: in `user.mutations.ts`, mirror di `loginWithCredentials`
   (righe 46-67) per il pattern autenticato + `bcrypt.compare`. Carica l'utente da
   `ctx.userId` (non da un argomento), verifica `oldPassword` con `bcrypt.compare`,
   se valido `bcrypt.hash(newPassword, 12)` e update. Nessuna validazione di forza
   password lato server (il progetto non lo fa da nessun'altra parte, coerenza).

3. **`requestEmailChange`** + **`confirmEmailChange`**: mirror esatto di
   `requestPasswordReset`/`resetPassword` (righe 105-162 dello stesso file) per la
   generazione OTP (6 cifre, hash sha256, scadenza 1h). Differenze:
   - l'utente è preso da `ctx.userId`, non da un argomento `email`
   - l'email di invio è `newEmail` (il pending), non quella attuale dell'utente
   - su conferma: `email = pendingEmail`, poi azzera `pendingEmail`/`emailChangeToken`/
     `emailChangeTokenExpiry`, ritorna l'utente con `t.prismaField` (mirror
     `updateProfile` in `web/graphql/models/user/user.queries.ts:24-43`)
   - controllo unicità `newEmail`: `prisma.user.findUnique({ where: { email: newEmail } })`,
     se esiste ed è un utente diverso da `ctx.userId` → `EMAIL_TAKEN`

4. **Template email**: crea `web/src/lib/emailTemplates/emailChange.ts` copiando la
   struttura di `passwordReset.ts` (stessa `TEMPLATES` map, solo `en`), testo adattato
   a "conferma la tua nuova email". Aggiungi `sendEmailChangeVerification(to, otp, language)`
   a `email.ts`, mirror di `sendPasswordResetEmail`.

5. **gql_crud**: aggiungi i 3 export in `packages/graphql-schema/gql_crud/user/user.mutations.ts`,
   stesso stile delle mutation esistenti nello stesso file (vedi `RESET_PASSWORD` per il
   pattern boolean, `UPDATE_PROFILE` per il pattern che ritorna campi utente).

### Non fare

- Non toccare file sotto `mobile/`.
- Non introdurre rate-limiting o validazione robustezza password: fuori scope, non
  richiesto, il resto del progetto non lo fa.

---

## Nodo B — Mobile Impostazioni (`mobile/`)

**Modello**: Sonnet. **File di proprietà esclusiva**:

- `mobile/src/utils/useChangePassword.ts` (nuovo)
- `mobile/src/utils/useEmailChange.ts` (nuovo)
- `mobile/src/app/(app)/settings.tsx` (nuovo)
- `mobile/src/locales/en/profile.json` (solo aggiunta chiavi `settings.*`, non toccare le altre)

Non toccare `profile.tsx` (la navigazione verso questa schermata è cablata altrove,
fuori da questo incarico) né alcun file sotto `web/`.

### Passi

1. **`useChangePassword.ts`**: hook che usa `UserMutations.CHANGE_PASSWORD`, mirror
   minimale di `useProfile.ts` (`updateProfile`) — un solo mutate, ritorna
   `{ changePassword, loading, error }`.

2. **`useEmailChange.ts`**: due mutation (`REQUEST_EMAIL_CHANGE`, `CONFIRM_EMAIL_CHANGE`),
   mirror di `usePasswordReset.ts` (`mobile/src/utils/usePasswordReset.ts`) per la forma
   a due step (`requestChange`, `confirmChange`). Sulla mutation di conferma, aggiungi
   `refetchQueries: [{ query: ME }]` come fa `updateProfile` in `useProfile.ts:32-35`
   (stessa convenzione del progetto per tenere la cache allineata).

3. **`settings.tsx`**: schermata fuori da `(tabs)`, stesso pattern di
   `mobile/src/app/(app)/colors-showcase.tsx` (file sibling, nessuna registrazione
   extra necessaria — Expo Router la risolve dal path). Struttura:
   - `PageHeader` con `icon={Settings}` (lucide), `title={t('settings.title')}`,
     `onBack={() => router.back()}` — qui sì va usato `PageHeader` (schermata secondaria
     con back, uso standard del componente).
   - **Sezione Email**: email attuale in sola lettura, `Input` per la nuova email,
     `Button` "Invia codice" → al successo mostra `Input` OTP (`keyboardType="number-pad"`,
     `maxLength={6}`, mirror `auth-recover-face.tsx:83-89`) + `Button` "Conferma".
   - **Sezione Password**: tre `Input` `variant="password"` — vecchia (`showStrength={false}`),
     nuova (`showStrength` default true), conferma (`showStrength={false}`) — mirror esatto
     di `auth-recover-face.tsx:90-101`. Verifica lato client che nuova === conferma prima
     di inviare (`profile.tsx` usa lo stesso pattern di errore locale per lo username,
     vedi `saveProfile`/`localError`).
   - Errori: usa `FormError` (`@/components/molecules/form-error`), non `Text` grezzo —
     è il componente già usato in `auth-recover-face.tsx:62`.
   - Ogni sezione dentro un contenitore visivo coerente col resto dell'app: usa
     `CardShell` (`@/components/cards/CardShell`), variante default, come fa `ActionCard`.

4. **i18n**: aggiungi a `profile.json` (namespace già registrato, non serve toccare
   `lib/i18n.ts`):
   ```json
   "settings": {
     "title": "Settings",
     "email": {
       "heading": "Email",
       "current": "Current email",
       "newPlaceholder": "New email",
       "sendCode": "Send code",
       "otpPlaceholder": "Verification code",
       "confirm": "Confirm"
     },
     "password": {
       "heading": "Password",
       "oldPlaceholder": "Current password",
       "newPlaceholder": "New password",
       "confirmPlaceholder": "Confirm new password",
       "mismatch": "Passwords don't match",
       "submit": "Update password"
     }
   }
   ```
   Usa `useTranslation('profile')`, come già fa `profile.tsx`.

### Non fare

- Non creare un nuovo namespace i18n.
- Non spostare l'editing di username/avatar qui: resta nel Profilo (deciso in
  `PROFILO.md`).
- Non aggiungere pagamenti: voce assente per decisione presa.

---

## Verifica (a carico mio, non degli agenti)

Al rientro dei due nodi, controllo **subito**, coi due agenti ancora vivi se serve
correzione (regola: verificare chi tocca un contratto condiviso, e farlo prima
dell'estinzione):

1. I 3 nomi/argomenti mutation lato `gql_crud` combaciano esattamente con quelli
   importati dagli hook mobile (unico vero punto di rischio: i due nodi non si parlano
   direttamente, solo tramite questo contratto).
2. `prisma db push` eseguito e riuscito.
3. Nessun file fuori dalla lista di proprietà è stato toccato da entrambi i nodi.
