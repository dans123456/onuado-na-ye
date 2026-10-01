# 📋 ONUADO NA EYE MENS' FELLOWSHIP — Project Handover Notes

**Date**: September 25, 2026  
**Official Name**: **ONUADO NA EYE MENS' FELLOWSHIP**  
**Repository**: [https://github.com/dans123456/onuado-na-ye](https://github.com/dans123456/onuado-na-ye)  
**Live Production Site**: [https://onuado-na-ye.vercel.app](https://onuado-na-ye.vercel.app)  
**Database**: Supabase PostgreSQL (`https://dupxcvmbbjtvfcxteuvq.supabase.co`)  
**Official Email**: `onuadonaeye@gmail.com`  
**Official MoMo Line**: `0530486443`  
**Merchant Pay Code**: `293658` (MTN MoMo Pay)  
**Banking Partner**: **Fidelity Bank Ghana** (Acc No: `2090182444410`)  

---

## 📌 Status Summary (Where We Left Off)

The application is **100% built, fully mobile-responsive, connected to live Supabase PostgreSQL backend, and deployed**. All 24 official members are seeded in the database with their respective dues, welfare ledgers, and official fellowship branch assignments across the 16 branches (Aburi, Ashaiman, Atensu, Dansoman, Darkoman, Kasoa, Koforidua, Kotobabi, Mampong, Mankessim, Noyem, Nsawam, Odorkor, Suame, Takoradi, Teshie).

---

## 🛠️ Key Work Completed Today

-3. **Member Shares Dividend Schedule & Admin Vehicle Integration**:
   - Extracted member shares dividend breakdown directly from Sheet `MEMBERS SHARES DEVIDENT` ([src/utils/sharesDividendData.js](file:///c:/Users/user/.gemini/antigravity-ide/scratch/onuado-na-ye/src/utils/sharesDividendData.js)).
   - Added **"📊 Member Shares Dividend Details →"** button right next to the Transaction Ledger History tab on the Member Portal.
   - Opens a yearly dues shares schedule breakdown modal (2023, 2024, 2025, 2026 shares), base shares value rate (GH₵ 50.584373/share), and Treasurer Bill interest.
   - Added **Vehicle Shares column & dossier field** to the Executive Admin Console ([AdminPage.jsx](file:///c:/Users/user/.gemini/antigravity-ide/scratch/onuado-na-ye/src/pages/AdminPage.jsx)).

-2. **Vehicle Shares Integration (Member Portal)**:
   - Extracted member vehicle shares data directly from Excel sheet `VEHICLE SHARES HOLDING`.
   - Added **Vehicle Shares Card** in [DashboardPage.jsx](file:///c:/Users/user/.gemini/antigravity-ide/scratch/onuado-na-ye/src/pages/DashboardPage.jsx) positioned right **BEFORE the Total Payments card**.
   - Includes a **"Details →"** button opening a 4-payment installment schedule breakdown modal (1st Payment, 2nd Payment, 3rd Payment, 4th Payment), vehicle share dividend allocation (@ GH₵ 50.00 / Share), and fellowship vehicle acquisition fund status (GH₵ 68,000.00 pool).

-1. **Official Treasury & Bank Balances Synchronization (Admin Console)**:
   - Added direct balance summaries and analytics extracted from the official Excel sheets to the Admin Executive console:
     - **MTN MOMO ACCOUNT SHEET**: Ending Balance: **GH₵ 1.95** (Total Inflows: **GH₵ 102,088.75**, Total Disbursements: **GH₵ 102,086.80**, MoMo: `0530486443`, Code: `293658`).
     - **FIDELITY BANK SHEET**: Ending Balance: **GH₵ 10,698.88** (Cash Deposited: **GH₵ 125,113.88**, Withdrawals/Investments: **GH₵ 114,415.00**, Acc: `2090182444410`).
     - **BANK ACCOUNT SHEET (North Tema Credit Union)**: Ending Balance: **GH₵ 366.24** (Savings: **GH₵ 5,500.00**, Withdrawals: **GH₵ 5,400.00**, Acc: `2161006002421201`).
     - **GRAND TREASURY LIQUID TOTAL**: **GH₵ 11,067.07** (Combined MoMo + Bank Accounts).
     - **TOTAL COMBINED FELLOWSHIP NET ASSETS**: **GH₵ 98,636.83** (Master Holdings of GH₵ 87,569.76 + Liquid Treasury Funds of GH₵ 11,067.07).

0. **Complete Synchronization from New Excel Personal Record / Members List**:
   - Re-extracted and verified all 9 core financial columns for all 24 fellowship members from the new Excel file (`ONUADO NA EYE ACCOUNT.xlsx`):
     - **Registration Fees**: GH₵ 200.00 each (Total: GH₵ 4,800.00)
     - **Dues Paid**: Total GH₵ 65,950.00
     - **Levy Paid**: Total GH₵ 18,100.00
     - **Total Payments**: Total GH₵ 88,850.00
     - **Outstanding Dues Balance**: Exactly matches Excel sheet PERSONAL RECORD (Cell H4 / H30: Dues Fee Required - Dues Paid, Total: GH₵ 19,250.00)
     - **Shares Dividends**: Exact share allocations (Total: 1,316 Shares)
     - **Shares Base Value**: Total GH₵ 66,564.36 (Rate: 50.58082066869301)
     - **Treasurer Bill**: Total GH₵ 10,502.70
     - **Grand Total Shares**: Total GH₵ 77,067.06
   - All 9 metrics mapped 1-to-1 to each member's personal dashboard portal (`DashboardPage.jsx`).
   - Auto cache-invalidation version updated to `2026-09-28-v5-personal-record-excel-sync` to ensure instant browser updates for all members.

0.1. **Direct Member Dues Key-In & Real-Time Calculation Engine**:
   - Replaced unreliable Excel file upload dependency with a direct, real-time key-in editor for Executive Admins.
   - Accessible via:
     - ⚡ **"Key In Member Dues"** top header button
     - ⚡ **"Key In Member Dues"** navigation toolbar tab
     - ✏️ **"Update Dues"** quick button on every member row in the Master Roster
     - ⚡ **"Key In Dues"** button inside the 45-field member dossier modal
   - Supports two intuitive entry modes:
     - **+ Add Payment to Dues** (top-up existing dues by an amount)
     - **✏️ Set Exact Total Dues** (manually set new cumulative total)
   - Live recalculation preview on screen:
     - Dues Paid (Before → After & Delta)
     - Outstanding Balance Owed
     - Shares Value & Dividends
     - Grand Holding
     - Fellowship Master Financial Totals (Shares Total & Grand Total)
   - One-click immediate persistence to state and `localStorage` with automatic receipt creation in contributions history.

1. **Rebranding to Official Title**:
   - Updated all application titles, logos, navbars, footers, headers, receipts, and pages to **ONUADO NA EYE MENS' FELLOWSHIP**.

2. **Official Treasury & Payment Channels**:
   - Integrated **Fidelity Bank Ghana** as official banking partner, displayed prominently across the Executive Admin Console, Navbar Modal, and Contact Page.
   - Updated official MTN Mobile Money wallet line to **0530486443**.
   - Added 6-digit **MTN MoMo Pay Merchant Code (293658)** for seamless business payments and higher limit support.
   - Set official contact email to **onuadonaeye@gmail.com**.

3. **Official Executive Board (6 Admins)**:
   - **Moses Oduro**: President (Role: `admin`)
   - **Osei Kwame**: Vice President (Role: `admin`)
   - **Just-Mark Kwabena Quansah**: PRO & Liaison Officer (Role: `admin`)
   - **Jonathan Danso Siaw**: General Secretary (Role: `admin`)
   - **William Kojo Anane**: Executive Board Member (Role: `admin`)
   - **John Ofosuhene Asare**: Executive Board Member (Role: `admin`)
   - *All remaining 18 members classified as General Members (Role: `member`).*

4. **Constitution Integration (`CONSTITUTION FOR ONUADƆ NA ƐYƐ.doc`)**:
   - Extracted and integrated complete constitutional provisions across the website.
   - Added **Article 16 Welfare Benefits Schedule Table** to [AboutPage.jsx](file:///c:/Users/user/.gemini/antigravity-ide/scratch/onuado-na-ye/src/pages/AboutPage.jsx):
     - Bereavement Spouse: GH₵ 5,000.00
     - Bereavement Parent: GH₵ 3,000.00
     - Bereavement Child: GH₵ 2,000.00 each
     - Hospitalization / Accident: GH₵ 1,000.00 + Visitation
     - Destitution / Property Loss: GH₵ 3,000.00 Relief
     - Childbirth / Naming: GH₵ 1,000.00
     - Weddings: 80% Voluntary Levy Pool + Rep Transport

5. **Database Roster**:
   - Database roster contains exactly the **24 real fellowship members** (`ONY-001` to `ONY-024`).

---

## 🚀 How to Launch Dev Server

1. **Launch Dev Server**:
   ```bash
   cmd /c npm run dev
   ```
2. **Access Project locally**: Open `http://localhost:5173`
3. **Git Branch**: Work is on `main` branch. All commits are pushed to GitHub.

---

*Created automatically for ONUADO NA EYE MENS' FELLOWSHIP.*
