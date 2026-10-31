# WorkTracker Makefile inside projecttrack/

.PHONY: all build exe test push clean help

help:
	@echo "Work Tracker Automation Commands:"
	@echo "  make all       - Build frontend and compile Windows desktop .exe"
	@echo "  make build     - Build frontend production bundle"
	@echo "  make exe       - Build Windows installer and portable .exe"
	@echo "  make test      - Run end-to-end multi-type planner test suite"
	@echo "  make push      - Commit and push changes to GitHub"

all: build exe

build:
	@echo "Building frontend..."
	npm --prefix frontend run build

exe:
	@echo "Compiling Electron Windows executable..."
	npm --prefix electron run dist

test:
	@echo "Running test suite..."
	node backend/test_multitype_planner_e2e.mjs
	node backend/test_all_types.mjs
	node backend/test_full_user_journey.mjs

push:
	@echo "Pushing code to git repositories..."
	node git_and_build.mjs

