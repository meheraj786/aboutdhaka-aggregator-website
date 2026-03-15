import FilterSidebar from "@/components/appComponents/FilterSidebar";
import ListingCard from "@/components/appComponents/ListingCard";
import Pagination from "@/components/appComponents/Pagination";


const dineData = [
  {
    title: 'The Great Kabab Factory',
    category: 'Indian',
    location: 'Gulshan 2, Dhaka',
    rating: 4.8,
    description: 'Authentic Indian kababs and biryanis in a fine dining setting.',
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Takeout',
    category: 'Fast Food',
    location: 'Dhanmondi, Dhaka',
    rating: 4.6,
    description: 'Famous for their burgers and shakes, a popular hangout spot.',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Izumi',
    category: 'Japanese',
    location: 'Gulshan, Dhaka',
    rating: 4.9,
    description: 'Premium Japanese cuisine with an emphasis on fresh ingredients.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Chillox',
    category: 'Fast Food',
    location: 'Banani, Dhaka',
    rating: 4.7,
    description: 'One of the most popular burger chains in the city.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
  },
];

export default function DinePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <main className="flex-grow py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Best Dining in Dhaka</h1>
              <p className="text-slate-500">Explore a wide variety of cuisines and flavors.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 font-medium">Sort by:</span>
              <select className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
                <option>Most Popular</option>
                <option>Rating: High to Low</option>
              </select>
            </div>
          </div>

          <div className="flex gap-10">
            <FilterSidebar />
            <div className="flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dineData.map((item) => (
                  <ListingCard key={item.title} {...item} />
                ))}
              </div>
              <Pagination />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
