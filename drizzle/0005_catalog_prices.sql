CREATE TABLE "catalog_prices" (
	"slug" varchar(50) NOT NULL,
	"field" varchar(20) NOT NULL,
	"min" double precision NOT NULL,
	"max" double precision NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "catalog_prices_slug_field_pk" PRIMARY KEY("slug","field")
);
