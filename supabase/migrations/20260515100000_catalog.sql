-- ============================================================
-- KATALOG: categories, products, product_variants,
--          print_methods, print_price_tiers, product_media
-- ============================================================

-- Produktkategorier (hierarkiska via self-ref)
CREATE TABLE categories (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id     uuid REFERENCES categories(id) ON DELETE SET NULL,
  name          text NOT NULL,
  slug          text NOT NULL UNIQUE,
  sort_order    int DEFAULT 0,
  ai_boost_score numeric DEFAULT 1.0,
  created_at    timestamptz DEFAULT now()
);

-- Produkter (master-tabell, synkad från leverantör)
CREATE TABLE products (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_product_id   text NOT NULL UNIQUE,
  slug                  text NOT NULL UNIQUE,
  name                  text NOT NULL,
  description           text,
  category_id           uuid REFERENCES categories(id) ON DELETE SET NULL,
  base_price            numeric(10,2) NOT NULL,
  currency              text DEFAULT 'SEK',
  min_qty               int DEFAULT 1,
  is_active             bool DEFAULT true,
  supplier_synced_at    timestamptz,
  ai_tags               text[],
  ai_embedding          vector(1536),
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

-- Produktvarianter (färg, storlek, material)
CREATE TABLE product_variants (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color_name      text,
  color_hex       char(7),
  color_pantone   text,
  size            text,
  material        text,
  stock_qty       int DEFAULT 0,
  supplier_sku    text NOT NULL UNIQUE,
  images          jsonb DEFAULT '[]',
  is_active       bool DEFAULT true,
  created_at      timestamptz DEFAULT now()
);

-- Tryckmetoder per produkt
CREATE TABLE print_methods (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id          uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  method_type         text NOT NULL,
  position_name       text NOT NULL,
  max_colors          int,
  max_area_mm         jsonb,
  setup_fee           numeric(10,2) DEFAULT 0,
  supplier_method_id  text,
  is_active           bool DEFAULT true
);

-- Prismatris per tryckmetod (upplaga × färger → pris)
CREATE TABLE print_price_tiers (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  print_method_id   uuid NOT NULL REFERENCES print_methods(id) ON DELETE CASCADE,
  qty_from          int NOT NULL,
  qty_to            int,
  colors            int NOT NULL DEFAULT 1,
  price_per_unit    numeric(10,2) NOT NULL,
  our_markup_pct    numeric(5,2) DEFAULT 40.0
);

-- Produktmedia
CREATE TABLE product_media (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id  uuid REFERENCES product_variants(id) ON DELETE CASCADE,
  url         text NOT NULL,
  type        text DEFAULT 'image',
  sort_order  int DEFAULT 0,
  is_primary  bool DEFAULT false
);

-- Index för vanliga queries
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_print_methods_product ON print_methods(product_id);
CREATE INDEX idx_price_tiers_method ON print_price_tiers(print_method_id);

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE print_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE print_price_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;

-- Katalogtabeller är publikt läsbara (ingen inloggning krävs)
CREATE POLICY "public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "public read products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "public read variants" ON product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "public read print_methods" ON print_methods FOR SELECT USING (is_active = true);
CREATE POLICY "public read price_tiers" ON print_price_tiers FOR SELECT USING (true);
CREATE POLICY "public read product_media" ON product_media FOR SELECT USING (true);
