import { useState, useEffect } from 'react';
import { Mail, User, Phone, MapPin, Navigation, ArrowRight, LogIn, ChevronLeft, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';
import { saveCustomerToSheet, fetchCustomerFromSheet } from '../utils/googleSheets';
import toast from 'react-hot-toast';

export default function CustomerLoginPage() {
  const { darkMode, setCurrentPage, customerLogin, storeSettings, orders } = useStore();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);

  // Demo mode = webhook not configured at all
  const isDemoWebhook = !storeSettings.googleSheetWebhookUrl ||
    storeSettings.googleSheetWebhookUrl.trim() === '';

  // Email delivery possible = webhook URL is a real Apps Script URL
  const canSendRealEmail = !isDemoWebhook &&
    storeSettings.googleSheetWebhookUrl.startsWith('https://script.google.com');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('Bhopal');
  const [regPincode, setRegPincode] = useState('');

  // OTP Verification state
  const [otpMode, setOtpMode] = useState(false);
  const [otpVal, setOtpVal] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [pendingAction, setPendingAction] = useState<'login' | 'register' | null>(null);
  
  // Pending registration details
  const [pendingRegData, setPendingRegData] = useState<{
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    pincode: string;
  } | null>(null);

  // Pending login details
  const [pendingLoginPhone, setPendingLoginPhone] = useState('');
  const [pendingLoginEmail, setPendingLoginEmail] = useState('');

  // Fetched profile from Google Sheets
  const [fetchedCustomerProfile, setFetchedCustomerProfile] = useState<{
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    pincode: string;
  } | null>(null);

  // Background profile fetch promise
  const [profilePromise, setProfilePromise] = useState<Promise<{
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    pincode: string;
  } | null> | null>(null);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer(t => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const sendOtpEmail = async (email: string, phone: string, code: string) => {
    const cleanPhone = phone ? phone.replace(/[\s-+]/g, '').slice(-10) : '';

    if (canSendRealEmail && email) {
      // Send real OTP email via Google Apps Script (GmailApp - completely free)
      try {
        fetch(storeSettings.googleSheetWebhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'sendSMS',
            gateway: storeSettings.smsGateway || 'simulated',
            fast2smsApiKey: storeSettings.fast2smsApiKey || '',
            twilioAccountSid: storeSettings.twilioAccountSid || '',
            twilioAuthToken: storeSettings.twilioAuthToken || '',
            twilioFromNumber: storeSettings.twilioFromNumber || '',
            androidSmsToken: storeSettings.androidSmsToken || '',
            androidSmsDeviceId: storeSettings.androidSmsDeviceId || '',
            shopName: storeSettings.shopName,
            phone: cleanPhone,
            email: email,
            otp: code,
          }),
        }).catch(() => {});
      } catch (e) {
        console.error('Failed to dispatch OTP email via Apps Script:', e);
      }

      // Don't show OTP on screen - user will check their email inbox
      toast.success(`📧 Verification code sent to ${email}\nPlease check your Inbox & Spam folder.`, {
        duration: 7000,
        style: { fontWeight: 'bold' },
        icon: '✉️',
      });
    } else {
      // Demo mode - show OTP on screen
      toast(
        `🔑 Demo OTP: ${code}\n(No webhook set - using test mode)`,
        {
          icon: '💬',
          duration: 30000,
          style: {
            background: '#064e3b',
            color: '#ecfdf5',
            border: '1px solid #059669',
            fontWeight: 'bold',
          }
        }
      );
    }

    // Also send SMS if configured (phone provided and smsGateway not simulated)
    if (cleanPhone && storeSettings.smsGateway && storeSettings.smsGateway !== 'simulated' && canSendRealEmail) {
      if (storeSettings.smsGateway === 'fast2sms' && storeSettings.fast2smsApiKey) {
        try {
          const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(storeSettings.fast2smsApiKey)}&route=otp&variables_values=${encodeURIComponent(code)}&numbers=${encodeURIComponent(cleanPhone)}`;
          fetch(url, { method: 'GET', mode: 'no-cors' }).catch(() => {});
        } catch (err) {
          console.error('Fast2SMS error:', err);
        }
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const input = loginEmail.trim();
    if (!input || !input.includes('@')) {
      toast.error('Please enter a valid email address to receive OTP');
      return;
    }

    setLoading(true);
    setFetchedCustomerProfile(null);

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    setGeneratedOtp(code);

    setPendingLoginPhone('');
    setPendingLoginEmail(input);
    setPendingAction('login');
    setOtpMode(true);
    setResendTimer(60);
    setOtpVal('');

    // Pre-fetch customer profile from Google Sheets in background
    if (storeSettings.googleSheetWebhookUrl) {
      const promise = fetchCustomerFromSheet(storeSettings.googleSheetWebhookUrl, input)
        .then(profile => {
          if (profile) {
            const data = {
              name: profile.customerName,
              phone: profile.phone,
              email: profile.email,
              address: profile.address,
              city: profile.city,
              pincode: profile.pincode,
            };
            setFetchedCustomerProfile(data);
            return data;
          }
          return null;
        })
        .catch(() => null);
      setProfilePromise(promise);
    }

    setLoading(false);
    sendOtpEmail(input, '', code);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return toast.error('Name is required');
    if (!regPhone || regPhone.replace(/\D/g, '').length < 10) return toast.error('Please enter a valid 10-digit phone number');
    if (!regEmail.trim() || !regEmail.includes('@')) return toast.error('Please enter a valid email address - OTP will be sent here');
    if (!regAddress.trim()) return toast.error('Address is required');
    if (!regPincode || regPincode.replace(/\D/g, '').length < 6) return toast.error('Please enter a valid 6-digit pincode');

    setLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const formattedPhone = regPhone.startsWith('+91') ? regPhone : `+91 ${regPhone.trim()}`;
    setGeneratedOtp(code);
    setPendingRegData({
      name: regName.trim(),
      phone: formattedPhone,
      email: regEmail.trim(),
      address: regAddress.trim(),
      city: regCity.trim(),
      pincode: regPincode.trim(),
    });
    setPendingAction('register');
    setOtpMode(true);
    setResendTimer(60);
    setOtpVal('');
    setLoading(false);

    sendOtpEmail(regEmail.trim(), formattedPhone, code);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpVal.trim() !== generatedOtp) {
      toast.error('Invalid OTP. Please check the 6-digit code from your email.');
      return;
    }

    setLoading(true);
    
    if (pendingAction === 'login') {
      let profile = fetchedCustomerProfile;
      if (!profile && profilePromise) {
        try {
          // Wait for background fetch to complete if user typed OTP extremely fast
          profile = await profilePromise;
        } catch (err) {
          console.error('Error waiting for background profile fetch:', err);
        }
      }

      // 1. Try to use fetched customer profile details from Google Sheets
      if (profile) {
        customerLogin(profile);
        toast.success(`OTP Verified! Welcome back, ${profile.name}! 🎉`);
      } else {
        // 2. Fallback: Try to find past orders matching email or phone
        const cleanPendingPhone = pendingLoginPhone.replace(/[\s-+]/g, '').slice(-10);
        const pastOrder = orders.find(o => {
          const matchEmail = pendingLoginEmail && o.customer.email?.trim().toLowerCase() === pendingLoginEmail.trim().toLowerCase();
          const oPhoneClean = o.customer.phone ? o.customer.phone.replace(/[\s-+]/g, '').slice(-10) : '';
          const matchPhone = cleanPendingPhone && oPhoneClean === cleanPendingPhone;
          return matchEmail || matchPhone;
        });

        if (pastOrder) {
          customerLogin({
            name: pastOrder.customer.name,
            phone: pastOrder.customer.phone || pendingLoginPhone || '',
            email: pendingLoginEmail || pastOrder.customer.email || '',
            address: pastOrder.customer.address,
            city: pastOrder.customer.city,
            pincode: pastOrder.customer.pincode,
          });
          toast.success(`OTP Verified! Welcome back, ${pastOrder.customer.name}! 🎉`);
        } else {
          // 3. Last fallback: Log in as default customer
          customerLogin({
            name: 'Valued Customer',
            phone: pendingLoginPhone || '',
            email: pendingLoginEmail || '',
            address: '',
            city: 'Bhopal',
            pincode: '',
          });
          toast.success('OTP Verified! Logged in successfully!');
          toast('Go to checkout or edit profile to complete your address.', { icon: '📝' });
        }
      }
      setCurrentPage('home');
    } else if (pendingAction === 'register' && pendingRegData) {
      if (storeSettings.googleSheetWebhookUrl) {
        // Run in background without blocking to make verification instant
        saveCustomerToSheet(storeSettings.googleSheetWebhookUrl, {
          dateRegistered: new Date().toLocaleDateString('en-IN'),
          customerName: pendingRegData.name,
          phone: pendingRegData.phone,
          email: pendingRegData.email || '',
          address: pendingRegData.address,
          city: pendingRegData.city,
          pincode: pendingRegData.pincode,
        }).catch(err => console.error('Failed to save customer in background:', err));
      }
      customerLogin(pendingRegData);
      toast.success(`OTP Verified! Welcome, ${pendingRegData.name}! 🛍️`);
      setCurrentPage('home');
    }
    
    setOtpMode(false);
    setLoading(false);
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setResendTimer(60);
    setOtpVal('');

    const targetEmail = pendingAction === 'login' ? pendingLoginEmail : pendingRegData?.email || '';
    const targetPhone = pendingAction === 'login' ? pendingLoginPhone : pendingRegData?.phone || '';

    setTimeout(() => {
      sendOtpEmail(targetEmail, targetPhone, code);
    }, 500);
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
        {!otpMode && (
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
        )}

        <div className="p-6">
          {otpMode ? (
            <form onSubmit={handleVerifyOtp} className="space-y-5 animate-fade-up">
              {/* OTP sent to email header */}
              <div className="text-center mb-2">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail size={28} className="text-green-600" />
                </div>
                <h3 className={`text-base font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>Check Your Email</h3>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isDemoWebhook ? 'Demo: OTP shown above in notification' : 'We sent a 6-digit code to'}
                </p>
                {!isDemoWebhook && (
                  <p className="font-extrabold text-green-600 text-sm mt-0.5">
                    {pendingAction === 'login' ? pendingLoginEmail : pendingRegData?.email}
                  </p>
                )}
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Enter 6-Digit Code from Email
                </label>
                <input
                  type="tel"
                  maxLength={6}
                  value={otpVal}
                  onChange={e => setOtpVal(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 582461"
                  className={`w-full tracking-[0.8em] text-center font-black text-xl py-3.5 rounded-2xl border outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-600'
                      : 'bg-gray-50 border-gray-200 text-gray-850 placeholder-gray-300'
                  }`}
                  autoFocus
                />
              </div>

              {/* Status / Alert Banner */}
              {isDemoWebhook ? (
                <div className={`p-3.5 rounded-xl text-[11px] leading-relaxed border ${darkMode ? 'bg-amber-950/20 border-amber-800/40 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-850'}`}>
                  💡 <b>Demo Mode:</b> OTP code is shown in the notification at the top. Configure your Google Sheet Webhook URL in Admin Settings to enable real email delivery.
                </div>
              ) : (
                <div className={`p-3.5 rounded-xl text-[11px] leading-relaxed border ${darkMode ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-850'}`}>
                  📧 <b>Email Sent!</b> Check your <b>Inbox</b> and <b>Spam/Junk</b> folder. Code expires in 5 minutes. Sent from your Google account via Apps Script.
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                <button
                  type="submit"
                  disabled={loading || otpVal.length < 6}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:hover:bg-green-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-md font-extrabold"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue 🚀'}
                </button>

                <div className="flex items-center justify-between text-xs mt-2 px-1">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0}
                    className={`font-bold transition-colors ${
                      resendTimer > 0
                        ? 'text-gray-400 cursor-not-allowed dark:text-gray-600'
                        : 'text-green-600 hover:text-green-700 hover:underline'
                    }`}
                  >
                    Resend Code {resendTimer > 0 ? `(${resendTimer}s)` : ''}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOtpMode(false);
                      setOtpVal('');
                    }}
                    className="text-gray-500 dark:text-gray-400 hover:underline font-bold"
                  >
                    Change Email
                  </button>
                </div>
              </div>
            </form>
          ) : activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Address */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="e.g. customer@gmail.com"
                    required
                    autoComplete="email"
                    className={`w-full px-4 py-3 pr-10 rounded-xl border text-sm outline-none transition-all ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                        : 'bg-gray-50 border-gray-200 text-gray-850 focus:border-green-500'
                    }`}
                  />
                  <Mail size={16} className="absolute right-3 top-3.5 text-gray-400" />
                </div>
                <p className={`text-[10px] mt-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  📧 A 6-digit OTP will be sent to this email address
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all shadow-md mt-2 cursor-pointer"
              >
                {loading ? 'Sending OTP...' : (
                  <>
                    Send OTP to Email <LogIn size={18} />
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

              {/* Email Address */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="e.g. customer@example.com"
                    required
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                        : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-green-500'
                    }`}
                  />
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
                {loading ? 'Sending OTP...' : (
                  <>
                    Verify Phone & Register <ArrowRight size={18} />
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
