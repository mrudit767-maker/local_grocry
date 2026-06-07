import { useState, useEffect } from 'react';
import { User, Phone, MapPin, Navigation, ArrowRight, LogIn, ChevronLeft, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';
import { saveCustomerToSheet, fetchCustomerFromSheet } from '../utils/googleSheets';
import toast from 'react-hot-toast';

export default function CustomerLoginPage() {
  const { darkMode, setCurrentPage, customerLogin, storeSettings, orders } = useStore();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);

  const isDemoWebhook = !storeSettings.googleSheetWebhookUrl || 
    storeSettings.googleSheetWebhookUrl === 'https://script.google.com/macros/s/AKfycbzqdrrYG56NKd6pNyGhTlanuTLP3_HO9sD8vL1Fmn98IJLz0KyXzrSIQxFWH4M8by8R/exec';

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

  const sendOtpSms = async (phone: string, email: string, code: string) => {
    const cleanPhone = phone.replace(/[\s-+]/g, '').slice(-10);

    // Call serverless script/webhook to dispatch SMS securely if configured
    if (storeSettings.googleSheetWebhookUrl && storeSettings.googleSheetWebhookUrl.startsWith('https://script.google.com')) {
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
        console.error('Failed to trigger Apps Script SMS/Email dispatch:', e);
      }
    }

    // Direct HTTP GET fallback for Fast2SMS if API Key is configured on client (bypassing Apps Script webhook requirement)
    if (storeSettings.smsGateway === 'fast2sms' && storeSettings.fast2smsApiKey) {
      try {
        const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(storeSettings.fast2smsApiKey)}&route=otp&variables_values=${encodeURIComponent(code)}&numbers=${encodeURIComponent(cleanPhone)}`;
        fetch(url, { method: 'GET', mode: 'no-cors' }).catch(() => {});
      } catch (err) {
        console.error('Direct Fast2SMS trigger error:', err);
      }
    }

    // Trigger toast notification (hide OTP code on screen for production, show for demo/simulated gateway)
    const showOnScreen = isDemoWebhook || !storeSettings.smsGateway || storeSettings.smsGateway === 'simulated';
    if (showOnScreen) {
      let toastMsg = `[SMS Gateway] OTP for ${storeSettings.shopName} is: ${code} 📱`;
      if (email) {
        toastMsg += ` & [Email Gateway] Sent to ${email} 📧`;
      }
      toast(toastMsg, {
        icon: '💬',
        duration: 8000,
        style: {
          background: '#064e3b',
          color: '#ecfdf5',
          border: '1px solid #059669',
          fontWeight: 'bold',
        }
      });
    } else {
      let toastMsg = '';
      if (storeSettings.smsGateway && storeSettings.smsGateway !== 'simulated' && phone) {
        toastMsg += `💬 OTP code sent to your mobile number. `;
      }
      if (email) {
        toastMsg += `📧 Verification code sent to your email address.`;
      }
      if (toastMsg) {
        toast.success(toastMsg, {
          duration: 6000,
          style: {
            fontWeight: 'semibold',
          }
        });
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const input = loginEmail.trim();
    if (!input) {
      toast.error('Please enter a valid email address or phone number');
      return;
    }

    const isEmail = input.includes('@');
    // If it's not email, it must be a phone number
    if (!isEmail) {
      const cleanPhone = input.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        toast.error('Please enter a valid email address or 10-digit phone number');
        return;
      }
    }

    setLoading(true);
    setFetchedCustomerProfile(null); // Clear previous

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    
    const targetEmail = isEmail ? input : '';
    // Format phone clean for SMS dispatch if it's 10 digits
    const targetPhone = !isEmail ? (input.startsWith('+91') ? input : `+91 ${input.replace(/\D/g, '').slice(-10)}`) : '';
    
    setPendingLoginPhone(targetPhone);
    setPendingLoginEmail(targetEmail);
    setPendingAction('login');
    setOtpMode(true);
    setResendTimer(30);
    setOtpVal('');
    
    // In background, fetch customer profile from Google Sheets immediately
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
            console.log('Customer profile pre-loaded from sheet:', profile);
            return data;
          }
          return null;
        })
        .catch(err => {
          console.error('Failed to pre-fetch customer details:', err);
          return null;
        });
      setProfilePromise(promise);
    }
    
    setLoading(false);
    toast.success(`OTP Sent to ${input}...`);
    sendOtpSms(targetPhone, targetEmail, code);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return toast.error('Name is required');
    if (!regPhone || regPhone.replace(/\D/g, '').length < 10) return toast.error('Please enter a valid 10-digit phone number');
    if (!regEmail.trim() || !regEmail.includes('@')) return toast.error('Please enter a valid email address');
    if (!regAddress.trim()) return toast.error('Address is required');
    if (!regPincode || regPincode.replace(/\D/g, '').length < 6) return toast.error('Please enter a valid 6-digit pincode');

    setLoading(true);
    const code = Math.floor(1000 + Math.random() * 9000).toString();
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
    setResendTimer(30);
    setOtpVal('');
    setLoading(false);
    
    toast.success(`OTP Sent to ${formattedPhone} and ${regEmail.trim()}...`);
    sendOtpSms(formattedPhone, regEmail.trim(), code);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpVal !== generatedOtp) {
      toast.error('Invalid OTP. Please check the code and try again.');
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
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setResendTimer(30);
    setOtpVal('');
    
    const targetPhone = pendingAction === 'login' ? pendingLoginPhone : pendingRegData?.phone || '';
    const targetEmail = pendingAction === 'login' ? pendingLoginEmail : pendingRegData?.email || '';
    
    let dest = targetPhone;
    if (targetEmail) dest += ` and ${targetEmail}`;
    toast.success(`Resending OTP to ${dest}...`);
    
    setTimeout(() => {
      sendOtpSms(targetPhone, targetEmail, code);
    }, 800);
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
              <div className="text-center mb-2">
                <h3 className={`text-base font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>Verify Your Account</h3>
                <p className="text-gray-500 text-xs mt-1">
                  {isDemoWebhook ? "We've simulated sending a 4-digit code to " : "We've sent a secure 4-digit code to "}
                  {pendingAction === 'login' && !pendingLoginPhone ? (
                    <span className="font-extrabold text-green-600">
                      {pendingLoginEmail}
                    </span>
                  ) : (
                    <>
                      <span className="font-extrabold text-green-600">
                        +91 {pendingAction === 'login' ? pendingLoginPhone : pendingRegData?.phone.replace('+91 ', '')}
                      </span>
                      {(pendingAction === 'login' ? pendingLoginEmail : pendingRegData?.email) ? (
                        <>
                          {' '}and email{' '}
                          <span className="font-extrabold text-green-600">
                            {pendingAction === 'login' ? pendingLoginEmail : pendingRegData?.email}
                          </span>
                        </>
                      ) : null}
                    </>
                  )}
                </p>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Enter Verification Code
                </label>
                <input
                  type="tel"
                  maxLength={4}
                  value={otpVal}
                  onChange={e => setOtpVal(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 5824"
                  className={`w-full tracking-[1.5em] text-center font-black text-xl py-3.5 rounded-2xl border outline-none focus:ring-2 focus:ring-green-500 transition-all ${
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
                  💡 <b>Demo Mode Active:</b> A notification toast with the 4-digit code is shown at the top of your screen. To configure real email delivery to your customers, update your Google Sheet Webhook in Admin Settings.
                </div>
              ) : (
                <div className={`p-3.5 rounded-xl text-[11px] leading-relaxed border ${darkMode ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-850'}`}>
                  📧 <b>Verification Email Sent:</b> A secure 4-digit verification code has been dispatched. Please check your **Inbox** and **Spam / Junk** folder.
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                <button
                  type="submit"
                  disabled={loading || otpVal.length < 4}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:hover:bg-green-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-md font-extrabold"
                >
                  {loading ? 'Verifying...' : 'Verify & Proceed 🚀'}
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
                    {pendingAction === 'login' ? 'Change Email' : 'Change Number'}
                  </button>
                </div>
              </div>
            </form>
          ) : activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email or Phone Number */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Email Address or Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="e.g. 9893495231 or customer@example.com"
                    required
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                        : 'bg-gray-50 border-gray-200 text-gray-850 focus:border-green-500'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all shadow-md mt-6 cursor-pointer"
              >
                {loading ? 'Sending OTP...' : (
                  <>
                    Send Verification Code <LogIn size={18} />
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
