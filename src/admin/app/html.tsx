import * as React from "react";
import { ServerStyleSheets } from "@material-ui/styles";
import { STATE_ENDPOINT } from "@webcarrot/multi-lan-controller/endpoints";

const POLYFILL_FEATURES = ["fetch", "EventSource", "URL"];

const POLYFILL_URL = `https://polyfill.io/v3/polyfill.min.js?callback=onPolyfill&features=${POLYFILL_FEATURES.join(
  "%2C"
)}`;

const ENV =
  process.env.NODE_ENV === "development" ? "development" : "production.min";
const REACT_URL = `https://unpkg.com/react@${React.version}/umd/react.${ENV}.js`;
const REACT_DOM_URL = `https://unpkg.com/react-dom@${React.version}/umd/react-dom.${ENV}.js`;

const JS_LIBS = [POLYFILL_URL, REACT_URL, REACT_DOM_URL];

export const Html = ({
  sheets,
  title,
  stateId,
  html,
  meta,
}: {
  sheets: ServerStyleSheets;
  title: string;
  stateId: string;
  html: string;
  meta: ReadonlyArray<{
    name: string;
    content: string;
  }>;
}) => (
  <html lang="en-GB">
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      {meta.map(({ name, content }) => (
        <meta name={name} content={content} key={name} />
      ))}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <title>{title}</title>
      {sheets.getStyleElement()}
    </head>
    <body className="notranslate">
      <div
        id="app"
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
      <script src={`/${STATE_ENDPOINT}/${stateId}`} />
      {JS_LIBS.map((src) => (
        <script key={src} src={src} defer />
      ))}
    </body>
  </html>
);
