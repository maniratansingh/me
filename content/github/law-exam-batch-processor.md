---
title: "Law Exam Batch Processor"
description: "A self-hosted legal-tech pipeline utilizing Flask, Ollama, and SearXNG to batch parse questions, run local inference, and export PDFs."
section: github
---

## Philosophy & Architecture Decisions
Automating legal exam compilation and revision processes requires data integrity and confidentiality. Cloud-based LLM APIs share data and present data privacy concerns. This legal-tech batch processor operates entirely offline. It uses a self-hosted Flask server, local language models (Ollama), and a private search engine instance (SearXNG) to process datasets securely.

## Features
- **Privacy First:** Works entirely offline; no external cloud API dependencies.
- **Batch Processing:** Handles multiple legal questions concurrently.
- **Local RAG Integration:** Searches legal material via SearXNG and reasons locally using Ollama.
- **Structured Outputs:** Compiles final notes and answers to PDF using Pandoc and wkhtmltopdf.

## System Requirements
- **OS:** Linux (recommended) or macOS.
- **Hardware:** Python 3.10+ runtime, minimum 8GB RAM (16GB recommended).
- **Core Dependencies:** Flask, requests, ollama (running `gemma3:4b` locally), pandoc, wkhtmltopdf, and SearXNG.

## API Architecture

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/exam` | POST | Submit batch questions |
| `/progress/<task_id>` | GET | Poll processing progress |
| `/download/pdf/<name>` | GET | Download final PDF |

## Installation Summary
1. Set up a virtual environment and install standard Python requirements:
   ```bash
   pip install flask requests ollama
   ```
2. Pull the model locally:
   ```bash
   ollama pull gemma3:4b
   ```
3. Run SearXNG via Docker, configure base search endpoints, and start `app.py`.

## Code Link
- [View law-exam-batch-processor on GitHub](https://github.com/maniratansingh/law-exam-batch-processor) ↗

---
← [Back to GitHub Projects](/github/)
