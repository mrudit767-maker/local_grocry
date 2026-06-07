import { Product } from '../data/products';

export interface OrderRowData {
  date: string;
  customerName: string;
  phone: string;
  address: string;
  product: string;
  quantity: number;
  totalPrice: string;
  paymentMethod: string;
  status: string;
}

export interface CustomerSheetData {
  dateRegistered: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  pincode: string;
}

export interface SyncSettings {
  shopName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapsLink: string;
  businessHours: string;
  minOrderAmount: number;
  deliveryFee: number;
  freeDeliveryAbove: number;
  googleSheetWebhookUrl: string;
  adminPassword: string;
}

// 1. Save Orders (POST)
export async function saveOrderToSheet(
  webhookUrl: string,
  rows: OrderRowData[]
): Promise<{ success: boolean; message: string }> {
  if (!webhookUrl || !webhookUrl.startsWith('https://script.google.com')) {
    return { success: false, message: 'No webhook URL configured' };
  }
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveOrder', rows }),
    });
    return { success: true, message: 'Order saved to Google Sheet' };
  } catch (error) {
    console.error('Google Sheets sync error:', error);
    return { success: false, message: 'Failed to sync with Google Sheets' };
  }
}

// 2. Save Customer (POST)
export async function saveCustomerToSheet(
  webhookUrl: string,
  customerData: CustomerSheetData
): Promise<{ success: boolean; message: string }> {
  if (!webhookUrl || !webhookUrl.startsWith('https://script.google.com')) {
    return { success: false, message: 'No webhook URL configured' };
  }
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveCustomer', data: customerData }),
    });
    return { success: true, message: 'Customer saved to Google Sheet' };
  } catch (error) {
    console.error('Google Sheets customer sync error:', error);
    return { success: false, message: 'Failed to sync customer with Google Sheets' };
  }
}

// 3. Save Products (POST)
export async function saveProductsToSheet(
  webhookUrl: string,
  products: Product[]
): Promise<boolean> {
  if (!webhookUrl || !webhookUrl.startsWith('https://script.google.com')) return false;
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveProducts', products }),
    });
    return true;
  } catch (error) {
    console.error('Failed to save products to Google Sheet:', error);
    return false;
  }
}

// 4. Fetch Products (GET)
export async function fetchProductsFromSheet(
  webhookUrl: string
): Promise<Product[] | null> {
  if (!webhookUrl || !webhookUrl.startsWith('https://script.google.com')) return null;
  try {
    const res = await fetch(`${webhookUrl}?action=getProducts`);
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch products from Google Sheet:', error);
    return null;
  }
}

// 5. Save Settings (POST)
export async function saveSettingsToSheet(
  webhookUrl: string,
  settings: SyncSettings
): Promise<boolean> {
  if (!webhookUrl || !webhookUrl.startsWith('https://script.google.com')) return false;
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveSettings', settings }),
    });
    return true;
  } catch (error) {
    console.error('Failed to save settings to Google Sheet:', error);
    return false;
  }
}

