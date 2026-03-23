import { ArrowRight } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import Image from "next/image";
import Link from "next/link";

const PET_SERVICES = [
  {
    id: "p1",
    name: "Central Pet Hospital",
    location: "Uttara, Dhaka",
    tag: "24/7 Emergency",
    tagColor: "bg-emerald-50 text-emerald-600",
    actionText: "Book Visit",
    image: "https://picsum.photos/seed/hospital/300/300",
  },
  {
    id: "p2",
    name: "Paws & Claws Grooming",
    location: "Banani, Dhaka",
    tag: "Premium Grooming",
    tagColor: "bg-blue-50 text-blue-600",
    actionText: "Book Slot",
    image: "https://picsum.photos/seed/grooming/300/300",
  },
  {
    id: "p3",
    name: "The Pet Shop",
    location: "Dhanmondi, Dhaka",
    tag: "Quality Supplies",
    tagColor: "bg-purple-50 text-purple-600",
    actionText: "Shop Now",
    image: "https://picsum.photos/seed/petshop/300/300",
  },
];

export function PetCareSection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <SectionHeader
        title="Vets & Pet Care"
        subtitle="Compassionate care for your furry friends"
        viewAllText="All Pet Services"
        viewAllHref="/pet-care"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PET_SERVICES.map((service) => (
          <div
            key={service.id}
            className="bg-white border border-slate-100 rounded-3xl p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
              <Image
                src={service.image}
                alt={service.name}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                {service.name}
              </h3>
              <p className="text-slate-500 text-sm mb-3">{service.location}</p>
              <div className="mb-4">
                <span
                  className={`px-3 py-1 ${service.tagColor} text-xs font-bold rounded-md`}
                >
                  {service.tag}
                </span>
              </div>
              <Link
                href="#"
                className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
              >
                {service.actionText} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
