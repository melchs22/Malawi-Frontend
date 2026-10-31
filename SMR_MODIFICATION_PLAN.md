# Smart Mobility Roadcare (SMR) Modification Plan

**Purpose:** Turn the supplied SMR product brief into a practical, sequenced plan for the existing software.

**Repositories reviewed**

- `Admin-Dashboard` — Next.js administration application.
- `../vehix-backend` — Django REST API and the Rider/Roadie Flutter applications.
- The standalone workshop web portal was not present in either inspected repository. It is treated below as a separate client of the backend; its framework and repository must be confirmed before portal implementation.

**Planning boundary:** This plan does not assume Base44, a React/Vite single-page app, or a single portal for all user roles. It preserves the current admin dashboard, backend, mobile apps, and independent workshop portal as separate clients.

## 1. Executive recommendation

Extend the existing Django API and Next.js admin dashboard incrementally. Do not replace either with the Base44 architecture in the supplied reference. Retain the backend’s two operational concepts as separate workflows:

1. **Roadside assistance:** the current `ServiceRequest` flow, assigned to a `RODIE`/mechanic and backed by real-time location and dispatch.
2. **Scheduled workshop servicing:** the `Garage` and `GarageServiceRequest` domain, exposed to the standalone workshop portal and member client.

The garage domain started as a partial feature. Its backend foundation and workshop lifecycle have now been implemented as a separate domain. The Next.js admin dashboard now includes workshop review and scheduled-booking screens; the standalone workshop portal remains pending its repository/path.

The launch decisions for this milestone are Malawi, existing `RIDER` accounts as members, one owner account per workshop initially, separate workshop bookings and roadside assistance, PayChangu for workshop invoice collection, and manual admin-recorded workshop settlements. Existing wallet/Pesapal and roadside payment behavior is still Uganda-oriented and has not been silently migrated.

## Implementation checkpoint

| Phase | Status | Delivered / remaining |
|---|---|---|
| Phase 0 — Discovery | Partially complete | Malawi, member-role mapping, workshop ownership, workflow separation, and workshop payment policy are confirmed. The standalone portal's repository/deployment details and membership/training policies remain unconfirmed. |
| Phase 1 — Backend foundation | MVP backend foundation delivered | Added the `WORKSHOP` role/login, approved-owner activation, admin/member/workshop permission classes, one-owner-per-garage linkage, scoped workshop/member queries, lifecycle audit events, request/payment throttles, and tests. Multi-staff access, request IDs, and dashboard permission integration remain out of scope. |
| Phase 2 — Workshop MVP | Backend API and initial admin screens delivered | Added application tracking/review, workshop profile/queue, quote scheduling and response, job transitions, quote-based invoice, PayChangu checkout/webhook/reconciliation, manual settlements, reviews, and admin endpoints. The dashboard now has separate workshop review and booking pages. Vehicle linkage, multi-staff support, refunds, and the standalone portal are not included. |
| Database rollout | Migration generated; rollout pending | `garages/migrations/0003_garageinvoice_garage_owner_user_and_more.py` is generated and checked against garage models. It has not been applied to a shared or production PostgreSQL database. |
| Web clients | Admin dashboard delivered; standalone portal pending | Added typed workshop/admin API methods, granular permissions, navigation, workshop review/detail actions, and a distinct scheduled-bookings queue. The dashboard production build passes. Portal implementation requires its repository/path and technology stack. |

**Frontend validation note:** `npm run build` succeeds and includes both new routes. The repository's Next.js config skips type validation; standalone `tsc --noEmit` currently reports 48 pre-existing errors in unrelated files and none in the new workshop pages or changed API/permission/sidebar files. The configured lint script cannot run because ESLint is not present in the dependency manifest or installed dependencies.

No sample workshop records or seeded operational data were added. Payment credentials and public HTTPS callback/return URLs have not been supplied; checkout therefore remains unavailable until real merchant configuration is installed.

## 2. Current-state assessment

