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
