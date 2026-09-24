/**
 * KARIGAR SETU — Backend
 * SIH Problem Statement 26090: AI-driven market linkage & smart cataloging
 * app for marginalized artisans.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5001;

// Enable open CORS for local network mobile testing
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// Simple request log
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

/* ------------------------------------------------------------------ *
 * MONGOOSE DATABASE SETUP
 * ------------------------------------------------------------------ */
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/karigar_setu';
let isMongoConnected = false;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    isMongoConnected = true;
    console.log('Connected to MongoDB successfully!');
  })
  .catch((err) => {
    console.warn('[MongoDB Notice]', err.message, '— Operating with active fallback store.');
  });

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  suggestedPrice: { type: Number, required: true },
  category: { type: String, required: true },
  imageBase64: { type: String, default: '' },
  isPushedToONDC: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', ProductSchema);

// Fallback in-memory store if local MongoDB service is not running
const inMemoryProducts = [];

/* ------------------------------------------------------------------ *
 * MODULE C — Mock "Vector DB" for the RAG Pricing Engine
 * ------------------------------------------------------------------ */
const MOCK_VECTOR_DB = [
  { item: 'Pashmina Shawl', keywords: ['pashmina', 'shawl', 'kashmiri shawl'], baseline_cost: 400, category: 'Textiles' },
  { item: 'Terracotta Pot', keywords: ['terracotta', 'clay pot', 'mitti', 'matka', 'pot'], baseline_cost: 50, category: 'Pottery' },
  { item: 'Madhubani Painting', keywords: ['madhubani', 'painting', 'mithila'], baseline_cost: 300, category: 'Art' },
  { item: 'Bamboo Basket', keywords: ['bamboo', 'basket', 'tokri'], baseline_cost: 80, category: 'Home Decor' },
  { item: 'Block Print Saree', keywords: ['block print', 'saree', 'sari', 'bagru', 'sanganeri'], baseline_cost: 600, category: 'Textiles' },
  { item: 'Brass Idol', keywords: ['brass', 'idol', 'murti', 'metal craft'], baseline_cost: 250, category: 'Metalware' },
  { item: 'Jute Bag', keywords: ['jute', 'bag', 'thaila'], baseline_cost: 60, category: 'Textiles' },
  { item: 'Wooden Toy', keywords: ['wood', 'wooden', 'toy', 'channapatna'], baseline_cost: 120, category: 'Handicrafts' },
];

const FALLBACK_ENTRY = {
  item: 'Handmade Craft Item',
  keywords: [],
  baseline_cost: 150,
  category: 'Handicrafts',
};

function retrieveBaseline(transcript) {
  const text = transcript.toLowerCase();
  const hit = MOCK_VECTOR_DB.find((entry) => entry.keywords.some((k) => text.includes(k)));
  return hit || FALLBACK_ENTRY;
}

function extractQuotedPrice(transcript) {
  const currencyMatch =
    transcript.match(/(?:₹|rs\.?|rupees?|daam|keemat|price|cost)\s*[:=-]?\s*(\d{2,6})/i) ||
    transcript.match(/(\d{2,6})\s*(?:₹|rs\.?|rupees?)/i);
  if (currencyMatch) {
    return Number(currencyMatch[1]);
  }

  const numberMatches = transcript.matchAll(/\b(\d{2,6})\b/g);
  for (const match of numberMatches) {
    const num = Number(match[1]);
    if (num >= 1990 && num <= 2030) continue;
    return num;
  }

  return null;
}

/* ------------------------------------------------------------------ *
 * MODULE C — Groq Call anchored to baseline
 * ------------------------------------------------------------------ */
const PRIMARY_GROQ_MODEL = process.env.GROQ_MODEL || 'groq/compound';
const FALLBACK_GROQ_MODELS = ['groq/compound', 'groq/compound-mini', 'qwen/qwen3.6-27b', 'openai/gpt-oss-20b'];

async function generateListingWithGroq(transcript, baseline, quotedPrice) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY not set');
  }

  const systemPrompt = `You are a cataloguing assistant for "Karigar Setu", a marketplace that helps marginalized rural Indian artisans sell handmade products online. Artisans dictate a product description by voice in mixed Hindi/English (Hinglish) or regional language, and it is transcribed to text — expect informal, code-mixed, sometimes broken phrasing.

You will be given:
1. The raw transcript.
2. A verified baseline material/labour cost for this type of product, retrieved from a trusted cost database.
3. The price the artisan may have quoted themselves, if detected.

Your job is to return ONE JSON object, and nothing else, with exactly these fields:
{
  "title": string,              // short, sellable product title, max 8 words
  "seo_description": string,    // 2-3 warm sentences highlighting handmade/authentic origin, suitable for an online listing
  "suggested_price": number,    // price in INR, digits only, no currency symbol or commas
  "category": string            // one of: Textiles, Pottery, Art, Home Decor, Metalware, Handicrafts, Jewelry, Other
}

PRICING RULES:
- The baseline_cost given to you reflects real material + labour cost for this product category. Treat it as ground truth.
- suggested_price should normally fall between 1.15x and 1.8x of baseline_cost.
- If the artisan quoted their own price and it falls within a reasonable range of the baseline (0.7x to 3x), lean towards respecting their number.
- Respond with ONLY the JSON object. No markdown, no code fences.`;

  const userPrompt = `Transcript: "${transcript}"
Baseline data: ${JSON.stringify({ item: baseline.item, baseline_cost: baseline.baseline_cost, category: baseline.category })}
Artisan-quoted price: ${quotedPrice !== null ? `₹${quotedPrice}` : 'none detected'}`;

  const modelsToTry = Array.from(new Set([PRIMARY_GROQ_MODEL, ...FALLBACK_GROQ_MODELS]));
  let lastError = null;

  for (const modelId of modelsToTry) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: modelId,
          temperature: 0.4,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API error (${modelId}) ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content;
      if (!raw) throw new Error(`Empty response from Groq using model ${modelId}`);

      const cleanRaw = raw.replace(/```json\s*|```/g, '').trim();
      const parsed = JSON.parse(cleanRaw);

      return {
        title: String(parsed.title || `${baseline.item} — Handcrafted`),
        seo_description: String(parsed.seo_description || ''),
        suggested_price: Number(parsed.suggested_price) || Math.round(baseline.baseline_cost * 1.4),
        category: String(parsed.category || baseline.category),
        source: `groq-${modelId}`,
      };
    } catch (err) {
      lastError = err;
      console.warn(`[Groq Model ${modelId} failed, trying next fallback]`, err.message);
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new Error('All Groq models failed');
}

