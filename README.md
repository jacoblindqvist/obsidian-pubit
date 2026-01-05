# Pubit - Publish Obsidian Notes to the Web

Publish your Obsidian notes to a beautiful, fast website at `yourname.pubit.site`.

> **Note:** This plugin requires a free Pubit account and uses network requests to sync your notes to Pubit's servers. See [Privacy & Data](#privacy--data) for details.

## Features

### Publishing
- **Frontmatter publishing** - Add `publish: true` to any note's frontmatter
- **One-click sync** - Click the ribbon icon to publish all marked notes
- **Delta sync** - Only changed notes are uploaded, keeping syncs fast
- **Pending changes indicator** - A dot on the ribbon icon shows when you have unpublished changes

### Your Published Site
- **Beautiful design** - Clean, responsive theme that looks great on any device
- **Dark mode** - Automatically respects your reader's system preference
- **Fast SPA navigation** - Pages load instantly without full page reloads
- **Folder navigation** - Your vault's folder structure becomes a collapsible sidebar
- **Full-text search** - Readers can search all your notes with `Cmd/Ctrl+K`

### Note Connections
- **Wikilinks** - `[[Note Name]]` links work between published notes
- **Graph view** - Interactive D3.js visualization showing how your notes connect
- **Backlinks** - Each note shows which other notes link to it
- **Tags** - Frontmatter tags appear as clickable pills, with `/tags` pages for browsing

### Media & Sharing
- **Image optimization** - Images are automatically uploaded and optimized via Cloudflare
- **Social previews** - Auto-generated Open Graph images for beautiful link sharing on Twitter, Discord, etc.

### Dashboard (auth.pubit.site)
- **Home page selection** - Choose which note is your site's landing page
- **Navigation menu editor** - Drag-and-drop to customize your site's menu order
- **Custom logo** - Upload an image or use custom text
- **Custom favicon** - Upload your own site icon
- **Subdomain management** - Change your site URL anytime

### Pro Features ($12/year)

Upgrade via the [dashboard](https://auth.pubit.site/dashboard) for:
- **Unlimited storage** - Free tier includes 100MB
- **Custom domains** - Use your own domain (e.g., `notes.yourdomain.com`)
- **Remove branding** - Hide the "Published with Pubit" footer

## Installation

### Via BRAT (Beta Testing)

Pubit is currently in beta. To install:

1. Install the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat) if you haven't already
2. Open BRAT settings and click "Add Beta Plugin"
3. Enter: `https://github.com/jacoblindqvist/obsidian-pubit`
4. Enable the Pubit plugin in Settings > Community plugins

### From Obsidian Community Plugins (Coming Soon)

1. Open Obsidian Settings
2. Go to **Community plugins** and disable **Safe mode**
3. Click **Browse** and search for "Pubit"
4. Click **Install**, then **Enable**

## Getting Started

1. **Connect your vault** - Click the Pubit ribbon icon or run "Connect vault" from the command palette
2. **Authorize** - A code appears; click the link to sign in with Google or email
3. **Choose a subdomain** - Pick your site URL (e.g., `mybrain.pubit.site`)
4. **Mark notes to publish** - Add `publish: true` to frontmatter
5. **Sync** - Click the ribbon icon to publish

Your site will be live at `https://yoursubdomain.pubit.site` within seconds.

## Usage

### Marking Notes for Publishing

Add `publish: true` to the frontmatter of any note:

```markdown
---
publish: true
---

# My Note Title

Your content here...
```

You can also add tags in frontmatter:

```markdown
---
publish: true
tags:
  - productivity
  - notes
---
```

### Syncing Your Site

- **Ribbon icon** - Click the cloud upload icon in the left sidebar
- **Command palette** - Run `Pubit: Sync and publish`

The plugin compares your local notes with your site and:
- Creates new notes that don't exist on the site
- Updates notes that have changed (using content hashing)
- Removes notes you've unmarked from publishing

### Pending Changes Indicator

A dot appears on the ribbon icon when you have unpublished changes. Click to sync and clear the indicator.

### Commands

| Command | Description |
|---------|-------------|
| `Pubit: Sync and publish` | Sync all publishable notes to your site |
| `Pubit: Connect vault` | Start the connection flow to link your vault |
| `Pubit: Disconnect vault` | Unlink this vault (your site stays online) |

## Site Features

### Search

Your readers can search across all published notes:
- Press `Cmd/Ctrl+K` to open search
- Results update as you type
- Navigate with arrow keys, press Enter to open

### Graph View

An interactive visualization shows connections between your notes:
- Click nodes to navigate
- Drag to rearrange
- Toggle "Tags in graph" to include tag connections

### Tags

Tags from your frontmatter are displayed on each note:
- Click any tag to see all notes with that tag
- Browse all tags at `/tags` on your site
- Tags can optionally appear in the graph view

## How It Works

1. You mark notes with `publish: true` in frontmatter
2. Plugin scans your vault and computes content hashes
3. Only changed notes are uploaded (delta sync)
4. Notes are stored in Cloudflare R2 and rendered on-demand
5. Your site is served globally via Cloudflare's edge network

Technical details:
- Notes are converted to HTML using GitHub Flavored Markdown
- Wikilinks (`[[Note Name]]`) become working links between pages
- Images are optimized via Cloudflare Images
- Navigation uses HTMX for instant page transitions

## Privacy & Data

**Network Usage:** This plugin connects to `api.pubit.site` to:
- Authenticate your account via device code flow
- Upload notes you've marked for publishing
- Upload and optimize images referenced in your notes
- Sync changes when you publish

**Account Requirement:** A free Pubit account is required. Create one during the connection flow.

**Data Storage:**
- Your published notes are stored on Cloudflare's infrastructure (Workers, R2, D1)
- Only notes with `publish: true` in frontmatter are uploaded
- Images are processed through Cloudflare Images for optimization
- You can disconnect your vault and delete your site at any time via the dashboard

**What we don't do:**
- We don't access notes you haven't marked for publishing
- We don't read or analyze your content beyond rendering
- We don't collect telemetry or usage analytics from the plugin
- We don't access files outside your Obsidian vault

See our [Privacy Policy](https://pubit.site/privacy) for full details.

## Support

- **Issues**: [GitHub Issues](https://github.com/jacoblindqvist/obsidian-pubit/issues)
- **Email**: support@pubit.site

## License

[MIT License](LICENSE) - see LICENSE file for details.

## Acknowledgments

- Built with the [Obsidian Plugin API](https://docs.obsidian.md)
- Hosting powered by [Cloudflare](https://cloudflare.com)
