
import { FoodItem } from '../types';
import { db } from '../services/db';

/**
 * Checks a list of food items for expiry.
 * If an item is expired and its status is 'available', it updates the status to 'expired' in the database.
 * Returns the updated list of food items.
 */
export const checkAndExpireItems = async (items: FoodItem[]): Promise<FoodItem[]> => {
  const now = new Date();
  
  return await Promise.all(items.map(async (item) => {
    if (item.status === 'available' && item.distributionEnd) {
      const expiryDate = new Date(item.distributionEnd);
      if (expiryDate < now) {
        try {
          // Update status to expired in database
          await db.updateFoodItem({ ...item, status: 'expired' });
          return { ...item, status: 'expired' as const };
        } catch (e) {
          console.error("Failed to auto-expire item:", item.id, e);
        }
      }
    }
    return item;
  }));
};
