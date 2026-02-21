import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SPREADSHEET_ID = '1Hag-XCtNs_X12KeklQrYTnMvwQic2YiGATaanx7kRLU';

// Ensure you have these environment variables set in your .env or server environment
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';

export async function addRecordToSheet(record: any) {
    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
        console.warn('Google Sheets integration disabled: Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY environment variables.');
        return;
    }

    try {
        const serviceAccountAuth = new JWT({
            email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: GOOGLE_PRIVATE_KEY,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
            ],
        });

        const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
        await doc.loadInfo(); // Loads document properties and worksheets
        const sheet = doc.sheetsByIndex[0]; // Assuming the first sheet

        // We convert the record to an array of values to avoid strict header-matching errors
        // Column A: Date, B: Action, C: ID, D: Creditor, E: Debtor, F: Amount, G: Description
        const values = Object.values(record) as (string | number | boolean)[];
        await sheet.addRow(values);
    } catch (error) {
        console.error('Error adding record to Google Sheets:', error);
    }
}
async function updateExpenseInSheet(id: string, record: any) {
    // Optional: You could implement an edit/delete sync here if needed,
    // but a simple append for history might be sufficient or we can find rows and update them.
}
