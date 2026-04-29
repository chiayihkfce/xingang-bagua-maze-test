import React, { useState, useEffect } from 'react';

/**
 * 遊戲三：萬象歸宗 (卦象對對碰)
 */
const MatchGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const trigrams = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];
  const [cards, setCards] = useState<
    { id: number; symbol: string; isFlipped: boolean; isMatched: boolean }[]
  >([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  const initGame = () => {
    const shuffledCards = [...trigrams, ...trigrams]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffledCards);
    setFlippedIndices([]);
    setIsLocked(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const [first, second] = newFlipped;

      if (cards[first].symbol === cards[second].symbol) {
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[first].isMatched = true;
            updated[second].isMatched = true;
            return updated;
          });
          setFlippedIndices([]);
          setIsLocked(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[first].isFlipped = false;
            updated[second].isFlipped = false;
            return updated;
          });
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.isMatched)) {
      setTimeout(() => onWin(), 500);
    }
  }, [cards]);

  return (
    <div className="match-game">
      <div
        className="game-instructions"
        style={{ textAlign: 'center', marginBottom: '15px' }}
      >
        <h3 style={{ margin: 0, color: 'var(--primary-gold)' }}>萬象歸宗</h3>
        <p style={{ fontSize: '0.75rem', margin: '6px 0', opacity: 0.8 }}>
          找出成對的卦象，平息混亂的氣流
        </p>
      </div>
      <div className="card-grid">
        {cards.map((card, i) => (
          <div
            key={card.id}
            className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
            onClick={() => handleCardClick(i)}
          >
            <div className="card-front">{card.symbol}</div>
            <div className="card-back">☯</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchGame;
