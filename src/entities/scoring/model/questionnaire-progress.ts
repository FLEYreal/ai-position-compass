import {
    questions,
    questionnaireVersion,
    type QuestionDefinition,
} from '@/shared/config';

export type AnswerValue = -1 | -0.5 | 0 | 0.5 | 1;
export type QuestionResponse = AnswerValue | 'unsure';

export type QuestionAnswer = QuestionDefinition & {
    value: AnswerValue;
    unsure: boolean;
};

export type QuestionnaireProgress = {
    questionnaireVersion: number;
    answersById: Partial<Record<string, QuestionResponse>>;
    currentQuestionId: string;
    status: 'not-started' | 'in-process' | 'finished';
    includeDeveloper: boolean;
};

const coreQuestions = questions.filter(({ modelId }) => modelId === 'core');

export function getSelectedQuestions(includeDeveloper: boolean) {
    return includeDeveloper ? questions : coreQuestions;
}

export function newQuestionnaireProgress(
    includeDeveloper = false,
): QuestionnaireProgress {
    return {
        questionnaireVersion,
        answersById: {},
        currentQuestionId: coreQuestions[0].id,
        status: 'not-started',
        includeDeveloper,
    };
}

export function isQuestionResponse(value: unknown): value is QuestionResponse {
    return (
        value === -1 ||
        value === -0.5 ||
        value === 0 ||
        value === 0.5 ||
        value === 1 ||
        value === 'unsure'
    );
}

export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export class QuestionnaireRestoreError extends Error {
    readonly status: 'invalid' | 'incompatible' | 'unavailable';

    constructor(status: 'invalid' | 'incompatible' | 'unavailable') {
        super(status);
        this.status = status;
    }
}

export function parseQuestionnaireProgress(
    value: unknown,
): QuestionnaireProgress {
    if (!isRecord(value) || !Number.isInteger(value.questionnaireVersion)) {
        throw new QuestionnaireRestoreError('invalid');
    }
    if (value.questionnaireVersion !== questionnaireVersion) {
        throw new QuestionnaireRestoreError('incompatible');
    }

    const { answersById, currentQuestionId, status, includeDeveloper } = value;
    if (
        !isRecord(answersById) ||
        typeof currentQuestionId !== 'string' ||
        typeof includeDeveloper !== 'boolean' ||
        (status !== 'not-started' &&
            status !== 'in-process' &&
            status !== 'finished')
    ) {
        throw new QuestionnaireRestoreError('invalid');
    }

    const selectedQuestions = getSelectedQuestions(includeDeveloper);
    const selectedIds = new Set<string>(selectedQuestions.map(({ id }) => id));
    const currentIndex = selectedQuestions.findIndex(
        ({ id }) => id === currentQuestionId,
    );
    const responses = Object.entries(answersById);
    if (
        currentIndex === -1 ||
        (status === 'finished' && responses.length !== selectedIds.size) ||
        (status === 'not-started' && responses.length !== 0) ||
        selectedQuestions
            .slice(0, currentIndex)
            .some(({ id }) => !Object.hasOwn(answersById, id))
    ) {
        throw new QuestionnaireRestoreError('invalid');
    }

    const validatedAnswers: QuestionnaireProgress['answersById'] = {};
    for (const [id, response] of responses) {
        if (!selectedIds.has(id) || !isQuestionResponse(response)) {
            throw new QuestionnaireRestoreError('invalid');
        }
        validatedAnswers[id] = response;
    }

    return {
        questionnaireVersion,
        answersById: validatedAnswers,
        currentQuestionId,
        status,
        includeDeveloper,
    };
}
