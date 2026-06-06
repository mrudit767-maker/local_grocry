// ============================================================
// KIRANA AI - COMPREHENSIVE INDIAN RECIPE DATABASE (1000+)
// Each recipe has: name, emoji, ingredients list, message
// ============================================================

export interface Recipe {
  name: string;
  ingredients: string[];
  message: string;
}

export const RECIPE_DB: Record<string, Recipe> = {

  // ═══════════════════════════════════════════════
  // PANEER DISHES
  // ═══════════════════════════════════════════════
  'paneer butter masala': { name: 'Paneer Butter Masala 🍛', ingredients: ['Paneer', 'Butter', 'Tomato', 'Fresh Cream', 'Onion', 'Ginger', 'Garlic', 'Garam Masala', 'Chili Powder', 'Kasuri Methi'], message: 'Excellent choice! Required ingredients for Paneer Butter Masala:' },
  'mutter paneer': { name: 'Mutter Paneer 🍛', ingredients: ['Paneer', 'Green Peas', 'Tomato', 'Onion', 'Ginger', 'Garlic', 'Ghee', 'Garam Masala', 'Cumin Seeds'], message: 'Ingredients for hot, home-style Mutter Paneer:' },
  'shahi paneer': { name: 'Shahi Paneer 🍛', ingredients: ['Paneer', 'Butter', 'Fresh Cream', 'Tomato', 'Onion', 'Almonds', 'Cardamom', 'Kasuri Methi', 'Milk'], message: 'Rich ingredients for Shahi Paneer:' },
  'kadhai paneer': { name: 'Kadhai Paneer 🍛', ingredients: ['Paneer', 'Capsicum', 'Onion', 'Tomato', 'Ginger', 'Garlic', 'Garam Masala', 'Oil', 'Red Chili'], message: 'Spicy Kadhai Paneer ingredients:' },
  'palak paneer': { name: 'Palak Paneer 🥬', ingredients: ['Paneer', 'Spinach', 'Butter', 'Onion', 'Garlic', 'Ginger', 'Garam Masala', 'Cream', 'Salt'], message: 'Healthy Palak Paneer ingredients:' },
  'paneer tikka': { name: 'Paneer Tikka 🍢', ingredients: ['Paneer', 'Curd / Yogurt', 'Capsicum', 'Onion', 'Tomato', 'Chili Powder', 'Garam Masala', 'Lemon', 'Oil'], message: 'Juicy Paneer Tikka marinade and ingredients:' },
  'paneer tikka masala': { name: 'Paneer Tikka Masala 🍛', ingredients: ['Paneer', 'Curd', 'Tomato', 'Onion', 'Cream', 'Garam Masala', 'Ginger', 'Garlic', 'Kasuri Methi'], message: 'Restaurant-style Paneer Tikka Masala ingredients:' },
  'paneer bhurji': { name: 'Paneer Bhurji 🍳', ingredients: ['Paneer', 'Onion', 'Tomato', 'Ginger', 'Garlic', 'Green Chili', 'Turmeric', 'Oil', 'Coriander'], message: 'Quick Paneer Bhurji ingredients:' },
  'paneer do pyaza': { name: 'Paneer Do Pyaza 🍛', ingredients: ['Paneer', 'Onion', 'Tomato', 'Ghee', 'Ginger', 'Garlic', 'Garam Masala', 'Spices'], message: 'Ingredients for Paneer Do Pyaza:' },
  'paneer lababdar': { name: 'Paneer Lababdar 🍛', ingredients: ['Paneer', 'Tomato', 'Onion', 'Cream', 'Butter', 'Garam Masala', 'Kasuri Methi', 'Cardamom'], message: 'Rich Paneer Lababdar ingredients:' },
  'paneer makhani': { name: 'Paneer Makhani 🍛', ingredients: ['Paneer', 'Butter', 'Tomato', 'Cream', 'Garam Masala', 'Kasuri Methi', 'Cardamom', 'Sugar'], message: 'Buttery Paneer Makhani ingredients:' },
  'paneer pasanda': { name: 'Paneer Pasanda 🍛', ingredients: ['Paneer', 'Cream', 'Tomato', 'Onion', 'Cashew', 'Almonds', 'Butter', 'Cardamom', 'Saffron'], message: 'Mughlai Paneer Pasanda ingredients:' },
  'saag paneer': { name: 'Saag Paneer 🥬', ingredients: ['Paneer', 'Spinach', 'Mustard Leaves', 'Ghee', 'Onion', 'Ginger', 'Garlic', 'Garam Masala'], message: 'Punjabi Saag Paneer ingredients:' },
  'paneer kolhapuri': { name: 'Paneer Kolhapuri 🌶️', ingredients: ['Paneer', 'Onion', 'Tomato', 'Coconut', 'Red Chili', 'Spices', 'Oil', 'Garlic'], message: 'Spicy Paneer Kolhapuri ingredients:' },
  'paneer jalfrezi': { name: 'Paneer Jalfrezi 🍛', ingredients: ['Paneer', 'Capsicum', 'Onion', 'Tomato', 'Chili', 'Ginger', 'Garlic', 'Oil', 'Vinegar'], message: 'Stir-fried Paneer Jalfrezi ingredients:' },
  'paneer korma': { name: 'Paneer Korma 🍛', ingredients: ['Paneer', 'Cashew', 'Cream', 'Ghee', 'Onion', 'Cardamom', 'Saffron', 'Almonds', 'Rose Water'], message: 'Mughlai Paneer Korma ingredients:' },
  'paneer kofta': { name: 'Paneer Kofta 🍛', ingredients: ['Paneer', 'Potato', 'Maida', 'Onion', 'Tomato', 'Cream', 'Oil', 'Spices'], message: 'Soft Paneer Kofta curry ingredients:' },
  'paneer chilli': { name: 'Paneer Chilli 🌶️', ingredients: ['Paneer', 'Capsicum', 'Onion', 'Soy Sauce', 'Chili Sauce', 'Cornflour', 'Oil', 'Vinegar'], message: 'Indo-Chinese Paneer Chilli ingredients:' },

  // ═══════════════════════════════════════════════
  // RICE DISHES
  // ═══════════════════════════════════════════════
  'biryani': { name: 'Veg Biryani 🍚', ingredients: ['Basmati Rice', 'Ghee', 'Onion', 'Tomato', 'Carrot', 'Green Peas', 'Potato', 'Biryani Masala', 'Mint Leaves', 'Saffron', 'Curd'], message: 'Aromatic Veg Biryani ingredients:' },
  'veg biryani': { name: 'Veg Biryani 🍚', ingredients: ['Basmati Rice', 'Ghee', 'Onion', 'Tomato', 'Carrot', 'Green Peas', 'Potato', 'Biryani Masala', 'Mint Leaves', 'Saffron', 'Curd'], message: 'Hyderabadi Veg Biryani ingredients:' },
  'jeera rice': { name: 'Jeera Rice 🍚', ingredients: ['Basmati Rice', 'Cumin Seeds', 'Ghee', 'Salt', 'Cardamom', 'Bay Leaves'], message: 'Fluffy Jeera Rice ingredients:' },
  'pulao': { name: 'Veg Pulao 🍚', ingredients: ['Basmati Rice', 'Ghee', 'Carrot', 'Green Peas', 'Potato', 'Spices', 'Salt', 'Onion'], message: 'Easy Veg Pulao ingredients:' },
  'khichdi': { name: 'Moong Dal Khichdi 🍲', ingredients: ['Rice', 'Moong Dal', 'Desi Ghee', 'Turmeric', 'Salt', 'Cumin Seeds', 'Ginger', 'Asafoetida'], message: 'Healthy Moong Dal Khichdi ingredients:' },
  'curd rice': { name: 'Curd Rice 🍚', ingredients: ['Rice', 'Curd', 'Mustard Seeds', 'Curry Leaves', 'Ginger', 'Salt', 'Oil', 'Pomegranate'], message: 'South Indian Curd Rice ingredients:' },
  'lemon rice': { name: 'Lemon Rice 🍋', ingredients: ['Rice', 'Lemon', 'Oil', 'Mustard Seeds', 'Peanuts', 'Turmeric', 'Curry Leaves', 'Salt'], message: 'Tangy South Indian Lemon Rice ingredients:' },
  'tamarind rice': { name: 'Tamarind Rice 🍚', ingredients: ['Rice', 'Tamarind', 'Oil', 'Mustard Seeds', 'Peanuts', 'Curry Leaves', 'Sesame Seeds', 'Red Chili'], message: 'Puliyogare Tamarind Rice ingredients:' },
  'tomato rice': { name: 'Tomato Rice 🍅', ingredients: ['Rice', 'Tomato', 'Oil', 'Mustard Seeds', 'Onion', 'Turmeric', 'Curry Leaves', 'Red Chili'], message: 'Easy Tomato Rice ingredients:' },
  'coconut rice': { name: 'Coconut Rice 🥥', ingredients: ['Rice', 'Coconut', 'Oil', 'Mustard Seeds', 'Cashew', 'Curry Leaves', 'Green Chili', 'Salt'], message: 'Fragrant Coconut Rice ingredients:' },
  'fried rice': { name: 'Veg Fried Rice 🍳', ingredients: ['Rice', 'Carrot', 'Green Peas', 'Capsicum', 'Onion', 'Soy Sauce', 'Butter', 'Pepper', 'Salt'], message: 'Indo-Chinese Veg Fried Rice ingredients:' },
  'dal chawal': { name: 'Dal Chawal 🍚', ingredients: ['Rice', 'Toor Dal', 'Ghee', 'Turmeric', 'Cumin Seeds', 'Mustard Seeds', 'Salt', 'Garlic', 'Onion'], message: 'Comfort Dal Chawal ingredients:' },
  'peas pulao': { name: 'Matar Pulao 🌿', ingredients: ['Basmati Rice', 'Green Peas', 'Ghee', 'Onion', 'Cumin Seeds', 'Bay Leaves', 'Cardamom', 'Salt'], message: 'Delicious Matar Pulao ingredients:' },
  'kashmiri pulao': { name: 'Kashmiri Pulao 🌸', ingredients: ['Basmati Rice', 'Saffron', 'Ghee', 'Dry Fruits', 'Cardamom', 'Milk', 'Rose Water', 'Sugar'], message: 'Royal Kashmiri Pulao ingredients:' },
  'mushroom biryani': { name: 'Mushroom Biryani 🍄', ingredients: ['Basmati Rice', 'Mushroom', 'Biryani Masala', 'Onion', 'Tomato', 'Curd', 'Ghee', 'Mint', 'Saffron'], message: 'Mushroom Biryani ingredients:' },
  'methi rice': { name: 'Methi Rice 🌿', ingredients: ['Rice', 'Fenugreek Leaves', 'Onion', 'Garlic', 'Oil', 'Mustard Seeds', 'Turmeric', 'Salt'], message: 'Healthy Methi Rice ingredients:' },
  'bisi bele bath': { name: 'Bisi Bele Bath 🍲', ingredients: ['Rice', 'Toor Dal', 'Mixed Vegetables', 'Tamarind', 'Ghee', 'Sambhar Masala', 'Mustard Seeds', 'Curry Leaves'], message: 'Karnataka special Bisi Bele Bath ingredients:' },

  // ═══════════════════════════════════════════════
  // DAL / LENTIL DISHES
  // ═══════════════════════════════════════════════
  'dal fry': { name: 'Dal Fry 🥣', ingredients: ['Toor Dal', 'Moong Dal', 'Ghee', 'Onion', 'Tomato', 'Garlic', 'Ginger', 'Mustard Seeds', 'Cumin Seeds', 'Red Chili'], message: 'Dhaba-style Dal Fry ingredients:' },
  'dal tadka': { name: 'Dal Tadka 🥣', ingredients: ['Toor Dal', 'Ghee', 'Red Chili', 'Garlic', 'Mustard Seeds', 'Cumin Seeds', 'Asafoetida', 'Turmeric'], message: 'Restaurant-style Dal Tadka ingredients:' },
  'dal makhani': { name: 'Dal Makhani 🥣', ingredients: ['Black Lentils', 'Kidney Beans', 'Butter', 'Cream', 'Tomato', 'Onion', 'Ginger', 'Garlic', 'Garam Masala'], message: 'Punjabi Dal Makhani ingredients:' },
  'moong dal': { name: 'Moong Dal 🥣', ingredients: ['Moong Dal', 'Ghee', 'Mustard Seeds', 'Cumin Seeds', 'Ginger', 'Turmeric', 'Salt', 'Lemon'], message: 'Simple Moong Dal ingredients:' },
  'masoor dal': { name: 'Masoor Dal 🥣', ingredients: ['Masoor Dal', 'Oil', 'Onion', 'Tomato', 'Garlic', 'Ginger', 'Turmeric', 'Red Chili', 'Garam Masala'], message: 'Red Masoor Dal ingredients:' },
  'chana dal': { name: 'Chana Dal 🥣', ingredients: ['Chana Dal', 'Oil', 'Onion', 'Tomato', 'Ginger', 'Garlic', 'Cumin Seeds', 'Garam Masala', 'Turmeric'], message: 'Bengali Chana Dal ingredients:' },
  'urad dal': { name: 'Urad Dal 🥣', ingredients: ['Urad Dal', 'Ghee', 'Cumin Seeds', 'Asafoetida', 'Ginger', 'Turmeric', 'Red Chili', 'Salt'], message: 'Simple Urad Dal ingredients:' },
  'panchmel dal': { name: 'Panchmel Dal 🥣', ingredients: ['Toor Dal', 'Moong Dal', 'Masoor Dal', 'Chana Dal', 'Urad Dal', 'Ghee', 'Spices', 'Onion', 'Tomato'], message: 'Rajasthani Panchmel Dal ingredients:' },
  'sambhar': { name: 'South Indian Sambhar 🥣', ingredients: ['Toor Dal', 'Mixed Vegetables', 'Tamarind', 'Sambhar Masala', 'Mustard Seeds', 'Curry Leaves', 'Oil', 'Tomato'], message: 'Authentic Sambhar ingredients:' },
  'rasam': { name: 'Pepper Rasam 🍵', ingredients: ['Tomato', 'Tamarind', 'Black Pepper', 'Cumin Seeds', 'Garlic', 'Mustard Seeds', 'Curry Leaves', 'Oil'], message: 'South Indian Pepper Rasam ingredients:' },
  'dal palak': { name: 'Dal Palak 🥬', ingredients: ['Toor Dal', 'Spinach', 'Ghee', 'Onion', 'Tomato', 'Garlic', 'Ginger', 'Garam Masala', 'Turmeric'], message: 'Healthy Dal Palak ingredients:' },
  'dal baati churma': { name: 'Dal Baati Churma 🫓', ingredients: ['Wheat Flour', 'Ghee', 'Moong Dal', 'Toor Dal', 'Chana Dal', 'Urad Dal', 'Spices', 'Sugar', 'Jaggery'], message: 'Rajasthani Dal Baati Churma ingredients:' },
  'arhar dal': { name: 'Arhar Dal 🥣', ingredients: ['Toor Dal', 'Oil', 'Mustard Seeds', 'Curry Leaves', 'Onion', 'Tomato', 'Turmeric', 'Red Chili'], message: 'Simple Arhar Dal ingredients:' },
  'rajma': { name: 'Rajma 🍲', ingredients: ['Kidney Beans', 'Onion', 'Tomato', 'Ginger', 'Garlic', 'Rajma Masala', 'Oil', 'Cumin Seeds', 'Garam Masala'], message: 'Punjabi Rajma ingredients:' },
  'rajma chawal': { name: 'Rajma Chawal 🍚', ingredients: ['Kidney Beans', 'Rice', 'Onion', 'Tomato', 'Ginger', 'Garlic', 'Rajma Masala', 'Oil', 'Butter'], message: 'Classic Rajma Chawal ingredients:' },

  // ═══════════════════════════════════════════════
  // BREAKFAST DISHES
  // ═══════════════════════════════════════════════
  'poha': { name: 'Indori Poha 🧆', ingredients: ['Poha', 'Oil', 'Mustard Seeds', 'Peanuts', 'Onion', 'Potato', 'Turmeric', 'Salt', 'Sev', 'Lemon', 'Coriander'], message: 'Classic Indori Poha ingredients:' },
  'upma': { name: 'Suji Upma 🍲', ingredients: ['Semolina', 'Ghee', 'Mustard Seeds', 'Onion', 'Peanuts', 'Green Chili', 'Curry Leaves', 'Salt', 'Cashew'], message: 'Healthy Suji Upma ingredients:' },
  'aloo paratha': { name: 'Aloo Paratha 🫓', ingredients: ['Wheat Flour', 'Potato', 'Ghee', 'Salt', 'Green Chili', 'Coriander', 'Garam Masala', 'Curd', 'Butter'], message: 'Stuffed Aloo Paratha ingredients:' },
  'gobi paratha': { name: 'Gobi Paratha 🫓', ingredients: ['Wheat Flour', 'Cauliflower', 'Ghee', 'Salt', 'Green Chili', 'Garam Masala', 'Coriander', 'Curd'], message: 'Fresh Gobi Paratha ingredients:' },
  'dal paratha': { name: 'Dal Paratha 🫓', ingredients: ['Wheat Flour', 'Chana Dal', 'Ghee', 'Salt', 'Green Chili', 'Coriander', 'Cumin', 'Garam Masala'], message: 'Nutritious Dal Paratha ingredients:' },
  'mooli paratha': { name: 'Mooli Paratha 🫓', ingredients: ['Wheat Flour', 'Radish', 'Ghee', 'Salt', 'Green Chili', 'Coriander', 'Garam Masala', 'Curd'], message: 'Winter special Mooli Paratha ingredients:' },
  'methi paratha': { name: 'Methi Paratha 🌿', ingredients: ['Wheat Flour', 'Fenugreek Leaves', 'Ghee', 'Salt', 'Garlic', 'Cumin', 'Curd'], message: 'Healthy Methi Paratha ingredients:' },
  'plain paratha': { name: 'Plain Paratha 🫓', ingredients: ['Wheat Flour', 'Ghee', 'Salt', 'Oil'], message: 'Simple Plain Paratha ingredients:' },
  'roti': { name: 'Whole Wheat Roti 🫓', ingredients: ['Wheat Flour', 'Water', 'Salt', 'Ghee'], message: 'Basic Roti ingredients:' },
  'chapati': { name: 'Soft Chapati 🫓', ingredients: ['Wheat Flour', 'Water', 'Salt', 'Ghee'], message: 'Soft Chapati ingredients:' },
  'puri': { name: 'Crispy Puri 🫓', ingredients: ['Wheat Flour', 'Semolina', 'Oil', 'Salt', 'Carom Seeds'], message: 'Crispy Puri ingredients:' },
  'bhature': { name: 'Bhature 🫓', ingredients: ['Maida', 'Semolina', 'Curd', 'Oil', 'Salt', 'Sugar', 'Baking Soda'], message: 'Soft Bhature ingredients:' },
  'idli': { name: 'Soft Idli 🧆', ingredients: ['Idli Rice', 'Urad Dal', 'Salt', 'Fenugreek Seeds', 'Oil'], message: 'Soft South Indian Idli ingredients:' },
  'dosa': { name: 'Crispy Dosa 🫓', ingredients: ['Rice', 'Urad Dal', 'Fenugreek Seeds', 'Salt', 'Oil', 'Potato', 'Mustard Seeds', 'Curry Leaves'], message: 'Crispy Masala Dosa ingredients:' },
  'masala dosa': { name: 'Masala Dosa 🫓', ingredients: ['Dosa Batter', 'Potato', 'Onion', 'Mustard Seeds', 'Curry Leaves', 'Turmeric', 'Oil', 'Urad Dal'], message: 'Restaurant-style Masala Dosa ingredients:' },
  'uttapam': { name: 'Vegetable Uttapam 🥞', ingredients: ['Dosa Batter', 'Onion', 'Tomato', 'Capsicum', 'Green Chili', 'Oil', 'Salt', 'Coriander'], message: 'Crispy Vegetable Uttapam ingredients:' },
  'pesarattu': { name: 'Pesarattu 🥞', ingredients: ['Moong Dal', 'Rice', 'Ginger', 'Green Chili', 'Salt', 'Onion', 'Oil'], message: 'Andhra Pesarattu ingredients:' },
  'rava dosa': { name: 'Rava Dosa 🥞', ingredients: ['Semolina', 'Rice Flour', 'Onion', 'Green Chili', 'Coriander', 'Cumin', 'Oil', 'Salt', 'Cashew'], message: 'Crispy Rava Dosa ingredients:' },
  'omelette': { name: 'Masala Omelette 🍳', ingredients: ['Eggs', 'Butter', 'Onion', 'Tomato', 'Salt', 'Black Pepper', 'Green Chili', 'Coriander'], message: 'Masala Omelette ingredients:' },
  'egg bhurji': { name: 'Egg Bhurji 🍳', ingredients: ['Eggs', 'Butter', 'Onion', 'Tomato', 'Salt', 'Spices', 'Green Chili', 'Capsicum'], message: 'Street-style Egg Bhurji ingredients:' },
  'dhokla': { name: 'Gujarati Dhokla 🧆', ingredients: ['Besan', 'Lemon', 'Sugar', 'Mustard Seeds', 'Curry Leaves', 'Green Chili', 'Oil', 'Eno'], message: 'Fluffy Khaman Dhokla ingredients:' },
  'khandvi': { name: 'Gujarati Khandvi 🌀', ingredients: ['Besan', 'Buttermilk', 'Turmeric', 'Ginger Paste', 'Oil', 'Mustard Seeds', 'Sesame Seeds', 'Curry Leaves', 'Coconut'], message: 'Silky Khandvi ingredients:' },
  'bread upma': { name: 'Bread Upma 🍞', ingredients: ['Bread', 'Onion', 'Tomato', 'Oil', 'Mustard Seeds', 'Peanuts', 'Green Chili', 'Curry Leaves', 'Salt', 'Lemon'], message: 'Quick Bread Upma ingredients:' },
  'bread poha': { name: 'Bread Poha 🍞', ingredients: ['Bread', 'Onion', 'Potato', 'Mustard Seeds', 'Peanuts', 'Turmeric', 'Lemon', 'Oil', 'Salt'], message: 'Bread Poha ingredients:' },
  'sabudana khichdi': { name: 'Sabudana Khichdi 🌾', ingredients: ['Sabudana', 'Peanuts', 'Potato', 'Ghee', 'Cumin Seeds', 'Green Chili', 'Salt', 'Lemon', 'Coriander'], message: 'Sabudana Khichdi fasting recipe ingredients:' },
  'vermicelli upma': { name: 'Semiya Upma 🍜', ingredients: ['Vermicelli', 'Ghee', 'Mustard Seeds', 'Onion', 'Carrot', 'Green Peas', 'Cashew', 'Curry Leaves', 'Salt'], message: 'Vermicelli Upma ingredients:' },
  'oats upma': { name: 'Oats Upma 🥣', ingredients: ['Oats', 'Oil', 'Mustard Seeds', 'Onion', 'Carrot', 'Green Peas', 'Green Chili', 'Curry Leaves', 'Salt'], message: 'Healthy Oats Upma ingredients:' },
  'poha chivda': { name: 'Poha Chivda 🍿', ingredients: ['Poha', 'Oil', 'Peanuts', 'Mustard Seeds', 'Curry Leaves', 'Sugar', 'Salt', 'Chili', 'Cashew'], message: 'Crispy Poha Chivda ingredients:' },

  // ═══════════════════════════════════════════════
  // CURRIES & SABZIS
  // ═══════════════════════════════════════════════
  'aloo sabzi': { name: 'Aloo Sabzi 🥔', ingredients: ['Potato', 'Oil', 'Cumin Seeds', 'Turmeric', 'Red Chili', 'Coriander Powder', 'Garam Masala', 'Salt'], message: 'Simple Aloo Sabzi ingredients:' },
  'aloo gobi': { name: 'Aloo Gobi 🥦', ingredients: ['Potato', 'Cauliflower', 'Oil', 'Onion', 'Tomato', 'Ginger', 'Garlic', 'Turmeric', 'Garam Masala', 'Salt'], message: 'Classic Aloo Gobi ingredients:' },
  'aloo mutter': { name: 'Aloo Mutter 🌿', ingredients: ['Potato', 'Green Peas', 'Onion', 'Tomato', 'Oil', 'Ginger', 'Garlic', 'Garam Masala', 'Turmeric'], message: 'Delicious Aloo Mutter ingredients:' },
  'aloo methi': { name: 'Aloo Methi 🌿', ingredients: ['Potato', 'Fenugreek Leaves', 'Oil', 'Garlic', 'Cumin Seeds', 'Red Chili', 'Turmeric', 'Salt'], message: 'Aloo Methi fry ingredients:' },
  'aloo jeera': { name: 'Aloo Jeera 🥔', ingredients: ['Potato', 'Cumin Seeds', 'Ghee', 'Salt', 'Red Chili', 'Coriander', 'Turmeric'], message: 'Quick Aloo Jeera ingredients:' },
  'aloo tamatar': { name: 'Aloo Tamatar 🍅', ingredients: ['Potato', 'Tomato', 'Onion', 'Oil', 'Cumin Seeds', 'Garam Masala', 'Turmeric', 'Red Chili', 'Salt'], message: 'Classic Aloo Tamatar ingredients:' },
  'bhindi masala': { name: 'Bhindi Masala 🌿', ingredients: ['Okra', 'Onion', 'Tomato', 'Oil', 'Cumin Seeds', 'Turmeric', 'Coriander Powder', 'Garam Masala', 'Salt'], message: 'Crispy Bhindi Masala ingredients:' },
  'bhindi do pyaza': { name: 'Bhindi Do Pyaza 🌿', ingredients: ['Okra', 'Onion', 'Tomato', 'Oil', 'Cumin Seeds', 'Spices', 'Salt', 'Garlic'], message: 'Bhindi Do Pyaza ingredients:' },
  'karela sabzi': { name: 'Karela Sabzi 🌿', ingredients: ['Bitter Gourd', 'Onion', 'Oil', 'Turmeric', 'Red Chili', 'Jaggery', 'Salt', 'Spices'], message: 'Healthy Karela Sabzi ingredients:' },
  'lauki sabzi': { name: 'Lauki Sabzi 🫙', ingredients: ['Bottle Gourd', 'Oil', 'Cumin Seeds', 'Tomato', 'Onion', 'Turmeric', 'Garam Masala', 'Salt', 'Coriander'], message: 'Light Lauki Sabzi ingredients:' },
  'tinda sabzi': { name: 'Tinda Sabzi 🫙', ingredients: ['Round Gourd', 'Onion', 'Tomato', 'Oil', 'Cumin Seeds', 'Turmeric', 'Red Chili', 'Salt'], message: 'Tinda Sabzi ingredients:' },
  'pumpkin sabzi': { name: 'Kaddu Sabzi 🎃', ingredients: ['Pumpkin', 'Oil', 'Mustard Seeds', 'Curry Leaves', 'Red Chili', 'Jaggery', 'Salt', 'Turmeric'], message: 'Sweet-spicy Kaddu Sabzi ingredients:' },
  'gobi masala': { name: 'Gobi Masala 🥦', ingredients: ['Cauliflower', 'Onion', 'Tomato', 'Oil', 'Ginger', 'Garlic', 'Garam Masala', 'Turmeric', 'Red Chili'], message: 'Spicy Gobi Masala ingredients:' },
  'baingan bharta': { name: 'Baingan Bharta 🍆', ingredients: ['Eggplant', 'Onion', 'Tomato', 'Oil', 'Garlic', 'Ginger', 'Garam Masala', 'Green Chili', 'Coriander'], message: 'Smoky Baingan Bharta ingredients:' },
  'baingan masala': { name: 'Baingan Masala 🍆', ingredients: ['Eggplant', 'Onion', 'Tomato', 'Oil', 'Ginger', 'Garlic', 'Spices', 'Sesame Seeds', 'Peanuts'], message: 'Spicy Baingan Masala ingredients:' },
  'capsicum masala': { name: 'Capsicum Masala 🫑', ingredients: ['Capsicum', 'Onion', 'Tomato', 'Oil', 'Garlic', 'Ginger', 'Garam Masala', 'Sesame Seeds', 'Peanuts'], message: 'Stuffed Capsicum Masala ingredients:' },
  'mixed veg': { name: 'Mixed Vegetable Curry 🥗', ingredients: ['Carrot', 'Green Peas', 'Potato', 'Beans', 'Cauliflower', 'Onion', 'Tomato', 'Oil', 'Spices'], message: 'Colorful Mixed Veg Curry ingredients:' },
  'mushroom curry': { name: 'Mushroom Masala Curry 🍄', ingredients: ['Mushroom', 'Onion', 'Tomato', 'Oil', 'Ginger', 'Garlic', 'Garam Masala', 'Cream', 'Salt'], message: 'Creamy Mushroom Masala ingredients:' },
  'mushroom masala': { name: 'Mushroom Masala 🍄', ingredients: ['Mushroom', 'Onion', 'Tomato', 'Capsicum', 'Oil', 'Garam Masala', 'Ginger', 'Garlic'], message: 'Spicy Mushroom Masala ingredients:' },
  'jackfruit curry': { name: 'Kathal Curry 🫙', ingredients: ['Jackfruit', 'Onion', 'Tomato', 'Oil', 'Ginger', 'Garlic', 'Garam Masala', 'Turmeric', 'Red Chili'], message: 'Kathal (Jackfruit) Curry ingredients:' },
  'soya curry': { name: 'Soya Chunks Curry 🌱', ingredients: ['Soya Chunks', 'Onion', 'Tomato', 'Oil', 'Ginger', 'Garlic', 'Spices', 'Cream', 'Garam Masala'], message: 'Protein-rich Soya Chunks Curry ingredients:' },
  'corn curry': { name: 'Corn Curry 🌽', ingredients: ['Corn', 'Onion', 'Tomato', 'Cream', 'Oil', 'Ginger', 'Garlic', 'Spices', 'Butter'], message: 'Sweet Corn Curry ingredients:' },
  'dum aloo': { name: 'Dum Aloo 🥔', ingredients: ['Baby Potato', 'Curd', 'Tomato', 'Onion', 'Oil', 'Ginger', 'Garlic', 'Garam Masala', 'Fennel Seeds'], message: 'Kashmiri Dum Aloo ingredients:' },
  'navratan korma': { name: 'Navratan Korma 🍛', ingredients: ['Mixed Vegetables', 'Paneer', 'Cashew', 'Cream', 'Ghee', 'Raisins', 'Pineapple', 'Cardamom', 'Sugar', 'Saffron'], message: 'Royal Navratan Korma ingredients:' },
  'vegetable kolhapuri': { name: 'Vegetable Kolhapuri 🌶️', ingredients: ['Mixed Vegetables', 'Coconut', 'Red Chili', 'Oil', 'Onion', 'Tomato', 'Spices', 'Garlic'], message: 'Spicy Veg Kolhapuri ingredients:' },
  'sindhi curry': { name: 'Sindhi Kadhi 🍲', ingredients: ['Besan', 'Tamarind', 'Mixed Vegetables', 'Oil', 'Mustard Seeds', 'Curry Leaves', 'Red Chili', 'Turmeric'], message: 'Tangy Sindhi Kadhi ingredients:' },
  'kadhi pakora': { name: 'Kadhi Pakora 🍲', ingredients: ['Besan', 'Curd', 'Onion', 'Oil', 'Mustard Seeds', 'Fenugreek Seeds', 'Curry Leaves', 'Red Chili', 'Turmeric'], message: 'Punjabi Kadhi Pakora ingredients:' },
  'gujarati kadhi': { name: 'Gujarati Kadhi 🍲', ingredients: ['Besan', 'Curd', 'Sugar', 'Ginger', 'Green Chili', 'Mustard Seeds', 'Curry Leaves', 'Ghee'], message: 'Sweet-tangy Gujarati Kadhi ingredients:' },

  // ═══════════════════════════════════════════════
  // STREET FOOD & CHAAT
  // ═══════════════════════════════════════════════
  'pav bhaji': { name: 'Bhopali Pav Bhaji 🧆', ingredients: ['Pav', 'Butter', 'Potato', 'Onion', 'Tomato', 'Green Peas', 'Capsicum', 'Pav Bhaji Masala', 'Lemon', 'Coriander'], message: 'Mouthwatering Pav Bhaji ingredients:' },
  'chole bhature': { name: 'Chole Bhature 🫓', ingredients: ['Chickpeas', 'Maida', 'Oil', 'Onion', 'Tomato', 'Chole Masala', 'Ginger', 'Garlic', 'Salt', 'Curd'], message: 'Punjabi Chole Bhature ingredients:' },
  'chole': { name: 'Amritsari Chole 🍲', ingredients: ['Chickpeas', 'Onion', 'Tomato', 'Chole Masala', 'Ginger', 'Garlic', 'Salt', 'Oil', 'Cumin Seeds'], message: 'Spicy Amritsari Chole ingredients:' },
  'samosa': { name: 'Crispy Aloo Samosa 🥟', ingredients: ['Maida', 'Potato', 'Green Peas', 'Oil', 'Salt', 'Spices', 'Carom Seeds', 'Garam Masala'], message: 'Crispy Aloo Samosa ingredients:' },
  'kachori': { name: 'Khasta Kachori 🥟', ingredients: ['Maida', 'Moong Dal', 'Oil', 'Cumin Seeds', 'Fennel', 'Garam Masala', 'Red Chili', 'Salt'], message: 'Khasta Kachori ingredients:' },
  'pani puri': { name: 'Pani Puri 🫧', ingredients: ['Puri', 'Potato', 'Chickpeas', 'Tamarind', 'Mint', 'Coriander', 'Green Chili', 'Cumin', 'Black Salt'], message: 'Pani Puri (Golgappa) ingredients:' },
  'bhel puri': { name: 'Bhel Puri 🍿', ingredients: ['Puffed Rice', 'Sev', 'Tomato', 'Onion', 'Potato', 'Tamarind Chutney', 'Green Chutney', 'Lemon', 'Coriander'], message: 'Mumbai Bhel Puri ingredients:' },
  'sev puri': { name: 'Sev Puri 🍿', ingredients: ['Puri', 'Sev', 'Potato', 'Tomato', 'Onion', 'Tamarind Chutney', 'Green Chutney', 'Coriander', 'Pomegranate'], message: 'Sev Puri ingredients:' },
  'dahi puri': { name: 'Dahi Puri 🫧', ingredients: ['Puri', 'Curd', 'Sev', 'Potato', 'Tamarind Chutney', 'Green Chutney', 'Pomegranate', 'Coriander'], message: 'Dahi Puri ingredients:' },
  'vada pav': { name: 'Mumbai Vada Pav 🫓', ingredients: ['Pav', 'Potato', 'Besan', 'Oil', 'Mustard Seeds', 'Garlic', 'Green Chili', 'Turmeric', 'Salt'], message: 'Mumbai Vada Pav ingredients:' },
  'aloo tikki': { name: 'Aloo Tikki Chaat 🥔', ingredients: ['Potato', 'Onion', 'Tomato', 'Curd', 'Tamarind Chutney', 'Green Chutney', 'Sev', 'Cumin', 'Oil'], message: 'Aloo Tikki Chaat ingredients:' },
  'papdi chaat': { name: 'Papdi Chaat 🍿', ingredients: ['Papdi', 'Potato', 'Chickpeas', 'Curd', 'Tamarind Chutney', 'Green Chutney', 'Sev', 'Cumin', 'Pomegranate'], message: 'Papdi Chaat ingredients:' },
  'dahi vada': { name: 'Dahi Vada 🫧', ingredients: ['Urad Dal', 'Curd', 'Tamarind Chutney', 'Cumin Powder', 'Red Chili', 'Oil', 'Coriander', 'Salt'], message: 'Dahi Vada ingredients:' },
  'masala corn': { name: 'Masala Corn 🌽', ingredients: ['Corn', 'Butter', 'Lemon', 'Red Chili', 'Salt', 'Chaat Masala', 'Coriander'], message: 'Street-style Masala Corn ingredients:' },
  'bread pakora': { name: 'Bread Pakora 🍞', ingredients: ['Bread', 'Besan', 'Potato', 'Oil', 'Salt', 'Red Chili', 'Carom Seeds', 'Spices'], message: 'Crispy Bread Pakora ingredients:' },
  'pakora': { name: 'Mixed Pakora 🥬', ingredients: ['Besan', 'Onion', 'Spinach', 'Green Chili', 'Oil', 'Salt', 'Red Chili', 'Carom Seeds', 'Coriander'], message: 'Monsoon Pakora ingredients:' },
  'mirchi bajji': { name: 'Mirchi Bajji 🌶️', ingredients: ['Green Chili', 'Besan', 'Oil', 'Salt', 'Red Chili', 'Carom Seeds', 'Potato', 'Tamarind'], message: 'Hyderabadi Mirchi Bajji ingredients:' },
  'onion pakora': { name: 'Onion Pakora 🧅', ingredients: ['Onion', 'Besan', 'Oil', 'Salt', 'Red Chili', 'Carom Seeds', 'Coriander', 'Green Chili'], message: 'Crispy Onion Pakora ingredients:' },
  'aloo bonda': { name: 'Aloo Bonda 🥔', ingredients: ['Potato', 'Besan', 'Oil', 'Mustard Seeds', 'Curry Leaves', 'Green Chili', 'Ginger', 'Salt', 'Turmeric'], message: 'South Indian Aloo Bonda ingredients:' },
  'medu vada': { name: 'Medu Vada 🍩', ingredients: ['Urad Dal', 'Oil', 'Ginger', 'Green Chili', 'Curry Leaves', 'Peppercorn', 'Coconut', 'Salt'], message: 'Crispy Medu Vada ingredients:' },

  // ═══════════════════════════════════════════════
  // SOUPS
  // ═══════════════════════════════════════════════
  'tomato soup': { name: 'Cream of Tomato Soup 🍅', ingredients: ['Tomato', 'Butter', 'Cream', 'Onion', 'Garlic', 'Sugar', 'Salt', 'Black Pepper', 'Basil'], message: 'Creamy Tomato Soup ingredients:' },
  'sweet corn soup': { name: 'Sweet Corn Soup 🌽', ingredients: ['Corn', 'Vegetable Stock', 'Cornflour', 'Pepper', 'Salt', 'Soy Sauce', 'Vinegar', 'Butter'], message: 'Restaurant-style Sweet Corn Soup ingredients:' },
  'hot and sour soup': { name: 'Hot & Sour Soup 🌶️', ingredients: ['Vegetable Stock', 'Cornflour', 'Vinegar', 'Soy Sauce', 'Pepper', 'Chili Sauce', 'Mushroom', 'Capsicum'], message: 'Indo-Chinese Hot & Sour Soup ingredients:' },
  'manchow soup': { name: 'Manchow Soup 🍜', ingredients: ['Vegetable Stock', 'Soy Sauce', 'Vinegar', 'Cornflour', 'Carrot', 'Cabbage', 'Spring Onion', 'Fried Noodles'], message: 'Indo-Chinese Manchow Soup ingredients:' },
  'vegetable soup': { name: 'Mixed Vegetable Soup 🥗', ingredients: ['Carrot', 'Beans', 'Potato', 'Onion', 'Tomato', 'Garlic', 'Butter', 'Black Pepper', 'Salt', 'Cornflour'], message: 'Healthy Mixed Vegetable Soup ingredients:' },
  'spinach soup': { name: 'Palak Soup 🥬', ingredients: ['Spinach', 'Onion', 'Garlic', 'Butter', 'Cream', 'Black Pepper', 'Salt', 'Cornflour', 'Nutmeg'], message: 'Healthy Spinach Soup ingredients:' },
  'lentil soup': { name: 'Dal Soup 🍵', ingredients: ['Masoor Dal', 'Onion', 'Tomato', 'Garlic', 'Ginger', 'Cumin', 'Turmeric', 'Salt', 'Lemon'], message: 'Nutritious Dal Soup ingredients:' },
  'mushroom soup': { name: 'Cream of Mushroom Soup 🍄', ingredients: ['Mushroom', 'Butter', 'Onion', 'Garlic', 'Cream', 'Flour', 'Milk', 'Salt', 'Black Pepper', 'Thyme'], message: 'Creamy Mushroom Soup ingredients:' },
  'pumpkin soup': { name: 'Pumpkin Soup 🎃', ingredients: ['Pumpkin', 'Onion', 'Garlic', 'Cream', 'Butter', 'Vegetable Stock', 'Nutmeg', 'Salt', 'Pepper'], message: 'Creamy Pumpkin Soup ingredients:' },

  // ═══════════════════════════════════════════════
  // NOODLES & PASTA (INDO-CHINESE)
  // ═══════════════════════════════════════════════
  'maggi': { name: 'Masala Maggi 🍜', ingredients: ['Maggi Noodles', 'Butter', 'Onion', 'Tomato', 'Green Peas', 'Capsicum', 'Maggi Masala'], message: 'Classic Masala Maggi ingredients:' },
  'veg noodles': { name: 'Veg Hakka Noodles 🍜', ingredients: ['Noodles', 'Carrot', 'Cabbage', 'Capsicum', 'Spring Onion', 'Soy Sauce', 'Vinegar', 'Chili Sauce', 'Oil'], message: 'Indo-Chinese Veg Hakka Noodles ingredients:' },
  'chow mein': { name: 'Veg Chow Mein 🍜', ingredients: ['Noodles', 'Carrot', 'Cabbage', 'Capsicum', 'Onion', 'Soy Sauce', 'Chili Sauce', 'Vinegar', 'Oil'], message: 'Spicy Veg Chow Mein ingredients:' },
  'pasta': { name: 'Creamy Pasta 🍝', ingredients: ['Pasta', 'Butter', 'Cream', 'Cheese', 'Garlic', 'Onion', 'Capsicum', 'Tomato Sauce', 'Oregano', 'Salt'], message: 'Creamy Italian Pasta ingredients:' },
  'macaroni': { name: 'Masala Macaroni 🍝', ingredients: ['Macaroni', 'Butter', 'Tomato Sauce', 'Onion', 'Capsicum', 'Garlic', 'Spices', 'Cheese'], message: 'Spicy Masala Macaroni ingredients:' },
  'spaghetti': { name: 'Tomato Spaghetti 🍝', ingredients: ['Spaghetti', 'Tomato', 'Garlic', 'Olive Oil', 'Basil', 'Onion', 'Sugar', 'Salt', 'Black Pepper'], message: 'Classic Tomato Spaghetti ingredients:' },
  'paneer noodles': { name: 'Paneer Noodles 🍜', ingredients: ['Noodles', 'Paneer', 'Capsicum', 'Carrot', 'Onion', 'Soy Sauce', 'Chili Sauce', 'Vinegar', 'Oil'], message: 'Paneer Noodles ingredients:' },

  // ═══════════════════════════════════════════════
  // DRINKS & BEVERAGES
  // ═══════════════════════════════════════════════
  'chai': { name: 'Ginger Cardamom Chai ☕', ingredients: ['Tea Leaves', 'Milk', 'Sugar', 'Ginger', 'Cardamom'], message: 'Perfect morning Chai ingredients:' },
  'tea': { name: 'Masala Chai ☕', ingredients: ['Tea Leaves', 'Milk', 'Sugar', 'Ginger', 'Cardamom', 'Cinnamon', 'Cloves', 'Black Pepper'], message: 'Masala Chai ingredients:' },
  'coffee': { name: 'South Indian Filter Coffee ☕', ingredients: ['Coffee Powder', 'Milk', 'Sugar'], message: 'Filter Coffee ingredients:' },
  'lemonade': { name: 'Fresh Lemonade 🍹', ingredients: ['Lemon', 'Sugar', 'Salt', 'Black Salt', 'Roasted Cumin'], message: 'Refreshing Lemonade ingredients:' },
  'nimbu pani': { name: 'Fresh Nimbu Pani 🍹', ingredients: ['Lemon', 'Sugar', 'Black Salt', 'Roasted Cumin', 'Mint'], message: 'Cooling Nimbu Pani ingredients:' },
  'lassi': { name: 'Sweet Lassi 🥛', ingredients: ['Curd', 'Sugar', 'Cardamom', 'Saffron', 'Rose Water', 'Ice'], message: 'Thick Sweet Lassi ingredients:' },
  'mango lassi': { name: 'Mango Lassi 🥭', ingredients: ['Mango', 'Curd', 'Sugar', 'Cardamom', 'Milk', 'Ice'], message: 'Mango Lassi ingredients:' },
  'rose milk': { name: 'Rose Milk 🌹', ingredients: ['Milk', 'Rose Syrup', 'Sugar', 'Ice', 'Cardamom'], message: 'Chilled Rose Milk ingredients:' },
  'chaas': { name: 'Spiced Chaas 🥛', ingredients: ['Curd', 'Water', 'Cumin', 'Ginger', 'Green Chili', 'Salt', 'Coriander', 'Mint'], message: 'Digestive Masala Chaas ingredients:' },
  'buttermilk': { name: 'Masala Buttermilk 🥛', ingredients: ['Curd', 'Water', 'Cumin Powder', 'Black Salt', 'Ginger', 'Coriander'], message: 'Masala Buttermilk ingredients:' },
  'milk': { name: 'Haldi Milk (Golden Milk) 🥛', ingredients: ['Milk', 'Turmeric', 'Honey', 'Ginger', 'Black Pepper', 'Cardamom'], message: 'Healthy Golden Milk ingredients:' },
  'haldi milk': { name: 'Haldi Doodh 🥛', ingredients: ['Milk', 'Turmeric', 'Honey', 'Ginger', 'Black Pepper'], message: 'Immunity boosting Haldi Milk ingredients:' },
  'banana milkshake': { name: 'Banana Milkshake 🍌', ingredients: ['Banana', 'Milk', 'Sugar', 'Cardamom', 'Honey', 'Ice Cream'], message: 'Creamy Banana Milkshake ingredients:' },
  'strawberry milkshake': { name: 'Strawberry Milkshake 🍓', ingredients: ['Strawberry', 'Milk', 'Sugar', 'Ice Cream', 'Vanilla'], message: 'Strawberry Milkshake ingredients:' },
  'chocolate milkshake': { name: 'Chocolate Milkshake 🍫', ingredients: ['Milk', 'Chocolate Powder', 'Sugar', 'Ice Cream', 'Vanilla'], message: 'Rich Chocolate Milkshake ingredients:' },
  'aam panna': { name: 'Aam Panna 🥭', ingredients: ['Raw Mango', 'Sugar', 'Black Salt', 'Roasted Cumin', 'Mint', 'Black Pepper'], message: 'Summer cooler Aam Panna ingredients:' },
  'jaljeera': { name: 'Jaljeera 🌿', ingredients: ['Mint', 'Coriander', 'Ginger', 'Cumin', 'Black Salt', 'Lemon', 'Tamarind'], message: 'Digestive Jaljeera ingredients:' },
  'sharbat': { name: 'Rose Sharbat 🌹', ingredients: ['Rose Syrup', 'Water', 'Sugar', 'Lemon', 'Ice', 'Sabja Seeds'], message: 'Refreshing Rose Sharbat ingredients:' },
  'bael sharbat': { name: 'Bael Sharbat 🥤', ingredients: ['Bael Fruit', 'Sugar', 'Black Salt', 'Roasted Cumin', 'Cardamom'], message: 'Healthy Bael Sharbat ingredients:' },
  'thandai': { name: 'Holi Thandai 🥛', ingredients: ['Milk', 'Almonds', 'Fennel Seeds', 'Cardamom', 'Saffron', 'Sugar', 'Poppy Seeds', 'Rose Petals', 'Peppercorn'], message: 'Festival Thandai ingredients:' },
  'masala chai': { name: 'Masala Chai ☕', ingredients: ['Tea Leaves', 'Milk', 'Sugar', 'Ginger', 'Cardamom', 'Cinnamon', 'Cloves', 'Black Pepper', 'Nutmeg'], message: 'Aromatic Masala Chai ingredients:' },
  'kadak chai': { name: 'Kadak Chai ☕', ingredients: ['Tea Leaves', 'Milk', 'Sugar', 'Ginger', 'Cardamom'], message: 'Strong Kadak Chai ingredients:' },

  // ═══════════════════════════════════════════════
  // SWEETS & DESSERTS
  // ═══════════════════════════════════════════════
  'halwa': { name: 'Suji Ka Halwa 🍮', ingredients: ['Semolina', 'Sugar', 'Ghee', 'Milk', 'Cardamom', 'Almonds', 'Raisins', 'Cashew'], message: 'Rich Suji Ka Halwa ingredients:' },
  'suji halwa': { name: 'Suji Ka Halwa 🍮', ingredients: ['Semolina', 'Sugar', 'Ghee', 'Milk', 'Cardamom', 'Almonds', 'Raisins', 'Cashew'], message: 'Suji Ka Halwa ingredients:' },
  'atte ka halwa': { name: 'Atte Ka Halwa 🍮', ingredients: ['Wheat Flour', 'Sugar', 'Ghee', 'Milk', 'Cardamom', 'Almonds', 'Raisins'], message: 'Nutritious Atte Ka Halwa ingredients:' },
  'moong dal halwa': { name: 'Moong Dal Halwa 🍮', ingredients: ['Moong Dal', 'Ghee', 'Sugar', 'Milk', 'Cardamom', 'Almonds', 'Cashew', 'Saffron'], message: 'Rich Moong Dal Halwa ingredients:' },
  'gajar halwa': { name: 'Gajar Ka Halwa 🥕', ingredients: ['Carrot', 'Milk', 'Sugar', 'Ghee', 'Cardamom', 'Almonds', 'Raisins', 'Cashew', 'Khoya'], message: 'Winter special Gajar Ka Halwa ingredients:' },
  'carrot halwa': { name: 'Gajar Ka Halwa 🥕', ingredients: ['Carrot', 'Milk', 'Sugar', 'Ghee', 'Cardamom', 'Almonds', 'Raisins', 'Khoya'], message: 'Carrot Halwa (Gajar Halwa) ingredients:' },
  'kheer': { name: 'Rice Kheer 🥣', ingredients: ['Rice', 'Milk', 'Sugar', 'Cardamom', 'Almonds', 'Raisins', 'Saffron', 'Rose Water'], message: 'Creamy Rice Kheer ingredients:' },
  'rice kheer': { name: 'Rice Kheer 🥣', ingredients: ['Rice', 'Milk', 'Sugar', 'Cardamom', 'Almonds', 'Raisins', 'Saffron', 'Rose Water'], message: 'Traditional Rice Kheer ingredients:' },
  'vermicelli kheer': { name: 'Seviyan Kheer 🥣', ingredients: ['Vermicelli', 'Milk', 'Sugar', 'Cardamom', 'Ghee', 'Almonds', 'Raisins', 'Cashew', 'Saffron'], message: 'Eid special Seviyan Kheer ingredients:' },
  'seviyan kheer': { name: 'Seviyan Kheer 🥣', ingredients: ['Vermicelli', 'Milk', 'Sugar', 'Cardamom', 'Ghee', 'Almonds', 'Raisins', 'Cashew'], message: 'Creamy Seviyan Kheer ingredients:' },
  'gulab jamun': { name: 'Gulab Jamun 🍬', ingredients: ['Milk Powder', 'Maida', 'Ghee', 'Sugar', 'Cardamom', 'Rose Water', 'Saffron', 'Oil'], message: 'Soft Gulab Jamun ingredients:' },
  'rasgulla': { name: 'Bengali Rasgulla 🍬', ingredients: ['Milk', 'Lemon', 'Sugar', 'Cardamom', 'Rose Water'], message: 'Spongy Rasgulla ingredients:' },
  'rasmalai': { name: 'Rasmalai 🍬', ingredients: ['Milk', 'Lemon', 'Sugar', 'Saffron', 'Cardamom', 'Almonds', 'Pistachios', 'Rose Water'], message: 'Royal Rasmalai ingredients:' },
  'barfi': { name: 'Kaju Barfi 🍬', ingredients: ['Cashew', 'Sugar', 'Milk', 'Ghee', 'Cardamom', 'Saffron', 'Silver Foil'], message: 'Kaju Barfi (Cashew Fudge) ingredients:' },
  'kaju barfi': { name: 'Kaju Barfi 🍬', ingredients: ['Cashew', 'Sugar', 'Milk', 'Ghee', 'Cardamom'], message: 'Classic Kaju Barfi ingredients:' },
  'besan barfi': { name: 'Besan Barfi 🍬', ingredients: ['Besan', 'Ghee', 'Sugar', 'Cardamom', 'Almonds', 'Milk'], message: 'Besan Barfi ingredients:' },
  'peda': { name: 'Milk Peda 🍬', ingredients: ['Milk Powder', 'Sugar', 'Ghee', 'Cardamom', 'Saffron', 'Almonds'], message: 'Soft Milk Peda ingredients:' },
  'sandesh': { name: 'Bengali Sandesh 🍬', ingredients: ['Paneer', 'Sugar', 'Cardamom', 'Saffron', 'Rose Water', 'Pistachios'], message: 'Bengali Sandesh ingredients:' },
  'laddu': { name: 'Besan Laddu 🍡', ingredients: ['Besan', 'Ghee', 'Sugar', 'Cardamom', 'Almonds', 'Cashew', 'Raisins'], message: 'Classic Besan Laddu ingredients:' },
  'boondi laddu': { name: 'Boondi Laddu 🍡', ingredients: ['Besan', 'Sugar', 'Oil', 'Cardamom', 'Saffron', 'Cashew', 'Raisins'], message: 'Festival Boondi Laddu ingredients:' },
  'coconut laddu': { name: 'Coconut Laddu 🥥', ingredients: ['Coconut', 'Sugar', 'Milk', 'Cardamom', 'Ghee', 'Cashew'], message: 'Sweet Coconut Laddu ingredients:' },
  'pista barfi': { name: 'Pista Barfi 🍬', ingredients: ['Pistachio', 'Sugar', 'Milk', 'Ghee', 'Cardamom', 'Rose Water'], message: 'Green Pista Barfi ingredients:' },
  'jalebi': { name: 'Crispy Jalebi 🌀', ingredients: ['Maida', 'Curd', 'Sugar', 'Saffron', 'Oil', 'Cardamom', 'Rose Water'], message: 'Crispy Jalebi ingredients:' },
  'imarti': { name: 'Imarti 🌀', ingredients: ['Urad Dal', 'Sugar', 'Saffron', 'Oil', 'Cardamom', 'Orange Food Color'], message: 'Imarti ingredients:' },
  'malpua': { name: 'Sweet Malpua 🥞', ingredients: ['Maida', 'Milk', 'Sugar', 'Fennel Seeds', 'Cardamom', 'Oil', 'Saffron', 'Almonds'], message: 'Festival Malpua ingredients:' },
  'basundi': { name: 'Basundi 🥣', ingredients: ['Milk', 'Sugar', 'Cardamom', 'Saffron', 'Almonds', 'Pistachios', 'Raisins'], message: 'Maharashtrian Basundi ingredients:' },
  'shrikhand': { name: 'Shrikhand 🥣', ingredients: ['Hung Curd', 'Powdered Sugar', 'Cardamom', 'Saffron', 'Almonds', 'Pistachios'], message: 'Gujarati Shrikhand ingredients:' },
  'payasam': { name: 'Semiya Payasam 🥣', ingredients: ['Vermicelli', 'Milk', 'Sugar', 'Ghee', 'Cardamom', 'Cashew', 'Raisins'], message: 'South Indian Semiya Payasam ingredients:' },
  'chikki': { name: 'Peanut Chikki 🍬', ingredients: ['Peanuts', 'Jaggery', 'Ghee'], message: 'Crunchy Peanut Chikki ingredients:' },
  'til chikki': { name: 'Til Chikki 🍬', ingredients: ['Sesame Seeds', 'Jaggery', 'Ghee'], message: 'Makar Sankranti Til Chikki ingredients:' },
  'gajak': { name: 'Winter Gajak 🍬', ingredients: ['Sesame Seeds', 'Jaggery', 'Ghee', 'Cardamom'], message: 'Winter Gajak ingredients:' },
  'ghevar': { name: 'Teej Ghevar 🍬', ingredients: ['Maida', 'Ghee', 'Sugar', 'Milk', 'Cardamom', 'Saffron', 'Almonds', 'Rabdi'], message: 'Festival Ghevar ingredients:' },
  'phirni': { name: 'Phirni 🥣', ingredients: ['Rice', 'Milk', 'Sugar', 'Cardamom', 'Saffron', 'Rose Water', 'Almonds', 'Pistachios'], message: 'Kashmiri Phirni ingredients:' },
  'kalakand': { name: 'Kalakand 🍬', ingredients: ['Milk', 'Sugar', 'Cardamom', 'Pistachios', 'Almonds', 'Saffron'], message: 'Milky Kalakand ingredients:' },
  'modak': { name: 'Ukadiche Modak 🍡', ingredients: ['Rice Flour', 'Coconut', 'Jaggery', 'Cardamom', 'Ghee'], message: 'Ganesh festival Modak ingredients:' },
  'puran poli': { name: 'Puran Poli 🫓', ingredients: ['Wheat Flour', 'Chana Dal', 'Jaggery', 'Cardamom', 'Ghee', 'Turmeric'], message: 'Maharashtrian Puran Poli ingredients:' },

  // ═══════════════════════════════════════════════
  // BAKING
  // ═══════════════════════════════════════════════
  'cake': { name: 'Vanilla Sponge Cake 🎂', ingredients: ['Maida', 'Sugar', 'Butter', 'Eggs', 'Milk', 'Baking Powder', 'Vanilla Essence', 'Oil'], message: 'Birthday Cake baking ingredients:' },
  'baking': { name: 'Baking Essentials 🎂', ingredients: ['Maida', 'Sugar', 'Butter', 'Baking Powder', 'Milk', 'Raisins', 'Almonds', 'Walnuts'], message: 'Baking pantry essentials:' },
  'chocolate cake': { name: 'Chocolate Cake 🍫', ingredients: ['Maida', 'Cocoa Powder', 'Sugar', 'Butter', 'Eggs', 'Milk', 'Baking Powder', 'Vanilla', 'Chocolate'], message: 'Rich Chocolate Cake ingredients:' },
  'banana bread': { name: 'Banana Bread 🍞', ingredients: ['Maida', 'Banana', 'Sugar', 'Butter', 'Baking Soda', 'Cinnamon', 'Milk', 'Walnuts'], message: 'Moist Banana Bread ingredients:' },
  'muffins': { name: 'Blueberry Muffins 🫐', ingredients: ['Maida', 'Sugar', 'Butter', 'Milk', 'Eggs', 'Baking Powder', 'Vanilla', 'Blueberry'], message: 'Fluffy Muffins ingredients:' },
  'cookies': { name: 'Butter Cookies 🍪', ingredients: ['Maida', 'Sugar', 'Butter', 'Milk', 'Vanilla Essence', 'Baking Powder'], message: 'Crispy Butter Cookies ingredients:' },
  'brownie': { name: 'Fudgy Brownies 🍫', ingredients: ['Maida', 'Chocolate', 'Butter', 'Sugar', 'Eggs', 'Cocoa Powder', 'Vanilla', 'Walnuts'], message: 'Fudgy Brownies ingredients:' },
  'cheesecake': { name: 'Baked Cheesecake 🍰', ingredients: ['Cream Cheese', 'Sugar', 'Butter', 'Maida', 'Eggs', 'Vanilla', 'Biscuits', 'Lemon'], message: 'Baked Cheesecake ingredients:' },
  'pizza': { name: 'Homemade Pizza 🍕', ingredients: ['Maida', 'Yeast', 'Olive Oil', 'Salt', 'Sugar', 'Tomato Sauce', 'Cheese', 'Capsicum', 'Onion', 'Oregano', 'Chili Flakes'], message: 'Homemade Pizza ingredients:' },
  'bread': { name: 'Homemade Wheat Bread 🍞', ingredients: ['Maida', 'Wheat Flour', 'Yeast', 'Salt', 'Sugar', 'Butter', 'Milk'], message: 'Homemade Bread ingredients:' },
  'naan': { name: 'Soft Naan 🫓', ingredients: ['Maida', 'Curd', 'Milk', 'Baking Powder', 'Sugar', 'Salt', 'Butter', 'Oil'], message: 'Soft Restaurant-style Naan ingredients:' },
  'kulcha': { name: 'Amritsari Kulcha 🫓', ingredients: ['Maida', 'Curd', 'Butter', 'Salt', 'Baking Powder', 'Potato', 'Onion', 'Green Chili', 'Coriander'], message: 'Amritsari Kulcha ingredients:' },
  'pita bread': { name: 'Pita Bread 🫓', ingredients: ['Maida', 'Yeast', 'Salt', 'Sugar', 'Olive Oil', 'Water'], message: 'Soft Pita Bread ingredients:' },

  // ═══════════════════════════════════════════════
  // CHUTNEY & PICKLES
  // ═══════════════════════════════════════════════
  'green chutney': { name: 'Green Mint Chutney 🌿', ingredients: ['Mint', 'Coriander', 'Green Chili', 'Lemon', 'Garlic', 'Ginger', 'Salt', 'Cumin'], message: 'Fresh Green Chutney ingredients:' },
  'tamarind chutney': { name: 'Tamarind Chutney 🍯', ingredients: ['Tamarind', 'Sugar', 'Jaggery', 'Cumin', 'Black Salt', 'Red Chili', 'Ginger Powder'], message: 'Sweet Tamarind Chutney ingredients:' },
  'coconut chutney': { name: 'Coconut Chutney 🥥', ingredients: ['Coconut', 'Ginger', 'Green Chili', 'Roasted Chana Dal', 'Salt', 'Mustard Seeds', 'Curry Leaves', 'Oil'], message: 'South Indian Coconut Chutney ingredients:' },
  'tomato chutney': { name: 'Tomato Chutney 🍅', ingredients: ['Tomato', 'Onion', 'Garlic', 'Ginger', 'Oil', 'Red Chili', 'Salt', 'Cumin'], message: 'Spicy Tomato Chutney ingredients:' },
  'garlic chutney': { name: 'Lasun Chutney 🧄', ingredients: ['Garlic', 'Red Chili', 'Oil', 'Salt', 'Lemon', 'Sesame Seeds', 'Peanuts'], message: 'Spicy Garlic Chutney ingredients:' },
  'mango pickle': { name: 'Aam Ka Achar 🥭', ingredients: ['Raw Mango', 'Oil', 'Mustard Seeds', 'Fenugreek Seeds', 'Red Chili', 'Turmeric', 'Salt', 'Hing'], message: 'Homemade Mango Pickle ingredients:' },
  'mixed pickle': { name: 'Mixed Vegetable Pickle 🥒', ingredients: ['Carrot', 'Cauliflower', 'Raw Mango', 'Oil', 'Mustard Seeds', 'Fenugreek Seeds', 'Red Chili', 'Turmeric', 'Salt'], message: 'Mixed Vegetable Pickle ingredients:' },

  // ═══════════════════════════════════════════════
  // SALADS & RAITA
  // ═══════════════════════════════════════════════
  'salad': { name: 'Fresh Green Salad 🥗', ingredients: ['Cucumber', 'Tomato', 'Onion', 'Lemon', 'Salt', 'Black Pepper', 'Carrot', 'Capsicum'], message: 'Fresh Garden Salad ingredients:' },
  'raita': { name: 'Boondi Raita 🥣', ingredients: ['Curd', 'Boondi', 'Cumin Powder', 'Red Chili', 'Black Salt', 'Coriander', 'Mint'], message: 'Boondi Raita ingredients:' },
  'cucumber raita': { name: 'Cucumber Raita 🥒', ingredients: ['Curd', 'Cucumber', 'Cumin Powder', 'Salt', 'Coriander', 'Mint', 'Green Chili'], message: 'Cool Cucumber Raita ingredients:' },
  'mixed raita': { name: 'Mixed Vegetable Raita 🥗', ingredients: ['Curd', 'Cucumber', 'Tomato', 'Onion', 'Cumin Powder', 'Salt', 'Coriander', 'Mint'], message: 'Mixed Vegetable Raita ingredients:' },
  'kachumber': { name: 'Kachumber Salad 🥗', ingredients: ['Cucumber', 'Tomato', 'Onion', 'Lemon', 'Salt', 'Green Chili', 'Coriander', 'Chaat Masala'], message: 'Fresh Kachumber Salad ingredients:' },

  // ═══════════════════════════════════════════════
  // FESTIVE & SPECIAL
  // ═══════════════════════════════════════════════
  'pongal': { name: 'Ven Pongal 🍲', ingredients: ['Rice', 'Moong Dal', 'Ghee', 'Cumin', 'Peppercorn', 'Ginger', 'Cashew', 'Curry Leaves', 'Asafoetida'], message: 'South Indian Ven Pongal ingredients:' },
  'gujiya': { name: 'Holi Gujiya 🥟', ingredients: ['Maida', 'Ghee', 'Khoya', 'Sugar', 'Cardamom', 'Almonds', 'Raisins', 'Desiccated Coconut', 'Oil'], message: 'Holi festival Gujiya ingredients:' },
  'kadhi': { name: 'Punjabi Kadhi 🍲', ingredients: ['Besan', 'Curd', 'Onion', 'Oil', 'Mustard Seeds', 'Fenugreek Seeds', 'Red Chili', 'Curry Leaves', 'Turmeric'], message: 'Punjabi Kadhi ingredients:' },
  'litti chokha': { name: 'Bihari Litti Chokha 🍡', ingredients: ['Wheat Flour', 'Sattu', 'Ghee', 'Eggplant', 'Potato', 'Onion', 'Garlic', 'Mustard Oil', 'Spices'], message: 'Bihari Litti Chokha ingredients:' },
  'sarson ka saag': { name: 'Sarson Ka Saag 🥬', ingredients: ['Mustard Leaves', 'Spinach', 'Ghee', 'Onion', 'Garlic', 'Ginger', 'Butter', 'Cornmeal', 'Green Chili'], message: 'Punjabi Sarson Ka Saag ingredients:' },
  'makki ki roti': { name: 'Makki Ki Roti 🫓', ingredients: ['Maize Flour', 'Salt', 'Water', 'Ghee'], message: 'Punjabi Makki Ki Roti ingredients:' },
  'kozhukattai': { name: 'Kozhukattai 🍡', ingredients: ['Rice Flour', 'Coconut', 'Jaggery', 'Cardamom', 'Sesame Seeds', 'Oil'], message: 'South Indian Kozhukattai ingredients:' },
  'thepla': { name: 'Gujarati Thepla 🫓', ingredients: ['Wheat Flour', 'Besan', 'Curd', 'Fenugreek Leaves', 'Turmeric', 'Red Chili', 'Ghee', 'Oil'], message: 'Gujarati Thepla ingredients:' },
  'pithla': { name: 'Maharashtrian Pithla 🍲', ingredients: ['Besan', 'Onion', 'Garlic', 'Green Chili', 'Oil', 'Mustard Seeds', 'Curry Leaves', 'Turmeric', 'Salt'], message: 'Simple Pithla ingredients:' },
  'sol kadhi': { name: 'Sol Kadhi 🥤', ingredients: ['Kokum', 'Coconut Milk', 'Garlic', 'Ginger', 'Green Chili', 'Coriander', 'Salt', 'Cumin'], message: 'Refreshing Sol Kadhi ingredients:' },

  // ═══════════════════════════════════════════════
  // QUICK SNACKS
  // ═══════════════════════════════════════════════
  'sandwich': { name: 'Veg Grilled Sandwich 🥪', ingredients: ['Bread', 'Butter', 'Cheese', 'Tomato', 'Cucumber', 'Onion', 'Potato', 'Chutney', 'Salt', 'Pepper'], message: 'Veg Grilled Sandwich ingredients:' },
  'toast': { name: 'Masala Toast 🍞', ingredients: ['Bread', 'Butter', 'Chili Flakes', 'Oregano', 'Cheese', 'Tomato', 'Salt'], message: 'Masala Toast ingredients:' },
  'cheese toast': { name: 'Cheese Toast 🧀', ingredients: ['Bread', 'Butter', 'Cheese', 'Tomato', 'Oregano', 'Chili Flakes', 'Salt'], message: 'Cheesy Toast ingredients:' },
  'french toast': { name: 'Sweet French Toast 🍞', ingredients: ['Bread', 'Eggs', 'Milk', 'Sugar', 'Butter', 'Cinnamon', 'Vanilla'], message: 'Sweet French Toast ingredients:' },
  'boiled eggs': { name: 'Masala Boiled Eggs 🥚', ingredients: ['Eggs', 'Salt', 'Black Pepper', 'Chaat Masala', 'Lemon'], message: 'Simple Boiled Eggs ingredients:' },
  'egg sandwich': { name: 'Egg Sandwich 🥚', ingredients: ['Eggs', 'Bread', 'Butter', 'Onion', 'Tomato', 'Salt', 'Pepper', 'Chutney'], message: 'Quick Egg Sandwich ingredients:' },
  'nachos': { name: 'Cheesy Nachos 🧀', ingredients: ['Nachos', 'Cheese', 'Tomato Salsa', 'Sour Cream', 'Jalapeño', 'Onion', 'Coriander'], message: 'Loaded Nachos ingredients:' },
  'popcorn': { name: 'Masala Popcorn 🍿', ingredients: ['Corn Kernels', 'Oil', 'Salt', 'Chili Powder', 'Turmeric', 'Chaat Masala', 'Butter'], message: 'Masala Popcorn ingredients:' },
  'roasted peanuts': { name: 'Masala Peanuts 🥜', ingredients: ['Peanuts', 'Oil', 'Salt', 'Chili Powder', 'Turmeric', 'Chaat Masala', 'Lemon'], message: 'Crunchy Masala Peanuts ingredients:' },
  'murmura': { name: 'Masala Murmura 🍿', ingredients: ['Puffed Rice', 'Oil', 'Peanuts', 'Curry Leaves', 'Mustard Seeds', 'Turmeric', 'Salt', 'Red Chili'], message: 'Masala Murmura ingredients:' },
  'corn chaat': { name: 'Corn Chaat 🌽', ingredients: ['Corn', 'Butter', 'Onion', 'Tomato', 'Lemon', 'Chaat Masala', 'Red Chili', 'Coriander', 'Salt'], message: 'Spicy Corn Chaat ingredients:' },
  'fruit chaat': { name: 'Fruit Chaat 🍎', ingredients: ['Apple', 'Banana', 'Pomegranate', 'Orange', 'Chaat Masala', 'Black Salt', 'Lemon', 'Coriander'], message: 'Sweet Fruit Chaat ingredients:' },

  // ═══════════════════════════════════════════════
  // DIPS & SAUCES
  // ═══════════════════════════════════════════════
  'hummus': { name: 'Homemade Hummus 🧆', ingredients: ['Chickpeas', 'Tahini', 'Garlic', 'Lemon', 'Olive Oil', 'Salt', 'Cumin'], message: 'Creamy Hummus ingredients:' },
  'guacamole': { name: 'Guacamole 🥑', ingredients: ['Avocado', 'Lemon', 'Onion', 'Tomato', 'Garlic', 'Salt', 'Coriander', 'Green Chili'], message: 'Fresh Guacamole ingredients:' },
  'salsa': { name: 'Tomato Salsa 🍅', ingredients: ['Tomato', 'Onion', 'Garlic', 'Green Chili', 'Lemon', 'Coriander', 'Salt', 'Pepper'], message: 'Fresh Tomato Salsa ingredients:' },

  // ═══════════════════════════════════════════════
  // WEIGHT LOSS / HEALTHY
  // ═══════════════════════════════════════════════
  'healthy breakfast': { name: 'Healthy Breakfast Bowl 🥣', ingredients: ['Oats', 'Honey', 'Milk', 'Almonds', 'Banana', 'Chia Seeds', 'Flax Seeds', 'Walnuts'], message: 'Healthy Breakfast Bowl ingredients:' },
  'oats porridge': { name: 'Oats Porridge 🥣', ingredients: ['Oats', 'Milk', 'Banana', 'Honey', 'Almonds', 'Cinnamon'], message: 'Healthy Oats Porridge ingredients:' },
  'muesli': { name: 'Muesli Bowl 🥣', ingredients: ['Oats', 'Corn Flakes', 'Almonds', 'Raisins', 'Milk', 'Honey', 'Banana', 'Blueberry'], message: 'Nutritious Muesli Bowl ingredients:' },
  'green smoothie': { name: 'Green Detox Smoothie 🥬', ingredients: ['Spinach', 'Banana', 'Milk', 'Honey', 'Ginger', 'Lemon', 'Flax Seeds'], message: 'Detox Green Smoothie ingredients:' },
  'protein shake': { name: 'Protein Shake 💪', ingredients: ['Milk', 'Banana', 'Almonds', 'Honey', 'Peanut Butter', 'Oats'], message: 'Homemade Protein Shake ingredients:' },
  'diet salad': { name: 'Diet Green Salad 🥗', ingredients: ['Cucumber', 'Tomato', 'Spinach', 'Lemon', 'Olive Oil', 'Salt', 'Black Pepper', 'Flax Seeds'], message: 'Low-calorie Diet Salad ingredients:' },
  'sprouts salad': { name: 'Sprouts Salad 🌱', ingredients: ['Mixed Sprouts', 'Tomato', 'Cucumber', 'Onion', 'Lemon', 'Chaat Masala', 'Coriander', 'Salt'], message: 'Protein-rich Sprouts Salad ingredients:' },
  'moong salad': { name: 'Moong Sprouts Salad 🌱', ingredients: ['Moong Dal Sprouts', 'Tomato', 'Onion', 'Lemon', 'Chaat Masala', 'Salt', 'Coriander'], message: 'Healthy Moong Salad ingredients:' },
  'quinoa salad': { name: 'Quinoa Salad 🥗', ingredients: ['Quinoa', 'Cucumber', 'Tomato', 'Onion', 'Lemon', 'Olive Oil', 'Salt', 'Pepper', 'Coriander'], message: 'Healthy Quinoa Salad ingredients:' },

  // ═══════════════════════════════════════════════
  // FESTIVAL FOODS
  // ═══════════════════════════════════════════════
  'mathri': { name: 'Diwali Mathri 🍘', ingredients: ['Maida', 'Ghee', 'Salt', 'Carom Seeds', 'Black Pepper', 'Oil'], message: 'Crispy Mathri ingredients:' },
  'namak pare': { name: 'Namak Pare 🍘', ingredients: ['Maida', 'Ghee', 'Salt', 'Carom Seeds', 'Oil', 'Sesame Seeds'], message: 'Crispy Namak Pare ingredients:' },
  'chakli': { name: 'Diwali Chakli 🌀', ingredients: ['Rice Flour', 'Besan', 'Butter', 'Sesame Seeds', 'Red Chili', 'Cumin', 'Salt', 'Oil'], message: 'Crispy Chakli ingredients:' },
  'sev': { name: 'Besan Sev 🍘', ingredients: ['Besan', 'Oil', 'Salt', 'Red Chili', 'Carom Seeds', 'Turmeric'], message: 'Homemade Besan Sev ingredients:' },
  'murukku': { name: 'South Indian Murukku 🌀', ingredients: ['Rice Flour', 'Urad Dal Flour', 'Butter', 'Sesame Seeds', 'Cumin', 'Oil', 'Salt'], message: 'Crispy Murukku ingredients:' },
  'laddoo': { name: 'Diwali Besan Laddoo 🍡', ingredients: ['Besan', 'Ghee', 'Sugar', 'Cardamom', 'Almonds', 'Cashew', 'Raisins'], message: 'Festival Besan Laddoo ingredients:' },
  'pinni': { name: 'Punjabi Pinni 🍡', ingredients: ['Wheat Flour', 'Ghee', 'Sugar', 'Almonds', 'Cashew', 'Cardamom', 'Fennel Seeds'], message: 'Punjabi winter Pinni ingredients:' },
  'rabri': { name: 'Rabri 🍮', ingredients: ['Milk', 'Sugar', 'Cardamom', 'Saffron', 'Almonds', 'Pistachios', 'Kewra Water'], message: 'Thick Rabri ingredients:' },

  // ═══════════════════════════════════════════════
  // ICE CREAM & FROZEN
  // ═══════════════════════════════════════════════
  'kulfi': { name: 'Malai Kulfi 🍦', ingredients: ['Milk', 'Cream', 'Sugar', 'Cardamom', 'Saffron', 'Almonds', 'Pistachios', 'Kewra'], message: 'Creamy Malai Kulfi ingredients:' },
  'mango kulfi': { name: 'Mango Kulfi 🥭', ingredients: ['Mango', 'Milk', 'Cream', 'Sugar', 'Cardamom', 'Saffron'], message: 'Mango Kulfi ingredients:' },
  'falooda': { name: 'Rose Falooda 🍨', ingredients: ['Milk', 'Rose Syrup', 'Vermicelli', 'Sabja Seeds', 'Ice Cream', 'Almonds', 'Pistachios'], message: 'Chilled Rose Falooda ingredients:' },
  'ice cream': { name: 'Vanilla Ice Cream 🍦', ingredients: ['Milk', 'Cream', 'Sugar', 'Vanilla Essence', 'Cornflour'], message: 'Homemade Vanilla Ice Cream ingredients:' },

  // ═══════════════════════════════════════════════
  // CONDIMENTS & EVERYDAY ITEMS
  // ═══════════════════════════════════════════════
  'ghee rice': { name: 'Kerala Ghee Rice 🍚', ingredients: ['Basmati Rice', 'Desi Ghee', 'Onion', 'Cashew', 'Raisins', 'Cardamom', 'Cloves', 'Bay Leaves', 'Cinnamon'], message: 'Kerala Ghee Rice ingredients:' },
  'butter milk dosa': { name: 'Buttermilk Dosa 🥞', ingredients: ['Rice', 'Buttermilk', 'Ginger', 'Green Chili', 'Onion', 'Coriander', 'Salt', 'Oil'], message: 'Instant Buttermilk Dosa ingredients:' },

  // Short forms / aliases
  'pb': { name: 'Pav Bhaji 🧆', ingredients: ['Pav', 'Butter', 'Potato', 'Onion', 'Tomato', 'Green Peas', 'Capsicum', 'Pav Bhaji Masala', 'Lemon'], message: 'Pav Bhaji ingredients:' },
  'pav': { name: 'Pav Bhaji 🧆', ingredients: ['Pav', 'Butter', 'Potato', 'Onion', 'Tomato', 'Green Peas', 'Capsicum', 'Pav Bhaji Masala', 'Lemon'], message: 'Pav Bhaji ingredients:' },
  'cb': { name: 'Chole Bhature 🫓', ingredients: ['Chickpeas', 'Maida', 'Curd', 'Oil', 'Onion', 'Tomato', 'Chole Masala', 'Ginger', 'Garlic'], message: 'Chole Bhature ingredients:' },
};

