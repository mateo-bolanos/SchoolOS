# Frontend Setup Guide

## Overview
SchoolOS targets a React + Material UI single-page application for the web client. The repository does not yet include a committed frontend scaffold, so these instructions focus on preparing the workspace and coordinating upcoming implementation work.

## Current repository state
- The `frontend/` directory has not been generated yet; the only JavaScript artifacts are placeholder `package.json` and `package-lock.json` files at the repository root.
- Because no React app is committed, the `node_modules/` directory is empty of project-specific packages.

## Prepare your environment
1. Install the latest Node.js LTS release (which provides `npm`).
2. From the repository root, run `npm --version` to confirm tooling is available.
3. Coordinate with the frontend implementation tasks before committing any generated files.

## Bootstrapping the React app
When ready to initialize the frontend:
1. Scaffold a React + Vite project inside `frontend/` (or follow the chosen React tooling) and ensure Material UI dependencies are added.
2. Move reusable building blocks into `frontend/src/components/common/` to align with the planned structure.
3. Configure environment variables (for example, `VITE_API_URL`) using `.env.local` instead of hardcoding API endpoints.
4. Document any additional scripts in `package.json` so that `npm install` and `npm run dev` work consistently.

## Development workflow
- Keep the frontend communicating only with documented backend endpoints once they are exposed.
- Validate UI behaviour with React Testing Library or Cypress as automated tests become available.
- Update this guide whenever new directories, scripts, or environment variables are introduced.
