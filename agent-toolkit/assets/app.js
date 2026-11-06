// MRPS Agent Toolkit — Minimal Client Script
// Handles prompt copy & snippet copy with zero external dependencies.

(function () {
  'use strict';

  function initApp() {
    const copyPromptBtn = document.getElementById('copy-prompt-btn');

    if (copyPromptBtn) {
      copyPromptBtn.addEventListener('click', async function () {
        const textToCopy = `MRPS Agent Toolkit — Setup Instructions

Read the MRPS public agent instructions before performing the requested development task:
https://mrps.in/agent-toolkit/AGENTS.md

Read the capability index:
https://mrps.in/agent-toolkit/index.json

Follow the relevant tool-specific instructions, verify installation and compatibility,
and use the original upstream tools. Respect all inspection, reporting and
modification permissions. Do not modify files when the user only requests
inspection or reporting. Preserve upstream attribution and licences.`;

        let success = false;
        if (navigator.clipboard && window.isSecureContext) {
          try {
            await navigator.clipboard.writeText(textToCopy);
            success = true;
          } catch (err) {
            success = false;
          }
        }

        if (!success) {
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            success = document.execCommand('copy');
          } catch (e) {
            success = false;
          }
          document.body.removeChild(textArea);
        }

        const originalText = copyPromptBtn.getAttribute('data-original-text') || copyPromptBtn.textContent;
        copyPromptBtn.setAttribute('data-original-text', originalText);

        if (success) {
          copyPromptBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyPromptBtn.textContent = originalText;
          }, 2000);
        } else {
          copyPromptBtn.textContent = 'Copy failed';
          setTimeout(() => {
            copyPromptBtn.textContent = originalText;
          }, 2000);
        }
      });
    }

    // Asset copy buttons (AGENTS.md, index.json, llms.txt)
    document.querySelectorAll('.copy-asset-btn').forEach(btn => {
      btn.addEventListener('click', async function () {
        const targetId = btn.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;
        const text = targetEl.value || targetEl.textContent;

        let success = false;
        if (navigator.clipboard && window.isSecureContext) {
          try {
            await navigator.clipboard.writeText(text);
            success = true;
          } catch (e) {
            success = false;
          }
        }

        if (!success) {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.left = '-999999px';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          try {
            success = document.execCommand('copy');
          } catch (err) {}
          document.body.removeChild(ta);
        }

        const orig = btn.textContent;
        btn.textContent = success ? 'Copied!' : 'Copy failed';
        setTimeout(() => {
          btn.textContent = orig;
        }, 2000);
      });
    });

    document.querySelectorAll('.copy-snippet-btn').forEach(btn => {
      btn.addEventListener('click', async function () {
        const targetId = btn.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;
        const text = targetEl.textContent.trim();

        if (navigator.clipboard) {
          await navigator.clipboard.writeText(text);
          const orig = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = orig; }, 1800);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
