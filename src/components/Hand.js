import { useContext } from 'react';
import uuid4 from 'uuid4';

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

  let canSplit = false;
  if (hand.cards.length === 2) {
    let v1 = hand.cards[0].value;
    let v2 = hand.cards[1].value;

    if (v1 === 'J' || v1 === 'Q' || v1 === 'K') v1 = 10;
    if (v2 === 'J' || v2 === 'Q' || v2 === 'K') v2 = 10;

    if (v1 === v2) canSplit = true;
  }

  const controls = (
    <div>
      <button
        onClick={() => {
          const { newDeck, newHands, handValue } = draw(deck, hands, hand);

          setDeck(newDeck);
          setHands(newHands);

          if (handValue > 21) stand(hands, activeHand, setActiveHand);
        }}
      >
        Draw
      </button>{' '}
      <button
        onClick={() => {
          hand.bet = hand.bet * 2;
          const { newDeck, newHands } = draw(deck, hands, hand);

          setDeck(newDeck);
          setHands(newHands);

          stand(hands, activeHand, setActiveHand);
        }}
      >
        Double
      </button>{' '}
      <button
        onClick={() => split(hand, hands, setHands)}
        className={canSplit ? undefined : 'disabled'}
      >
        Split
      </button>{' '}
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

function draw(deck, hands, hand) {
  let newDeck = [...deck];
  let newHands = [...hands];

  const newCard = newDeck[Math.floor(Math.random() * newDeck.length)];
  newDeck = newDeck.filter((c) => c != newCard);

  hand.cards.push(newCard);

  if (hand.value > 21) {
    hand.result.status = 'lost';
    hand.result.message = 'Bust';
  }

  return { newDeck, newHands, handValue: hand.value };
}

function split(hand, hands, setHands) {
  const newHands = [...hands];
  const secondHand = Object.create(
    Object.getPrototypeOf(hand),
    Object.getOwnPropertyDescriptors(hand)
  );
  secondHand.cards = [secondHand.cards[1]];
  secondHand.result = { message: '' };

  const indexHand = hands.find((h) => h.id === hand.id);

  indexHand.cards.length = 1;
  const index = hands.indexOf(indexHand);

  secondHand.id = uuid4();

  newHands.splice(index + 1, 0, secondHand);
  console.log(hands, newHands);
  setHands(newHands);
}

function stand(hands, activeHand, setActiveHand) {
  const currentHand = hands.find((h) => h.id === activeHand);
  let nextIndex = hands.indexOf(currentHand) + 1;

  nextIndex === hands.length && (nextIndex = 0);

  setActiveHand(hands[nextIndex].id);
}

export default Hand;
