# Netlify Dashboard Setup — Step-by-Step

## Prerequisites
- Site deployed on Netlify: `https://willowy-tiramisu-d402ad.netlify.app`
- GitHub repository connected
- Admin access to Netlify account

---

## Step 1: Enable Netlify Identity

### In Netlify Dashboard:
1. Log in to https://app.netlify.com
2. Select **Omen Projects** site
3. Go to **Site settings** (top menu) → **Identity** (left sidebar)
4. Click **Enable Identity** button
5. A notification email will be sent — confirm if prompted

**What this does**: Enables secure login for CMS editors

---

## Step 2: Configure Notification Email

### Still in Identity Settings:
1. Look for **Notifications** section
2. Under **Email notifications**, enter your admin email
3. This is where signup/invite emails will come from
4. Click **Save**

---

## Step 3: Enable Git Gateway

### In Identity Settings:
1. Scroll down to **Services** section
2. Click on **Git Gateway**
3. Click **Enable Git Gateway** button
4. A popup asks for **GitHub authorization**
   - Click **Authorize application**
   - You'll be redirected to GitHub
   - Click **Authorize netlify** to grant permissions
5. Return to Netlify dashboard — Git Gateway is now **Enabled** (green checkmark)

**What this does**: Allows CMS to commit content to GitHub automatically

---

## Step 4: Verify Build Settings

### Go to **Site settings** → **Build & deploy**:
1. Under **Build command**: Should be **empty** (this is a static site)
2. Under **Publish directory**: Should be `.` (the root)
3. If changed, click **Save**

**Expected state**:
```
Build command:          [empty]
Publish directory:      .
```

---

## Step 5: (Optional) Restrict Registrations

### Back in **Site settings** → **Identity**:
1. Scroll to **Registration** section
2. Default is "Open" (anyone can sign up)
3. **Recommended**: Change to "Invite only" (only invited users can access CMS)
4. Click **Save**

**Why**: Prevents unauthorized people from accessing the CMS editor

---

## Step 6: (Optional) Add OAuth Login Providers

### In **Site settings** → **Identity** → **External providers**:

#### Add GitHub Login (recommended):
1. Click **GitHub**
2. Enter GitHub OAuth credentials:
   - Create OAuth app at https://github.com/settings/developers
   - Use:
     - **Application name**: "Omen Projects CMS"
   - **Homepage URL**: `https://willowy-tiramisu-d402ad.netlify.app`
   - **Authorization callback URL**: `https://willowy-tiramisu-d402ad.netlify.app/.netlify/identity/callback`
   - Copy **Client ID** and **Client Secret** into Netlify form
3. Click **Save**

#### Add Google Login (alternative):
1. Click **Google**
2. Get OAuth credentials from https://console.cloud.google.com
3. Paste **Client ID** and **Client Secret**
4. Click **Save**

**Why**: Users can log in with their GitHub/Google account instead of email

---

## Step 7: Invite Team Members (If Desired)

### In **Site settings** → **Identity**:

1. Click **Invite users** button
2. Enter team member email address
3. Click **Send invite**
4. Team member receives email → clicks link → creates password
5. They can now log in to `/admin`

---

## Testing the CMS

### Test it works:
1. Go to `https://willowy-tiramisu-d402ad.netlify.app/admin`
2. Login (email or OAuth if configured)
3. You should see Decap CMS dashboard
4. Collections visible: Gallery, Testimonials, Updates, Services, Team, Settings

### Create a test project:
1. Click **Project Gallery**
2. Click **New Project Gallery**
3. Fill in:
   - **Project Title**: "Test Project"
   - **Category**: Commercial
   - **Featured Image**: Upload a test image
4. Click **Publish**
5. Check GitHub — a new commit appears!
6. Wait 1-2 minutes — site redeploys automatically

---

## Troubleshooting

### "Netlify Identity not found" or infinite redirect loop
**Fix**:
1. Go to **Site settings** → **Identity** → **Verify it says "Enabled"**
2. Hard refresh browser: `Ctrl+Shift+R`
3. Clear browser cache
4. Try incognito window

