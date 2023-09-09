export const convertType = (value: any) => {
    if (value === "true") return true;
    if (value === "false") return false;
    if (!isNaN(Number(value))) return Number(value); // Convert string to number if possibl
    // it could be a string with a date, don't convert
    // exemple: kim-petras-early-entry-vip-package-2024-03-01, count "-" and if 3, then it's a date
    // @ts-ignore
    if (new Date(value) !== "Invalid Date" && !isNaN(new Date(value)) && value.split("-").length === 3)
        return new Date(value);
    return value;
};
