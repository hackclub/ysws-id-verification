export interface User {
  id: string;
  "Address Line 1": string;
  "Address Line 2": string;
  Email: string;
  "GitHub Username": string;
  Zip: string;
  Name: string;
  Birthday: string;
  "Phone (optional)": string;
  City: string;
  "Proof of Student": any[];
  "Verification Status": VerificationStatus;
  "Hack Club Slack ID": string;
  "State or Province": string;
  Country: string;
  "Created At": string;
  "Age (years)": number;
  "Address Formatted": string;
}

export type VerificationStatus = "Pending" | "Ongoing" | "Approved" | "Rejected";
