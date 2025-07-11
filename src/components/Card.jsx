const card = ({ title, image, onClick }) => {
	return (
		<div className="card" onClick={onClick}>
			<img src={image} alt={title} />
			<h3>{title.charAt(0).toUpperCase() + title.slice(1)}</h3>
		</div>
	);
};

export default card;
