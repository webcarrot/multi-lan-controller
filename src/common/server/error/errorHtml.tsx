import * as React from "react";
import { render } from "@webcarrot/multi-lan-controller/common/utils/render";

const STYLES = `
html,body {
  padding: 0;
  margin: 0;
  background: #2E3A46;
}
@keyframes startAnimation {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}
div {
  position: absolute;
  top: 50%;
  left: 50%;
  background: #fff;
  transform: translate(-50%,-50%);
  width: 400px;
  height: 100px;
  padding: 170px 20px;
  box-sizing: content-box;
  border-radius: 220px;
}
.error {
  text-align: center;
}
`;

const Html = ({
  url,
  messages,
  retry,
}: {
  url: string;
  messages: string[];
  retry: boolean;
}) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width, user-scalable=no" />
      <title>Multi Lan Controller</title>
      <style>{STYLES}</style>
      {retry ? <script src={`${url}/start.js`} /> : null}
    </head>
    <body>
      <div>
        {retry ? (
          messages.map((message, no) => (
            <p key={no} className="error">
              {message}
            </p>
          ))
        ) : (
          <p className="error">Internal Server Error</p>
        )}
      </div>
    </body>
  </html>
);

export const getErrorHtml = async (
  url: string,
  messages: string[],
  retry: boolean
): Promise<string> =>
  `<!DOCTYPE html>${await render(
    <Html url={url} messages={messages} retry={retry} />
  )}`;
