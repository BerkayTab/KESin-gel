# KESİN GEL — kod incelemesi ve ilk düzeltmeler

İncelenen başlangıç commit’i: `6127ae7`. Bu PR, aşağıdaki review bulgularını kayda geçirir; görseller, yerel tarih hesabı ve takvim dışa aktarımı için sınırlı düzeltmeler içerir. Randevu motorunun ve sunucu mimarisinin yeniden yazımı bu PR kapsamında değildir.

## Genel değerlendirme

React/TypeScript, Tailwind ve bileşenlere ayrılmış bir berber keşif/randevu prototipi var. Favoriler, müşteri profili, randevular ve berber paneli aynı React context üzerinden yönetiliyor. Kalıcılık yalnızca `localStorage`; API, ortak veritabanı ve kimlik doğrulama bulunmuyor. Dolayısıyla mevcut hali gerçek müşteriler arasında ortak randevu takvimi sağlayamaz.

## Açık bulgular

### 1. [P1] Randevu tüm hizmet süresini kapatmıyor

**Konum:** `src/context/AppContext.tsx` → `createAppointment`; `src/components/BookingFlow.tsx` → saat listesi.

`totalDuration` hesaplanıyor fakat kayıtta yalnızca `slot.time === data.time` eşleşmesi kapatılıyor. Örneğin Ahmet Barber için yarın 13:00’te 50 dakikalık Saç + Sakal seçildiğinde 13:30 hâlâ müsait kalıyor; ikinci müşteri ilk randevuyla çakışabiliyor. 19:30’daki 50 dakikalık hizmet de 20:00 kapanışını aşıyor. Başlangıç uygunluğu kayıt anında yeniden doğrulanmıyor.

**Öneri:** Başlangıçtan bitişe kadar tüm aralığı kontrol edip tek işlemle ayırın. Arada dolu/mola varsa veya bitiş kapanışı aşıyorsa reddedin. Hizmet değişince seçili saati yeniden doğrulayın. Testler: 50 dk/30 dk slot, çoklu hizmet, mola ile kesişme, kapanışı aşma ve dolu saate kayıt.

### 2. [P1] Müşteri ve berber birbirlerinin randevularını göremiyor

**Konum:** `src/context/AppContext.tsx` → `localStorage` başlangıçları ve persistence effect’leri; `src/components/Header.tsx` → berber paneline geçiş.

Bir tarayıcıda alınan randevu başka cihazda veya gizli pencerede görünmez. İkinci müşteri aynı saati alabilir; gerçek berberin cihazına kayıt ulaşmaz. Panelde giriş/berber sahipliği kontrolü de yok. Bunlar demo için anlaşılır tercihler, ancak “saat anında kapatılır ve berberin sistemine işlenir” metni gerçek bir garanti vermiyor.

**Öneri:** Gerçek rezervasyon öncesinde sunucu tarafında kimlik doğrulama, berber yetkilendirmesi, ortak veritabanı ve çakışmayı engelleyen atomik kayıt gerekli. Demo olarak yayınlanacaksa kullanıcıya demo olduğunu açıkça belirtin.

### 3. [P1] Berber değişimi önceki berberin ayarlarını diğerine yazabiliyor

**Konum:** `src/components/BarberDashboard.tsx:65` → ayar state’i; `handleSaveSettings`.

Panel ilk açıldığında state Ahmet’in saat/hizmetleriyle kuruluyor. Seçiciden Classic Cut’a geçildiğinde `barber` değişiyor ancak `useState` başlangıçları tekrar çalışmıyor. Kaydet’e basınca Classic Cut kimliği üzerine Ahmet’in saat, tatil ve hizmetleri yazılıyor; hizmet ID’leri de taşınıyor.

**Öneri:** Ayar formunu berber kimliğiyle anahtarlanan ayrı bir bileşende tutun veya berber değişiminde formu açıkça yeniden yükleyin. Berber A → B → kaydet senaryosunda B’nin verilerinin korunduğunu test edin.

### 4. [P2] Takvim, ayarlanan çalışma saatleri ve tatil günlerini uygulamıyor

**Konum:** `src/context/AppContext.tsx` → `getSlotsForDate`.

Üretici dakika kısmını atıyor, her zaman `:00/:30` slotları ve 12:00–13:00 molası oluşturuyor. `slotIntervalMinutes`, `breakHours` ve `daysOff` okunmuyor. Kaydedilmiş günler ise ayarlar değişse de doğrudan eski haliyle döndürülüyor.

Kaynak fonksiyonunun gövdesi Node’da izole çalıştırıldı: Pazar kapalı, açılış 10:15, kapanış 21:45, mola 14:00–15:00 ve aralık 15 dk olan örnekte Pazar için **22 slot**, ilk saat **10:00**, mola saati **14:00 müsait** çıktı. Son slot 20:30’du.

**Öneri:** Dakika bazında üretim yapın, tatil gününü ve gerçek mola aralığını uygulayın. Ayarlar değiştiğinde mevcut rezervasyonları koruyarak uygunluk hesabını güncelleyin.

