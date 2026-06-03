INSERT INTO tanks (tank_name, water_level)
VALUES
('Main Tank', 75),
('Backup Tank', 40)
ON CONFLICT DO NOTHING;