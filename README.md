# WebGIS A2 — نقشه وب با OpenLayers + جستجوی مکان + هواشناسی (No API Key)

این پروژه یک WebGIS سبک و کاربردی است که با **OpenLayers** و **Fetch API** ساخته شده و دو قابلیت اصلی دارد:

- **بخش ۱ (Geocoding/Search):** جستجوی نام مکان → حرکت نرم (Fly/Animate) به مقصد + قرار دادن Marker  
- **بخش ۲ (Weather on Click):** کلیک روی نقشه → دریافت آب‌وهوا از API و نمایش در یک کارت (Overlay)

در نسخه نهایی برای Geocoding و Weather از **Open-Meteo** استفاده شده و پروژه **بدون API Key** اجرا می‌شود.

---

## دمـو (Screenshot / GIF)

![Final Screenshot](media/screenshots/final.png)

![Demo GIF](media/gifs/demo.gif)

---

## خروجی و قابلیت‌ها

### 1) جستجوی مکان (Geocoding)
- کاربر نام مکان را وارد می‌کند (مثل `Tehran`، `Finland`، `Los Angeles`)
- با `fetch` به **Open-Meteo Geocoding API** درخواست زده می‌شود
- اولین نتیجه استفاده می‌شود:
  - Marker روی نقشه قرار می‌گیرد
  - نقشه با انیمیشن به مقصد زوم و جابه‌جا می‌شود

### 2) هواشناسی با کلیک روی نقشه
- کاربر روی هر نقطه از نقشه کلیک می‌کند
- مختصات کلیک به `lat/lon` تبدیل می‌شود
- با `fetch` به **Open-Meteo Forecast API** درخواست زده می‌شود (Current Weather)
- کارت (Overlay) نمایش می‌دهد:
  - وضعیت هوا (بر اساس Weather Code)
  - دما
  - دمای احساسی
  - رطوبت
  - سرعت باد
  - زمان محلی و timezone

### UI/UX
- Toast برای پیام موفق/خطا
- کارت هواشناسی با دکمه بستن
- پنل Debug برای نمایش آخرین جستجو و آخرین کلیک
- طراحی ریسپانسیو

---

## ساختار پروژه

