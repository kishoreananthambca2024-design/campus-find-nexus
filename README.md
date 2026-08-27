# CampusFind — College Lost & Found System

> A prototype developed for a college coding competition.
> **Find it. Report it. Return it.**

---

## Problem Statement

College students constantly lose everyday belongings — ID cards, wallets, books,
earphones, water bottles, keys and bags. On most campuses there is no organised
system connecting the student who lost an item with the student who found it.
Notices on WhatsApp groups and notice boards get buried, and most items are never
returned even though someone on campus is holding them.

## Proposed Solution

CampusFind is a single web platform where students can:

1. Report an item they lost.
2. Report an item they found.
3. Search and filter every report on campus.
4. See **possible matches** detected automatically between lost and found reports.
5. Mark items as returned once they are reunited with their owner.

A live dashboard shows how the campus is doing: items lost, items found, possible
matches, and items successfully returned.

## Features

- **Dashboard** — live statistics, the highest scoring possible match, and recent reports.
- **Report Lost Item** — validated form with category, location, date, contact details and optional photo.
- **Report Found Item** — same flow, stored with type `FOUND`.
- **Browse & Search** — search by item name, filter by lost/found, category and location, sort by newest or oldest.
- **Smart Matching** — rule-based algorithm that pairs lost and found reports and scores them.
- **Match Details** — side-by-side comparison, match score, matching reasons, and a **Mark as Returned** action.
- **Item Details page** — full report with contact info plus every possible match for that item.
- **Status badges** — Active, Possible Match and Returned states are visually distinct.
- **Responsive UI** — works on phones, tablets and desktops, with loading, empty and error states.

## Smart Matching Algorithm

Implemented in `src/lib/matching.ts`. No external AI service is used — the logic is
simple, explainable and deterministic.

Each `LOST` report is compared with each `FOUND` report that is not yet returned:

| Signal | Points |
| --- | --- |
| Same category | 40 |
| Item name similarity (shared meaningful words, prefix-aware) | up to 35 |
| Location similarity (exact / contains / shared words) | up to 25 |

The score is capped at 100. Pairs scoring **50 or more** are reported as matches:

| Score | Label |
| --- | --- |
| 80 – 100 | Strong Match |
| 65 – 79 | Possible Match |
| 50 – 64 | Low Match |

**Worked example**

```
LOST  : "Black Wallet"          | Wallet | CS Block
FOUND : "Black Leather Wallet"  | Wallet | CS Block

Same category .............. +40
Name overlap (black, wallet) ... +35
Same location .............. +25
--------------------------------
Match Score ................ 100  → Strong Match
```

The UI also lists the human-readable reasons:
`✓ Same category — Wallet`, `✓ Similar item name`, `✓ Same location — CS Block`.

## Technologies Used

- **React 19** + **TypeScript**
- **TanStack Start / TanStack Router** — file-based routing and SSR
- **TanStack Query** — data fetching, caching and cache invalidation
- **Tailwind CSS v4** — CSS-first design system with semantic tokens
- **Zod** — form validation
- **Lovable Cloud (PostgreSQL + storage)** — database and optional image uploads
- **Lucide** icons, **Sonner** toasts

## Database Structure

Table `items`:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | primary key |
| `item_name` | text | required |
| `category` | text | one of the ten campus categories |
| `description` | text | required |
| `location` | text | where it was lost/found |
| `date` | date | when it was lost/found |
| `type` | text | `LOST` or `FOUND` |
| `contact_name` | text | reporter's name |
| `contact_info` | text | email or phone |
| `image_url` | text | optional storage path |
| `status` | text | `ACTIVE`, `MATCHED` or `RETURNED` |
| `created_at` | timestamptz | defaults to `now()` |

Item photos are stored in the `item-images` storage bucket; the database keeps the
object path and the app requests a signed URL when rendering.

## Installation / Setup

```bash
git clone <repository-url>
cd campusfind
npm install
```

The backend connection values live in `.env` (`VITE_SUPABASE_URL`,
`VITE_SUPABASE_PUBLISHABLE_KEY`) and are created automatically by Lovable Cloud.

## How to Run

```bash
npm run dev      # start the development server
npm run build    # production build
npm run preview  # preview the production build
```

Then open the printed local URL in a browser.

## Sample Input / Output

**Input — Lost report**

```
Item Name : Black Wallet
Category  : Wallet
Location  : CS Block
Date      : 2026-08-24
Contact   : Arjun Menon / arjun.m@college.edu
```

**Input — Found report**

```
Item Name : Black Leather Wallet
Category  : Wallet
Location  : CS Block
Date      : 2026-08-25
Contact   : Priya Nair / +91 98765 43210
```

**Output — Matches page**

```
🔔 Possible Match Found                     Strong Match
LOST  Black Wallet          Wallet · CS Block · 24 Aug 2026
FOUND Black Leather Wallet  Wallet · CS Block · 25 Aug 2026
Match Score · 100%
✓ Same category — Wallet
✓ Similar item name
✓ Same location — CS Block
[ Mark as Returned ]
```

After clicking **Mark as Returned**, both reports move to status `RETURNED`, they
disappear from the matches list, and the dashboard counters update immediately.

## Testing

Manual test plan used for the demo:

1. **Dashboard loads** with seeded sample data and non-zero statistics.
2. **Validation** — submit an empty lost report; every required field shows a message and nothing is saved.
3. **Create lost report** — "Black Wallet" in "CS Block"; success toast appears and the item shows in Browse.
4. **Create found report** — "Black leather wallet" in "CS Block".
5. **Matching** — the Matches page shows the pair with a high score and three reasons.
6. **Search & filters** — search "wallet", filter by Found, filter by category and location; results narrow correctly.
7. **Mark as Returned** — both items become `RETURNED`, leave the matches list, and the Returned counter increases.
8. **Responsive check** — mobile nav toggle, single-column cards, readable forms.

## Future Improvements

- Student login so users can manage only their own reports.
- Email / SMS notification when a new match is detected.
- Image-similarity matching in addition to text matching.
- Campus map view of lost and found hotspots.
- Admin moderation and monthly recovery analytics.

## Team Members

| Name | Role |
| --- | --- |
| Kishore Anantham | Project lead, matching algorithm |
| _Team member 2_ | Frontend & UI design |
| _Team member 3_ | Database & integration |
| _Team member 4_ | Testing & documentation |

---

CampusFind is a prototype built for a college coding competition — it focuses on a
complete, reliable core workflow rather than on a broad feature list.
