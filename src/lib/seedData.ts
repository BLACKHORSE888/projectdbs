import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Product } from '../types';

export const SAMPLE_PRODUCTS: Omit<Product, 'id' | 'createdAt'>[] = [
  {
    name: 'Masala Ragi Chips',
    slug: 'masala-ragi-chips',
    description:
      'Crispy, oven-baked whole-grain Finger Millet (Ragi) chips tossed in roasted cumin, dry mango, and classic Indian street spices. High in calcium and natural fiber—zero maida, zero deep-frying.',
    flavour: 'Desi Masala',
    milletType: 'Ragi (Finger Millet)',
    price: 250,
    trialPrice: 79,
    weightGrams: 200,
    trialWeightGrams: 50,
    images: ['/src/assets/images/product_ragi_chips_1795195409071.jpg'],
    ingredients: [
      'Whole-grain Ragi Flour (62%)',
      'Chickpea (Besan) Flour',
      'Cold-Pressed Rice Bran Oil',
      'Desi Masala Blend (Cumin, Coriander, Dry Mango, Black Salt, Kashmiri Chilli)',
      'Rock Salt',
    ],
    nutrition: {
      servingSize: '100g',
      energyKcal: 412,
      proteinG: 9.8,
      carbsG: 67.5,
      fiberG: 10.4,
      fatG: 11.2,
      saturatedFatG: 1.9,
      sodiumMg: 460,
    },
    stock: 85,
    featured: true,
  },
  {
    name: 'Jowar Peri-Peri Puffs',
    slug: 'jowar-peri-peri-puffs',
    description:
      'Air-popped and slow-baked Sorghum (Jowar) puffs dusted with zesty bird’s eye chilli, garlic, and tangy citrus herbs. Light, addictive crunch built for late-night study sessions and desk cravings.',
    flavour: 'Peri-Peri',
    milletType: 'Jowar (Sorghum)',
    price: 250,
    trialPrice: 79,
    weightGrams: 200,
    trialWeightGrams: 50,
    images: ['/src/assets/images/product_jowar_puffs_1795195409349.jpg'],
    ingredients: [
      'Whole-grain Jowar Grit (68%)',
      'Yellow Corn Meal',
      'Cold-Pressed Sunflower Oil',
      'Peri-Peri Seasoning (Paprika, Bird’s Eye Chilli, Garlic, Oregano, Lemon Powder)',
      'Iodized Sea Salt',
    ],
    nutrition: {
      servingSize: '100g',
      energyKcal: 398,
      proteinG: 10.5,
      carbsG: 69.2,
      fiberG: 8.9,
      fatG: 8.6,
      saturatedFatG: 1.4,
      sodiumMg: 490,
    },
    stock: 72,
    featured: true,
  },
  {
    name: 'Bajra Cheese Crunch',
    slug: 'bajra-cheese-crunch',
    description:
      'Wholesome Pearl Millet (Bajra) baked crisps coated with real cheddar cheese powder and cracked black pepper. Rich, savoury comfort snacking without palm oil or synthetic cheese flavours.',
    flavour: 'Cheese & Herb',
    milletType: 'Bajra (Pearl Millet)',
    price: 250,
    trialPrice: 79,
    weightGrams: 200,
    trialWeightGrams: 50,
    images: ['/src/assets/images/product_bajra_crunch_1795195409092.jpg'],
    ingredients: [
      'Whole-grain Bajra Flour (60%)',
      'Whole Moong Dal Flour',
      'Cold-Pressed Groundnut Oil',
      'Real Cheddar Cheese Solids',
      'Parsley, Cracked Black Pepper & Sea Salt',
    ],
    nutrition: {
      servingSize: '100g',
      energyKcal: 424,
      proteinG: 11.4,
      carbsG: 64.0,
      fiberG: 9.6,
      fatG: 13.1,
      saturatedFatG: 3.1,
      sodiumMg: 510,
    },
    stock: 64,
    featured: true,
  },
];

export const seedSampleProducts = async (): Promise<{ inserted: number; skipped: boolean }> => {
  const productsRef = collection(db, 'products');
  try {
    const existing = await getDocs(productsRef);
    if (!existing.empty) {
      return { inserted: 0, skipped: true };
    }

    let inserted = 0;
    for (const product of SAMPLE_PRODUCTS) {
      await addDoc(productsRef, {
        ...product,
        createdAt: serverTimestamp(),
      });
      inserted += 1;
    }

    return { inserted, skipped: false };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'products');
  }
};
