---
title: "RP2040 OLED Macro Pad (Wi-Fi Edition)"
description: "A comprehensive, 16-key hardware USB and Wi-Fi macro pad powered by CircuitPython on the Raspberry Pi Pico W, featuring real-time SSD1306 display tracking, rotary encoder multi-modes, and local AJAX web control."
section: github
---

## Objective & Design Philosophy
This project provides a hardware productivity console tuned for macOS workflows, media controls, and remote automation. Standard keyboard microcontrollers rely on static layout maps compiled directly into the binary. If you need to change a shortcut, you must reinstall toolchains and re-flash the firmware. 

By designing this layout around **CircuitPython** running on the dual-core **RP2040**, the controller operates as a standard USB Mass Storage device. Key mappings are read dynamically from a plain-text configuration file (`code.py`). Updates are made by editing the file directly, saving it, and letting the micro-controller auto-reload in real-time.

---

## Detailed Hardware Breakdown & Component Usage

### 1. Controller: Raspberry Pi Pico W
- **Core Processor:** Dual ARM Cortex-M0+ running at 133 MHz with 264 KB of on-chip SRAM.
- **Role:** Handles physical matrix scanning, manages USB HID device descriptors, drives the I2C display, decodes rotary encoder pulses, and hosts a local HTTP server in a background thread to handle remote API requests.
- **Wi-Fi Connectivity:** Utilizes the on-board Infineon CYW43439 chip supporting 802.11 b/g/n networks, enabling local network integration.

### 2. Display: SSD1306 128x64 OLED
- **Specifications:** 0.96-inch monochrome display driven over I2C interfaces.
- **Role:** Displays active keyboard layers, system volume indicators, progress trackers, the last executed macro, and the local IP address for the Web UI.
- **Power Management:** Includes an integrated sleep timer. If no user inputs are received for 30 seconds, the display turns off to prevent screen burn-in. It wakes up instantly on the next button press or encoder rotation.

### 3. Navigation: EC11 Rotary Encoder
- **Specifications:** 20-detent mechanical encoder with integrated push switch.
- **Role:** Provides analog-style control. Supports two modes toggled by pressing the encoder switch:
  1. **Volume Mode:** Sends native USB consumer control volume keys.
  2. **Scroll Mode:** Emulates mouse wheel movements or arrow keys to allow smooth scrolling through files and documents.

### 4. Input Matrix: 16 Mechanical Keyswitches
- **Layout:** Standard keyswitches wired in a 4x4 matrix configuration to scan 16 distinct keys using only 8 GPIO pins.
- **Switches:** Compatibility with standard Cherry MX-style mechanical switches.

---

## Electrical Pin Configuration & Wiring

The controller routes signals via designated GPIO pins using internal pull-up and pull-down resistors:

| Peripheral / Interface | Pin | GPIO Designation | Electrical Purpose |
|---|---|---|---|
| **OLED SDA** | Pin 1 | `GP0` | I2C Serial Data line (pulled high) |
| **OLED SCL** | Pin 2 | `GP1` | I2C Serial Clock line |
| **Keypad Row 1** | Pin 4 | `GP2` | Row 1 Matrix Output Scan line |
| **Keypad Row 2** | Pin 5 | `GP3` | Row 2 Matrix Output Scan line |
| **Keypad Row 3** | Pin 6 | `GP4` | Row 3 Matrix Output Scan line |
| **Keypad Row 4** | Pin 7 | `GP5` | Row 4 Matrix Output Scan line |
| **Keypad Column 1** | Pin 9 | `GP6` | Column 1 Input Read line |
| **Keypad Column 2** | Pin 10 | `GP7` | Column 2 Input Read line |
| **Keypad Column 3** | Pin 11 | `GP8` | Column 3 Input Read line |
| **Keypad Column 4** | Pin 12 | `GP9` | Column 4 Input Read line |
| **Rotary Encoder A** | Pin 19 | `GP14` | Phase A pulse signal for rotation parsing |
| **Rotary Encoder B** | Pin 20 | `GP15` | Phase B pulse signal for direction parsing |

---

## Operational Workflows & System Architecture

### Physical Keypad Scanning
The 4x4 keypad matrix is scanned sequentially. The row pins are set as outputs and driven low one at a time. The column pins are set as inputs with internal pull-up resistors enabled. When a key is pressed, it pulls the corresponding column pin low, closing the circuit. An asynchronous state loop checks for column transitions, debounces inputs over a 5ms window, and maps the matching row-column intersection to a keyboard macro.

### Asynchronous Dual-Control Loop
The system executes a dual-responsibility framework:
1. **USB HID Interface:** Emulates a standard keyboard and consumer control device. When physical keys are triggered, the controller immediately writes raw USB report packets to the host OS. This guarantees sub-millisecond input response times.
2. **Wi-Fi Web UI & HTTP Server:** The Pico W connects to the network gateway during boot. It initializes a local socket server on port 80. When a browser visits the IP address, the board serves a single-page HTML utility. Users can click virtual buttons on their phone or computer, which issues AJAX `GET` requests to the Pico. The HTTP server parses these requests and executes the corresponding macro action.

---

## Default Keyboard Action Mapping

| Row / Col | Action Name | USB HID Keys Sent | Operating System Behavior |
|---|---|---|---|
| **R1-C1** | Previous Track | Consumer Key: `SCAN_PREVIOUS` | Media player skips backward |
| **R1-C2** | Play/Pause | Consumer Key: `PLAY_PAUSE` | Toggles media playback state |
| **R1-C3** | Next Track | Consumer Key: `SCAN_NEXT` | Media player skips forward |
| **R1-C4** | Mute | Consumer Key: `MUTE` | Mutes system audio output |
| **R2-C1** | Space Right | `Control + Right Arrow` | Switches virtual desktop spaces to the right |
| **R2-C2** | Quit App | `GUI + Q` | Closes active application window |
| **R2-C3** | Dictation | Double tap `Control` | Launches macOS native dictation engine |
| **R2-C4** | Encoder Toggle | Intercepted in Software | Switches rotary encoder modes |
| **R3-C1** | Screen Snip | `GUI + Shift + 4` | Launches screenshot marquee tool |
| **R3-C2** | Copy | `GUI + C` | Copies selection to clipboard |
| **R3-C3** | Paste | `GUI + V` | Pastes selection from clipboard |
| **R3-C4** | Undo | `GUI + Z` | Reverts the last action |
| **R4-C1** | Switch Tabs | `Control + Tab` | Cycles through open browser tabs |
| **R4-C2** | Zoom In | `GUI + Keyboard Equals` | Magnifies window UI scale |
| **R4-C3** | Zoom Out | `GUI + Keyboard Minus` | Shrinks window UI scale |
| **R4-C4** | Show Desktop | `Keyboard F11` | Hides windows to show desktop space |

---

## Software Configuration & Setup Guide
1. **Firmware Installation:** Flash CircuitPython onto the Pico W.
2. **Library Management:** Copy the libraries (`adafruit_hid`, `adafruit_ssd1306`, `adafruit_bus_device`, and `adafruit_framebuf`) from the Adafruit library bundle into the device's `/lib` directory.
3. **Secrets Setup:** Set Wi-Fi credentials in `code.py` under the variables `WIFI_SSID` and `WIFI_PASS`. On boot, the Pico W displays its assigned IP address on the OLED.

## Code Link
- [View rp2040-oled-macropad on GitHub](https://github.com/maniratansingh/rp2040-oled-macropad) ↗

---
← [Back to GitHub Projects](/github/)
