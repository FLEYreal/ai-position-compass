/** Content counts; keep aligned with canonical questions when they are imported. */
export const questionnaireConfig = {
    coreQuestionCount: 66, // Amount of questions in the core test
    developerQuestionCount: 15, // Amount of questions in the developer-specific addition to the test
    completionTimeMinutes: 16 // Approximate amount of time it takes to finish a core test
} as const;

/** Presentation total for the selected questionnaire modules. */
export function getQuestionCount(includeDeveloper: boolean) {
    return (
        questionnaireConfig.coreQuestionCount +
        (includeDeveloper ? questionnaireConfig.developerQuestionCount : 0)
    );
}
