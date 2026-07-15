# GitHub Import & Synchronization Instructions

This document explains how to import raw Markdown documentation and READMEs directly from your GitHub repositories into this personal website structure, and how to handle assets or sections that do not render properly.

---

## 1. Automated Sync Script

You can use the following automated Python script to fetch, sanitize, and update the project description pages directly from your GitHub profile. This script automatically handles Pandoc compatibility by replacing intermediate `---` dividers with `***` horizontal rules, ensuring no YAML parsing errors occur.

Save the code below as `update_projects.py` in the root of your project:

```python
import urllib.request
import re

# List of repositories to sync from https://github.com/maniratansingh/
repos = {
    "ayodhya-phaco-center": {
        "branch": "master",
        "title": "Ayodhya Phaco Center Website",
        "desc": "Official static website repository for the Ayodhya Phaco Center clinic."
    },
    "jellyfin-liquid-glass": {
        "branch": "main",
        "title": "Jellyfin Liquid Glass Theme",
        "desc": "A modern glassmorphism custom stylesheet for Jellyfin web client."
    },
    "law-exam-batch-processor": {
        "branch": "main",
        "title": "Law Exam Batch Processor",
        "desc": "A self-hosted legal-tech pipeline utilizing Flask, Ollama, and SearXNG."
    },
    "rp2040-oled-macropad": {
        "branch": "main",
        "title": "RP2040 OLED Macro Pad (Wi-Fi Edition)",
        "desc": "A 16-key USB macro pad built with CircuitPython, OLED, and Wi-Fi."
    },
    "wificlock": {
        "branch": "master",
        "title": "ESP8266 Smart LED Matrix Clock",
        "desc": "An ESP8266 smart clock utilizing a MAX7219 LED matrix, weather, and NTP sync."
    }
}

for repo, info in repos.items():
    url = f"https://raw.githubusercontent.com/maniratansingh/{repo}/{info['branch']}/README.md"
    print(f"Fetching {url}...")
    try:
        with urllib.request.urlopen(url) as response:
            content = response.read().decode('utf-8')
        
        # Clean carriage returns
        sanitized_content = content.replace('\r\n', '\n')
        
        # Replace standalone "---" dividers with "***" to prevent Pandoc from choking on nested YAML blocks
        sanitized_content = re.sub(r'\n---\n', '\n***\n', sanitized_content)
        
        # Prepend site frontmatter metadata
        frontmatter = f"---\ntitle: \"{info['title']}\"\ndescription: \"{info['desc']}\"\nsection: github\n---\n\n"
        footer = "\n\n***\n← [Back to GitHub Projects](/github/)\n"
        
        dest_path = f"content/github/{repo}.md"
        with open(dest_path, "w", encoding="utf-8") as f:
            f.write(frontmatter + sanitized_content + footer)
        print(f"Successfully sync'd: {dest_path}")
    except Exception as e:
        print(f"Failed to sync {repo}: {e}")
```

Run the script locally:
```bash
python3 update_projects.py
```

---

## 2. Resolving Rendering Obstructions

When importing raw Markdown files from GitHub, certain elements might fail to render or block the compiler. Use the following guides to handle them:

### A. Broken Image Links
* **The Problem:** Relative image references (e.g. `![diagram](docs/wiring-diagram.svg)`) will break because the `docs/` folder does not exist inside this repository.
* **The Solution:** 
  1. Simply leave the broken images alone if you do not need them displayed locally, OR
  2. Change them to absolute URLs pointing directly to the raw file on GitHub:
     `https://raw.githubusercontent.com/maniratansingh/[repo-name]/[branch]/[path-to-image]`
     *Example:* `https://raw.githubusercontent.com/maniratansingh/rp2040-oled-macropad/main/docs/wiring-diagram.svg`

### B. Mermaid Diagrams
* **The Problem:** Fenced code blocks with `mermaid` tags (like the circuit diagrams in `wificlock` and `law-exam-batch-processor`) require client-side JavaScript libraries to render. Without JS, they render as raw text boxes.
* **The Solution:** Leave them as-is. They will display as clean, legible text-based charts, preserving the pure static HTML profile of this website.

### C. Pandoc YAML Parsing Errors (Line Snapping / Truncation)
* **The Problem:** Standalone triple dashes (`---`) indicate horizontal lines in standard markdown, but Pandoc treats subsequent text as a metadata header block. If it contains symbols like `:` or `*`, the build fails.
* **The Solution:** The python sync script automatically converts standalone `---` lines to `***`. If editing manually, always use `***` or `___` for horizontal rules instead of `---`.
