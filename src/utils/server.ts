import { socket } from "../socket";
import { Message, Result } from "../types/server";

export async function emitToServer<T extends keyof Message>(
  id: T,
  data: Message[T]
) {
  socket.emit(id, data);
}

export async function getServerResponse<T extends keyof Message>(
  id: T
): Promise<Result<Message[T]>> {
  return new Promise((resolve) => {
    socket.once(id, (data: Result<Message[T]>) => {
      resolve(data);
    });
  });
}

export function attachServerListener<T extends keyof Message>(
  id: T,
  cb: (data: Result<Message[T]>) => void
) {
  socket.on(id, cb);
}

export function removeServerListener<T extends keyof Message>(
  id: T,
  cb?: (data: Result<Message[T]>) => void
) {
  socket.off(id, cb);
}
