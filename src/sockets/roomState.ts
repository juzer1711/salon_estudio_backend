export interface Participant {

  socketId: string;

  uid: string;

  username: string;

  avatarUrl?: string;
}

export const roomParticipants:
Record<
  string,
  Participant[]
> = {};

export const socketRooms:
Record<
  string,
  string
> = {};