### 5. [P2] Paneldeki iptal müşteri kaydıyla tutarsız kalıyor

**Konum:** `src/components/BarberDashboard.tsx` → “İptal / Boşalt”; `src/context/AppContext.tsx` → `toggleSlotStatus`, `cancelAppointment`.

Müşterinin aldığı randevuyu panelden “İptal / Boşalt” ile açınca yalnızca slotun durumu değişiyor; `appointments` kaydı hâlâ `confirmed`. Müşteri randevuyu aktif görürken saat yeniden alınabiliyor. Ayrıca slotta eski `appointmentId` kalıyor; müşteri tarafından iptal işlemi de slot sahipliğini kontrol etmeden aynı saati serbest bırakıyor.

**Öneri:** İptali randevu kimliği üzerinden tek işlemle yönetin; yalnızca ilgili randevunun tuttuğu aralığı bırakın. Walk-in ve müşteri randevuları için tutarlı bir kayıt modeli kullanın.

### 6. [P2] Geçmiş saatler hâlâ alınabiliyor; geçmiş randevular aktif kalıyor

**Konum:** `src/components/BookingFlow.tsx` → `scheduleSlots`; `src/components/MyAppointments.tsx:21`; `src/components/Header.tsx:8`.

Bugün saat 16:00’da, durumu available olan 09:00 slotu hâlâ seçilebilir. Aktif/geçmiş ayrımı da yalnızca `status` üzerinden yapılıyor; ertesi gün geçmiş bir `confirmed` randevu aktif listede ve sayaçta kalıyor.

**Öneri:** İşletme saat diliminde tarih+saat kontrolünü hem seçimde hem kayıt sırasında yapın; aktif/geçmiş gösterimini zamanla birlikte hesaplayın.

### 7. [P2] Paneldeki günlük ciro ve randevu sayısı güvenilir değil

**Konum:** `src/components/BarberDashboard.tsx:50` → günlük istatistikler.

Ciroya sabit 2150 ekleniyor ve fiyatı olmayan her dolu slot 450 sayılıyor. Aynı kişinin iki slotluk örnek randevusu iki kez sayılıyor. Bu değerler gerçek rezervasyonlardan türetilmediği için işletmeye yanlış istatistik gösterir.

**Öneri:** İstatistikleri benzersiz randevu kimlikleri, gerçek hizmet tutarı ve durum üzerinden üretin; demo değerlerini açıkça etiketleyin.

## Bu PR’da düzeltilenler

- **Görseller:** Silinmiş `/images/...` ve üretimde bulunmayan `/src/assets/...` URL’leri yerine mevcut JPEG dosyaları Vite import’larıyla kullanılıyor. Berber listesi, kapaklar, hero ve örnek randevular aynı kaynakları kullanıyor. Saklanmış demo kayıtlarındaki görsel yolları da güncel import’larla yenileniyor; diğer kayıt alanları korunuyor.
- **Yerel tarih:** `toISOString()` ile UTC gününe geçiş kaldırıldı. İstanbul’da 00:00–02:59 arasında “Bugün” artık önceki gün olmuyor. Tarih etiketleri de negatif UTC ofsetinde bir gün geriye kaymıyor.
- **Takvim dosyası:** Eksik `UID`, `DTSTAMP`, `DTSTART` ve `DTEND` eklendi; İstanbul randevu saati UTC olarak ve gerçek hizmet süresiyle dışa aktarılıyor. Metin kaçışları, CRLF ve UTF-8 satır katlama eklendi; object URL indirmeden sonra bırakılıyor.
- **Kurulum çakışması:** Uygulamada doğrudan kullanılmayan `esbuild ^0.25.0` sabitlemesi kaldırıldı. İlk offline npm kurulum denemesinde bu sürüm ile Vite’ın `^0.27.0 || ^0.28.0` peer isteği `ERESOLVE` üretti. Bundler kendi uyumlu bağımlılığını seçebilir; temiz kurulumun ağ erişimi olan ortamda doğrulanması gerekir.

## Doğrulama ve sınırlar

- Uygulama klasöründe `npm test`: **5/5 geçti**. Testler Node 22.18+ gerektirir; yerelde Node 26.3.1 kullanıldı. Testler tarih/saat dilimi, gün/yıl geçişi, takvim süresi, metin kaçışları ve UTF-8 satır uzunluğunu kontrol eder; ek test bağımlılığı yoktur.
- `git diff --check`: geçti.
- Randevu takvimi üreticisi yukarıdaki özel ayarlarla kaynak gövdesi üzerinden izole çalıştırıldı; hatalı sonuçlar bulgu 4’te kayıtlıdır.
- Tam bağımlılık kurulumu tamamlanamadı: offline cache’te `@google/genai` bulunmadı ve bu ortamın dış ağ erişimi yok. `npm run lint` ve `npm run build`, `tsc`/`vite` kurulamadığı için çalışamadı. Build veya tarayıcı testinin geçtiği iddia edilmiyor.
- Açık bulgular 1–7 bu PR ile çözülmüş değildir. Gerçek müşteri rezervasyonu açılmadan önce özellikle P1 maddeleri ele alınmalıdır.
