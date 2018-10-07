import { Refinement } from "./Context";
import { assertNever } from "../../utils";

export const hasRefinements = (refinements: Refinement[]): boolean => {
  return refinements.some(refinement => {
    switch (refinement.kind) {
      case "list":
        return refinement.labels.length > 0;
      default:
        return assertNever(refinement);
    }
  });
};
