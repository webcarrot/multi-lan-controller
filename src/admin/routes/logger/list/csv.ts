type CSVCol = number | string | string[];

type CSVLine = Array<CSVCol>;

const makeCsvCol = (col: CSVCol): string => {
  switch (typeof col) {
    case "number":
      return `${col}`;
    case "string":
      return JSON.stringify(col);
    case "object":
      if (col instanceof Array && col.length) {
        return JSON.stringify(`${col.map((v) => `${v}`).join(",")}`);
      } else {
        return JSON.stringify("");
      }
    default:
      return JSON.stringify("");
  }
};
const makeCsvLine = (line: CSVLine): string => line.map(makeCsvCol).join(";");
