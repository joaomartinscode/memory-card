import Card from "./Card";
import "../styles/CardGrid.css";

const CardGrid = ({ cards, onCardClick }) => {
	return (
		<div className="card-grid">
			{cards.map((card) => (
				<Card key={card.uid} {...card} onClick={() => onCardClick(card.uid)} />
			))}
		</div>
	);
};

export default CardGrid;
