import React, { useState, useEffect } from 'react';
import { createActor } from "../../declarations/esports-rating-backend"; // Ensure this path is correct

const backendCanisterId = import.meta.env.VITE_BACKEND_CANISTER_ID;
const host = import.meta.env.VITE_HOST || "http://127.0.0.1:8000";

// Initialize the backend actor
const backend = createActor(backendCanisterId, { agentOptions: { host } });

function App() {
  const [games, setGames] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [gameName, setGameName] = useState("");
  const [playerNames, setPlayerNames] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [rating, setRating] = useState(0);

  // Fetch games and players
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const result = await backend.getGames();
        setGames(result);
      } catch (err) {
        console.error("Error fetching games:", err);
      }
    };
    
    const fetchRatings = async () => {
      try {
        const result = await backend.getRatings();
        setRatings(result);
      } catch (err) {
        console.error("Error fetching ratings:", err);
      }
    };

    fetchGames();
    fetchRatings();
  }, []);

  // Add a game
  const handleAddGame = async () => {
    const players = playerNames.split(',').map((name) => name.trim());
    if (!gameName || players.length === 0) {
      alert("Please provide a game name and at least one player.");
      return;
    }
    try {
      const response = await backend.addGame(gameName, players);
      console.log(response); // Log the success message
      setGameName("");
      setPlayerNames("");
      // Fetch the updated games list
      const result = await backend.getGames();
      setGames(result);
    } catch (err) {
      console.error("Error adding game:", err);
    }
  };

  // Submit a rating
  const handleRatePlayer = async () => {
    if (!playerName || rating <= 0) {
      alert("Please provide a valid player name and rating.");
      return;
    }
    try {
      const response = await backend.ratePlayer(playerName, rating);
      console.log(response); // Log the success message
      setPlayerName("");
      setRating(0);
      // Fetch the updated ratings list
      const result = await backend.getRatings();
      setRatings(result);
    } catch (err) {
      console.error("Error rating player:", err);
    }
  };

  return (
    <div className="App">
      <h1>Esports Rating System</h1>
      <p>This website will provide u a valid list of players' leaderboard for esports team to take reference from.</p>
      
      {/* Games List */}
      <div>
        <h2>Games</h2>
        <ul>
          {games.map(([game, players]) => (
            <li key={game}>
              <strong>{game}</strong>
              <ul>
                {players.map((player, index) => (
                  <li key={index}>{player}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* Add a Game Form */}
      <div>
        <h2>Add Game</h2>
        <input
          type="text"
          placeholder="Game Name"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Player Names (comma separated)"
          value={playerNames}
          onChange={(e) => setPlayerNames(e.target.value)}
        />
        <button onClick={handleAddGame}>Add Game</button>
      </div>

      {/* Ratings List */}
      <div>
        <h2>Ratings</h2>
        <ul>
          {ratings.map(([player, score]) => (
            <li key={player}>
              {player}: {score}
            </li>
          ))}
        </ul>
      </div>

      {/* Rate Player Form */}
      <div>
        <h2>Rate a Player</h2>
        <input
          type="text"
          placeholder="Player Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
        <button onClick={handleRatePlayer}>Submit Rating</button>
      </div>
    </div>
  );
}

export default App;
