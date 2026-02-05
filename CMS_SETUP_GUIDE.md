# Decap CMS Setup Guide for Omen Projects

## Overview

This site uses **Decap CMS** (formerly Netlify CMS) to manage dynamic content without a backend database. All content is stored as Markdown files with frontmatter, committed to GitHub, and deployed via Netlify.

---

## Project Structure

```
omen-projects/
├── admin/                          # CMS interface
│   ├── index.html                 # CMS app loader
│   └── config.yml                 # CMS configuration
├── content/                        # Managed content (Markdown files)
│   ├── gallery/                   # Project gallery posts
│   ├── testimonials/              # Client testimonials
│   ├── updates/                   # News & blog updates
│   ├── services/                  # Service descriptions
│   └── team/                      # Team member profiles
├── data/                          # JSON data files
│   ├── company.json              # Company info
│   └── hero.json                 # Homepage hero section
├── images/
│   └── uploads/                  # Uploaded images (auto-managed by CMS)
├── netlify.toml                  # Netlify build & deploy config
└── [HTML pages: index.html, about.html, more-projects.html]
```

---

## Netlify Dashboard Setup

### 1. Enable Netlify Identity
1. Go to **Site settings → Identity**
2. Click **Enable Identity**
3. Under **Notifications**, set email address for invites
4. Under **Services**, enable **Git Gateway** (no additional config needed)

### 2. Configure Git Gateway
1. Go to **Site settings → Identity → Services → Git Gateway**
2. Click **Enable Git Gateway**
3. Authorize with your GitHub account
4. Grant Netlify access to the repository

### 3. Set Build Settings (for static site)
1. Go to **Site settings → Build & deploy**
2. **Build command**: Leave empty (no build needed)
3. **Publish directory**: `.` (root of repo)
4. Click **Save**

### 4. Enable Branch Deploys (Optional)
1. Go to **Deploy settings → Deploy previews**
2. Enable **Deploy preview for pull requests**
3. This lets you preview CMS edits before merging to main

### 5. Configure Authentication Providers (Optional but Recommended)
1. Go to **Site settings → Identity → External providers**
2. Add **GitHub**, **Google**, or **Email** for user authentication
3. Users can now sign in via these providers instead of email links

---

## How the CMS Works

### Authentication Flow
1. User visits `https://willowy-tiramisu-d402ad.netlify.app/admin`
2. Netlify Identity widget redirects to login page
3. User logs in via email (or OAuth provider)
4. Granted access to Decap CMS editor

### Content Management
1. Editor creates/edits content in the CMS UI
2. CMS commits changes to GitHub (`main` branch)
3. Netlify automatically rebuilds & deploys
4. Changes live in 1-2 minutes

### File Storage
- **Content**: `content/gallery/*.md`, `content/testimonials/*.md`, etc.
- **Images**: `images/uploads/*` (auto-created by CMS)
- **Settings**: `data/company.json`, `data/hero.json`

---

## Frontend Integration: Fetching CMS Content

### Option 1: Static Build (Most Sites)
Rebuild site whenever content changes → content is baked into HTML.

**GitHub Actions or Netlify webhook**:
```yaml
# Trigger rebuild on content push
on:
  push:
    branches: [main]
    paths: [content/**, data/**]
```

### Option 2: JavaScript Fetch (Dynamic Loading)
Load content on demand using JavaScript:

```javascript
// Fetch a gallery project
async function loadGalleryProject(slug) {
  try {
    const response = await fetch(`/content/gallery/${slug}.md`);
    const markdown = await response.text();
    
    // Parse frontmatter (YAML) + markdown body
    const [, frontmatter, body] = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    const data = YAML.parse(frontmatter);
    
    console.log('Project:', data.title, data.featured_image);
    console.log('Description:', body);
    
    return { ...data, body };
  } catch (error) {
    console.error('Failed to load project:', error);
  }
}

// Call on page load
loadGalleryProject('skyline-business-center');
```

