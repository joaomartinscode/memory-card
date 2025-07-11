const Scoreboard = ({ score, bestScore, erros }) => {
	return (
		<div className="scoreboard">
			<p>Score: {score}</p>
			<p>Best Score: {bestScore}</p>
			<p>Erros: {erros} / 5</p>
		</div>
	);
};

export default Scoreboard;
