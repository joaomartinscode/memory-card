import { useEffect, useState } from "react";
import Scoreboard from "./components/Scoreboard";
import CardGrid from "./components/CardGrid";
import "./styles/App.css";
import Card from "./components/Card";

function App() {
	const [cards, setCards] = useState([]);
	const [flippedCards, setFlippedCards] = useState([]);
	const [lockBoard, setLockBoard] = useState(false);
	const [score, setScore] = useState(0);
	const [bestScore, setBestScore] = useState(0);
	const [erros, setErros] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const [victory, setVictory] = useState(false);

	// Fetch and prepare card data
	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=5");
			const data = await res.json();
			const results = await Promise.all(
				data.results.map((pokemon) =>
					fetch(pokemon.url).then((res) => res.json())
				)
			);

			// Format and duplicate cards
			let formatted = results.map((p) => ({
				id: p.id,
				name: p.name,
				image: p.sprites.front_default,
				matched: false,
			}));

			// Duplicate for pairs
			formatted = [...formatted, ...formatted].map((card, i) => ({
				...card,
				uid: i + "-" + card.id, // unique instance id
				flipped: false,
			}));

			setCards(shuffleArray(formatted));
			setScore(0);
		};

		fetchData();
	}, []);

	const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

	const handleCardClick = (uid) => {
		if (lockBoard || gameOver || victory) return;

		const clickedCard = cards.find((c) => c.uid === uid);
		if (clickedCard.flipped || clickedCard.matched) return;

		// Flip card
		const newCards = cards.map((c) =>
			c.uid === uid ? { ...c, flipped: true } : c
		);
		setCards(newCards);

		const newFlipped = [...flippedCards, clickedCard];
		setFlippedCards(newFlipped);

		if (newFlipped.length === 2) {
			setLockBoard(true);

			setTimeout(() => {
				const [card1, card2] = newFlipped;
				let updatedCards;

				if (card1.name === card2.name) {
					// Match found
					updatedCards = cards.map((c) =>
						c.name === card1.name ? { ...c, matched: true } : c
					);
					setScore((s) => {
						const newScore = s + 1;
						if (newScore > bestScore) setBestScore(newScore);
						return newScore;
					});

					const allMatched = updatedCards.every(
						(c) => c.matched || c.uid === card1.uid || c.uid === card2.uid
					);
					if (allMatched) setVictory(true);
				} else {
					// Not a match
					updatedCards = cards.map((c) =>
						c.uid === card1.uid || c.uid === card2.uid
							? { ...c, flipped: false }
							: c
					);

					setErros((e) => {
						const newErros = e + 1;
						if (newErros >= 5) {
							setGameOver(true);
						}
						return newErros;
					});
				}

				setCards(updatedCards);
				setFlippedCards([]);
				setLockBoard(false);
			}, 1000);
		}
	};

	const resetGame = () => {
		setErros(0);
		setGameOver(false);
		setVictory(false);
		setScore(0);
		setFlippedCards([]);

		setCards((oldCards) => {
			const resetCards = oldCards.map((c) => ({
				...c,
				flipped: false,
				matched: false,
			}));
			return shuffleArray(resetCards);
		});
	};

	return (
		<div className="App">
			<h1>Pokémon Memory Match</h1>
			<Scoreboard score={score} bestScore={bestScore} erros={erros} />

			{victory && (
				<div className="message victory">
					🎉 Congratulations, you win! 🎉
					<button onClick={resetGame}>Tentar novamente</button>
				</div>
			)}

			{gameOver && (
				<div className="message gameover">
					💥 Game Over! You hit 5 errors.
					<button onClick={resetGame}>Tentar novamente</button>
				</div>
			)}

			{!victory && !gameOver && (
				<CardGrid cards={cards} onCardClick={handleCardClick} />
			)}
		</div>
	);
}

export default App;
