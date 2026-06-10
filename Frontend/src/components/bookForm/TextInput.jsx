export default function TextInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
  ...rest
}) {
  return (
    <input
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-invalid={error ? "true" : "false"}
      className={[
        "w-full sm:w-[26.5rem] md:w-full px-3.5 py-2.5 rounded-xl bg-white text-sm text-black",
        "placeholder:text-black outline-none transition-all duration-200",
        "border",
        "focus:ring-2 focus:ring-[#0F766E]/25 focus:border-[#0F766E]",
        error ? "border-[#DC2626]/60" : "border-black",
      ].join(" ")}
    />
  );
}