```text
webgis2/
  index.html
  style.css
  script.js

  vendor/
    ol/
      ol.js
      ol.css

  media/
    screenshots/
      final.png
    gifs/
      demo.gif

  favicon.ico
  .gitignore
  ASSIGNMENT_README.md
  README.md
````

**نکته‌ها**

* OpenLayers به صورت **لوکال** از مسیر `vendor/ol/` لود می‌شود (بدون CDN).
* **API Keys: N/A** (در این نسخه از APIهایی استفاده شده که کلید نمی‌خواهند).

---

## اجرای پروژه

### روش پیشنهادی: Python HTTP Server

1. ترمینال را داخل فولدر پروژه (جایی که `index.html` هست) باز کنید
2. اجرا:

```bash
python -m http.server 8000
```

3. آدرس در مرورگر:

```text
http://localhost:8000
```

### روش جایگزین: VS Code Live Server

* افزونه Live Server را نصب کنید
* روی `index.html` راست‌کلیک → Open with Live Server

---

## روش استفاده

1. نام یک مکان را وارد کنید و Search بزنید (یا Enter)
2. نقشه به مقصد حرکت می‌کند و Marker قرار می‌گیرد
3. روی نقشه کلیک کنید تا کارت هواشناسی نمایش داده شود

---

## قابلیت‌های OpenLayers که استفاده شده‌اند (مستندسازی تکلیف)

### اجزای اصلی نقشه

* `ol.Map` — ساخت نقشه
* `ol.View` — مدیریت center و zoom
* `ol.layer.Tile` + `ol.source.OSM` — لایه پایه OpenStreetMap
* `ol.layer.Vector` + `ol.source.Vector` — لایه Markerها
* `ol.Feature` + `ol.geom.Point` — ساخت Marker

### تبدیل مختصات / Projection

* `ol.proj.fromLonLat([lon, lat])` — تبدیل مختصات برای نمایش روی نقشه
* `ol.proj.toLonLat(evt.coordinate)` — تبدیل مختصات کلیک به lon/lat

### کنترل‌ها (Controls)

* `ol.control.FullScreen()` — تمام‌صفحه
* `ol.control.ScaleLine()` — خط مقیاس
* `ol.control.MousePosition()` — نمایش مختصات موس (EPSG:4326)

### رخداد و انیمیشن

* `map.on("click", handler)` — دریافت کلیک روی نقشه
* `view.animate(...)` — حرکت نرم و زوم با انیمیشن

---

## API ها و الگوهای درخواست (Fetch)

### 1) Geocoding — Open-Meteo

الگوی endpoint:

```text
https://geocoding-api.open-meteo.com/v1/search?name=<QUERY>&count=1&language=en&format=json
```

### 2) Weather — Open-Meteo Forecast (Current)

الگوی endpoint:

```text
https://api.open-meteo.com/v1/forecast?latitude=<LAT>&longitude=<LON>&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto
```

---

## مدیریت خطا (Error Handling)

* ورودی خالی در Search → پیام خطا
* بدون نتیجه در Geocoding → “No results found”
* خطای شبکه/API → نمایش پیام خطا در Toast و داخل کارت Weather
* جلوگیری از کرش شدن UI با try/catch و پیام‌های قابل فهم

---

# بخش تحقیقاتی (API Research)

طبق خواسته تکلیف، چند API برای **Geocoding** و **Weather** از نظر **قیمت دلاری** مقایسه شده‌اند و مشخص شده کدام سرویس‌ها ارزان‌تر/گران‌تر هستند (همراه با یک مثال Ratio).

> توجه: قیمت‌ها ممکن است با زمان تغییر کنند.

---

## A) Geocoding APIs (حداقل ۳ مورد)

| API                          | نیاز به Key | مدل قیمت                     |             قیمت دلاری (نمونه) | نتیجه              |
| ---------------------------- | ----------: | ---------------------------- | -----------------------------: | ------------------ |
| Open-Meteo Geocoding         |         خیر | رایگان                       |                             $0 | ارزان‌ترین         |
| Mapbox Geocoding (Temporary) |         بله | پرداخت به ازای 1000          |              حدود $0.75 / 1000 | ارزان‌تر از Google |
| Google Geocoding API         |         بله | پرداخت به ازای 1000 (tiered) | حدود $5.00 / 1000 (tier اولیه) | گران‌تر            |

**نتیجه Geocoding (ارزان/گران):**

* ارزان‌ترین: **Open-Meteo**
* بین گزینه‌های پولی: **Mapbox** معمولاً ارزان‌تر از **Google** است.

**مثال Ratio (Geocoding):**
اگر Google ≈ $5/1000 و Mapbox ≈ $0.75/1000 →
Google / Mapbox ≈ 5 / 0.75 ≈ **6.67×** (Google گران‌تر)

---

## B) Weather APIs (حداقل ۳ مورد)

| API                      | نیاز به Key | مدل قیمت        |                           قیمت دلاری (نمونه) | نتیجه                  |
| ------------------------ | ----------: | --------------- | -------------------------------------------: | ---------------------- |
| Open-Meteo Forecast      |         خیر | رایگان          |                                           $0 | ارزان‌ترین             |
| WeatherAPI.com           |         بله | پلن ماهانه      | Free: $0 (1M/month) / Starter: $7 (3M/month) | معمولاً ارزان          |
| OpenWeather One Call 3.0 |         بله | pay-as-you-call |               $0.0015 per call → $1.5 / 1000 | گران‌تر (بعد از سهمیه) |

**محاسبه نمونه هزینه WeatherAPI Starter به ازای 1000 درخواست:**
$7 برای 3,000,000 درخواست → 7 / 3,000,000 × 1000 ≈ **$0.00233 / 1000**

**نتیجه Weather (ارزان/گران):**

* ارزان‌ترین: **Open-Meteo**
* بین گزینه‌های پولی: در این مقایسه، **OpenWeather** (بعد از سهمیه) از **WeatherAPI Starter** گران‌تر است.

**مثال Ratio (Weather):**
OpenWeather ≈ $1.5/1000 و WeatherAPI Starter ≈ $0.00233/1000 →
1.5 / 0.00233 ≈ **643×** (OpenWeather گران‌تر)

---

## منابع رسمی (Official / Primary)

Geocoding:

* Open-Meteo Geocoding Docs: [https://open-meteo.com/en/docs/geocoding-api](https://open-meteo.com/en/docs/geocoding-api)
* Mapbox Geocoding: [https://www.mapbox.com/geocoding](https://www.mapbox.com/geocoding)
* Mapbox Pricing: [https://www.mapbox.com/pricing](https://www.mapbox.com/pricing)
* Google Maps Platform Pricing: [https://developers.google.com/maps/billing-and-pricing/pricing](https://developers.google.com/maps/billing-and-pricing/pricing)
* Google Geocoding Usage & Billing: [https://developers.google.com/maps/documentation/geocoding/usage-and-billing](https://developers.google.com/maps/documentation/geocoding/usage-and-billing)

Weather:

* Open-Meteo Docs: [https://open-meteo.com/en/docs](https://open-meteo.com/en/docs)
* WeatherAPI Pricing: [https://www.weatherapi.com/pricing.aspx](https://www.weatherapi.com/pricing.aspx)
* OpenWeather Pricing: [https://openweathermap.org/price](https://openweathermap.org/price)
* OpenWeather One Call 3.0: [https://openweathermap.org/api/one-call-3](https://openweathermap.org/api/one-call-3)

---

## نکات مهم برای تحویل پروژه

* پروژه بدون API Key اجرا می‌شود (Open-Meteo) → **API Keys: N/A**
* فایل‌های OpenLayers داخل پروژه قرار داده شده‌اند (`vendor/ol/`) و نیازی به CDN نیست.
* Screenshot و GIF داخل فولدر `media/` قرار گرفته و در همین README نمایش داده شده‌اند.