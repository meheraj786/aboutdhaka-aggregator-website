import FilterSidebar from "@/components/appComponents/FilterSidebar";
import ListingCard from "@/components/appComponents/ListingCard";
import Pagination from "@/components/appComponents/Pagination";


const mallsData = [
  {
    title: 'Jamuna Future Park',
    category: 'Shopping',
    location: 'Kuril, Dhaka',
    rating: 4.8,
    description: 'The largest shopping mall in South Asia with a wide range of brands.',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Bashundhara City',
    category: 'Shopping',
    location: 'Panthapath, Dhaka',
    rating: 4.7,
    description: 'A major shopping destination with a cinema hall and food court.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Shimanto Square',
    category: 'Shopping',
    location: 'Dhanmondi, Dhaka',
    rating: 4.5,
    description: 'A popular shopping mall with a variety of local and international brands.',
    image: 'https://images.unsplash.com/photo-1580793241553-e9f1cce181af?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Police Plaza Concord',
    category: 'Shopping',
    location: 'Gulshan 1, Dhaka',
    rating: 4.6,
    description: 'A modern shopping complex with high-end retail stores.',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80&w=800',
  },
];

export default function MallsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <main className="flex-grow py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Shopping Malls in Dhaka</h1>
              <p className="text-slate-500">Find everything you need at the best shopping destinations.</p>
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
                {mallsData.map((item) => (
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
