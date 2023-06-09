import { useContext, useEffect, useState } from "react";
import { CountdownContainer, Separator } from "./styles";
import { differenceInSeconds } from "date-fns";
import { CyclesContext } from "../..";

export function CountdownTimer() {
  const { activeCycle, activeCycleId, markCurrentCycleAsFinished } =
    useContext(CyclesContext);
  const [secondsPassed, setSecondsPassed] = useState(0);
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const elapsedSeconds = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );

        if (elapsedSeconds >= totalSeconds) {
          markCurrentCycleAsFinished();

          document.title = "Timer";
          setSecondsPassed(totalSeconds);
          clearInterval(interval);
        } else {
          setSecondsPassed(elapsedSeconds);
        }
      }, 1000);
    }
    return () => {
      clearInterval(interval);
      setSecondsPassed(0);
    };
  }, [activeCycle, activeCycleId, totalSeconds, markCurrentCycleAsFinished]);

  const currentSeconds = activeCycle ? totalSeconds - secondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, "0");
  const seconds = String(secondsAmount).padStart(2, "0");

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle]);

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  );
}
