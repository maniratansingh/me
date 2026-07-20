import os
import re
from datetime import datetime

CONTENT_DIR = "content"
OUTPUT_DIR = "site"
STATIC_DIR = "static"

def parse_frontmatter(file_path):
    title, desc, date = "", "", ""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        # Find YAML block
        match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
        if match:
            yaml_content = match.group(1)
            for line in yaml_content.splitlines():
                if line.startswith("title:"):
                    title = line.split(":", 1)[1].strip().strip('"').strip("'")
                elif line.startswith("description:"):
                    desc = line.split(":", 1)[1].strip().strip('"').strip("'")
                elif line.startswith("date:"):
                    date = line.split(":", 1)[1].strip().strip('"').strip("'")
    except Exception as e:
        print(f"Error parsing frontmatter for {file_path}: {e}")
    return title, desc, date

def main():
    # ── 1. Gather Projects ───────────────────────────────────────────────────
    projects = []
    projects_dir = os.path.join(CONTENT_DIR, "projects")
    if os.path.exists(projects_dir):
        for entry in os.listdir(projects_dir):
            if entry.endswith(".md") and entry != "index.md":
                slug = entry[:-3]
                path = os.path.join(projects_dir, entry)
                title, desc, _ = parse_frontmatter(path)
                if title:
                    projects.append({
                        "title": title,
                        "desc": desc,
                        "url": f"/projects/{slug}/"
                    })
    # Sort projects alphabetically by title
    projects.sort(key=lambda x: x["title"].lower())

    # ── 2. Gather Blog Posts ─────────────────────────────────────────────────
    posts = []
    blog_dir = os.path.join(CONTENT_DIR, "blog")
    if os.path.exists(blog_dir):
        for entry in os.listdir(blog_dir):
            if entry.endswith(".md") and entry != "index.md":
                slug = entry[:-3]
                path = os.path.join(blog_dir, entry)
                title, desc, date = parse_frontmatter(path)
                if title:
                    posts.append({
                        "title": title,
                        "desc": desc,
                        "date": date or "2026-07-17",
                        "url": f"/blog/{slug}/"
                    })
    # Sort posts chronologically (newest first)
    posts.sort(key=lambda x: x["date"], reverse=True)

    # ── 3. Generate llms.txt ────────────────────────────────────────────────
    llm_content = """# Mani Ratan Singh

> Personal directory, digital archive, and engineering notebook of Mani Ratan Singh.

## About

I am a tech generalist and photographer based in India. I build hardware controllers, manage homelab configurations, and document my thoughts and work.

## Projects

"""
    for p in projects:
        llm_content += f"- [{p['title']}]({p['url']}): {p['desc']}\n"

    llm_content += "\n## Blog Posts\n\n"
    for p in posts:
        llm_content += f"- [{p['title']}]({p['url']}): {p['desc']}\n"

    # Write llms.txt
    for dest in [os.path.join(STATIC_DIR, "llms.txt"), os.path.join(OUTPUT_DIR, "llms.txt")]:
        with open(dest, "w", encoding="utf-8") as f:
            f.write(llm_content)
    print("✓ Generated llms.txt successfully.")

    # ── 4. Generate sitemap.xml ─────────────────────────────────────────────
    today = datetime.today().strftime('%Y-%m-%d')
    sitemap_urls = [
        {"loc": "https://mrps.in/", "priority": "1.0", "changefreq": "daily"},
        {"loc": "https://mrps.in/blog/", "priority": "0.8", "changefreq": "daily"},
        {"loc": "https://mrps.in/projects/", "priority": "0.8", "changefreq": "daily"},
        {"loc": "https://mrps.in/photos/", "priority": "0.7", "changefreq": "weekly"}
    ]

    for p in projects:
        sitemap_urls.append({
            "loc": f"https://mrps.in{p['url']}",
            "priority": "0.7",
            "changefreq": "monthly"
        })

    for p in posts:
        sitemap_urls.append({
            "loc": f"https://mrps.in{p['url']}",
            "priority": "0.7",
            "changefreq": "monthly"
        })

    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for u in sitemap_urls:
        xml_content += '  <url>\n'
        xml_content += f'    <loc>{u["loc"]}</loc>\n'
        xml_content += f'    <lastmod>{today}</lastmod>\n'
        xml_content += f'    <changefreq>{u["changefreq"]}</changefreq>\n'
        xml_content += f'    <priority>{u["priority"]}</priority>\n'
        xml_content += '  </url>\n'
    xml_content += '</urlset>\n'

    # Write sitemap.xml
    for dest in [os.path.join(STATIC_DIR, "sitemap.xml"), os.path.join(OUTPUT_DIR, "sitemap.xml")]:
        with open(dest, "w", encoding="utf-8") as f:
            f.write(xml_content)
    print("✓ Generated sitemap.xml successfully.")

if __name__ == "__main__":
    main()
