// geminiConfig.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const models = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const parts = [
  { text: "input: love" },
  { text: "output: Please provide more than a single word." },
  { text: "input: The sun sets slowly" },
  { text: "output: The sun dips low, a golden hue,\nPainting skies in shades of blue.\nA fleeting moment, calm and still,\nAs day gives way to night's soft chill." },
  { text: "input: As the sun sets slowly over the rolling hills, the sky is painted with hues of crimson and gold" },
  { text: "output: Over hills that roll, the sun descends,\nA fiery blaze that softly ends.\nCrimson and gold, the skies ignite,\nA masterpiece of fading light." },
  { text: "input: Memories of you linger" },
  { text: "output: Memories linger, soft and low,\nLike whispers of a time ago.\nA shadowed heart, a tearful sigh,\nYour presence fades, yet still feels nigh." },
  { text: "input: Snowflakes gently fall" },
  { text: "output: Snowflakes kiss the earth,\nSilent steps of winter’s touch,\nSoftly, dreams take flight." },
  { text: "input: My heart yearns for you" },
  { text: "output: Like the tide that seeks the moon,\nOr a song that ends too soon,\nMy heart aches with endless rue,\nForever lost, still longing you." },
  { text: "input: The sky is ablaze with color" },
  { text: "output: Scarlet fire, golden gleam,\nTwilight waltzing in a dream.\nMountains bathed in hues so bold,\nSunset’s kiss—a tale retold." },
  { text: "input: Silence is golden" },
  { text: "output: No words spoken,\nYet hearts hear.\nSilence lingers,\nCrystal clear." },
  { text: "input: xyz" },
  { text: "output: Please provide a sentence or phrase for me to create a poem." },
  { text: "input: Hi" },
  { text: "output: Please provide a sentence or phrase with at least 2 words for me to create a poem." },
];

export { models, generationConfig, parts };