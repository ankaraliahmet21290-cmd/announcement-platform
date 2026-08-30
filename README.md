# Emlak İlan Platformu (Multi-Tenant)

Emlak ofisleri için çoklu kiracılı (multi-tenant) ilan yönetim ve public emlak sitesi platformu.

## Proje Yapısı

- `backend/` : Spring Boot 3.3, Java 21, Spring Security (JWT), Spring Data JPA, H2 In-Memory DB / PostgreSQL uyumlu
- `frontend-public/` : Müşterilere yönelik modern ilan portalı (React 18, TypeScript, Vite, TailwindCSS)
- `frontend-admin/` : Emlak ofisi ve platform yöneticileri için yönetim paneli (React 18, TypeScript, Vite, TailwindCSS)

## Hızlı Başlangıç

### 1. Backend'i Başlatma
```bash
cd backend
mvn spring-boot:run
```
- API Base URL: `http://localhost:8080`
- Health Check: `http://localhost:8080/api/health`
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:emlakdb`, Kullanıcı: `sa`, Şifre: boş)

### 2. Demo Giriş Bilgileri
- **Super Admin**: `admin@platform.com` / `Admin123!`
- **Korkmaz Emlak (Office Admin)**: `ofis@korkmaz.com` / `Ofis123!`
- **Korkmaz Emlak (Danışman)**: `ali.yilmaz@korkmaz.com` / `Agent123!`
- **Örnek Emlak (Office Admin)**: `ofis@ornek.com` / `Ofis123!`

### 3. Public Site Başlatma
```bash
cd frontend-public
npm install
npm run dev
```

### 4. Admin Panel Başlatma
```bash
cd frontend-admin
npm install
npm run dev
```
