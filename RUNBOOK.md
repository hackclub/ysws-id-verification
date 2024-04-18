## What is this?

This should be the step 1 for any student in order to be eligible to receive our you ship we ship grants. Anyone who applies for our grants like Sprig, Onboard, Blot, have to fill out [this form](https://airtable.com/appre1xwKlj49p0d4/pagUCWEM9v15VluC7/form) and then we verify their identity.

## Who is this for?

This runbook is for anyone who is responsible for the ID verification process for the you ship we ship grant recipients (students). This runbook is intended to provide a step-by-step guide on how to verify the identity of the students who have applied for the grant.

## Initial setup

1. Head over to https://verify.hackclub.dev and login with your Slack account.
2. Make sure you're added in the list of maintainers for the [`ysws` project](https://github.com/hackclub/slacker/blob/main/config/ysws.yaml) on Slacker.

**NOTE:** You can only access the portal if you're a listed admin in `src/lib/admins.ts` file.

Once you are logged in, you will be able to see the list of students who have submitted the form for verification. In addition to that, you can see a table with all the users and their verification statuses.

### Runbook

1. Run `/slacker gimme ysws verify` to get pending verifications.
2. If there are pending verifications, Slacker will assign you a user and return an action item for you to resolve.
3. Click on the link in the action item to view more details for that user.
4. Click "Start Verification" on any student who is yet to be verified. On the student page, you are able to see all their details such as name, email, slack id, github username, etc. You can also see the documents they have uploaded for verification.

Hack Clubbers are eligible for grants if they match the following criteria:

- Age => 18 years or younger
- They have provided at least one document as evidence of their age and status that must contain their name, the current (present-year) school year, and their age.  Examples:
  - High School ID Card
  - Latest School Report Card / Transcripts
  - Current School Year Schedule / Time Table
  - Proof of access to a school email address
  - Any Government ID

4. Select the 'Approve' or 'Reject' button based on the evidence provided.  This will update the student's status.
5. Resolve the action item on Slacker and provide a reason for resolution.
6. Go to step #1
