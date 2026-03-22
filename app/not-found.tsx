"use client";

const NotFound = () => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
				color: "white",
				textAlign: "center",
			}}
		>
			<h1
				style={{
					fontSize: "4rem",
					margin: "0",
					animation: "bounceIn 1.5s ease-out",
				}}
			>
				404
			</h1>
			<p
				style={{
					fontSize: "1.5rem",
					margin: "20px 0",
					animation: "fadeInUp 2s ease-out 0.5s both",
				}}
			>
				Page Not Found
			</p>
			<h2
				style={{
					fontSize: "2rem",
					margin: "0",
					animation: "fadeInUp 2s ease-out 1s both",
				}}
			>
				Coming Soon
			</h2>
			<style jsx>{`
        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
		</div>
	);
};

export default NotFound;
