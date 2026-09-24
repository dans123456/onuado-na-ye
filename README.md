# 🤝 Onuado Na Ye Fellowship — Web Application & Member Portal

A dedicated, full-featured web application built for the **Onuado Na Ye Fellowship** (24 members). 
It features a public landing site, a secure Member Portal with individual payment ledgers, and an Executive Admin Console powered by an **Excel & CSV Bulk Ledger Parser** for Mobile Money (MoMo) and Cash tracking.

---

## 🌟 Key Features

1. **Public Web Portal (`/`, `/about`, `/contact`)**:
   - Beautiful landing page showcasing mission, announcements, stats, executive team, meeting location (East Legon, Accra), and official MoMo transfer instructions.

2. **Member Dashboard (`/dashboard`)**:
   - Secure login via Phone Number or Email (`/login`).
   - Personal profile view with inline editing (phone, MoMo number, home address, emergency contacts).
   - Historical contribution ledger (Monthly Dues, Welfare Fund, Special Donations) with printable receipt generation.

3. **Admin & Excel Bulk Hub (`/admin`)**:
   - **Drag & Drop Excel / CSV Uploader**: Parses `.xlsx`, `.xls`, or `.csv` MoMo transaction statements using `xlsx` & `papaparse`. Automatically matches member records by phone number or name.
   - **Manual Transaction Logger**: Easily log cash or MoMo payments for any of the 24 fellowship members.
   - **24-Member Directory**: Filterable directory with unique Excel Member IDs (`ONY-001` to `ONY-024`).
   - **Database SQL Schema**: Ready-to-copy Supabase / PostgreSQL SQL migration script.

---

## 📊 Using Your Excel File as the Database / Seed Data

You can use your existing Excel sheet in two simple ways:

### Option A: Place the Excel File in the Project Folder
1. Save or copy your Excel file (e.g., `members_ledger.xlsx` or `members_ledger.csv`) into this project folder.
2. The AI assistant will automatically parse your sheet columns (Name, Phone, Dues Paid, Welfare, etc.) and seed all 24 member profiles into the application!

### Option B: Upload via the Admin Uploader UI
1. Start the app (`npm run dev`) and visit [http://localhost:5173](http://localhost:5173).
2. Log in as an Admin (**Kwesi Mensah** or **Abena Osei**).
3. Go to **Admin Console** -> **Excel / MoMo File Uploader**.
4. Drag and drop your `.xlsx` or `.csv` file into the box to instantly update all member ledgers.

---

## 🛠️ Tech Stack & Dependencies

- **Frontend**: React 19 + Vite
- **Styling**: Modern Glassmorphic CSS Design System with Light/Dark Mode toggle
- **Icons**: Lucide React (`lucide-react`)
- **Excel & CSV Parsing**: `xlsx` & `papaparse`
- **Database Support**: Built-in LocalStorage offline persistence + Supabase JS Client (`@supabase/supabase-js`)