### Option 3: Hybrid (Recommended for Production)
- **Dynamic pages** (gallery, blog): Fetch & render JS
- **Static sections** (hero, services): Manage via JSON, rebuild on change

**Example: Load hero from JSON**:
```javascript
async function initHero() {
  const hero = await fetch('/data/hero.json').then(r => r.json());
  document.querySelector('.hero h1').textContent = hero.title;
  document.querySelector('.hero p').textContent = hero.subtitle;
  document.querySelector('.hero').style.backgroundImage = `url(${hero.image})`;
}
```

---

## CMS Collections Explained

### 1. **Gallery** (`content/gallery/*.md`)
Store project portfolios with images and details.

**Fields**:
- Title, slug, category (Commercial/Residential/Renovation)
- Location, description (markdown)
- Featured image + gallery images list
- Completion date, status

**Example usage in HTML**:
```html
<div id="projects-container"></div>
<script>
  async function loadProjects() {
    const files = ['skyline-business-center', 'riverside-luxury-apartments'];
    files.forEach(slug => {
      fetch(`/content/gallery/${slug}.md`)
        .then(r => r.text())
        .then(md => renderProject(parseMarkdown(md)));
    });
  }
  loadProjects();
</script>
```

### 2. **Testimonials** (`content/testimonials/*.md`)
Client reviews and feedback.

**Fields**: Client name, project, rating (5/4/3), testimonial text, photo, date

### 3. **Updates** (`content/updates/*.md`)
Blog posts and news articles.

**Fields**: Title, publish date, featured image, content (markdown), tags, published status

### 4. **Services** (`content/services/*.md`)
Service descriptions with icons and images.

**Fields**: Service name, Font Awesome icon class, description, optional image

### 5. **Team** (`content/team/*.md`)
Team member profiles.

**Fields**: Name, position, bio (markdown), photo, email, phone

### 6. **Settings**
Global site data (JSON files):
- `data/company.json`: Company name, contact, logo
- `data/hero.json`: Homepage hero section text and image

---

## Image Management

### Uploading Images via CMS
1. In any collection editor, click the **image widget**
2. Select **Upload** or **Select from media folder**
3. Choose an image file
4. CMS auto-saves to `/images/uploads/`
5. Image URL: `/images/uploads/filename.jpg`

### Using Uploaded Images in Frontend
```html
<!-- In HTML -->
<img src="/images/uploads/project-1.jpg" alt="Project">

<!-- Or in JavaScript -->
const imageUrl = '/images/uploads/' + frontmatterData.featured_image;
```

### Image Caching
`netlify.toml` sets **1-year cache** for images:
```toml
[[headers]]
  for = "/images/uploads/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

---

## Git Workflow

### When Content is Edited
1. Editor makes changes in CMS UI
2. CMS auto-commits to GitHub (e.g., `Create gallery: "new-project"`)
3. GitHub webhook notifies Netlify
4. Netlify redeploys (no build needed, just republish)
5. **Live in <2 minutes**

### Commit Messages
```
Create gallery: "skyline-business-center"
Update testimonials: "client-john-doe"
Delete updates: "old-news-item"
Upload "/images/uploads/project-1.jpg"
```

---

## Adding New CMS Content

### Via CMS UI (Easiest)
1. Go to `https://omenprojects.netlify.app/admin`
2. Log in with Netlify Identity
3. Click **Project Gallery** (or any collection)
4. Click **New Project Gallery**
5. Fill in fields (title, images, description)
6. Click **Publish**
7. Changes appear in ~1-2 minutes

### Via GitHub (Manual)
1. Create file: `content/gallery/my-project.md`
2. Add frontmatter:
```yaml
---
title: My New Project
slug: my-project
category: Commercial
location: New Location
featured_image: /images/uploads/my-project.jpg
completion_date: 2024-12-01
status: Completed
gallery_images:
  - image: /images/uploads/image1.jpg
    caption: "Caption 1"
---

Project description in markdown...
```
3. Commit and push to `main`
4. Netlify auto-deploys