| Area | Observed implementation | Consequence for the plan |
|---|---|---|
| Admin UI | Next.js App Router, TypeScript, React, and an API client in `lib/api.ts`. Admin screens include requests, roadies, riders, services, reports, wallet, and transactions. | Add SMR administration features to the existing dashboard; do not create a replacement single-page app. |
| Backend | Django 5.2, Django REST Framework, PostgreSQL, JWT authentication, Redis/Channels, and Celery dependencies. API routes are grouped under `/api/`. | Keep domain rules, persistence, authorization, integrations, and workflows in this backend. |
| Identity | Backend now includes `WORKSHOP` alongside `RIDER`, `RODIE`, `MECHANIC`, and `ADMIN`; the dashboard has its own admin permission vocabulary and role map. | Keep dashboard permission integration aligned to backend permissions; UI hiding alone is not authorization. |
| Roadside service | `ServiceRequest` already tracks rider/roadie, coordinates, assignment, paid/fee flags, status transitions, and lifecycle timestamps. Admin request endpoints, live-location endpoints, route lookup, assignment, and job reporting are wired. | Extend this operational flow only for roadside work; preserve compatibility for Rider and Roadie apps. |
| Workshops | `Garage` already contains business, location, operating-hours, service, pricing, compliance, and verification fields. `GarageServiceRequest` has a simpler request/status/cost record. | Reuse the garage domain as the workshop/service-centre record. Do not introduce a second parallel `ServiceCenter` table without a migration decision. |
| Workshop workflow | The backend now links one workshop owner to each garage and exposes registration/status lookup, admin review, owner activation, scoped profile/queue, quotes, appointment transitions, invoices, PayChangu collection, manual settlements, reviews, and audit APIs. | Connect the standalone portal and admin dashboard to the documented contracts; preserve roadside request APIs separately. |
| Admin/workshop integration | The dashboard’s roadside request pages use `/api/auth/admin/requests/`. | The dashboard now uses typed garage endpoints and separate workshop review and appointment pages rather than repurposing roadside requests. |
| Member product | Existing `RIDER` accounts are the confirmed member identity for this milestone. The backend repository also contains separate Rider and Roadie Flutter apps. | Membership remains a separate future domain linked to the Rider; a registered vehicle association is also future scope. |
| Requested product entities | No Vehicle, membership/NFC, training-course/session, or rider-certification domain models were found in the inspected Django source. Service-request ratings concern the current service workflow; they are not workshop reviews. | These are new backend domains, not just missing dashboard pages. |
| Payments and region | Workshop registration validates Malawi phone numbers and workshop payments use MWK/PayChangu with signed webhook verification; timezone defaults to `Africa/Blantyre`. Legacy wallet/Pesapal flows remain unchanged. | Configure real PayChangu credentials and HTTPS return/callback URLs before enabling checkout. Plan a separate regional migration for legacy payments. |
| Tests | Backend workshop API tests now cover scoped access, owner approval, lifecycle, payment verification/settlement, webhook signing, schedule validation, and public-signup denial. | Continue running the existing roadside suite against PostgreSQL as a regression check; add web-client contract/UI tests with the client implementation. |
| Workshop portal | No standalone workshop web portal source was found in the inspected `Downloads` projects. | Keep its API and role boundary explicit; obtain its repository/stack before estimating or changing its UI. |

### Source locations checked

- Admin: [README.md](./README.md), [package.json](./package.json), [lib/api.ts](./lib/api.ts), [lib/permissions.ts](./lib/permissions.ts), [components/admin-sidebar.tsx](./components/admin-sidebar.tsx), [app/sys-admin/workshops/page.tsx](./app/sys-admin/workshops/page.tsx), [app/sys-admin/workshop-bookings/page.tsx](./app/sys-admin/workshop-bookings/page.tsx), [app/sys-admin/requests/page.tsx](./app/sys-admin/requests/page.tsx), [app/sys-admin/page.tsx](./app/sys-admin/page.tsx)
- Backend: [config/urls.py](../vehix-backend/config/urls.py), [config/settings.py](../vehix-backend/config/settings.py), [users/models.py](../vehix-backend/users/models.py), [users/urls.py](../vehix-backend/users/urls.py), [users/pesapal.py](../vehix-backend/users/pesapal.py), [service_requests/models.py](../vehix-backend/service_requests/models.py), [service_requests/admin_views.py](../vehix-backend/service_requests/admin_views.py), [garages/models.py](../vehix-backend/garages/models.py), [garages/views.py](../vehix-backend/garages/views.py), [garages/serializers.py](../vehix-backend/garages/serializers.py), [garages/urls.py](../vehix-backend/garages/urls.py)

