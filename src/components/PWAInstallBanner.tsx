import { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | 'unknown'>('unknown');
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 1. Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');

    if (isStandalone) {
      console.log('PWA is already running in standalone mode.');
      return;
    }

    // 2. Identify the platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    let detectedPlatform: 'ios' | 'android' | 'desktop' | 'unknown' = 'unknown';
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
      detectedPlatform = 'ios';
      setPlatform('ios');
      // iOS doesn't support beforeinstallprompt, so we display the iOS instructions directly
      setShowBanner(true);
    } else if (/android/.test(userAgent)) {
      detectedPlatform = 'android';
      setPlatform('android');
    } else {
      detectedPlatform = 'desktop';
      setPlatform('desktop');
    }

    // 3. Listen for browser install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
      console.log('beforeinstallprompt event fired & saved!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Timeout fallback: if prompt doesn't fire but we are not standalone, still show banner so they can read how to install
    const timeout = setTimeout(() => {
      if (!isStandalone && detectedPlatform !== 'ios') {
        setShowBanner(true);
      }
    }, 4000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timeout);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`PWA install user choice: ${outcome}`);
        if (outcome === 'accepted') {
          setShowBanner(false);
          toast.success('Thank you for installing Krishna Kirana! 🎉');
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('Error prompting PWA install:', err);
      }
    } else {
      // Manual installation guide based on platform
      if (platform === 'ios') {
        toast('To install: Tap the Share button 📤 and choose "Add to Home Screen".', {
          icon: '📱',
          duration: 6000
        });
      } else if (platform === 'android') {
        toast('To install: Tap the browser menu (3-dots) and choose "Install App" or "Add to Home screen".', {
          icon: '📱',
          duration: 6000
        });
      } else {
        toast('To install: Click the install icon in your browser address bar or click browser settings -> "Install Krishna Kirana".', {
          icon: '💻',
          duration: 6000
        });
      }
    }
  };

  if (!showBanner || isDismissed) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 max-w-md mx-auto animate-[fadeIn_0.3s_ease-out]">
      <div className="backdrop-blur-lg bg-white/95 dark:bg-gray-900/95 border border-green-500/30 dark:border-green-800/30 shadow-[0_20px_50px_rgba(0,0,0,0.18)] rounded-2xl p-4.5 flex items-start gap-4 transition-all">
        {/* App Logo */}
        <div className="w-12 h-12 bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900/30 rounded-xl flex items-center justify-center shrink-0">
          <img src="/logo.png" alt="Krishna Kirana App Logo" className="w-9 h-9 object-contain" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-black text-gray-900 dark:text-white leading-tight">Install Krishna Kirana App</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-normal">
            {platform === 'ios' 
              ? 'Get instant home screen access to our store with offline support.'
              : 'Fast loading, offline orders, and daily deals right on your home screen!'}
          </p>

          {/* iOS Specific Instructions */}
          {platform === 'ios' ? (
            <div className="mt-2.5 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 rounded-xl p-2.5 text-[11px] text-green-800 dark:text-green-400 flex items-center gap-2">
              <Share size={14} className="shrink-0" />
              <span>Tap <strong>Share</strong>, then select <strong>Add to Home Screen</strong>.</span>
            </div>
          ) : (
            <button
              onClick={handleInstall}
              className="mt-3.5 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-extrabold px-4.5 py-2.5 rounded-xl transition-all shadow-md shadow-green-600/10 hover:shadow-green-600/20 cursor-pointer"
            >
              <Download size={13} /> {deferredPrompt ? 'Install App Now' : 'Show Installation Guide'}
            </button>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 cursor-pointer"
          aria-label="Close installation banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
