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

export type GameProps = {
  game: TGame;
  callBack: () => void;
};
