# PubIt - Publish Obsidian Notes to the Web

Publish your Obsidian notes to a beautiful, fast website at `yourname.pubit.site`.

> **Note:** This plugin requires a free PubIt account and uses network requests to sync your notes to PubIt's servers. See [Privacy & Data](#privacy--data) for details.

## Features

- **Tag-based publishing** - Add `#publish` to any note to include it on your site
- **One-click sync** - Click the ribbon icon to sync all publishable notes
- **Beautiful design** - Clean, responsive theme with dark mode support
- **Full-text search** - Readers can search across all your published notes
- **Wikilinks support** - Internal links work between published notes
- **Image handling** - Images are automatically uploaded and optimized
- **Folder structure** - Your folder hierarchy becomes site navigation
- **Fast sites** - Static generation for instant page loads

## Installation

### From Obsidian Community Plugins (Recommended)

1. Open Obsidian Settings
2. Go to **Community plugins** and disable **Safe mode**
3. Click **Browse** and search for "PubIt"
4. Click **Install**, then **Enable**

### Manual Installation

1. Download `main.js` and `manifest.json` from the [latest release](https://github.com/jacoblindqvist/obsidian-pubit/releases/latest)
2. Create a folder called `pubit-publish` in your vault's `.obsidian/plugins/` directory
3. Copy the downloaded files into this folder
4. Reload Obsidian and enable the plugin in Settings > Community plugins

## Getting Started

1. **Connect your vault** - Click the PubIt ribbon icon or run "Connect vault" from the command palette
2. **Authorize** - Follow the link to sign in and authorize in your browser
3. **Choose a subdomain** - Pick your site URL (e.g., `mysite.pubit.site`)
4. **Tag notes to publish** - Add `#publish` anywhere in notes you want on your site
5. **Sync** - Click the ribbon icon to publish

Your site will be live at `https://yoursite.pubit.site` within seconds.

## Usage

### Marking Notes for Publishing

Add `#publish` tag anywhere in a note to include it on your site:

```markdown
# My Note Title

#publish

Your content here...
```

Or use frontmatter:

```markdown
---
publish: true
---

# My Note Title

Your content here...
```

### Syncing Your Site

- **Ribbon icon** - Click the cloud upload icon in the left sidebar
- **Command palette** - Run "PubIt: Sync and publish"

The plugin syncs ALL notes tagged for publishing. It compares your local notes with your site and:
- Creates new notes that don't exist on the site
- Updates notes that have changed
- Removes notes you've untagged from publishing

### Pending Changes Indicator

A dot appears on the ribbon icon when you have unsaved changes. Click to sync and clear the indicator.

### Commands

- **Sync and publish** - Sync all publishable notes to your site
- **Connect vault** - Start the connection flow to link your vault
- **Disconnect vault** - Unlink this vault (your site stays online)

## How It Works

PubIt syncs your markdown notes to our servers where they're converted to static HTML. Your site is served globally via Cloudflare's edge network for fast load times worldwide.

- Notes are converted to HTML using a GitHub Flavored Markdown parser
- Wikilinks (`[[Note Name]]`) are converted to working links between published pages
- Images are optimized and served via Cloudflare Images
- The site is rebuilt incrementally when you make changes

## Privacy & Data

**Network Usage:** This plugin connects to `api.pubit.site` to:
- Authenticate your account via device code flow
- Upload notes you've tagged for publishing
- Upload and optimize images referenced in your notes
- Sync changes when you publish

**Account Requirement:** A free PubIt account is required. You can create one during the connection flow.

**Data Storage:**
- Your published notes are stored on Cloudflare's infrastructure (Workers, R2, D1)
- Only notes tagged with `#publish` or `publish: true` are uploaded
- Images are processed through Cloudflare Images for optimization
- You can disconnect your vault and delete your site at any time

**What we don't do:**
- We don't access notes you haven't tagged for publishing
- We don't read or analyze your content
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
