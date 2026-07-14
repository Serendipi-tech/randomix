# ARCHITETTURA REPOSITORY

**randomix**/
├─ _web/_ ← next.js + supabase, prisma, graphql
│ ├─ public/
│ ├─ scripts/
│ │
│ ├─ graphql/
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
│ ├─ prisma/
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
├─ _mobile/_ ← react native, api rest che puntano a web/
│ ├─
