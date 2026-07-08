import type { InputHTMLAttributes } from "react"

type TextFieldProps = InputHTMLAttributes<HTMLInputElement>

export default function TextField({ className, ...props }: TextFieldProps) {
  const classes = ["ui-input", "text-sm", className ?? ""].filter(Boolean).join(" ")

  return <input {...props} className={classes} />
}