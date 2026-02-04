# Quick CMS Reference

## Access the CMS
```
https://omenprojects.netlify.app/admin
```
(Login via Netlify Identity)

## File Locations
- **Gallery projects**: `/content/gallery/*.md`
- **Testimonials**: `/content/testimonials/*.md`
- **News updates**: `/content/updates/*.md`
- **Services**: `/content/services/*.md`
- **Team members**: `/content/team/*.md`
- **Uploaded images**: `/images/uploads/*`
- **Site settings**: `/data/company.json`, `/data/hero.json`

## File Format (Markdown + Frontmatter)
```yaml
---
title: Project Name
slug: project-slug
category: Commercial
featured_image: /images/uploads/image.jpg
---

# Description in Markdown

This is the project description...
```

## Adding Content via Code
1. Create file in appropriate folder
2. Add YAML frontmatter (metadata)
3. Add markdown body (content)
4. Commit to GitHub → auto-deploys

## Example: Adding a Gallery Project
```bash
# Create file
echo '---
title: New Building
slug: new-building
category: Residential
featured_image: /images/uploads/building.jpg
completion_date: 2024-12-15
status: Completed
---

Professional construction services...' > content/gallery/new-building.md

# Commit
git add content/gallery/new-building.md
git commit -m "Add new building to gallery"
git push
```

## .gitignore Rules
Keep these in `.gitignore`:
```
# OS files
.DS_Store
Thumbs.db

# Editor
.vscode/
.idea/

# Environment
.env.local
.env.*.local

# CMS lock files (Netlify-managed)
.netlify/
```

Note: **DO commit** `/content/` and `/images/uploads/` — they contain your actual content!

## Netlify Dashboard Quick Links
- Logs: https://app.netlify.com → select site → **Deploys**
- Identity settings: https://app.netlify.com → select site → **Identity**
- Git Gateway: https://app.netlify.com → select site → **Identity → Services → Git Gateway**

## Frontend Code Examples

### Load gallery from Markdown files
```javascript
async function loadGallery() {
  const projects = ['skyline-business-center', 'riverside-luxury'];
  
  projects.forEach(async (slug) => {
    const res = await fetch(`/content/gallery/${slug}.md`);
    const text = await res.text();
    
    // Parse YAML frontmatter + markdown
    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    const [, front, body] = match;
    
    // Convert YAML to object (simple parser)
    const data = {};
    front.split('\n').forEach(line => {
      const [key, ...val] = line.split(':');
      data[key.trim()] = val.join(':').trim();
    });
    
    renderProject(data, body);
  });
}

function renderProject(data, body) {
  const html = `
    <div class="project">
      <img src="${data.featured_image}" alt="${data.title}">
      <h3>${data.title}</h3>
      <p>${data.location}</p>
    </div>
  `;
  document.querySelector('#gallery').innerHTML += html;
}

loadGallery();
```

### Load company info from JSON
```javascript
fetch('/data/company.json')
  .then(r => r.json())
  .then(data => {
    document.querySelector('.company-name').textContent = data.name;
    document.querySelector('.company-phone').href = `tel:${data.phone}`;
    document.querySelector('.company-email').href = `mailto:${data.email}`;
  });
```

## Common Tasks

### Update company contact info
1. Go to CMS → **Site Settings → Company Info**
2. Edit phone, email, address, hours
3. Click **Publish**
4. Changes live in ~1 min

### Add team member
1. Go to CMS → **Team Members**
2. Click **New Team Members**
3. Fill: Name, position, bio, photo
4. Click **Publish**

### Create blog post
1. Go to CMS → **News & Updates**
2. Click **New News & Updates**
3. Title, date, featured image, content
4. Click **Publish**

### Upload bulk images
1. Use GitHub to add to `/images/uploads/`
2. Reference in CMS with `/images/uploads/filename.jpg`
3. Or upload directly via CMS image widget

## Troubleshooting

**CMS won't load?**
- Check Netlify Identity is enabled
- Clear cache, hard refresh (Ctrl+Shift+R)
- Check browser console for errors

**Changes not deploying?**
- Check commit appears in GitHub
- Check Netlify deploy log for errors
- Wait 2-3 minutes for rebuild

**Image upload fails?**
- Ensure `/images/uploads/` folder exists
- Check `netlify.toml` has correct media folder config
- Try uploading via GitHub instead

## YAML Frontmatter Syntax

| Type | Example |
|------|---------|
| String | `title: "My Project"` |
| Number | `rating: 5` |
| Date | `date: 2024-12-15` |
| Boolean | `published: true` |
| Array | `tags: [construction, residential]` |
| List object | `images:` with children `- image: url` |

---

Keep this handy for editing and reference!
