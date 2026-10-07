DO $$ BEGIN
	IF EXISTS (SELECT 1 FROM "calculations") OR EXISTS (SELECT 1 FROM "plants") OR EXISTS (SELECT 1 FROM "products") THEN
		RAISE EXCEPTION 'legacy tables not empty: export data before migrating';
	END IF;
END $$;--> statement-breakpoint
DROP TABLE "calculations" CASCADE;--> statement-breakpoint
DROP TABLE "plants" CASCADE;--> statement-breakpoint
DROP TABLE "products" CASCADE;