## 3. Product and architecture decisions

Confirmed decisions are recorded here. Open items remain release gates for the later domains and client deployment:

1. **Launch geography — confirmed:** Malawi for workshop workflows (`MWK`, `Africa/Blantyre`, Malawi E.164 phone validation). This does not migrate Uganda-specific wallet or roadside payment code.
2. **Member identity — confirmed:** the existing `RIDER` role is the member account; membership will be linked later rather than introduced as a replacement role.
3. **Workshop ownership — confirmed for initial release:** one owner account per workshop. Supporting additional staff accounts is not included in this schema.
4. **Workflow boundary — confirmed:** garage bookings are distinct from roadside `ServiceRequest` dispatch and do not assign Roadies.
5. **Workshop payments — confirmed:** PayChangu collects member payments centrally; actual workshop transfers are recorded manually by admins. No automated payout, refund, or split-payment feature is included.
6. **Workshop portal — product boundary confirmed; repository unresolved:** it is a separate web client. Its codebase, deployment, and release owner still need to be identified before UI work.
7. **Membership policy — open:** tiers, benefits, term, renewal/grace rules, NFC lifecycle, and refund policy.
8. **Training/certification policy — open:** course ownership, pass thresholds, practical assessment, certificate expiry, and issue/revoke authority.

## 4. Target system boundaries

| Client | Responsibility | Backend data/workflows |
|---|---|---|
| Rider/member app | Account/profile, owned vehicles, service-centre discovery, scheduled service requests, roadside SOS, membership, notifications, training. | Authenticated member-owned records; available public/verified workshops and courses; payment status. The existing Rider Flutter app is a likely integration surface, subject to product confirmation. |
| Independent workshop portal | Workshop onboarding/status, staff access, profile/services/hours, appointment queue, quote/accept/decline, job progress, final cost, invoice, and reviews. | Garage/workshop account membership, only that workshop’s records, scheduled service lifecycle, documents, and audit events. This is not the admin dashboard. |
| Roadie app | Roadie availability, offers, navigation/location, roadside job lifecycle, earnings. | Existing `RODIE` dispatch and `ServiceRequest` domain. Preserve current endpoints and message/event compatibility. |
| Admin dashboard | Platform operations, review/approval, exception handling, oversight, reporting, and configuration. | Admin-only APIs with granular server-side permissions. Add separate screens for workshops, vehicles, memberships, training, and service-centre bookings. |
| Django backend | Source of truth for auth, policy, workflow transitions, persistence, integrations, audit, and notifications. | Versioned/compatible REST API, PostgreSQL, Channels/Redis for live state, and Celery for scheduled/retryable work. |

**Boundary rule:** The dashboard may display and administer workshop records, but workshop users must use their own portal and scoped API. Do not add a workshop “portal mode” to the admin app or let a workshop account access admin endpoints.

## 5. Sequenced implementation plan

### Phase 0 — Discovery and operational decisions (partially complete)

**Goal:** remove decisions that would otherwise force schema or payment rework.

- Confirm launch country, member terminology, provider roles, membership terms, payment rails, and support/operational ownership.
- Locate the standalone workshop portal and document its login/token/session behavior and API base URL.
- Inventory production data and current API consumers (admin dashboard, Rider app, Roadie app, portal, reports/jobs). Capture current request/status response shapes before changing serializers.
- Define the system-of-record rules: a vehicle belongs to a member; a garage is a service centre; workshop staff belong to one or more garages; each appointment belongs to a member and one garage; roadside requests remain separately dispatched.
- Publish a concise API contract and compatibility policy. Prefer additive changes and versioned endpoints for incompatible changes.

