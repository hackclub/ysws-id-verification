## The Runbook

## What is this?

This should be the step 1 for any student in order to be eligible to receive our you ship we ship grants. Anyone who applies for our grants like Sprig, Onboard, Blot, have to fill out the form at https://airtable.com/appre1xwKlj49p0d4/pagUCWEM9v15VluC7/form and then we verify their identity.

## Who is this for?

This runbook is for anyone who is responsible for the ID verification process for the you ship we ship grant recipients (students). This runbook is intended to provide a step-by-step guide on how to verify the identity of the students who have applied for the grant.

## Usage

Head over to verify.hackclub.dev and login with your Slack account.

**NOTE:** You can only access the portal if you're a listed admin in `src/lib/admins.ts` file.

Once you are logged in, you will be able to see the list of students who have submitted the form for verification. In addition to that, you can see a table with all the users and their verification statuses.

### Verification Process

Click on a any student who is yet to be verified. On the student page, you are able to see all their details such as name, email, slack id, github username, etc. You can also see the documents they have uploaded for verification.

Any student must be verified by checking the following:

- Age => 18 years or younger
- Valid acceptable documents =>
  - School Enrollment Proof
  - High School ID Card
  - Latest School Report Card / Transcripts
  - Current School Year Schedule / Time Table
  - Proof of access to a school email address
  - Any Government ID like a Driving License or Passport that verifies their age
  - These are the most commonly used (and approved) documents so far for previous sprig grants. This list may update in the future. If you think you've come across a valid edge-case, please make a PR to add it to this list.

Once you have verified the student, you can mark them as verified by clicking on the `Approve` button. This will update the student's status to `verified` and they will be eligible to receive all our you ship we ship grants.

This is a one-time process, so the person who has verified their ID once, will be eligible for all future grants as well - as long as they are still a student.
