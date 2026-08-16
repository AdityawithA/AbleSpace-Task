# Part 2 — Product Understanding: Caseload / Take Data

**⚠️ Important honesty note:** I don't have access to the live AbleSpace app (no login,
no network access from here) — I only have the one screenshot embedded in the assignment
PDF. What follows is a draft based on that single screenshot. **You must actually log in and
click through the real "Take Data" flow yourself** before submitting, since the assignment
asks you to explore the interactive workflow (data entry screens, session tracking, etc.),
which isn't visible from a static screenshot of the list view. Treat this as a starting
skeleton to edit, not a finished submission.

## What the screenshot shows

The **Caseload** tab (under "Capture" in the left nav) displays a student roster table with
tabs for **Students (15)**, **Groups (12)**, and **Unassigned (39)**. Each row lists:

- Full Name / Last Name
- IEP Due date and Eval Due date
- Collaborators (avatar stack showing assigned staff)
- Service Time (e.g. "OT - 30mins/Wk")
- School
- An **Actions** column with a prominent blue **"Take Data"** button per student

## Inferred workflow (needs verification against the live app)

1. A provider (e.g. an OT, SLP, or special-ed teacher) logs in and lands on their Caseload.
2. They scan the roster for a specific student — likely by searching (there's a search box)
   or by scanning IEP/Eval due dates to prioritize students with upcoming deadlines.
3. Clicking **"Take Data"** next to a student presumably opens a data-collection screen
   scoped to that student's active goals/services, where the provider logs a session
   (e.g. trial data, frequency counts, notes) against their service time allotment.
4. That logged session likely rolls up into Reports, Billing, and Service Time tracking
   (visible in the left nav), which is why Service Time is surfaced right on this list.

## Suggested UX/functionality improvements

_(Draft ideas — validate/replace after actually using the Take Data screen.)_

- **Surface urgency visually:** IEP Due / Eval Due are critical compliance dates but appear
  as plain text. Color-coding or a badge for dates within, say, 30 days would let providers
  triage at a glance instead of reading every row.
- **Bulk / quick actions:** If a provider sees several students due for data today, a "Take
  Data" flow that lets them move to the next student without returning to this table each
  time would reduce clicks.
- **Empty/zero state clarity:** Rows showing "Service Time: 0" (e.g. Albert Einstein, Charles
  Darwin) are ambiguous — is that intentional (no service assigned) or missing data? A
  tooltip or distinct styling would help.
- **Search scope indicator:** The search box's placeholder doesn't indicate whether it
  searches only this "Students" sub-tab or the whole caseload (Groups/Unassigned too).
- **Collaborator overflow:** The "+n" avatar pattern (e.g. "J E +1") is a common but low-info
  pattern — a hover tooltip listing names would avoid an extra click to Collaborators.

## Next steps for you

1. Log into AbleSpace, navigate to Caseload → click "Take Data" on a real student.
2. Screenshot each step of the actual flow (data entry, saving, confirmation).
3. Replace the "Inferred workflow" section above with what you actually observed.
4. Keep or revise the UX suggestions based on what you see — some of the ones above may
   turn out to already be handled well, or you may spot better ones once you're in the tool.
