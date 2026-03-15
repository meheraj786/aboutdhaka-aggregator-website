import Categories from "@/components/appComponents/Categories";
import Hero from "@/components/appComponents/Hero";
import HospitalsAndRestaurants from "@/components/appComponents/HospitalsAndResturents";
import TravelPlaces from "@/components/appComponents/TravelPlaces";

export default function Home() {
	return (
		<>
			<Hero />
			<Categories />
			<TravelPlaces />
			<HospitalsAndRestaurants />
		</>
	);
}
