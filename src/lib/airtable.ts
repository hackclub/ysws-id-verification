import Airtable from "airtable";

Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY as string });
export const base = Airtable.base(process.env.AIRTABLE_BASE_ID as string);
