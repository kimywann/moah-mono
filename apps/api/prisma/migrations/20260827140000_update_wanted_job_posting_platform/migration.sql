UPDATE "job_postings"
SET "platform" = 'WANTED'
WHERE "platform" = 'OTHER'
  AND "url" ~ '^https?://([[:alnum:]-]+\.)*wanted\.co\.kr(/|$)';
