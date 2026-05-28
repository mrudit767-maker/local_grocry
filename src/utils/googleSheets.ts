/**
 * Google Sheets Integration via Apps Script Webhook
 * 
 * SETUP INSTRUCTIONS (one-time, 2 minutes):
 * 1. Open Google Sheets → Extensions → Apps Script
 * 2. Paste the script from: https://github.com/krishna-kirana/sheets-webhook
 *    (or use the Apps Script code at the bottom of this file)
 * 3. Deploy → New Deployment → Web App → Execute as: Me → Who has access: Anyone
 * 4. Copy the Web App URL and paste in Admin → Settings → Google Sheet Webhook URL
 */

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
      mode: 'no-cors', // Google Apps Script requires no-cors
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'saveOrder',
        rows: rows,
      }),
    });

    // no-cors mode always returns opaque response, treat as success
    return { success: true, message: 'Order saved to Google Sheet' };
  } catch (error) {
    console.error('Google Sheets sync error:', error);
    return { success: false, message: 'Failed to sync with Google Sheets' };
  }
}

export function formatOrderForSheet(order: {
  customer: { name: string; phone: string; address: string; city: string; pincode: string };
  items: { product: { name: string; price: number; unit: string }; quantity: number }[];
  paymentMethod: string;
  status: string;
  createdAt: string;
}): OrderRowData[] {
  // Format Date to DD/MM/YYYY in local timezone
  const d = new Date(order.createdAt);
  const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

  // Combine full address
  const fullAddress = `${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}`;

  // Map Payment Method to readable names
  let payMethod = 'Cash';
  if (order.paymentMethod === 'upi') payMethod = 'UPI';
  else if (order.paymentMethod === 'cod') payMethod = 'Cash on Delivery';
  else if (order.paymentMethod === 'razorpay') payMethod = 'Online Payment';
  else payMethod = order.paymentMethod;

  // Map status to: Completed, Pending, Cancelled
  let orderStatus = 'Pending';
  if (order.status === 'delivered') orderStatus = 'Completed';
  else if (order.status === 'cancelled') orderStatus = 'Cancelled';
  else orderStatus = 'Pending';

  // Map each product to a row
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

export interface CustomerSheetData {
  dateRegistered: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

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
      mode: 'no-cors', // Google Apps Script requires no-cors
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'saveCustomer',
        data: customerData,
      }),
    });

    return { success: true, message: 'Customer saved to Google Sheet' };
  } catch (error) {
    console.error('Google Sheets customer sync error:', error);
    return { success: false, message: 'Failed to sync customer with Google Sheets' };
  }
}


/**
 * Google Apps Script to paste in your Sheet:
 * 
 * function doPost(e) {
 *   try {
 *     var data = JSON.parse(e.postData.contents);
 *     
 *     if (data.action === 'saveOrder') {
 *       var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders') 
 *                   || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Orders');
 *       
 *       // Add headers if empty
 *       if (sheet.getLastRow() === 0) {
 *         sheet.appendRow([
 *           'Date', 'Customer Name', 'Phone', 'Address', 'Product', 'Quantity', 'Total Price', 'Payment Method', 'Status'
 *         ]);
 *         sheet.getRange("A1:I1").setFontWeight("bold");
 *       }
 *       
 *       var rows = data.rows;
 *       for (var i = 0; i < rows.length; i++) {
 *         var r = rows[i];
 *         sheet.appendRow([
 *           r.date, r.customerName, r.phone, r.address, r.product, r.quantity, r.totalPrice, r.paymentMethod, r.status
 *         ]);
 *       }
 *       
 *       return ContentService.createTextOutput(JSON.stringify({status:'success'}))
 *         .setMimeType(ContentService.MimeType.JSON);
 *     }
 *     
 *     if (data.action === 'saveCustomer') {
 *       var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Customers') 
 *                   || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Customers');
 *       
 *       // Add headers if empty
 *       if (sheet.getLastRow() === 0) {
 *         sheet.appendRow([
 *           'Date Registered', 'Customer Name', 'Phone', 'Address', 'City', 'Pincode'
 *         ]);
 *         sheet.getRange("A1:F1").setFontWeight("bold");
 *       }
 *       
 *       var c = data.data;
 *       sheet.appendRow([
 *         c.dateRegistered, c.customerName, c.phone, c.address, c.city, c.pincode
 *       ]);
 *       
 *       return ContentService.createTextOutput(JSON.stringify({status:'success'}))
 *         .setMimeType(ContentService.MimeType.JSON);
 *     }
 *   } catch(err) {
 *     return ContentService.createTextOutput(JSON.stringify({status:'error',message:err.toString()}))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 */
