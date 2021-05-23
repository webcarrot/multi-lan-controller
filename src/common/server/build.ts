import { Context } from "koa";
import { createReadStream } from "fs";
import * as accepts from "accepts";
import * as fresh from "fresh";
import {
  getFileProvider,
  Compression,
} from "@webcarrot/multi-lan-controller/common/lib/build/files";

const buildHandler = async (ctx: Context, next: () => Promise<any>) => {
  const path = ctx.path;
  const provider = path ? await getFileProvider(path) : null;
  if (provider) {
    ctx.compress = false;
    ctx.status = 200;
    const info = provider.getFileInfo(
      new Set([...accepts(ctx.req).encodings(), "none"]) as Set<Compression>
    );
    if (
      fresh(
        {
          "if-modified-since": ctx.get("If-Modified-Since"),
          "if-none-match": ctx.get("If-None-Match"),
          "cache-control": ctx.get("Cache-Control"),
        },
        {
          "last-modified": info.modified,
          etag: info.etag,
        }
      )
    ) {
      ctx.status = 304;
      return;
    }
    ctx.set({
      "Content-Type": info.type,
      "Content-Length": info.size.toString(),
      Etag: info.etag,
      "Last-Modified": info.modified,
      "Cache-Control": "public, max-age=31536000, immutable",
    });

    if (info.compression !== "none") {
      ctx.set({
        "Content-Encoding": info.compression,
        Vary: "Accept-Encoding",
      });
    }
    if (ctx.method === "GET") {
      ctx.body = createReadStream(info.path);
    }
  } else {
    return next();
  }
};

export const makeBuildHandler =
  () => (ctx: Context, next: () => Promise<any>) =>
    buildHandler(ctx, next);
