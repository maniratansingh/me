---
title: "ESP8266 Smart LED Matrix Clock"
description: "An feature-rich smart clock built on the ESP8266 utilizing a MAX7219 LED matrix, weather integrations, NTP time sync, and a Web Dashboard."
section: github
---

## Philosophy & Architecture Decisions
Home appliances should be autonomous and zero-maintenance. Standard battery-operated quartz clocks drift over time and require manual adjustments for DST changes. This smart clock uses the ESP8266 platform to connect to local network gateways, querying global NTP servers to guarantee absolute precision. Additionally, it integrates a weather update engine and a local web server to serve as an interactive smart dashboard.

## Features
- **Accurate Clock**: NTP time synchronization (configured for IST UTC+5:30) with custom 3x5 font and seconds animation.
- **Weather Updates**: Connects to the Open-Meteo API for real-time temperature, humidity, wind speed, and smart weather advisories.
- **Web Dashboard**: Modern mobile-responsive interface to check system status, queue scrolling text messages, toggle screen orientation, and test events.
- **Smart Scrolling Engine**: Smooth horizontal text transitions across a 4-unit matrix.
- **Holiday & Birthday Greetings**: Automatic greetings on designated calendar dates.

## Pin Mapping (ESP8266 NodeMCU to MAX7219)

| ESP8266 Pin | MAX7219 Pin | Notes |
|---|---|---|
| 3V3 / 5V | VCC | 5V recommended for full brightness |
| GND | GND | Common Ground |
| D7 (GPIO13) | DIN | Data In |
| D5 (GPIO14) | CLK | Clock |
| D2 (GPIO4) | CS / LOAD | Chip Select |

## Installation & Software Stack
- **IDE Platform:** Arduino IDE (ESP8266 Core).
- **Core Library:** `MD_MAX72XX` and `MD_Parola` for text rendering and hardware matrix control.
- **Configuration:** Update Wi-Fi SSID/password directly in `wificlock.ino` and set the hardware layout type (e.g. `FC16_HW`).

## Code Link
- [View wificlock repository on GitHub](https://github.com/maniratansingh/wificlock) ↗

---
← [Back to GitHub Projects](/github/)
