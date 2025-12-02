ALTER TABLE "User" ADD COLUMN "customPrompt" text;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "export_id_idx" ON "Export" USING btree ("ExportID");