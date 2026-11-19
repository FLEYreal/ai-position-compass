import type { QuestionDefinition } from "@/shared/config";
import type { DeepMutable } from "@/shared/lib/types/deep-mutable";

export type AnswerValue = -1 | -0.5 | 0 | 0.5 | 1;

// key describes the statement's direction; value describes the response.
// Secondary definitions inherit the parent's response and Unsure state.
export type QuestionAnswer = DeepMutable<QuestionDefinition> & {
    value: AnswerValue;
    unsure: boolean;
};