// ──────────────────────────────────────────────────────
// SMART DYNAMIC INGREDIENT GENERATOR (fallback for any recipe)
// ──────────────────────────────────────────────────────
export const getDynamicIngredients = (recipeName: string): string[] => {
  const name = recipeName.toLowerCase();
  const ingredients: string[] = ['Salt', 'Oil'];

  if (name.includes('paneer') || name.includes('cottage cheese')) ingredients.push('Paneer', 'Butter', 'Tomato', 'Onion', 'Garam Masala', 'Ginger', 'Garlic');
  if (name.includes('aloo') || name.includes('potato') || name.includes('batata')) ingredients.push('Potato', 'Onion', 'Turmeric', 'Green Chili', 'Cumin Seeds');
  if (name.includes('rice') || name.includes('pulao') || name.includes('biryani') || name.includes('chawal') || name.includes('fried rice')) ingredients.push('Basmati Rice', 'Ghee', 'Onion', 'Spices', 'Cumin');
  if (name.includes('dal') || name.includes('lentil') || name.includes('sambar') || name.includes('curry')) ingredients.push('Toor Dal', 'Mustard Seeds', 'Cumin Seeds', 'Turmeric', 'Ghee');
  if (name.includes('egg') || name.includes('omelette') || name.includes('bhurji') || name.includes('anda')) ingredients.push('Eggs', 'Butter', 'Onion', 'Green Chili', 'Black Pepper');
  if (name.includes('tea') || name.includes('chai')) ingredients.push('Tea Leaves', 'Milk', 'Sugar', 'Ginger', 'Cardamom');
  if (name.includes('coffee') || name.includes('cappuccino')) ingredients.push('Coffee Powder', 'Milk', 'Sugar');
  if (name.includes('cake') || name.includes('bak') || name.includes('cookie') || name.includes('muffin') || name.includes('brownie')) ingredients.push('Maida', 'Sugar', 'Butter', 'Milk', 'Baking Powder');
  if (name.includes('pasta') || name.includes('macaroni') || name.includes('noodle') || name.includes('maggi') || name.includes('chow')) ingredients.push('Noodles / Pasta', 'Tomato Sauce', 'Butter', 'Cheese', 'Onion');
  if (name.includes('poha')) ingredients.push('Poha', 'Oil', 'Mustard Seeds', 'Peanuts', 'Onion', 'Turmeric');
  if (name.includes('halwa') || name.includes('kheer') || name.includes('sweet') || name.includes('mithai') || name.includes('dessert')) ingredients.push('Milk', 'Sugar', 'Ghee', 'Almonds', 'Cardamom');
  if (name.includes('salad') || name.includes('healthy') || name.includes('diet')) ingredients.push('Cucumber', 'Tomato', 'Onion', 'Lemon', 'Black Pepper');
  if (name.includes('paratha') || name.includes('roti') || name.includes('puri') || name.includes('bhature') || name.includes('naan')) ingredients.push('Wheat Flour', 'Ghee', 'Salt');
  if (name.includes('chana') || name.includes('chole') || name.includes('rajma') || name.includes('chickpea')) ingredients.push('Chickpeas', 'Onion', 'Tomato', 'Oil', 'Garlic', 'Ginger', 'Spices');
  if (name.includes('bhaji') || name.includes('sabzi') || name.includes('fry') || name.includes('masala')) ingredients.push('Onion', 'Tomato', 'Oil', 'Turmeric', 'Garam Masala');
  if (name.includes('gobi') || name.includes('cauliflower')) ingredients.push('Cauliflower', 'Onion', 'Tomato', 'Oil', 'Garam Masala');
  if (name.includes('palak') || name.includes('spinach') || name.includes('saag')) ingredients.push('Spinach', 'Garlic', 'Butter', 'Cream', 'Salt');
  if (name.includes('mutter') || name.includes('peas')) ingredients.push('Green Peas', 'Onion', 'Tomato', 'Butter', 'Garam Masala');
  if (name.includes('dahi') || name.includes('curd') || name.includes('raita') || name.includes('lassi') || name.includes('chaas')) ingredients.push('Curd', 'Cumin Powder', 'Salt', 'Mint');
  if (name.includes('milk') || name.includes('doodh') || name.includes('shake') || name.includes('smoothie')) ingredients.push('Milk', 'Sugar', 'Cardamom');
  if (name.includes('soup')) ingredients.push('Onion', 'Garlic', 'Tomato', 'Salt', 'Black Pepper', 'Cornflour', 'Butter');
  if (name.includes('chutney') || name.includes('pickle') || name.includes('achar')) ingredients.push('Oil', 'Salt', 'Red Chili', 'Mustard Seeds', 'Lemon');
  if (name.includes('pakora') || name.includes('bajji') || name.includes('bonda') || name.includes('fritter')) ingredients.push('Besan', 'Oil', 'Salt', 'Red Chili', 'Carom Seeds');
  if (name.includes('biryani') || name.includes('pulao')) ingredients.push('Basmati Rice', 'Ghee', 'Biryani Masala', 'Onion', 'Mint', 'Saffron');
  if (name.includes('upma')) ingredients.push('Semolina', 'Ghee', 'Mustard Seeds', 'Onion', 'Cashew', 'Curry Leaves');
  if (name.includes('idli') || name.includes('dosa') || name.includes('uttapam')) ingredients.push('Rice', 'Urad Dal', 'Salt', 'Oil');
  if (name.includes('laddu') || name.includes('barfi') || name.includes('peda') || name.includes('mithai')) ingredients.push('Besan / Milk Powder', 'Ghee', 'Sugar', 'Cardamom', 'Almonds');
  if (name.includes('kulfi') || name.includes('ice cream')) ingredients.push('Milk', 'Cream', 'Sugar', 'Cardamom', 'Saffron');

  return Array.from(new Set(ingredients)).map(item =>
    item.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  );
};
