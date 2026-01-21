import { seedProduct } from './product.seed';

async function seeder() {
  try {
    await seedProduct();
    console.log('seeding successful');
  } catch (error) {
    console.error('Seed failed:', error);
  }
}

seeder().catch((error) => {
  console.error('Seed process failed:', error);
});
