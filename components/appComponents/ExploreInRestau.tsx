const DINING_EXPERIENCES = [
	{
		title: "Date Night",
		image:
			"https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "Family",
		image:
			"https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "Friends",
		image:
			"https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "Business Meeting",
		image:
			"https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "Celebration",
		image:
			"https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
	},
	{
		title: "Rooftop",
		image:
			"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
	},
];
const ExploreInRestau = () => {
  return (
    <>
<div className="mb-12">
	<div className="mb-6">
		<h2 className="text-2xl font-bold text-slate-900">
			Explore by Experience
		</h2>
		<p className="mt-1 text-slate-500">
			Find the perfect restaurant for every occasion.
		</p>
	</div>

	<div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
		{DINING_EXPERIENCES.map((item) => (
			<button
				key={item.title}
				type="button"
				className="group cursor-pointer relative h-52 overflow-hidden rounded-3xl"
			>
				<img
					src={item.image}
					alt={item.title}
					className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
				/>

				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

				<div className="absolute bottom-0 left-0 right-0 p-5">
					<h3 className="text-lg font-bold text-white">
						{item.title}
					</h3>
				</div>
			</button>
		))}
	</div>
</div>
    </>
  )
}

export default ExploreInRestau