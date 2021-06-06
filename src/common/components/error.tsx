import * as React from "react";

type State = {
  hasError: boolean;
  error: Error;
};

const STYLES = `
html.error,
html.error body {
  font-family: monospace;
  margin: 0;
  padding: 0;
  background: blue;
  color: white;
}
.errorInfo {
  padding: 1rem;
  margin: 0 auto;
  max-width: 70rem;
}
.errorInfo h1 {
  text-align: center;
}
.errorInfo p {
  fontSize: 1.5rem;
}
.errorInfo h1,
.errorInfo h2,
.errorInfo p,
.errorInfo pre,
.errorInfo button {
  font-family: monospace;
}
.errorInfo pre {
  white-space: pre-wrap;
}
.errorInfo button {
  margin: 0.2rem;
  padding: 0.5rem;
  cursor: pointer;
  background: white;
  color: darkblue;
  font-size: 1rem;
  text-transform: uppercase;
  border: 2px solid darkblue;
  border-radius: 0.2rem;
  outline: 0;
}
.errorInfo button:focus {
  text-decoration: underline;
}
.errorInfo button:hover {
  background: darkblue;
  color: white;
}
.errorInfo button:active {
  background: darkslateblue;
  color: white;
}
`;

const DisplayError = ({
  error,
  onClearError,
}: {
  error: Error;
  onClearError: () => void;
}) => {
  return (
    <main className="errorInfo">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <h1>Something went wrong!</h1>
      <h2>{error.name}</h2>
      <p>{error.message}</p>
      <pre>{error.stack}</pre>
      <button onClick={onClearError}>Clear error</button>
    </main>
  );
};

export class ErrorHandler extends React.Component {
  state: State = { hasError: false, error: null };

  componentDidCatch(error: Error) {
    this.setState({ hasError: true, error });
    if (typeof document !== "undefined") {
      document.body.parentElement.className = "error";
    }
  }

  handleClearError = () => {
    this.setState({ hasError: false, error: null });
    if (typeof document !== "undefined") {
      document.body.parentElement.className = "";
    }
  };

  render() {
    const { error, hasError } = this.state;
    if (hasError) {
      return (
        <DisplayError error={error} onClearError={this.handleClearError} />
      );
    }
    return this.props.children;
  }
}
