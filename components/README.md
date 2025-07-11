# Web Components

This directory contains reusable web components that are used across the Web Tools application.

## Core Components

### `<web-header>`

A reusable header component that includes:
- Logo with automatic path resolution
- Back button with automatic visibility
- Menu toggle button

Usage:
```html
<web-header></web-header>
```

### `<web-nav>`

A reusable navigation drawer component that includes:
- Complete list of all tools
- Automatic path resolution for links
- Close button
- Consistent styling

Usage:
```html
<web-nav></web-nav>
```

### `<web-footer>`

A reusable footer component that includes:
- Theme toggle functionality
- External links
- Consistent styling

Usage:
```html
<web-footer></web-footer>
```

### `<web-seo>`

A component for managing SEO, meta tags, and schema.org data:
- Automatically sets document title
- Manages meta tags (description, keywords, robots)
- Sets Open Graph and Twitter Card tags
- Adds schema.org JSON-LD data
- Manages canonical links

Usage:
```html
<web-seo 
    page-title="Tool Name"
    description="Tool description for SEO"
    keywords="comma, separated, keywords"
    type="WebApplication"
    path="tool-path"
    image="path/to/image.png">
</web-seo>
```

Attributes:
- `page-title`: The page title (will be appended with "- Web Tools")
- `description`: Meta description for SEO
- `keywords`: Comma-separated keywords for SEO
- `type`: Content type (website, WebApplication, Article, etc.)
- `path`: Path relative to base URL for canonical links
- `image`: Image path for social sharing

## Tool Components

Each tool has its own web component that encapsulates its functionality:

- `<tool-card>`: Card component for the home page
- `<tool-clipboard>`: Clipboard image tool
- `<tool-emoji>`: Emoji picker tool
- `<tool-timezone>`: TimeSync tool
- `<tool-text-transform>`: Text transform tool
- `<tool-code>`: Code tools
- `<tool-markdown>`: Markdown editor
- `<tool-color-picker>`: Color picker tool
- `<tool-password>`: Password generator

## Template

A template HTML file is available at `template.html` that can be used as a starting point for new tool pages.
