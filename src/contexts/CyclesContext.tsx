import { ReactNode, createContext, useReducer, useState } from "react";

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptDate?: Date;
  completedDate?: Date;
}

// It is best to replicate the interface again in current Context then have the
// dependencies related to zod or any other library, it will create flexibility
// if we need to change the libraries, since it wont affect the context
interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  secondsPassed: number;
  markCurrentCycleAsCompleted: () => void;
  setAmountSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

interface CyclesContextProviderProps {
  children: ReactNode;
}

interface CyclesState {
  cycles: Cycle[];
  activeCycleId: string | null;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    (state: CyclesState, action: any) => {
      switch (action.type) {
        case "ADD_NEW_CYCLE":
          return {
            ...state,
            cycles: [...state.cycles, action.payload.newCycle],
            activeCycleId: action.payload.newCycle.id,
          };
        case "MARK_CURRENT_CYCLE_AS_COMPLETED":
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, completedDate: new Date() };
              } else {
                return cycle;
              }
            }),
            activeCycleId: null,
          };
        case "INTERRUPT_CURRENT_CYCLE":
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, interruptDate: new Date() };
              } else {
                return cycle;
              }
            }),
            activeCycleId: null,
          };
        default:
          return state;
      }
    },
    // Initialize state
    {
      cycles: [],
      activeCycleId: null,
    }
    // Initialize state
  );

  const [secondsPassed, setSecondsPassed] = useState(0);

  const { activeCycleId, cycles } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function markCurrentCycleAsCompleted() {
    dispatch({
      type: "MARK_CURRENT_CYCLE_AS_COMPLETED",
      payload: {
        activeCycleId,
      },
    });
  }

  function setAmountSecondsPassed(seconds: number) {
    setSecondsPassed(seconds);
  }

  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatch({
      type: "ADD_NEW_CYCLE",
      payload: {
        newCycle,
      },
    });
    setSecondsPassed(0);
  }

  function interruptCurrentCycle() {
    dispatch({
      type: "INTERRUPT_CURRENT_CYCLE",
      payload: {
        activeCycleId,
      },
    });
    document.title = "Timer";
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsCompleted,
        secondsPassed,
        setAmountSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
