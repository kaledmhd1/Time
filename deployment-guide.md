# دليل نشر Mossa Time API على Vercel

## خطوات النشر

### 1. تحضير المشروع
```bash
# إنشاء مستودع Git جديد
git init
git add .
git commit -m "Initial commit - Mossa Time API"
```

### 2. رفع على GitHub
1. إنشاء مستودع جديد على GitHub
2. ربط المشروع المحلي بـ GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/mossa-time-api.git
git push -u origin main
```

### 3. نشر على Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخول بحساب GitHub
3. اختر "New Project"
4. اختر مستودع `mossa-time-api`
5. اتبع الإعدادات التالية:
   - **Framework Preset**: Other
   - **Build Command**: (اتركه فارغ)
   - **Output Directory**: (اتركه فارغ)
   - **Install Command**: npm install

### 4. تكوين Vercel
- سيتم نشر API تلقائياً
- الرابط سيكون: `https://mossa-time-api.vercel.app`

### 5. اختبار API
```bash
# اختبار الصفحة الرئيسية
curl https://mossa-time-api.vercel.app/api

# إضافة UID
curl "https://mossa-time-api.vercel.app/api/add_uid?uid=123456&time=7&type=days"

# فحص الوقت
curl https://mossa-time-api.vercel.app/api/get_time/123456
```

## روابط API النهائية

- **الصفحة الرئيسية**: `https://YOUR_PROJECT.vercel.app/api`
- **إضافة UID**: `https://YOUR_PROJECT.vercel.app/api/add_uid?uid=ID&time=VALUE&type=UNIT`
- **فحص الوقت**: `https://YOUR_PROJECT.vercel.app/api/get_time/ID`
- **حذف UID**: `https://YOUR_PROJECT.vercel.app/api/remove_uid?uid=ID`
- **عرض جميع UIDs**: `https://YOUR_PROJECT.vercel.app/api/list_uids`

## مميزات API

✅ تم تطويره بواسطة **Mossa**  
✅ إدارة كاملة لـ UIDs  
✅ دعم المدد المؤقتة والدائمة  
✅ تنظيف تلقائي للبيانات منتهية الصلاحية  
✅ استجابات JSON مفصلة  
✅ معالجة أخطاء شاملة  

## الدعم الفني

API مطور بواسطة **Mossa** لإدارة Free Fire UIDs بكفاءة عالية.