---
title: "AI Doesn't Need Better Scrapers. It Needs Better Websites."
description: "A thought on how websites can expose structured, read-only representations of public data designed specifically for machines."
date: 2026-07-17
tags: [ai, web, design]
section: blog
parent_link: "/blog/"
parent_text: "Posts"
---

> *This isn't a prediction, nor is it a proposal claiming to have all the answers. It's simply a thought that came to me while using AI to compare products across different websites. The more I thought about it, the more interesting it became, so I decided to write it down. I may be overlooking important technical or business considerations, and if so, I'd genuinely like to hear them.*

For most of the web's history, websites have been built for one audience: humans.

A modern website delivers far more than HTML. It combines HTML, CSS, JavaScript, images, APIs, and client-side rendering to create an interactive experience. Search engines adapted to this model by indexing webpages and returning links.

Today, there is a second audience.

AI.

The interesting part is that we're still expecting AI to consume the web almost exactly like humans do.

## The Wrong Interface

When I ask an AI to compare products from multiple websites, it often has to load webpages, execute JavaScript, navigate dynamic interfaces, identify which text is a specification, locate prices, distinguish marketing copy from technical details, and then repeat the process across multiple websites.

It works surprisingly often.

But it is also surprisingly fragile.

A redesign of a webpage, a change in JavaScript, or a different way of rendering product information can confuse automated systems. Specifications may be presented differently across manufacturers, and sometimes information is simply difficult to extract reliably.

The AI isn't really analysing the product.

It's spending a significant amount of effort trying to reconstruct structured information from websites that were primarily designed for people.

## Companies Already Have Structured Data

Here's what I find interesting.

Almost every modern e-commerce website already stores its products in structured form.

Somewhere inside the company's systems, every product already has fields for:

- Product name
- Price
- Dimensions
- Weight
- Material
- Warranty
- Stock status
- Images
- Variants
- Specifications

The website simply presents that information through webpages for people to browse.

So why should an AI spend time reconstructing information that already exists in a structured database?

## A Second Interface

This led me to a simple idea.

What if every product website exposed a public, read-only interface designed specifically for machines?

Not for administration.

Not for editing.

Just for reading information that is already public.

Imagine something like:

```text
/api/products.json
/api/categories.json
/api/specifications.json
```

Or perhaps a single catalogue endpoint containing every published product.

These files could be cached through a CDN, regenerated periodically, versioned, and include a timestamp indicating when they were last updated.

The human website remains exactly as it is.

The machine interface simply becomes another view of the same underlying data.

## "But Competitors Will Use It"

This is probably the first objection.

My response is a question.

What exactly would they gain that they can't already obtain?

If product specifications are already public on a website, then competitors can already collect them.

They can write scrapers.

They can use browser automation.

They can hire developers.

They can automate the entire process.

Large companies already do this.

A structured API wouldn't reveal new information.

It would simply provide a cleaner and more reliable way to access information that is already public.

That doesn't mean there are no business concerns. Companies may worry about automated price monitoring, large-scale data collection, or increased competitive analysis. Those are real considerations. I just wonder whether, for publicly available product information, the benefits might outweigh the drawbacks.

## Better for Customers

The biggest winner, in my opinion, would be the customer.

Imagine asking an AI:

> Find me a steel almirah under ₹30,000 with four shelves and a locker.

Or:

> Compare every officially listed CO₂ sensor from these three manufacturers.

Today, the AI often has to work through dozens of webpages and hope it interpreted everything correctly.

With structured data, it could compare official product fields directly.

Less guessing.

Fewer mistakes.

More reliable answers.

## Search Is Changing

I think we're entering a different era of search.

Traditional search is about finding documents.

AI is increasingly about finding structured facts.

Those are different problems.

For decades the web has been optimised so humans could discover webpages.

Now we have AI systems trying to answer questions by piecing together information from those webpages.

Perhaps we're reaching a point where websites should expose data in a format that machines can consume directly rather than forcing them to reconstruct it from interfaces built for humans.

## My View

I don't think websites need to replace their existing design.

Keep the webpages.

Keep the interactive experience.

Keep the images.

Keep everything that makes a website enjoyable for people.

But alongside that, publish a structured, read-only representation of exactly the same public information.

One website.

Two interfaces.

One for humans.

One for machines.

Both generated from the same source of truth.

## Closing Thoughts

Maybe this idea already exists in forms I'm only beginning to discover. Maybe there are technical or commercial challenges that make it less practical than it appears from the outside. Or maybe we're already slowly moving in this direction without most people noticing.

I don't know.

This article isn't an attempt to predict the future.

It's simply the result of thinking out loud after repeatedly asking AI to compare products and noticing how much effort is spent trying to understand websites instead of understanding the products themselves.

If you've worked on search, APIs, AI systems, e-commerce, or web architecture, I'd genuinely be interested in hearing where you agree, where you disagree, and what I've overlooked.

Sometimes the most interesting ideas don't begin as answers.

They begin as questions.

***

← [Back to Posts](/blog/)
