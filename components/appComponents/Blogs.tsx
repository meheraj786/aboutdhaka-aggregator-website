import Image from 'next/image';
import { Button } from '../ui/button';

const CATEGORIES = ['All Stories', 'Food & Dining', 'Travel', 'Culture', 'Tech Scene', 'Lifestyle'];

const STORIES = [
  {
    id: 'st1',
    title: "The Ultimate Guide to Old Dhaka's Street Food",
    excerpt: "From Haji Biryani to Beauty Lassi, explore the flavors that define the historical heart of the city.",
    category: 'FOOD',
    categoryColor: 'bg-blue-50 text-blue-600',
    author: 'Asif Rahman',
    readTime: '8 min read',
    image: 'https://picsum.photos/seed/burger/800/500',
  },
  {
    id: 'st2',
    title: "How the Metro Rail is Changing Dhaka's Daily Life",
    excerpt: "A deep dive into the technological leap in Dhaka's transportation and its impact on urban living.",
    category: 'TECH',
    categoryColor: 'bg-blue-50 text-blue-600',
    author: 'Sarah Islam',
    readTime: '6 min read',
    image: 'https://picsum.photos/seed/metro/800/500',
  },
  {
    id: 'st3',
    title: "Hidden Art Galleries You Must Visit in Dhanmondi",
    excerpt: "Exploring the contemporary art scene that flourishes in the quiet alleys of residential Dhaka.",
    category: 'CULTURE',
    categoryColor: 'bg-blue-50 text-blue-600',
    author: 'Nilufar Yasmin',
    readTime: '12 min read',
    image: 'https://picsum.photos/seed/gallery/800/500',
  },
  {
    id: 'st4',
    title: "Shopping Sustainably: The Rise of Dhaka's Eco-Shops",
    excerpt: "How conscious consumers are finding green alternatives in a bustling metropolis.",
    category: 'LIFESTYLE',
    categoryColor: 'bg-blue-50 text-blue-600',
    author: 'Tanvir Ahmed',
    readTime: '5 min read',
    image: 'https://picsum.photos/seed/eco/800/500',
  },
];

export function BlogsSection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 leading-tight">City Stories & Guides</h2>
          <p className="text-slate-500 mt-2 text-lg">Curated insights into life, food, and culture in the heart of Bangladesh.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat, idx) => (
            <button
              type="button"
              key={`cat-${cat}`}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                idx === 0 ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {STORIES.map((story) => (
          <div
            key={story.id}
            className="group bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 left-6">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-[10px] font-bold rounded-md tracking-widest uppercase">
                  {story.category}
                </span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                {story.title}
              </h3>
              <p className="text-slate-500 text-base leading-relaxed mb-8">
                {story.excerpt}
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden relative">
                    <Image
                      src={`https://picsum.photos/seed/${story.author}/100/100`}
                      alt={story.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-900">{story.author}</span>
                </div>
                <span className="text-xs text-slate-400 font-medium tracking-tight">
                  {story.readTime}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='text-center'>
        
      <Button className="mt-12 px-10 py-5 text-md font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full mx-auto">See All Stories</Button>
      </div>
    </section>
  );
}
