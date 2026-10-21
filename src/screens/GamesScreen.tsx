import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Shell } from '../components/Shell';
import { Icon } from '../components/Icon';
import { soundService } from '../services/sound';
import { saveProgress, loadProgress } from '../services/storage';
import content from '../content/content.json';

export const GamesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(loadProgress());

  // -------------------------------------------------------------
  // GAME A: MEMORY MATCH (4x3 Polaroid Deck)
  // -------------------------------------------------------------
  interface CardItem {
    id: string;
    uniqueId: string;
    label: string;
    icon: string;
    color: string;
    photoSrc: string;
    isFlipped: boolean;
    isMatched: boolean;
    isShaking: boolean;
  }

  const baseCards = [
    { id: 'match-1', label: 'Stargaze', icon: 'camera', color: 'text-primary', photoSrc: 'media/photos/match-1.webp' },
    { id: 'match-2', label: 'Chai Stop', icon: 'coffee', color: 'text-secondary', photoSrc: 'media/photos/match-2.webp' },
    { id: 'match-3', label: 'Train Ride', icon: 'ticket', color: 'text-primary', photoSrc: 'media/photos/match-3.webp' },
    { id: 'match-4', label: 'Our Track', icon: 'headphones', color: 'text-secondary', photoSrc: 'media/photos/match-4.webp' },
    { id: 'match-5', label: 'Croissant', icon: 'cake', color: 'text-primary', photoSrc: 'media/photos/match-5.webp' },
    { id: 'match-6', label: 'Level 20', icon: 'favorite', color: 'text-secondary', photoSrc: 'media/photos/match-6.webp' }
  ];

  const [cards, setCards] = useState<CardItem[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matchedCount, setMatchedCount] = useState<number>(0);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [memoryWin, setMemoryWin] = useState<boolean>(progress.gameRecords.memoryMatch.completed);

  const initDeck = () => {
    const deck: CardItem[] = [...baseCards, ...baseCards].map((c, idx) => ({
      ...c,
      uniqueId: `${idx}-${c.id}`,
      isFlipped: false,
      isMatched: false,
      isShaking: false
    }));
    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
    setMoves(0);
    setMatchedCount(0);
    setFlippedIds([]);
    setIsLocked(false);
  };

  useEffect(() => {
    initDeck();
  }, []);

  const handleCardClick = (uniqueId: string) => {
    if (isLocked) return;
    const card = cards.find(c => c.uniqueId === uniqueId);
    if (!card || card.isFlipped || card.isMatched) return;

    soundService.vibrate([15]);
    soundService.playClickTone('flip');

    const nextCards = cards.map(c =>
      c.uniqueId === uniqueId ? { ...c, isFlipped: true } : c
    );
    setCards(nextCards);

    const newFlipped = [...flippedIds, uniqueId];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsLocked(true);

      const first = cards.find(c => c.uniqueId === newFlipped[0]);
      const second = cards.find(c => c.uniqueId === newFlipped[1]);

      if (first && second && first.id === second.id) {
        // MATCH!
        setTimeout(() => {
          soundService.playClickTone('match');
          soundService.vibrate([25, 40]);
          setCards(prev =>
            prev.map(c =>
              c.id === first.id ? { ...c, isMatched: true, isFlipped: true } : c
            )
          );
          setFlippedIds([]);
          setIsLocked(false);
          const nextMatched = matchedCount + 1;
          setMatchedCount(nextMatched);

          if (nextMatched === 6) {
            // WIN GAME!
            setMemoryWin(true);
            confetti({
              particleCount: 60,
              spread: 70,
              origin: { y: 0.6 }
            });
            const best = Math.min(progress.gameRecords.memoryMatch.bestMoves, moves + 1);
            const updated = saveProgress({
              gameRecords: {
                ...progress.gameRecords,
                memoryMatch: { bestMoves: best, completed: true }
              }
            });
            setProgress(updated);
          }
        }, 400);
      } else {
        // MISMATCH! Shake cards
        setTimeout(() => {
          soundService.playClickTone('miss');
          setCards(prev =>
            prev.map(c =>
              newFlipped.includes(c.uniqueId)
                ? { ...c, isShaking: true }
                : c
            )
          );
        }, 450);

        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              newFlipped.includes(c.uniqueId)
                ? { ...c, isFlipped: false, isShaking: false }
                : c
            )
          );
          setFlippedIds([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  // -------------------------------------------------------------
  // GAME B: HOW WELL DO YOU KNOW US? (Couples Quiz)
  // -------------------------------------------------------------
  const [activeQuestion, setActiveQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [triviaCompleted, setTriviaCompleted] = useState<boolean>(progress.gameRecords.trivia.completed);
  const triviaQuestions = content.gamesHub.trivia;

  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    soundService.vibrate([20]);
    const currentQ = triviaQuestions[qIndex];
    const isCorrect = optionIndex === currentQ.correctIndex;

    if (isCorrect) {
      soundService.playClickTone('match');
    } else {
      soundService.playClickTone('miss');
    }

    const updatedAnswers = { ...selectedAnswers, [qIndex]: optionIndex };
    setSelectedAnswers(updatedAnswers);

    // Calculate score
    const correctCount = Object.entries(updatedAnswers).filter(([idx, ans]) => {
      return ans === triviaQuestions[parseInt(idx)].correctIndex;
    }).length;

    if (Object.keys(updatedAnswers).length === triviaQuestions.length) {
      setTriviaCompleted(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      const updated = saveProgress({
        gameRecords: {
          ...progress.gameRecords,
          trivia: { score: correctCount, completed: true, answers: updatedAnswers }
        }
      });
      setProgress(updated);
    }
  };

  // -------------------------------------------------------------
  // GAME C: HEART CATCHER (Interactive Canvas Mini-game)
  // -------------------------------------------------------------
  const heartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCatching, setIsCatching] = useState<boolean>(false);
  const [catchScore, setCatchScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [catcherCompleted, setCatcherCompleted] = useState<boolean>(progress.gameRecords.heartCatcher.completed);
  const basketXRef = useRef<number>(150);

  const startHeartCatcher = () => {
    soundService.vibrate([25]);
    soundService.playClickTone('tap');
    setIsCatching(true);
    setCatchScore(0);
    setTimeLeft(30);
  };

  useEffect(() => {
    if (!isCatching) return;

    const canvas = heartCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let timerId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 340);
    const height = (canvas.height = 220);
    basketXRef.current = width / 2;

    interface CatchItem {
      x: number;
      y: number;
      speed: number;
      type: 'star' | 'heart' | 'cake';
      size: number;
      symbol: string;
      points: number;
    }

    interface FloatingPop {
      x: number;
      y: number;
      text: string;
      opacity: number;
      color: string;
    }

    let items: CatchItem[] = [];
    let pops: FloatingPop[] = [];
    let currentScore = 0;

    const spawnItem = () => {
      const roll = Math.random();
      let type: 'star' | 'heart' | 'cake' = 'heart';
      let symbol = '💖';
      let speed = Math.random() * 1.5 + 1.2;
      let points = 1;

      if (roll < 0.25) {
        type = 'cake';
        symbol = '🎂';
        speed = speed * 2; // Cakes drop twice as fast!
        points = 5;
      } else if (roll < 0.6) {
        type = 'star';
        symbol = '⭐';
        points = 1;
      }

      items.push({
        x: Math.random() * (width - 40) + 20,
        y: -20,
        speed,
        type,
        size: 20,
        symbol,
        points
      });
    };

    let spawnTick = 0;

    // Timer countdown
    timerId = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerId);
          setIsCatching(false);
          setCatcherCompleted(true);
          soundService.playMagicalCelebrationChime();
          const updated = saveProgress({
            gameRecords: {
              ...progress.gameRecords,
              heartCatcher: { bestScore: Math.max(progress.gameRecords.heartCatcher.bestScore, currentScore), completed: true }
            }
          });
          setProgress(updated);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      basketXRef.current = Math.max(35, Math.min(width - 35, x));
    };

    canvas.addEventListener('pointermove', onPointerMove);

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      spawnTick++;

      if (spawnTick % 35 === 0) {
        spawnItem();
      }

      // Draw Basket
      const bx = basketXRef.current;
      const by = height - 28;
      ctx.fillStyle = '#E8C987';
      ctx.beginPath();
      ctx.roundRect(bx - 35, by, 70, 16, [4, 4, 10, 10]);
      ctx.fill();
      ctx.fillStyle = '#251A00';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText("Isha's Basket", bx, by + 11);

      // Update & Draw Items
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += item.speed;

        ctx.font = `${item.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(item.symbol, item.x, item.y);

        // Check collision with basket
        if (
          item.y >= by - 5 &&
          item.y <= by + 20 &&
          Math.abs(item.x - bx) < 42
        ) {
          // Caught item!
          currentScore += item.points;
          setCatchScore(currentScore);
          soundService.vibrate([15]);
          soundService.playClickTone(item.type === 'cake' ? 'match' : 'flip');

          pops.push({
            x: item.x,
            y: by - 10,
            text: `+${item.points}`,
            opacity: 1,
            color: item.type === 'cake' ? '#F4B6C2' : '#FFE6B5'
          });

          items.splice(i, 1);
          continue;
        }

        if (item.y > height + 20) {
          items.splice(i, 1);
        }
      }

      // Draw floating score pops
      for (let j = pops.length - 1; j >= 0; j--) {
        const p = pops[j];
        p.y -= 1.2;
        p.opacity -= 0.035;

        if (p.opacity <= 0) {
          pops.splice(j, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(timerId);
      canvas.removeEventListener('pointermove', onPointerMove);
    };
  }, [isCatching]);

  // Star calculation
  const starsCollected =
    (memoryWin ? 1 : 0) +
    (triviaCompleted ? 1 : 0) +
    (catcherCompleted ? 1 : 0);

  const canUnlockLevel6 = starsCollected >= 2;

  const handleNextLevel = () => {
    soundService.vibrate([25, 40]);
    soundService.playClickTone('match');
    saveProgress({
      masteredLevels: [...new Set([...progress.masteredLevels, 5])],
      currentLevel: Math.max(progress.currentLevel, 6)
    });
    navigate('/open-when-letters');
  };

  return (
    <Shell
      screenTitle="Games Hub"
      nextPath="/open-when-letters"
      skipPath="/open-when-letters"
    >
      <div className="flex flex-col w-full relative pb-12 max-w-xl mx-auto space-y-6">
        {/* Header Section */}
        <section className="flex flex-col gap-2 pt-2">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high shadow-md border border-primary/20">
              <span className="text-secondary text-xs">👾</span>
              <span className="text-[11px] font-sans font-bold text-primary uppercase tracking-wider">
                {content.gamesHub.badge}
              </span>
            </div>

            {/* Skip to Level 6 is ALWAYS visible per requirement */}
            <button
              onClick={() => {
                soundService.vibrate([20]);
                navigate('/open-when-letters');
              }}
              className="inline-flex items-center gap-1 text-xs font-sans text-on-surface-variant hover:text-primary transition-colors bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant/30"
            >
              <span>Skip to Level 06</span>
              <Icon name="chevron_right" size={14} />
            </button>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-primary font-medium tracking-tight">
            {content.gamesHub.title}
          </h2>
          <p className="font-sans text-sm text-on-surface-variant">
            {content.gamesHub.subtitle}
          </p>

          {/* Star Tracker HUD */}
          <div className="w-full bg-surface-container p-4 rounded-xl shadow-lg flex items-center justify-between relative overflow-hidden border border-primary/20">
            <div className="absolute -right-4 -top-8 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-3 z-10">
              <div className="flex items-center gap-1">
                {[1, 2, 3].map(s => (
                  <Icon
                    key={s}
                    name="star"
                    size={22}
                    className={s <= starsCollected ? 'text-primary fill-primary' : 'text-outline opacity-40'}
                  />
                ))}
              </div>
              <div>
                <p className="font-sans text-sm font-bold text-primary">
                  {starsCollected} of 3 {content.gamesHub.starTrackerTitle}
                </p>
                <p className="font-sans text-xs text-on-surface-variant">
                  {canUnlockLevel6 ? '🎉 Level 06 Unlocked!' : `${3 - starsCollected} challenge remaining for Level 06`}
                </p>
              </div>
            </div>

            <div className="w-11 h-11 rounded-full bg-primary-container/20 flex items-center justify-center text-primary z-10 shadow-[0_0_16px_rgba(232,201,135,0.2)]">
              <Icon name="trophy" size={22} />
            </div>
          </div>
        </section>

        {/* =========================================================
            GAME 1: Memory Match (4x3 Polaroid Deck)
            ========================================================= */}
        <article className="flex flex-col bg-surface-container p-4 rounded-xl shadow-lg relative overflow-hidden border border-primary/20">
          <div className="flex items-start justify-between gap-2 mb-2 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shadow-sm">
                <Icon name="style" size={18} />
              </div>
              <div>
                <h3 className="font-serif text-base text-primary font-medium">Memory Match</h3>
                <p className="text-[10px] font-sans text-on-surface-variant uppercase tracking-wider">
                  4x3 Polaroid Deck
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={initDeck}
                title="Shuffle & Replay"
                className="p-1.5 rounded-full bg-surface-container-high text-primary hover:text-primary-fixed active:rotate-180 transition-all text-xs flex items-center justify-center"
              >
                <Icon name="refresh" size={15} />
              </button>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold shadow-sm ${
                  memoryWin ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-primary'
                }`}
              >
                <Icon name={memoryWin ? 'check_circle' : 'play'} size={12} />
                <span>{memoryWin ? 'Star Claimed' : 'Ready'}</span>
              </span>
            </div>
          </div>

          <p className="text-xs font-sans text-on-surface-variant mb-3 relative z-10">
            Flip and match Polaroid pairs of our favorite moments across the year.
          </p>

          {/* 4x3 Grid Stage */}
          <div className="bg-surface-container-low p-3 rounded-lg mb-3 relative z-10 border border-outline-variant/20">
            <div className="flex items-center justify-between mb-2 px-1 text-xs font-sans text-on-surface-variant">
              <span className="text-primary font-semibold">Moves: {moves}</span>
              <span className="text-secondary font-semibold">Pairs: {matchedCount}/6</span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-2 select-none perspective-800">
              {cards.map(card => (
                <div
                  key={card.uniqueId}
                  onClick={() => handleCardClick(card.uniqueId)}
                  className={`aspect-square relative cursor-pointer select-none active:scale-95 transition-transform duration-150 ${
                    card.isShaking ? 'animate-wiggle' : ''
                  }`}
                  role="button"
                  tabIndex={0}
                >
                  <div
                    className={`card-inner w-full h-full relative transform-style-3d transition-transform duration-500 rounded-md shadow-sm ${
                      card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* Back face (Unflipped): Gold filigree heart */}
                    <div className="card-back absolute inset-0 backface-hidden bg-gradient-to-br from-[#2a1745] to-[#160a28] border border-primary/40 rounded-md p-1 flex flex-col items-center justify-center shadow-inner hover:border-primary/70 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center border border-primary/30 shadow-[0_0_8px_rgba(232,201,135,0.3)]">
                        <Icon name="favorite" size={13} className="text-primary fill-primary/30" />
                      </div>
                      <span className="text-[8px] font-serif font-bold text-primary tracking-widest uppercase mt-1">
                        I✦S
                      </span>
                    </div>

                    {/* Front face (Flipped): Real photo card */}
                    <div
                      className={`card-front absolute inset-0 backface-hidden rotate-y-180 bg-[#FFF6EA] text-[#2B1B3D] border border-primary/40 rounded-md shadow-md overflow-hidden ${
                        card.isMatched ? 'ring-2 ring-primary-container' : ''
                      }`}
                    >
                      <img
                        src={card.photoSrc}
                        alt={card.label}
                        className="w-full h-full object-cover rounded-sm absolute inset-0"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-1 pt-3 flex items-center justify-center z-10">
                        <span className="text-[8px] font-sans font-bold text-white truncate max-w-full drop-shadow">
                          {card.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Win Banner */}
            {memoryWin && (
              <div className="mt-3 p-2 rounded-md bg-secondary-container/40 flex items-center justify-between text-secondary border border-secondary/30">
                <div className="flex items-center gap-1.5 text-xs font-sans">
                  <span>🎉</span>
                  <span className="font-semibold text-secondary-fixed">
                    {content.gamesHub.memoryMatch.winText}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-primary">
                  Best: {progress.gameRecords.memoryMatch.bestMoves} Moves
                </span>
              </div>
            )}
          </div>

          {/* Swayam's Banter Note */}
          <div className="p-3 rounded-lg bg-surface-container-high flex items-start gap-2 shadow-sm relative z-10 border border-outline-variant/20">
            <Icon name="stickynote2" size={16} className="text-primary shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-sans font-bold text-primary">Swayam's Note: </span>
              <span className="font-serif italic text-on-surface-variant">
                {content.gamesHub.memoryMatch.swayamNote}
              </span>
            </div>
          </div>
        </article>

        {/* =========================================================
            GAME 2: How Well Do You Know Us? (Couples Quiz)
            ========================================================= */}
        <article className="flex flex-col bg-surface-container p-4 rounded-xl shadow-lg relative overflow-hidden border border-primary/20">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shadow-sm">
                <Icon name="psychologyalt" size={18} />
              </div>
              <div>
                <h3 className="font-serif text-base text-primary font-medium">How Well Do You Know Us?</h3>
                <p className="text-[10px] font-sans text-on-surface-variant uppercase tracking-wider">
                  Couple's Trivia Quest
                </p>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold shadow-sm ${
                triviaCompleted ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-primary'
              }`}
            >
              <Icon name={triviaCompleted ? 'check_circle' : 'star'} size={12} />
              <span>{triviaCompleted ? 'Star Claimed' : 'Ready'}</span>
            </span>
          </div>

          <p className="text-xs font-sans text-on-surface-variant mb-3">
            5 questions on inside jokes, secret nicknames, and our favorite moments.
          </p>

          {/* Question Stage */}
          <div className="bg-surface-container-low p-4 rounded-lg mb-3 flex flex-col gap-3 border border-outline-variant/20">
            <div className="flex items-center justify-between text-xs font-sans">
              <span className="text-secondary uppercase tracking-widest font-bold">
                Question 0{activeQuestion + 1} of 05
              </span>
              <div className="flex items-center gap-1">
                {triviaQuestions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveQuestion(i)}
                    className={`w-5 h-5 rounded-full text-[10px] font-sans font-bold transition-all ${
                      activeQuestion === i
                        ? 'bg-primary text-on-primary scale-110 shadow-sm'
                        : selectedAnswers[i] !== undefined
                        ? 'bg-secondary-container text-secondary'
                        : 'bg-surface-container-highest text-outline'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <h4 className="font-serif text-base text-on-surface leading-snug">
              "{triviaQuestions[activeQuestion].question}"
            </h4>

            {/* 4 Options */}
            <div className="flex flex-col gap-2 mt-1">
              {triviaQuestions[activeQuestion].options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[activeQuestion] === optIdx;
                const isCorrect = optIdx === triviaQuestions[activeQuestion].correctIndex;
                const hasAnswered = selectedAnswers[activeQuestion] !== undefined;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectAnswer(activeQuestion, optIdx)}
                    className={`w-full text-left p-3 rounded-lg text-xs font-sans transition-all flex items-center justify-between border cursor-pointer ${
                      isSelected && isCorrect
                        ? 'bg-primary text-on-primary font-semibold shadow-[0_0_16px_rgba(232,201,135,0.3)] border-primary'
                        : isSelected && !isCorrect
                        ? 'bg-red-950/60 text-red-200 border-red-500/50 animate-wiggle'
                        : hasAnswered && isCorrect
                        ? 'bg-primary/20 text-primary border-primary/40'
                        : 'bg-surface-container-high/60 text-on-surface-variant hover:bg-surface-bright border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        {String.fromCharCode(65 + optIdx)})
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isSelected && isCorrect && (
                      <span className="bg-on-primary/15 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        Correct! ♥
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Swayam Reacted Note */}
            {selectedAnswers[activeQuestion] !== undefined && (
              <div className="mt-1 p-3 rounded-lg bg-secondary-container text-on-secondary-container flex items-start gap-2 shadow-sm border border-secondary/30">
                <span className="text-lg">
                  {selectedAnswers[activeQuestion] === triviaQuestions[activeQuestion].correctIndex ? '🍕' : '😅'}
                </span>
                <div className="text-xs">
                  <span className="font-sans font-bold text-secondary-fixed">Swayam Reacted: </span>
                  <span className="font-serif italic text-on-secondary-container">
                    {selectedAnswers[activeQuestion] === triviaQuestions[activeQuestion].correctIndex
                      ? triviaQuestions[activeQuestion].swayamReaction
                      : triviaQuestions[activeQuestion].wrongReaction}
                  </span>
                </div>
              </div>
            )}
          </div>
        </article>

        {/* =========================================================
            GAME 3: Heart Catcher (Night Sky Mini-game)
            ========================================================= */}
        <article className="flex flex-col bg-surface-container p-4 rounded-xl shadow-lg relative overflow-hidden border border-primary/20">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary shadow-sm">
                <Icon name="celebration" size={18} />
              </div>
              <div>
                <h3 className="font-serif text-base text-primary font-medium">Heart Catcher</h3>
                <p className="text-[10px] font-sans text-on-surface-variant uppercase tracking-wider">
                  30s Night Sky Reflex
                </p>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold shadow-sm ${
                catcherCompleted ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-primary'
              }`}
            >
              <Icon name={catcherCompleted ? 'check_circle' : 'play'} size={12} />
              <span>{catcherCompleted ? 'Star Claimed' : 'Ready'}</span>
            </span>
          </div>

          <p className="text-xs font-sans text-on-surface-variant mb-3">
            Catch falling stars, birthday cakes, and hearts in your basket before time runs out!
          </p>

          {/* Interactive Canvas Area */}
          <div className="relative w-full h-56 bg-surface-container-lowest rounded-lg overflow-hidden flex flex-col justify-between p-3 shadow-inner border border-outline-variant/30">
            {/* HUD Top */}
            <div className="flex items-center justify-between z-10">
              <div className="px-3 py-1 rounded-full bg-surface-container/80 text-primary text-xs font-mono flex items-center gap-1 shadow-sm">
                <Icon name="schedule" size={12} />
                <span>00:{timeLeft.toString().padStart(2, '0')}</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-secondary-container text-secondary text-xs font-sans font-bold shadow-sm">
                Score: {catchScore} / 20
              </div>
            </div>

            {/* Canvas */}
            <canvas
              ref={heartCanvasRef}
              className="absolute inset-0 w-full h-full cursor-ew-resize touch-none"
            />

            {/* Start Button / Overlay when not running */}
            {!isCatching && (
              <div className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3 p-4 text-center">
                <p className="font-serif text-base text-primary">
                  {timeLeft === 0 ? 'Round Completed! 🎉' : 'Catch 20 Items for the 3rd Star!'}
                </p>
                <button
                  onClick={startHeartCatcher}
                  className="px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container font-sans text-xs font-bold uppercase tracking-wider shadow-[0_0_16px_rgba(232,201,135,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  {timeLeft === 0 ? 'Play Again' : 'Start 30s Round'}
                </button>
              </div>
            )}
          </div>

          {/* Banter Note */}
          <div className="mt-3 p-3 rounded-lg bg-surface-container-high flex items-start gap-2 shadow-sm border border-outline-variant/20">
            <Icon name="auto_awesome" size={16} className="text-primary shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-sans font-bold text-primary">Swayam's Note: </span>
              <span className="font-serif italic text-on-surface-variant">
                {content.gamesHub.heartCatcher.swayamNote}
              </span>
            </div>
          </div>
        </article>

        {/* Milestone Gateway Callout */}
        <section className="bg-surface-container p-5 rounded-xl shadow-xl flex flex-col items-center text-center gap-3 border border-primary/30">
          <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_0_24px_rgba(232,201,135,0.4)]">
            <Icon name="lock_open" size={24} />
          </div>

          <div className="flex flex-col gap-0.5">
            <h3 className="font-serif text-lg text-primary font-medium">
              {canUnlockLevel6 ? 'Level 06 Unlocked!' : 'Collect Stars to Continue'}
            </h3>
            <p className="text-xs font-sans text-on-surface-variant max-w-sm">
              The golden wax-sealed letters are ready for you.
            </p>
          </div>

          <button
            onClick={handleNextLevel}
            className="w-full py-4 px-6 rounded-full bg-primary text-on-primary font-sans text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(232,201,135,0.35)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            <Icon name="mail" size={18} />
            <span>Next Level: Open When Letters</span>
            <Icon name="arrow_forward" size={16} />
          </button>
        </section>
      </div>
    </Shell>
  );
};
