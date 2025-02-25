class ToolMarkdown extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Load external stylesheet
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '../../styles/tool-markdown.css');
    
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="container">
        <div class="main-content">
          <h1>Markdown Editor & Previewer</h1>
          <p>Convert Markdown to HTML and vice versa for documentation and blog posts</p>
          
          <div class="toolbar">
            <button class="toolbar-button" data-action="heading">H</button>
            <button class="toolbar-button" data-action="bold">B</button>
            <button class="toolbar-button" data-action="italic">I</button>
            <button class="toolbar-button" data-action="link">Link</button>
            <button class="toolbar-button" data-action="image">Image</button>
            <button class="toolbar-button" data-action="code">Code</button>
            <button class="toolbar-button" data-action="list">List</button>
            <button class="toolbar-button" data-action="quote">Quote</button>
            <button class="toolbar-button" data-action="hr">HR</button>
          </div>
          
          <div class="editor-container">
            <div class="panel">
              <div class="panel-header">
                <span class="panel-title">Markdown</span>
                <button class="action-button" id="clear-markdown">Clear</button>
              </div>
              <textarea id="markdown-input" placeholder="Write your markdown here..."></textarea>
              <div class="sample-data">
                <button class="sample-button" data-sample="basic">Basic Example</button>
                <button class="sample-button" data-sample="advanced">Advanced Example</button>
              </div>
            </div>
            
            <div class="panel">
              <div class="panel-header">
                <span class="panel-title">Preview</span>
                <button class="action-button" id="copy-html">Copy HTML</button>
              </div>
              <div class="preview" id="preview"></div>
            </div>
          </div>
          
          <div class="button-group">
            <button id="convert-to-html">Convert to HTML</button>
            <button id="convert-to-markdown" class="secondary">Convert from HTML</button>
          </div>
        </div>
      </div>
    `;
    
    this.shadowRoot.appendChild(linkElem);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  
  connectedCallback() {
    this.markdownInput = this.shadowRoot.getElementById('markdown-input');
    this.preview = this.shadowRoot.getElementById('preview');
    
    // Set up event listeners
    this.setupToolbar();
    this.setupButtons();
    this.setupSampleData();
    
    // Live preview (debounced)
    let debounceTimeout;
    this.markdownInput.addEventListener('input', () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        this.updatePreview();
      }, 300);
    });
    
    // Initial preview
    this.loadSample('basic');
  }
  
  setupToolbar() {
    const toolbar = this.shadowRoot.querySelectorAll('.toolbar-button');
    
    toolbar.forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        this.insertMarkdown(action);
      });
    });
  }
  
  setupButtons() {
    const convertToHtmlBtn = this.shadowRoot.getElementById('convert-to-html');
    const convertToMarkdownBtn = this.shadowRoot.getElementById('convert-to-markdown');
    const clearBtn = this.shadowRoot.getElementById('clear-markdown');
    const copyHtmlBtn = this.shadowRoot.getElementById('copy-html');
    
    // Convert to HTML button
    convertToHtmlBtn.addEventListener('click', () => {
      this.updatePreview();
      this.showNotification('Converted to HTML');
    });
    
    // Convert from HTML button
    convertToMarkdownBtn.addEventListener('click', () => {
      const html = prompt('Enter HTML to convert to Markdown:', '');
      if (html) {
        this.markdownInput.value = this.htmlToMarkdown(html);
        this.updatePreview();
        this.showNotification('Converted from HTML');
      }
    });
    
    // Clear button
    clearBtn.addEventListener('click', () => {
      this.markdownInput.value = '';
      this.preview.innerHTML = '';
    });
    
    // Copy HTML button
    copyHtmlBtn.addEventListener('click', () => {
      const html = this.preview.innerHTML;
      navigator.clipboard.writeText(html)
        .then(() => {
          this.showNotification('HTML copied to clipboard', 'success');
        })
        .catch(err => {
          console.error('Could not copy HTML: ', err);
        });
    });
  }
  
  setupSampleData() {
    const sampleButtons = this.shadowRoot.querySelectorAll('.sample-button');
    
    sampleButtons.forEach(button => {
      button.addEventListener('click', () => {
        const sample = button.dataset.sample;
        this.loadSample(sample);
      });
    });
  }
  
  loadSample(sample) {
    let markdown = '';
    
    if (sample === 'basic') {
      markdown = `# Markdown Basics

## Formatting

**Bold text** and *italic text* are easy to add.

## Lists

- Item 1
- Item 2
- Item 3

1. First item
2. Second item
3. Third item

## Links and Images

