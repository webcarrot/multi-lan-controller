import * as React from "react";

const CSS = `
html,body {
  min-height: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-y: hidden;
  overflow-x: auto;
  background: #333;
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
form {
  padding: 16px;
  margin: 0;
  border: 1px solid #aaa;
  background: #eee;
}
label,input, button {
  display: block;
}
label {
  margin-bottom: 4px;
  font-size: 0.7em;
  text-transform: lowercase;
}
button {
  width: 100%;
  cursor: pointer;
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
      <title>{title}</title>
      <style
        dangerouslySetInnerHTML={{
          __html: CSS,
        }}
      ></style>
    </head>
    <body>
      <div id="app">
        <form method="POST">
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
      </div>
    </body>
  </html>
);
