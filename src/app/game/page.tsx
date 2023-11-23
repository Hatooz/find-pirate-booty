"use client";
import { useRef, useState } from "react";

export type TGame = {
  id: 17;
  active: boolean;
  name: string;
  currentRoom?: number;
  gameRooms: TGameRoom[];
};

export type TGameRoom = {
  id: number;
  gameId: number;
  roomId: number;
  room: TRoom;
};

export type TRoom = {
  id: number;
  possibelDirections: string;
};

export default function Game({
  game,
  callBack,
}: {
  game: TGame;
  callBack: (id: number) => void;
}) {
  const [currentResponse, setCurrentResponse] = useState("");
  const ref = useRef<HTMLFormElement>(null);
  const startGame = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gameroom/startgame`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: game.id.toString(),
    }).then((res) => {
      res.json().then((json) => {
        // setCurrentReponse(json.content);
        callBack(game.id);
      });
    });
  };
  const stopGame = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gameroom/stopgame`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: game.id.toString(),
    }).then((res) => {
      res.json().then((json) => {
        // setCurrentReponse(json.content);
        callBack(game.id);
      });
    });
  };

  const goToDirection = (direction: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gameroom/nextroom`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ direction: direction, gameId: game.id }),
    }).then((res) => {
      res.json().then((json) => {
        // setCurrentReponse(json.content);
        //   callBack(game.id);
        console.log(json);
        if (json.content.toLowerCase().includes("game over")) {
          alert(json.content);
        }
        setCurrentResponse(json.content);
        reloadGame();
      });
    });
  };

  const reloadGame = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/game/${game.id}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }).then((res) => {
      res.json().then((json) => {
        // setCurrentReponse(json.content);
        //   callBack(game.id);
        game = json;
      });
      callBack(game.id);
    });
  };
  const playerAction = (formData: FormData) => {
    const playerAction = formData.get("playerAction")?.toString();
    ref.current?.reset();
    goToDirection(playerAction as string);
  };
  return (
    <div className="border h-24">
      {game.name} - {game.active ? "active" : "not active"}-{" "}
      {!game.active ? (
        <button onClick={startGame}>Start</button>
      ) : (
        <button onClick={stopGame}>Stop</button>
      )}
      <div>{game.active && "Game is started"}</div>
      <div>
        {game.active && (
          <div>
            <form ref={ref} action={playerAction}>
              <label>In which direction should you proceed?</label>
              <input type="text" name="playerAction" className="text-black" />
            </form>
          </div>
        )}
      </div>
      {currentResponse}
    </div>
  );
}
