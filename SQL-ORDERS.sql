-- ==========================================
-- RUANG IMAJI: FIX RLS POLICY FOR ORDERS
-- ==========================================

-- 1. Pastikan tabel 'orders' sudah ada.
-- 2. Jalankan perintah di bawah ini di Supabase SQL Editor:

-- Enable Row Level Security (RLS) pada tabel orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Izinkan publik (anon) untuk memasukkan data (INSERT) ke tabel orders.
-- Ini penting agar form di website bisa mengirim data meskipun pengunjung tidak login.
DROP POLICY IF EXISTS "Allow Public Insert" ON public.orders;
CREATE POLICY "Allow Public Insert" ON public.orders
FOR INSERT TO anon WITH CHECK (true);

-- Memberikan izin teknis (Permission) ke role anon & authenticated
GRANT INSERT ON TABLE public.orders TO anon;
GRANT INSERT ON TABLE public.orders TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- (Opsional) Izinkan service_role (Admin/Backend) untuk melakukan apa saja
DROP POLICY IF EXISTS "Allow Service Role Everything" ON public.orders;
CREATE POLICY "Allow Service Role Everything" ON public.orders
FOR ALL TO service_role USING (true);
GRANT ALL ON TABLE public.orders TO service_role;

-- (Opsional) Jika ingin publik bisa melihat data (biasanya tidak diperlukan untuk privasi)
-- DROP POLICY IF EXISTS "Allow Public Select" ON public.orders;
-- CREATE POLICY "Allow Public Select" ON public.orders
-- FOR SELECT TO anon USING (true);

-- Verifikasi policy yang aktif
SELECT * FROM pg_policies WHERE tablename = 'orders';
