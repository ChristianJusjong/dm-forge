# 🧪 Testing Checklist - Dungeon Master Forge

**Before deploying to production, verify all features work correctly.**

---

## 🎯 **Critical Security Features**

### **1. API Key Security**
- [ ] Verify Groq API key is NOT in `nav.js`
- [ ] Translation feature shows disabled message in console
- [ ] No API keys visible in any source files
- [ ] Check browser DevTools → Sources → Search for "gsk_"

**Expected Result:** ✅ No API keys found

---

### **2. Data Backup System**

#### **Export Complete Backup:**
- [ ] Click "💾 Backup" in navigation
- [ ] Click "💾 Export Complete Backup"
- [ ] File downloads with name: `dm-forge-backup-YYYY-MM-DD.json`
- [ ] Open file in text editor - verify it's valid JSON
- [ ] Verify backup contains all localStorage keys

**Expected Result:** ✅ Backup file downloaded and valid

#### **Export Single Campaign:**
- [ ] Create test campaign
- [ ] Go to Backup page
- [ ] Click "Export" next to campaign
- [ ] File downloads: `campaign-XXXXXXXX-YYYY-MM-DD.json`
- [ ] Verify campaign data in file

**Expected Result:** ✅ Campaign-specific backup works

#### **Import Data:**
- [ ] Create test data (campaign, notes, etc.)
- [ ] Export complete backup
- [ ] Clear browser data (localStorage)
- [ ] Verify data is gone
- [ ] Import backup file
- [ ] Verify all data restored

**Expected Result:** ✅ Data successfully restored

---

### **3. Storage Error Handling**

#### **JSON Parse Errors:**
- [ ] Open DevTools → Application → Local Storage
- [ ] Corrupt a value (change valid JSON to invalid)
- [ ] Refresh page
- [ ] Verify app doesn't crash
- [ ] Check console for error message

**Expected Result:** ✅ App continues with fallback values, error logged

#### **Quota Exceeded:**
```javascript
// Test in console:
try {
  for(let i=0; i<10000; i++) {
    localStorage.setItem('test_'+i, 'x'.repeat(10000));
  }
} catch(e) {
  console.log('Quota test:', e);
}
```
- [ ] Run above code in console
- [ ] Verify quota error is caught
- [ ] Alert shown to user
- [ ] App still functional

**Expected Result:** ✅ User-friendly error message, app continues

---

### **4. XSS Protection**

#### **Campaign Name XSS Test:**
- [ ] Try creating campaign with name: `<script>alert('XSS')</script>`
- [ ] Verify script doesn't execute
- [ ] Check if name is sanitized
- [ ] Display should show escaped text

**Expected Result:** ✅ No script execution, text escaped

#### **Username XSS Test:**
- [ ] Try registering with username: `<img src=x onerror=alert('XSS')>`
- [ ] Login and check navigation
- [ ] Verify no alert shown
- [ ] Username displayed as plain text

**Expected Result:** ✅ No script execution

---

### **5. Storage Utilities**

#### **Safe localStorage Functions:**
```javascript
// Test in console:
const testData = {test: 'value', number: 123};
const success = safeLocalStorageSet('test_key', testData);
console.log('Set success:', success);

const retrieved = safeLocalStorageGet('test_key', null);
console.log('Retrieved:', retrieved);

// Test with invalid data:
localStorage.setItem('bad_key', '{invalid json}');
const bad = safeLocalStorageGet('bad_key', {fallback: true});
console.log('Fallback used:', bad);
```

- [ ] Run tests above
- [ ] Verify safe set/get works
- [ ] Verify fallback on bad JSON
- [ ] No crashes or errors

**Expected Result:** ✅ All functions work safely

---

## 🎮 **Core Functionality Tests**

### **6. Authentication**

#### **Registration:**
- [ ] Go to register page
- [ ] Enter email, username, password
- [ ] Password must be 8+ chars
- [ ] Click Sign Up
- [ ] Redirected to login

**Expected:** ✅ Account created

