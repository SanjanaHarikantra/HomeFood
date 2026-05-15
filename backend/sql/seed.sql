USE dabba_wala;

INSERT INTO meals (title, description, price, image_url, rating, tag)
VALUES
  ('Aai''s Daily Thali', '2 phulka, dal fry, jeera rice, sabzi and salad', 169.00, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80', '4.8', 'Veg'),
  ('Protein Power Box', 'Brown rice, tofu masala, sprouts, curd', 219.00, 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80', '4.7', 'Veg'),
  ('Comfort Khichdi Combo', 'Moong dal khichdi, ghee, papad, buttermilk', 149.00, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', '4.6', 'Veg'),
  ('Chicken Curry Tiffin', 'Steamed rice, home-style chicken curry, salad', 249.00, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80', '4.7', 'Non-Veg')
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO coupons (code, label, type, value, min_order, max_discount)
VALUES
  ('SWIGGY10', '10 percent off up to Rs50', 'percent', 10, 149, 50),
  ('TIFFIN50', 'Flat Rs50 off on Rs199+', 'flat', 50, 199, NULL),
  ('FRESH15', '15 percent off up to Rs80', 'percent', 15, 249, 80),
  ('WELCOME25', '25 percent off up to Rs120 on Rs399+', 'percent', 25, 399, 120)
ON DUPLICATE KEY UPDATE label = VALUES(label);

INSERT INTO subscription_plans (name, price, duration_days, description)
VALUES
  ('Daily Plan', 1499.00, 30, 'Fresh meal every day'),
  ('Weekly Plan', 499.00, 7, '7-day lunch plan'),
  ('Monthly Plan', 3999.00, 30, 'Custom monthly meals')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO home_chefs (chef_name, kitchen_name, area, city, cuisine_tag, bio, rating, review_count, delivery_time_mins, delivery_radius_km, veg_only, image_url)
VALUES
  ('Sushmita Joshi', 'Aai''s Kitchen', 'Bandra West', 'Mumbai', 'Veg', 'Warm Maharashtrian thalis, khichdi bowls, and weekly tiffin plans.', 4.8, 128, 28, 6.5, 1, 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80'),
  ('Ayesha Khan', 'Noor Home Kitchen', 'Andheri East', 'Mumbai', 'Healthy', 'Protein-rich bowls, low-oil lunchboxes, and office-friendly meals.', 4.7, 96, 30, 6.0, 0, 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80'),
  ('Meenal Patil', 'Weekend Dabba Studio', 'Powai', 'Mumbai', 'Budget', 'Pocket-friendly homestyle meals with rotating specials and family packs.', 4.6, 74, 35, 5.0, 1, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80')
ON DUPLICATE KEY UPDATE kitchen_name = VALUES(kitchen_name);

INSERT INTO chef_menu_items (chef_id, title, description, price, category, tags, image_url, is_veg, is_healthy, is_tiffin, is_budget)
VALUES
  (1, 'Aai''s Daily Thali', '2 phulka, dal fry, jeera rice, sabzi and salad', 169.00, 'Lunch', 'veg,thali,tiffin,budget', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80', 1, 0, 1, 1),
  (1, 'Comfort Khichdi Combo', 'Moong dal khichdi, ghee, papad, buttermilk', 149.00, 'Healthy', 'veg,healthy,tiffin', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80', 1, 1, 1, 1),
  (1, 'Paneer Millet Bowl', 'Millet pulao, paneer tikka, saute veggies', 229.00, 'Healthy', 'veg,healthy,premium', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80', 1, 1, 0, 0),
  (2, 'Chicken Curry Tiffin', 'Steamed rice, home-style chicken curry, salad', 249.00, 'Dinner', 'non-veg,tiffin', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80', 0, 0, 1, 0),
  (2, 'Protein Power Box', 'Brown rice, tofu masala, sprouts, curd', 219.00, 'Healthy', 'veg,healthy,protein', 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80', 1, 1, 1, 0),
  (3, 'Budget Dal Rice', 'Rice, dal tadka, cabbage sabzi and pickle', 129.00, 'Budget', 'veg,budget,tiffin', 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1200&q=80', 1, 0, 1, 1)
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO chef_reviews (chef_id, customer_id, order_id, rating, review_text)
VALUES
  (1, NULL, NULL, 5, 'Feels like home every day. Very consistent taste.'),
  (1, NULL, NULL, 5, 'Perfect tiffin portions and always delivered warm.'),
  (2, NULL, NULL, 5, 'Great healthy meals for work days.'),
  (3, NULL, NULL, 4, 'Budget-friendly and surprisingly tasty.')
ON DUPLICATE KEY UPDATE review_text = VALUES(review_text);
