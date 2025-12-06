# 🚀 Guía Rápida de Despliegue

## ✅ Estado Actual: FRONTEND 100% LISTO

Todas las URLs hardcodeadas han sido actualizadas. El frontend está preparado para desplegar a Vercel.

---

## 📋 Pasos para Desplegar (En Orden)

### PASO 1: Desplegar Backend a Railway ⚙️

1. Ve a [Railway.app](https://railway.app)
2. Crea nuevo proyecto desde GitHub
3. Selecciona el repositorio `SistemaAerolinea`
4. Configura el directorio raíz: `backend_aerolinea`
5. Railway detectará automáticamente el `package.json`
6. Agrega las variables de entorno en Railway:
   ```
   DB_HOST=b4lwhtahnwflpoatj7lz-mysql.services.clever-cloud.com
   DB_PORT=3306
   DB_USER=ugutmdv1k2g5iwko
   DB_PASSWORD=[tu-contraseña]
   DB_NAME=b4lwhtahnwflpoatj7lz
   NODE_ENV=production
   ```
7. Despliega y **copia la URL generada** (ej: `https://tu-app.railway.app`)

### PASO 2: Desplegar Frontend a Vercel 🌐

1. Ve a [Vercel.com](https://vercel.com)
2. Importa proyecto desde GitHub
3. Selecciona el repositorio `SistemaAerolinea`
4. Configura:
   - **Root Directory:** `frontend_aereolinea`
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
5. **IMPORTANTE:** Agrega variable de entorno:
   ```
   NEXT_PUBLIC_API_URL = https://tu-app.railway.app
   ```
   ⚠️ Usa la URL de Railway del PASO 1 (sin `/api/v1` al final)
6. Despliega
7. **Copia la URL de Vercel** (ej: `https://tu-app.vercel.app`)

### PASO 3: Actualizar CORS en Backend 🔒

1. Edita `backend_aerolinea/src/middleware/cors.js`
2. Agrega la URL de Vercel:
   ```javascript
   const allowedOrigins = [
     'http://localhost:3000',
     'https://tu-app.vercel.app'  // ← AGREGAR ESTA
   ];
   ```
3. Haz commit y push - Railway se redesplegarán automáticamente

### PASO 4: Configurar Cookies para Producción 🍪

1. Edita `backend_aerolinea/src/controllers/loginController.js`
2. Busca la configuración de cookies y actualiza:
   ```javascript
   res.cookie('refreshToken', refreshToken, {
     httpOnly: true,
     secure: true,              // ← CAMBIAR a true
     sameSite: 'none',         // ← CAMBIAR a 'none'
     maxAge: 7 * 24 * 60 * 60 * 1000,
     path: '/'
   });
   ```
3. Repite para todas las configuraciones de cookies en el archivo
4. Haz commit y push

---

## ⚠️ BLOCKER: Sistema de Archivos

### ⚠️ CRÍTICO: Railway No Guarda Archivos

El directorio `backend_aerolinea/uploads/` **NO FUNCIONARÁ** en Railway porque:
- Railway reinicia contenedores constantemente
- Los archivos se pierden en cada redeploy
- No hay almacenamiento persistente

### ✅ Solución: Cloudinary (Recomendado)

1. Crea cuenta en [Cloudinary.com](https://cloudinary.com) (gratis)
2. Instala dependencias:
   ```bash
   cd backend_aerolinea
   npm install cloudinary multer-storage-cloudinary
   ```
3. Actualiza `backend_aerolinea/src/middleware/multerConfig.js`:
   ```javascript
   const cloudinary = require('cloudinary').v2;
   const { CloudinaryStorage } = require('multer-storage-cloudinary');

   cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET
   });

   const storage = new CloudinaryStorage({
     cloudinary: cloudinary,
     params: {
       folder: 'aerolinea/profiles',
       allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
       transformation: [{ width: 500, height: 500, crop: 'limit' }]
     }
   });

   const upload = multer({ storage: storage });
   ```
4. Agrega variables en Railway:
   ```
   CLOUDINARY_CLOUD_NAME=tu-cloud-name
   CLOUDINARY_API_KEY=tu-api-key
   CLOUDINARY_API_SECRET=tu-api-secret
   ```

---

## ✅ Checklist de Verificación

Antes de desplegar, verifica:

- [ ] Base de datos MySQL en Clever Cloud funcionando
- [ ] Credenciales de BD correctas
- [ ] Backend desplegado en Railway
- [ ] URL de Railway copiada
- [ ] Frontend desplegado en Vercel
- [ ] Variable `NEXT_PUBLIC_API_URL` configurada en Vercel
- [ ] URL de Vercel agregada a CORS en backend
- [ ] Cookies configuradas para producción (secure: true, sameSite: 'none')
- [ ] Sistema de archivos migrado a Cloudinary
- [ ] Variables de Cloudinary en Railway
- [ ] Probado login y autenticación
- [ ] Probado subida de imágenes de perfil
- [ ] Probado búsqueda de vuelos
- [ ] Probado sistema de reservas

---

## 🔍 Cómo Verificar que Funciona

### Test de Producción:

1. **Frontend:**
   - Abre la URL de Vercel en el navegador
   - Verifica que cargue la página principal
   - Busca vuelos disponibles
   - Ve la consola del navegador - NO debe haber errores de CORS

2. **Backend:**
   - Abre `https://tu-app.railway.app/api/v1/ciudades`
   - Debe devolver JSON con ciudades
   - Si da error, revisa los logs en Railway

3. **Autenticación:**
   - Intenta hacer login
   - Verifica que las cookies se establezcan
   - Intenta acceder a "Mi Cuenta"
   - Si no funciona, revisa configuración de cookies

4. **Imágenes:**
   - Sube una imagen de perfil
   - Verifica que se vea en "Mi Cuenta"
   - Si no funciona, verifica Cloudinary

---

## 🐛 Solución de Problemas Comunes

### Error: "Failed to fetch"
- **Causa:** URL de backend incorrecta o backend caído
- **Solución:** Verifica que Railway esté running y la URL sea correcta

### Error: CORS
- **Causa:** URL de Vercel no agregada a allowedOrigins
- **Solución:** Actualiza `cors.js` y redespliega backend

### Error: "No autorizado" después de login
- **Causa:** Cookies no se están enviando
- **Solución:** Verifica `secure: true` y `sameSite: 'none'` en cookies

### Imágenes no se ven
- **Causa:** Sistema de archivos local en Railway (no persiste)
- **Solución:** Migra a Cloudinary (ver arriba)

### Error: "Database connection failed"
- **Causa:** Credenciales incorrectas o BD apagada
- **Solución:** Verifica variables de entorno en Railway

---

## 📞 Recursos de Ayuda

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Next.js Env Variables:** https://nextjs.org/docs/basic-features/environment-variables

---

## 🎉 ¡Listo!

Cuando completes todos los pasos, tu aplicación estará 100% funcional en producción:
- ✅ Frontend en Vercel
- ✅ Backend en Railway
- ✅ Base de datos en Clever Cloud
- ✅ Archivos en Cloudinary
- ✅ Autenticación funcionando
- ✅ Sistema de reservas operativo

**¡Tu aerolínea está lista para volar! ✈️**
