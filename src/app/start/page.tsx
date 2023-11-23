"use client";
import { useEffect, useRef, useState } from "react";
import Game from "../../components/game/page";
import { TGame } from "../models/models";

export type Room = {
  id: number;
  possibleDirections: string;
};

export default function Start() {
  const [game, setGame] = useState<TGame>();
  const [allGames, setAllGames] = useState<TGame[]>();
  const [gameStarted, setGameStarted] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  const [rerender, setRerender] = useState(false);

  //   useEffect(() => {
  //     const getRooms = async () => {
  //       const response = await (
  //         await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/room`)
  //       ).json();
  //       setRooms(response);
  //     };

  //     getRooms();
  //   }, [rooms]);

  useEffect(() => {
    getAllGames();
  }, [rerender]);

  const reloadPage = () => {
    setRerender(!rerender);
  };

  const getAllGames = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/game`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    }).then((res) => {
      res.json().then((json) => {
        setAllGames(json);
      });
    });
  };
  const createGame = (bodyData: { name: string; numberOfRooms: number }) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/game`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    }).then((res) => {
      res.json().then((json) => {
        setGame(json);
      });
    });
  };

  const startCommands = ["game", "start", "begin", "play"];

  const handlePlayerAction = async (formData: FormData) => {
    ref?.current?.reset();

    const gameName = formData.get("gameName");
    const numberOfRooms = formData.get("rooms");
    setGameStarted(true);
    createGame({
      name: gameName as string,
      numberOfRooms: numberOfRooms as unknown as number,
    });

    // alert("New game started, good luck");
  };

  //   const startGame = () => {};
  return (
    <div className="w-1/2 m-auto mt-20">
      Welcome to the everchanging pirates dungeon. Can you find my booty?
      <form
        ref={ref}
        action={handlePlayerAction}
        className="grid grid-cols-1 border border-white"
      >
        <label>Game Name:</label>
        <input
          type="text"
          name="gameName"
          className="bg-black border-b"
          placeholder="what to call this game?"
        />

        <label>Number of rooms</label>
        <input
          type="number"
          name="rooms"
          className="bg-black border-b"
          placeholder="how many rooms?"
        />

        <input type="submit" value="Start new game" className="bg-green-950" />
      </form>
      <form
        action={getAllGames}
        className="grid grid-cols-1 border border-white"
      >
        <input
          type="submit"
          value="View existing games"
          className="bg-green-950"
        />
      </form>
      {game && <Game game={game} callBack={reloadPage} />}
      {allGames && allGames.some((game) => game.active) ? (
        <Game
          callBack={reloadPage}
          game={allGames.find((game) => game.active) as TGame}
        />
      ) : (
        allGames?.map((game) => {
          return (
            <div key={game.id}>
              <Game game={game} callBack={reloadPage} />
            </div>
          );
        })
      )}
    </div>
  );
}
