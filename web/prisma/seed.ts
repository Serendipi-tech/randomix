import { PrismaClient } from './generated/prisma/client';

const prisma = new PrismaClient();

// Valori dell'ex enum CATEGORY, migrati come righe iniziali del model Category.
// Da eseguire una tantum dopo il primo `prisma db push` con Category attivo.
const CATEGORIES: { name: string; icon: string }[] = [
  { name: 'App', icon: 'AppWindow' },
  { name: 'Arte', icon: 'Palette' },
  { name: 'Libri', icon: 'Book' },
  { name: 'Romanzi', icon: 'BookOpen' },
  { name: 'Fumetti', icon: 'BookImage' },
  { name: 'Manga', icon: 'BookMarked' },
  { name: 'Materie', icon: 'GraduationCap' },
  { name: 'Film', icon: 'Clapperboard' },
  { name: 'Serie TV', icon: 'Tv' },
  { name: 'Musica', icon: 'Music' },
  { name: 'Altri giochi', icon: 'Puzzle' },
  { name: 'Videogiochi', icon: 'Gamepad2' },
  { name: 'Giochi da tavolo', icon: 'Dice5' },
  { name: 'Giochi di carte', icon: 'Layers' },
  { name: 'Negozi', icon: 'Store' },
  { name: 'Ristoranti', icon: 'UtensilsCrossed' },
  { name: 'Attività', icon: 'Activity' },
  { name: 'Servizi', icon: 'Wrench' },
  { name: 'Cibo', icon: 'Utensils' },
  { name: 'Cucina', icon: 'ChefHat' },
  { name: 'Viaggi', icon: 'Plane' },
  { name: 'Fanfiction', icon: 'PenLine' },
  { name: 'Video', icon: 'Video' },
  { name: 'Podcast', icon: 'Mic' },
  { name: 'Riviste', icon: 'Newspaper' },
  { name: 'Sport', icon: 'Trophy' },
  { name: 'Eventi', icon: 'CalendarDays' },
  { name: 'Istruzione', icon: 'School' },
  { name: 'Cinema', icon: 'Film' },
  { name: 'Teatro', icon: 'Drama' },
  { name: 'Esperienze', icon: 'Sparkles' },
  { name: 'Bevande', icon: 'CupSoda' },
  { name: 'Personalizzato', icon: 'Sparkle' },
];

async function main() {
  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { name: category.name },
      create: category,
      update: {},
    });
  }
  console.log(`Seed completato: ${CATEGORIES.length} categorie.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
