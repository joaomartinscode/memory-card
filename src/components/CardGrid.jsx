import Card from "./Card";

const CardGrid = ({ cards, onCardClick }) => {
	return (
		<div className="card-grid">
			{cards.map((Card) => (
				<card
					key={Card.id}
					title={Card.title}
					image={Card.image}
					onClick={() => onCardClick(Card.id)}
				/>
			))}
		</div>
	);
};

export default CardGrid;
