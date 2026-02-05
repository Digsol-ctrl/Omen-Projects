# Fixing Netlify Identity Invite Token Issue

## Problem
When inviting users, they receive an email with a link like:
```
https://willowy-tiramisu-d402ad.netlify.app/#invite_token=NEa8s-7omE7HXm31OVPIEA
```

But clicking the link just shows a blank/useless page instead of allowing them to set a password.

## Solution
The `/admin/index.html` file wasn't properly handling the invite token. It's been updated to:

1. **Parse the invite token** from the URL hash
2. **Detect invite links** and show the signup modal automatically
3. **Initialize Netlify Identity widget** correctly
4. **Handle recovery tokens** (for password resets)
5. **Manage auth flow** (login, signup, logout)

## What Changed

### Before
```javascript
window.netlifyIdentity.on('init', user => {
  if (!user) {
    window.netlifyIdentity.open(); // Opens blank modal
  }
});
```

### After
```javascript
// Check if this is an invite link
const params = new URLSearchParams(window.location.hash.substring(1));
const inviteToken = params.get('invite_token');

if (inviteToken) {
  window.netlifyIdentity.on('init', user => {
    if (!user) {
      // Show signup modal for invite acceptance
      window.netlifyIdentity.open('signup');
    }
  });
}
```

## How It Works Now

### When user clicks invite link:
1. Link: `https://willowy-tiramisu-d402ad.netlify.app/#invite_token=NEa8s-7...`
2. `/admin/index.html` detects the token
3. Netlify Identity widget opens **signup modal**
4. User enters password and creates account
5. User is logged in and can access CMS

### When user visits `/admin` normally:
1. Link: `https://willowy-tiramisu-d402ad.netlify.app/admin`
2. `/admin/index.html` detects no token
3. Netlify Identity widget opens **login modal**
4. Existing user logs in
5. User can access CMS

### When user resets password:
1. Link includes `recovery_token`
2. Widget shows **recovery modal**
3. User sets new password
4. User can log in

## What to Do

### Already Updated! ✅
The `/admin/index.html` file has been automatically updated with this fix.

### Test It:
1. **Invite a new user** in Netlify dashboard:
   - Go to **Site settings → Identity → Invite users**
   - Enter an email address
   - Click **Send invite**

2. **User receives email** with invite link

3. **User clicks link** in email:
   - Should see a **signup form** (not blank page)
   - Enter password
   - Click "Sign up"
   - Should be logged into CMS

4. **If it still doesn't work:**
   - Hard refresh: `Ctrl+Shift+R`
   - Clear cache
   - Try incognito/private window
   - Check browser console for errors: `F12 → Console`

## Browser Console

If there are any errors, check the browser console:

1. Open CMS link
2. Press `F12` (opens Developer Tools)
3. Click **Console** tab
4. Look for any error messages
5. Share any errors in the console

## Common Issues

### "Blank page with invite token link"
✅ **Fixed** — The updated code now detects and processes the token

### "Password form not appearing"
- [ ] Hard refresh browser (`Ctrl+Shift+R`)
- [ ] Clear browser cache
- [ ] Try different browser
- [ ] Check browser console for errors (`F12`)

### "Can't sign up"
- [ ] Check email is correct in invite
- [ ] Check user accepted invite email (check spam folder)
- [ ] Verify Git Gateway is still enabled in Netlify dashboard
- [ ] Check Netlify Identity is enabled

### "Signed up but can't access CMS"
- [ ] Verify user is assigned to the site in Netlify
- [ ] Check Netlify dashboard → **Identity** → see user listed
- [ ] Try logging out and back in

## Verification Steps

To confirm the fix is working:

1. **Visit the admin page:**
   ```
   https://willowy-tiramisu-d402ad.netlify.app/admin
   ```

2. **Check browser console** (`F12 → Console`):
   - Should NOT see errors
   - Should see initialization messages

3. **Invite a test user:**
   - Netlify dashboard → **Site settings → Identity → Invite users**
   - Enter test email
   - Click "Send invite"

4. **User clicks invite link:**
   - Email arrives
   - User clicks link from email
   - Should see **signup form**
   - User enters password
   - User clicks "Sign up"
   - User is logged into CMS ✅

5. **Existing user logs in:**
   - Visit `/admin`
   - Click "Log in"
   - Enter email
   - Click "Log in with email"
   - User enters password
   - User is logged in ✅

## Technical Details

The fix handles these URL patterns:

| Pattern | Action |
|---------|--------|
| `#invite_token=...` | Show signup form |
| `#recovery_token=...` | Show password reset form |
| No token | Show login form |

## Questions?

- **CMS not loading?** Check `CMS_SETUP_GUIDE.md`
- **Netlify dashboard help?** See `NETLIFY_SETUP_STEPS.md`
- **Identity issues?** Check Netlify docs: https://docs.netlify.com/visitor-access/identity/

---

**The invite issue should now be fixed!** ✅

Test by inviting a new user and verifying they see the signup form instead of a blank page.
