# Mossa Time API

API لإدارة مدة انتهاء صلاحية UID المطور بواسطة Mossa

## نظرة عامة

هذا API مخصص لإدارة مدة انتهاء الصلاحية لمعرفات المستخدمين (UIDs) مع دعم للمدد المؤقتة والدائمة.

## المطور

تم تطوير هذا API بواسطة **Mossa**

## المميزات

- ✅ إضافة UID مع مدة انتهاء صلاحية مخصصة
- ✅ فحص الوقت المتبقي لـ UID
- ✅ حذف UID
- ✅ عرض جميع UIDs
- ✅ دعم UIDs دائمة (بدون انتهاء صلاحية)
- ✅ تنظيف تلقائي للـ UIDs منتهية الصلاحية
- ✅ دعم وحدات زمنية متعددة

## نشر على Vercel

1. ارفع المجلد على GitHub
2. اربط GitHub مع Vercel
3. انشر المشروع

## استخدام API

### الرابط الأساسي
```
https://your-project.vercel.app/api
```

### إضافة UID جديد
```
GET /api/add_uid?uid=USER_ID&time=VALUE&type=UNIT

# أمثلة:
/api/add_uid?uid=123456&time=7&type=days
/api/add_uid?uid=789012&time=30&type=minutes
/api/add_uid?uid=345678&permanent=true
```

### فحص الوقت المتبقي
```
GET /api/get_time/USER_ID

# مثال:
/api/get_time/123456
```

### حذف UID
```
GET /api/remove_uid?uid=USER_ID

# مثال:
/api/remove_uid?uid=123456
```

### عرض جميع UIDs
```
GET /api/list_uids
```

## وحدات الوقت المدعومة

- `seconds` - ثواني
- `minutes` - دقائق  
- `hours` - ساعات
- `days` - أيام
- `months` - شهور
- `years` - سنوات

## استجابة API

جميع الاستجابات تتضمن:
- `author: "Mossa"` - المطور
- بيانات مفصلة عن العملية
- رسائل خطأ واضحة

## أمثلة للاستجابات

### إضافة UID بنجاح
```json
{
  "success": true,
  "uid": "123456",
  "expires_at": "2024-08-13T17:13:00.000Z",
  "added_by": "Mossa",
  "message": "UID 123456 added successfully by Mossa"
}
```

### فحص الوقت المتبقي
```json
{
  "uid": "123456",
  "remaining_time": {
    "days": 6,
    "hours": 23,
    "minutes": 45,
    "seconds": 30
  },
  "expires_at": "2024-08-13T17:13:00.000Z",
  "added_by": "Mossa",
  "author": "Mossa"
}
```

## الدعم

تم تطوير هذا API بواسطة **Mossa** لإدارة Free Fire UIDs بكفاءة عالية.

## الترخيص

MIT License