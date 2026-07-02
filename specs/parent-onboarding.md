# Parent Onboarding - Who Is Using to Parent Home Flow

## Application Overview

This plan covers the flow where an already-authenticated user on the Budbright app (https://v2--budbright.netlify.app) lands on the "Who's using?" profile-selection screen, selects the "Parent" profile, and is navigated to the Parent Home screen. On the Parent Home screen, the plan verifies that dynamic, personalized content renders correctly: a personalized greeting (name is dynamic/seeded and must not be hardcoded in assertions) and a "Top picks for <kid name>" section (kid name is dynamic/seeded data and must be asserted via pattern matching, not a hardcoded string).

Confirmed via manual exploration (mobile-authenticated project, iPhone SE viewport):
- Seed navigates to https://v2--budbright.netlify.app/who-is-using and (when session is valid) renders heading "Who's using?", subtext "Tap to enter your world", and two selectable option buttons: `button "Parent"` (containing text "Parent" and helper text "Find play zones, classes & weekend events") and `button "Kid"`.
- Clicking the "Parent" button navigates the app to https://v2--budbright.netlify.app/parent/home.
- The Parent Home screen renders a `banner` landmark at the top containing a greeting text node (first line, e.g. "Hey there!" / a personalized "Hi <Name>" style string depending on account data) followed by a secondary line (e.g. "Good afternoon! What's on today?"), a location button, notification button, and a "Switch to Kid's Budville?" button. Below the banner, a `main` region contains sections such as "Browse by category", "Read · Watch", "Frequently asked questions", and a founder note. A bottom `navigation "Main navigation"` contains Home / Explore / Profile buttons.
- IMPORTANT ENVIRONMENT NOTE: During exploration, the stored auth session (playwright/.auth/user.json) was found to have an expired/invalid Supabase refresh token (console error: "AuthApiError: Invalid Refresh Token: Refresh Token Not Found", HTTP 400 on /auth/v1/token). When the session is invalid, the app redirects to /splash then /onboarding instead of showing the personalized Parent Home screen (no "Top picks for <kid name>" section renders, and the greeting falls back to a generic "Hey there!" without a personalized name). Because of this, the plan explicitly documents a precondition that the seeded storageState must be valid/fresh (re-run tests/auth.setup.spec.ts if tests fail at the "Who's using?" screen or redirect to /onboarding), and assertions for the greeting/top-picks are written as flexible, pattern-based locators per the requirements, since exact copy depends on time-of-day, account name, and seeded child data.

## Test Scenarios

### 1. Parent Onboarding Flow

**Seed:** `tests/seed.spec.ts`

#### 1.1. Selecting Parent profile navigates to Parent Home with personalized greeting and top picks

**File:** `tests/parent-onboarding.spec.ts`

**Steps:**
  1. Start from the seeded state: page is already at https://v2--budbright.netlify.app/who-is-using, authenticated via storageState (playwright/.auth/user.json).
    - expect: Page URL is https://v2--budbright.netlify.app/who-is-using
    - expect: Heading "Who's using?" is visible
    - expect: Paragraph "Tap to enter your world" is visible
    - expect: A button named "Parent" is visible and contains helper text "Find play zones, classes & weekend events"
    - expect: A button named "Kid" is visible
  2. Click the "Parent" button (e.g. page.getByRole('button', { name: 'Parent' })).
    - expect: The app navigates away from /who-is-using
    - expect: Page URL becomes https://v2--budbright.netlify.app/parent/home (assert via expect(page).toHaveURL(/\/parent\/home/))
  3. On the Parent Home screen, locate the top banner/header region (e.g. page.getByRole('banner')) and verify a personalized greeting is visible. Do NOT hardcode the name; use a flexible pattern such as page.getByText(/^(Hi|Hello|Hey|Welcome)\b.*/i) scoped within the banner, and assert it is visible.
    - expect: The banner landmark is visible
    - expect: A greeting text element matching a pattern like /^(Hi|Hello|Hey|Welcome)\b/i is visible inside the banner (e.g. 'Hey there!' or 'Hi <Name>' depending on account/session data)
    - expect: Test should NOT assert an exact hardcoded name string
  4. On the Parent Home screen, scroll/search the main content area for the personalized 'Top picks for <kid name>' section heading/text. Use a regex pattern locator such as page.getByText(/Top picks for .+/i) rather than a hardcoded kid name.
    - expect: An element matching the pattern /Top picks for .+/i is present and visible in the main content area
    - expect: The matched text includes a non-empty kid name/value after 'Top picks for ' (assert the matched string length is greater than the static prefix, or use a capturing regex and assert the captured group is non-empty)
    - expect: Test should NOT assert a specific hardcoded kid name
  5. (Sanity check) Verify other static Parent Home landmarks are present to confirm the correct screen loaded.
    - expect: Heading "Browse by category" is visible
    - expect: Region "Read · Watch" is visible
    - expect: Bottom navigation landmark "Main navigation" with Home, Explore, and Profile buttons is visible

#### 1.2. Kid profile button is visible but not selected (negative/independence check)

**File:** `tests/parent-onboarding.spec.ts`

**Steps:**
  1. Start from the seeded state at /who-is-using.
    - expect: Both "Parent" and "Kid" buttons are visible and enabled
  2. Assert that without any interaction, the page remains on /who-is-using and no navigation to /parent/home or /kid/home has occurred.
    - expect: Page URL is still https://v2--budbright.netlify.app/who-is-using
    - expect: Neither the personalized greeting nor the 'Top picks for <kid name>' section (both Parent Home-only elements) are present on the page
