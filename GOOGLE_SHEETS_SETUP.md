# Google Sheets Integration Setup

The code has been updated to log all new, edited, and deleted expenses into your Google Spreadsheet.

Because Google Sheets API **always requires authentication to write data from a server** (even if the sheet is set to "Anyone on the internet with this link can edit"), you must provide a **Google Service Account** so your Next.js app can securely write records to it.

Please follow these steps to generate the configuration credentials:

### 1. Create a Google Cloud Project & Enable API
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., "Pocket Money App").
3. Navigate to **APIs & Services** > **Library**.
4. Search for "**Google Sheets API**" and click **Enable**.

### 2. Create a Service Account
1. Go to **APIs & Services** > **Credentials**.
2. Click **Create Credentials** > **Service Account**.
3. Name it (e.g., `pocket-money-sheets`) and click **Create and Continue**. (You can skip role setup).
4. After creation, you'll see a generated email (e.g., `pocket-money-sheets@your-project.iam.gserviceaccount.com`).
5. Click on the new service account in the list, go to the **Keys** tab.
6. Click **Add Key** > **Create new key** > Choose **JSON** > Click **Create**.
7. This will download a `.json` file to your computer.

### 3. Give the Service Account Access to Your Sheet
1. Open your downloaded `.json` file and locate the `"client_email"` field. Copy this email address.
2. Go to your Google Sheet: `https://docs.google.com/spreadsheets/d/1Hag-XCtNs_X12KeklQrYTnMvwQic2YiGATaanx7kRLU/edit`.
3. Click the **Share** button in the top right.
4. Paste the Service Account's email into the "Add people and groups" input.
5. Set the permission to **Editor** and click **Send**. (You don't need to notify).

### 4. Provide Environment Variables
Now, add the credentials into your Application environment variables (`.env` for local testing, or in the Vercel dashboard Settings > Environment Variables for deployment).

Using the values from the downloaded `.json` file:

```env
# Google Sheets Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account-email@project.iam.gserviceaccount.com"

# Important: Keep the quotes and the \n for the private key!
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_LONG_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

Once these variables are set, your app will automatically push new records into your spreadsheet whenever an Expense is added, updated, or deleted!

**Note:** The system logs 7 columns in this exact order: Date, Action, Expense ID, Creditor, Debtor, Amount, and Description. You may want to add these headers to row 1 of your Google Sheet.
