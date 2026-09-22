# List categories (macro-categories) — approved set

`ListCategory` = macro-category grouping item `CATEGORY` enum values (`includedCategories`).
Fields: `name`, `description?`, `icon` (Lucide export name, resolved via `resolveListIcon`), `includedCategories: CATEGORY[]`.

**Status: CREATED in DB (2026-08-11).** All 23 records exist: 2 updated in-place (Reading narrowed; "TV Shows" renamed → "Movies & TV") and 21 inserted. This doc is the reference for what's in the DB.

## ⚠️ CUSTOM behaviour (future rule)

The **Anything / CUSTOM** macro must be special-cased at item creation: when a list includes `CUSTOM`, the item-form category picker must offer **every** `CATEGORY` value, not just `CUSTOM`. The current logic in `item-form.tsx` computes options as the union of the parent list's `includedCategories` — it needs an exception: `includedCategories` contains `CUSTOM` → return all categories.

## Existing records — proposed changes

| Current | Change |
| --- | --- |
| **Reading** (`Book`) — BOOKS, NOVELS, COMICS, MANGA, FANFICTIONS, MAGAZINES | Narrow to `BOOKS, NOVELS, FANFICTIONS, MAGAZINES`; move comics/manga to a dedicated group. |
| **TV Shows** (`Monitor`) — MOVIES, TV_SHOWS, VIDEOS, PODCASTS, CINEMA | Rename **Movies & TV** (`Clapperboard`), drop `PODCASTS` (→ Listening): `MOVIES, TV_SHOWS, CINEMA, VIDEOS`. |

## Approved set

| Name | Icon (Lucide) | Included categories | Description |
| --- | --- | --- | --- |
| Reading | `BookOpen` | BOOKS, NOVELS, FANFICTIONS, MAGAZINES | Books, novels, fanfics and magazines |
| Comics & Manga | `BookMarked` | COMICS, MANGA | Comics, graphic novels and manga |
| Movies & TV | `Clapperboard` | MOVIES, TV_SHOWS, CINEMA, VIDEOS | Films, series and things to watch |
| Listening | `Headphones` | MUSIC, PODCASTS | Music and podcasts |
| Music | `Music` | MUSIC | Albums, artists, playlists |
| Gaming | `Gamepad2` | VIDEOGAMES, OTHER_GAMES | Video games to play |
| Tabletop | `Dices` | BOARDGAMES, CARDGAMES, OTHER_GAMES | Board and card games |
| Food & Dining | `UtensilsCrossed` | RESTAURANTS, CUISINE, FOOD | Places to eat and dishes |
| Cooking & Recipes | `ChefHat` | FOOD, CUISINE | What to cook |
| Drinks | `Wine` | BEVERAGES | Drinks, cocktails, coffee |
| Travel & Places | `Plane` | TRAVEL, SHOPS, RESTAURANTS, EXPERIENCES | Destinations and spots |
| Shopping | `ShoppingBag` | SHOPS, SERVICES | Shops and services |
| Things to Do | `Ticket` | ACTIVITIES, EXPERIENCES, EVENTS | Activities and outings |
| Events & Nightlife | `PartyPopper` | EVENTS, THEATRE, CINEMA | Events, shows, nights out |
| Sports & Fitness | `Dumbbell` | SPORTS, ACTIVITIES | Sports and workouts |
| Learning & Study | `GraduationCap` | EDUCATION, SUBJECTS | Courses and subjects |
| Arts & Culture | `Palette` | ART, THEATRE, MUSIC | Art, theatre, culture |
| Live & Stage | `Drama` | THEATRE, EVENTS | Theatre and live shows |
| Apps & Tech | `Smartphone` | APPS, SERVICES | Apps, tools, services |
| Date Ideas | `Heart` | RESTAURANTS, ACTIVITIES, EXPERIENCES, EVENTS | Ideas for a date |
| Wishlist | `Gift` | SHOPS, SERVICES | Things to buy or gift |
| Bucket List | `Sparkles` | EXPERIENCES, TRAVEL, ACTIVITIES, EVENTS | Experiences to try |
| Anything | `Shapes` | CUSTOM | Free / mixed lists (see CUSTOM behaviour above) |

Coverage: all 33 `CATEGORY` enum values appear in at least one group.
