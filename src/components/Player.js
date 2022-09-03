import { useContext } from 'react';

import Card from './Card';

function Player({ data, active }) {
  const { name, hand, value, stage, money } = data;
  const { deck, setDeck, players, setPlayers } = useContext(TableContext);

  return (
    <div className="player">
      <div className="player-name">{name}</div>
      <div className="player-hand">
        {hand.length === 0
          ? 'no cards'
          : hand.map((c, i) => <Card data={c} key={i} />)}
      </div>
      <div className="actions" style={{ display: active ? undefined : 'none' }}>
        <button onClick={() => hit()}>Hit</button> Stick Double Down
      </div>
    </div>
  );
}

function hit({ player, deck }) {}

export default Player;
