# Partner Quarterly Reporting — Investor Curation, Moderation & Document Intake

The full PRD and build plan for this effort live in the backend repo,
since most of the requirements are business rules rather than UI:

- `cord-api-v3` → [`docs/partner-quarterly-reporting-prd.md`](../../../cord-api-v3-partner-quarterly-reporting/docs/partner-quarterly-reporting-prd.md)
- `cord-api-v3` → [`docs/partner-quarterly-reporting-plan.md`](../../../cord-api-v3-partner-quarterly-reporting/docs/partner-quarterly-reporting-plan.md)

(Kept in one place rather than duplicated here, so the two copies can't
drift out of sync — update the backend docs and this file stays a stable
pointer. The links above are relative filesystem paths for local review;
once both PRs are open, swap them for GitHub links to the backend branch,
since a relative link can't cross a repository boundary on GitHub.)

## What lives on this side

The frontend pieces of the shipped work (Epics 1–4 in the plan doc):

- The shared "Edit Post" dialog (clearance / final wording / Investor
  Report toggle), reachable from both the report's Prayer step and the
  engagement's Prayer tab.
- Inline error rendering on that dialog and on the media step's
  reuse-into-a-variant control — both fire mutations outside a form's
  normal submit lifecycle, so each needed its own explicit error handling
  rather than relying on the app-wide handler.
- The read-only report detail view's per-section summary cards (media,
  prayer, other activities, next quarter, and the featured-story
  distinction on the story card).

The planned AI document-intake work (Epic 5) adds a document-upload
affordance and an "extracted from a document" marker on this side, once
the backend extraction pipeline exists — see REQ-08/REQ-11 in the PRD.

## Shared with GTL reporting

This branch sits on top of `gtl-reports`, which reports on Global Translation
Leaders engagements through the same post components. Everything under
`src/components/posts/` — `PostForm`, `PostList`, `CreatePost`, `EditPost`,
`PostProvenance` — is shared by both report types; change it with both in mind.

The two scene layers stay separate on purpose, and are not accidental
duplicates:

- `ProgressReports/.../Prayer/PrayerStep` and `GtlReports/.../Prayer/PrayerStep`
  are deliberately the same shape (same layout, same `setReport` attach/detach,
  same shared dialog). Ours additionally shows the Investor Report chip, which
  is a Momentum concern GTL has no equivalent of. If you change one, change the
  other.
- The two `PrayerSummaryCard`s differ by design: ours is presentational, taking
  `items`/`loading`/`actions`, because every other card on `ProgressReportDetail`
  is and that page fetches once for all of them. GTL's self-fetches, matching
  its own detail page. Converging them would break whichever page it moved to.
