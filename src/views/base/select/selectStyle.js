export const multiSelectStyles = (localTheme) => ({
  container: (base) => ({
    ...base,
    width: "100%",
    marginBottom: "1rem",
  }),
  control: (base) => ({
    ...base,
    backgroundColor: localTheme === "dark" ? "#212631" : "#fff",
    borderColor: "#323a49",
    borderWidth: "1px",
    borderRadius: "0.375rem",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: localTheme === "dark" ? "#21263" : "#fff",
    zIndex: 2050,
  }),
  menuList: (base) => ({
    ...base,
    backgroundColor: localTheme === "dark" ? "#21263" : "#fff",
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
  singleValue: (base) => ({
    ...base,
    color: localTheme === "dark" ? "#fff" : "#000",
  }),
  placeholder: (base) => ({
    ...base,
    color: localTheme === "dark" ? "#fff" : "#666",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: localTheme === "dark" ? "#444" : "#ddd",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: localTheme === "dark" ? "#fff" : "#000",
  }),
});
