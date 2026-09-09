-- Execute este SQL no SQL Editor do Supabase.
create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text default 'Evento escolar',
  text text,
  event_date date,
  created_at timestamptz default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  text text not null,
  stars int not null default 5 check (stars between 1 and 5),
  published boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  created_at timestamptz default now()
);

alter table public.events enable row level security;
alter table public.reviews enable row level security;
alter table public.gallery enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "public read events" on public.events;
create policy "public read events" on public.events for select using (true);

drop policy if exists "public read published reviews" on public.reviews;
create policy "public read published reviews" on public.reviews for select using (published = true);

drop policy if exists "public read gallery" on public.gallery;
create policy "public read gallery" on public.gallery for select using (true);

-- Permite envio de formulário sem expor dados existentes.
drop policy if exists "public insert contact" on public.contact_messages;
create policy "public insert contact" on public.contact_messages for insert with check (true);

insert into public.events (title, category, text, event_date)
select 'FEST LIMA', 'Arte & Cultura', 'Semanas de arte e cultura com expressão, criatividade e convivência.', current_date
where not exists (select 1 from public.events where title = 'FEST LIMA');

insert into public.events (title, category, text, event_date)
select 'Feiras culturais', 'Conhecimento', 'Projetos e apresentações que aproximam estudantes, professores, famílias e comunidade.', current_date + 30
where not exists (select 1 from public.events where title = 'Feiras culturais');

insert into public.events (title, category, text, event_date)
select 'Passeios escolares', 'Experiências', 'Aprendizagem para além da sala de aula, com experiências que ficam na memória.', current_date + 60
where not exists (select 1 from public.events where title = 'Passeios escolares');

-- IMPORTANTE:
-- Não coloque a service_role key no frontend.
-- Para fotos oficiais, crie um bucket público chamado "gallery" e salve as URLs na tabela gallery.
