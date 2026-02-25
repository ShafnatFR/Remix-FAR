
/**
 * FOOD AI RESCUE - BACKEND ENGINE (GAS)
 * Database: Google Sheets
 * Mode: Real Database Operations Only (No Mock/Hardcode)
 */

const SPREADSHEET_ID = "1alCnKz1KjAVEttY7Ysm_itD3JN5pgMZdCpjAsNfkG2w";

const FOLDER_IDS = {
  'reports': '1vEXw6kam-pmojsXt88DcijCKbIWU5D2D',
  'inventory': '1jo-hZaHych0T3iYAFT6kK1HsbLnsulOb',
  'reviews': '1xkc3lN58MavtWZE_eW67nzvjTNExAaZM',
  'assets': '1mfuQK104s6jK7FIs5aqyiOQJ14U9un3Z',
  'profiles': '1uHMoLe7Juy4ASBBCYBUCM0Ent837SezV',
  'food_backup': '1qlJMUWSj_O37WdLaYHiWnZInXUV9RRzj'
};

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ 
    status: 'online', 
    message: 'Backend Active & Connected to DB' 
  })).setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(30000); 

  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("No data received");
    }

    const request = JSON.parse(e.postData.contents);
    const action = request.action;
    const data = request.data;
    
    const ss = getSpreadsheet();
    let result;
    
    switch (action) {
      // --- AUTH & USERS ---
      case 'REGISTER_USER': result = registerUser(ss, data); break;
      case 'LOGIN_USER': result = loginUser(ss, data); break; 
      case 'GET_USERS': result = getAllData(ss, 'Users'); break;
      case 'UPSERT_USER': result = upsertData(ss, 'Users', data); break;
      
      // --- ADDRESSES ---
      case 'GET_ADDRESSES': result = getAddresses(ss, data.userId); break;
      case 'ADD_ADDRESS': result = addAddress(ss, data); break;
      case 'UPDATE_ADDRESS': result = updateAddress(ss, data); break;
      case 'DELETE_ADDRESS': result = deleteData(ss, 'Addresses', data.id); break;

      // --- INVENTORY ---
      case 'GET_INVENTORY': result = getInventoryWithLocation(ss, data.providerId); break; 
      case 'ADD_FOOD_ITEM': result = addData(ss, 'Inventory', data); break; 
      case 'UPDATE_FOOD_STOCK': result = updateFoodStock(ss, data.id, data.newQuantity); break;
      case 'UPDATE_FOOD_ITEM': result = updateFoodItem(ss, data); break;
      case 'DELETE_FOOD_ITEM': result = deleteData(ss, 'Inventory', data.id); break;
      
      // --- TRANSACTIONS ---
      case 'GET_CLAIMS': result = getClaims(ss, data.providerId, data.receiverId); break; 
      case 'PROCESS_CLAIM': result = claimFoodTransaction(ss, data); break; 
      case 'UPDATE_CLAIM_STATUS': result = updateClaimStatus(ss, data.claimId || data.id, data.status, data.additionalData); break;
      case 'VERIFY_ORDER_QR': result = verifyOrderQR(ss, data); break;
      case 'SUBMIT_REVIEW': result = submitReview(ss, data); break;
      case 'SUBMIT_REPORT': result = submitReport(ss, data); break;
      case 'RESPOND_REPORT': result = respondReport(ss, data.id, data.status); break;
      
      // --- UTILS ---
      case 'UPLOAD_IMAGE': result = uploadImageToDrive(data.base64, data.filename, data.folderType); break;
      case 'GET_FAQS': result = getAllData(ss, 'FAQs'); break;
      case 'UPSERT_FAQ': result = upsertData(ss, 'FAQs', data); break;
      case 'DELETE_FAQ': result = deleteData(ss, 'FAQs', data.id); break;
      case 'GET_NOTIFICATIONS': result = getAllData(ss, 'Notifications'); break;
      case 'SEND_BROADCAST': result = addData(ss, 'Notifications', data); break;

      // --- BADGES ---
      case 'GET_BADGES': result = getAllData(ss, 'Badges'); break;
      case 'UPSERT_BADGE': result = upsertData(ss, 'Badges', data); break;
      case 'DELETE_BADGE': result = deleteData(ss, 'Badges', data.id); break;

      case 'INIT_DB': result = initDatabase(ss); break;
      
      default:
        throw new Error(`Action '${action}' not found`);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: result }))
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'error', 
      message: error.toString(), 
      stack: error.stack 
    })).setMimeType(ContentService.MimeType.TEXT);
  } finally {
    lock.releaseLock();
  }
}

