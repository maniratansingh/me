---
title: "Simplifying the Water Tank Level Monitor: From Complex Frameworks to a Barebones ESP8266 Setup"
description: "How I took a complex, multi-file water monitoring project and stripped it down to a single-file ESP8266 WebSocket implementation."
date: 2026-07-17
tags: [esp8266, hardware, automation]
section: blog
parent_link: "/blog/"
parent_text: "Posts"
---

When I set out to build a real-time water tank level monitor for my home, I wanted a solution that was responsive, looked premium, and didn't rely on external cloud platforms like Tuya or Blynk. 

During my research, I found [TankSync](https://github.com/Techposts/TankSync) by [@Techposts](https://github.com/Techposts). It is a gorgeous, production-grade system supporting multiple tanks, database history, automated alerts, and OTA updates. However, for a quick weekend hack, the architecture was complex—requiring multi-file partitions, compilation of web assets, and flashing a dedicated filesystem (SPIFFS/LittleFS) to the ESP8266.

I wanted to understand the core mechanics of WebSockets, ultrasonic distance calculation, and noise filtering on microcontrollers. So, I set a challenge: **strip the entire project down to a single `.ino` file that requires zero filesystem uploads.**

Here is how I took the concepts from TankSync and simplified them into [water-tank](https://github.com/maniratansingh/water-tank).

---

## The Barebones Philosophy: One File, Flash, and Play

The original TankSync splits its responsibilities across various assets:
- **C++ Firmware:** Handles sensor math and WebSocket triggers.
- **Web files (HTML/CSS/JS):** Stored in a separate filesystem partition on the chip.

To make my version as frictionless as possible, I condensed everything into a single source file: **`tank.ino`**. 

To run it, all you have to do is:
1. Open the file in the Arduino IDE.
2. Edit your Wi-Fi credentials at the top of the script.
3. Select your ESP8266 board and click **Upload**.

No SPIFFS formatting tools, no Node.js build pipelines for frontend assets, and no complex configuration steps.

---

## Key Simplification Techniques

To shrink the footprint of the project while maintaining a highly responsive real-time web dashboard, I utilized several core design choices:

### 1. Web Assets in Flash (`PROGMEM`)
The ESP8266 has only about 80 KB of usable RAM (Heap). Loading a modern web dashboard with CSS styling and interactive JavaScript into RAM would immediately crash the chip.

To solve this, I stored all frontend web assets directly in the chip's 4 MB Flash memory using the `PROGMEM` keyword. By using the `send_P` method provided by `ESPAsyncWebServer`, the files are streamed directly from Flash memory to the network socket, consuming exactly **0 bytes** of runtime RAM:

```cpp
// Stored in FLASH — costs 0 RAM:
const char index_html[] PROGMEM = R"rawliteral(
  <!DOCTYPE html>
  <html>
    ... entire HTML, CSS styles, and JS dashboard code ...
  </html>
)rawliteral";

// Streamed from flash to browser:
request->send_P(200, "text/html", index_html);
```

### 2. Live WebSockets Over Restless Polling
Instead of making the browser continuously fetch HTTP endpoints every second (which stresses the single-threaded ESP8266 processor), the firmware opens a persistent **WebSocket** connection at `ws://<device-ip>/ws`.

Data flows smoothly:
- **Server ➔ Browser:** The ESP8266 serializes the sensor levels into a clean JSON packet and pushes it to all connected browsers automatically every 5 seconds.
- **Browser ➔ Server:** When you adjust calibration values, the browser sends a JSON settings update packet back over the socket. The ESP8266 saves these values and updates the dashboard instantly.

### 3. Noise Filtering (IQR Median Algorithm)
Ultrasonic sensors like the waterproof **JSN-SR04M** are prone to noise from tank wall reflections, humidity, and electrical hums. 

Rather than importing a heavy mathematical library, I implemented a lightweight **Interquartile Range (IQR) Filter** combined with a **Median Calculation** directly in the sketch:
1. Fire the trigger pin **5 times** to collect a sample window.
2. Filter out outliers outside the interquartile fences (values that represent single-bounce reflection spikes).
3. Find the median of the remaining valid samples.

This gives a smooth, bounce-free reading that accurately tracks the water level without lag.

```cpp
// Sort helper for finding the median
void sort_floats(float a[], int size) {
  for (int i = 1; i < size; ++i) {
    float temp = a[i];
    int j = i - 1;
    while (j >= 0 && a[j] > temp) {
      a[i] = a[j];
      --j;
    }
    a[j + 1] = temp;
  }
}
```

### 4. Dynamic In-Browser Calibration
In many basic microcontroller projects, if you want to change variables like tank depth or capacity, you have to edit the source code and reflash the chip over USB.

I built a lightweight calibration system using the dashboard UI. By clicking the **⚙️ Settings** icon in your browser, you can adjust:
- **Empty Distance:** Distance from sensor to the bottom when empty.
- **Full Distance:** Distance from sensor to water surface when full.
- **Tank Capacity:** Volume in Litres.

These values are sent back over WebSocket, stored in variables, and immediately applied to level calculations without requiring a single code re-compilation.

---

## Summary of Differences

| Feature | TankSync (Original) | water-tank (Simplified) |
|---|---|---|
| **File Count** | Multiple directories & files | **1 single `.ino` file** |
| **Asset Storage** | Filesystem partition (SPIFFS/LittleFS) | Embedded in Flash (`PROGMEM`) |
| **Capabilities** | Multi-tank, alerts, history graphs, OTA | Real-time level %, Wi-Fi RSSI, local calibration |
| **Best For** | Heavy production deployments | Quick setup, learning, hacking, and testing |

---

## Final Thoughts

Simplifying the code was an excellent exercise in understanding constraints. By stripping away non-essential features, leveraging `PROGMEM` for zero-RAM web serving, utilizing WebSockets for real-time data sync, and implementing a custom sorting filter for noise, I was able to build a robust, responsive home dashboard in a single Arduino file. 

If you are looking for a weekend IoT project to monitor your water tank, grab an ESP8266, check out the [water-tank](https://github.com/maniratansingh/water-tank) repository, flash the single sketch, and you're good to go!

***

← [Back to Posts](/blog/)