function generateFallbackListing(transcript, baseline, quotedPrice) {
  const withinRange =
    quotedPrice !== null && quotedPrice >= baseline.baseline_cost * 0.7 && quotedPrice <= baseline.baseline_cost * 3;
  const suggested_price = withinRange ? quotedPrice : Math.round(baseline.baseline_cost * 1.4);

  return {
    title: `Handcrafted ${baseline.item}`,
    seo_description: `A beautifully handmade ${baseline.item.toLowerCase()}, crafted using traditional techniques passed down through generations. Every piece is unique and directly supports a local artisan community.`,
    suggested_price,
    category: baseline.category,
    source: 'rule-based-fallback',
  };
}

/* ------------------------------------------------------------------ *
 * API ENDPOINTS
 * ------------------------------------------------------------------ */

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', groqConfigured: Boolean(process.env.GROQ_API_KEY), mongoConnected: isMongoConnected, port: PORT });
});

// Generate Listing via AI
app.post('/api/generate-listing', async (req, res, next) => {
  try {
    const { transcript } = req.body;
    if (!transcript || typeof transcript !== 'string' || !transcript.trim()) {
      return res.status(400).json({ error: 'A non-empty "transcript" string is required.' });
    }

    const baseline = retrieveBaseline(transcript);
    const quotedPrice = extractQuotedPrice(transcript);

    try {
      const listing = await generateListingWithGroq(transcript, baseline, quotedPrice);
      return res.json({ listing, baseline, quotedPrice });
    } catch (err) {
      console.warn('[Groq call failed — using fallback generator]', err.message);
      const listing = generateFallbackListing(transcript, baseline, quotedPrice);
      return res.json({ listing, baseline, quotedPrice, warning: 'AI service unavailable — showing rule-based estimate.' });
    }
  } catch (error) {
    next(error);
  }
});

// TASK 2: POST /api/catalog/save — Save catalog item to MongoDB
app.post('/api/catalog/save', async (req, res, next) => {
  try {
    const { title, description, suggestedPrice, category, imageBase64, isPushedToONDC } = req.body;

    if (!title || !description || suggestedPrice === undefined || !category) {
      return res.status(400).json({ error: 'Title, description, suggestedPrice, and category are required.' });
    }

    const productPayload = {
      title,
      description,
      suggestedPrice: Number(suggestedPrice),
      category,
      imageBase64: imageBase64 || '',
      isPushedToONDC: Boolean(isPushedToONDC),
      createdAt: new Date(),
    };

    if (isMongoConnected) {
      const newProduct = new Product(productPayload);
      const savedProduct = await newProduct.save();
      return res.status(201).json({ success: true, product: savedProduct });
    } else {
      const fallbackProduct = { _id: `mem_${Date.now()}`, ...productPayload };
      inMemoryProducts.unshift(fallbackProduct);
      return res.status(201).json({ success: true, product: fallbackProduct });
    }
  } catch (error) {
    next(error);
  }
});

// TASK 2: GET /api/catalog — Fetch all products sorted by newest first
app.get('/api/catalog', async (req, res, next) => {
  try {
    if (isMongoConnected) {
      const products = await Product.find().sort({ createdAt: -1 });
      return res.json({ success: true, products });
    } else {
      return res.json({ success: true, products: inMemoryProducts });
    }
  } catch (error) {
    next(error);
  }
});

// TASK 2: PUT /api/catalog/:id/ondc — Update isPushedToONDC to true
app.put('/api/catalog/:id/ondc', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected && !id.startsWith('mem_')) {
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { isPushedToONDC: true },
        { new: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.json({ success: true, product: updatedProduct });
    } else {
      const product = inMemoryProducts.find((p) => p._id === id);
      if (product) {
        product.isPushedToONDC = true;
      }
      return res.json({ success: true, product: product || { _id: id, isPushedToONDC: true } });
    }
  } catch (error) {
    next(error);
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Karigar Setu backend running on http://10.172.246.119:${PORT} (bound to 0.0.0.0)`);
  console.log(`Groq configured: ${Boolean(process.env.GROQ_API_KEY)}`);
});
