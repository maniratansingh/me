---
title: "Benchmarking a 37.7 Gbps Thunderbolt 4 Link for Mac AI Clustering: Real-World Setup, iperf3 Results, and Exo Lessons Learned"
description: "Connecting a MacBook Air and Mac mini M4 over Thunderbolt 4, hitting 37.7 Gbps throughput with iperf3, and setting up distributed AI clustering with Exo and MLX."
date: 2026-07-22
tags: [mac, thunderbolt, ai, networking]
section: blog
parent_link: "/blog/"
parent_text: "Posts"
---

When linking multiple Apple Silicon Macs together, one of the most exciting possibilities is combining their bandwidth and processing power. With an **M4 Mac mini** acting as a desktop server and a **MacBook Air** as a mobile workstation, connecting them directly over a high-speed Thunderbolt 4 cable opens up massive possibilities for local AI workloads, file transfers, and remote execution.

Recently, I set up a direct peer-to-peer connection between my MacBook Air and Mac mini M4 using a Portronics Flash C2 240W Thunderbolt 4 / USB4 cable (rated for 40 Gbps data transfer). 

This post details the exact configuration, real-world `iperf3` benchmark results (hitting **37.7 Gbps**!), setting up a distributed AI cluster with **Exo**, troubleshooting Python dependencies like Apple's **MLX**, and lessons learned along the way.

---

## 1. Hardware & Physical Network Setup

To build a zero-latency direct link between two Macs without congesting the local Wi-Fi router, you create a direct Thunderbolt Bridge interface.

### Hardware Components
* **Server Node:** Apple Mac mini (M4)
* **Client Node:** Apple MacBook Air
* **Interconnect:** Portronics Flash C2 240W Type-C to Type-C Cable (Thunderbolt 4 / 40 Gbps rated)

### Static IP Configuration (`bridge0`)
Rather than relying on link-local auto-assigned IPs (`169.254.x.x`), setting explicit static IPv4 addresses on the Thunderbolt Bridge interface guarantees consistent routing and prevents traffic from leaking onto Wi-Fi:

* **MacBook Air (Client):** `192.168.5.1` (Subnet Mask: `255.255.255.0`)
* **Mac mini M4 (Server):** `192.168.5.2` (Subnet Mask: `255.255.255.0`)

Testing initial latency via ICMP ping:
```text
64 bytes from 192.168.5.2: icmp_seq=0 ttl=64 time=0.414 ms
64 bytes from 192.168.5.2: icmp_seq=1 ttl=64 time=0.494 ms
64 bytes from 192.168.5.2: icmp_seq=2 ttl=64 time=0.562 ms

--- 192.168.5.2 ping statistics ---
23 packets transmitted, 23 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 0.414/0.504/0.582/0.044 ms
```
A sub-millisecond round-trip time (`~0.5 ms`) confirms the direct hardware link is active.

---

## 2. Speed Benchmarking with `iperf3`

To test the actual TCP bandwidth achievable over the Thunderbolt connection, I installed `iperf3` on both devices via Homebrew (`brew install iperf3`).

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
| **Sustained Bitrate** | **37.7 – 37.8 Gbps** | Near theoretical 40 Gbps hardware limit |
| **Total 10s Transfer** | **43.9 GBytes** | ~4.4 GB per second |
| **Retransmissions** | **0** | Flawless signal integrity & zero packet drop |
| **Round-Trip Latency** | **~0.5 ms** | Instantaneous responsiveness |

At **37.7 Gbps**, transfer speeds exceed standard NVMe drive read/write caps, making local network bandwidth a non-issue for model streaming or remote execution.

---

## 3. Distributed AI Clustering with Exo

With a 37.7 Gbps link confirmed, I explored using [Exo](https://github.com/exo-explore/exo)—an open-source framework designed to run AI models by splitting layers dynamically across multiple devices.

### Ideal AI Models Evaluated for 16GB Nodes
When running clusters on machines with 16GB Unified Memory, quantization and model size are critical:
- `mlx-community/Meta-Llama-3.1-8B-Instruct-4bit` (~4 GB footprint)
- `mlx-community/Qwen3.5-9B-4bit` (~6 GB footprint)
- `mlx-community/gemma-4-e4b-it-6bit` (~7 GB footprint)

### Troubleshooting MLX Dependencies
During initialization, Exo spawned worker runners that failed with the following traceback:
```text
File "/Users/mrps/exo/src/exo/worker/engines/mlx/patches/opt_batch_gen.py", line 4, in <module>
    import mlx.core as mx
ModuleNotFoundError: No module named 'mlx'
```

#### Root Cause
Exo uses Apple’s native **MLX** framework (`mlx` and `mlx-lm`) to execute GPU-accelerated inference on Apple Silicon. When executing inside `uv` environments or standalone Python sub-processes, `mlx` must be installed directly into the workspace virtual environment:

```bash
# Correct dependency resolution inside the Exo virtual environment
cd ~/exo
uv sync
uv pip install mlx mlx-lm
```

Verification snippet:
```bash
python3 -c "import mlx.core as mx; print(mx.__version__)"
```

---

## 4. Key Takeaways & Workspace Cleanup

While experimental cluster engines like Exo show immense promise for layer-splitting across Apple Silicon, hardware-level considerations remain:

1. **Unified Memory Allocation:** Distributed layer-splitting does not pool RAM into one seamless pool. Each Mac must still have sufficient Unified Memory to house its designated layer shard and KV cache.
2. **Dedicated Headless Server Model:** For everyday, production-ready AI workflows, running an M4 Mac mini as an always-on headless server (via **Ollama** or **LM Studio** and **Open WebUI**) connected over the 37.7 Gbps Thunderbolt bridge gives the cleanest, most reliable setup.

### Full Workspace Reset Procedure
After testing the cluster environment, temporary model caches and virtual environments can be purged while keeping the rock-solid Thunderbolt static IP configuration intact:

```bash
# Purge temporary build folders & model caches
cd ~
rm -rf exo ~/.cache/huggingface ~/.cache/mlx ~/.cache/uv
pip3 uninstall -y mlx mlx-lm exo 2>/dev/null
```

---

## Conclusion

A single Thunderbolt 4 cable unlocks ultra-fast, 37.7 Gbps local networking between Apple Silicon Macs. Whether you're experimenting with distributed layer splitting via Exo or operating a dedicated, headless AI server on an M4 Mac mini, the hardware connection is exceptionally stable, fast, and easy to configure.

***

← [Back to Posts](/blog/)
