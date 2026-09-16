.PHONY: schema-dev schema-release permissions bootstrap seed seed-demo \
         db-dump-dev db-dump-prod db-restore-dev db-restore-prod \
         uploads-dump-dev uploads-dump-prod uploads-restore-dev uploads-restore-prod \
         sync-setup check tunnel-up tunnel-down pull push \
         db-pull db-push files-pull files-push

COMPOSE_DEV := docker compose
COMPOSE_PROD := docker compose -f compose.release.yaml
BACKUP_DIR := backups

schema-dev: COMPOSE = $(COMPOSE_DEV)
schema-release: COMPOSE = $(COMPOSE_PROD)

# Ensure the studio boots first so Directus bootstraps an admin user (when the
# DB is fresh), apply the project schema, then restore access policies.
schema-dev schema-release:
	$(COMPOSE) up -d studio
	@echo "Waiting for Directus to finish bootstrapping..."
	@until curl -s -o /dev/null http://localhost:8055/server/health; do sleep 2; done
	$(COMPOSE) exec -T studio node cli.js schema apply --yes /directus/snapshots/schema.yaml
	$(COMPOSE) restart studio
	@echo "Applying access policies..."
	@set -a; . ./.env; set +a; python3 directus/setup/permissions.py

# Re-apply access policies independently of schema (idempotent).
permissions:
	@set -a; . ./.env; set +a; python3 directus/setup/permissions.py

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

# --- Полное развёртывание с нуля и сиды ---
# bootstrap: схема + права + реальный контент (тексты, прайс, галереи из фото).
# seed:       только сиды контента (требует уже запущенный Directus).
# seed-demo:  демо-модели yana/kirochka (для локальной проверки UI).

seed:
	@set -a; . ./.env; set +a; \
	export IMAGES_ROOT="$${IMAGES_ROOT:-$$HOME/Desktop/KiraSekiraProject/kira-images}"; \
	python3 directus/setup/seed_core.py && \
	python3 directus/setup/seed_real_galleries.py

seed-demo:
	@set -a; . ./.env; set +a; python3 directus/setup/seed_models.py

bootstrap: schema-dev seed

# --- Синхронизация локальный стек <-> прод (VPS) ---
# Подробности и требования — в scripts/sync.sh и README (раздел «Миграция»).

sync-setup:
	bash scripts/sync.sh setup

check:
	bash scripts/sync.sh check

tunnel-up:
	bash scripts/sync.sh tunnel-up

tunnel-down:
	bash scripts/sync.sh tunnel-down

pull: files-pull db-pull
push: files-push db-push

db-pull db-push files-pull files-push:
	bash scripts/sync.sh $@
