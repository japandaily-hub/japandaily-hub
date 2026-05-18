export interface Category {
  slug: string;
  nameJa: string;
  nameEn: string;
  icon: string;
  iconPath: string; // SVG <path d="..."> — viewBox 0 0 48 48, stroke-based
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
    iconPath: 'M10,30 C10,40 38,40 38,30 L36,26 C30,22 18,22 12,26 Z M12,26 C12,18 36,18 36,26 M20,18 L17,9 M28,18 L31,9',
    descJa: 'お茶・調味料・お菒子・レトルト',
    descEn: 'Tea, seasonings, snacks & instant meals',
    matches: ['food', 'Food', 'food & drink', 'Beverage'],
  },
  {
    slug: 'beauty',
    nameJa: '美容・スキンケア',
    nameEn: 'Beauty & Skincare',
    icon: '✨',
    iconPath: 'M24,38 C14,36 8,28 10,18 C12,10 18,6 24,6 C30,6 36,10 38,18 C40,28 34,36 24,38 Z M24,28 C20,28 16,25 16,21 C16,17 20,14 24,14 C28,14 32,17 32,21 C32,25 28,28 24,28 Z M24,38 L24,44',
    descJa: '化粧品・日焦け止め・スキンケア',
    descEn: 'Cosmetics, sunscreen & skincare',
    matches: ['beauty', 'Beauty', 'Cosmetics', 'Skincare'],
  },
  {
    slug: 'daily',
    nameJa: '生活雑貨',
    nameEn: 'Daily Goods',
    icon: '🏠',
    iconPath: 'M4,22 L24,6 L44,22 M8,22 L8,44 L40,44 L40,22 M18,44 L18,30 L30,30 L30,44 M24,6 L24,2',
    descJa: '掃除・収納・キッチン用品',
    descEn: 'Cleaning, storage & kitchen essentials',
    matches: ['daily', 'Daily Goods', 'Kitchen', 'Household'],
  },
  {
    slug: 'health',
    nameJa: '医療・健康',
    nameEn: 'Health & Wellness',
    icon: '💊',
    iconPath: 'M24,42 C12,38 8,28 10,16 C12,8 18,4 24,4 C30,4 36,8 38,16 C40,28 36,38 24,42 Z M24,42 L24,4 M14,20 Q20,22 24,20 Q28,18 34,20 M16,30 Q20,32 24,30 Q28,28 32,30',
    descJa: 'サプリ・衛生用品・医薬品',
    descEn: 'Supplements, hygiene & medical supplies',
    matches: ['health', 'Health', 'Medical', 'Wellness', 'Pharmacy'],
  },
  {
    slug: 'hobby',
    nameJa: '趣味・ホビー',
    nameEn: 'Hobby',
    icon: '🎨',
    iconPath: 'M20,4 L28,4 L28,28 C28,34 26,38 24,40 C22,38 20,34 20,28 Z M20,4 L20,28 M28,4 L28,28 M18,30 C18,30 24,34 30,30',
    descJa: 'ゲーム・アート・コレクション',
    descEn: 'Games, art supplies & collectibles',
    matches: ['hobby', 'Hobby', 'Anime', 'Manga', 'Gaming'],
  },
  {
    slug: 'fashion',
    nameJa: 'ファッション',
    nameEn: 'Fashion',
    icon: '👘',
    iconPath: 'M24,8 L12,18 L10,44 M24,8 L36,18 L38,44 M12,18 Q24,28 36,18 M4,22 L12,18 M44,22 L36,18 M10,44 L38,44',
    descJa: '衣類・靴・バッグ・アクセサリー',
    descEn: 'Clothing, shoes, bags & accessories',
    matches: ['fashion', 'Fashion', 'Clothing', 'Apparel'],
  },
  {
    slug: 'tech',
    nameJa: '家電・テック',
    nameEn: 'Electronics & Tech',
    icon: '📱',
    iconPath: 'M18,4 L30,4 M18,4 L12,42 L36,42 L30,4 M16,14 L32,14 M14,24 L34,24 M12,34 L36,34 M24,4 L24,1',
    descJa: 'ガジェット・家電・スマートデバイス',
    descEn: 'Gadgets, appliances & smart devices',
    matches: ['tech', 'Electronics', 'Technology', 'Gadget', 'Appliance'],
  },
  {
    slug: 'sports',
    nameJa: 'スポーツ・アウトドア',
    nameEn: 'Sports & Outdoor',
    icon: '🏃',
    iconPath: 'M14,4 C6,16 6,32 14,44 M14,4 L14,44 M14,24 L34,24 M30,19 L34,24 L30,29',
    descJa: 'フィットネス・キャンプ・登山',
    descEn: 'Fitness, camping & outdoor gear',
    matches: ['sports', 'Sports', 'Outdoor', 'Fitness', 'Camping'],
  },
  {
    slug: 'baby',
    nameJa: 'ベビー・キッズ',
    nameEn: 'Baby & Kids',
    icon: '👶',
    iconPath: 'M24,6 L40,26 L24,22 L8,26 Z M24,22 L24,42 M24,42 L19,36 M24,42 L29,36 M24,6 L20,14 M24,6 L28,14',
    descJa: 'おもちゃ・育児グッズ・子ども服',
    descEn: 'Toys, baby care & children\'s clothing',
    matches: ['baby', 'Baby', 'Kids', 'Children', 'Toy'],
  },
  {
    slug: 'pet',
    nameJa: 'ペット用品',
    nameEn: 'Pet Supplies',
    icon: '🐾',
    iconPath: 'M24,38 C14,38 8,30 8,20 C8,10 14,6 24,6 C34,6 40,10 40,20 C40,30 34,38 24,38 Z M16,6 L13,2 M32,6 L35,2 M18,20 A2.5,2.5 0 1 1 18,20.1 M30,20 A2.5,2.5 0 1 1 30,20.1 M20,28 Q24,33 28,28 M14,18 L8,16 M34,18 L40,16 M14,22 L8,22 M34,22 L40,22',
    descJa: 'ペットフード・グッズ・ケア用品',
    descEn: 'Pet food, accessories & grooming',
    matches: ['pet', 'Pet', 'Pet Supplies', 'Animal'],
  },
  {
    slug: 'stationery',
    nameJa: '文具・オフィス',
    nameEn: 'Stationery & Office',
    icon: '✏️',
    iconPath: 'M30,6 L36,12 L18,38 L10,44 L14,36 Z M30,6 L36,12 M22,10 L34,22 M14,36 L10,44 L18,40 Z',
    descJa: 'ノート・ペン・デスク・文房具',
    descEn: 'Notebooks, pens & desk accessories',
    matches: ['stationery', 'Stationery', 'Office', 'Pen', 'Notebook'],
  },
  {
    slug: 'travel',
    nameJa: '旅行・トラベル',
    nameEn: 'Travel',
    icon: '✈️',
    iconPath: 'M4,18 L44,18 M6,14 L42,14 M6,14 L4,20 M42,14 L44,20 M12,18 L12,46 M36,18 L36,46',
    descJa: 'トラベルバッグ・旅行グッズ',
    descEn: 'Luggage, travel bags & accessories',
    matches: ['travel', 'Travel', 'Luggage', 'Bag'],
  },
  {
    slug: 'whisky',
    nameJa: '日本のウイスキー',
    nameEn: 'Japanese Whisky',
    icon: '🥃',
    iconPath: 'M8,10 L40,10 L40,42 L8,42 Z M8,10 L20,20 M40,10 L28,20 M40,42 L28,32 M8,42 L20,32 M20,20 L28,20 L28,32 L20,32 Z',
    descJa: '山崎・響・白州など本格派ウイスキー',
    descEn: 'Yamazaki, Hibiki, Hakushu & more',
    matches: ['whisky', 'Whisky', 'Whiskey', 'Japanese Whisky', 'Bourbon'],
  },
  {
    slug: 'sake',
    nameJa: '日本酒',
    nameEn: 'Japanese Sake',
    icon: '🍶',
    iconPath: 'M20,8 Q14,8 12,14 Q10,20 10,26 Q8,32 8,38 Q8,46 24,46 Q40,46 40,38 Q40,32 38,26 Q38,20 36,14 Q34,8 28,8 Z M18,12 Q24,10 30,12 M22,8 L22,4 L26,4 L26,8',
    descJa: '純米酒・大吸蔻・地酒',
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