// 6. Fetch Settings (GET)
export async function fetchSettingsFromSheet(
  webhookUrl: string
): Promise<Partial<SyncSettings> | null> {
  if (!webhookUrl || !webhookUrl.startsWith('https://script.google.com')) return null;
  try {
    const res = await fetch(`${webhookUrl}?action=getSettings`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && typeof data === 'object' && Object.keys(data).length > 0) {
      return data as Partial<SyncSettings>;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch settings from Google Sheet:', error);
    return null;
  }
}

// 6.5. Fetch Customer Profile (GET)
export async function fetchCustomerFromSheet(
  webhookUrl: string,
  identifier: string
): Promise<CustomerSheetData | null> {
  if (!webhookUrl || !webhookUrl.startsWith('https://script.google.com') || !identifier) return null;
  try {
    const res = await fetch(`${webhookUrl}?action=getCustomer&identifier=${encodeURIComponent(identifier)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && typeof data === 'object') {
      return {
        dateRegistered: '',
        customerName: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        city: data.city || '',
        pincode: data.pincode || '',
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch customer from Google Sheet:', error);
    return null;
  }
}

export function formatOrderForSheet(order: {
  customer: { name: string; phone: string; email?: string; address: string; city: string; pincode: string };
  items: { product: { name: string; price: number; unit: string }; quantity: number }[];
  paymentMethod: string;
  status: string;
  createdAt: string;
  locationUrl?: string;
  deliverySlot?: string;
}): OrderRowData[] {
  const d = new Date(order.createdAt);
  const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  const fullAddress = `${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}${order.deliverySlot ? ` [Delivery Slot: ${order.deliverySlot}]` : ''}${order.locationUrl ? ` [GPS Map: ${order.locationUrl}]` : ''}`;

  let payMethod = 'Cash';
  if (order.paymentMethod === 'upi') payMethod = 'UPI';
  else if (order.paymentMethod === 'cod') payMethod = 'Cash on Delivery';
  else if (order.paymentMethod === 'razorpay') payMethod = 'Online Payment';
  else payMethod = order.paymentMethod;

  let orderStatus = 'Pending';
  if (order.status === 'delivered') orderStatus = 'Completed';
  else if (order.status === 'cancelled') orderStatus = 'Cancelled';
  else orderStatus = 'Pending';

  return order.items.map(item => ({
    date: dateStr,
    customerName: order.customer.name,
    phone: order.customer.phone,
    address: fullAddress,
    product: `${item.product.name} (${item.product.unit})`,
    quantity: item.quantity,
    totalPrice: `₹${(item.product.price * item.quantity).toFixed(2)}`,
    paymentMethod: payMethod,
    status: orderStatus,
  }));
}

/**
 * Google Apps Script to paste in your Sheet:
 * 
 * function doGet(e) {
 *   var action = e.parameter.action;
 *   
 *   // ACTION 1: Get products list
 *   if (action === 'getProducts') {
 *     var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Products');
 *     if (!sheet) {
 *       return ContentService.createTextOutput(JSON.stringify([]))
 *         .setMimeType(ContentService.MimeType.JSON);
 *     }
 *     var values = sheet.getDataRange().getValues();
 *     var products = [];
 *     for (var i = 1; i < values.length; i++) {
 *       var row = values[i];
 *       if (!row[0]) continue; // skip blank rows
 *       products.push({
 *         id: String(row[0]),
 *         name: String(row[1]),
 *         category: String(row[2]),
 *         price: Number(row[3]),
 *         mrp: Number(row[4]),
 *         unit: String(row[5]),
 *         image: String(row[6]),
 *         badge: row[7] ? String(row[7]) : undefined,
 *         rating: Number(row[8] || 4),
 *         description: String(row[9] || ''),
 *         inStock: String(row[10]).toLowerCase() === 'true',
 *         subcategory: row[11] ? String(row[11]) : String(row[2]),
 *         storeId: row[12] ? String(row[12]) : 'main',
 *         updatedAt: row[13] ? Number(row[13]) : undefined,
 *         images: row[14] ? String(row[14]).split(',').map(function(s){return s.trim();}).filter(Boolean) : [],
 *         customWeights: row[15] ? String(row[15]).split(',').map(function(s){return s.trim();}).filter(Boolean) : []
 *       });
 *     }
 *     return ContentService.createTextOutput(JSON.stringify(products))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 *   
 *   // ACTION 2: Get settings config
 *   if (action === 'getSettings') {
 *     var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
 *     if (!sheet) {
 *       return ContentService.createTextOutput(JSON.stringify({}))
 *         .setMimeType(ContentService.MimeType.JSON);
 *     }
 *     var values = sheet.getDataRange().getValues();
 *     var settings = {};
 *     for (var i = 1; i < values.length; i++) {
 *       var row = values[i];
 *       if (!row[0]) continue;
 *       try {
 *         settings[row[0]] = JSON.parse(row[1]);
 *       } catch (err) {
 *         settings[row[0]] = row[1];
 *       }
 *     }
 *     return ContentService.createTextOutput(JSON.stringify(settings))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 *   
 *   // ACTION 3: Get customer profile by email or phone
 *   if (action === 'getCustomer') {
 *     var identifier = e.parameter.identifier;
 *     if (!identifier) {
 *       return ContentService.createTextOutput(JSON.stringify(null))
 *         .setMimeType(ContentService.MimeType.JSON);
 *     }
 *     identifier = String(identifier).trim().toLowerCase();
 *     var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Customers');
 *     if (!sheet) {
 *       return ContentService.createTextOutput(JSON.stringify(null))
 *         .setMimeType(ContentService.MimeType.JSON);
 *     }
 *     var values = sheet.getDataRange().getValues();
 *     for (var i = values.length - 1; i >= 1; i--) {
 *       var row = values[i];
 *       if (!row[1] && !row[2] && !row[3]) continue;
 *       var phoneClean = String(row[2] || '').replace(/[\s-+]/g, '').slice(-10);
 *       var emailClean = String(row[3] || '').trim().toLowerCase();
 *       var idClean = identifier.replace(/[\s-+]/g, '').slice(-10);
 *       if ((emailClean && emailClean === identifier) || (phoneClean && phoneClean === idClean)) {
 *         return ContentService.createTextOutput(JSON.stringify({
 *           name: String(row[1] || ''),
 *           phone: String(row[2] || ''),
 *           email: String(row[3] || ''),
 *           address: String(row[4] || ''),
 *           city: String(row[5] || ''),
 *           pincode: String(row[6] || '')
 *         }))
 *         .setMimeType(ContentService.MimeType.JSON);
 *       }
 *     }
 *     return ContentService.createTextOutput(JSON.stringify(null))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 *   
 *   return ContentService.createTextOutput("Invalid Action");
 * }
 * 
 * function doPost(e) {
 *   try {
 *     var data = JSON.parse(e.postData.contents);
 *     
 *     // POST ACTION 1: Save Order details
 *     if (data.action === 'saveOrder') {
 *       var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders') 
 *                   || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Orders');
 *       if (sheet.getLastRow() === 0) {
 *         sheet.appendRow([
 *           'Date', 'Customer Name', 'Phone', 'Address', 'Product', 'Quantity', 'Total Price', 'Payment Method', 'Status'
 *         ]);
 *         sheet.getRange("A1:I1").setFontWeight("bold");
 *       }
 *       var rows = data.rows;
 *       var emailBody = "🚨 NEW ORDER RECEIVED!\n\n";
 *       if (rows.length > 0) {
 *         emailBody += "Customer: " + rows[0].customerName + "\n";
 *         emailBody += "Phone: " + rows[0].phone + "\n";
 *         emailBody += "Delivery Address: " + rows[0].address + "\n";
 *         emailBody += "Payment Method: " + rows[0].paymentMethod + "\n\n";
 *         emailBody += "Items:\n";
 *       }
 *       
 *       for (var i = 0; i < rows.length; i++) {
 *         var r = rows[i];
 *         sheet.appendRow([
 *           r.date, r.customerName, r.phone, r.address, r.product, r.quantity, r.totalPrice, r.paymentMethod, r.status
 *         ]);
 *         emailBody += "- " + r.product + " (Qty: " + r.quantity + ") - Total: " + r.totalPrice + "\n";
 *       }
 *       
 *       // Send real-time Email Alert to spreadsheet owner
 *       try {
 *         var email = Session.getEffectiveUser().getEmail();
 *         if (email) {
 *           MailApp.sendEmail({
 *             to: email,
 *             subject: "🛒 New Order Received - " + (rows[0] ? rows[0].customerName : "Customer"),
 *             body: emailBody
 *           });
 *         }
 *       } catch (mailErr) {
 *         Logger.log("Mail error: " + mailErr.toString());
 *       }
 * 
 *       // [OPTIONAL] Send real-time Telegram Notification (Instant & Loud)
 *       // To use: Create a bot with @BotFather, get Chat ID with @userinfobot, and fill details below:
 *       try {
 *         var telegramToken = "YOUR_TELEGRAM_BOT_TOKEN"; 
 *         var telegramChatId = "YOUR_TELEGRAM_CHAT_ID"; 
 *         if (telegramToken && telegramChatId && telegramToken !== "YOUR_TELEGRAM_BOT_TOKEN") {
 *           var telegramUrl = "https://api.telegram.org/bot" + telegramToken + "/sendMessage";
 *           var payload = {
 *             "chat_id": telegramChatId,
 *             "text": "<b>" + rows[0].customerName + "</b> ne naya order kiya hai!\n\n" + emailBody,
 *             "parse_mode": "HTML"
 *           };
 *           UrlFetchApp.fetch(telegramUrl, {
 *             "method": "post",
 *             "contentType": "application/json",
 *             "payload": JSON.stringify(payload)
 *           });
 *         }
 *       } catch (tgErr) {
 *         Logger.log("Telegram error: " + tgErr.toString());
 *       }
 * 
 *       return ContentService.createTextOutput(JSON.stringify({status:'success'}))
 *         .setMimeType(ContentService.MimeType.JSON);
 *     }
 *     
 *     // POST ACTION 1.5: Send OTP SMS/Email via Fast2SMS / Twilio / MailApp
 *     if (data.action === 'sendSMS') {
 *       var gateway = data.gateway;
 *       var phone = data.phone;
 *       var otp = data.otp;
 *       var email = data.email;
 *       var shopName = data.shopName || "Krishna Kirana";
 *       
 *       // 100% Free & Unlimited Email OTP via MailApp.sendEmail
 *       if (email) {
 *         try {
 *           MailApp.sendEmail({
 *             to: email,
 *             subject: "🔑 Your " + shopName + " Verification Code",
 *             body: "Your verification code is: " + otp + "\n\nUse this code to verify your phone number and login. It is valid for 5 minutes.\n\nThank you for shopping with us!"
 *           });
 *         } catch (mailErr) {
 *           Logger.log("Mail OTP error: " + mailErr.toString());
 *         }
 *       }
 *       
 *       if (gateway === 'fast2sms') {
 *         var apiKey = data.fast2smsApiKey;
 *         var url = "https://www.fast2sms.com/dev/bulkV2?authorization=" + encodeURIComponent(apiKey) + "&route=otp&variables_values=" + encodeURIComponent(otp) + "&numbers=" + encodeURIComponent(phone);
 *         var response = UrlFetchApp.fetch(url, { "method": "get" });
 *         return ContentService.createTextOutput(response.getContentText())
 *           .setMimeType(ContentService.MimeType.JSON);
 *       }
 *       
 *       if (gateway === 'twilio') {
 *         var accountSid = data.twilioAccountSid;
 *         var authToken = data.twilioAuthToken;
 *         var fromNum = data.twilioFromNumber;
 *         var url = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json";
 *         var payload = {
 *           "To": "+91" + phone,
 *           "From": fromNum,
 *           "Body": "Your " + shopName + " OTP code is: " + otp + ". Valid for 5 minutes."
 *         };
 *         var options = {
 *           "method": "post",
 *           "payload": payload,
 *           "headers": {
 *             "Authorization": "Basic " + Utilities.base64Encode(accountSid + ":" + authToken)
 *           }
 *         };
 *         var response = UrlFetchApp.fetch(url, options);
 *         return ContentService.createTextOutput(response.getContentText())
 *           .setMimeType(ContentService.MimeType.JSON);
 *       }
 *       
 *       return ContentService.createTextOutput(JSON.stringify({status:'success', message:'Email OTP sent if email provided, SMS bypassed or simulated'}))
 *         .setMimeType(ContentService.MimeType.JSON);
 *     }
 *     
 *     // POST ACTION 2: Save Customer profile details
 *     if (data.action === 'saveCustomer') {
 *       var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Customers') 
 *                   || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Customers');
 *       if (sheet.getLastRow() === 0) {
 *         sheet.appendRow([
 *           'Date Registered', 'Customer Name', 'Phone', 'Email', 'Address', 'City', 'Pincode'
 *         ]);
 *         sheet.getRange("A1:G1").setFontWeight("bold");
 *       }
 *       var c = data.data;
 *       sheet.appendRow([
 *         c.dateRegistered, c.customerName, c.phone, c.email || '', c.address, c.city, c.pincode
 *       ]);
 *       return ContentService.createTextOutput(JSON.stringify({status:'success'}))
 *         .setMimeType(ContentService.MimeType.JSON);
 *     }
 * 
 *     // POST ACTION 3: Overwrite Products catalog
 *     if (data.action === 'saveProducts') {
 *       var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Products') 
 *                   || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Products');
 *       sheet.clearContents();
 *       sheet.appendRow(['id', 'name', 'category', 'price', 'mrp', 'unit', 'image', 'badge', 'rating', 'description', 'inStock', 'subcategory', 'storeId', 'updatedAt', 'images', 'customWeights']);
 *       sheet.getRange("A1:P1").setFontWeight("bold");
 *       
 *       var list = data.products;
 *       for (var i = 0; i < list.length; i++) {
 *         var p = list[i];
 *         sheet.appendRow([
 *           p.id, p.name, p.category, p.price, p.mrp, p.unit, p.image, p.badge || '', p.rating || 4, p.description || '', p.inStock, p.subcategory || '', p.storeId || 'main', p.updatedAt || '',
 *           p.images ? (Array.isArray(p.images) ? p.images.join(', ') : String(p.images)) : '',
 *           p.customWeights ? (Array.isArray(p.customWeights) ? p.customWeights.join(', ') : String(p.customWeights)) : ''
 *         ]);
 *       }
 *       return ContentService.createTextOutput(JSON.stringify({status:'success'}))
 *         .setMimeType(ContentService.MimeType.JSON);
 *     }
 * 
 *     // POST ACTION 4: Overwrite settings configuration
 *     if (data.action === 'saveSettings') {
 *       var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings') 
 *                   || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Settings');
 *       sheet.clearContents();
 *       sheet.appendRow(['Key', 'Value']);
 *       sheet.getRange("A1:B1").setFontWeight("bold");
 *       
 *       var settings = data.settings;
 *       for (var key in settings) {
 *         sheet.appendRow([key, JSON.stringify(settings[key])]);
 *       }
 *       return ContentService.createTextOutput(JSON.stringify({status:'success'}))
 *         .setMimeType(ContentService.MimeType.JSON);
 *     }
 *   } catch(err) {
 *     return ContentService.createTextOutput(JSON.stringify({status:'error',message:err.toString()}))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 */
