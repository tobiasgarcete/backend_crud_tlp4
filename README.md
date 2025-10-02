# FORMOTEX Inventory API — MongoDB + Mongoose + TypeScript

Implementación equivalente a la versión PostgreSQL, ahora con **MongoDB (Mongoose)**.

## Stack
- **Node.js + Express** con **TypeScript**
- **MongoDB** con **Mongoose**
- **JWT** (roles ADMIN/USER)
- **express-validator** para validaciones
- Arquitectura por **capas**: routes → controllers → services → models (+ middlewares, utils)

## Requisitos previos
- Node.js 18+
- MongoDB en ejecución local (o Atlas)
- PNPM/NPM/Yarn

## Variables de entorno
Crea `.env` con base en `.env.example`:
```env
MONGODB_URI="mongodb://localhost:27017/formotex"
PORT=4000
JWT_SECRET="supersecret_change_me"
JWT_EXPIRES_IN="1d"
BCRYPT_SALT_ROUNDS=10
```

## Instalación y ejecución
```bash
npm install
npm run seed   # crea usuarios y datos base
npm run dev    # levanta el servidor en http://localhost:4000
```

## Endpoints
Igual a la versión previa (prefijo `/api/...`). Autenticación con Bearer token.

### Auth
- `POST /api/auth/login` → { email, password } → { token, user }
- `POST /api/auth/register` *(ADMIN)*

### Users
- `GET /api/users/me` *(token)*
- `GET /api/users` *(ADMIN)*

### Equipment
- `GET /api/equipment` *(token)* → filtros: `q`, `status`, `page`, `pageSize`, `assignedToId`
- `GET /api/equipment/:id` *(token)*
- `GET /api/equipment/:id/history` *(token)*
- `POST /api/equipment` *(ADMIN)*
- `PUT /api/equipment/:id` *(ADMIN)*
- `DELETE /api/equipment/:id` *(ADMIN)*
- `POST /api/equipment/:id/assign` *(ADMIN)* → { userId }
- `POST /api/equipment/:id/transfer` *(ADMIN)* → { locationId }

### Locations
- `GET /api/locations` *(token)*
- `POST /api/locations` *(ADMIN)*

## Modelos
- `User`: `{ email(unique), passwordHash, fullName, role }`
- `Location`: `{ code(unique), name, notes? }`
- `Equipment`: `{ assetTag(unique), serialNumber(unique), brand, model, category, status enum, assignedToId?, locationId?, lastSeenAt }`
- `StatusHistory`: `{ equipmentId, fromStatus?, toStatus, note, changedById, changedAt }`

> Unicidad por **índices** (`unique: true`) + chequeos en servicio para errores claros (409).

## Decisiones técnicas
- **Mongoose** permite modelar relaciones mediante referencias (`ref`) y `populate`, manteniendo el mismo dominio de la versión SQL.
- **Servicios** centralizan la lógica y las validaciones de negocio (incluida unicidad a nivel app).
- **Historial** asegura trazabilidad mínima de cambios.

## Pruebas rápidas
1. Login admin
```bash
curl -X POST http://localhost:4000/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"admin@formotex.local","password":"Admin123!"}'
```
2. Crear ubicación (ADMIN)
```bash
curl -X POST http://localhost:4000/api/locations   -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json"   -d '{"code":"BR-01","name":"Branch Office"}'
```
3. Crear equipo (ADMIN)
```bash
curl -X POST http://localhost:4000/api/equipment   -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json"   -d '{"assetTag":"NB-0002","serialNumber":"SN-B-002","brand":"Lenovo","model":"T14","category":"Laptop","status":"IN_STOCK"}'
```

## Notas
- Puedes habilitar **scope por rol USER** para que vea solo sus equipos filtrando `assignedToId = req.user.id` en `listEquipment` cuando `req.user.role === 'USER'`.
- Agrega **índices compuestos** si necesitas búsquedas más rápidas por `locationId`, `category`, etc.

---
Esta base cumple los requisitos con MongoDB. Puedes extenderla con rate‑limiting, tests, refresh tokens, etc.
