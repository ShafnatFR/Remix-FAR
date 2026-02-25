
import { FoodItem, UserData, ClaimHistoryItem, FAQItem, BroadcastMessage, Address, Badge } from '../types';

/**
 * URL Google Apps Script Web App.
 * PENTING: Ganti string ini dengan URL Web App Anda sendiri yang BARU setelah melakukan Deploy!
 */
const API_URL = "https://script.google.com/macros/s/AKfycbxX5EkIowM4mWJ6LdE9d_Fl5eTIuDe7KRPe9-5gmOO1XBogTtluhgNnKanO2w96Weph/exec";

const sendRequest = async <T>(action: string, data: any = {}): Promise<T> => {
  console.log(`%c[API REQUEST] ${action}`, 'color: blue; font-weight: bold;', data);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action, data }),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    let json;

    try {
      json = JSON.parse(text);
    } catch (e) {
      console.error(`%c[API PARSE ERROR] ${action}`, 'color: red; font-weight: bold;', "Raw text:", text);
      if (text.trim().startsWith('<')) {
        throw new Error("Server Error: Check Deployment URL. Make sure it ends in /exec and permissions are set to 'Anyone'.");
      }
      throw new Error("Server Error: Received invalid response from backend.");
    }

    if (json.status === 'error') {
      console.error(`%c[API BACKEND ERROR] ${action}`, 'color: red; font-weight: bold;', json.message);
      throw new Error(json.message || "Unknown server error");
    }

    console.log(`%c[API SUCCESS] ${action}`, 'color: green; font-weight: bold;', json.data);
    return json.data;
  } catch (error: any) {
    console.error(`%c[API NETWORK/CLIENT ERROR] ${action}`, 'color: red; font-weight: bold;', error);
    throw error;
  }
};

export const db = {
  // --- USERS ---
  registerUser: (userData: any) => sendRequest<UserData>('REGISTER_USER', userData),
  loginUser: (credentials: any) => sendRequest<UserData>('LOGIN_USER', credentials),
  getUsers: () => sendRequest<UserData[]>('GET_USERS'),
  upsertUser: (user: UserData) => sendRequest<UserData>('UPSERT_USER', user),

  // --- ADDRESSES ---
  getAddresses: (userId?: string) => sendRequest<Address[]>('GET_ADDRESSES', { userId }),
  addAddress: (address: Address) => sendRequest<Address>('ADD_ADDRESS', address),
  updateAddress: (address: Address) => sendRequest<Address>('UPDATE_ADDRESS', address),
  deleteAddress: (id: string) => sendRequest<any>('DELETE_ADDRESS', { id }),

  // --- INVENTORY ---
  getInventory: (providerId?: string) => sendRequest<FoodItem[]>('GET_INVENTORY', { providerId }),
  addFoodItem: (item: FoodItem) => sendRequest<FoodItem>('ADD_FOOD_ITEM', item),
  updateFoodStock: (id: string, newQuantity: number) => sendRequest<any>('UPDATE_FOOD_STOCK', { id, newQuantity }),
  updateFoodItem: (item: FoodItem) => sendRequest<FoodItem>('UPDATE_FOOD_ITEM', item),
  deleteFoodItem: (id: string) => sendRequest<any>('DELETE_FOOD_ITEM', { id }),

  uploadImage: (base64: string, filename?: string, folderType: string = 'inventory') =>
    sendRequest<string>('UPLOAD_IMAGE', { base64, filename, folderType }),

  // --- CLAIMS ---
  getClaims: (filters: { providerId?: string, receiverId?: string } = {}) => sendRequest<ClaimHistoryItem[]>('GET_CLAIMS', filters),
  addClaim: (claim: ClaimHistoryItem) => sendRequest<ClaimHistoryItem>('ADD_CLAIM', claim),
  processClaimTransaction: (foodId: string, quantityToReduce: number, claimData: ClaimHistoryItem) =>
    sendRequest<any>('PROCESS_CLAIM', { foodId, quantityToReduce, claimData }),
  updateClaimStatus: (id: string, status: string, additionalData?: any) =>
    sendRequest<any>('UPDATE_CLAIM_STATUS', { id, status, additionalData }),

  // --- FEATURES ---
  submitReview: (claimId: string, rating: number, review: string, reviewMedia?: string[]) =>
    sendRequest<any>('SUBMIT_REVIEW', { claimId, rating, review, reviewMedia }),

  submitReport: (claimId: string, reason: string, description: string, evidence?: string | string[]) =>
    sendRequest<any>('SUBMIT_REPORT', { claimId, reason, description, evidence }),

  verifyOrderQR: (uniqueCode: string, providerName?: string) =>
    sendRequest<any>('VERIFY_ORDER_QR', { uniqueCode, scannedByProviderName: providerName }),

  getProviderDashboard: (providerName: string) =>
    sendRequest<any>('GET_PROVIDER_DASHBOARD', { providerName }),
  respondReport: (reportId: string, status: 'resolved' | 'dismissed') =>
    sendRequest<any>('RESPOND_REPORT', { id: reportId, status }),

  // --- UTILS ---
  getFAQs: () => sendRequest<FAQItem[]>('GET_FAQS'),
  upsertFAQ: (faq: FAQItem) => sendRequest<FAQItem>('UPSERT_FAQ', faq),
  deleteFAQ: (id: string) => sendRequest<any>('DELETE_FAQ', { id }),
  getBroadcasts: () => sendRequest<BroadcastMessage[]>('GET_NOTIFICATIONS'),
  sendBroadcast: (message: BroadcastMessage) => sendRequest<BroadcastMessage>('SEND_BROADCAST', message),

  // --- BADGES ---
  getBadges: () => sendRequest<Badge[]>('GET_BADGES'),
  upsertBadge: (badge: Badge) => sendRequest<Badge>('UPSERT_BADGE', badge),
  deleteBadge: (id: string) => sendRequest<any>('DELETE_BADGE', { id }),

  initDB: () => sendRequest<string>('INIT_DB'),
};