// --- UTILS ---

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getNextId(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 1;

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idIndex = headers.indexOf('id');
  if (idIndex === -1) throw new Error("Kolom 'id' tidak ditemukan di tabel ini.");

  const idValues = sheet.getRange(2, idIndex + 1, lastRow - 1, 1).getValues().flat();
  let maxId = 0;
  for (let i = 0; i < idValues.length; i++) {
    const val = parseInt(idValues[i]);
    if (!isNaN(val)) {
      // Ignore huge timestamp-like IDs (> 1 billion) to allow recovery to small sequential IDs
      if (val > maxId && val < 1000000000) {
        maxId = val;
      }
    }
  }
  return maxId + 1;
}

// --- HASHING UTILITY (SHA-256) ---
function hashString(input) {
  if (!input) return "";
  const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input);
  let txtHash = '';
  for (let i = 0; i < rawHash.length; i++) {
    let hashVal = rawHash[i];
    if (hashVal < 0) {
      hashVal += 256;
    }
    if (hashVal.toString(16).length == 1) {
      txtHash += '0';
    }
    txtHash += hashVal.toString(16);
  }
  return txtHash;
}

// --- ADDRESS FUNCTIONS ---

function getAddresses(ss, userId) {
  if (!ss) ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Addresses');
  if (!sheet) return []; 
  
  const data = getAllData(ss, 'Addresses');
  if (!userId) return data;
  return data.filter(addr => String(addr.userId) === String(userId));
}

function addAddress(ss, data) {
  if (!ss) ss = getSpreadsheet();
  let sheet = ss.getSheetByName('Addresses');
  if (!sheet) { initDatabase(ss); sheet = ss.getSheetByName('Addresses'); }
  
  if (data.isPrimary) {
    const allData = sheet.getDataRange().getValues();
    const headers = allData[0];
    const userIdx = headers.indexOf('userId');
    const primaryIdx = headers.indexOf('isPrimary');
    for (let i = 1; i < allData.length; i++) {
      if (String(allData[i][userIdx]) === String(data.userId)) {
        sheet.getRange(i + 1, primaryIdx + 1).setValue(false);
      }
    }
  }
  const userAddresses = getAddresses(ss, data.userId);
  if (userAddresses.length === 0) {
    data.isPrimary = true;
  }
  return addData(ss, 'Addresses', data);
}

function updateAddress(ss, data) {
  if (!ss) ss = getSpreadsheet();
  let sheet = ss.getSheetByName('Addresses');
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIdx = headers.indexOf('id');
  const userIdx = headers.indexOf('userId');
  const primaryIdx = headers.indexOf('isPrimary');

  if (data.isPrimary) {
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][userIdx]) === String(data.userId) && String(values[i][idIdx]) !== String(data.id)) {
        sheet.getRange(i + 1, primaryIdx + 1).setValue(false);
      }
    }
  }

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idIdx]) === String(data.id)) {
      const updatedRow = headers.map((header, idx) => {
        let val = data[header];
        return (val !== undefined) ? ((typeof val === 'object' && val !== null) ? JSON.stringify(val) : val) : values[i][idx];
      });
      sheet.getRange(i + 1, 1, 1, headers.length).setValues([updatedRow]);
      return data;
    }
  }
  throw new Error("Alamat tidak ditemukan untuk diupdate.");
}

// --- CLAIMS FILTERING (RELATIONAL JOIN LOGIC) ---

