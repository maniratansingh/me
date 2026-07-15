---
title: "WiFi Clock"
description: "A network-synchronized digital clock using ESP8266/ESP32 and NTP servers."
section: github
---

## Philosophy & Architecture Decisions
Home appliances should be autonomous and zero-maintenance. Standard battery-operated quartz clocks drift over time and require manual adjustments for Daylight Saving Time (DST) changes. This firmware utilizes low-cost ESP8266 or ESP32 microcontrollers to connect to local network gateways, querying global NTP (Network Time Protocol) servers to guarantee absolute precision. 

## Technical Details
- **Microcontroller:** ESP8266 / ESP32 running on the Arduino framework.
- **Display Driver:** Built to control MAX7219 8x8 LED matrices or TM1637 segment displays using hardware SPI/GPIO configurations.
- **Network Provisioning:** Implements the `WiFiManager` library. If connection to the last-saved access point fails, the device automatically spins up a captive portal AP, allowing credentials to be updated from a phone browser without rewriting firmware.
- **Time Sync Logic:** Fetches NTP time packets on boot and updates the system time using local millisecond timers. Synchronizes with network time hourly to prevent local clock drift.

## Code Link
- [View wificlock repository on GitHub](https://github.com/maniratansingh/wificlock) ↗

---
← [Back to GitHub Projects](/github/)
