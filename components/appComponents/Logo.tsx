import Image from "next/image";
import Link from "next/link";
import image from "../../public/logo.png";

const Logo = () => {
	return (
		<Link href="/">
			<div className="flex items-center gap-2">
				<Image src={image} width={150} height={150} alt="logo" />
			</div>
		</Link>
	);
};

export default Logo;
