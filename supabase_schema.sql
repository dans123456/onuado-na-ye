-- ====================================================================
-- ONUADO NA YE FELLOWSHIP - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ====================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. MEMBERS TABLE (25 Members Profile Data)
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    excel_member_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    title VARCHAR(50) DEFAULT 'Elder',
    position VARCHAR(100) DEFAULT 'Fellowship Member',
    date_joined VARCHAR(50) DEFAULT 'January 2023',
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    momo_number VARCHAR(20),
    home_address TEXT,
    branch VARCHAR(100) DEFAULT 'Takoradi',
    email VARCHAR(100),
    ghana_card VARCHAR(50),
    occupation VARCHAR(100),
    emergency_contact TEXT,
    father_state VARCHAR(20) DEFAULT 'Alive',
    mother_state VARCHAR(20) DEFAULT 'Alive',
    profile_picture TEXT,
    pin VARCHAR(50) DEFAULT '1234',
    reg_fees NUMERIC(12,2) DEFAULT 200.00,
    dues_paid NUMERIC(12,2) DEFAULT 0.00,
    levy_paid NUMERIC(12,2) DEFAULT 0.00,
    total_payments NUMERIC(12,2) DEFAULT 0.00,
    dues_fee_required NUMERIC(12,2) DEFAULT 3900.00,
    shares_dividends NUMERIC(12,2) DEFAULT 0.00,
    shares_value NUMERIC(12,2) DEFAULT 0.00,
    treasurer_bill NUMERIC(12,2) DEFAULT 0.00,
    shares_holding NUMERIC(12,2) DEFAULT 0.00,
    balance_owed NUMERIC(12,2) DEFAULT 0.00,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'admin')),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.members ADD COLUMN IF NOT EXISTS pin VARCHAR(50) DEFAULT '1234';
ALTER TABLE public.members DROP CONSTRAINT IF EXISTS members_status_check;



-- 2. CONTRIBUTIONS TRANSACTION LEDGER
CREATE TABLE IF NOT EXISTS public.contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_id VARCHAR(50) UNIQUE NOT NULL,
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    contribution_type VARCHAR(50) NOT NULL CHECK (contribution_type IN ('Monthly Dues', 'Welfare Levy', 'Registration Fee', 'Special Donation', 'Share Purchase')),
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50) DEFAULT 'MTN Mobile Money',
    reference_note TEXT,
    received_by VARCHAR(100) DEFAULT 'Executive Board',
    status VARCHAR(20) DEFAULT 'VERIFIED' CHECK (status IN ('VERIFIED', 'PENDING', 'FLAGGED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ANNUAL DUES MATRIX TABLE (2023 - 2033)
CREATE TABLE IF NOT EXISTS public.dues_matrix (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    year INT NOT NULL,
    expected_amount NUMERIC(12,2) NOT NULL,
    amount_paid NUMERIC(12,2) DEFAULT 0.00,
    balance_owed NUMERIC(12,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'UNPAID' CHECK (status IN ('PAID', 'PARTIAL', 'UNPAID')),
    UNIQUE(member_id, year)
);

-- 4. EXECUTIVE FINANCIAL TREASURY ACCOUNTS (RESTRICTED TO ADMINS)
CREATE TABLE IF NOT EXISTS public.executive_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_name VARCHAR(100) UNIQUE NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- 'Bank', 'MoMo', 'Treasury Bill', 'Petty Cash', 'Trading'
    current_balance NUMERIC(15,2) DEFAULT 0.00,
    institution_name VARCHAR(100),
    account_number VARCHAR(50),
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Initial Executive Treasury Accounts
INSERT INTO public.executive_accounts (account_name, account_type, current_balance, institution_name, account_number)
VALUES 
    ('MTN MoMo Main Treasury', 'MoMo', 12450.00, 'MTN Ghana', '0243430617'),
    ('Fidelity Bank Account', 'Bank', 45800.00, 'Fidelity Bank Ghana', '110029384812'),
    ('Tema Bank Account', 'Bank', 18350.00, 'Bank of Africa Tema', '0928347101'),
    ('BOG Treasury Bill 1', 'Treasury Bill', 25000.00, 'Bank of Ghana', 'T-BILL-2024-A'),
    ('BOG Treasury Bill 2', 'Treasury Bill', 30000.00, 'Bank of Ghana', 'T-BILL-2024-B'),
    ('Petty Cash Reserve', 'Petty Cash', 1500.00, 'Executive Board', 'CASH-001')
ON CONFLICT (account_name) DO NOTHING;


-- ====================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dues_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.executive_accounts ENABLE ROW LEVEL SECURITY;

-- 1. MEMBERS TABLE POLICIES
DROP POLICY IF EXISTS "Allow public full control of members" ON public.members;
CREATE POLICY "Allow public full control of members" 
ON public.members FOR ALL 
USING (true)
WITH CHECK (true);

-- 2. CONTRIBUTIONS TABLE POLICIES
DROP POLICY IF EXISTS "Allow public full control of contributions" ON public.contributions;
CREATE POLICY "Allow public full control of contributions" 
ON public.contributions FOR ALL 
USING (true)
WITH CHECK (true);

-- 3. EXECUTIVE ACCOUNTS TABLE POLICIES (STRICT ADMIN ONLY)
DROP POLICY IF EXISTS "Executive accounts restricted to admins only" ON public.executive_accounts;
CREATE POLICY "Executive accounts restricted to admins only" 
ON public.executive_accounts FOR ALL 
USING (EXISTS (SELECT 1 FROM public.members WHERE phone_number = current_setting('request.jwt.claims', true)::json->>'phone_number' AND role = 'admin'));




-- Create helper indexing for fast searches
CREATE INDEX IF NOT EXISTS idx_members_phone ON public.members(phone_number);
CREATE INDEX IF NOT EXISTS idx_contributions_member ON public.contributions(member_id);
