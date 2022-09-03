import { useContext } from 'react';

import { TableContext } from '../App';

import Hand from './Hand';

function Player({ data }) {
  const { id, name, value, bet } = data;
  const {
    deck,
    setDeck,
    players,
    setPlayers,
    hands,
    setHands,
    activeHand,
    setActiveHand,
  } = useContext(TableContext);

  const myHands = hands.filter((h) => h.playerId == id);

  console.log(name, myHands, activeHand);

  return (
    <div className="player">
      <div className="player-header">
        <div className="player-name">{name}</div>
        <div className="player-value">Bank: {value}</div>
        <div className="player-bet">Bet: £{bet}</div>
      </div>
      <div className="player-hands">
        {myHands.map((h) => (
          <Hand
            hand={h}
            key={h.id}
            dealer={name === 'Dealer' ? true : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export default Player;