**Exit criteria:** decisions above are recorded; a named owner and deployment path are known for each client; sample production data has been checked for migration impact without exporting personal data into planning artifacts.

### Phase 1 — Backend foundation and access control (MVP backend delivered)

**Goal:** establish safe multi-client foundations before adding business workflows.

- Introduce backend permission classes for platform admin, member, roadie, workshop owner/manager/staff, and read-only/public access. Keep role checks in the backend; align dashboard permission constants to those server permissions.
- Add workshop ownership/staff membership as a relation to `Garage` (or a dedicated membership model). Provide a supported owner invitation/activation flow; do not use open signup to grant an approved workshop account.
- Implement object-level query scoping and tests so workshop staff can access only assigned garage(s), members only their own vehicles/bookings, and admins only the intended admin operations.
- Normalize API error envelopes, pagination/filtering, timestamps, and status values across new endpoints. Add request IDs and structured logs where background jobs/integrations are involved.
- Add audit events for approval/rejection/suspension, account invitations, status transitions, quote/cost changes, payment/refund actions, and certificate issuance.
- Create database indexes for expected admin and portal filters; make schema changes with forward/reverse migrations and a production-data backup/rollback plan.

**Exit criteria:** permission matrix is approved; API tests prove allowed and denied access for each new role; existing roadside and login flows remain compatible.

### Phase 2 — Workshop/service-centre MVP (backend API and admin screens delivered; portal pending)

**Goal:** make the existing garage record usable by a separate workshop portal and by ROSAF operations.

**Backend**

- Complete garage onboarding validation, document handling, tracking/status lookup, and admin review. Track status transitions and require a reason for rejection/suspension.
- Add verified workshop profile operations and staff access. The workshop portal must not write verification fields or self-approve.
- Replace the empty workshop request queryset with a garage-scoped queue and detail endpoint. Add explicit transition actions for accept/decline, quote, start, complete, and cancel; validate legal transitions server-side.
- Extend the request record to reference a registered member vehicle when available, while allowing a controlled/manual vehicle description only if the product approves it. Preserve historical snapshots needed for invoices.
- Add quote/invoice records or a carefully versioned equivalent: line items, labor/parts, tax/fees if applicable, currency, status, timestamps, and immutable issued invoice numbers. Distinguish estimate from final charge.
- Add workshop review records after eligible completed bookings, with moderation/reporting controls. Keep these separate from existing roadie/service-request ratings.
- Send status notifications through a notification abstraction; initially keep delivery behavior explicit and observable.

**Standalone workshop portal**

- Build portal features in its own repository: invitation/activation, sign-in, application status, workshop profile, services/pricing, staff (if approved), request queue, request detail, quote, progress updates, invoice, and review/reply workflow as approved.
- Use the backend’s workshop-scoped endpoints only. Provide loading/empty/error states, retry behavior, and accessible status/action confirmation.
- Coordinate portal release against API contract tests; the portal does not call internal Django admin pages or the Next.js admin API paths.

**Admin dashboard**

- Add a “Workshops” section with pending/under-review/verified/rejected/suspended views, document/profile review, reasoned decisions, search/filter, detail history, and summary counts.
- Add a separate “Workshop bookings” queue/detail page for scheduled garage service requests. Do not mix it into `/sys-admin/requests`, which currently represents roadside `ServiceRequest`.
- Add typed API functions and response types to `lib/api.ts`; add granular permissions in `lib/permissions.ts`; use existing table/form/toast patterns.

**Exit criteria:** a workshop can complete an appointment from request receipt through final invoice; a member cannot see another member’s appointment; a workshop cannot see another workshop’s data; admins can audit and moderate the complete lifecycle.

### Phase 3 — Member vehicles, approval, and servicing

**Goal:** add the member/vehicle foundations described in the SMR brief.