function getClaims(ss, filterProviderId, filterReceiverId) {
  if (!ss) ss = getSpreadsheet();
  
  // 1. Ambil semua data Claims
  let claims = getAllData(ss, 'Claims');

  // --- JOIN LOGIC: USERS TABLE (New Implementation) ---
  const users = getAllData(ss, 'Users');
  const userMap = {};
  users.forEach(u => {
    if (u.id) {
       let safePhone = "";
       if (u.phone) {
         safePhone = String(u.phone).trim();
       }

       userMap[String(u.id).trim()] = {
         name: u.name,
         phone: safePhone
       };
    }
  });
  
  // 2. FETCH ADDRESSES UNTUK JOIN
  const addresses = getAllData(ss, 'Addresses');
  const addressMap = {};
  
  addresses.forEach(addr => {
    const uid = String(addr.userId).trim();
    if (!addressMap[uid]) addressMap[uid] = [];
    addressMap[uid].push(addr);
  });

  // === FILTERING BY PROVIDER ===
  if (filterProviderId) {
    const inventory = getAllData(ss, 'Inventory');
    const foodOwnerMap = {}; 
    inventory.forEach(item => {
      if (item.id != null) {
         const fId = String(item.id).trim();
         const pId = String(item.providerId).trim();
         foodOwnerMap[fId] = pId;
      }
    });
    
    const targetId = String(filterProviderId).trim();
    claims = claims.filter(c => {
      if (c.providerId && String(c.providerId).trim() === targetId) return true;
      if (c.foodId != null) {
        const foodId = String(c.foodId).trim();
        const realOwnerId = foodOwnerMap[foodId];
        if (realOwnerId && realOwnerId === targetId) return true;
      }
      return false;
    });
  }

  // === FILTERING BY RECEIVER ===
  if (filterReceiverId) {
    const targetReceiverId = String(filterReceiverId).trim();
    claims = claims.filter(c => {
      if (c.receiverId && String(c.receiverId).trim() === targetReceiverId) {
        return true;
      }
      return false;
    });
  }
  
  // 3. DATA ENRICHMENT (INJECT LOCATIONS & NAMES & PHONES)
  return claims.map(claim => {
      let resolvedReceiverName = claim.receiverName; 
      let resolvedReceiverPhone = ""; 

      if (claim.receiverId) {
          const mappedUser = userMap[String(claim.receiverId).trim()];
          if (mappedUser) {
              resolvedReceiverName = mappedUser.name;
              resolvedReceiverPhone = mappedUser.phone; 
          }
      }

      let receiverLoc = null;
      if (claim.receiverId) {
          const recAddrs = addressMap[String(claim.receiverId)] || [];
          const recPrimary = recAddrs.find(a => a.isPrimary === true || String(a.isPrimary) === 'true') || recAddrs[0];
          
          if (recPrimary) {
              receiverLoc = {
                  lat: recPrimary.lat || -6.920000,
                  lng: recPrimary.lng || 107.615000,
                  address: recPrimary.fullAddress
              };
          }
      }

      let providerLoc = claim.location; 
      if (claim.providerId) {
          const provAddrs = addressMap[String(claim.providerId)] || [];
          const provPrimary = provAddrs.find(a => a.isPrimary === true || String(a.isPrimary) === 'true') || provAddrs[0];
          
          if (provPrimary) {
              providerLoc = {
                  lat: provPrimary.lat || -6.914744,
                  lng: provPrimary.lng || 107.60981,
                  address: provPrimary.fullAddress
              };
          }
      }

      return {
          ...claim,
          receiverName: resolvedReceiverName, 
          receiverPhone: resolvedReceiverPhone,
          receiverLocation: receiverLoc, 
          providerLocation: providerLoc,
          location: providerLoc 
      };
  });
}

// --- INVENTORY JOIN LOGIC ---

