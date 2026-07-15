---
title: "WiFi Clock"
description: "A network-synchronized digital clock using ESP8266/ESP32 and NTP servers."
section: github
---

## Objective & Design Thoughts
A clean, drift-free hardware digital clock that synchronizes automatically with global NTP (Network Time Protocol) servers over WiFi. 

Written in C++ (Arduino framework) to leverage lightweight hardware drivers for MAX7219 led matrices or custom display drivers. 

## Production Status
- **Hardware:** ESP8266 or ESP32 chip + Display hardware (seven-segment / LED matrix).
- **Firmware:** C++ codebase utilizing WiFiManager for easy wireless network provisioning.

## Code Link
- [View wificlock repository on GitHub](https://github.com/maniratansingh/wificlock) ↗

---
← [Back to GitHub Projects](/github/)
