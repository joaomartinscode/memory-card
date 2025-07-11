import "../styles/Cards.css";

const Card = ({ name, image, flipped, matched, onClick }) => {
	return (
		<div
			className={`card ${flipped || matched ? "flipped" : ""}`}
			onClick={onClick}
		>
			<div className="card-inner">
				<div className="card-front">❓</div>
				<div className="card-back">
					<img src={image} alt={name} />
					<h4>{name}</h4>
				</div>
			</div>
		</div>
	);
};

export default Card;
