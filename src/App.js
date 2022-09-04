//next:
// dealer / player 21

import React, { useState, createContext, useEffect } from 'react';
import uuid4 from 'uuid4';

import Player from './components/Player';

import './App.css';

export const TableContext = createContext({
  deck: [],
  setDeck: () => {},
  players: [],
  setPlayers: () => {},
  hands: [],
  setHands: () => {},
  activeHand: '',
  setActiveHand: () => {},
  playing: '',
  setPlayer: () => {},
  totals: () => {},
});

function App() {
  const [players, setPlayers] = useState([
    createPlayer('Dealer'),
    createPlayer('Chris'),
  ]);

  const [activeHand, setActiveHand] = useState('');
  const [deck, setDeck] = useState(createDeck());
  const [newPlayerName, setNewPlayerName] = useState('');
  const [nameError, setNameError] = useState('');
  const [hands, setHands] = useState([]);
  const [playing, setPlaying] = useState(false);

  return (
    <TableContext.Provider
      value={{
        deck,
        setDeck,
        players,
        setPlayers,
        hands,
        setHands,
        activeHand,
        setActiveHand,
        playing,
        setPlaying,
        totals,
      }}
    >
      <button
        onClick={() =>
          deal(players, setDeck, setHands, setActiveHand, setPlaying)
        }
      >
        Deal
      </button>
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

function createHand(player, deck, hands) {
  let newDeck = [...deck];
  const firstCard = newDeck[Math.floor(Math.random() * newDeck.length)];
  newDeck = newDeck.filter((c) => c != firstCard);
  const secondCard = newDeck[Math.floor(Math.random() * newDeck.length)];
  newDeck = newDeck.filter((c) => c != secondCard);

  const newHand = {
    id: uuid4(),
    playerId: player.id,
    cards: [firstCard, secondCard],
    result: { message: '' },
    bet: player.bet,
    get value() {
      let ace = false;
      let total = 0;
      this.cards.forEach((c) => {
        let v = c.value;
        if (v === 'A') {
          ace = true;
          v = 1;
        }
        if (v === 'K' || v === 'Q' || v === 'J') v = 10;
        total += v;
      });
      if (ace && total < 12) total += 10;
      return total;
    },
  };

  return { hands: [...hands, newHand], deck: newDeck };
}

function createPlayer(name) {
  return {
    id: uuid4(),
    name,
    value: 0,
    bet: 1,
  };
}

function deal(players, setDeck, setHands, setActiveHand, setPlaying) {
  setPlaying(true);
  let newDeck = createDeck();
  let newHands = [];

  players.forEach((p) => {
    const result = createHand(p, newDeck, newHands);
    newDeck = result.deck;
    newHands = result.hands;
  });

  setDeck(newDeck);
  setHands(newHands);
  setActiveHand(newHands[1].id);
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

  if (newPlayerName.length < 3)
    return setNameError('Player name must be at least 3 characters');

  const newPlayers = [...players, createPlayer(newPlayerName)];
  setNewPlayerName('');
  setPlayers(newPlayers);
  setNameError('');
}

function totals(hands, setHands, players, setPlayers) {
  const dealer = players.find((p) => p.name === 'Dealer');
  const dealersHand = hands.find((h) => h.playerId === dealer.id);

  for (let i = 0; i < hands.length; i++) {
    const player = players.find((p) => p.id === hands[i].playerId);
    if (player.name === 'Dealer') continue;
    let win = false;
    if (
      hands[i].value < 22 &&
      (hands[i].value > dealersHand.value || dealersHand.value > 21)
    )
      win = true;

    if (win) {
      player.value += hands[i].bet;
      dealer.value -= hands[i].bet;
      hands[i].result.status = 'won';
      hands[i].result.message = `Won £${hands[i].bet}`;
    } else {
      player.value -= hands[i].bet;
      dealer.value += hands[i].bet;
      hands[i].result.status = 'lost';
      hands[i].result.message = `Lost £${hands[i].bet}`;
    }
  }

  setPlayers([...players]);
  setHands([...hands]);
}
export default App;
