import { useState, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  ShieldCheck, 
  Infinity as InfinityIcon, 
  ChevronRight, 
  Activity, 
  Zap, 
  Clock,
  Menu,
  X,
  Languages,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Settings,
  Package,
  Edit3,
  Play,
  Heart,
  Battery,
  Shield,
  Info
} from 'lucide-react';
import { cn } from './lib/utils';
import { generateWatchImage } from './services/gemini';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, User, db, collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy, doc, getDocFromServer, setDoc, updateDoc } from './firebase';

type Language = 'en' | 'ar';
type Theme = 'dark' | 'light';

const translations = {
  en: {
    slogan: "Beyond Time, Beyond Logic",
    title: "AeroPulse X",
    desc: "The first smartwatch powered by Quantum-Sync technology. Engineered for those who demand precision and performance.",
    preorder: "Pre-order Now",
    watchFilm: "Watch Film",
    featuresTitle: "Engineered for Excellence",
    featuresSubtitle: "Unmatched performance in every detail.",
    aiTitle: "AI Integration",
    aiDesc: "Your personal AI coach, on your wrist. Real-time performance analysis and recovery insights.",
    unbreakableTitle: "Unbreakable",
    unbreakableDesc: "Titanium-Grade casing, water-resistant up to 100m. Built to survive the most extreme environments.",
    infinityTitle: "Infinity Battery",
    infinityDesc: "30 days of power on a single solar charge. Never worry about plugging in again.",
    interactionTitle: "Personalized to Your Aesthetic",
    interactionDesc: "Switch between dynamic watch faces with a single tap. Each face is designed to provide the data you need, when you need it.",
    specsTitle: "Technical Specifications",
    specsSubtitle: "Precision engineering in every component.",
    footerDesc: "Redefining the boundaries of wearable technology. Designed for the future, built for today.",
    login: "Login with Google",
    logout: "Logout",
    nav: ['Features', 'Interaction', 'Specs', 'About'],
    profile: "Profile",
    editProfile: "Edit Profile",
    settings: "Settings",
    myOrders: "My Orders",
    phoneNumber: "Phone Number",
    phoneType: "Phone Type",
    whatsapp: "WhatsApp",
    regular: "Regular",
    country: "Country",
    contactSoon: "We will contact you soon",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    fullName: "Full Name",
    photoUrl: "Photo URL",
    photoUpload: "Upload Profile Picture",
    orderNow: "Order Now",
    selectCountry: "Select Country",
    countries: ["Egypt", "Saudi Arabia", "UAE", "Kuwait", "Qatar", "Bahrain", "Oman", "Jordan", "Lebanon", "Iraq", "Morocco", "Algeria", "Tunisia", "Libya", "Sudan", "Yemen", "Palestine", "Syria", "Somalia", "Djibouti", "Comoros", "Mauritania"],
    watchFilmTitle: "AeroPulse X: The Film",
    watchFaces: [
      { name: 'Quantum', unit: 'BPM', label: 'HEART RATE' },
      { name: 'Pulse', unit: 'RECOVERY', label: 'BIO-SYNC' },
      { name: 'Stealth', unit: 'STEALTH', label: 'SECURITY' },
      { name: 'Energy', unit: 'CHARGE', label: 'POWER' },
    ],
    specs: [
      { label: "Display", value: "1.9-inch AMOLED", sub: "2000 nits, Always-on" },
      { label: "Sensors", value: "ECG & SpO2", sub: "Bio-Sync Tracking" },
      { label: "Compatibility", value: "iOS & Android", sub: "Desktop Sync Ready" },
      { label: "Battery", value: "30 Days Solar", sub: "10 Days Standard" },
      { label: "Material", value: "Titanium Grade 5", sub: "Aerospace Standard" },
      { label: "Water Resistance", value: "100m (10 ATM)", sub: "Diving Certified" },
    ]
  },
  ar: {
    slogan: "أبعد من الوقت، أبعد من المنطق",
    title: "AeroPulse X",
    desc: "أول ساعة ذكية تعمل بتقنية Quantum-Sync. صُممت لأولئك الذين يطلبون الدقة والأداء.",
    preorder: "اطلب مسبقاً الآن",
    watchFilm: "شاهد الفيلم",
    featuresTitle: "هندسة من أجل التميز",
    featuresSubtitle: "أداء لا مثيل له في كل التفاصيل.",
    aiTitle: "تكامل الذكاء الاصطناعي",
    aiDesc: "مدربك الشخصي بالذكاء الاصطناعي على معصمك. تحليل الأداء في الوقت الفعلي ورؤى التعافي.",
    unbreakableTitle: "غير قابلة للكسر",
    unbreakableDesc: "هيكل من التيتانيوم، مقاوم للماء حتى 100 متر. صُممت لتتحمل أقسى البيئات.",
    infinityTitle: "بطارية لا نهائية",
    infinityDesc: "30 يوماً من الطاقة بشحنة شمسية واحدة. لا تقلق أبداً بشأن الشحن مرة أخرى.",
    interactionTitle: "مخصصة لتناسب ذوقك",
    interactionDesc: "بدل بين واجهات الساعة الديناميكية بنقرة واحدة. تم تصميم كل واجهة لتوفير البيانات التي تحتاجها.",
    specsTitle: "المواصفات التقنية",
    specsSubtitle: "هندسة دقيقة في كل مكون.",
    footerDesc: "إعادة تعريف حدود التكنولوجيا القابلة للارتداء. صُممت للمستقبل، بُنيت لليوم.",
    login: "تسجيل الدخول بجوجل",
    logout: "تسجيل الخروج",
    nav: ['المميزات', 'التفاعل', 'المواصفات', 'حول'],
    profile: "الملف الشخصي",
    editProfile: "تعديل الملف",
    settings: "الإعدادات",
    myOrders: "طلباتي",
    phoneNumber: "رقم الهاتف",
    phoneType: "نوع الهاتف",
    whatsapp: "واتساب",
    regular: "عادي",
    country: "الدولة",
    contactSoon: "سيتم التواصل معك قريباً",
    saveChanges: "حفظ التغييرات",
    cancel: "إلغاء",
    fullName: "الاسم الكامل",
    photoUrl: "رابط الصورة",
    photoUpload: "تحميل صورة الملف الشخصي",
    orderNow: "اطلب الآن",
    selectCountry: "اختر الدولة",
    countries: ["مصر", "السعودية", "الإمارات", "الكويت", "قطر", "البحرين", "عمان", "الأردن", "لبنان", "العراق", "المغرب", "الجزائر", "تونس", "ليبيا", "السودان", "اليمن", "فلسطين", "سوريا", "الصومال", "جيبوتي", "جزر القمر", "موريتانيا"],
    watchFilmTitle: "AeroPulse X: الفيلم",
    watchFaces: [
      { name: 'كوانتم', unit: 'نبضة', label: 'معدل ضربات القلب' },
      { name: 'بصمة', unit: 'تعافي', label: 'المزامنة الحيوية' },
      { name: 'خفي', unit: 'تخفي', label: 'الأمان' },
      { name: 'طاقة', unit: 'شحن', label: 'الطاقة' },
    ],
    specs: [
      { label: "الشاشة", value: "1.9 بوصة AMOLED", sub: "2000 شمعة، تشغيل دائم" },
      { label: "المستشعرات", value: "ECG و SpO2", sub: "تتبع المزامنة الحيوية" },
      { label: "التوافق", value: "iOS وأندرويد", sub: "جاهز للمزامنة المكتبية" },
      { label: "البطارية", value: "30 يوماً بالطاقة الشمسية", sub: "10 أيام قياسي" },
      { label: "المواد", value: "تيتانيوم درجة 5", sub: "معيار الطيران" },
      { label: "مقاومة الماء", value: "100 متر (10 ATM)", sub: "معتمد للغوص" },
    ]
  }
};

