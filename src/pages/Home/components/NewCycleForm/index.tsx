import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormContainer, TaskInput, MinutesInput } from "./styles";
import { z } from "zod";

export function NewCycleForm() {
  const newCycleFormValidationSchema = z.object({
    task: z.string().min(1, "Informe uma tarefa"),
    minutesAmount: z.number().min(1).max(60),
  });

  // Gets type from zod object schema using infer - remember to always
  // have the typeof otherwise typescript cannot infer from JS variable
  type NewCycleFormData = z.infer<typeof newCycleFormValidationSchema>;

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });
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