---

## Troubleshooting

### CMS Won't Load
- **Issue**: `/admin` returns 404
- **Fix**: Ensure `/admin/index.html` exists and `netlify.toml` SPA redirect is set
- **Test**: Run `npx serve .` locally and visit `http://localhost:3000/admin`

### Login Issues
- **Issue**: "Netlify Identity not configured"
- **Fix**: Go to Netlify dashboard → **Site settings → Identity → Enable Identity**
- **Issue**: Infinite redirect loop
- **Fix**: Check **Git Gateway** is enabled in **Identity → Services**

### Images Not Uploading
- **Issue**: Upload fails silently
- **Fix**: Check `/images/uploads/` folder exists and is in `.gitignore` (or committed with `.gitkeep`)
- **Test**: Try uploading via CMS dashboard

### Changes Not Live
- **Issue**: Edit in CMS but changes don't appear
- **Fix**: 
  - Check **Site settings → Deploy log** for errors
  - Verify GitHub shows new commit on `main` branch
  - Hard refresh browser (Ctrl+Shift+R)
  - Wait 2-3 minutes for Netlify to rebuild

### Git Gateway Auth Failed
- **Issue**: "Git Gateway error: 401 Unauthorized"
- **Fix**:
  1. Go to Netlify → **Site settings → Identity → Services**
  2. Re-enable **Git Gateway**
  3. Authorize GitHub access again
  4. Clear browser cache

---

## Security Best Practices

1. **Only publish to `main`**: Git Gateway prevents direct GitHub commits (CMS is only author)
2. **Restrict Identity**: Go to **Identity → Registration → Invite only** (disable public signup)
3. **Backup commits**: Content is versioned in Git — all changes recoverable
4. **Cache busting**: Images use long URLs (`/images/uploads/...`) so they cache for 1 year
5. **No database**: No SQL injection or data breach risk — everything is files on GitHub

---

## Extending the CMS

### Add a New Collection
Edit `/admin/config.yml`:

```yaml
collections:
  - name: "events"
    label: "Events"
    folder: "content/events"
    create: true
    slug: "{{slug}}"
    extension: "md"
    format: "frontmatter"
    fields:
      - {label: "Event Name", name: "title", widget: "string", required: true}
      - {label: "Event Date", name: "date", widget: "datetime", format: "YYYY-MM-DD"}
      - {label: "Location", name: "location", widget: "string"}
      - {label: "Description", name: "body", widget: "markdown"}
      - {label: "Event Image", name: "image", widget: "image"}
```

Then create the folder:
```bash
mkdir -p content/events
```

Commit and push. CMS will recognize the new collection immediately.

### Customize Editor UI
Decap CMS options in `config.yml`:

```yaml
# Dark mode
editor:
  preview: true
  # Custom preview styles
  preview_styles: "/assets/css/main.css"

# Custom logo
logo_url: "/logo.jpg"

# Custom favicon
favicon: "/favicon.ico"
```

---

## Next Steps

1. ✅ Install Decap CMS (done)
2. ✅ Enable Netlify Identity (do this in dashboard)
3. ✅ Enable Git Gateway (do this in dashboard)
4. ✅ Create content directories (done)
5. Push all changes to GitHub
6. Test CMS at `https://omenprojects.netlify.app/admin`
7. Invite team members (Netlify dashboard → **Identity → Invite users**)
8. Start adding content via CMS!

---

## References

- **Decap CMS Docs**: https://decapcms.org/docs/
- **Netlify Identity**: https://docs.netlify.com/visitor-access/identity/
- **Git Gateway**: https://docs.netlify.com/visitor-access/git-gateway/
- **Markdown Frontmatter**: https://jekyllrb.com/docs/frontmatter/

---

**Questions?** Check the CMS dashboard logs or contact Netlify support.
