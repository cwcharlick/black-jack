import { useContext } from 'react';

import { TableContext } from '../App';
import Card from './Card';

function Hand({ hand, dealer }) {
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

  const controls = (
    <div>
      <button
        onClick={() =>
          draw(deck, setDeck, hands, setHands, hand, activeHand, setActiveHand)
        }
      >
        Draw
      </button>{' '}
      Double Split{' '}
      <button onClick={() => stand(hands, activeHand, setActiveHand)}>
        Stand
      </button>
    </div>
  );

  return (
    <>
      <div className="hand">
        {hand.cards.map((c, i) => {
          return (
            <Card
              data={c}
              key={i}
              hidden={dealer && i === 0 ? true : undefined}
            />
          );
        })}
        {hand.result.status && (
          <div className="hand-message">{hand.result.message}</div>
        )}
      </div>
      {hand.id === activeHand && controls}
    </>
  );
}

function draw(deck, setDeck, hands, setHands, hand, activeHand, setActiveHand) {
  let newDeck = [...deck];
  let newHands = [...hands];

  const newCard = newDeck[Math.floor(Math.random() * newDeck.length)];
  newDeck = newDeck.filter((c) => c != newCard);

  hand.cards.push(newCard);

  if (hand.value > 21) {
    hand.result.status = 'lost';
    hand.result.message = 'Bust';
  }

  setDeck(newDeck);
  setHands(newHands);

  if (hand.value > 21) stand(hands, activeHand, setActiveHand);
}

function stand(hands, activeHand, setActiveHand) {
  const currentHand = hands.find((h) => h.id === activeHand);
  let nextIndex = hands.indexOf(currentHand) + 1;

  nextIndex === hands.length && (nextIndex = 0);

  setActiveHand(hands[nextIndex].id);
}

export default Hand;
