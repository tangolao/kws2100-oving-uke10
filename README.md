# KWS2100 Map Project

This project shows schools and addresses on a map using OpenLayers, Hono, and PostgreSQL/PostGIS.

## Features

- Show all schools on the map (blue points)
- Show addresses near schools (green points)
- Click on the map to find the nearest school (red point)
- Show a popup with school name and distance

## Technologies

- React
- TypeScript
- OpenLayers
- Hono
- PostgreSQL / PostGIS

## How to run

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm start
```

### Environment (.env)

```env
DATABASE_URL=your_database_url
```
