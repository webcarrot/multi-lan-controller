import * as React from "react";
import { ServerStyleSheets } from "@material-ui/styles";
import { STATE_ENDPOINT } from "@webcarrot/multi-lan-controller/endpoints";

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
    </body>
  </html>
);