function getInventoryWithLocation(ss, filterProviderId) {
  if (!ss) ss = getSpreadsheet();
  let inventory = getAllData(ss, 'Inventory');
  
  if (filterProviderId) {
    const targetId = String(filterProviderId).trim();
    inventory = inventory.filter(item => String(item.providerId).trim() === targetId);
  }

  const addresses = getAllData(ss, 'Addresses');
  const userAddressesMap = {};
  addresses.forEach(addr => {
    const uid = String(addr.userId).trim();
    if (!userAddressesMap[uid]) {
      userAddressesMap[uid] = [];
    }
    userAddressesMap[uid].push(addr);
  });
  
  return inventory.map(item => {
    const providerId = String(item.providerId).trim();
    const providerAddresses = userAddressesMap[providerId] || [];
    let locationObj = { lat: -6.914744, lng: 107.60981, address: "Lokasi Tidak Tersedia", addressId: "0" };

    if (providerAddresses.length > 0) {
      const primaryAddr = providerAddresses.find(a => a.isPrimary === true || String(a.isPrimary) === 'true');
      const selectedAddr = primaryAddr || providerAddresses[0];
      locationObj = {
        lat: -6.914744,
        lng: 107.60981,
        address: selectedAddr.fullAddress,
        addressId: selectedAddr.id
      };
    }
    item.location = locationObj;
    return item;
  });
}

// --- CORE DATABASE FUNCTIONS ---

function registerUser(ss, userData) {
  if (!ss) ss = getSpreadsheet(); 
  let sheet = ss.getSheetByName('Users');
  if (!sheet) { initDatabase(ss); sheet = ss.getSheetByName('Users'); }
  const data = sheet.getDataRange().getValues();
  const headers = data[0]; 
  const emailIndex = headers.indexOf('email');
  if (data.length > 1) {
    for (let i = 1; i < data.length; i++) {
      if (userData && userData.email && String(data[i][emailIndex]).trim().toLowerCase() === String(userData.email).trim().toLowerCase()) {
        throw new Error('Email ini sudah terdaftar.');
      }
    }
  }
  const newId = getNextId(sheet);
  
  // 1. HASHING PASSWORD
  const hashedPassword = hashString(userData.password);

  // 2. FORCE ISNEWUSER = 1 (Integer)
  const newUserStatus = 1;
  
  const newUser = { 
    id: newId, 
    name: userData.name, 
    email: userData.email, 
    role: userData.role, 
    phone: userData.phone, 
    password: hashedPassword, // Store Hash
    status: 'active', 
    points: 0, 
    joinDate: new Date().toLocaleDateString('id-ID'), 
    avatar: userData.avatar || '',
    isNewUser: newUserStatus // Save as 1
  };
  
  const row = headers.map(header => (newUser[header] === undefined || newUser[header] === null ? "" : newUser[header]));
  sheet.appendRow(row);
  const safeUser = { ...newUser };
  delete safeUser.password;
  // Convert 1 back to boolean for frontend consistency response
  safeUser.isNewUser = true; 
  return safeUser;
}

function loginUser(ss, loginData) {
  if (!ss) ss = getSpreadsheet(); 
  const sheet = ss.getSheetByName('Users');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const emailIndex = headers.indexOf('email');
  const passIndex = headers.indexOf('password');
  
  // HASH INPUT PASSWORD UNTUK DICOCOKKAN
  const inputHash = hashString(loginData.password);

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][emailIndex]).toLowerCase() === String(loginData.email).toLowerCase()) {
      const storedPass = String(data[i][passIndex]);
      
      // CHECK MATCH: Support Legacy (Plain Text) OR Secure (Hash)
      if (storedPass === loginData.password || storedPass === inputHash) {
        let userObj = {};
        headers.forEach((h, idx) => { 
            if (h !== 'password') {
                userObj[h] = data[i][idx]; 
            }
        });
        
        // Normalize isNewUser from 1/0 to boolean for frontend
        const isNewUserVal = data[i][headers.indexOf('isNewUser')];
        userObj.isNewUser = (String(isNewUserVal) === '1' || isNewUserVal === 1 || String(isNewUserVal).toLowerCase() === 'true');

        return userObj;
      } else { throw new Error('Password salah.'); }
    }
  }
  throw new Error('Email tidak ditemukan.');
}

