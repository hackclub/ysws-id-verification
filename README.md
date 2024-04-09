## Getting Started

Run the development server:

```bash
yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Todo List

### Admin Flow
- [ ] `VerifyUser` page - List all user information, add two buttons to either reject or approve verification.
- [ ] `Admin` page - Create another table that shows pending grant requests below verification - Is the user verified? What type of request is it?

### User Flow
- [ ] If verification not done - Show a huge banner on top to make them submit for verification
- [ ] `VerificationForm` - Embed Airtable form
- [ ] Show their verification status on the dashboard

### Other
- [ ] Protect admin APIs
- [ ] Be exacting and more explicit on accepted ID types
- [ ] Track new applications via slacker
- [ ] Probably create a table to search through the list of users and whether they are verified or not (by email / name / github id)
