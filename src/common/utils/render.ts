import { renderToNodeStream } from "react-dom/server";

export const render = (reactComponent: JSX.Element) =>
  new Promise<string>((resolve, reject) => {
    const body: Buffer[] = [];
    let length = 0;
    const bodyStream = renderToNodeStream(reactComponent);
    bodyStream.on("data", (chunk: Buffer) => {
      body.push(chunk);
      length += chunk.length;
    });
    bodyStream.on("error", err => {
      reject(err);
    });
    bodyStream.on("end", () => {
      resolve(Buffer.concat(body, length).toString());
    });
  });
