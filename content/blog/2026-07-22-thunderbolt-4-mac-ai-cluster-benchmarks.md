---
title: "My First Experiment with Mac AI Clustering: 37.7 Gbps Benchmarks, MLX Hiccups, and Lessons Learned"
description: "A beginner's first hands-on test connecting an M4 Mac mini and MacBook Air over Thunderbolt 4, testing speeds with iperf3, and exploring distributed AI."
date: 2026-07-22
tags: [mac, thunderbolt, ai, networking]
section: blog
parent_link: "/blog/"
parent_text: "Posts"
---

I’m not a professional AI engineer or a low-level systems compiler expert—I’m a hobbyist and generalist who loves experimenting with tech, building things hands-on, and seeing what happens. 

Recently, I decided to try my very first experiment with **Mac AI clustering**. 

The concept sounded fascinating: connecting an **M4 Mac mini** and a **MacBook Air** using a high-speed **Portronics Flash C2 240W Thunderbolt 4 cable** (40 Gbps rated) to share processing tasks. I didn't want to dig too deep into complex low-level roots right away; I just wanted to run a practical test, measure the speeds, see how distributed AI behaves, and learn along the way.

Here is a breakdown of my first experience, the benchmark results, where I got stuck, and my key takeaways.

---

## 1. Setting Up the Physical Link

To get the fastest possible connection between the two Macs without burdening the Wi-Fi router, I set up a direct peer-to-peer Thunderbolt Bridge.

### The Gear
* **Server Node:** Apple Mac mini (M4)
* **Client Node:** Apple MacBook Air
* **Interconnect:** Portronics Flash C2 240W Type-C to Type-C Cable (Thunderbolt 4 / 40 Gbps)

### Static IP Configuration (`bridge0`)
To keep routing predictable, I assigned simple static IPv4 addresses to the Thunderbolt Bridge interface on both machines:

* **MacBook Air (Client):** `192.168.5.1`
* **Mac mini M4 (Server):** `192.168.5.2`

Testing the response time with ICMP ping:
```text
64 bytes from 192.168.5.2: icmp_seq=0 ttl=64 time=0.414 ms
64 bytes from 192.168.5.2: icmp_seq=1 ttl=64 time=0.494 ms
64 bytes from 192.168.5.2: icmp_seq=2 ttl=64 time=0.562 ms

--- 192.168.5.2 ping statistics ---
23 packets transmitted, 23 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 0.414/0.504/0.582/0.044 ms
```
Seeing sub-millisecond response times (`~0.5 ms`) was our first sign that the direct hardware link was working smoothly.

---

## 2. Speed Benchmarking with `iperf3`: A Mind-Blowing 37.7 Gbps!

Before jumping into AI models, I wanted to test the real transfer throughput between the two devices. I installed `iperf3` on both Macs using Homebrew (`brew install iperf3`).

### Test 1: Air ➔ Mini (Upload)
On the Mac mini (Server):
```bash
iperf3 -s
```

On the MacBook Air (Client):
```bash
iperf3 -c 192.168.5.2
```

**Results:**
```text
[ ID] Interval           Transfer     Bitrate         Retr  Cwnd
[  5]   0.00-1.00   sec  4.34 GBytes  37.2 Gbits/sec    0   4.00 MBytes       
[  5]   1.00-2.01   sec  4.41 GBytes  37.8 Gbits/sec    0   4.00 MBytes       
[  5]   2.01-3.01   sec  4.40 GBytes  37.8 Gbits/sec    0   4.00 MBytes       
[  5]   3.01-4.01   sec  4.40 GBytes  37.8 Gbits/sec    0   4.00 MBytes       
[  5]   4.01-5.01   sec  4.40 GBytes  37.8 Gbits/sec    0   4.00 MBytes       
[  5]   5.01-6.01   sec  4.40 GBytes  37.8 Gbits/sec    0   4.00 MBytes       
[  5]   6.01-7.01   sec  4.40 GBytes  37.8 Gbits/sec    0   4.00 MBytes       
[  5]   7.01-8.00   sec  4.39 GBytes  37.8 Gbits/sec    0   4.00 MBytes       
[  5]   8.00-9.01   sec  4.41 GBytes  37.8 Gbits/sec    0   4.00 MBytes       
[  5]   9.01-10.01  sec  4.40 GBytes  37.8 Gbits/sec    0   4.00 MBytes       
- - - - - - - - - - - - - - - - - - - - - - - - -
[ ID] Interval           Transfer     Bitrate         Retr
[  5]   0.00-10.01  sec  43.9 GBytes  37.7 Gbits/sec    0            sender
[  5]   0.00-10.01  sec  43.9 GBytes  37.7 Gbits/sec                  receiver
```

