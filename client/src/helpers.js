import { uniq } from "lodash";
export const SOLVED_CUBE =
  "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";
export const ORDER = uniq(SOLVED_CUBE);

export function getFaceColors(theme) {
  return {
    U: theme.palette.background.paper,
    D: theme.palette.secondary.dark,
    F: theme.palette.success.dark,
    B: theme.palette.info.dark,
    L: theme.palette.warning.dark,
    R: theme.palette.error.dark,
  };
}
export default {};
