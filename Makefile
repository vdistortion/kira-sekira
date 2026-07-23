.PHONY: schema-dev schema-release

COMPOSE_DEV := docker compose
COMPOSE_PROD := docker compose -f compose.release.yaml

schema-dev: COMPOSE = $(COMPOSE_DEV)
schema-release: COMPOSE = $(COMPOSE_PROD)

schema-dev schema-release:
	$(COMPOSE) stop studio
	$(COMPOSE) run --rm studio npx directus schema apply /directus/snapshots/schema.yaml
	$(COMPOSE) start studio
