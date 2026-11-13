import { currentSeason } from './season'
import type { Availability, Product, Season } from '../types/product'

const kgPacks = [
  { id: '1kg', label: '1 кг', kg: 1 },
  { id: '5kg', label: 'Сітка 5 кг', kg: 5 },
]

const berryPacks = [
  { id: '0.5kg', label: '0,5 кг', kg: 0.5 },
  { id: '1kg', label: '1 кг', kg: 1 },
]

const seedlingPacks = [
  { id: '10pcs', label: '10 шт' },
  { id: '20pcs', label: '20 шт' },
  { id: '50pcs', label: '50 шт' },
]

export const products: Product[] = [
  {
    slug: 'yabluka',
    name: 'Яблука',
    category: 'fruits',
    shortDescription: 'Сім сортів із нашого саду — від солодких до кислуватих.',
    description:
      'Яблука з сімейного саду в Милушах. Збираємо вручну в сезон достигання. Обирайте сорт і фасування — підготуємо свіжу партію під ваше замовлення.',
    images: ['/images/apples-1.svg', '/images/apples-2.svg', '/images/apples-3.svg'],
    pricePerKg: 35,
    unit: 'kg',
    availability: 'in_stock',
    seasons: ['autumn', 'winter'],
    featured: true,
    variants: [
      { id: 'golden', name: 'Голден Делішес', note: 'Солодкі, жовті, для десерту' },
      { id: 'jonathan', name: 'Джонатан', note: 'Класичний кисло-солодкий смак' },
      { id: 'idared', name: 'Айдаред', note: 'Соковиті, добре лежать' },
      { id: 'champion', name: 'Чемпіон', note: 'Ніжні, ароматні' },
      { id: 'gloster', name: 'Глостер', note: 'Хрусткі, з насиченим смаком' },
      { id: 'ligol', name: 'Ліголь', note: 'Великі, соковиті плоди' },
      { id: 'simirenko', name: 'Ренет Сіміренка', note: 'Зелені, освіжаючі, для пирогів' },
    ],
    packs: [
      { id: '1kg', label: '1 кг', kg: 1 },
      { id: '5kg', label: 'Сітка 5 кг', kg: 5 },
      { id: '10kg', label: 'Сітка 10 кг', kg: 10 },
      { id: 'box', label: 'Ящик ~20 кг', kg: 20 },
    ],
  },
  {
    slug: 'grushi',
    name: 'Груші',
    category: 'fruits',
    shortDescription: 'Соковиті груші осіннього врожаю.',
    description:
      'Груші з нашого саду — м’які, ароматні, ідеальні для свіжого споживання й компотів. Кількість обмежена сезоном.',
    images: ['/images/pears.svg'],
    pricePerKg: 45,
    unit: 'kg',
    availability: 'in_stock',
    seasons: ['autumn'],
    featured: true,
    packs: kgPacks,
  },
  {
    slug: 'chereshnia',
    name: 'Черешня',
    category: 'fruits',
    shortDescription: 'Солодка черешня літнього збору.',
    description:
      'Черешня з саду в Милушах. Збираємо стиглою — краще забирати в день збору. Ціна й фото — орієнтовні, уточнюємо в сезон.',
    images: ['/images/cherries.svg'],
    pricePerKg: 90,
    unit: 'kg',
    availability: 'in_stock',
    seasons: ['summer'],
    packs: berryPacks,
  },
  {
    slug: 'vyshnia',
    name: 'Вишня',
    category: 'fruits',
    shortDescription: 'Кисло-солодка вишня для варення й пирогів.',
    description:
      'Вишня з наших дерев. Ідеальна для компотів, варення й свіжого споживання. Плейсхолдер ціни — оновимо в сезон.',
    images: ['/images/sour-cherries.svg'],
    pricePerKg: 70,
    unit: 'kg',
    availability: 'in_stock',
    seasons: ['summer'],
    packs: berryPacks,
  },
  {
    slug: 'smorodyna',
    name: 'Смородина',
    category: 'berries',
    shortDescription: 'Чорна й червона смородина з кущів.',
    description:
      'Смородина з наших кущів — для варення, заморозки й свіжих десертів. Фото та ціна — плейсхолдери до сезону.',
    images: ['/images/currant.svg'],
    pricePerKg: 80,
    unit: 'kg',
    availability: 'in_stock',
    seasons: ['summer'],
    packs: berryPacks,
  },
  {
    slug: 'agrus',
    name: 'Аґрус',
    category: 'berries',
    shortDescription: 'Ароматний аґрус літнього сезону.',
    description:
      'Аґрус з городу в Милушах. Соковитий, з характерною кислинкою. Наявність лише в короткий сезон.',
    images: ['/images/gooseberry.svg'],
    pricePerKg: 75,
    unit: 'kg',
    availability: 'in_stock',
    seasons: ['summer'],
    packs: berryPacks,
  },
  {
    slug: 'malyna',
    name: 'Малина',
    category: 'berries',
    shortDescription: 'Ароматна малина для варення й десертів.',
    description:
      'Малина з наших кущів. Ніжна ягода — краще забирати в день збору.',
    images: ['/images/raspberries.svg'],
    pricePerKg: 150,
    unit: 'kg',
    availability: 'in_stock',
    seasons: ['summer'],
    featured: true,
    packs: berryPacks,
  },
  {
    slug: 'polunytsia',
    name: 'Полуниця',
    category: 'berries',
    shortDescription: 'Сезонна полуниця з грядки.',
    description:
      'Полуниця збирається вранці в день видачі. Солодка, ароматна — лише в свій короткий сезон.',
    images: ['/images/strawberries.svg'],
    pricePerKg: 120,
    unit: 'kg',
    availability: 'in_stock',
    seasons: ['summer'],
    featured: true,
    packs: [
      { id: '1kg', label: '1 кг', kg: 1 },
      { id: '2kg', label: '2 кг', kg: 2 },
    ],
  },
  {
    slug: 'lokhyna',
    name: 'Лохина',
    category: 'berries',
    shortDescription: 'Солодка лохина з наших кущів.',
    description:
      'Лохина — ніжні ягоди для свіжого споживання й заморозки. Ціна орієнтовна, підтверджуємо в сезон.',
    images: ['/images/blueberry.svg'],
    pricePerKg: 200,
    unit: 'kg',
    availability: 'in_stock',
    seasons: ['summer'],
    packs: berryPacks,
  },
  {
    slug: 'ogirky',
    name: 'Огірки',
    category: 'vegetables',
    shortDescription: 'Хрусткі огірки з городу.',
    description:
      'Огірки з грядок у Милушах — для салатів і засолювання. Збираємо регулярно влітку.',
    images: ['/images/cucumbers.svg'],
    pricePerKg: 30,
    unit: 'kg',
    availability: 'in_stock',
    seasons: ['summer'],
    packs: kgPacks,
  },
  {
    slug: 'pomidory',
    name: 'Помідори',
    category: 'vegetables',
    shortDescription: 'Стиглі помідори з городу.',
    description:
      'Помідори з наших теплиць і відкритого ґрунту. Сорти для салату й заготівель. Сезон — літо та рання осінь.',
    images: ['/images/tomatoes.svg'],
    pricePerKg: 40,
    unit: 'kg',
    availability: 'in_stock',
    seasons: ['summer', 'autumn'],
    featured: true,
    packs: kgPacks,
  },
  {
    slug: 'perets',
    name: 'Перець',
    category: 'vegetables',
    shortDescription: 'Солодкий перець з грядок.',
    description:
      'Перець болгарський із городу в Милушах. Соковитий, підходить для фарширування й свіжих страв.',
    images: ['/images/peppers.svg'],
    pricePerKg: 50,
    unit: 'kg',
    availability: 'in_stock',
    seasons: ['summer', 'autumn'],
    featured: true,
    packs: kgPacks,
  },
  {
    slug: 'rozsada-pomidory',
    name: 'Розсада помідорів',
    category: 'seedlings',
    shortDescription: 'Міцна розсада помідорів для висадки.',
    description:
      'Розсада помідорів власного вирощування. Готова до висадки навесні. Сорти й наявність уточнюємо під замовлення.',
    images: ['/images/seedlings.svg'],
    pricePerKg: 15,
    unit: 'pcs',
    availability: 'in_stock',
    seasons: ['spring'],
    featured: true,
    packs: seedlingPacks,
  },
  {
    slug: 'rozsada-perets',
    name: 'Розсада перцю',
    category: 'seedlings',
    shortDescription: 'Розсада солодкого перцю.',
    description:
      'Розсада перцю для городу. Загартована, готова до висадки. Наявність — у весняний сезон.',
    images: ['/images/seedlings.svg'],
    pricePerKg: 12,
    unit: 'pcs',
    availability: 'in_stock',
    seasons: ['spring'],
    featured: true,
    packs: seedlingPacks,
  },
  {
    slug: 'rozsada-kabachky',
    name: 'Розсада кабачків',
    category: 'seedlings',
    shortDescription: 'Розсада кабачків під попереднє замовлення.',
    description:
      'Розсаду кабачків вирощуємо під попереднє замовлення. Напишіть заздалегідь — підготуємо партію до потрібної дати.',
    images: ['/images/seedlings.svg'],
    pricePerKg: 10,
    unit: 'pcs',
    availability: 'limited',
    preorder: true,
    seasons: ['spring'],
    packs: seedlingPacks,
  },
  {
    slug: 'rozsada-ogirky',
    name: 'Розсада огірків',
    category: 'seedlings',
    shortDescription: 'Розсада огірків під попереднє замовлення.',
    description:
      'Огіркову розсаду готуємо під попереднє замовлення. Узгоджуємо сорт і кількість до висадки.',
    images: ['/images/seedlings.svg'],
    pricePerKg: 10,
    unit: 'pcs',
    availability: 'limited',
    preorder: true,
    seasons: ['spring'],
    packs: seedlingPacks,
  },
  {
    slug: 'rozsada-baklazhany',
    name: 'Розсада баклажанів',
    category: 'seedlings',
    shortDescription: 'Розсада баклажанів під попереднє замовлення.',
    description:
      'Баклажани вирощуємо на замовлення. Залиште запит навесні — підготуємо розсаду до висадки.',
    images: ['/images/seedlings.svg'],
    pricePerKg: 12,
    unit: 'pcs',
    availability: 'limited',
    preorder: true,
    seasons: ['spring'],
    packs: seedlingPacks,
  },
  {
    slug: 'varennia-yabluchne',
    name: 'Варення яблучне',
    category: 'preserves',
    shortDescription: 'Домашнє варення з наших яблук.',
    description:
      'Варимо невеликими партіями з яблук власного саду. Банка 0,5 л — для чаю й млинців.',
    images: ['/images/jam.svg'],
    pricePerKg: 95,
    unit: 'jar',
    availability: 'in_stock',
    featured: true,
    packs: [{ id: 'jar05', label: 'Банка 0,5 л' }],
  },
  {
    slug: 'sik-yabluchnyi',
    name: 'Сік яблучний',
    category: 'preserves',
    shortDescription: 'Прямий віджим без концентратів.',
    description:
      'Яблучний сік прямого віджиму з осіннього врожаю. Пастеризований, без цукру.',
    images: ['/images/juice.svg'],
    pricePerKg: 70,
    unit: 'jar',
    availability: 'in_stock',
    packs: [{ id: 'jar1', label: 'Банка 1 л' }],
  },
  {
    slug: 'med',
    name: 'Мед квітковий',
    category: 'other',
    shortDescription: 'Місцевий мед від пасічника-партнера.',
    description:
      'Квітковий мед із Волині — від пасічника, з яким працюємо не перший сезон. Густий, ароматний, у скляній банці.',
    images: ['/images/honey.svg'],
    pricePerKg: 180,
    unit: 'jar',
    availability: 'in_stock',
    featured: true,
    packs: [
      { id: 'jar05', label: 'Банка 0,5 л' },
      { id: 'jar1', label: 'Банка 1 л' },
    ],
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function isInCurrentSeason(product: Product, season: Season = currentSeason): boolean {
  if (!product.seasons || product.seasons.length === 0) return true
  return product.seasons.includes(season)
}

export function getEffectiveAvailability(
  product: Product,
  season: Season = currentSeason,
): Availability {
  if (!isInCurrentSeason(product, season)) return 'out_of_stock'
  return product.availability
}

export function isAvailableNow(product: Product, season: Season = currentSeason): boolean {
  const availability = getEffectiveAvailability(product, season)
  return availability === 'in_stock' || availability === 'limited'
}

export function getProductsForCurrentSeason(season: Season = currentSeason): Product[] {
  return products.filter((p) => isAvailableNow(p, season))
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured && isAvailableNow(p))
}

export function getProductsByCategory(category: Product['category'] | 'all'): Product[] {
  if (category === 'all') return products
  return products.filter((p) => p.category === category)
}