### Test 2: Mini ➔ Air (Download / Reverse Mode)
On the MacBook Air (Client):
```bash
iperf3 -c 192.168.5.2 -R
```

**Results:**
```text
[ ID] Interval           Transfer     Bitrate
[  5]   0.00-10.00  sec  44.0 GBytes  37.8 Gbits/sec    0            sender
[  5]   0.00-10.00  sec  44.0 GBytes  37.8 Gbits/sec                  receiver
```

### Summary Benchmark Metrics
| Metric | Measurement | Assessment |
|---|---|---|
| **Sustained Bitrate** | **37.7 – 37.8 Gbps** | Pushing right up against the theoretical 40 Gbps limit |
| **Total 10s Transfer** | **43.9 GBytes** | ~4.4 GB per second |
| **Retransmissions** | **0** | Perfect signal stability & zero lost packets |
| **Round-Trip Latency** | **~0.5 ms** | Instantaneous |

Seeing **37.7 Gbps** on the screen was incredible! That is faster than most internal SSDs, proving that local network bandwidth will never be the bottleneck here.

---

## 3. Experimenting with `Exo` & Hitting the MLX Dependency Wall

Next up was trying out [Exo](https://github.com/exo-explore/exo)—an experimental tool that splits model layers across devices.

I looked at lightweight 4-bit and 6-bit models suited for 16GB memory hardware:
- `mlx-community/Meta-Llama-3.1-8B-Instruct-4bit` (~4 GB)
- `mlx-community/Qwen3.5-9B-4bit` (~6 GB)
- `mlx-community/gemma-4-e4b-it-6bit` (~7 GB)

However, when launching Exo worker runners, I bumped into a Python environment issue:
```text
File "/Users/mrps/exo/src/exo/worker/engines/mlx/patches/opt_batch_gen.py", line 4, in <module>
    import mlx.core as mx
ModuleNotFoundError: No module named 'mlx'
```

### What Happened?
Exo uses Apple’s native **MLX** framework (`mlx` / `mlx-lm`) under the hood to handle matrix math on Apple Silicon GPUs. Because `uv` manages virtual environments in isolation, `mlx` wasn't present inside the specific sub-environment Exo spawned. 

Installing it inside the environment (`uv pip install mlx mlx-lm`) resolved the module error:
```bash
cd ~/exo
uv sync
uv pip install mlx mlx-lm
```

As a beginner, running into environment and dependency issues can be a bit overwhelming. Since I wanted to keep this first experiment simple and light without getting lost down a rabbit hole of complex virtual environment debugging, I decided to pause here, clean up the temporary files, and save deeper troubleshooting for next time!

---

## 4. Key Takeaways from My First Experience

Even though I kept things high-level and didn't dive deep into complex roots, this first test was a fantastic learning experience:

1. **Thunderbolt 4 Direct Links are Insanely Fast:** Hitting 37.7 Gbps over a single cable proves that hardware connections between Macs are virtually transparent.
2. **Unified Memory Doesn't Automatically Merge:** In clustering tools like Exo, each Mac still needs enough RAM to house its specific assigned layers. 16GB per machine gives room for 4B–8B models, but higher 70B models still won't fit.
3. **Headless Server Is Super Practical:** For daily use, keeping the Mac mini as a dedicated server running Ollama / Open WebUI while accessing it over Thunderbolt from the MacBook Air is a smooth, silent, and highly usable setup.

### Cleaning Up
To keep my system clean after experimenting:
```bash
# Purge temporary build folders & model caches
cd ~
rm -rf exo ~/.cache/huggingface ~/.cache/mlx ~/.cache/uv
pip3 uninstall -y mlx mlx-lm exo 2>/dev/null
```
The static IP settings on the Thunderbolt Bridge stay saved and ready for the next run.

---

## Final Thoughts & Until Next Time!

This was my very first hands-on test with Mac AI clustering. I learned how to benchmark high-speed interfaces, experienced how layer-splitting frameworks operate, and discovered firsthand how Python environment dependencies behave on Apple Silicon. 

Since I'm new to this and not a professional, I preferred keeping things simple, sharing what worked, and noting where I got stuck. 

Next time, I'll take another crack at MLX and deeper model splitting! Until then, we'll see you again in the next post.

***

← [Back to Posts](/blog/)
