## What is this?

This should be the step 1 for any student in order to be eligible to receive our you ship we ship grants. Anyone who applies for our grants like Sprig, Onboard, Blot, have to fill out the form at https://airtable.com/appre1xwKlj49p0d4/pagUCWEM9v15VluC7/form and then we verify their identity.

## Who is this for?

This runbook is for anyone who is responsible for the ID verification process for the you ship we ship grant recipients (students). This runbook is intended to provide a step-by-step guide on how to verify the identity of the students who have applied for the grant.

## Initial setup

Head over to verify.hackclub.dev and login with your Slack account.

**NOTE:** You can only access the portal if you're a listed admin in `src/lib/admins.ts` file.

Once you are logged in, you will be able to see the list of students who have submitted the form for verification. In addition to that, you can see a table with all the users and their verification statuses.

### Runbook

1. Navigate to verify.hackclub.dev
2. If there are no pending verifications, stop.
3. Click "Start Verification" on any student who is yet to be verified. On the student page, you are able to see all their details such as name, email, slack id, github username, etc. You can also see the documents they have uploaded for verification.

Hack Clubbers are eligible for grants if they match the following criteria:

- Age => 18 years or younger
- They have provided at least one document as evidence of their age and status that must contain their name, the current (present-year) school year, and their age.  Examples:
  - High School ID Card
  - Latest School Report Card / Transcripts
  - Current School Year Schedule / Time Table
  - Proof of access to a school email address
  - Any Government ID

4. Select the 'Approve' or 'Reject' button based on the evidence provided.  This will update the student's status.
5. Go to step #1
