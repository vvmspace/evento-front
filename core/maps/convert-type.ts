export const convertType = (value: any) => {
    if (value === "true") return true;
    if (value === "false") return false;
    if (!isNaN(Number(value))) return Number(value); // Convert string to number if possible
    if (new Date(value) !== "Invalid Date" && !isNaN(new Date(value)))
        return new Date(value);
    return value;
};