- Add a Vehicle model linked to the member account with registration/plate, make/model/year, relevant documents, approval status, reviewer, decision reason, and timestamps. Define uniqueness/verification rules for the target jurisdiction.
- Add member-owned vehicle CRUD and admin review endpoints. Keep uploaded documents private and authorized; expose a sanitized vehicle summary to workshops only when needed for a booking.
- Update the member client to register a vehicle and show pending/approved/rejected status; update admin with vehicle-review screens and notifications.
- Connect an approved vehicle to a scheduled workshop booking. Keep the existing roadside SOS as its own immediate-assistance flow and use its current dispatch model; do not route SOS through appointment scheduling.
- Add operational SOS improvements only after confirming the intended roadside policy: request reason/priority, location freshness, escalation/timeout, dispatch visibility, and cancellation handling. Reuse existing real-time matching and event flows where possible.

**Exit criteria:** vehicle ownership and approval are enforced in the API; rejected/pending vehicles cannot be used where approval is required; roadside dispatch remains functional independently of workshop appointments.

### Phase 4 — Membership, NFC, and payment lifecycle

**Goal:** add membership as a first-class record and reconcile it safely with payment.

- Add configurable membership tiers and member membership records with explicit states, start/end dates, renewal/grace/cancel rules, and immutable payment references.
- Add NFC-card records with issuance, activation, replacement, revocation, and membership linkage. Treat the NFC identifier as a credential/token: do not expose or log raw card secrets unnecessarily.
- Define a payment-provider interface around the current payment implementation. Implement the selected Malawi/Uganda payment provider only after Phase 0 confirms the market. Keep provider credentials in server-side environment/secrets.
- Implement signed webhook/callback verification, idempotency keys, payment state reconciliation, refund handling, and a ledger/audit trail. A browser redirect alone must never activate paid membership.
- Add scheduled renewal reminders and expiry jobs through Celery, with retry limits, deduplication, and observable failure queues. Keep message content/locales configurable.
- Add admin membership lookup, state corrections with reasons, payment reconciliation views, and member-facing status/card details.

**Exit criteria:** duplicate callbacks cannot double-activate or double-charge; activation, expiry, cancellation, refund, and renewal cases have automated tests; reports reconcile to provider transaction references.

### Phase 5 — Training, certification, notifications, and content

**Goal:** deliver the non-emergency ROSAF training capabilities using the established access and audit model.

- Add course, lesson/content, quiz/question, enrollment/progress, practical-session/application, assessment, and certification records only to the level approved by the training policy.
- Implement course administration, enrollment/progress, quiz scoring, practical scheduling, assessor scoring, and certificate issue/revoke operations with explicit permissions and audit events.
- Add rider search and certification verification views for authorized staff; expose only the minimum public verification data required by policy.
- Implement notification templates and delivery adapters for in-app, push, SMS, and email as selected. Evaluate Africa’s Talking for Malawi after provider/region confirmation; do not claim delivery until provider responses confirm it.
- Add localization and accessible language selection in the actual clients that need it. Keep translations outside workflow code and verify Chichewa, English, German, Swahili, and French scope with the product owner.

**Exit criteria:** enrollment and certification state transitions are auditable; quizzes cannot be passed by client-side score manipulation; failed notification delivery is visible and retryable without duplicate messages.

### Phase 6 — Reporting, AI advice, and rollout hardening

**Goal:** finish cross-module insight and production operations after data contracts stabilize.

- Move dashboard KPIs that currently require loading complete rider/roadie/request collections into paginated or aggregate backend endpoints. Add separate metrics for roadside jobs, workshop appointments, vehicles, memberships, and training.
- Ensure dashboard charts use server-calculated date buckets, timezone, currency, and denominator definitions; do not infer analytics from whichever records happen to be loaded in the browser.
- If Mada AI Advisor is still a requirement, implement it as a bounded backend capability with explicit allowed topics, privacy-safe prompt context, provider failure handling, and user-visible AI limitations. Keep it out of admin/workshop authorization paths.
- Add operational dashboards/logging for API errors, dispatch latency, Celery failures, payment reconciliation drift, SMS/push failures, and database health.
- Roll out behind feature flags or staged endpoint/client releases. Pilot with a small set of approved workshops and internal staff before broad member release.

