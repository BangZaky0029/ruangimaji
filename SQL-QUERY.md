sip, ini jelas 👍
kita anggap **file di atas = dummy data final**, jadi struktur database **harus 100% ngikutin itu**, biar nanti pindah dari dummy → Supabase **tanpa refactor besar**.

Di bawah ini gw bikinin **DESAIN TABLE SUPABASE + FIELD-NYA** (lengkap + siap dipakai).

---

# 🧱 STRUKTUR DATABASE (SUPABASE / POSTGRES)

## 1️⃣ TABLE: `projects`

👉 untuk **Work / Portfolio utama**

### Dipakai oleh:

* `Project`
* `PortfolioItem`
* Photo & Video (dibedain pakai `type`)

### SQL

```sql
create table public.projects (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  description text,
  category text not null,

  type text check (type in ('Photo', 'Video')) not null,

  image_url text not null,
  video_url text,

  aspect_ratio text check (aspect_ratio in ('landscape', 'portrait')),

  created_at timestamp with time zone default now()
);
```

### Mapping ke TypeScript

| Frontend      | DB           |
| ------------- | ------------ |
| id            | id           |
| title         | title        |
| description   | description  |
| category      | category     |
| Photo / Video | type         |
| imageUrl      | image_url    |
| videoUrl      | video_url    |
| aspectRatio   | aspect_ratio |

---

## 2️⃣ TABLE: `hero_slides`

👉 untuk **Hero slider (foto + video cinematic)**

### SQL

```sql
create table public.hero_slides (
  id serial primary key,

  location text not null,
  title text not null,
  description text,

  image_url text not null,
  video_url text not null,

  category text,

  created_at timestamp with time zone default now()
);
```

### Mapping

| Frontend    | DB          |
| ----------- | ----------- |
| id          | id          |
| location    | location    |
| title       | title       |
| description | description |
| imageUrl    | image_url   |
| videoUrl    | video_url   |
| category    | category    |

---

## 3️⃣ TABLE: `packages`

👉 untuk **Pricing / Packages**

### SQL

```sql
create table public.packages (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  price text not null,
  color text,

  created_at timestamp with time zone default now()
);
```

---

## 4️⃣ TABLE: `package_features`

👉 detail isi package (photo & video dipisah)

### SQL

```sql
create table public.package_features (
  id uuid primary key default gen_random_uuid(),

  package_id uuid references public.packages(id) on delete cascade,

  type text check (type in ('photo', 'video')) not null,
  feature text not null
);
```

### Contoh isi:

| package_id | type  | feature                 |
| ---------- | ----- | ----------------------- |
| BASIC      | photo | 1 Lead Photographer     |
| BASIC      | video | 1 Minute Highlight Film |

---

## 5️⃣ TABLE: `brands`

👉 untuk **brand logo slider**

### SQL

```sql
create table public.brands (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  row_position int check (row_position in (1,2)),

  created_at timestamp with time zone default now()
);
```

### Mapping

* `BRANDS_ROW_1` → `row_position = 1`
* `BRANDS_ROW_2` → `row_position = 2`

---

## 6️⃣ TABLE: `categories`

👉 **MASTER CATEGORY (PENTING)**

> ini bikin filtering aman & konsisten

### SQL

```sql
create table public.categories (
  id uuid primary key default gen_random_uuid(),

  name text not null unique,
  slug text not null unique,

  created_at timestamp with time zone default now()
);
```

### Contoh data

| name               | slug               |
| ------------------ | ------------------ |
| Wedding            | wedding            |
| Band Music         | band-music         |
| Project Pemerintah | project-pemerintah |

---

## 🔐 RLS POLICY (WAJIB BIAR DATA KEBACA)

Untuk semua table di atas:

### Enable RLS

```sql
alter table public.projects enable row level security;
alter table public.hero_slides enable row level security;
alter table public.packages enable row level security;
alter table public.package_features enable row level security;
alter table public.brands enable row level security;
alter table public.categories enable row level security;
```

### Policy READ PUBLIC

```sql
create policy "public read"
on public.projects
for select
to public
using (true);
```

➡️ ulangi policy ini untuk semua table

---

## 🧠 REKOMENDASI BEST PRACTICE

* `category` **pakai slug**, bukan label

  ```ts
  category: 'band-music'
  ```
* label di frontend pakai mapping
* jangan simpan array di DB → **pakai relational table**

---

## 🏁 KESIMPULAN

Dengan struktur ini:

* ✅ cocok 100% sama dummy lo
* ✅ scalable
* ✅ gampang fetch Supabase
* ✅ filtering gak bakal error lagi
* ✅ siap production

Kalau mau, gw bisa:

* bikinin **SQL INSERT dari dummy data**
* bikinin **Supabase fetch function**
* atau **ERD diagram biar makin kebayang**

tinggal bilang 🔥
