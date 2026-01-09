# Room Finder

A modern Room Finder application built with React, Tailwind CSS, and Supabase.

## Features

- **For Room Finders (Users)**: 
  - Search rooms by location.
  - Advanced filters (Reference, Price Range, Property Type).
  - View detailed room cards with owner contact.
  - No login required to browse.

- **For Room Owners**: 
  - Secure Authentication via Email (Magic Link / OTP).
  - Dashboard to manage listings ("My Rooms").
  - Add new rooms with details and specific tenant preferences.
  - Upload multiple room images.
  - Edit and Delete listings.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Supabase Configuration
1. Create a new project at [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of `supabase_schema.sql` (located in the project root) and run it.
   - This creates the `rooms` table.
   - Sets up Row Level Security (RLS) policies.
4. Go to **Storage** and create a new bucket named `room-images`.
   - Ensure the bucket is **Public**.

### 3. Environment Variables
Open `.env` file and update it with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view the app.

## Tech Stack
- **Frontend**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Backend & Auth**: Supabase
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