**Exit criteria:** key operational flows meet agreed latency/reliability targets; rollback is tested; data exports and reports reconcile with source records; support staff have runbooks for failed payments, stuck jobs, and workshop disputes.

## 6. API and data-contract work items

Keep the current routes working while adding explicit workshop/member APIs. The following are logical capabilities, not a mandate to use these exact paths:

| Capability | Existing route/state | Planned contract |
|---|---|---|
| Workshop admin review | `/api/garages/admin/`, `/admin/{id}/`, `/admin/{id}/verify/`, `/admin/stats/` | Retain or version these routes; provide consistent pagination, filters, decision validation, actor/reason history, and typed dashboard client methods. |
| Workshop self-service | `/api/garages/garage/requests/` currently returns no records | Add authenticated profile/staff endpoints and a scoped queue/detail/action contract. Enforce garage membership in every queryset and mutation. |
| Workshop appointment request | `/api/garages/{id}/request/`, rider request list | Add vehicle association, lifecycle actions, estimate/final-cost distinction, invoice references, and notification events without changing roadside request status semantics. |
| Roadside service | `/api/auth/admin/requests/`, `/api/requests/...` | Preserve these contracts for Roadie/Rider apps; add new fields additively and test live matching, assignment, and state updates. |
| Vehicles | No model/API found | Add member-owned CRUD, admin approval, document access control, and booking references. |
| Membership/NFC | No model/API found | Add tier, membership, card, renewal, expiry, and payment reconciliation APIs. |
| Training/certification | No model/API found | Add admin authoring and member enrollment/progress/assessment/certification APIs. |
| Notifications | Existing notification/push infrastructure exists for some flows | Standardize events/templates and delivery state; add SMS adapter only after regional provider selection. |

For each new API, document method, role, request/response schema, state-transition rules, errors, pagination/filter parameters, idempotency requirements, and whether the endpoint emits notifications. Generate/update the API schema and use contract tests so the admin and standalone portal can release independently.

## 7. Security, privacy, and reliability requirements

- Enforce authorization in Django permission classes, object lookups, serializers, and state transitions. Treat dashboard permissions as presentation controls only.
- Scope workshop queries through the authenticated workshop membership relation. Never trust a client-supplied garage ID, owner ID, approval status, payment state, or final price without server-side checks.
- Limit access to national IDs, vehicle documents, banking/settlement details, private member data, and precise location. Record access/decision events without copying unnecessary sensitive fields into logs.
- Keep provider credentials server-side. Remove environment-specific provider behavior from client bundles and avoid logging credentials, payment payload secrets, or private documents.
- Use explicit throttling for registration, login/OTP, SOS creation, payments, uploads, and notification sends. Use idempotency for payment and lifecycle callbacks.
- Validate file size/type, store documents with private access, and use short-lived authorized downloads where supported.
- Preserve existing auth/session behavior for Rider, Roadie, and admin clients; introduce workshop access additively and test cross-role denial.
- Define retention/deletion rules for location history, identity documents, payment data, audit events, and training records before deployment.

## 8. Test and release strategy

### Backend

- Model and migration tests for vehicle ownership, workshop memberships, status transitions, invoice immutability, memberships, and certification state.
- API permission matrix tests for anonymous, member, workshop staff, roadie, and admin access—including cross-member and cross-workshop denial.
- Workflow tests for workshop booking quote/accept/start/complete/cancel, roadside request dispatch compatibility, payment callbacks/idempotency/refunds, expiry/reminders, and notification retry behavior.
- Run existing service-request matching tests unchanged as a regression suite. Test schema migration against a sanitized copy of current data before production.

### Admin dashboard

