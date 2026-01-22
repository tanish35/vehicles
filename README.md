# 🚗 Vehicle Trends

A Next.js application for exploring and analyzing electric vehicle registration data. View trends, search by county, and analyze vehicle statistics with an interactive dashboard.

## 🌐 Live Demo

**[vehicle-trends.vercel.app](https://vehicle-trends.vercel.app)**

## ✨ Features

- **Dashboard Overview** - Summary statistics and charts of vehicle registrations
- **County Lookup** - Search vehicles by county with pagination
- **Trends Analysis** - Visualize vehicle registration trends over time
- **Make/Model Explorer** - Browse vehicles by manufacturer and model
- **Real-time Data** - Powered by MongoDB with Redis caching for performance

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Database**: [MongoDB](https://www.mongodb.com/) with [Prisma ORM](https://www.prisma.io/)
- **Caching**: [Upstash Redis](https://upstash.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Deployment**: [Vercel](https://vercel.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn
- MongoDB database
- Upstash Redis account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/tanish35/vehicles.git
   cd vehicles
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Copy the example environment file and fill in your values:

   ```bash
   cp .env.example .env
   ```

   Required environment variables:

   | Variable | Description |
   |----------|-------------|
   | `DATABASE_URL` | MongoDB connection string |
   | `UPSTASH_REDIS_REST_URL` | Upstash Redis REST API URL |
   | `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST API token |

4. **Generate Prisma client**

   ```bash
   pnpm prisma generate
   ```

5. **Run the development server**

   ```bash
   pnpm dev
   ```

6. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
vehicles/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── v1/vehicles/   # Vehicle API endpoints
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── dashboard/         # Dashboard-specific components
│   └── ui/               # Reusable UI components
├── lib/                   # Utilities and helpers
│   ├── api.ts            # API client functions
│   ├── db.ts             # Prisma database client
│   ├── redis.ts          # Redis caching utilities
│   └── types.ts          # TypeScript types
├── prisma/               # Prisma schema and migrations
└── public/               # Static assets
```

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/vehicles/summary` | GET | Get summary statistics |
| `/api/v1/vehicles/trends` | GET | Get trend data over time |
| `/api/v1/vehicles/analyze` | POST | Analyze vehicle data |
| `/api/v1/vehicles/county/[name]` | GET | Get vehicles by county |
| `/api/v1/vehicles/make/[make]/model` | GET | Get models by make |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
