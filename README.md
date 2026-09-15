# About Dhaka

About Dhaka is a modern city discovery and digital directory platform designed to help residents, visitors, and businesses navigate Dhaka more easily. The mission is simple: make Dhaka smarter, more connected, and more digital by bringing essential local information into a single, user-friendly experience.

From finding hospitals and doctors to locating bus routes, restaurants, places, pet care, and tech services, About Dhaka is built as a local digital ecosystem for one of the busiest cities in the world.

## Why this project exists

Dhaka is a fast-growing megacity with a huge need for digital access to city information. People often struggle to find reliable, centralized information about:

- medical care and specialists
- transportation and bus routes
- local attractions and city places
- dining and lifestyle services
- everyday local services and businesses
- digital guidance for smart city living

This project aims to modernize how people explore, access, and interact with Dhaka by creating a digital city guide that is practical, searchable, and community-driven.

## Core vision

We want to transform Dhaka into a more digital, informed, and connected city by building a platform that:

- centralizes city information in one place
- makes local discovery faster and smarter
- improves access to healthcare, transit, and essential services
- supports visitors and residents with local guidance
- encourages modern digital experiences for urban life

## Platform overview

About Dhaka is a Next.js-based digital city platform with an intuitive front-end, city service directories, admin management tools, AI-powered discovery, and dynamic local data handling.

## Features

### 1. City discovery and directory
- Explore places and attractions across Dhaka
- Discover restaurants and dining experiences
- Browse hospitals, clinics, and medical facilities
- Find doctors and specialist departments
- Search veterinary clinics and pet care services
- Access local business and service categories
- View city-related blog content and local stories

### 2. Smart public transport support
- Bus route information and stop discovery
- Nearest bus stop lookup
- Route-aware city navigation assistance
- Travel planning for residents and visitors

### 3. AI-powered city assistant
- Ask Dhaka AI for local recommendations and city information
- Natural language search for hospitals, doctors, restaurants, places, and transport
- Smart intent detection for fast, contextual city queries
- Built with AI tooling for better service discovery

### 4. PC builder and tech services
- Personalized PC component suggestion experience
- Support for build planning based on usage and requirements
- Digital service discovery for local tech users and buyers

### 5. Admin dashboard and content management
- Manage areas, hospitals, doctors, restaurants, shops, blogs, and bus-related data
- Secure admin login flow
- CRUD-based management for local listings and content
- Dashboard for operational control of the platform

### 6. Local blog and information publishing
- Create and publish city stories, guides, and updates
- Browse category-based content
- Support for editorial and local information sharing

### 7. Search, filtering, and browsing experience
- Category-based navigation
- Search and filter by area, service type, category, and more
- Responsive design for mobile and desktop users

### 8. Modern web experience
- Fast Next.js application architecture
- Tailwind-based interface design
- Query caching and modern client-side data fetching
- SEO-friendly metadata and structured website configuration

## Project purpose in one sentence

About Dhaka is building a digital foundation for Dhaka city by turning scattered local information into a modern, searchable, and accessible urban platform.

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- MongoDB + Mongoose
- TanStack Query
- Shadcn-style UI components
- Groq/OpenAI-based AI assistant integration
- Leaflet and map-related utilities
- Cloudinary for media handling

## Architecture highlights

This project combines:

- a public-facing city portal for users
- a service directory with data-heavy listings
- an AI assistant for local queries
- an admin dashboard for publishing and managing information
- a backend data layer using MongoDB and Mongoose

## Prerequisites

Before running the app, make sure you have:

- Node.js 20 or newer
- pnpm installed
- MongoDB running or a reachable MongoDB connection string
- API keys for AI and media integrations if you want the full feature set enabled

## Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/aboutdhaka-aggregator-website.git
cd aboutdhaka-aggregator-website
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

Create a `.env.local` file in the project root and add the following variables:

```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_secure_admin_password
GROQ_API_KEY=your_groq_api_key
CLODINARY_CLOUD_NAME=your_cloud_name
CLODINARY_API_KEY=your_cloudinary_api_key
CLODINARY_API_SECRET=your_cloudinary_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Run the app locally

```bash
pnpm dev
```

Then open:

```text
http://localhost:3000
```

## Available scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm format
pnpm seed
```

## Main app sections

The app includes pages for:

- home
- places
- restaurants
- hospitals
- doctors
- vets
- bus routes and stops
- pc builder
- blogs
- dashboard/admin management
- AI assistant

## Example use cases

- A person wants to find the nearest hospital in a specific area
- A visitor wants to find famous places in Dhaka
- A commuter wants bus route and nearest bus stop information
- A pet owner wants a veterinary clinic nearby
- A user wants local food recommendations in a particular area
- A business or admin wants to publish a blog or service listing
- A user asks the AI assistant: “Which cardiologist is near Dhanmondi?”

## Development philosophy

The team behind About Dhaka is focused on building city-access tools that are:

- practical for everyday use
- locally relevant
- easy to navigate
- digital-first
- useful for both citizens and visitors

## Future roadmap

Planned improvements may include:

- real-time bus and transit data integration
- richer user-generated reviews
- map-based city navigation
- more AI-powered local recommendations
- better search relevance and personalization
- expanded business and service listings
- stronger civic and digital government information modules

## Contributing

Contributions are welcome. If you want to improve the platform, expand local coverage, or add features for Dhaka city discovery, please open an issue or submit a pull request.

## License

This project is currently distributed under the project’s chosen repository license. Please check the repository for the exact license terms.

## Closing statement

About Dhaka is more than a directory — it is a step toward building a smarter, more connected Dhaka. By combining local information, AI support, and modern web technology, the platform helps bring the city into the digital age.

Together, we can make Dhaka more accessible, informed, and future-ready.

