---
title: "Why I Built an Offline Image Compressor for Android"
description: "Thoughts on mobile app bloatware, privacy skepticism, and why a simple utility that works 100% offline is all we really need."
date: 2026-09-30
tags: [android, privacy, mobile, reflection]
section: blog
parent_link: "/blog/"
parent_text: "Posts"
---

Have you ever tried downloading a simple utility app from the Google Play Store recently? 

A few weeks ago, I needed to shrink the file size of a few photos on my phone to upload them to a portal with strict size limits. It should have been a 10-second task. Instead, I spent twenty minutes wading through an ocean of terrible apps:
- Apps demanding full network access and location permissions.
- Fullscreen video ads that cannot be skipped for 30 seconds.
- Monthly subscription prompts asking for ₹499/month just to downscale an image.
- Worse still, apps that upload your private photos to unknown third-party servers just to perform basic JPEG compression.

That experience left a bitter taste. Why should shrinking a photo require trusting an unvetted cloud server with your personal pictures?

So, I decided to build my own: [Image Compressor – MRPS](https://github.com/maniratansingh/Image-Compressor-MRPS) ([project details](/projects/image-compressor-mrps/)).

---

## 1. Local Power: Your Phone is Already Fast Enough

Modern smartphones carry processors that rival laptop computers. Compressing an image or downscaling its resolution isn't complex machine learning—it is basic matrix arithmetic. On an Android device, compressing a 12-megapixel photo down to a specific file size takes roughly 50 milliseconds using native bitmap libraries.

Sending that photo over the cellular network to a remote cloud server is actually *slower* than doing it locally on your own chip. 

By building a lightweight utility in Kotlin, the entire compression process runs directly on the device's CPU and memory:
- **Instant Processing:** Zero wait time for network uploads or downloads.
- **Works Anywhere:** Compresses images in airplane mode, on flights, or in rural areas with zero mobile signal.
- **Battery Friendly:** Doesn't keep radio antennas active transmitting multi-megabyte payloads.

---

## 2. A Look at the Technical Pipeline

Under the hood, the processing pipeline was engineered to be memory-efficient and prevent `OutOfMemoryError` (OOM) crashes when handling 48MP or 108MP phone captures:

### A. Subsampling with `inSampleSize`
Decoding a full-resolution 48MP photo directly into a bitmap array can consume over 150MB of RAM. To prevent memory spikes, we decode the image dimensions first:

```kotlin
val options = BitmapFactory.Options().apply {
    inJustDecodeBounds = true
}
BitmapFactory.decodeStream(inputStream, null, options)

// Calculate optimal power-of-two subsampling ratio
options.inSampleSize = calculateInSampleSize(options, targetWidth, targetHeight)
options.inJustDecodeBounds = false
val scaledBitmap = BitmapFactory.decodeStream(newInputStream, null, options)
```

### B. Compression & Non-Blocking Coroutines
The scaled bitmap is compressed using Android's native JPEG encoder:
```kotlin
scaledBitmap.compress(Bitmap.CompressFormat.JPEG, qualityLevel, outputStream)
```
To ensure the user interface remains butter-smooth at 120Hz while processing large images, all disk I/O and compression math run in background worker threads using Kotlin Coroutines (`withContext(Dispatchers.IO)`).

---

## 3. Privacy Shouldn't Be a Premium Feature

Photos are among the most personal data we carry. They contain sensitive EXIF metadata—precise GPS coordinates of where you live, timestamps of your daily routine, and images of family and private documents.

When an app uploads that image to an external server, you have no real way of knowing how long that file is stored, who can view it, or if it is being fed into image-training datasets.

For **Image Compressor – MRPS**, the design rule was absolute: **zero internet permissions.**
```xml
<!-- In AndroidManifest.xml: Zero network permissions -->
<!-- No android.permission.INTERNET -->
<!-- No android.permission.ACCESS_NETWORK_STATE -->
```
Because the app literally lacks network permissions in its manifest, it cannot leak data even if someone wanted it to. To share the compressed file safely with WhatsApp, Gmail, or your file manager, it uses Android's secure `FileProvider` mechanism without ever touching the public internet.

---

## 4. The Joy of Single-Purpose Tools

In software engineering, there is a classic Unix philosophy: *Write programs that do one thing and do it well.*

Most mobile apps today try to do everything—they bundle social feeds, accounts, analytics trackers, and notification engines. They constantly demand your attention.

Building this small app was a refreshing reminder of how satisfying single-purpose software can be. You open it, select your photo, choose the target quality, tap save, and close it. No login screens, no banners, no notifications, and no analytics.

---

## Final Thoughts

We don't always need massive cloud architectures or complex ecosystems. Sometimes, the most respectful and empowering software you can build is a tiny, quiet tool that respects the user's device, honors their privacy, and simply gets out of the way.

***

### Code & Repository
- [View Image-Compressor-MRPS on GitHub](https://github.com/maniratansingh/Image-Compressor-MRPS) ↗
- [Read App Privacy Policy](https://maniratansingh.github.io/Image-Compressor-MRPS/privacy_policy.html) ↗

***

← [Back to Posts](/blog/)
