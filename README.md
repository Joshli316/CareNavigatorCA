# CareNavigator - Benefits Made Simple

Transform 100+ hours of benefits research into a 15-minute guided experience.

## 🎯 Overview

CareNavigator is a prototype demonstrating an intelligent benefits eligibility platform for individuals with disabilities and their families. It uses a rule-based engine to match users with federal, state, and local benefit programs.

### Key Features

- **Smart Eligibility Quiz**: 5-step guided form collecting location, disability, financial, and household information
- **Intelligent Matching**: Evaluates **34+ benefit programs** with probability scoring (0-100%)
- **Geographic Focus**: Dallas-Fort Worth (DFW) metropolitan area, Texas
- **Comprehensive Coverage**: Federal, Texas state, local DFW, nonprofit organizations, and Christian church special needs ministries
- **Persistent Data**: Auto-saves quiz progress to browser localStorage
- **Accessible Design**: WCAG 2.1 AA compliant with touch-friendly UI

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router) + React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **State**: React Context + localStorage

### Project Structure

```
├── app/                     # Next.js app router pages
│   ├── page.tsx            # Landing page
│   ├── quiz/page.tsx       # Eligibility quiz
│   ├── results/page.tsx    # Benefits roadmap
│   └── vault/page.tsx      # Document vault (placeholder)
├── components/
│   ├── shared/             # Reusable UI components
│   ├── layout/             # Header, Container
│   ├── quiz/               # Quiz step components
│   └── results/            # Results dashboard components
├── lib/
│   ├── context/            # React contexts (Quiz, Results)
│   ├── rules/              # Benefit rules & eligibility engine
│   │   ├── benefitRules.ts     # 34+ program definitions
│   │   ├── eligibilityEngine.ts # Core matching logic
│   │   └── constants/          # 2026 federal/state limits
│   └── hooks/              # Custom React hooks
└── types/                  # TypeScript interfaces

## 💡 Benefits Included (34+ Programs)

### Federal Programs (13)
- **SSI** (Supplemental Security Income) - $943/mo
- **SSDI** (Social Security Disability Insurance) - ~$1,537/mo
- **SNAP** (Food Assistance) - Varies by household
- **WIC** (Women, Infants, Children) - ~$50/mo
- **TANF** (Temporary Assistance for Needy Families) - ~$450/mo
- **VA Disability Compensation** - ~$1,700/mo
- **Medicaid** - Medical coverage
- **Medicare Savings Programs** (QMB/SLMB/QI) - $180+/mo
- **LIHEAP** (Energy Assistance) - Varies
- **Lifeline** (Phone Service) - ~$30/mo discount
- **Affordable Connectivity Program** (ACP) - $30/mo internet
- **Section 8 Housing Choice Voucher** - 30% of income toward rent
- Plus other federal programs

### Texas State Programs (2)
- **Texas STAR+PLUS Waiver** - Home & community-based services
- **Texas Medicaid HCBS** - Personal attendant services, adaptive aids

### Dallas-Fort Worth Local Programs (3)
- **Dallas County Emergency Rental Assistance** - Rental/utility assistance
- **Dallas Housing Authority** - Affordable housing
- **Parkland Health** - Sliding scale medical care

### DFW Nonprofit Organizations (6)
- **United Way of Metropolitan Dallas (211)** - Emergency assistance (~$500)
- **Modest Needs Self-Sufficiency Grants** - Up to $1,000 one-time
- **Salvation Army North Texas** - Food, utilities, rent help (~$300)
- **Catholic Charities Dallas** - Emergency aid, food pantries (~$400)
- **North Texas Food Bank** - Food assistance through 200+ agencies
- **The Stewpot Dallas** - Food, clothing, medical care, case management

### Healthcare & Equipment Nonprofits (5)
- **LIFE Center for Independent Living (Dallas)** - Home modifications, assistive tech
- **Assistive Technology Program of Texas** - Device loans, financing
- **Patient Advocate Foundation** - Medical bills, copays (~$500)
- **HealthWell Foundation** - Prescriptions, insurance premiums (~$600)

### Christian Church Special Needs Ministries (6+)
- **Watermark Community Church (Dallas)** - Access Ministry
- **First Baptist Dallas** - Special Needs Ministry
- **Prestonwood Baptist Church (Plano)** - Special Friends Ministry
- **Gateway Church (Southlake)** - Special Needs Ministry
- **Lake Pointe Church (Rockwall)** - Exceptional Ministry
- **Village Church (Flower Mound)** - Access Ministry
- **Joni and Friends - North Texas Chapter**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Navigate to the project directory:
```bash
cd "/Users/andrew-mbp/Documents/claude projects/Care Navigator"
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

### Build for Production
```bash
npm run build
npm start
```

## 🧪 Test Scenarios

