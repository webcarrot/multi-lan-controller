import * as React from "react";
import copyToClipboard from "copy-to-clipboard";

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
.errorInfo svg {
  width: 10rem;
  height: 10rem;
  display: block;
  margin: 0 auto;
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
  onCopyError,
}: {
  error: Error;
  onClearError: () => void;
  onCopyError: () => void;
}) => {
  return (
    <main className="errorInfo">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <svg viewBox="0 0 512 512">
        <path
          d="M460.8,136.578h-93.867c-4.719,0-8.533,3.823-8.533,8.533v3.917l-128.307,4.582c-4.71,0.171-8.397,4.122-8.218,8.832
    c0.154,4.71,4.207,8.337,8.832,8.226l127.693-4.565v49.749l-60.587,6.059c-4.523,0.452-7.902,4.378-7.671,8.917
    c0.222,4.54,3.968,8.107,8.525,8.107c14.114,0,25.6,11.486,25.6,25.6c0,14.114-11.486,25.6-25.6,25.6H281.6
    c-4.719,0-8.533,3.823-8.533,8.533s3.814,8.533,8.533,8.533c14.114,0,25.6,11.486,25.6,25.6s-11.486,25.6-25.6,25.6H256
    c-4.719,0-8.533,3.823-8.533,8.533s3.814,8.533,8.533,8.533c8.934,0,17.067,8.132,17.067,17.067
    c0,8.61-8.457,17.067-17.067,17.067H145.067c-37.026,0-55.714-7.902-75.494-16.273c-14.66-6.204-29.773-12.604-52.506-16.606
    V186.097c41.225-9.429,91.332-31.249,149.094-64.939c6.272-3.644,12.382-7.305,18.338-10.931
    c15.241-9.31,35.507-10.402,49.263-2.679c6.255,3.507,13.705,10.419,13.705,23.39c0,4.71,3.814,8.533,8.533,8.533
    c4.71,0,8.533-3.823,8.533-8.533c0-16.563-7.962-30.157-22.417-38.272c-19.174-10.778-45.901-9.591-66.509,2.987
    c-5.862,3.575-11.878,7.177-18.039,10.76C98.193,141.041,47.488,162.716,6.852,170.84C2.876,171.633,0,175.132,0,179.202v204.8
    c0,4.25,3.123,7.842,7.322,8.448c24.721,3.533,40.414,10.172,55.603,16.597c20.471,8.661,41.651,17.621,82.142,17.621H256
    c17.86,0,34.133-16.273,34.133-34.133c0-6.229-1.775-12.134-4.838-17.229c21.803-1.877,38.972-20.224,38.972-42.505
    c0-10.829-4.062-20.736-10.735-28.271c16.213-6.042,27.802-21.692,27.802-39.996c0-11.042-4.224-21.129-11.136-28.706
    l28.706-2.876c1.084,3.465,4.198,6.025,8.03,6.025h93.841h0.026h0.034c28.211-0.017,51.166-22.972,51.166-51.2
    C512,159.542,489.028,136.578,460.8,136.578z M375.467,221.912v-64.648v-3.618h38.588l-27.307,68.267H375.467z M405.137,221.912
    l21.53-53.828l21.521,53.828H405.137z M466.355,221.349l-27.085-67.703h21.53c18.825,0,34.133,15.309,34.133,34.133
    C494.933,204.691,482.534,218.678,466.355,221.349z"
          fill="white"
        />
        <path
          d="M428.169,310.931c-5.581,8.081-18.568,28.075-18.568,38.98c0,14.114,11.477,25.6,25.6,25.6
    c14.114,0,25.6-11.486,25.6-25.6c0-10.906-12.996-30.899-18.577-38.98C439.023,306.315,431.369,306.315,428.169,310.931z
     M435.2,358.445c-4.71,0-8.533-3.831-8.533-8.525c0.06-2.611,3.61-10.044,8.533-18.33c4.915,8.277,8.465,15.71,8.533,18.321
    C443.733,354.614,439.902,358.445,435.2,358.445z"
          fill="white"
        />
      </svg>
      <h1>Something went wrong!</h1>
      <h2>{error.name}</h2>
      <p>{error.message}</p>
      <pre>{error.stack}</pre>
      <button onClick={onClearError}>Clear error</button>
      <button onClick={onCopyError}>
        Copy this bug - be sure to send it to developer!
      </button>
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

  handleCopyError = () => {
    const error = this.state.error;
    copyToClipboard(`STARDATE: ${Date.now()} / ${new Date().toUTCString()}
URL: ${document.location}
NAME: ${error.name}
MESSAGE: ${error.message}
STACK:
${error.stack}`);
  };

  render() {
    const { error, hasError } = this.state;
    if (hasError) {
      return (
        <DisplayError
          error={error}
          onClearError={this.handleClearError}
          onCopyError={this.handleCopyError}
        />
      );
    }
    return this.props.children;
  }
}
