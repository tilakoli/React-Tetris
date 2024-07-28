import React from "react";
import {createStage, isColliding} from "./gameHelpers";
import {
  HiArrowSmallDown,
  HiArrowSmallLeft,
  HiArrowSmallRight,
  HiArrowSmallUp,
} from "react-icons/hi2";

// Custom hooks
import {useInterval} from "./hooks/useInterval";
import {usePlayer} from "./hooks/usePlayer";
import {useStage} from "./hooks/useStage";
import {useGameStatus} from "./hooks/useGameStatus";

// Components
import Stage from "./components/Stage/Stage";
import Display from "./components/Display/Display";
import StartButton from "./components/StartButton/StartButton";

// sounds
import gameoverSound from "./Sounds/gameover.mp3";
import gameStart from "./Sounds/gamestart.mp3";
import keypressSound from "./Sounds/keypresstwo.mp3";

// Styles
import {StyledTetrisWrapper, StyledTetris} from "./App.styles";

const App: React.FC = () => {
  const [dropTime, setDroptime] = React.useState<null | number>(null);
  const [gameOver, setGameOver] = React.useState(true);

  const gameArea = React.useRef<HTMLDivElement>(null);

  const {player, updatePlayerPos, resetPlayer, playerRotate} = usePlayer();
  const {stage, setStage, rowsCleared} = useStage(player, resetPlayer);
  const {score, setScore, rows, setRows, level, setLevel} =
    useGameStatus(rowsCleared);

  function playGameStartSound() {
    const audio = new Audio(gameStart);
    audio.play();
  }
  function playkeyPressSound() {
    const audio = new Audio(keypressSound);
    audio.play();
  }

  function playGameOverSound() {
    const audio = new Audio(gameoverSound);
    audio.play();
  }

  const movePlayer = (dir: number) => {
    if (!isColliding(player, stage, {x: dir, y: 0})) {
      updatePlayerPos({x: dir, y: 0, collided: false});
    }
  };

  const keyUp = ({keyCode}: {keyCode: number}): void => {
    if (!gameOver) {
      // Change the droptime speed when user releases down arrow
      if (keyCode === 40) {
        setDroptime(1000 / level + 200);
      }
    }
  };

  const handleStartGame = (): void => {
    // Need to focus the window with the key events on start
    if (gameArea.current) gameArea.current.focus();
    // Reset everything
    playGameStartSound();
    setStage(createStage());
    setDroptime(1000);
    resetPlayer();
    setScore(0);
    setLevel(1);
    setRows(0);
    setGameOver(false);
  };

  const move = ({
    keyCode,
    repeat,
  }: {
    keyCode: number;
    repeat: boolean;
  }): void => {
    if (!gameOver) {
      if (keyCode === 37) {
        playkeyPressSound();
        movePlayer(-1);
      } else if (keyCode === 39) {
        playkeyPressSound();
        movePlayer(1);
      } else if (keyCode === 40) {
        // Just call once
        if (repeat) return;
        setDroptime(30);
        playkeyPressSound();
      } else if (keyCode === 38) {
        playkeyPressSound();
        playerRotate(stage);
      }
    }
  };

  const drop = (): void => {
    // Increase level when player has cleared 10 rows
    if (rows > level * 10) {
      setLevel((prev) => prev + 1);
      // Also increase speed
      setDroptime(1000 / level + 200);
    }

    if (!isColliding(player, stage, {x: 0, y: 1})) {
      updatePlayerPos({x: 0, y: 1, collided: false});
    } else {
      // Game over!
      if (player.pos.y < 1) {
        playGameOverSound();
        setGameOver(true);
        setDroptime(null);
        setTimeout(() => {
          alert(`Game over! Your Score ${score}`);
        }, 100);
      }
      updatePlayerPos({x: 0, y: 0, collided: true});
    }
  };

  useInterval(() => {
    drop();
  }, dropTime);

  return (
    <StyledTetrisWrapper
      role="button"
      tabIndex={0}
      onKeyDown={move}
      onKeyUp={keyUp}
      ref={gameArea}
    >
      <StyledTetris>
        <div className="display">
          {gameOver ? (
            <div
              style={{
                color: "#fff",
                backgroundColor: "black",
                padding: "20px 50px",
                borderRadius: "10px",
              }}
            >
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  textAlign: "center",
                  borderRadius: "10px",
                  paddingBottom: "10px",
                  borderBottom: "1px solid #ccc",
                }}
              >
                React Tetris
              </h1>
              <div>
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Press <HiArrowSmallLeft /> to move left
                </p>
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Press <HiArrowSmallRight /> to move right
                </p>
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Press <HiArrowSmallDown /> to increase speed.
                </p>
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Press <HiArrowSmallUp /> to rotate.
                </p>
              </div>
              <div
                style={{
                  textAlign: "center",
                }}
              >
                <StartButton callback={handleStartGame} />
              </div>
            </div>
          ) : (
            <>
              <div
                style={{
                  color: "#fff",
                  backgroundColor: "black",
                  padding: "20px",
                  width: "200px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderRadius: "10px",
                }}
              >
                <Display text={`Score: ${score}`} />
                <Display text={`Rows: ${rows}`} />
              </div>
            </>
          )}
        </div>
        <Stage stage={stage} />
      </StyledTetris>
    </StyledTetrisWrapper>
  );
};

export default App;