[Visit GitHub](https://github.com)

![Sample Image](https://via.placeholder.com/150)

## Code

Inline \`code\` looks like this.

\`\`\`javascript
// Code block
function hello() {
  console.log("Hello, world!");
}
\`\`\`

## Blockquotes

> This is a blockquote.
> It can span multiple lines.
`;
    } else if (sample === 'advanced') {
      markdown = `# Advanced Markdown Example

## Tables

| Name | Email | Role |
|------|-------|------|
| John | john@example.com | Admin |
| Jane | jane@example.com | Editor |
| Bob | bob@example.com | Viewer |

## Task Lists

- [x] Completed task
- [ ] Incomplete task
- [ ] Another task

## Definition Lists

Term 1
: Definition 1

Term 2
: Definition 2

## Footnotes

Here's a sentence with a footnote. [^1]

[^1]: This is the footnote.

## Strikethrough

~~Strikethrough text~~

## Emoji

:smile: :heart: :thumbsup:

## Subscript and Superscript

H~2~O and E=mc^2^

## Highlighting

==Highlighted text==

## Diagrams (if supported)

\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\`
`;
    }
    
    this.markdownInput.value = markdown;
    this.updatePreview();
  }
  
  insertMarkdown(action) {
    const input = this.markdownInput;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const selectedText = input.value.substring(start, end);
    let replacement = '';
    
    switch (action) {
      case 'heading':
        replacement = `# ${selectedText || 'Heading'}`;
        break;
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        break;
      case 'link':
        replacement = `[${selectedText || 'link text'}](https://example.com)`;
        break;
      case 'image':
        replacement = `![${selectedText || 'alt text'}](https://example.com/image.jpg)`;
        break;
      case 'code':
        replacement = selectedText.includes('\n') 
          ? `\`\`\`\n${selectedText || 'code block'}\n\`\`\``
          : `\`${selectedText || 'inline code'}\``;
        break;
      case 'list':
        replacement = `- ${selectedText || 'List item'}`;
        break;
      case 'quote':
        replacement = `> ${selectedText || 'Blockquote'}`;
        break;
      case 'hr':
        replacement = `\n---\n`;
        break;
    }
    
    input.value = input.value.substring(0, start) + replacement + input.value.substring(end);
    input.focus();
    input.selectionStart = start + replacement.length;
    input.selectionEnd = start + replacement.length;
    
    // Update preview
    this.updatePreview();
  }
  
  updatePreview() {
    const markdown = this.markdownInput.value;
    const html = this.markdownToHtml(markdown);
    this.preview.innerHTML = html;
  }
  
  markdownToHtml(markdown) {
    // This is a simple implementation
    // For a real app, you'd use a library like marked.js
    
    let html = markdown;
    
    // Headers
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
    html = html.replace(/^##### (.*$)/gm, '<h5>$1</h5>');
    html = html.replace(/^###### (.*$)/gm, '<h6>$1</h6>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // Images
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2">');
    
    // Code blocks
    html = html.replace(/```(.*?)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Unordered lists
    html = html.replace(/^\s*-\s*(.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n)+/g, '<ul>$&</ul>');
    
    // Ordered lists
    html = html.replace(/^\s*\d+\.\s*(.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n)+/g, '<ol>$&</ol>');
    
    // Blockquotes
    html = html.replace(/^\s*>\s*(.*$)/gm, '<blockquote>$1</blockquote>');
    
    // Horizontal rule
    html = html.replace(/^\s*---\s*$/gm, '<hr>');
    
    // Paragraphs
    html = html.replace(/^([^<].*)\n$/gm, '<p>$1</p>');
    
    // Tables
    html = html.replace(/^\|(.*)\|$/gm, '<tr><td>$1</td></tr>');
    html = html.replace(/<td>(.*)\|/g, '<td>$1</td><td>');
    html = html.replace(/(<tr>.*<\/tr>\n)+/g, '<table>$&</table>');
    
    return html;
  }
  
  htmlToMarkdown(html) {
    // This is a simple implementation
    // For a real app, you'd use a library like turndown.js
    
    let markdown = html;
    
    // Headers
    markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, '# $1\n');
    markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, '## $1\n');
    markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, '### $1\n');
    markdown = markdown.replace(/<h4>(.*?)<\/h4>/g, '#### $1\n');
    markdown = markdown.replace(/<h5>(.*?)<\/h5>/g, '##### $1\n');
    markdown = markdown.replace(/<h6>(.*?)<\/h6>/g, '###### $1\n');
    
    // Bold
    markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
    markdown = markdown.replace(/<b>(.*?)<\/b>/g, '**$1**');
    
    // Italic
    markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*');
    markdown = markdown.replace(/<i>(.*?)<\/i>/g, '*$1*');
    
    // Links
    markdown = markdown.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)');
    
    // Images
    markdown = markdown.replace(/<img alt="(.*?)" src="(.*?)">/g, '![$1]($2)');
    
    // Code blocks
    markdown = markdown.replace(/<pre><code.*?>([\s\S]*?)<\/code><\/pre>/g, '```\n$1\n```');
    
    // Inline code
    markdown = markdown.replace(/<code>(.*?)<\/code>/g, '`$1`');
    
    // Lists
    markdown = markdown.replace(/<ul>([\s\S]*?)<\/ul>/g, (match, p1) => {
      return p1.replace(/<li>(.*?)<\/li>/g, '- $1\n');
    });
    
    markdown = markdown.replace(/<ol>([\s\S]*?)<\/ol>/g, (match, p1) => {
      let index = 1;
      return p1.replace(/<li>(.*?)<\/li>/g, () => {
        return `${index++}. $1\n`;
      });
    });
    
    // Blockquotes
    markdown = markdown.replace(/<blockquote>(.*?)<\/blockquote>/g, '> $1\n');
    
    // Horizontal rule
    markdown = markdown.replace(/<hr>/g, '---\n');
    
    // Paragraphs
    markdown = markdown.replace(/<p>(.*?)<\/p>/g, '$1\n\n');
    
    // Clean up
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    
    return markdown;
  }
  
  showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = this.shadowRoot.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type === 'success' ? 'success' : ''}`;
    notification.textContent = message;
    
    this.shadowRoot.appendChild(notification);
    
    // Show notification
    requestAnimationFrame(() => {
      notification.classList.add('show');
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        notification.classList.remove('show');
        
        // Remove notification after animation
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 3000);
    });
  }
}

customElements.define('tool-markdown', ToolMarkdown);