### "Git Gateway error" or "Not authorized"
**Fix**:
1. Go to **Site settings** → **Identity** → **Services**
2. **Re-enable** Git Gateway (toggle off, then on)
3. **Re-authorize** GitHub
4. Wait 30 seconds, refresh browser

### "Image upload failed"
**Fix**:
1. Check `/images/uploads/` folder exists in repo
2. Verify `media_folder` in `/admin/config.yml` is correct
3. Try uploading test image directly via GitHub to `/images/uploads/`
4. Restart browser cache

### Build failing after content update
**Fix**:
1. Go to **Deploys** tab
2. Click failed deploy → see error message
3. Common causes:
   - Invalid frontmatter YAML syntax
   - Image path incorrect
   - Try creating content again in CMS
4. Check GitHub commit message for what changed

---

## Quick Links

| Action | Link |
|--------|------|
| **Go to CMS** | https://willowy-tiramisu-d402ad.netlify.app/admin |
| **Site Dashboard** | https://app.netlify.com/sites/omenprojects-netlify-app |
| **Identity Settings** | https://app.netlify.com → Site → Settings → Identity |
| **Git Gateway** | https://app.netlify.com → Site → Settings → Identity → Services |
| **View Deploys** | https://app.netlify.com → Site → Deploys |
| **View Code** | https://github.com/your-org/omen-projects |

---

## Environment Variables (If Needed)

Some CMS features may require environment variables. To set them:

1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Click **Edit variables**
3. Add key-value pairs:
   ```
   DECAP_CMS_SITE_URL = https://willowy-tiramisu-d402ad.netlify.app
   ```
4. Click **Save**

*Usually not needed for static sites.*

---

## Minimize Deploys and Redeploys

If you want to reduce build/deploy activity (to save credits and avoid unnecessary redeploys), apply these controls and use the CLI for controlled production updates.

- **Disable automatic production builds:** In the Netlify site dashboard go to `Site settings` → `Build & deploy` → `Continuous Deployment` and turn **Off** automatic builds for the production branch. This prevents every push from triggering a build.
- **Disable deploy previews:** In `Build & deploy` disable deploy previews for pull requests so preview builds are not created automatically.
- **Require PR reviews / protect the branch:** On GitHub enable branch protection for `main` so merges require an approved pull request — this avoids accidental merges that trigger deploys.
- **Limit team deploy permissions:** In `Site` → `Team` adjust roles so only trusted users can trigger deploys.
- **Use manual CLI deploys for production:** Build locally and deploy artifacts with the Netlify CLI only when ready:

```powershell
npm install -g netlify-cli
netlify login
netlify link --name omen-projects
netlify deploy --dir=. --prod
```

- **Ensure upload folder exists:** Your `admin/config.yml` uses `images/uploads` — keep that folder in the repo so CMS uploads succeed.
- **Reduce expensive CI steps:** Move heavy image processing or long build steps to offline/local processes when possible.
- **Request enforced spending controls:** Netlify doesn't provide a user-set hard spending cap; contact Netlify Support or Sales to request an enforced limit or prepaid arrangement.

### Sample `netlify.toml`

Add this to the repository root to make the publish directory and build behavior explicit for Netlify:

```
[build]
   command = ""
   publish = "."

[context.production]
   command = ""
   publish = "."
```

Add the `netlify.toml` file to the repo if it doesn't already exist.

---

## That's It!

Your CMS is now fully configured. Team members can:

1. ✅ Visit `/admin` and log in
2. ✅ Create/edit content via visual editor
3. ✅ Upload images
4. ✅ Click Publish → auto-commits to GitHub
5. ✅ Site redeploys automatically in ~1-2 minutes

**No code changes needed for content editing!**

---

## Questions?

- **Netlify Docs**: https://docs.netlify.com/visitor-access/identity/
- **Decap CMS Docs**: https://decapcms.org/docs/
- **Git Gateway Guide**: https://docs.netlify.com/visitor-access/git-gateway/
