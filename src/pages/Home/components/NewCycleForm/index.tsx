import { useFormContext } from "react-hook-form";
import { FormContainer, TaskInput, MinutesInput } from "./styles";
import { useContext } from "react";
import { CyclesContext } from "../..";

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext);
  const { register } = useFormContext();

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        id="task"
        list="task-suggestions"
        placeholder="Dê um nome para o seu projeto"
        disabled={!!activeCycle}
        {...register("task")}
      />

      <datalist id="task-suggestions">
        <option value="Task 1" />
        <option value="Task 2" />
        <option value="Task 3" />
        <option value="Task 4" />
      </datalist>

      <label htmlFor="minutesAmount">Durante</label>
      <MinutesInput
        id="minutesAmount"
        type="number"
        placeholder="00"
        step={5}
        min={1}
        max={60}
        disabled={!!activeCycle}
        {...register("minutesAmount", { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </FormContainer>
  );
}
