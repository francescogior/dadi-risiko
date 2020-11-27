import React from "react";
import styled from "@emotion/styled";
import { Global as GlobalStyle, css } from "@emotion/core";

const GLOBAL_STYLE = css`
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
`;
const BACKGROUND_COLOR = '#0e1815'
const DICE_SIZE = 80;
const DICE_MARGIN = 10;

type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

const rollDice = (): DiceValue =>
  (Math.floor(Math.random() * 6) + 1) as DiceValue;

type DiceProps = {
  color: string;
  isDisabled: boolean;
  isTappable: boolean;
  isBordered: boolean;
  hasReducedOpacity: boolean;
};

const DiceShape = styled.div(
  ({ color, isDisabled, isTappable, isBordered, hasReducedOpacity }: DiceProps) => ({
    width: DICE_SIZE,
    height: DICE_SIZE,
    background: color,
    borderRadius: DICE_SIZE / 10,
    display: "flex",
    alignItems: "center",
    color: "white",
    margin: DICE_MARGIN,
    outline: "none",
    cursor: isTappable ? "pointer" : "default",
    opacity: isDisabled || hasReducedOpacity ? 0.2 : 1,
    pointerEvents: isTappable ? undefined : "none",
    userSelect: "none",
    transition: "transform .3s",
    "@media(hover: hover)": {
      ":hover": { opacity: isDisabled || hasReducedOpacity ? isTappable ? 0.3 : 0.9 : isTappable ? 0.6 : 0.9 }
    },
    ":active": {
      opacity: isDisabled || hasReducedOpacity ? isTappable ? 0.4 : 0.8 : isTappable ? 0.7 : 0.8,
      transform: "scale(.98)"
    },
    boxSizing: "border-box",
    // border: isBordered ? `${DICE_SIZE/10}px solid black` : "unset",
    boxShadow: isBordered ? `0 0 ${DICE_SIZE / 1.5}px rgba(255,255,255,.5);` : 'unset',
  })
);

const DiceValueDisplay = styled.div({
  width: "100%",
  textAlign: "center",
  color: "white",
  fontWeight: 900,
  fontSize: DICE_SIZE * 0.7,
  fontFamily: "sans-serif"
});

const Board = styled.div({
  background: BACKGROUND_COLOR,
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
});

const Side = styled.div({
  display: "flex"
});

const RollButton = styled.div({
  width: 3 * DICE_SIZE + 4 * DICE_MARGIN,
  height: DICE_SIZE,
  lineHeight: `${DICE_SIZE}px`,
  textAlign: "center",
  margin: DICE_MARGIN,
  cursor: "pointer",
  fontFamily: "sans-serif",
  color: "#32281f",
  background: "#699969",
  textTransform: "uppercase",
  fontWeight: 900,
  borderRadius: DICE_SIZE / 10,
  userSelect: "none",
  fontSize: DICE_SIZE * 0.7,
  transition: "transform .3s",
  "@media(hover: hover)": {
    ":hover": { opacity: 0.9 }
  },
  ":active": {
    opacity: 0.8,
    transform: "scale(.98)"
  }
});


const X = ({ size }: { size: number, }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    stroke={BACKGROUND_COLOR}
    viewBox={`0 0 ${size} ${size}`}
    style={{ position: 'absolute' }}
  >
    <line x1={0} y1={0} x2={size} y2={size} strokeWidth={size / 10}></line>
    <line x1={size} y1={0} x2={0} y2={size} strokeWidth={size / 10}></line>
  </svg>
)

type RisikoDiceType = "defense" | "attack";
type RisikoDiceProps = {
  type: RisikoDiceType;
  value: DiceValue;
  onClick: () => void;
  isDisabled: boolean;
  isToggable: boolean;
  isWinning: boolean;
};

const risikoDiceTypeToColor: Record<RisikoDiceType, string> = {
  defense: "#2f49b1",
  attack: "#ff3f00"
};

function RisikoDice({
  type,
  value,
  onClick,
  isDisabled,
  isToggable,
  isWinning
}: RisikoDiceProps) {
  return (
    <DiceShape
      onClick={onClick}
      color={risikoDiceTypeToColor[type]}
      isDisabled={isDisabled}
      isTappable={isToggable}
      isBordered={isWinning && !isDisabled}
      hasReducedOpacity={!isWinning && !isDisabled}
    >
      {isDisabled && <X size={DICE_SIZE} />}
      <DiceValueDisplay>{value || "-"}</DiceValueDisplay>
    </DiceShape>
  );
}

type NumberOfDices = 1 | 2 | 3;

function rollRisikoDices(numberOfDices: NumberOfDices) {
  return [rollDice(), rollDice(), rollDice()]
    .slice(0, numberOfDices)
    .sort((a, b) => b - a);
}

export default function App() {
  const [numberOfAttackers, setNumberOfAttackers] = React.useState<
    NumberOfDices
  >(3);
  const [numberOfDefenders, setNumberOfDefenders] = React.useState<
    NumberOfDices
  >(3);
  const [rolls, rollTheDices] = React.useState(0);
  const [a1, a2, a3] = React.useMemo(
    () => rollRisikoDices(numberOfAttackers),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rolls]
  );

  const [d1, d2, d3] = React.useMemo(
    () => rollRisikoDices(numberOfDefenders),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rolls]
  );

  const toggleActive = React.useCallback(
    (currentNumber: number, setNumber: (m: NumberOfDices) => void, diceIndex: number) => () => {
      if (currentNumber === 2) {
        if (diceIndex === 1) setNumber(1)
        if (diceIndex === 2) setNumber(3)
      }
      else setNumber(2)
    },
    []
  );

  return (
    <Board>
      <GlobalStyle styles={GLOBAL_STYLE} />
      <Side>
        {[a1, a2, a3].map((value, diceIndex) => (
          <RisikoDice
            type="attack"
            isDisabled={diceIndex + 1 > numberOfAttackers}
            value={value}
            key={diceIndex}
            isWinning={value > [d1, d2, d3][diceIndex]}
            onClick={toggleActive(numberOfAttackers, setNumberOfAttackers, diceIndex)}
            isToggable={diceIndex > 0}
          />
        ))}
      </Side>

      <Side>
        {[d1, d2, d3].map((value, diceIndex) => (
          <RisikoDice
            type="defense"
            value={value}
            isWinning={value >= [a1, a2, a3][diceIndex]}
            isDisabled={diceIndex + 1 > numberOfDefenders}
            key={diceIndex}
            onClick={toggleActive(numberOfDefenders, setNumberOfDefenders, diceIndex)}
            isToggable={diceIndex > 0}
          />
        ))}
      </Side>

      <RollButton
        onClick={() => {
          rollTheDices(rolls + 1);
        }}
      >
        <span role="img" aria-label="dice">
          🎲
        </span>
      </RollButton>
    </Board>
  );
}
