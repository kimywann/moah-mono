DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'job_postings'
          AND column_name = 'sourceUrl'
    ) THEN
        EXECUTE 'ALTER TABLE "job_postings" RENAME COLUMN "sourceUrl" TO "url"';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE schemaname = 'public'
          AND indexname = 'job_postings_sourceUrl_key'
    ) THEN
        EXECUTE 'ALTER INDEX "job_postings_sourceUrl_key" RENAME TO "job_postings_url_key"';
    END IF;
END $$;
