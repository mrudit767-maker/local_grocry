import { useState } from 'react';
import { User, Phone, MapPin, Navigation, ArrowRight, LogIn, ChevronLeft, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';
import { saveCustomerToSheet } from '../utils/googleSheets';
import toast from 'react-hot-toast';

export default function CustomerLoginPage() {
  const { darkMode, setCurrentPage, customerLogin, storeSettings, orders } = useStore();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('Bhopal');
  const [regPincode, setRegPincode] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone || loginPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Find customer details from local orders history
      const pastOrder = orders.find(o => o.customer.phone.replace(/[\s-]/g, '').includes(loginPhone.replace(/[\s-]/g, '')));
      
      if (pastOrder) {
        customerLogin({
          name: pastOrder.customer.name,
          phone: pastOrder.customer.phone,
          address: pastOrder.customer.address,
          city: pastOrder.customer.city,
          pincode: pastOrder.customer.pincode,
        });
        toast.success(`Welcome back, ${pastOrder.customer.name}! 🎉`);
        setCurrentPage('home');
      } else {
        // Mock profile login if no past order found
        customerLogin({
          name: 'Valued Customer',
          phone: loginPhone,
          address: '',
          city: 'Bhopal',
          pincode: '',
        });
        toast.success('Logged in successfully!');
        toast('Go to checkout or edit profile to complete your address.', { icon: '📝' });
        setCurrentPage('home');
      }
      setLoading(false);
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return toast.error('Name is required');
    if (!regPhone || regPhone.length < 10) return toast.error('Please enter a valid 10-digit phone number');
    if (!regAddress.trim()) return toast.error('Address is required');
    if (!regPincode || regPincode.length < 6) return toast.error('Please enter a valid 6-digit pincode');

    setLoading(true);

    const formattedPhone = regPhone.startsWith('+91') ? regPhone : `+91 ${regPhone.trim()}`;
    const newCustomer = {
      name: regName.trim(),
      phone: formattedPhone,
      address: regAddress.trim(),
      city: regCity.trim(),
      pincode: regPincode.trim(),
    };

    // Save to Google Sheet
    if (storeSettings.googleSheetWebhookUrl) {
      const success = await saveCustomerToSheet(storeSettings.googleSheetWebhookUrl, {
        dateRegistered: new Date().toLocaleDateString('en-IN'),
        customerName: newCustomer.name,
        phone: newCustomer.phone,
        address: newCustomer.address,
        city: newCustomer.city,
        pincode: newCustomer.pincode,
      });

      if (success.success) {
        console.log('✅ Customer registered in Google Sheet');
      } else {
        console.error('❌ Failed to register customer in Sheet:', success.message);
      }
    }

    customerLogin(newCustomer);
    toast.success(`Welcome to ${storeSettings.shopName}, ${newCustomer.name}! 🛍️`);
    setCurrentPage('home');
    setLoading(false);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full rounded-3xl border shadow-xl overflow-hidden transition-all duration-300 ${
        darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
      }`}>
        {/* Banner */}
        <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 p-6 text-white text-center relative">
          <button
            onClick={() => setCurrentPage('home')}
            className="absolute top-4 left-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-all text-white"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <User size={32} />
          </div>
          <h2 className="text-2xl font-black">{storeSettings.shopName}</h2>
          <p className="text-green-100 text-xs mt-1">Your premium online local grocery store</p>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-4 text-center font-bold text-sm transition-all relative ${
              activeTab === 'login'
                ? 'text-green-600'
                : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign In
            {activeTab === 'login' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />}
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-4 text-center font-bold text-sm transition-all relative ${
              activeTab === 'register'
                ? 'text-green-600'
                : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Register Account
            {activeTab === 'register' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />}
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Mobile Number
                </label>
                <div className="relative">
                  <span className={`absolute left-3 top-3.5 text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={loginPhone}
                    onChange={e => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit number"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                        : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-green-500'
                    }`}
                  />
                  <Phone size={16} className="absolute right-3 top-3.5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all shadow-md mt-6"
              >
                {loading ? 'Logging in...' : (
                  <>
                    Sign In <LogIn size={18} />
                  </>
                )}
              </button>

              <div className="text-center mt-4">
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setActiveTab('register')} className="text-green-600 hover:underline font-bold">
                    Register here
                  </button>
                </span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="Enter full name"
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                        : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-green-500'
                    }`}
                  />
                  <User size={16} className="absolute right-3 top-3.5 text-gray-400" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Phone Number
                </label>
                <div className="relative">
                  <span className={`absolute left-3 top-3.5 text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit number"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                        : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-green-500'
                    }`}
                  />
                  <Phone size={16} className="absolute right-3 top-3.5 text-gray-400" />
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Delivery Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regAddress}
                    onChange={e => setRegAddress(e.target.value)}
                    placeholder="House no, Street name, Area"
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                        : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-green-500'
                    }`}
                  />
                  <MapPin size={16} className="absolute right-3 top-3.5 text-gray-400" />
                </div>
              </div>

              {/* City and Pincode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    City
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={regCity}
                      onChange={e => setRegCity(e.target.value)}
                      placeholder="City name"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                        darkMode
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                          : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-green-500'
                      }`}
                    />
                    <Navigation size={16} className="absolute right-3 top-3.5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Pincode
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      maxLength={6}
                      value={regPincode}
                      onChange={e => setRegPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="6 digits"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                        darkMode
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                          : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-green-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all shadow-md mt-6"
              >
                {loading ? 'Creating Account...' : (
                  <>
                    Create Account <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="text-center mt-4">
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Already have an account?{' '}
                  <button type="button" onClick={() => setActiveTab('login')} className="text-green-600 hover:underline font-bold">
                    Sign In
                  </button>
                </span>
              </div>
            </form>
          )}

          {/* Secure indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-6 text-[10px] text-gray-400">
            <ShieldCheck size={12} className="text-green-500" />
            <span>Secured details stored via Google Sheets backend</span>
          </div>
        </div>
      </div>
    </div>
  );
}