function upsertData(ss, sheetName, data) {
  if (!ss) ss = getSpreadsheet(); 
  let sheet = ss.getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('id');
  let rowIndex = -1;
  let existingRow = [];
  
  if (data.id && data.id !== 'new') {
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][idIndex]) === String(data.id)) {
        rowIndex = i + 1;
        existingRow = values[i];
        break;
      }
    }
  }
  
  if (rowIndex === -1) {
    const newId = getNextId(sheet);
    data.id = newId;
  }
  
  const rowData = headers.map((header, idx) => {
    const headerKey = String(header).trim();
    let val = data[headerKey];

    // HANDLE PASSWORD HASHING ON UPDATE
    if (headerKey === 'password') {
       if (val) {
         // Jika ada nilai password baru dikirim, hash dulu
         val = hashString(val);
       } else if (rowIndex > -1) {
         // Jika kosong, pertahankan password lama
         return existingRow[idx]; 
       }
    }

    // HANDLE isNewUser CONVERSION TO INTEGER (1/0)
    if (headerKey === 'isNewUser' && val !== undefined) {
       // Convert boolean true/false or string "true"/"false" to 1/0
       if (val === true || val === 'true' || val === 1 || val === '1') {
         val = 1;
       } else {
         val = 0;
       }
    }

    if (val === undefined && rowIndex > -1) {
        return existingRow[idx];
    }
    return (typeof val === 'object' && val !== null) ? JSON.stringify(val) : (val !== undefined ? val : "");
  });

  if (rowIndex > -1) {
    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
  
  // Return consistent data structure
  if(data.isNewUser !== undefined) {
      data.isNewUser = (data.isNewUser === true || data.isNewUser === 'true' || data.isNewUser === 1);
  }
  return data;
}

function addData(ss, sheetName, data) {
  if (!ss) ss = getSpreadsheet(); 
  let sheet = ss.getSheetByName(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // FORCE SEQUENTIAL ID for Notifications to avoid frontend random/timestamp IDs
  if (!data.id || data.id === "" || sheetName === 'Notifications') {
    const newId = getNextId(sheet);
    data.id = newId;
  }
  
  if (data.providerId) data.providerId = String(data.providerId);
  delete data.expiryTime; // Hapus expiryTime agar tidak disimpan
  
  const row = headers.map(header => {
    const headerKey = String(header).trim();
    let val = data[headerKey];
    return (typeof val === 'object' && val !== null) ? JSON.stringify(val) : (val !== undefined ? val : "");
  });
  sheet.appendRow(row);
  return data;
}

function claimFoodTransaction(ss, payload) {
  const { foodId, quantityToReduce, claimData } = payload;
  if (!ss) ss = getSpreadsheet();
  const invSheet = ss.getSheetByName('Inventory');
  const claimSheet = ss.getSheetByName('Claims');
  
  const invData = invSheet.getDataRange().getValues();
  const invHeaders = invData[0].map(h => String(h).trim()); 
  
  const idInvIdx = invHeaders.indexOf('id');
  const qtyInvIdx = invHeaders.indexOf('currentQuantity');
  const providerIdIdx = invHeaders.indexOf('providerId'); 
  
  let itemRowIndex = -1;
  let currentStock = 0;
  let providerIdFromInventory = "";
  
  for (let i = 1; i < invData.length; i++) {
    if (String(invData[i][idInvIdx]).trim() === String(foodId).trim()) {
      itemRowIndex = i + 1; 
      currentStock = parseInt(invData[i][qtyInvIdx]) || 0;
      if(providerIdIdx > -1) {
         providerIdFromInventory = String(invData[i][providerIdIdx]);
      }
      break;
    }
  }
  
  if (itemRowIndex === -1) throw new Error("Makanan tidak ditemukan (mungkin sudah dihapus).");
  const reduceAmount = parseInt(quantityToReduce) || 1;
  if (currentStock < reduceAmount) {
    throw new Error(`Stok habis atau tidak cukup. Tersisa: ${currentStock}`);
  }
  
  const newStock = currentStock - reduceAmount;
  invSheet.getRange(itemRowIndex, qtyInvIdx + 1).setValue(newStock);
  
  const newClaimId = getNextId(claimSheet);
  claimData.id = newClaimId;
  claimData.foodId = foodId;
  if (providerIdFromInventory) {
      claimData.providerId = providerIdFromInventory;
  }
  
  const claimHeaders = claimSheet.getRange(1, 1, 1, claimSheet.getLastColumn()).getValues()[0];
  const newClaimRow = claimHeaders.map(header => {
    const headerKey = String(header).trim();
    let val = claimData[headerKey];
    return (typeof val === 'object' && val !== null) ? JSON.stringify(val) : (val !== undefined ? val : "");
  });
  claimSheet.appendRow(newClaimRow);
  
  return { success: true, newStock: newStock, claimId: newClaimId };
}

function getAllData(ss, sheetName) {
  if (!ss) ss = getSpreadsheet(); 
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];
  
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(h => String(h).trim()); 
  
  const data = [];
  for (let i = 1; i < values.length; i++) {
    let obj = {};
    for (let j = 0; j < headers.length; j++) {
      let value = values[i][j];
      if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
        try { obj[headers[j]] = JSON.parse(value); } catch(e) { obj[headers[j]] = value; }
      } else { obj[headers[j]] = value; }
    }
    data.push(obj);
  }
  return data;
}