#### **Login:**
- [ ] Enter credentials
- [ ] Click Login
- [ ] Redirected to home
- [ ] Username shown in nav

**Expected:** ✅ Logged in successfully

#### **Logout:**
- [ ] Click Logout button
- [ ] Redirected to login
- [ ] Protected pages redirect to login

**Expected:** ✅ Logged out successfully

---

### **7. Campaign Management**

#### **Create Campaign:**
- [ ] Click "Start / Load Campaign"
- [ ] Enter campaign name
- [ ] Choose edition (5e 2024)
- [ ] Choose world (Forgotten Realms)
- [ ] Click Create
- [ ] Campaign code shown
- [ ] Write down code!

**Expected:** ✅ Campaign created with 8-char code

#### **Load Campaign:**
- [ ] Click "Load Campaign"
- [ ] Enter campaign code
- [ ] Click Load
- [ ] Redirected to configuration

**Expected:** ✅ Campaign loaded

#### **Switch Campaign:**
- [ ] Create second campaign
- [ ] Go to Configuration
- [ ] Click "Switch Campaign"
- [ ] Select other campaign
- [ ] Verify correct campaign loaded

**Expected:** ✅ Can switch between campaigns

---

### **8. Party Management**

#### **Add Character:**
- [ ] Go to Configuration → Party tab
- [ ] Click "Add Character"
- [ ] Fill all fields (name, race, class, level, HP, AC, etc.)
- [ ] Enter all 6 ability scores
- [ ] Click Save
- [ ] Character appears in list

**Expected:** ✅ Character added

#### **Edit Character:**
- [ ] Click Edit on character
- [ ] Change HP value
- [ ] Click Save
- [ ] Verify HP updated

**Expected:** ✅ Character updated

#### **Delete Character:**
- [ ] Click Delete on character
- [ ] Confirm deletion
- [ ] Character removed from list

**Expected:** ✅ Character deleted

---

### **9. Initiative Tracker**

#### **Start Combat:**
- [ ] Go to Initiative page
- [ ] Click "⚔️ Ny Kamp"
- [ ] Add combatant form appears
- [ ] Add 3 combatants (2 NPCs, 1 PC)
- [ ] Enter DC, HP, AC, XP for each
- [ ] Click "Add to Initiative"

**Expected:** ✅ Combatants added and sorted by DC

#### **Combat Turn Flow:**
- [ ] Verify highest DC is first (highlighted)
- [ ] Click "Next Turn"
- [ ] Second combatant highlighted
- [ ] Round counter shows current round

**Expected:** ✅ Turn order works

#### **Damage/Healing:**
- [ ] Click damage button on NPC (-5)
- [ ] HP decreases
- [ ] Click heal button (+5)
- [ ] HP increases
- [ ] Verify can't exceed max HP

**Expected:** ✅ HP tracking works

#### **End Combat:**
- [ ] Set one NPC HP to 0 (defeated)
- [ ] Click "🏆 Luk Kamp"
- [ ] Verify XP calculated
- [ ] Check session notes for combat log
- [ ] Combat log shows XP earned

**Expected:** ✅ Combat logged with XP

---

### **10. Monster Browser**

#### **Search Monsters:**
- [ ] Go to Monsters page
- [ ] Search "goblin"
- [ ] Results appear
- [ ] Click on monster card
- [ ] Modal shows full stats
- [ ] D&D Beyond link present

**Expected:** ✅ Monster search works

#### **View Stats:**
- [ ] Verify AC, HP, CR displayed
- [ ] Ability scores shown with modifiers
- [ ] Special abilities listed
- [ ] Actions listed

**Expected:** ✅ Complete stat block shown

---

### **11. Encounter Builder**

#### **Create Encounter:**
- [ ] Go to Encounters page
- [ ] Enter encounter name
- [ ] Add 2-3 creatures
- [ ] Verify difficulty shown (Easy/Medium/Hard/Deadly)
- [ ] Click Save Encounter

**Expected:** ✅ Encounter saved

