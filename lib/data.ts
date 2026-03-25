export interface Place {
	id: string;
	name: string;
	category: string;
	location: string;
	area: string;
	rating: number;
	reviews: number;
	description: string;
	longDescription: string;
	image: string;
	gallery: string[];
	openingHours: string;
	entryFee: string;
	contact: string;
	coordinates: { lat: number; lng: number };
	facilities: string[];
}

export interface ShoppingMall {
	id: string;
	name: string;
	location: string;
	area: string;
	rating: number;
	reviews: number;
	description: string;
	longDescription: string;
	image: string;
	gallery: string[];
	openingHours: string;
	contact: string;
	coordinates: { lat: number; lng: number };
	facilities: string[];
	shops: string[];
}

export const PLACES: Place[] = [
	{
		id: "ahsan-manzil",
		name: "Ahsan Manzil",
		category: "Museum",
		location: "Sadarghat, Dhaka",
		area: "Old Dhaka",
		rating: 4.8,
		reviews: 1240,
		description:
			"The official residential palace and seat of the Nawab of Dhaka, a stunning example of Indo-Saracenic Revival...",
		longDescription:
			"Ahsan Manzil was the official residential palace and seat of the Nawab of Dhaka. The building is situated at Kumartoli along the banks of the Buriganga River in Dhaka, Bangladesh. Construction was started in 1859 and was completed in 1872. It was constructed in the Indo-Saracenic Revival architecture. It has been designated as a national museum. It is one of the most significant architectural monuments of Bangladesh.",
		image: "https://picsum.photos/seed/ahsan/1200/800",
		gallery: [
			"https://picsum.photos/seed/ahsan1/800/600",
			"https://picsum.photos/seed/ahsan2/800/600",
			"https://picsum.photos/seed/ahsan3/800/600",
		],
		openingHours: "10:30 AM - 05:30 PM (Closed on Thursdays)",
		entryFee: "BDT 40 (Local), BDT 500 (Foreigners)",
		contact: "+880 2-7391122",
		coordinates: { lat: 23.7086, lng: 90.4061 },
		facilities: ["Guided Tours", "Photography Allowed", "Restrooms", "Garden"],
	},
	{
		id: "lalbagh-fort",
		name: "Lalbagh Fort",
		category: "Historical",
		location: "Lalbagh, Old Dhaka",
		area: "Old Dhaka",
		rating: 4.7,
		reviews: 2150,
		description:
			"An incomplete 17th-century Mughal fort complex that stands as a symbol of Dhaka's rich imperial history.",
		longDescription:
			"Lalbagh Fort is an incomplete 17th-century Mughal fort complex that stands before the Buriganga River in the southwestern part of Dhaka, Bangladesh. The construction was started in 1678 AD by Mughal Subahdar Muhammad Azam Shah, who was the son of Emperor Aurangzeb and later had become Mughal Emperor himself.",
		image: "https://picsum.photos/seed/lalbagh/1200/800",
		gallery: [
			"https://picsum.photos/seed/lal1/800/600",
			"https://picsum.photos/seed/lal2/800/600",
			"https://picsum.photos/seed/lal3/800/600",
		],
		openingHours: "09:00 AM - 05:00 PM",
		entryFee: "BDT 20 (Local), BDT 200 (Foreigners)",
		contact: "+880 2-9673056",
		coordinates: { lat: 23.7189, lng: 90.3882 },
		facilities: ["Museum", "Mosque", "Tomb of Pari Bibi", "Large Garden"],
	},
	{
		id: "hatirjheel",
		name: "Hatirjheel",
		category: "Park",
		location: "Gulshan/Tejgaon",
		area: "Gulshan",
		rating: 4.9,
		reviews: 5400,
		description:
			"A popular waterfront area for recreation, offering scenic boat rides and illuminated bridges at night.",
		longDescription:
			"Hatirjheel is a lakefront in Dhaka, Bangladesh that has been transformed into a major recreation area. Before 2013, it was a slum area that has been transformed into a modern transportation and recreation hub. It is now one of the most popular places for residents to visit in the evening.",
		image: "https://picsum.photos/seed/hatir/1200/800",
		gallery: [
			"https://picsum.photos/seed/hatir1/800/600",
			"https://picsum.photos/seed/hatir2/800/600",
			"https://picsum.photos/seed/hatir3/800/600",
		],
		openingHours: "Open 24 Hours",
		entryFee: "Free",
		contact: "N/A",
		coordinates: { lat: 23.7612, lng: 90.4001 },
		facilities: ["Water Taxi", "Amphitheater", "Walking Trails", "Food Courts"],
	},
];

