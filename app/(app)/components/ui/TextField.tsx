import { InputLimitsKey } from "@/lib/inputLimits";
import { useInputLimits } from "../hooks/useInputLimits";

type BaseProps = {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  limit: InputLimitsKey;
  placeholder?: string;
  className?: string;
  showLimit?: boolean;
  maxHeight?: number | string;
  disabled?: boolean;
};

type Props =
  | (BaseProps & { as?: "input"; type?: string })
  | (BaseProps & { as: "textarea"; rows?: number });

export function TextField({
  label,
  value,
  onChange,
  maxHeight,
  limit,
  placeholder,
  className = "",
  as = "input",
  showLimit = false,
  disabled = false,
  ...rest
}: Props) {
  const { max, enforce } = useInputLimits(limit);
  const Component: any = as;

  const isMax = value.length >= max;

  return (
    <label className="block">
      {(label || showLimit || isMax) && (
        <div className="mb-1 flex items-center justify-between">
          {label ? (
            <span className="text-xs font-medium text-secondary">{label}</span>
          ) : (
            <span />
          )}

          {/* Right: counter + warning */}
          <div className="flex items-center gap-2 text-[10px]">
            {isMax && (
              <span className="text-red-500 font-medium">Limit reached</span>
            )}
            {showLimit && (
              <span className="text-secondary">
                {value.length}/{max}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Input / Textarea */}
      <Component
        {...rest}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e: any) => onChange(enforce(e.target.value))}
        className={`input-base ${className}`}
        style={as === "textarea" && maxHeight ? { maxHeight } : undefined}
      />
    </label>
  );
}
