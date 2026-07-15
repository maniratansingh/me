---
title: "RP2040 OLED Macropad"
description: "A hardware macropad powered by RP2040 running CircuitPython, featuring layer customization and real-time OLED status."
section: github
---

## Philosophy & Architecture Decisions
Input devices should be modular, fast, and customizable without requiring a complete firmware compilation cycle. While QMK/VIA (C-based) is the industry standard for custom keyboards, choosing CircuitPython for the RP2040 allows the device to mount as a standard USB mass storage drive. Keymaps can be updated on the fly by editing a simple Python text file, removing the need for a complex toolchain setup.

## Technical Details
- **Controller:** RP2040 (dual ARM Cortex-M0+ @ 133MHz, 264KB SRAM).
- **Display:** 128x64 SSD1306 OLED screen driven via I2C (`Adafruit_SSD1306` library) to display active macros, layer state, and system feedback.
- **Input Handling:** Mechanical switches utilizing the controller's internal pull-up resistors. Software-based debouncing is managed through an asynchronous event loop (`asyncio`) to ensure zero lag and prevent CPU blocking.
- **USB Interface:** Configured via CircuitPython's `usb_hid` module to present itself to the host OS as a native keyboard/media controller interface.

## Code Link
- [View rp2040-oled-macropad on GitHub](https://github.com/maniratansingh/rp2040-oled-macropad) ↗

---
← [Back to GitHub Projects](/github/)