#### **Load to Initiative:**
- [ ] Click "Load to Initiative" on saved encounter
- [ ] Redirected to Initiative page
- [ ] All creatures added automatically

**Expected:** ✅ Encounter loaded to combat

---

### **12. Session Notes**

#### **Create Session:**
- [ ] Go to Notes page
- [ ] Click "New Session"
- [ ] Add sections (Story, NPCs, Locations)
- [ ] Type notes in each section
- [ ] Refresh page
- [ ] Verify notes saved

**Expected:** ✅ Auto-save works

#### **Combat Logging:**
- [ ] Start combat in Initiative
- [ ] End combat
- [ ] Go to Notes page
- [ ] Verify "Kampe" section added
- [ ] Combat summary present with XP

**Expected:** ✅ Combat auto-logged

---

## 📱 **Browser Compatibility**

### **13. Cross-Browser Testing**

Test ALL features on each browser:

#### **Chrome:**
- [ ] Registration/Login
- [ ] Campaign creation
- [ ] Backup export/import
- [ ] Initiative tracker
- [ ] Monster search
- [ ] Notes saving

#### **Firefox:**
- [ ] Registration/Login
- [ ] Campaign creation
- [ ] Backup export/import
- [ ] Initiative tracker
- [ ] Monster search
- [ ] Notes saving

#### **Safari:**
- [ ] Registration/Login
- [ ] Campaign creation
- [ ] Backup export/import
- [ ] Initiative tracker
- [ ] Monster search
- [ ] Notes saving

#### **Edge:**
- [ ] Registration/Login
- [ ] Campaign creation
- [ ] Backup export/import
- [ ] Initiative tracker
- [ ] Monster search
- [ ] Notes saving

**Expected:** ✅ All features work on all browsers

---

## 📱 **Mobile Testing**

### **14. Mobile Responsiveness**

Test on actual mobile device or emulator:

#### **Phone (375px width):**
- [ ] Navigation menu works
- [ ] Can click all buttons
- [ ] Text readable
- [ ] Forms usable
- [ ] No horizontal scroll

#### **Tablet (768px width):**
- [ ] Layout adapts properly
- [ ] Touch targets adequate (44px min)
- [ ] Navigation accessible
- [ ] All features work

**Expected:** ✅ Mobile-friendly on all devices

---

## 🔐 **Security Testing**

### **15. Security Audit**

#### **Source Code Inspection:**
- [ ] View page source on all pages
- [ ] Search for API keys (should find none)
- [ ] Search for passwords (should be hashed)
- [ ] Verify no sensitive data exposed

#### **LocalStorage Inspection:**
- [ ] Open DevTools → Application → Local Storage
- [ ] Check stored data
- [ ] Passwords should be hashed (not plain text)
- [ ] Campaign data should be JSON

#### **XSS Testing:**
- [ ] Try XSS in all input fields:
  - Campaign name: `<script>alert(1)</script>`
  - Username: `<img src=x onerror=alert(1)>`
  - Session notes: `javascript:alert(1)`
- [ ] Verify none execute

**Expected:** ✅ No XSS vulnerabilities found

---

## 💾 **Data Persistence Testing**

### **16. Data Persistence**

#### **Page Refresh:**
- [ ] Create campaign and party
- [ ] Refresh page (F5)
- [ ] Verify data still present

#### **Browser Close/Reopen:**
- [ ] Create data
- [ ] Close browser completely
- [ ] Reopen and navigate to site
- [ ] Verify data persists

#### **Different Tabs:**
- [ ] Open site in Tab A
- [ ] Make changes
- [ ] Open site in Tab B
- [ ] Changes visible? (No - expected, multi-tab sync not implemented)

**Expected:** ✅ Data persists after refresh and browser restart

---

## 📊 **Storage Management Testing**

### **17. Storage Monitoring**

#### **Usage Display:**
- [ ] Go to Backup page
- [ ] Storage meter shows percentage
- [ ] MB/KB usage displayed
- [ ] Last backup date shown