function uploadImageToDrive(base64Data, filename, folderType) {
  try {
    if (!base64Data) throw new Error("No image data");
    const splitData = base64Data.split(',');
    const rawData = splitData.length > 1 ? splitData[1] : splitData[0];
    const mimeType = base64Data.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg';
    const decodedBlob = Utilities.base64Decode(rawData);
    const blob = Utilities.newBlob(decodedBlob, mimeType, filename || `img_${Date.now()}`);
    const folderId = FOLDER_IDS[folderType] || FOLDER_IDS['assets'];
    const folder = DriveApp.getFolderById(folderId);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return `https://lh3.googleusercontent.com/d/${file.getId()}`;
  } catch (e) {
    throw new Error("Upload Failed: " + e.toString());
  }
}

function updateFoodStock(ss, id, newQty) {
  if (!ss) ss = getSpreadsheet();
  let sheet = ss.getSheetByName('Inventory');
  const values = sheet.getDataRange().getValues();
  const idIdx = values[0].indexOf('id');
  const qtyIdx = values[0].indexOf('currentQuantity');
  for(let i=1; i<values.length; i++) {
    if(String(values[i][idIdx]) == String(id)) {
      sheet.getRange(i+1, qtyIdx+1).setValue(newQty);
      return { id, newQty };
    }
  }
  throw new Error("Item not found");
}

function updateFoodItem(ss, itemData) {
  if (!ss) ss = getSpreadsheet();
  let sheet = ss.getSheetByName('Inventory');
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIdx = headers.indexOf('id');
  for(let i=1; i<values.length; i++) {
    if(String(values[i][idIdx]) == String(itemData.id)) {
      delete itemData.expiryTime; // Hapus expiryTime agar tidak disimpan
      const row = headers.map(h => {
         let val = itemData[h];
         return (typeof val === 'object' && val !== null) ? JSON.stringify(val) : (val !== undefined ? val : values[i][headers.indexOf(h)]);
      });
      sheet.getRange(i+1, 1, 1, headers.length).setValues([row]);
      return itemData;
    }
  }
  throw new Error("Item not found");
}

function deleteData(ss, sheetName, id) {
  if (!ss) ss = getSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();
  const idIdx = values[0].indexOf('id');
  for(let i=1; i<values.length; i++) {
    if(String(values[i][idIdx]) == String(id)) {
      sheet.deleteRow(i+1);
      return { status: 'deleted', id };
    }
  }
  throw new Error("Item not found");
}

function verifyOrderQR(ss, payload) {
  const { uniqueCode, scannedByProviderName } = payload;
  if (!ss) ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Claims');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const codeIdx = headers.indexOf('uniqueCode');
  const scanIdx = headers.indexOf('isScanned');
  const idIdx = headers.indexOf('id');
  
  for(let i=1; i<data.length; i++) {
    if(String(data[i][codeIdx]).toUpperCase() === String(uniqueCode).toUpperCase()) {
       if(data[i][scanIdx] === true) return { success: false, message: 'ALREADY_SCANNED' };
       sheet.getRange(i+1, scanIdx+1).setValue(true);
       return { success: true, message: 'VERIFIED', claimId: data[i][idIdx], foodName: data[i][headers.indexOf('foodName')] };
    }
  }
  throw new Error("Kode QR tidak ditemukan.");
}