### Persona 1: Texas Resident with Disability (Low Income)
**Input:**
- State: Texas
- Disability: Yes (Physical)
- Monthly Income: $500
- Assets: $1,000
- Age: 35
- Household Size: 1
- Needs Assistance: Some

**Expected Results:**
- SSI: 95% eligible ($943/mo)
- SNAP: 90% eligible (varies)
- Texas STAR+PLUS: 75% eligible (varies)
- Housing Grant: 80% eligible ($500/mo)

### Persona 2: California Resident Receiving SSDI
**Input:**
- State: California
- Already receiving SSDI: Yes
- Monthly Income: $1,200
- Assets: $5,000
- Age: 50
- Household Size: 1

**Expected Results:**
- SSI: 0% (income too high)
- SNAP: 70% (categorical eligibility)
- CA HCBS: 85% (SSDI = categorical)

### Persona 3: Senior Without Disability Determination
**Input:**
- State: California
- No disability determination
- Monthly Income: $800 (retirement)
- Age: 68
- Household Size: 1

**Expected Results:**
- SSI: 30% (needs disability determination)
- SNAP: 85% (seniors have easier eligibility)
- HCBS: 20% (needs disability + ADL assessment)

## 🎨 Design System

### Colors
- **Primary (Teal)**: #0D9488 - Main actions, navigation
- **Secondary (Blue)**: #3B82F6 - Accents, secondary actions
- **Success**: #10b981 - Positive outcomes (70%+ eligibility)
- **Warning**: #f59e0b - Uncertain outcomes (40-69%)
- **Danger**: #ef4444 - Negative outcomes (0-39%)

### Typography
- **Body**: 16px (minimum for accessibility)
- **Headings**: 20px, 24px, 32px, 48px
- **Touch Targets**: Minimum 44px height

## 📊 Eligibility Logic

The eligibility engine evaluates programs using:

1. **Mandatory Rules**: Must pass (e.g., "Must have disability for SSI")
2. **Weighted Rules**: Impact probability score (0-1.0 weight)
3. **Probability Calculation**: `(passed weight / total weight) × 100`
4. **Eligibility Threshold**: ≥70% = "Likely Eligible"

### Example: SSI Evaluation
- ✅ Has disability (weight: 1.0, mandatory)
- ✅ Income ≤ $943 (weight: 0.8, mandatory)
- ✅ Assets ≤ $2,000 (weight: 0.6, mandatory)
- ⚠️ Age ≥ 18 (weight: 0.3, optional)

**Result**: If all pass = 100% probability

## 🔒 Privacy & Security

- **No Backend**: All data stays in browser localStorage
- **No Tracking**: No analytics or third-party scripts
- **No Account**: No login required, instant access
- **Open Source**: Full transparency of eligibility logic

## 📱 Responsive Design

The prototype is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## ♿ Accessibility Features

- ✅ WCAG 2.1 AA contrast ratios (4.5:1 for text)
- ✅ Keyboard navigation support
- ✅ Screen reader compatible (ARIA labels)
- ✅ Touch-friendly targets (44px minimum)
- ✅ Error messages linked to inputs
- ✅ Progress indicators for multi-step forms

## 🚧 Roadmap

### Phase 2 (Production)
- [ ] User authentication (Auth0/Clerk)
- [ ] Database persistence (Supabase/Postgres)
- [ ] Real document upload (AWS S3 + encryption)
- [ ] Server-side eligibility evaluation

### Phase 3 (Scale)
- [ ] 50+ benefit programs
- [ ] All 50 states support
- [ ] Admin UI for rule editing
- [ ] Case worker portal

### Phase 4 (Advanced)
- [ ] AI-powered natural language quiz
- [ ] Direct API integrations for application submission
- [ ] Email/SMS reminders
- [ ] Multi-language support (Spanish, Mandarin, Vietnamese)

## 📞 Resources

### Official Data Sources
- **SSI Limits**: https://www.ssa.gov/oact/cola/SSI.html
- **SNAP Rules**: https://www.fns.usda.gov/snap/recipient/eligibility
- **CA HCBS**: https://www.dhcs.ca.gov/services/ltc/Pages/HCBS-Waivers.aspx
- **TX STAR+PLUS**: https://www.hhs.texas.gov/services/health/medicaid-chip/medicaid-waiver-programs

### Accessibility Guidelines
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Patterns**: https://www.w3.org/WAI/ARIA/apg/

## 🤝 Contributing

This is a prototype for demonstration purposes. For questions or feedback:
- Report issues at your project repository
- Contact via your communication channels

## 📄 License

This prototype is for demonstration purposes only. Not intended for production use without proper legal review and compliance validation.

---

**Built with the BMAD Framework for rapid, high-fidelity prototyping.**

🚀 **Status**: Prototype v1.0 - Ready for investor/founder demos