export default function App() {
  const [heroImage, setHeroImage] = useState<string | null>("https://i.ibb.co/ht4Wbqj/image.png");
  const [activeWatchFace, setActiveWatchFace] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('dark');
  const [user, setUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [isOrdering, setIsOrdering] = useState(false);

  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPreOrderModalOpen, setIsPreOrderModalOpen] = useState(false);
  const [isWatchFilmOpen, setIsWatchFilmOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Form states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneType, setPhoneType] = useState<'whatsapp' | 'regular'>('whatsapp');
  const [country, setCountry] = useState('');
  const [editName, setEditName] = useState('');
  const [editPhoto, setEditPhoto] = useState('');

  const t = translations[lang];
  const isRtl = lang === 'ar';

  const watchFaces = [
    { ...t.watchFaces[0], color: 'text-accent', bg: 'bg-accent/10', icon: Activity, value: '142' },
    { ...t.watchFaces[1], color: 'text-rose-500', bg: 'bg-rose-500/10', icon: Heart, value: '82' },
    { ...t.watchFaces[2], color: 'text-white', bg: 'bg-white/10', icon: Shield, value: '00' },
    { ...t.watchFaces[3], color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Battery, value: '98%' },
  ];

    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user profile data from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const unsubUser = onSnapshot(userDocRef, (docSnap: any) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            // Merge auth user with firestore data for UI
            setUser({
              ...currentUser,
              displayName: userData.displayName || currentUser.displayName,
              photoURL: userData.photoURL || currentUser.photoURL
            } as User);
          }
        });

        // Fetch orders
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const unsubOrders = onSnapshot(q, (snapshot: any) => {
          setOrders(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
        });
        return () => {
          unsubUser();
          unsubOrders();
        };
      } else {
        setOrders([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Create user document in Firestore if it doesn't exist
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDocFromServer(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'user',
          createdAt: serverTimestamp()
        });
      }
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request') {
        console.log("A login popup was already open or the request was cancelled.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        console.log("Login popup was closed by the user.");
      } else {
        console.error("Login failed:", error);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleLang = () => setLang(prev => prev === 'en' ? 'ar' : 'en');
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit for input
        setMessage({
          text: lang === 'en' ? "File is too large! Please select an image under 10MB." : "الملف كبير جداً! يرجى اختيار صورة أقل من 10 ميجابايت.",
          type: 'error'
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions for profile pic
          const MAX_SIZE = 400;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to 0.7 quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setEditPhoto(compressedDataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: editName,
        photoURL: editPhoto
      });
      setIsProfileEditOpen(false);
      setMessage({
        text: lang === 'en' ? "Profile updated successfully!" : "تم تحديث الملف الشخصي بنجاح!",
        type: 'success'
      });
    } catch (error) {
      console.error("Profile update failed:", error);
      setMessage({
        text: lang === 'en' ? "Failed to update profile. The image might still be too large." : "فشل تحديث الملف الشخصي. قد تكون الصورة لا تزال كبيرة جداً.",
        type: 'error'
      });
    }
  };

  const handleFinalOrder = async () => {
    if (!user) return;
    if (!phoneNumber || !country) {
      alert(lang === 'en' ? "Please fill all fields" : "يرجى ملء جميع الخانات");
      return;
    }
    setIsOrdering(true);
    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        productName: 'AeroPulse X',
        status: 'pending',
        price: 299,
        phoneNumber,
        phoneType,
        country,
        createdAt: serverTimestamp()
      });
      setIsPreOrderModalOpen(false);
      setPhoneNumber('');
      setCountry('');
      alert(lang === 'en' ? "Order placed! " + t.contactSoon : "تم تقديم الطلب! " + t.contactSoon);
    } catch (error) {
      console.error("Order failed:", error);
    } finally {
      setIsOrdering(false);
    }
  };

  const handlePreOrder = () => {
    if (!user) {
      handleLogin();
      return;
    }
    setIsPreOrderModalOpen(true);
  };

  return (
    <div className={cn(
      "min-h-screen selection:bg-accent selection:text-bg overflow-x-hidden transition-colors duration-300",
      theme === 'dark' ? "bg-bg text-white" : "bg-bg-light text-text-light"
    )}>
      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileModalOpen && user && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProfileModalOpen(false)} className="absolute inset-0 bg-bg/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={cn("relative z-10 w-full max-w-md rounded-3xl border p-8 shadow-2xl", theme === 'dark' ? "bg-bg border-white/10" : "bg-white border-black/10")}>
              <button onClick={() => setIsProfileModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full"><X /></button>
              <div className="flex flex-col items-center text-center">
                <img src={user.photoURL || ''} className="w-24 h-24 rounded-full border-4 border-accent mb-6" />
                <h2 className="text-2xl font-bold mb-2">{user.displayName}</h2>
                <p className="text-muted mb-8">{user.email}</p>
                <div className="w-full grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-xs text-muted mb-1 uppercase tracking-widest">{t.myOrders}</p>
                    <p className="text-xl font-bold">{orders.length}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-xs text-muted mb-1 uppercase tracking-widest">{t.country}</p>
                    <p className="text-xl font-bold">{orders[0]?.country || '-'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isProfileEditOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProfileEditOpen(false)} className="absolute inset-0 bg-bg/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className={cn("relative z-10 w-full max-w-md rounded-3xl border p-8 shadow-2xl", theme === 'dark' ? "bg-bg border-white/10" : "bg-white border-black/10")}>
              <h2 className="text-2xl font-bold mb-8">{t.editProfile}</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">{t.fullName}</label>
                  <input type="text" value={editName} onChange={(e: ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-accent outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">{t.photoUpload}</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-white/5 border border-white/10 shrink-0">
                      <img src={editPhoto || user?.photoURL || ''} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange} 
                      className="w-full text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-bg hover:file:bg-accent/80 cursor-pointer" 
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setIsProfileEditOpen(false)} className="flex-1 py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-colors">{t.cancel}</button>
                  <button onClick={handleUpdateProfile} className="flex-1 py-4 rounded-xl bg-accent text-bg font-bold hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all">{t.saveChanges}</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSettingsOpen(false)} className="absolute inset-0 bg-bg/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={cn("relative z-10 w-full max-w-md rounded-3xl border p-8 shadow-2xl", theme === 'dark' ? "bg-bg border-white/10" : "bg-white border-black/10")}>
              <h2 className="text-2xl font-bold mb-8">{t.settings}</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <Languages className="text-accent" />
                    <span className="font-bold">{lang === 'en' ? 'Language' : 'اللغة'}</span>
                  </div>
                  <button onClick={toggleLang} className="px-4 py-2 bg-accent/10 text-accent rounded-lg font-bold text-sm">
                    {lang === 'en' ? 'English' : 'العربية'}
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? <Moon className="text-accent" /> : <Sun className="text-accent" />}
                    <span className="font-bold">{lang === 'en' ? 'Theme' : 'المظهر'}</span>
                  </div>
                  <button onClick={toggleTheme} className="px-4 py-2 bg-accent/10 text-accent rounded-lg font-bold text-sm uppercase">
                    {theme}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pre-Order Modal */}
      <AnimatePresence>
        {isPreOrderModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPreOrderModalOpen(false)} className="absolute inset-0 bg-bg/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className={cn("relative z-10 w-full max-w-md rounded-3xl border p-8 shadow-2xl", theme === 'dark' ? "bg-bg border-white/10" : "bg-white border-black/10")}>
              <h2 className="text-2xl font-bold mb-2">{t.preorder}</h2>
              <p className="text-muted mb-8 text-sm">{t.contactSoon}</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">{t.phoneNumber}</label>
                  <div className="flex gap-2 mb-2">
                    <button onClick={() => setPhoneType('whatsapp')} className={cn("flex-1 py-2 rounded-lg text-xs font-bold border transition-all", phoneType === 'whatsapp' ? "bg-accent/10 border-accent text-accent" : "border-white/10 text-muted")}>{t.whatsapp}</button>
                    <button onClick={() => setPhoneType('regular')} className={cn("flex-1 py-2 rounded-lg text-xs font-bold border transition-all", phoneType === 'regular' ? "bg-accent/10 border-accent text-accent" : "border-white/10 text-muted")}>{t.regular}</button>
                  </div>
                  <input type="tel" placeholder="+1234567890" value={phoneNumber} onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-accent outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">{t.country}</label>
                  <select value={country} onChange={(e: ChangeEvent<HTMLSelectElement>) => setCountry(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-accent outline-none transition-colors appearance-none">
                    <option value="" disabled>{t.selectCountry}</option>
                    {t.countries.map(c => <option key={c} value={c} className="bg-bg">{c}</option>)}
                  </select>
                </div>
                <button onClick={handleFinalOrder} disabled={isOrdering} className="w-full py-4 rounded-xl bg-accent text-bg font-bold hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all flex items-center justify-center gap-2">
                  {isOrdering && <div className="w-5 h-5 border-2 border-bg border-t-transparent rounded-full animate-spin" />}
                  {t.orderNow}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Watch Film Modal */}
      <AnimatePresence>
        {isWatchFilmOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsWatchFilmOpen(false)} className="absolute inset-0 bg-bg/95 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative z-10 w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,255,255,0.2)]">
              <button onClick={() => setIsWatchFilmOpen(false)} className="absolute top-6 right-6 z-20 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"><X /></button>
              <iframe 
  className="w-full h-full" 
  src="https://player.vimeo.com/video/1180121847" 
  title={t.watchFilmTitle} 
  frameBorder="0" 
  allow="autoplay; fullscreen; picture-in-picture" 
  allowFullScreen
></iframe>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOrdersOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOrdersOpen(false)}
              className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                "relative z-10 w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden",
                theme === 'dark' ? "bg-bg border-white/10" : "bg-white border-black/10"
              )}
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                  <Package className="text-accent" />
                  {lang === 'en' ? 'My Orders' : 'طلباتي'}
                </h2>
                <button onClick={() => setIsOrdersOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                {orders.length === 0 ? (
                  <div className="text-center py-20">
                    <Package className="w-16 h-16 text-muted mx-auto mb-4 opacity-20" />
                    <p className="text-muted">{lang === 'en' ? 'No orders yet.' : 'لا توجد طلبات بعد.'}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div 
                        key={order.id}
                        className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-accent/30 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                            <Zap className="w-6 h-6 text-accent" />
                          </div>
                          <div>
                            <p className="font-bold">{order.productName}</p>
                            <p className="text-xs text-muted">
                              {order.createdAt?.toDate().toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-accent">${order.price}</p>
                          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-accent/10 text-accent">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-300",
        theme === 'dark' ? "bg-bg/80 border-white/5" : "bg-white/80 border-black/5"
      )}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-bg fill-current" />
            </div>
            <span className="font-display font-bold text-xl tracking-tighter">{t.title}</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {t.nav.map((item, idx) => (
              <a 
                key={idx} 
                href={`#${translations.en.nav[idx].toLowerCase()}`}
                className={cn(
                  "text-sm font-medium transition-colors",
                  theme === 'dark' ? "text-muted hover:text-white" : "text-muted-light hover:text-text-light"
                )}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={toggleLang}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Toggle Language"
            >
              <Languages className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 pl-4 border-l border-white/10 hover:opacity-80 transition-opacity"
                >
                  <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-accent" />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className={cn(
                        "absolute top-full mt-4 w-64 rounded-2xl border shadow-2xl p-2 z-50",
                        isRtl ? "left-0" : "right-0",
                        theme === 'dark' ? "bg-bg border-white/10" : "bg-white border-black/10"
                      )}
                    >
                      <div className="p-4 border-b border-white/5 mb-2">
                        <p className="font-bold truncate">{user.displayName}</p>
                        <p className="text-xs text-muted truncate">{user.email}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <button 
                          onClick={() => {
                            setIsProfileModalOpen(true);
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-sm"
                        >
                          <UserIcon className="w-4 h-4 text-accent" />
                          {t.profile}
                        </button>
                        <button 
                          onClick={() => {
                            setIsOrdersOpen(true);
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-sm"
                        >
                          <Package className="w-4 h-4 text-accent" />
                          {t.myOrders}
                          {orders.length > 0 && (
                            <span className="ml-auto bg-accent text-bg text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {orders.length}
                            </span>
                          )}
                        </button>
                        <button 
                          onClick={() => {
                            setEditName(user.displayName || '');
                            setEditPhoto(user.photoURL || '');
                            setIsProfileEditOpen(true);
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-sm"
                        >
                          <Edit3 className="w-4 h-4 text-accent" />
                          {t.editProfile}
                        </button>
                        <button 
                          onClick={() => {
                            setIsSettingsOpen(true);
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-sm"
                        >
                          <Settings className="w-4 h-4 text-accent" />
                          {t.settings}
                        </button>
                        <div className="h-px bg-white/5 my-2" />
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-colors text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          {t.logout}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                disabled={isLoggingIn}
                className={cn(
                  "px-6 py-2 bg-accent text-bg font-bold rounded-full text-sm transition-all flex items-center gap-2",
                  isLoggingIn ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"
                )}
              >
                {isLoggingIn ? (
                  <div className="w-4 h-4 border-2 border-bg border-t-transparent rounded-full animate-spin" />
                ) : (
                  <UserIcon className="w-4 h-4" />
                )}
                {t.login}
              </button>
            )}
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed inset-0 z-40 pt-24 px-6 md:hidden",
              theme === 'dark' ? "bg-bg" : "bg-bg-light"
            )}
          >
            <div className="flex flex-col gap-8">
              {t.nav.map((item, idx) => (
                <a 
                  key={idx} 
                  href={`#${translations.en.nav[idx].toLowerCase()}`}
                  className="text-2xl font-display font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <button onClick={toggleLang} className="flex-1 py-3 glass-card flex items-center justify-center gap-2">
                  <Languages className="w-5 h-5" /> {lang === 'en' ? 'العربية' : 'English'}
                </button>
                <button onClick={toggleTheme} className="flex-1 py-3 glass-card flex items-center justify-center gap-2">
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />} {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
              </div>
              {!user && (
                <button 
                  onClick={handleLogin} 
                  disabled={isLoggingIn}
                  className={cn(
                    "w-full py-4 bg-accent text-bg font-bold rounded-xl text-lg flex items-center justify-center gap-2 transition-all",
                    isLoggingIn ? "opacity-50 cursor-not-allowed" : "active:scale-95"
                  )}
                >
                  {isLoggingIn && <div className="w-5 h-5 border-2 border-bg border-t-transparent rounded-full animate-spin" />}
                  {t.login}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 1: Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/10 blur-[150px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[150px] translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-accent text-xs font-bold tracking-widest uppercase mb-6">
              {t.slogan}
            </span>
            <h1 className="text-6xl md:text-8xl font-display font-extrabold tracking-tighter mb-6">
              AeroPulse <span className="text-accent">X</span>
            </h1>
            <p className={cn(
              "text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed",
              theme === 'dark' ? "text-muted" : "text-muted-light"
            )}>
              {t.desc}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handlePreOrder}
                className="w-full sm:w-auto px-10 py-4 bg-accent text-bg font-bold rounded-xl text-lg hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {t.preorder}
              </button>
              <button 
                onClick={() => setIsWatchFilmOpen(true)}
                className={cn(
                  "w-full sm:w-auto px-10 py-4 border font-bold rounded-xl text-lg transition-all flex items-center justify-center gap-2",
                  theme === 'dark' ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-black/5 border-black/10 text-text-light hover:bg-black/10"
                )}
              >
                {t.watchFilm} <Play className={cn("w-5 h-5", isRtl && "rotate-180")} />
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-20 relative group max-w-[600px] mx-auto"
          >
            <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full group-hover:bg-accent/30 transition-colors" />
            <motion.img 
              src={heroImage || "./2"} 
              alt="AeroPulse X"
              className={cn(
                "relative z-10 w-full drop-shadow-[0_0_50px_rgba(0,255,255,0.2)]",
                theme === 'dark' ? "mix-blend-screen" : "mix-blend-multiply"
              )}
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 2, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Section 2: Core Features */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">{t.featuresTitle}</h2>
          <p className={cn("text-lg", theme === 'dark' ? "text-muted" : "text-muted-light")}>{t.featuresSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Cpu, title: t.aiTitle, desc: t.aiDesc },
            { icon: ShieldCheck, title: t.unbreakableTitle, desc: t.unbreakableDesc },
            { icon: InfinityIcon, title: t.infinityTitle, desc: t.infinityDesc }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className={cn(
                "glass-card p-10 group",
                theme === 'light' && "bg-black/5 border-black/10"
              )}
            >
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-bg transition-colors">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">{feature.title}</h3>
              <p className={cn("leading-relaxed", theme === 'dark' ? "text-muted" : "text-muted-light")}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 3: Interaction */}
      <section id="interaction" className={cn(
        "py-32 border-y transition-colors duration-300",
        theme === 'dark' ? "bg-white/[0.02] border-white/5" : "bg-black/[0.02] border-black/5"
      )}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
              {t.interactionTitle.split(' ').map((word, i) => 
                word.toLowerCase() === 'aesthetic' || word === 'ذوقك' 
                ? <span key={i} className="text-accent italic"> {word} </span> 
                : word + ' '
              )}
            </h2>
            <p className={cn("text-lg mb-10 leading-relaxed", theme === 'dark' ? "text-muted" : "text-muted-light")}>
              {t.interactionDesc}
            </p>
            
            <div className="space-y-4">
              {watchFaces.map((face, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveWatchFace(idx)}
                  className={cn(
                    "w-full p-6 rounded-2xl border transition-all flex items-center justify-between group",
                    activeWatchFace === idx 
                      ? "bg-accent/10 border-accent" 
                      : theme === 'dark' ? "bg-white/5 border-white/10 text-muted hover:border-white/30" : "bg-black/5 border-black/10 text-muted-light hover:border-black/30"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-3 h-3 rounded-full", face.bg.replace('/10', ''))} />
                    <span className="font-bold text-lg">{face.name}</span>
                  </div>
                  <ChevronRight className={cn("w-5 h-5 transition-transform", activeWatchFace === idx && (isRtl ? "-translate-x-1" : "translate-x-1"), isRtl && "rotate-180")} />
                </button>
              ))}
            </div>
          </div>

          <div className="relative aspect-square flex items-center justify-center">
            <div className="absolute inset-0 bg-accent/5 blur-[120px] rounded-full" />
            <motion.div 
              className={cn(
                "relative z-10 w-full max-w-[400px] aspect-square rounded-full border-8 overflow-hidden flex items-center justify-center shadow-[0_0_80px_rgba(0,255,255,0.1)]",
                theme === 'dark' ? "border-white/10 bg-bg" : "border-black/10 bg-bg-light"
              )}
              animate={{ 
                rotate: activeWatchFace * 90,
                boxShadow: theme === 'dark' ? `0 0 100px ${watchFaces[activeWatchFace].color.replace('text-', 'rgba(').replace('accent', '0,255,255').replace('rose-500', '244,63,94').replace('white', '255,255,255').replace('yellow-400', '250,204,21')}, 0.2)` : 'none'
              }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWatchFace}
                  initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: activeWatchFace * -90 }}
                  exit={{ opacity: 0, scale: 1.5, rotate: 45 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className="flex flex-col items-center gap-4"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {(() => {
                      const Icon = watchFaces[activeWatchFace].icon;
                      return <Icon className={cn("w-24 h-24", watchFaces[activeWatchFace].color)} />;
                    })()}
                  </motion.div>
                  <div className="text-center">
                    <span className="text-5xl font-display font-black tracking-widest block">
                      {watchFaces[activeWatchFace].value}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted mt-2 block">
                      {watchFaces[activeWatchFace].unit}
                    </span>
                  </div>
                  <div className={cn("px-4 py-1 rounded-full text-[10px] font-bold tracking-widest border", watchFaces[activeWatchFace].color.replace('text-', 'border-').replace('accent', 'accent/30'))}>
                    {watchFaces[activeWatchFace].label}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
            
            {/* Decorative Rings */}
            {[1.1, 1.25, 1.4].map((scale, i) => (
              <motion.div 
                key={i}
                className="absolute inset-0 border border-white/5 rounded-full"
                animate={{ 
                  scale,
                  rotate: activeWatchFace * 30 * (i + 1),
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Technical Specs */}
      <section id="specs" className="py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">{t.specsTitle}</h2>
          <p className={theme === 'dark' ? "text-muted" : "text-muted-light"}>{t.specsSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { ...t.specs[0], icon: Sun },
            { ...t.specs[1], icon: Activity },
            { ...t.specs[2], icon: Zap },
            { ...t.specs[3], icon: Battery },
            { ...t.specs[4], icon: Shield },
            { ...t.specs[5], icon: Info },
          ].map((spec, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className={cn(
                "p-8 rounded-3xl border flex flex-col gap-4 transition-all group",
                theme === 'dark' ? "bg-white/5 border-white/10 hover:border-accent/50" : "bg-black/5 border-black/10 hover:border-accent/50"
              )}
            >
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-accent transition-colors">
                <spec.icon className="w-6 h-6 text-accent group-hover:text-bg" />
              </div>
              <div>
                <p className={cn("text-xs font-bold uppercase tracking-widest mb-1", theme === 'dark' ? "text-muted" : "text-muted-light")}>{spec.label}</p>
                <p className="text-xl font-bold mb-1">{spec.value}</p>
                <p className="text-sm text-muted">{spec.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 5: Footer */}
      <footer className={cn(
        "relative py-40 px-6 overflow-hidden border-t transition-colors duration-300",
        theme === 'dark' ? "border-white/5" : "border-black/5"
      )}>
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none opacity-[0.03]">
          <span className="text-[20vw] font-display font-black tracking-tighter leading-none">
            AEROPULSE
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-bg fill-current" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tighter">{t.title}</span>
          </div>
          
          <p className={cn("max-w-md mb-12", theme === 'dark' ? "text-muted" : "text-muted-light")}>
            {t.footerDesc}
          </p>

          <div className="flex gap-8 mb-20">
            {[
              { name: 'Instagram', url: 'https://instagram.com' },
              { name: 'Twitter', url: 'https://twitter.com' },
              { name: 'LinkedIn', url: 'https://linkedin.com' }
            ].map((social) => (
              <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors font-bold text-sm uppercase tracking-widest">
                {social.name}
              </a>
            ))}
          </div>

          <div className={cn(
            "pt-10 border-t w-full flex flex-col md:flex-row items-center justify-between gap-6",
            theme === 'dark' ? "border-white/10" : "border-black/10"
          )}>
            <p className="text-muted text-sm">
              © 2026 AeroPulse Technology. All rights reserved.
            </p>
            <div className="flex flex-col items-center md:items-end gap-1 text-sm text-muted">
              <div className="flex items-center gap-2">
                <span>Designed & Developed by</span>
                <span className={theme === 'dark' ? "text-white font-bold" : "text-text-light font-bold"}>Alia Ezat</span>
              </div>
              <span className="text-accent font-display font-bold tracking-widest text-[10px]">Nexus Web Agency</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={cn(
              "fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-xl",
              message.type === 'success' 
                ? "bg-accent/20 border-accent text-accent" 
                : "bg-rose-500/20 border-rose-500 text-rose-500"
            )}
          >
            {message.type === 'success' ? <ShieldCheck className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
            <span className="font-bold text-sm">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
