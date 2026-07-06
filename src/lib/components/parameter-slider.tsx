import { cn } from "@cloudflare/kumo";
import { Slider } from "@cloudflare/kumo/primitives/slider";

export interface ParameterSliderProps {
  /** e.g. "Temperature", "Top P", "Max output tokens". */
  label: string;
  value: number;
  onValueChange?: (value: number) => void;
  /** @default 0 */
  min?: number;
  /** @default 1 */
  max?: number;
  /** @default 0.01 */
  step?: number;
  /** Short helper under the control, e.g. "Higher = more creative". */
  hint?: string;
  /** Format the value pill, e.g. `(v) => v.toFixed(2)`. */
  format?: (value: number) => string;
  disabled?: boolean;
  className?: string;
}

/**
 * A labeled inference-parameter slider (temperature, top-p, …) with a
 * mono value pill — built on Kumo's Base UI Slider primitive and
 * styled entirely with Kumo tokens.
 */
export function ParameterSlider({
  label,
  value,
  onValueChange,
  min = 0,
  max = 1,
  step = 0.01,
  hint,
  format,
  disabled,
  className,
}: ParameterSliderProps) {
  const shown = format ? format(value) : String(value);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-kumo-default">{label}</span>
        <span className="rounded-md bg-kumo-recessed px-1.5 py-0.5 font-mono text-xs text-kumo-strong tabular-nums">
          {shown}
        </span>
      </div>

      <Slider.Root
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onValueChange={(next) =>
          onValueChange?.(Array.isArray(next) ? (next[0] ?? min) : next)
        }
      >
        <Slider.Control className="flex w-full touch-none items-center py-2 select-none">
          <Slider.Track className="h-1.5 w-full rounded-full bg-kumo-recessed">
            <Slider.Indicator className="rounded-full bg-kumo-brand" />
            <Slider.Thumb
              aria-label={label}
              className="size-4 rounded-full bg-kumo-base shadow-sm ring-1 ring-kumo-line transition-transform duration-150 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kumo-focus"
            />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>

      {hint && <p className="text-xs text-kumo-subtle">{hint}</p>}
    </div>
  );
}