function submitReview(ss, payload) {
  const { claimId, rating, review, reviewMedia } = payload;
  if (!ss) ss = getSpreadsheet();
  let sheet = ss.getSheetByName('Claims');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIdx = headers.indexOf('id');
  const rateIdx = headers.indexOf('rating');
  const reviewIdx = headers.indexOf('review');
  const mediaIdx = headers.indexOf('reviewMedia');
  
  for(let i=1; i<data.length; i++) {
    if(String(data[i][idIdx]) == String(claimId)) {
      sheet.getRange(i+1, rateIdx+1).setValue(rating);
      sheet.getRange(i+1, reviewIdx+1).setValue(review);
      sheet.getRange(i+1, mediaIdx+1).setValue(JSON.stringify(reviewMedia || []));
      return { status: 'success' };
    }
  }
  throw new Error("Claim not found");
}

function submitReport(ss, payload) {
  const { claimId, reason, description, evidence } = payload;
  if (!ss) ss = getSpreadsheet();
  let sheet = ss.getSheetByName('Claims');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const idIdx = headers.indexOf('id');
  const isRepIdx = headers.indexOf('isReported');
  const reasonIdx = headers.indexOf('reportReason');
  const descIdx = headers.indexOf('reportDescription');
  const evIdx = headers.indexOf('reportEvidence');
  const statusIdx = headers.indexOf('reportStatus');

  let evidenceData = "";
  
  if (Array.isArray(evidence)) {
    const uploadedUrls = [];
    evidence.forEach((imgBase64, index) => {
      if (imgBase64 && imgBase64.startsWith('data:image/')) {
        try {
          const url = uploadImageToDrive(imgBase64, `report_${claimId}_${index}_${Date.now()}.jpg`, 'reports');
          uploadedUrls.push(url);
        } catch (e) {
          console.error(`Failed to upload evidence ${index}:`, e.toString());
          uploadedUrls.push(`UPLOAD_FAILED_${index}`);
        }
      } else if (imgBase64) {
        uploadedUrls.push(imgBase64);
      }
    });
    evidenceData = JSON.stringify(uploadedUrls);
  } 
  else if (evidence && evidence.startsWith('data:image/')) {
    try {
      evidenceData = uploadImageToDrive(evidence, `report_${claimId}_${Date.now()}.jpg`, 'reports');
    } catch (e) {
      console.error("Failed to upload evidence:", e.toString());
      evidenceData = "UPLOAD_FAILED: " + e.toString();
    }
  } 
  else {
    evidenceData = evidence || "";
  }

  for(let i=1; i<data.length; i++) {
    if(String(data[i][idIdx]) == String(claimId)) {
      sheet.getRange(i+1, isRepIdx+1).setValue(true);
      sheet.getRange(i+1, reasonIdx+1).setValue(reason);
      sheet.getRange(i+1, descIdx+1).setValue(description);
      sheet.getRange(i+1, evIdx+1).setValue(evidenceData);
      
      if (statusIdx > -1) {
         sheet.getRange(i+1, statusIdx+1).setValue('new');
      }
      
      return { 
        status: 'success', 
        claimId,
        evidenceUrl: evidenceData 
      };
    }
  }
  throw new Error("Claim not found for reporting");
}

function updateClaimStatus(ss, id, status, additionalData) {
  if (!ss) ss = getSpreadsheet();
  let sheet = ss.getSheetByName('Claims');
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const data = sheet.getDataRange().getValues();
  
  const idIdx = headers.indexOf('id');
  const statusIdx = headers.indexOf('status');
  
  for(let i=1; i<data.length; i++) {
    if(String(data[i][idIdx]) == String(id)) {
      sheet.getRange(i+1, statusIdx+1).setValue(status);
      
      if (additionalData) {
        for (const key in additionalData) {
          const colIdx = headers.indexOf(key);
          if (colIdx > -1) {
             const val = additionalData[key];
             const safeVal = (typeof val === 'object' && val !== null) ? JSON.stringify(val) : val;
             sheet.getRange(i+1, colIdx+1).setValue(safeVal);
          }
        }
      }
      return { id, status, updatedFields: additionalData };
    }
  }
  throw new Error("Claim not found");
}

