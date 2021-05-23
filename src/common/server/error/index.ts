import { Context } from "koa";
import { getErrorHtml } from "./errorHtml";

type ErrorMessage = {
  message: string;
  code: number;
};

export { getErrorHtml };

export const errorHandler = async (ctx: Context, err: any) => {
  console.error(err);
  let errors: ReadonlyArray<ErrorMessage> = [];
  let items: ReadonlyArray<any>;
  if (err && err.errors && err.errors instanceof Array) {
    items = err.items && err.items instanceof Array ? err.items : undefined;
    errors = (err.errors as Array<ErrorMessage>)
      .map((el: any) => {
        if (el && el.message) {
          return {
            message: el.message,
            code: el.code || 500,
          };
        } else {
          return null;
        }
      })
      .filter((err) => err !== null);
  }
  if (!errors.length && err.message) {
    errors = [
      {
        message: err.message,
        code: err.status || 500,
      },
    ];
  }
  if (!errors.length) {
    errors = [
      {
        message: "Unknown error",
        code: 500,
      },
    ];
  }

  ctx.status =
    errors[0].code && typeof errors[0].code === "number" ? errors[0].code : 500;
  if (ctx.accepts("html")) {
    ctx.type = "html";
    const url = `${ctx.protocol}://${ctx.host}`;
    ctx.body = await getErrorHtml(
      url,
      errors.map(({ message, code = 0 }) => `[${code}] ${message}`),
      false
    );
  } else {
    ctx.type = "json";
    ctx.body = JSON.stringify({
      errors,
      items,
    });
  }
};
