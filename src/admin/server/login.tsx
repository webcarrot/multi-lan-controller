import * as React from "react";

const CSS = `
html,body {
  min-height: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-y: hidden;
  overflow-x: auto;
  background: #f9f9f9;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}
#app {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  min-width: 325px;
  display: flex;
  justify-content: center;
  align-items: center;
}
`;

export const Login = ({
  title,
  error,
  meta,
}: {
  title: string;
  error: boolean;
  meta: ReadonlyArray<{
    name: string;
    content: string;
  }>;
}) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      {meta.map(({ name, content }) => (
        <meta name={name} content={content} key={name} />
      ))}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i&display=swap&subset=latin-ext"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <title>{title}</title>
      <style
        dangerouslySetInnerHTML={{
          __html: CSS,
        }}
      ></style>
    </head>
    <body className="notranslate">
      <form id="app" method="POST">
        <p>
          <label htmlFor="login">Login</label>
          <input type="text" name="login" id="login" />
        </p>
        <p>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </p>
        {error ? <p>Invalid login or password</p> : null}
        <p>
          <button type="submit">Login</button>
        </p>
      </form>
    </body>
  </html>
);