function respondReport(ss, reportId, newStatus) {
  if (!ss) ss = getSpreadsheet();
  let sheet = ss.getSheetByName('Claims');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIdx = headers.indexOf('id');
  const reportStatusIdx = headers.indexOf('reportStatus');

  // reportId comes as "REP-<claimId>", extract the real claim ID
  const claimId = String(reportId).startsWith('REP-') ? reportId.substring(4) : reportId;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idIdx]) == String(claimId)) {
      if (reportStatusIdx > -1) {
        sheet.getRange(i + 1, reportStatusIdx + 1).setValue(newStatus);
      }
      return { id: claimId, reportStatus: newStatus };
    }
  }
  throw new Error("Claim not found for report response");
}

function initDatabase(ss) {
  if (!ss) ss = getSpreadsheet();
  const schema = {
    'Users': ['id', 'name', 'email', 'role', 'status', 'points', 'joinDate', 'phone', 'password', 'avatar', 'isNewUser'],
    'Inventory': ['id', 'providerId', 'name', 'description', 'quantity', 'initialQuantity', 'currentQuantity', 'minQuantity', 'maxQuantity', 'expiryTime', 'createdAt', 'distributionStart', 'distributionEnd', 'imageUrl', 'providerName', 'status', 'deliveryMethod', 'aiVerification', 'socialImpact'],
    'Claims': ['id', 'foodId', 'receiverId', 'providerId', 'volunteerId', 'foodName', 'providerName', 'date', 'status', 'rating', 'review', 'reviewMedia', 'isReported', 'reportReason', 'reportDescription', 'reportEvidence', 'imageUrl', 'uniqueCode', 'claimedQuantity', 'deliveryMethod', 'location', 'distributionHours', 'description', 'courierName', 'courierStatus', 'socialImpact', 'isScanned', 'reportStatus'],
    'Addresses': ['id', 'userId', 'label', 'fullAddress', 'receiverName', 'phone', 'isPrimary', 'role'],
    'FAQs': ['id', 'question', 'answer', 'category'],
    'Notifications': ['id', 'userId', 'title', 'content', 'target', 'status', 'sentAt', 'readCount'],
    'Badges': ['id', 'name', 'role', 'minPoints', 'icon', 'description', 'image', 'awardedTo']
  };
  
  for (let sheetName in schema) {
    let sheet = ss.getSheetByName(sheetName);
    const headers = schema[sheetName];
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    } else {
      const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const missingHeaders = headers.filter(h => !currentHeaders.includes(h));
      if (missingHeaders.length > 0) {
         const startCol = currentHeaders.length + 1;
         sheet.getRange(1, startCol, 1, missingHeaders.length).setValues([missingHeaders]).setFontWeight('bold');
      }
    }
  }

  const usersSheet = ss.getSheetByName('Users');
  if (usersSheet) {
      const data = usersSheet.getDataRange().getValues();
      const headers = data[0]; 
      const emailIndex = headers.indexOf('email');
      
      const adminEmail = 'foodairescue@gmail.com';
      let adminExists = false;

      for(let i = 1; i < data.length; i++) {
          if (String(data[i][emailIndex]).trim().toLowerCase() === adminEmail) {
              adminExists = true;
              break;
          }
      }

      if (!adminExists) {
          const newId = getNextId(usersSheet);
          const adminData = {
              id: newId,
              name: 'Super Admin',
              email: adminEmail,
              password: hashString('FoodAiRescue607012400075'), // Default Password Hashed
              role: 'super_admin',
              status: 'active',
              points: 0,
              joinDate: new Date().toLocaleDateString('id-ID'),
              phone: '081234567890',
              avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=random',
              isNewUser: 0 // Admin default 0
          };

          const row = headers.map(h => {
              const key = String(h).trim();
              return adminData[key] || "";
          });
          usersSheet.appendRow(row);
      }
  }

  return "Database Initialized";
}
