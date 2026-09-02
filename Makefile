.PHONY: schema-dev schema-release \
         db-dump-dev db-dump-prod db-restore-dev db-restore-prod \
         uploads-dump-dev uploads-dump-prod uploads-restore-dev uploads-restore-prod

COMPOSE_DEV := docker compose
COMPOSE_PROD := docker compose -f compose.release.yaml
BACKUP_DIR := backups

schema-dev: COMPOSE = $(COMPOSE_DEV)
schema-release: COMPOSE = $(COMPOSE_PROD)

schema-dev schema-release:
	$(COMPOSE) stop studio
	$(COMPOSE) run --rm studio node cli.js schema apply --yes /directus/snapshots/schema.yaml
	$(COMPOSE) start studio

# --- Data migration (DB + uploads) ---
# Cross-machine flow: run db-dump-* on the source machine, copy the produced
# file from $(BACKUP_DIR) to the target machine, then run db-restore-* there.
# Both DB dump and uploads must be migrated together (files metadata lives in DB,
# binaries live in the uploads volume).

db-dump-dev:
	@mkdir -p $(BACKUP_DIR)
	$(COMPOSE_DEV) exec -T db pg_dump -U postgres -Fc --no-owner studio > $(BACKUP_DIR)/studio-dev-$$(date +%Y%m%d-%H%M%S).dump

db-dump-prod:
	@mkdir -p $(BACKUP_DIR)
	$(COMPOSE_PROD) exec -T db pg_dump -U postgres -Fc --no-owner studio > $(BACKUP_DIR)/studio-prod-$$(date +%Y%m%d-%H%M%S).dump

db-restore-dev:
	@test -n "$(DUMP)" || (echo "Usage: make db-restore-dev DUMP=backups/studio-XXX.dump" && exit 1)
	$(COMPOSE_DEV) stop studio
	$(COMPOSE_DEV) exec -T db pg_restore -U postgres --clean --if-exists --no-owner -d studio $(DUMP)
	$(COMPOSE_DEV) start studio

db-restore-prod:
	@test -n "$(DUMP)" || (echo "Usage: make db-restore-prod DUMP=backups/studio-XXX.dump" && exit 1)
	$(COMPOSE_PROD) stop studio
	$(COMPOSE_PROD) exec -T db pg_restore -U postgres --clean --if-exists --no-owner -d studio $(DUMP)
	$(COMPOSE_PROD) start studio

uploads-dump-dev:
	@mkdir -p $(BACKUP_DIR)
	$(COMPOSE_DEV) exec -T studio tar czf - -C /directus uploads > $(BACKUP_DIR)/uploads-dev-$$(date +%Y%m%d-%H%M%S).tar.gz

uploads-dump-prod:
	@mkdir -p $(BACKUP_DIR)
	$(COMPOSE_PROD) exec -T studio tar czf - -C /directus uploads > $(BACKUP_DIR)/uploads-prod-$$(date +%Y%m%d-%H%M%S).tar.gz

uploads-restore-dev:
	@test -n "$(UP)" || (echo "Usage: make uploads-restore-dev UP=backups/uploads-XXX.tar.gz" && exit 1)
	$(COMPOSE_DEV) exec -T studio tar xzf - -C /directus < $(UP)

uploads-restore-prod:
	@test -n "$(UP)" || (echo "Usage: make uploads-restore-prod UP=backups/uploads-XXX.tar.gz" && exit 1)
	$(COMPOSE_PROD) exec -T studio tar xzf - -C /directus < $(UP)
