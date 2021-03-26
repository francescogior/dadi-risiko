import * as React from "react";
import { useAddToHomescreenPrompt } from "./useAddToHomescreenPrompt";
import styled from "@emotion/styled";

const ButtonElement = styled.button({
  position: "fixed",
  bottom: "0",
  width: "100%",
  height: "50px",
  fontSize: 22,
  background: "rgba(0,0,0,.1)",
  outline: "none",
  border: "none",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
  "@media(hover: hover)": {
    ":hover": {
      opacity: 0.8,
    },
  },
});

export function AddToHomescreenButton() {
  const [promptable, promptToInstall, isInstalled] = useAddToHomescreenPrompt();

  return promptable && !isInstalled ? (
    <ButtonElement onClick={promptToInstall}>INSTALL APP</ButtonElement>
  ) : null;
}