- Add a test runner and focused tests for new API adapters, form validation, permissions, filters, decision confirmation, and lifecycle display.
- Verify loading, empty, API error, permission denied, and stale-data states for each new screen.
- Run `pnpm lint` and `pnpm build`; perform authenticated smoke tests against a staging API.

### Workshop portal

- Add API contract tests against the same schema and lifecycle rules. Test invited user activation, multiple staff if enabled, and cross-garage isolation.
- Verify mobile/tablet usability, upload failure/retry, network interruption, and clear recovery for invalid/expired sessions.

### Release order

1. Deploy additive backend migrations and permission/API changes.
2. Deploy admin pages behind feature flags and verify admin workflows.
3. Release workshop portal against the staged contract and pilot garages.
4. Release member/Rider changes after workshop appointment and vehicle ownership tests pass.
5. Enable payments, reminders, training, and broader notifications in separately monitored steps.

## 9. Priority and dependency summary

**P0 — remaining decisions and safety foundation:** workshop portal repository/deployment, API compatibility inventory, membership/training policy, data-retention decisions, and PostgreSQL migration rehearsal. Malawi, workshop owner count, Rider identity, workflow separation, and workshop payment policy are confirmed.

**P1 — operational workshop MVP:** workshop account ownership, scoped workshop queue, appointment transitions, admin workshop review, separate dashboard booking queue, portal integration and lifecycle tests.

**P1 — roadside continuity:** protect and regression-test existing dispatch, realtime location, assignment, and request workflows while adding other modules.

**P2 — member servicing:** vehicle records/approval and scheduled-service association; SOS operational improvements only after policy confirmation.

**P2 — membership/payment:** tiers, NFC lifecycle, selected regional payment provider, webhook/idempotency/reconciliation, renewal and expiry.

**P3 — training and certification:** courses, progress, practical assessments, certifications, and national lookup.

**P3 — analytics, AI, localization, and scale hardening:** add only after the underlying workflows and metrics are stable.

## 10. Major risks and mitigations

| Risk | Mitigation |
|---|---|
| Malawi workshop requirements are mistaken for a full regional migration. | Keep MWK/PayChangu limited to workshop invoices; retain and document legacy UGX/Pesapal behavior until a separately scoped migration is approved. |
| Garage appointments are mixed into roadside dispatch and break Rider/Roadie behavior. | Keep `GarageServiceRequest` and `ServiceRequest` as separate workflows, APIs, states, permissions, reports, and dashboard sections. |
| Portal implementation is planned against an unknown codebase. | Locate its repository and owner before UI work; stabilize the backend contract independently and run portal contract tests. |
| A workshop can access another workshop’s member/bookings. | Scope every workshop endpoint through its one-to-one garage owner link; retain cross-workshop and cross-member API tests. Add staff memberships only after approval. |
| Payment redirect/callback duplication causes incorrect membership or financial state. | Verify provider callbacks, use idempotency, store immutable references, reconcile transactions, and separate payment from membership activation logic. |
| New role and model migrations disrupt existing users or clients. | Prefer additive migrations and API compatibility; test against a sanitized production-data snapshot and preserve old role/session behavior. |
| Dashboard metrics remain misleading as data volume grows. | Move paginated filters and aggregate analytics to backend endpoints; agree on timezone, currency, and metric definitions. |

## 11. Recommended next implementation milestone

The backend foundation and workshop API are in place, and the initial admin client integration is implemented. Next:

1. Identify the standalone workshop portal repository/path and framework, then connect its login, profile, queue, quote, progress, and invoice screens to the documented `/api/garages/` contract.
2. Apply the generated migration in a PostgreSQL staging environment and run backend regression tests there before production rollout.
3. Configure real PayChangu credentials and HTTPS callback/return URLs only when the merchant and deployed clients are ready; do not enable synthetic payment success.
4. After the web clients are stable, plan vehicle ownership, membership/NFC, training/certification, and broader localization as separate milestones with their own policies and migrations.

This sequence keeps the existing Django backend, Next.js admin dashboard, Rider/Roadie apps, and independent workshop portal as separate clients and avoids the Base44-only architecture described in the reference document.
