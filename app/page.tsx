import { BlogsSection } from "@/components/appComponents/Blogs";
import Categories from "@/components/appComponents/Categories";
import { Doctors } from "@/components/appComponents/Doctor";
import { FreelancersSection } from "@/components/appComponents/Freelancers";
import Hero from "@/components/appComponents/Hero";
import HospitalsAndRestaurants from "@/components/appComponents/HospitalsAndResturents";
import { ShoppingMallsSection } from "@/components/appComponents/Malls";
import { PCBuilderSection } from "@/components/appComponents/PcBuilder";
import { PetCareSection } from "@/components/appComponents/PetCare";
import { RentalsSection } from "@/components/appComponents/Rental";
import TravelPlaces from "@/components/appComponents/TravelPlaces";
import { TutorsSection } from "@/components/appComponents/Tutors";

export default function Home() {
	return (
		<>
			<Hero />
			<Categories />
			<TravelPlaces />
			<HospitalsAndRestaurants />
			<Doctors />
			<FreelancersSection/>
			<ShoppingMallsSection/>
			<PCBuilderSection/>
			<PetCareSection/>
			<RentalsSection/>
			<TutorsSection/>
			<BlogsSection/>
		</>
	);
}
