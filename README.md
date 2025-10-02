# FORMOTEX Inventory API — MongoDB + Mongoose + TypeScript

## Requisitos previos
- Node.js 18+
- MongoDB en ejecución local 
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
```
npm install
npm run seed   # crea usuarios y datos base
npm run dev    # levanta el servidor 
```


### Auth
- `POST /api/auth/login` → { email, password } → { token, user }
- `POST /api/auth/register` *(ADMIN)*

### Users
- `GET /api/users/me` *(token)*
- `GET /api/users` *(ADMIN)*


### Locations
- `GET /api/locations` *(token)*
- `POST /api/locations` *(ADMIN)*


## Pruebas rápidas
1. Login admin
```bash
POST http://localhost:4000/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"admin@formotex.local","password":"Admin123!"}'
```
2. Crear ubicación (ADMIN)
```bash
POST http://localhost:4000/api/locations   -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json"   -d '{"code":"BR-01","name":"Branch Office"}'
```
3. Crear equipo (ADMIN)
```bash
 POST http://localhost:4000/api/equipment   -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json"   -d '{"assetTag":"NB-0002","serialNumber":"SN-B-002","brand":"Lenovo","model":"T14","category":"Laptop","status":"IN_STOCK"}'
```


