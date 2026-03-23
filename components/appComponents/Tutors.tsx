import { Star } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const TUTORS = [
  {
    id: 't1',
    name: 'Prof. Anisur Rahman',
    experience: '20+ Years Experience',
    tags: ['Mathematics', 'Calculus'],
    rating: 4.9,
    reviews: 120,
    avatarBg: 'bg-[#334155]',
    avatarIcon: '👨‍🏫',
  },
  {
    id: 't2',
    name: 'Ms. Sarah Fariha',
    experience: 'IELTS Specialist',
    tags: ['English', 'IELTS'],
    rating: 5.0,
    reviews: 85,
    avatarBg: 'bg-[#2d6a4f]',
    avatarIcon: '👩‍🏫',
  },
  {
    id: 't3',
    name: 'Mr. Tanvir Ahmed',
    experience: 'Professional Guitarist',
    tags: ['Music', 'Classical'],
    rating: 4.8,
    reviews: 42,
    avatarBg: 'bg-[#e63946]',
    avatarIcon: '🎸',
  },
  {
    id: 't4',
    name: 'Dr. Nilufar Yasmin',
    experience: 'Academic Researcher',
    tags: ['Physics', 'Quantum'],
    rating: 4.9,
    reviews: 67,
    avatarBg: 'bg-[#1d3557]',
    avatarIcon: '🔬',
  },
];

export function TutorsSection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <SectionHeader
        title="Top Rated Teachers & Tutors"
        subtitle="Expert educators for every subject"
        viewAllText="View All Tutors"
        viewAllHref="/tutors"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TUTORS.map((tutor) => (
          <div
            key={tutor.id}
            className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start"
          >
            <div className={`w-20 h-20 rounded-full ${tutor.avatarBg} flex items-center justify-center text-3xl mb-6`}>
              {tutor.avatarIcon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">{tutor.name}</h3>
            <p className="text-slate-500 text-sm mb-4">{tutor.experience}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {tutor.tags.map((tag) => (
                <span
                  key={`${tutor.id}-${tag}`}
                  className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 mt-auto">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-slate-900">{tutor.rating.toFixed(1)}</span>
              <span className="text-slate-400 text-sm ml-1">({tutor.reviews} reviews)</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
