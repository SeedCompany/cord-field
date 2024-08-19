import { GridColDef } from '@mui/x-data-grid';

export const findIndexOrThrow = (
  stringInput: string,
  inputArray: GridColDef[]
) => {
  const index = inputArray.findIndex((item) => item.field === stringInput);
  return index === -1
    ? (() => {
        throw new Error(`${stringInput} not found`);
      })()
    : index;
};
