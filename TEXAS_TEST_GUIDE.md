# Texas Sample User Testing Guide

## 🧪 Test Persona: Maria Rodriguez (Houston, TX)

### Background Story
Maria is a 42-year-old Houston resident with multiple sclerosis (MS). She worked as a teacher for 15 years before her disability made it too difficult to continue. She receives $1,100/month in SSDI and has $800 in savings. She lives alone and needs some assistance with daily activities like cooking and cleaning.

---

## 📝 Step-by-Step Quiz Completion

### Step 1: Location (Geography)
- **State**: Texas (TX)
- **County**: Harris County
- **ZIP Code**: 77001
- **Months of residency**: 120 (10 years)

### Step 2: Disability Information
- **Has disability**: ✅ Yes
  - **Types**:
    - ✅ Physical disability
    - ✅ Chronic illness
- **Currently receiving SSI**: ❌ No
- **Currently receiving SSDI**: ✅ Yes
- **Has SSA determination**: ✅ Yes

### Step 3: Financial Information
- **Monthly household income**: $1,100
- **Income sources**:
  - ❌ Wages
  - ❌ SSI
  - ✅ SSDI
  - ❌ Retirement
  - ❌ Other
- **Countable assets**: $800
- **Owns a car**: ✅ Yes
  - **Car value**: $5,000
- **Owns home**: ❌ No

### Step 4: Household Information
- **Age**: 42
- **Household size**: 1
- **Has children**: ❌ No
- **Is veteran**: ❌ No
- **Assistance needed**: Some assistance (cooking, cleaning, managing medications)

### Step 5: Review
- Review all information and click "See My Results"

---

## ✅ Expected Results

### 1. SNAP (Food Assistance) - HIGH ELIGIBILITY
- **Probability**: ~85%
- **Monthly Value**: Varies (likely $190-290 for 1 person)
- **Why Eligible**:
  - SSDI recipients are categorically eligible
  - Income below 130% FPL for household of 1 (~$1,629/mo)
- **Processing Time**: 4 weeks

### 2. Texas STAR+PLUS Waiver - MODERATE-HIGH ELIGIBILITY
- **Probability**: ~75%
- **Monthly Value**: Varies (services, not cash)
- **Why Eligible**:
  - Texas resident ✅
  - Has disability ✅
  - Needs assistance with daily activities ✅
  - Income ~$1,100/mo < 300% FPL (~$3,765/mo) ✅
- **Processing Time**: 20 weeks
- **Services Include**:
  - Personal care assistance
  - Home modifications
  - Adult day care
  - Respite care

### 3. SSI (Supplemental Security Income) - LOW ELIGIBILITY
- **Probability**: ~0-30%
- **Monthly Value**: Would be $0 (income too high)
- **Why NOT Eligible**:
  - SSDI income ($1,100) exceeds SSI limit ($943)
  - Would need income reduction to qualify
- **Note**: "Your income is $157 above the limit"

### 4. SSDI - ALREADY RECEIVING
- **Probability**: 100% (already enrolled)
- **Monthly Value**: $1,100 (current benefit)
- **Note**: User indicated already receiving

### 5. Housing Assistance Grant - MODERATE ELIGIBILITY
- **Probability**: ~60%
- **Monthly Value**: $500
- **Why May Qualify**:
  - Has disability ✅
  - Income below 150% FPL (~$1,882/mo) ✅
  - Does not own home ✅
- **Note**: County-specific availability varies

---

## 📊 Summary Dashboard Expected View

### Top Metrics
- **Likely Eligible**: 2-3 programs
- **Potential Monthly Value**: $500-800 (excluding existing SSDI)
- **Average Processing**: ~10 weeks

### Category Breakdown
- **Income**: SSI (low), SSDI (enrolled), Housing ($500)
- **Healthcare**: TX STAR+PLUS Waiver (services)
- **Food**: SNAP ($190-290)

---

## 🎯 Key Testing Points

### Functionality Tests
1. **State Filtering**:
   - ✅ Should show "Texas STAR+PLUS Waiver" (not California HCBS)
   - ✅ Should show federal programs (SSI, SSDI, SNAP)

2. **Rule Evaluation**:
   - ✅ SSI should fail on income threshold
   - ✅ SNAP should pass via categorical eligibility
   - ✅ TX STAR+PLUS should check assistance level

3. **Probability Scoring**:
   - ✅ Programs with failed mandatory rules = 0%
   - ✅ Programs with all rules passing = high %
   - ✅ Color coding: Red (<40%), Yellow (40-69%), Green (70%+)

### UI/UX Tests
1. **Progress Indicator**: Should show 1/5, 2/5... up to 5/5
2. **Validation**: Can't proceed from Step 1 without state/county/ZIP
3. **localStorage**: Refresh page mid-quiz, data should persist
4. **Mobile**: Test on phone screen (iPhone/Android)

---

## 🔄 Alternative Texas Scenarios

### Scenario 2: Lower Income, No SSDI
- **Income**: $400/mo
- **Receiving SSDI**: No
- **Has SSA determination**: Yes
- **Expected**: Higher SSI eligibility (~95%), higher SNAP

### Scenario 3: Senior with No Disability
- **Age**: 68
- **Has disability**: No
- **Income**: $900/mo (retirement)
- **Expected**: Lower eligibility across programs (disability required for most)

### Scenario 4: Young Adult with Developmental Disability
- **Age**: 22
- **Disability Type**: Developmental
- **Income**: $0
- **Living with parents**: Yes (household size: 3)
- **Expected**: Very high SSI eligibility, SNAP based on household income

---

## 🚨 Common Issues & Fixes

### Issue 1: "No state-specific programs showing"
- **Cause**: State not selected or incorrect
- **Fix**: Verify "TX" is selected in Step 1

### Issue 2: "All programs show 0% eligibility"
- **Cause**: Mandatory rules failing (e.g., no disability selected)
- **Fix**: Check Step 2 - "Has disability" must be checked

### Issue 3: "Results page is blank"
- **Cause**: Quiz not completed
- **Fix**: Complete all 5 steps and click "See My Results"

---

## 📱 Share & Demo Tips

When demonstrating to investors/founders:

1. **Start with the problem** (landing page statistics)
2. **Show the "Magic Moment"**: Complete quiz in <5 minutes
3. **Highlight state-specific logic**: "Watch how it shows Texas programs"
4. **Emphasize the Alpha**: "See how it found TX STAR+PLUS, which most tools miss"
5. **Show probability scoring**: "Not just yes/no, but 75% likely"
6. **Point out gaps**: "Maria is $157 over the SSI limit—she knows exactly what to fix"

---

## 🎬 Video Demo Script (2 minutes)

1. **[0:00-0:20]** Landing page: "70% of eligible families fail to secure benefits..."
2. **[0:20-0:40]** Step 1: "Maria lives in Houston, Texas..."
3. **[0:40-1:00]** Step 2: "She has MS and receives SSDI..."
4. **[1:00-1:20]** Steps 3-4: Speed through financial/demographic
5. **[1:20-1:40]** Results: "She's eligible for SNAP and TX STAR+PLUS waiver..."
6. **[1:40-2:00]** Expand card: "Here are the exact next steps and documents needed"

---

**Ready to test?**
1. Run `npm run dev`
2. Open http://localhost:3000
3. Follow Maria's data above
4. Share your results!

🚀 **For a live demo**, deploy to Vercel and share the URL.


#assessment #financial-inclusion
