export interface User {
  id: string;
  Email: string;
  Name: string;
  Birthday: string;
  "Phone (optional)": string;
  "Proof of Student": any[];
  "Verification Status": VerificationStatus;
  "Hack Club Slack ID": string;
  "GitHub Username": string;
  Country: string;
  "Created At": string;
  "Age (years)": number;
  "Vouched By": string[];
  "Vouch Reason": string;
}

export type VerificationStatus = "Pending" | "Ongoing" | "Approved" | "Rejected" | "Vouched For";
