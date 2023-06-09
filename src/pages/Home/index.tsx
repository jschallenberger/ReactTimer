import { Pause, Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { differenceInSeconds } from "date-fns";

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from "./styles";
import { useEffect, useState } from "react";
import { CountdownTimer } from "./components/CountdownTimer";
import { NewCycleForm } from "./components/NewCycleForm";

const newCycleFormValidationSchema = z.object({
  task: z.string().min(1, "Informe uma tarefa"),
  minutesAmount: z.number().min(1).max(60),
});

// Gets type from zod object schema using infer - remember to always
// have the typeof otherwise typescript cannot infer from JS variable
type NewCycleFormData = z.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptDate?: Date;
  completedDate?: Date;
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [secondsPassed, setSecondsPassed] = useState(0);
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const elapsedSeconds = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );

        if (elapsedSeconds >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, completedDate: new Date() };
              } else {
                return cycle;
              }
            })
          );
          document.title = "Timer";
          setSecondsPassed(totalSeconds);
          setActiveCycleId(null);
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
  }, [activeCycle, activeCycleId, totalSeconds]);

  function handleCreateNewCycle(data: NewCycleFormData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(newCycle.id);

    reset();
  }

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
    setActiveCycleId(null);
    document.title = "Timer";
  }

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

  const task = watch("task");
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <NewCycleForm />

        <CountdownTimer />

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <Pause size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
