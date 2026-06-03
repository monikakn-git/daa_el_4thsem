# Pending Work for EERAS Project

## Backend / API Integration
- Implement or connect a backend server at `http://localhost:5000`.
- Required endpoints currently referenced by the front end:
  - `GET /analytics/dashboard`
  - `GET /analytics/performance`
  - `GET /tasks`
  - `GET /processors`
  - `POST /tasks`
  - `POST /simulation/start`
  - `POST /simulation/pause`
  - `POST /simulation/reset`
  - `POST /dvfs/update`
  - `POST /processors`
- Implement Socket.IO events expected by front end:
  - `analytics_updated`
  - `task_created`
  - `task_updated`
  - `task_deleted`
  - `allocation_created`
  - `processor_updated`
  - `dvfs_updated`

## Documentation Page
- Fill in the content for the following sections:
  - Objectives
  - Algorithms
  - DVFS Model
- `DocumentationPage` currently displays placeholder text for these sections.

## Contact Page
- The contact form does not submit anywhere; it currently only prevents the default form action.
- Add a working form submission endpoint or integrate with an email/service API.

## Dashboard and Analytics
- Confirm the dashboard API data contract and ensure real-time updates work as expected.
- Some KPI values are based on dummy fallback values and may need alignment with backend payload.

## Simulation / DVFS Features
- Verify the task scheduling simulation backend supports the front-end model.
- Confirm DVFS control updates (`/dvfs/update`) and processor telemetry are functional.
- The UI is built for interactive changes, but the backend service is required.

## General Notes
- No explicit `TODO` / `FIXME` markers exist in the source code.
- Primary pending work is backend wiring, documentation content, and contact form submission.
