import React, { useState, createContext } from 'react';

import Player from './components/Player';

import './App.css';

function App() {
  const TableContext = createContext();

  const [players, setPlayers] = useState([
    createPlayer('Dealer'),
    createPlayer('Chris'),
  ]);

  const [activePlayer, setActivePlayer] = useState('Chris');
  const [deck, setDeck] = useState(createDeck());
  const [newPlayerName, setNewPlayerName] = useState('');
  const [nameError, setNameError] = useState('');

  console.log(players);

  return (
    <TableContext.Provider value={{ deck, setDeck, players, setPlayers }}>
      <div id="dealer">
        <Player data={players[0]} />
      </div>
      <div id="players">
        {players.map(
          (p, i) => p.name != 'Dealer' && <Player data={p} key={i} />
        )}
      </div>
      <form
        onSubmit={(e) =>
          handleNewPlayer(
            e,
            players,
            setPlayers,
            newPlayerName,
            setNewPlayerName,
            setNameError
          )
        }
      >
        <input
          placeholder="Player Name"
          value={newPlayerName}
          onChange={(e) => {
            setNewPlayerName(e.target.value);
          }}
        />
        <button type="Submit">Add</button>
      </form>
      {nameError}
    </TableContext.Provider>
  );
}

function createDeck() {
  const deck = [];
  const suits = ['Clubs', 'Spades', 'Hearts', 'Diamonds'];
  const values = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];

  suits.forEach((s) => {
    values.forEach((v) => {
      deck.push({ value: v, suit: s });
    });
  });

  return deck;
}

function createPlayer(name) {
  return {
    name,
    hand: [],
    get value() {
      return '0';
    },
    stage: 'ready',
    money: 0,
  };
}

function handleNewPlayer(
  e,
  players,
  setPlayers,
  newPlayerName,
  setNewPlayerName,
  setNameError
) {
  e.preventDefault();
  if (players.find((p) => p.name === newPlayerName))
    return setNameError('Player already exists');

  const newPlayers = [...players, createPlayer(newPlayerName)];
  setNewPlayerName('');
  setPlayers(newPlayers);
  setNameError('');
}

export default App;
