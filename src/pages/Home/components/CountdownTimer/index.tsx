import { useContext, useEffect } from "react";
import { CountdownContainer, Separator } from "./styles";
import { differenceInSeconds } from "date-fns";
import { CyclesContext } from "../../../../contexts/CyclesContext";

export function CountdownTimer() {
  const {
    activeCycle,
    activeCycleId,
    secondsPassed,
    markCurrentCycleAsCompleted,
    setAmountSecondsPassed,
  } = useContext(CyclesContext);
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const elapsedSeconds = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate)
        );

        if (elapsedSeconds >= totalSeconds) {
          markCurrentCycleAsCompleted();

          document.title = "Timer";
          setAmountSecondsPassed(totalSeconds);
          clearInterval(interval);
        } else {
          setAmountSecondsPassed(elapsedSeconds);
        }
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [
    activeCycle,
    activeCycleId,
    totalSeconds,
    markCurrentCycleAsCompleted,
    setAmountSecondsPassed,
  ]);

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
