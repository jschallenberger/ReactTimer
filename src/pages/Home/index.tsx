import { Pause, Play } from "phosphor-react";
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";
import { useContext } from "react";
import { CountdownTimer } from "./components/CountdownTimer";
import { NewCycleForm } from "./components/NewCycleForm";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { CyclesContext } from "../../contexts/CyclesContext";

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext);

  const newCycleFormValidationSchema = z.object({
    task: z.string().min(1, "Informe uma tarefa"),
    minutesAmount: z.number().min(1).max(60),
  });

  // Gets type from zod object schema using infer - remember to always
  // have the typeof otherwise typescript cannot infer from JS variable
  type NewCycleFormData = z.infer<typeof newCycleFormValidationSchema>;

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  const task = watch("task");
  const isSubmitDisabled = !task;

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data);
    reset();
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>

        <CountdownTimer />
        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
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
