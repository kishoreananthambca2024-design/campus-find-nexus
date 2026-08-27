CREATE TABLE public.items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('LOST','FOUND')),
  contact_name TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','MATCHED','RETURNED')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.items TO authenticated;
GRANT ALL ON public.items TO service_role;

ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view items" ON public.items FOR SELECT USING (true);
CREATE POLICY "Anyone can report items" ON public.items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update item status" ON public.items FOR UPDATE USING (true) WITH CHECK (true);

INSERT INTO public.items (item_name, category, description, location, date, type, contact_name, contact_info, status) VALUES
('Black Wallet', 'Wallet', 'Leather wallet, dark brown interior, contains a few college cards and some cash.', 'CS Block', CURRENT_DATE - 3, 'LOST', 'Arjun Menon', 'arjun.m@college.edu', 'ACTIVE'),
('Black Leather Wallet', 'Wallet', 'Found a black leather wallet near the CS Block staircase. Handed nothing out yet.', 'CS Block', CURRENT_DATE - 2, 'FOUND', 'Priya Nair', '+91 98765 43210', 'ACTIVE'),
('Blue College ID Card', 'ID Card', 'Student ID card with blue lanyard, name starts with K. Lost while studying.', 'Library', CURRENT_DATE - 4, 'LOST', 'Kishore A', 'kishore.a@college.edu', 'ACTIVE'),
('Blue ID Card', 'ID Card', 'Found a blue student ID card on the second floor reading hall table.', 'Library', CURRENT_DATE - 3, 'FOUND', 'Meera Sundar', 'meera.s@college.edu', 'ACTIVE'),
('Wireless Earphones', 'Earphones', 'White and black wireless earbuds in a small charging case.', 'Canteen', CURRENT_DATE - 5, 'LOST', 'Rahul Verma', '+91 91234 55667', 'ACTIVE'),
('Black Earphones', 'Earphones', 'Wireless earbuds left on the canteen counter, handed to the counter staff.', 'Canteen', CURRENT_DATE - 4, 'FOUND', 'Sneha Iyer', 'sneha.i@college.edu', 'ACTIVE'),
('Steel Water Bottle', 'Water Bottle', 'Silver insulated bottle with a dented cap and a few stickers.', 'Sports Ground', CURRENT_DATE - 6, 'LOST', 'Vikram Rao', 'vikram.r@college.edu', 'ACTIVE'),
('Scientific Calculator', 'Other', 'Casio FX-991 calculator with initials written on the back cover.', 'Exam Hall B', CURRENT_DATE - 7, 'FOUND', 'Anita George', 'anita.g@college.edu', 'ACTIVE'),
('Data Structures Textbook', 'Books', 'Second edition textbook with handwritten notes in the margins.', 'Library', CURRENT_DATE - 8, 'LOST', 'Farhan Ali', 'farhan.a@college.edu', 'ACTIVE'),
('Hostel Keys', 'Keys', 'Bunch of two keys on a red keyring, found near the hostel gate.', 'Hostel Block A', CURRENT_DATE - 9, 'FOUND', 'Divya Krishnan', '+91 99887 66554', 'RETURNED');