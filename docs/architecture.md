# ARCHITETTURA REPOSITORY

**randomix**/
├─ _web/_ ← next.js + supabase, prisma, graphql
│ ├─ public/
│ ├─ scripts/
│ │
│ ├─ graphql/ ← schema code-first (resolver/config), NON i file di consumo frontend
│ │ ├─ builder.ts
│ │ ├─ enum.ts
│ │ ├─ schema.ts
│ │ └─ models/
│ │ └─ ...model/
│ │ ├─ model.queries.ts
│ │ ├─ model.mutations.ts
│ │ └─ index.ts
│ │
│ ├─ messages/
│ │ └─ en/
│ │ ├─ ...context.json
│ │ └─ index.ts
│ │
│ ├─ prisma/ ← schema ORM; aggiornamenti via `prisma db push`, NESSUNA migration Prisma né `supabase db push`; pooling connessioni via Prisma Accelerate (standard Postgres, non legato a Supabase)
│ │ └─ schema/
│ │ ├─ \_config.prisma
│ │ └─ ...context.prisma
│ │
│ └─ src/
│ ├─ app/ ← login e accesso privato solo area admin
│ ├─ lib/
│ ├─ utils/
│ │
│ ├─ components/
│ │ ├─ atoms/
│ │ ├─ molecules/
│ │ └─ organisms/
│ │
│ └─ types/
│ ├─ interfaces/
│ │ └─ ...context.ts
│ └─ types/
│ └─ ...context.ts
│  
├─ _mobile/_ ← react native + Expo Router, GraphQL/Apollo verso l'endpoint esposto da web/ (no REST, no accesso diretto a Supabase)
│ ├─ app/ ← Expo Router: (auth), (onboarding), (app) — NO (admin), che vive solo in web/
│ └─ src/
│ ├─ lib/ ← apollo.ts (Apollo Client verso l'endpoint GraphQL di web/)
│ ├─ utils/ ← hook e logica, indipendente da web/
│ ├─ components/
│ │ ├─ atoms/
│ │ ├─ molecules/
│ │ └─ organisms/
│ └─ types/
│
├─ _packages/graphql-schema/_ ← dipendenza di workspace condivisa (solo build-time, nessun runtime tra web/ e mobile/)
│ ├─ schema.graphql ← schema esportato da web/graphql/ per il codegen
│ ├─ gql_crud/ ← file .ts di consumo: solo nome dell'operazione (query/mutation definita in web/graphql/models) + variabili da passare, usati dal frontend (web admin e mobile) per generare gli hook tipizzati
│ │ └─ ...model/
│ │ ├─ model.queries.ts
│ │ └─ model.mutations.ts
│ └─ __generated__/ ← output codegen, importato sia da web/ che da mobile/
