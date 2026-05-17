export interface Category {
  slug: string;
  nameJa: string;
  nameEn: string;
  icon: string;
  descJa: string;
  descEn: string;
  /** product.data.category or product.data.tab values that map to this slug */
  matches: string[];
}

export const categories: Category[] = [
  {
    slug: 'food',
    nameJa: '食品・飲料',
    nameEn: 'Food & Drink',
    icon: '🍱',
    descJa: 'お茶・調味料・お菓子・レトルト',
    descEn: 'Tea, seasonings, snacks & instant meals',
    matches: ['food', 'Food', 'food & drink', 'Beverage'],
  },
  {
    slug: 'beauty',
    nameJa: '美容・スキンケア',
    nameEn: 'Beauty & Skincare',
    icon: '✨',
    descJa: '化粧品・日焼け止め・スキンケア',
    descEn: 'Cosmetics, sunscreen & skincare',
    matches: ['beauty', 'Beauty', 'Cosmetics', 'Skincare'],
  },
  {
    slug: 'daily',
    nameJa: '生活雑貨',
    nameEn: 'Daily Goods',
    icon: '🏠',
    descJa: '掃除・収納・キッチン用品',
    descEn: 'Cleaning, storage & kitchen essentials',
    matches: ['daily', 'Daily Goods', 'Kitchen', 'Household'],
  },
  {
    slug: 'health',
    nameJa: '医療・健康',
    nameEn: 'Health & Wellness',
    icon: '💊',
    descJa: 'サプリ・衛生用品・医薬品',
    descEn: 'Supplements, hygiene & medical supplies',
    matches: ['health', 'Health', 'Medical', 'Wellness', 'Pharmacy'],
  },
  {
    slug: 'hobby',
    nameJa: '趣味・ホビー',
    nameEn: 'Hobby',
    icon: '🎨',
    descJa: 'ゲーム・アート・コレクション',
    descEn: 'Games, art supplies & collectibles',
    matches: ['hobby', 'Hobby', 'Anime', 'Manga', 'Gaming'],
  },
  {
    slug: 'fashion',
    nameJa: 'ファッション',
    nameEn: 'Fashion',
    icon: '👘',
    descJa: '衣類・靴・バッグ・アクセサリー',
    descEn: 'Clothing, shoes, bags & accessories',
    matches: ['fashion', 'Fashion', 'Clothing', 'Apparel'],
  },
  {
    slug: 'tech',
    nameJa: '家電・テック',
    nameEn: 'Electronics & Tech',
    icon: '📱',
    descJa: 'ガジェット・家電・スマートデバイス',
    descEn: 'Gadgets, appliances & smart devices',
    matches: ['tech', 'Electronics', 'Technology', 'Gadget', 'Appliance'],
  },
  {
    slug: 'sports',
    nameJa: 'スポーツ・アウトドア',
    nameEn: 'Sports & Outdoor',
    icon: '🏃',
    descJa: 'フィットネス・キャンプ・登山',
    descEn: 'Fitness, camping & outdoor gear',
    matches: ['sports', 'Sports', 'Outdoor', 'Fitness', 'Camping'],
  },
  {
    slug: 'baby',
    nameJa: 'ベビー・キッズ',
    nameEn: 'Baby & Kids',
    icon: '👶',
    descJa: 'おもちゃ・育児グッズ・子ども服',
    descEn: 'Toys, baby care & children\'s clothing',
    matches: ['baby', 'Baby', 'Kids', 'Children', 'Toy'],
  },
  {
    slug: 'pet',
    nameJa: 'ペット用品',
    nameEn: 'Pet Supplies',
    icon: '🐾',
    descJa: 'ペットフード・グッズ・ケア用品',
    descEn: 'Pet food, accessories & grooming',
    matches: ['pet', 'Pet', 'Pet Supplies', 'Animal'],
  },
  {
    slug: 'stationery',
    nameJa: '文具・オフィス',
    nameEn: 'Stationery & Office',
    icon: '✏️',
    descJa: 'ノート・ペン・デスク・文房具',
    descEn: 'Notebooks, pens & desk accessories',
    matches: ['stationery', 'Stationery', 'Office', 'Pen', 'Notebook'],
  },
  {
    slug: 'travel',
    nameJa: '旅行・トラベル',
    nameEn: 'Travel',
    icon: '✈️',
    descJa: 'トラベルバッグ・旅行グッズ',
    descEn: 'Luggage, travel bags & accessories',
    matches: ['travel', 'Travel', 'Luggage', 'Bag'],
  },
  {
    slug: 'whisky',
    nameJa: '日本のウイスキー',
    nameEn: 'Japanese Whisky',
    icon: '🥃',
    descJa: '山崎・響・白州など本格派ウイスキー',
    descEn: 'Yamazaki, Hibiki, Hakushu & more',
    matches: ['whisky', 'Whisky', 'Whiskey', 'Japanese Whisky', 'Bourbon'],
  },
  {
    slug: 'sake',
    nameJa: '日本酒',
    nameEn: 'Japanese Sake',
    icon: '🍶',
    descJa: '純米酒・大吟醸・地酒',
    descEn: 'Junmai, daiginjo & regional sake',
    matches: ['sake', 'Sake', 'Japanese Sake', 'Nihonshu'],
  },
];

/** slug → Category のマップ */
export const categoryBySlug = Object.fromEntries(
  categories.map(c => [c.slug, c])
) as Record<string, Category>;

/** product の category/tab フィールドからスラッグを解決 */
export function resolveSlug(category?: string, tab?: string): string | undefined {
  const needle = [category, tab].filter(Boolean).map(s => s!.toLowerCase());
  for (const cat of categories) {
    if (cat.matches.some(m => needle.includes(m.toLowerCase()))) {
      return cat.slug;
    }
  }
  return undefined;
}
