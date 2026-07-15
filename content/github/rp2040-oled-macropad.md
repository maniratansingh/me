---
title: "RP2040 OLED Macro Pad (Wi-Fi Edition)"
description: "A 16-key USB macro pad built with CircuitPython, a 128x64 SSD1306 OLED, a rotary encoder, and an embedded Wi-Fi Web Server."
section: github
---

## Philosophy & Architecture Decisions
Input devices should be modular, fast, and customizable without requiring a complete firmware compilation cycle. While QMK/VIA (C-based) is the industry standard for custom keyboards, choosing CircuitPython for the RP2040 allows the device to mount as a standard USB mass storage drive. Keymaps can be updated on the fly by editing a simple Python text file, removing the need for a complex toolchain setup. This project is built around the Pico W and is optimized for macOS shortcuts, media controls, and remote web control.

## Features
- **16 dedicated macro keys** wired in a 4x4 matrix layout.
- **Rotary encoder** with two operating modes:
  - Volume control (sends media volume up/down commands).
  - Scroll mode (holds arrow keys briefly for smooth scrolling).
- **OLED status screen** showing:
  - Current volume percentage and progress bar.
  - Last action label.
  - Active Wi-Fi IP address.
- **Wi-Fi Web UI**: Control your MacroPad remotely from any smartphone or browser on your local network. It syncs live with the physical pad, updating actions and volume dynamically using AJAX polling.
- **Power Savings**: Automatic OLED sleep after 30 seconds of inactivity to prevent burn-in, with instant wake-on-input behavior.

## Pin Mapping

| Function | Pin |
| --- | --- |
| OLED SDA | `GP0` |
| OLED SCL | `GP1` |
| Keypad rows (R1-R4) | `GP2`, `GP3`, `GP4`, `GP5` |
| Keypad columns (C1-C4) | `GP6`, `GP7`, `GP8`, `GP9` |
| Rotary encoder A / B | `GP14` / `GP15` |

## Software Stack
- **Firmware:** CircuitPython on the Raspberry Pi Pico W.
- **External libraries required in `CIRCUITPY/lib`:** `adafruit_hid/`, `adafruit_ssd1306.mpy`, `adafruit_bus_device/`, and `adafruit_framebuf.mpy`.

## Code Link
- [View rp2040-oled-macropad on GitHub](https://github.com/maniratansingh/rp2040-oled-macropad) ↗

---
← [Back to GitHub Projects](/github/)
