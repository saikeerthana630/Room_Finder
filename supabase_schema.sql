-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create rooms table
create table public.rooms (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references auth.users(id) not null,
  title text not null,
  location text not null,
  rent numeric not null,
  property_type text not null,
  tenant_preference text not null,
  contact_number text not null,
  images text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.rooms enable row level security;

-- Policies
-- 1. Everyone can view rooms
create policy "Public rooms are viewable by everyone"
  on public.rooms for select
  using ( true );

-- 2. Owners can insert their own rooms
create policy "Users can insert their own rooms"
  on public.rooms for insert
  with check ( auth.uid() = owner_id );

-- 3. Owners can update their own rooms
create policy "Users can update their own rooms"
  on public.rooms for update
  using ( auth.uid() = owner_id );

-- 4. Owners can delete their own rooms
create policy "Users can delete their own rooms"
  on public.rooms for delete
  using ( auth.uid() = owner_id );

-- Storage Bucket Setup (You need to create 'room-images' bucket in Supabase Dashboard)
-- Policy for storage (if possible via SQL, otherwise Dashboard)
-- insert
-- create policy "Authenticated users can upload images"
-- on storage.objects for insert
-- with check ( bucket_id = 'room-images' and auth.role() = 'authenticated' );

-- select
-- create policy "Public Access to images"
-- on storage.objects for select
-- using ( bucket_id = 'room-images' );
