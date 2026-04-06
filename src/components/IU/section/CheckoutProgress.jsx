import { Fragment } from "react";
import { Check } from "lucide-react";

const STEPS = [
  { id: 1, label: "Carrito" },
  { id: 2, label: "Envio" },
];

const getStepState = (stepId, activeStep) => {
  if (stepId < activeStep) return "completed";
  if (stepId === activeStep) return "active";
  return "upcoming";
};

const badgeClassNameByState = {
  completed:
    "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/20",
  active:
    "border-cyan-500 bg-cyan-50 text-cyan-700 shadow-sm shadow-cyan-500/10 dark:bg-cyan-950/40 dark:text-cyan-300",
  upcoming:
    "border-slate-300 bg-slate-50 text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

const labelClassNameByState = {
  completed: "text-slate-900 dark:text-slate-100",
  active: "text-slate-900 dark:text-slate-100",
  upcoming: "text-slate-500 dark:text-slate-400",
};

const connectorClassName = (isCompleted) =>
  `hidden h-px w-10 rounded-full sm:block lg:w-16 ${
    isCompleted ? "bg-emerald-400 dark:bg-emerald-500/70" : "bg-slate-200 dark:bg-slate-700"
  }`;

export default function CheckoutProgress({ activeStep = 1, className = "" }) {
  return (
    <div
      className={`mb-8 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/70 ${className}`}
      aria-label="Progreso del checkout"
    >
      <div className="flex flex-wrap items-center justify-center gap-y-3">
        {STEPS.map((step, index) => {
          const state = getStepState(step.id, activeStep);
          const isCompleted = state === "completed";

          return (
            <Fragment key={step.id}>
              <div className="flex items-center gap-3 px-1.5 sm:px-2.5">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition ${badgeClassNameByState[state]}`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                </span>
                <span className={`text-sm font-semibold transition ${labelClassNameByState[state]}`}>
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={connectorClassName(step.id < activeStep)}
                />
              ) : null}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