export const SHOPPING_MALLS: ShoppingMall[] = [
	{
		id: "jamuna-future-park",
		name: "Jamuna Future Park",
		location: "KA-244, Kuril, Progoti Sharani, Dhaka",
		area: "Bashundhara",
		rating: 4.8,
		reviews: 15200,
		description:
			"The largest shopping mall in South Asia, offering a massive range of local and international brands.",
		longDescription:
			"Jamuna Future Park is the largest shopping mall in South Asia and the 24th largest in the world. It is located at Kuril, Dhaka, Bangladesh. It was opened in 2013. The mall has seven floors, and it houses hundreds of shops, a cineplex, a food court, and an indoor theme park. It is a one-stop destination for shopping and entertainment in Dhaka.",
		image: "https://picsum.photos/seed/jamuna/1200/800",
		gallery: [
			"https://picsum.photos/seed/jamuna1/800/600",
			"https://picsum.photos/seed/jamuna2/800/600",
			"https://picsum.photos/seed/jamuna3/800/600",
		],
		openingHours: "11:00 AM - 08:00 PM (Closed on Wednesdays)",
		contact: "+880 2-9823051",
		coordinates: { lat: 23.8135, lng: 90.4242 },
		facilities: [
			"Cineplex",
			"Indoor Theme Park",
			"Food Court",
			"Prayer Room",
			"Parking",
		],
		shops: ["Aarong", "Yellow", "Ecstasy", "Samsung", "Apple Store"],
	},
	{
		id: "bashundhara-city",
		name: "Bashundhara City Shopping Mall",
		location: "Panthapath, Dhaka",
		area: "Panthapath",
		rating: 4.7,
		reviews: 12400,
		description:
			"A premier shopping destination in the heart of Dhaka, known for its iconic architecture and variety.",
		longDescription:
			"Bashundhara City is a shopping mall in Dhaka, and the second largest shopping mall in Bangladesh. It was opened in 2004. The mall has 19 floors, including a basement. It features over 2,500 shops, a large food court, a cineplex, and a fitness center. It is one of the most visited shopping malls in the city.",
		image: "https://picsum.photos/seed/bashundhara/1200/800",
		gallery: [
			"https://picsum.photos/seed/bash1/800/600",
			"https://picsum.photos/seed/bash2/800/600",
			"https://picsum.photos/seed/bash3/800/600",
		],
		openingHours: "10:30 AM - 08:00 PM (Closed on Tuesdays)",
		contact: "+880 2-9111440",
		coordinates: { lat: 23.7508, lng: 90.3901 },
		facilities: [
			"Cineplex",
			"Gym",
			"Food Court",
			"Underground Parking",
			"Escalators",
		],
		shops: ["Cats Eye", "Richman", "Apex", "Bata", "Lotto"],
	},
	{
		id: "shimanto-sombor",
		name: "Shimanto Sombor",
		location: "Pilkhana, Dhanmondi, Dhaka",
		area: "Dhanmondi",
		rating: 4.5,
		reviews: 3200,
		description:
			"A modern shopping complex in Dhanmondi, popular for its food court and boutique shops.",
		longDescription:
			"Shimanto Sombor is a popular shopping mall located in the Dhanmondi area of Dhaka. It is known for its wide range of clothing boutiques, electronics shops, and a vibrant food court on the top floor. It is a favorite hangout spot for students and families living in Dhanmondi.",
		image: "https://picsum.photos/seed/shimanto/1200/800",
		gallery: [
			"https://picsum.photos/seed/shim1/800/600",
			"https://picsum.photos/seed/shim2/800/600",
			"https://picsum.photos/seed/shim3/800/600",
		],
		openingHours: "10:00 AM - 08:30 PM (Closed on Tuesdays)",
		contact: "+880 2-9670033",
		coordinates: { lat: 23.7341, lng: 90.3752 },
		facilities: ["Food Court", "Boutique Shops", "Parking", "ATM Services"],
		shops: ["Sailor", "Le Reve", "Gentle Park", "Artisti", "Infinity"],
	},
];