#### **Quota Warning:**
```javascript
// Fill storage to test warning:
for(let i=0; i<1000; i++) {
  safeLocalStorageSet('test_campaign_'+i, {
    name: 'Test Campaign',
    data: 'x'.repeat(5000)
  });
}
```
- [ ] Run above code
- [ ] Check Backup page
- [ ] Meter should be yellow/red
- [ ] Warning should appear

**Expected:** ✅ Warning at 80% capacity

---

## ♿ **Accessibility Testing**

### **18. Accessibility**

#### **Screen Reader:**
- [ ] Test with NVDA or JAWS
- [ ] Navigate with Tab key
- [ ] All interactive elements reachable
- [ ] Alt text read for images
- [ ] Buttons have descriptive names

#### **Keyboard Navigation:**
- [ ] Navigate entire site with keyboard only
- [ ] Tab through all interactive elements
- [ ] Enter to activate buttons
- [ ] Esc to close modals
- [ ] No keyboard traps

#### **Color Contrast:**
- [ ] Use browser contrast checker
- [ ] Text meets WCAG AA (4.5:1 minimum)
- [ ] Buttons have sufficient contrast

**Expected:** ✅ Basic accessibility compliance

---

## 🐛 **Error Handling Testing**

### **19. Error Scenarios**

#### **Invalid Campaign Code:**
- [ ] Try loading with code "INVALID1"
- [ ] Error message shown
- [ ] App doesn't crash

#### **Empty Form Submission:**
- [ ] Try submitting empty campaign form
- [ ] Validation error shown
- [ ] Form doesn't submit

#### **Corrupted Data:**
- [ ] Manually corrupt localStorage JSON
- [ ] Refresh page
- [ ] App uses fallback values
- [ ] No crash

**Expected:** ✅ All errors handled gracefully

---

## 📋 **Pre-Deployment Checklist**

### **20. Final Verification**

Before deploying to production:

#### **Code Quality:**
- [ ] No console errors on any page
- [ ] No browser warnings
- [ ] All features tested and working
- [ ] Documentation complete

#### **Security:**
- [ ] No API keys in source
- [ ] XSS protection tested
- [ ] Input sanitization verified
- [ ] Error handling confirmed

#### **Data Safety:**
- [ ] Backup system tested
- [ ] Import/export verified
- [ ] Storage monitoring works
- [ ] Quota handling confirmed

#### **User Experience:**
- [ ] All pages load quickly (< 2 seconds)
- [ ] Mobile responsive
- [ ] Keyboard accessible
- [ ] Clear error messages

#### **Documentation:**
- [ ] USER_GUIDE.md complete
- [ ] SECURITY_FIXES_COMPLETE.md reviewed
- [ ] DEPLOYMENT_ANALYSIS.md ready
- [ ] README.md created (if deploying to GitHub)

---

## ✅ **Test Results Summary**

After completing all tests, fill in:

| Category | Status | Notes |
|----------|--------|-------|
| Security | ⬜ Pass / ⬜ Fail | |
| Backup System | ⬜ Pass / ⬜ Fail | |
| Core Features | ⬜ Pass / ⬜ Fail | |
| Error Handling | ⬜ Pass / ⬜ Fail | |
| Cross-Browser | ⬜ Pass / ⬜ Fail | |
| Mobile | ⬜ Pass / ⬜ Fail | |
| Accessibility | ⬜ Pass / ⬜ Fail | |
| Performance | ⬜ Pass / ⬜ Fail | |

### **Deployment Decision:**

- [ ] ✅ **APPROVED FOR DEPLOYMENT** - All tests pass
- [ ] ⚠️ **CONDITIONAL APPROVAL** - Minor issues, deploy with notes
- [ ] ❌ **BLOCKED** - Critical issues must be fixed first

### **Outstanding Issues:**
1. _____________________________________
2. _____________________________________
3. _____________________________________

### **Tester Signature:**
- Name: _____________________________________
- Date: _____________________________________
- Environment: _____________________________________

---

**🎉 Testing Complete!**

*Document Version: 1.0*
*Last Updated: 2025-11-13*
