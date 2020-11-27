import * as React from "react";
import { render } from "react-dom";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import App from "./App";

const rootElement = document.getElementById("root");
render(<App />, rootElement);

serviceWorkerRegistration.register();
