-- Aktivera pgvector för semantisk sökning
-- Måste köras innan catalog-migration
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;
