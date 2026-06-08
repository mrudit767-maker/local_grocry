/**
 * Google Apps Script Template
 * This is exported as a string to be displayed and copied from the Admin Panel.
 */
export const APPS_SCRIPT_CODE = `/**
 * Google Apps Script Webhook for Grocery/Kirana Store
 * Syncs Orders, Customers, Products and dispatches Email & SMS OTP.
 * 
 * ⚠️ IMPORTANT DEPLOYMENT SETTINGS (FOR EMAIL VERIFICATION TO WORK):
 * 1. Open your Google Sheet.
 * 2. Click "Extensions" -> "Apps Script".
 * 3. Delete any code in the editor and paste this entire script.
 * 4. Click the "Save" icon (Floppy disk).
 * 5. Click "Deploy" (top right) -> "New Deployment".
 * 6. Click the gear icon next to "Select type" and choose "Web App".
 * 7. Set the fields exactly as follows:
 *    - Description: Store Webhook
 *    - Execute as: "Me (your-gmail-account@gmail.com)"  <-- DO NOT select "User accessing the web app"!
 *    - Who has access: "Anyone"                        <-- DO NOT select "Only myself" or "Anyone with Google account"!
 * 8. Click "Deploy".
 * 9. Google will ask for permissions. Click "Authorize access", select your Google account, click "Advanced" (unsafe warning), and then click "Go to Untitled project (unsafe)" / "Allow".
 * 10. Copy the "Web app URL" and paste it in your Admin Page settings.
 */

function doGet(e) {
  var action = e.parameter.action;
  
  // ACTION 1: Get products list
  if (action === 'getProducts') {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Products');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var values = sheet.getDataRange().getValues();
    var products = [];
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      if (!row[0]) continue; // skip blank rows
      products.push({
        id: String(row[0]),
        name: String(row[1]),
        category: String(row[2]),
        price: Number(row[3]),
        mrp: Number(row[4]),
        unit: String(row[5]),
        image: String(row[6]),
        badge: row[7] ? String(row[7]) : undefined,
        rating: Number(row[8] || 4),
        description: String(row[9] || ''),
        inStock: String(row[10]).toLowerCase() === 'true',
        subcategory: row[11] ? String(row[11]) : String(row[2]),
        storeId: row[12] ? String(row[12]) : 'main',
        updatedAt: row[13] ? Number(row[13]) : undefined,
        images: row[14] ? String(row[14]).split(',').map(function(s){return s.trim();}).filter(Boolean) : [],
        customWeights: row[15] ? String(row[15]).split(',').map(function(s){return s.trim();}).filter(Boolean) : [],
        expiryDate: row[16] ? String(row[16]) : ''
      });
    }
    return ContentService.createTextOutput(JSON.stringify(products))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // ACTION 2: Get settings config
  if (action === 'getSettings') {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var values = sheet.getDataRange().getValues();
    var settings = {};
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      if (!row[0]) continue;
      try {
        settings[row[0]] = JSON.parse(row[1]);
      } catch (err) {
        settings[row[0]] = row[1];
      }
    }
    return ContentService.createTextOutput(JSON.stringify(settings))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ACTION 3: Get customer profile by email or phone
  if (action === 'getCustomer') {
    var identifier = e.parameter.identifier;
    if (!identifier) {
      return ContentService.createTextOutput(JSON.stringify(null))
        .setMimeType(ContentService.MimeType.JSON);
    }
    identifier = String(identifier).trim().toLowerCase();
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Customers');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify(null))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var values = sheet.getDataRange().getValues();
    // Search from bottom to top (most recent registered details first)
    for (var i = values.length - 1; i >= 1; i--) {
      var row = values[i];
      if (!row[1] && !row[2] && !row[3]) continue;
      
      var phoneClean = String(row[2] || '').replace(/[^0-9]/g, '').slice(-10);
      var emailClean = String(row[3] || '').trim().toLowerCase();
      var idClean = identifier.replace(/[^0-9]/g, '').slice(-10);
      
      if ((emailClean && emailClean === identifier) || (phoneClean && phoneClean === idClean)) {
        return ContentService.createTextOutput(JSON.stringify({
          name: String(row[1] || ''),
          phone: String(row[2] || ''),
          email: String(row[3] || ''),
          address: String(row[4] || ''),
          city: String(row[5] || ''),
          pincode: String(row[6] || '')
        }))
        .setMimeType(ContentService.MimeType.JSON);
      }
    }
    return ContentService.createTextOutput(JSON.stringify(null))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ACTION 4: Get all orders from OrdersSync sheet (for admin cross-device sync)
  if (action === 'getOrders') {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OrdersSync');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var values = sheet.getDataRange().getValues();
    var orders = [];
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      if (!row[0]) continue; // skip blank rows
      orders.push({
        orderId: String(row[0]),
        date: String(row[1] || ''),
        customerName: String(row[2] || ''),
        phone: String(row[3] || ''),
        total: String(row[4] || ''),
        status: String(row[5] || ''),
        paymentMethod: String(row[6] || ''),
        itemsSummary: String(row[7] || ''),
        orderJson: String(row[8] || '')
      });
    }
    return ContentService.createTextOutput(JSON.stringify(orders))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput("Invalid Action");
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    // POST ACTION 1: Save Order details
    if (data.action === 'saveOrder') {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders') 
                  || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Orders');
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          'Date', 'Customer Name', 'Phone', 'Address', 'Product', 'Quantity', 'Total Price', 'Payment Method', 'Status'
        ]);
        sheet.getRange("A1:I1").setFontWeight("bold");
      }
      var rows = data.rows;
      var emailBody = "🚨 NEW ORDER RECEIVED!\\n\\n";
      if (rows.length > 0) {
        emailBody += "Customer: " + rows[0].customerName + "\\n";
        emailBody += "Phone: " + rows[0].phone + "\\n";
        emailBody += "Delivery Address: " + rows[0].address + "\\n";
        emailBody += "Payment Method: " + rows[0].paymentMethod + "\\n\\n";
        emailBody += "Items:\\n";
      }
      
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        sheet.appendRow([
          r.date, r.customerName, r.phone, r.address, r.product, r.quantity, r.totalPrice, r.paymentMethod, r.status
        ]);
        emailBody += "- " + r.product + " (Qty: " + r.quantity + ") - Total: " + r.totalPrice + "\\n";
      }
      
      // Send real-time Email Alert to spreadsheet owner
      try {
        var email = Session.getEffectiveUser().getEmail();
        if (email) {
          GmailApp.sendEmail(email, "🛒 New Order Received - " + (rows[0] ? rows[0].customerName : "Customer"), emailBody);
        }
      } catch (mailErr) {
        Logger.log("Mail error: " + mailErr.toString());
      }

      return ContentService.createTextOutput(JSON.stringify({status:'success'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // POST ACTION 1.5: Save Full Order JSON to OrdersSync sheet (admin cross-device sync)
    if (data.action === 'saveFullOrder') {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OrdersSync')
                  || SpreadsheetApp.getActiveSpreadsheet().insertSheet('OrdersSync');
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          'Order ID', 'Date', 'Customer Name', 'Phone', 'Total', 'Status', 'Payment Method', 'Items Summary', 'Order JSON'
        ]);
        sheet.getRange("A1:I1").setFontWeight("bold");
      }
      var o = data.order;
      sheet.appendRow([
        o.orderId, o.date, o.customerName, o.phone, o.total, o.status, o.paymentMethod, o.itemsSummary, o.orderJson
      ]);
      return ContentService.createTextOutput(JSON.stringify({status:'success'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // POST ACTION 1.6: Update Order Status in OrdersSync sheet
    if (data.action === 'updateOrderStatus') {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OrdersSync');
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({status:'error',message:'OrdersSync sheet not found'}))
          .setMimeType(ContentService.MimeType.JSON);
      }
      var values = sheet.getDataRange().getValues();
      var orderId = data.orderId;
      var newStatus = data.status;
      var newPaymentStatus = data.paymentStatus;
      for (var i = 1; i < values.length; i++) {
        if (String(values[i][0]) === String(orderId)) {
          // Update status column (col F = index 5)
          sheet.getRange(i + 1, 6).setValue(newStatus);
          // Update orderJson with new status
          if (values[i][8]) {
            try {
              var orderObj = JSON.parse(String(values[i][8]));
              orderObj.status = newStatus;
              if (newPaymentStatus) orderObj.paymentStatus = newPaymentStatus;
              orderObj.updatedAt = new Date().toISOString();
              sheet.getRange(i + 1, 9).setValue(JSON.stringify(orderObj));
            } catch(e) {}
          }
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({status:'success'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // POST ACTION 2: Send OTP SMS/Email via Fast2SMS / Twilio / GmailApp
    if (data.action === 'sendSMS') {
      var gateway = data.gateway;
      var phone = data.phone;
      var otp = data.otp;
      var email = data.email;
      var shopName = data.shopName || "Krishna Kirana";
      
      // Send Secure OTP Email (100% Free & Unlimited)
      if (email) {
        try {
          var subject = "🔑 Your " + shopName + " Verification Code";
          var htmlBody = 
            "<div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); background-color: #ffffff;'>" +
            "<div style='text-align: center; margin-bottom: 20px;'>" +
            "<h2 style='color: #059669; margin: 0; font-size: 24px; font-weight: bold;'>" + shopName + "</h2>" +
            "<p style='color: #64748b; font-size: 14px; margin: 4px 0 0 0;'>Secure Login Verification</p>" +
            "</div>" +
            "<div style='border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 25px 0; text-align: center;'>" +
            "<p style='font-size: 15px; color: #334155; margin: 0 0 16px 0;'>Here is your one-time verification code:</p>" +
            "<div style='background-color: #f0fdf4; border: 2px dashed #10b981; padding: 12px 24px; border-radius: 8px; display: inline-block;'>" +
            "<span style='font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #065f46; font-family: monospace;'>" + otp + "</span>" +
            "</div>" +
            "<p style='font-size: 13px; color: #64748b; margin: 16px 0 0 0;'>This code is valid for 5 minutes. Do not share it with anyone.</p>" +
            "</div>" +
            "<p style='font-size: 11px; color: #94a3b8; text-align: center; margin-top: 20px;'>If you did not request this code, please ignore this email.</p>" +
            "</div>";
            
          try {
            GmailApp.sendEmail(email, subject, "", { htmlBody: htmlBody });
          } catch (gmailErr) {
            MailApp.sendEmail({
              to: email,
              subject: subject,
              htmlBody: htmlBody
            });
          }
        } catch (mailErr) {
          Logger.log("Mail OTP error: " + mailErr.toString());
        }
      }
      
      if (gateway === 'fast2sms' && phone) {
        var apiKey = data.fast2smsApiKey;
        var url = "https://www.fast2sms.com/dev/bulkV2?authorization=" + encodeURIComponent(apiKey) + "&route=otp&variables_values=" + encodeURIComponent(otp) + "&numbers=" + encodeURIComponent(phone);
        var response = UrlFetchApp.fetch(url, { "method": "get" });
        return ContentService.createTextOutput(response.getContentText())
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      if (gateway === 'twilio' && phone) {
        var accountSid = data.twilioAccountSid;
        var authToken = data.twilioAuthToken;
        var fromNum = data.twilioFromNumber;
        var url = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json";
        var payload = {
          "To": "+91" + phone,
          "From": fromNum,
          "Body": "Your " + shopName + " OTP code is: " + otp + ". Valid for 5 minutes."
        };
        var options = {
          "method": "post",
          "payload": payload,
          "headers": {
            "Authorization": "Basic " + Utilities.base64Encode(accountSid + ":" + authToken)
          }
        };
        var response = UrlFetchApp.fetch(url, options);
        return ContentService.createTextOutput(response.getContentText())
          .setMimeType(ContentService.MimeType.JSON);
      }

      if (gateway === 'android' && phone) {
        var token = data.androidSmsToken;
        var deviceId = data.androidSmsDeviceId;
        // SemySMS.net Free Android SMS Gateway API
        var url = "https://semysms.net/api/3/sms.php?token=" + encodeURIComponent(token) + "&device=" + encodeURIComponent(deviceId) + "&number=%2B91" + encodeURIComponent(phone) + "&msg=" + encodeURIComponent("Your " + shopName + " verification code is: " + otp);
        var response = UrlFetchApp.fetch(url, { "method": "get" });
        return ContentService.createTextOutput(response.getContentText())
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      return ContentService.createTextOutput(JSON.stringify({status:'success', message:'Email OTP sent. SMS bypassed or simulated.'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // POST ACTION 2: Save Customer profile details
    if (data.action === 'saveCustomer') {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Customers') 
                  || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Customers');
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          'Date Registered', 'Customer Name', 'Phone', 'Email', 'Address', 'City', 'Pincode'
        ]);
        sheet.getRange("A1:G1").setFontWeight("bold");
      }
      var c = data.data;
      sheet.appendRow([
        c.dateRegistered, c.customerName, c.phone, c.email || '', c.address, c.city, c.pincode
      ]);
      return ContentService.createTextOutput(JSON.stringify({status:'success'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // POST ACTION 3: Overwrite Products catalog
    if (data.action === 'saveProducts') {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Products') 
                  || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Products');
      sheet.clearContents();
      sheet.appendRow(['id', 'name', 'category', 'price', 'mrp', 'unit', 'image', 'badge', 'rating', 'description', 'inStock', 'subcategory', 'storeId', 'updatedAt', 'images', 'customWeights', 'expiryDate']);
      sheet.getRange("A1:Q1").setFontWeight("bold");
      
      var list = data.products;
      for (var i = 0; i < list.length; i++) {
        var p = list[i];
        sheet.appendRow([
          p.id, p.name, p.category, p.price, p.mrp, p.unit, p.image, p.badge || '', p.rating || 4, p.description || '', p.inStock, p.subcategory || '', p.storeId || 'main', p.updatedAt || '',
          p.images ? (Array.isArray(p.images) ? p.images.join(', ') : String(p.images)) : '',
          p.customWeights ? (Array.isArray(p.customWeights) ? p.customWeights.join(', ') : String(p.customWeights)) : '',
          p.expiryDate || ''
        ]);
      }
      return ContentService.createTextOutput(JSON.stringify({status:'success'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // POST ACTION 4: Overwrite settings configuration
    if (data.action === 'saveSettings') {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings') 
                  || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Settings');
      sheet.clearContents();
      sheet.appendRow(['Key', 'Value']);
      sheet.getRange("A1:B1").setFontWeight("bold");
      
      var settings = data.settings;
      for (var key in settings) {
        sheet.appendRow([key, JSON.stringify(settings[key])]);
      }
      return ContentService.createTextOutput(JSON.stringify({status:'success'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status:'error',message:err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
