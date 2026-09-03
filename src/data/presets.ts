import { PresetQuote, ToneOption } from "../types";

export const USER_DEFAULT_TEXT =
  "আপনি কি জানেন, আজ থেকে ১৪০০ বছরেরও বেশি আগে কুরআন এমন এক সত্যের কথা জানিয়েছিল, যা মানুষের অন্তরের শান্তির সঙ্গে গভীরভাবে সম্পর্কিত? মিজানুর রহমান আজহারীর এই কথাটি আপনার চিন্তাধারা বদলে দিতে পারে।";

export const PRESET_QUOTES: PresetQuote[] = [
  {
    id: "azhari-quote",
    category: "ইসলামিক চিন্তা",
    title: "আজহারীর উক্তি ও কুরআন",
    text: USER_DEFAULT_TEXT,
    suggestedVoice: "Fenrir",
    suggestedTone: "islamic",
  },
  {
    id: "quran-peace",
    category: "আত্মার প্রশান্তি",
    title: "অন্তরের প্রশান্তি ও যিকির",
    text: "জেনে রেখো, আল্লাহর স্মরণেই কেবল মানুষের অন্তর প্রশান্তি ও স্থিরতা লাভ করে। যখন চারপাশের পৃথিবী অশান্ত হয়ে ওঠে, তখন রবের দিকে ফিরে যাওয়াই একমাত্র মুক্তি।",
    suggestedVoice: "Charon",
    suggestedTone: "islamic",
  },
  {
    id: "motivation",
    category: "অনুপ্রেরণা",
    title: "স্বপ্ন জয়ের আত্মবিশ্বাস",
    text: "প্রতিটি নতুন ভোর আপনার জীবনের জন্য একটি নতুন সুযোগ। অতীতের ব্যর্থতা ভুলে আজকের দিনটিতে আপনার সর্বোচ্চ প্রচেষ্টা দিন। সাফল্য একদিন আপনার দরজায় কড়া নাড়বেই।",
    suggestedVoice: "Puck",
    suggestedTone: "motivational",
  },
  {
    id: "storytelling",
    category: "গল্প ও সাহিত্য",
    title: "নদী ও জীবনের গল্প",
    text: "সন্ধ্যার লাল আভায় মেঘনা নদীর জল যেন সোনা রঙে জ্বলছিল। দূর থেকে ভেসে আসছিল রাখালের বাঁশির সুর। জীবন যেন এক অবিরাম বয়ে চলা নদী, যার কোনো ক্লান্তি নেই।",
    suggestedVoice: "Kore",
    suggestedTone: "story",
  },
  {
    id: "news",
    category: "সংবাদ ও তথ্য",
    title: "বিজ্ঞান ও প্রযুক্তির আপডেট",
    text: "কৃত্রিম বুদ্ধিমত্তা ও আধুনিক প্রযুক্তির উৎকর্ষে বদলে যাচ্ছে বিশ্বের যোগাযোগ মাধ্যম। আজকের দিনে ভাষা আর কোনো বাধা নয়, অডিও ও ভয়েস প্রযুক্তি খুলে দিয়েছে সম্ভাবনার নতুন দুয়ার।",
    suggestedVoice: "Zephyr",
    suggestedTone: "news",
  },
];

export const TONE_OPTIONS: ToneOption[] = [
  {
    id: "natural",
    label: "স্বাভাবিক ও আন্তরিক (Calm / Natural)",
    promptInstruction: "Speak naturally, warmly, calmly, and clearly in Bengali with proper pauses and emotion",
  },
  {
    id: "excited",
    label: "উত্তেজনাপূর্ণ ও প্রাণবন্ত (Excited / Energetic)",
    promptInstruction: "Speak with excitement, high energy, enthusiasm, and upbeat cadence in Bengali",
  },
  {
    id: "corporate",
    label: "কর্পোরেট ও প্রফেশনাল (Corporate / Formal)",
    promptInstruction: "Speak in an articulate, formal, polished corporate business tone in Bengali",
  },
  {
    id: "storytelling",
    label: "গল্প বলার ভঙ্গি (Storytelling / Narrative)",
    promptInstruction: "Narrate like a captivating storyteller with expressive emotional pauses in Bengali",
  },
  {
    id: "islamic",
    label: "গম্ভীর ও ওয়াজের ভঙ্গি (Islamic Spiritual)",
    promptInstruction: "Speak with a deep, reflective, resonant, and respectful Islamic scholarly tone in Bengali, emphasizing heart-touching wisdom",
  },
  {
    id: "motivational",
    label: "অনুপ্রেরণামূলক ও বলিষ্ঠ (Motivational)",
    promptInstruction: "Speak with passion, confidence, high energy, and uplifting inspiration in Bengali",
  },
];
