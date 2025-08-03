export const multiSelectStyles = (localTheme) => ({
  container: (base) => ({
    ...base,
    width: "100%",
    marginBottom: "1rem",
  }),
  control: (base, { isDisabled }) => ({
    ...base,
    backgroundColor: isDisabled
      ? localTheme === "dark"
        ? "#2a2f3a" // abu-abu gelap untuk dark mode disabled
        : "#e9ecef" // abu-abu terang untuk light mode disabled
      : localTheme === "dark"
        ? "#212631" // normal dark mode
        : "#fff",   // normal light mode
    borderColor: localTheme === "dark" ? "#323a49" : "#ced4da",
    borderWidth: "1px",
    borderRadius: "0.375rem",
    cursor: isDisabled ? "not-allowed" : "default",
    opacity: isDisabled ? 0.65 : 1, // mirip gaya CoreUI disabled
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: localTheme === "dark" ? "#212631" : "#fff",
    zIndex: 2050,
  }),
  menuList: (base) => ({
    ...base,
    backgroundColor: localTheme === "dark" ? "#212631" : "#fff",
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected
      ? localTheme === "dark"
        ? "#555"
        : "#2684FF"
      : isFocused
      ? localTheme === "dark"
        ? "#444"
        : "#eee"
      : localTheme === "dark"
      ? "#333"
      : "#fff",
    color:
      localTheme === "dark"
        ? isSelected
          ? "#fff"
          : "#ddd"
        : isSelected
        ? "#fff"
        : "#000",
    cursor: "pointer",
  }),
  singleValue: (base, { isDisabled }) => ({
    ...base,
    color: isDisabled
      ? localTheme === "dark"
        ? "#a0a0a0"
        : "#6c757d"
      : localTheme === "dark"
        ? "#fff"
        : "#000",
  }),
  placeholder: (base, { isDisabled }) => ({
    ...base,
    color: isDisabled
      ? localTheme === "dark"
        ? "#a0a0a0"
        : "#6c757d"
      : localTheme === "dark"
        ? "#fff"
        : "#666",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: localTheme === "dark" ? "#444" : "#ddd",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: localTheme === "dark" ? "#fff" : "#000",
  }),
  input: (base, { isDisabled }) => ({
    ...base,
    color: isDisabled
      ? localTheme === "dark"
        ? "#a0a0a0"
        : "#6c757d"
      : localTheme === "dark"
        ? "#fff"
        : "#000",
  }),
});
