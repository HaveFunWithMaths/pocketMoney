# Project: Pocket Money
**Version:** 1.1.0 (Full-Stack Production Ready)
**Target Platform:** Web App (Mobile-first design, planned transition to Android App)

## 1. Core Purpose
"Pocket Money" is a full-stack ledger and expense tracking web application designed to manage and permanently store debts between Students and Teachers. 

## 2. Business Logic & Entities
* **Teachers:** Seed data includes "Ninad Pr", "Brajesh Pr", and "Tiruamala Pr". Must support dynamic creation of new teachers.
* **Students:** Dynamic list. Must support dynamic creation of new students.
* **Transactions (Expenses):**
    * A transaction record indicates a debt: [Debtor (Student/Teacher)] owes [Creditor (Teacher)] an [Amount].
    * Needs a robust backend to calculate running totals securely, rather than relying on the frontend.
* **Views:**
    * **Global Auth:** A single entry gate requiring the password "ShriRam". This must be enforced server-side via cookies/sessions, not just hidden on the frontend.
    * **Teacher Profile:** Fetches and displays a summarized list of all individuals who owe money to this Teacher, aggregating the total amounts owed.
    * **Student Profile:** Fetches and displays a summarized list of all Teachers this Student owes money to, aggregating the total amounts.
    * **Add Expense:** A form that securely POSTs a new debt record to the database.

## 3. Database Schema (Relational)
* **Person Table:** `id`, `name`, `role` (Enum: TEACHER, STUDENT), `createdAt`.
* **Expense Table:** `id`, `amount`, `debtorId` (Foreign Key -> Person), `creditorId` (Foreign Key -> Person), `description`, `createdAt`.

## 4. UI/UX Rules
* **Global Header:** Must contain the logo located at `public/img/logo.jpeg` in the top left corner.
* **Design Philosophy:** Clean, ledger-style interface. Must be highly responsive and mobile-first.

## 5. AI Coding Guidelines
* Build a full-stack architecture using Next.js Server Actions or API routes for all backend logic.
* Ensure all database queries are secure and handle edge cases (e.g., what if an expense is added with an amount of 0).