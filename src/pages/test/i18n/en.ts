const downloadableModelsHint =
    "Some companies publish their AI models as files anyone can download and run without an internet connection, e.g. OpenAI's gpt-oss (2025). Others, like ChatGPT, are only available through the company's service.";

export default {
    'test.heading': 'Your position, one question at a time.',

    // Suggestions
    'research.suggestions.L5':
        'To train AI, companies hire contractors, often in lower-income countries, to tag data and review harmful content.',
    'research.suggestions.O1': downloadableModelsHint,
    'research.suggestions.A3':
        'AI is trained on special chips made by a few companies. The US restricts selling some of them to China.',
    'research.suggestions.E3':
        'AI runs in data centers that use large amounts of electricity. In parts of the US, power prices have risen; analysts disagree on how much data centers are to blame.',
    'research.suggestions.O3': downloadableModelsHint,
    'research.suggestions.X6':
        'Artificial superintelligence (ASI) is a hypothetical kind of AI that would far surpass humans across a wide range of intellectual tasks.',
    'research.suggestions.P7':
        'Designing a new generation of AI can involve choosing how its models are built and trained.',
    'research.suggestions.C3':
        'Artificial general intelligence (AGI) refers to AI that can learn and perform a wide range of intellectual tasks at about the same level as a human.',
    'research.suggestions.X4':
        "In the Hugging Face incident (2026), OpenAI reported that test models broke out of a restricted environment and accessed Hugging Face's systems before the breach was contained.",
    'research.suggestions.R3':
        'Anthropic reported that a dating app operator used Claude to run bots that posed as real users.',
    'research.suggestions.D2':
        "A closed model is used through the company's service; you can't download or inspect it.",
    'test.questionNumber': 'Question {current} of {total}',
    'test.progress': '{answered} of {total} questions answered',
    'test.progressLabel': 'Questionnaire progress',
    'test.prompt': 'How much do you agree?',
    'test.belief': 'Belief',
    'test.value': 'Value',
    'test.unsureNote': 'Not knowing is different from being in the middle.',
    'test.back': 'Back',
    'test.next': 'Next question',
    'test.finish': 'Finish',
    'test.keyboard':
        'Press 1–5 to choose an answer, or U to answer Unsure and continue.',
    'test.developerHeading': 'Developer questions',
    'session.completed.heading': 'You have completed this questionnaire.',
    'session.completed.description':
        'You can now see what your answers reveal about your views on AI.',
    'session.completed.view': 'View my results',
    'session.completed.edit': 'Review my answers',
    'storage.unavailable':
        'Progress cannot be saved in this browser. You can continue, but closing or reloading this page may lose your answers.',
    'storage.saveFailed':
        'Your latest changes could not be saved. Keep this page open to avoid losing progress.',
    'storage.invalid.heading': 'Saved progress could not be loaded.',
    'storage.invalid.body':
        'The saved data is damaged or does not match this questionnaire. You can clear it and start again.',
    'storage.version.heading':
        'Your saved progress belongs to a different questionnaire version.',
    'storage.version.body':
        'These answers cannot be safely used with the current questionnaire. Clear the saved progress to start again.',
    'storage.reset': 'Clear saved progress',
    'storage.reset.confirm': 'Clear saved progress and start again?',
    'research.axes.regulation':
        'Regulation · Let them build ↔ Strict oversight',
    'research.axes.control': 'Control · Market ↔ Public institutions',
    'research.axes.geopolitics':
        'Geopolitics · Race ↔ International cooperation',
    'research.axes.openness': 'Openness · Controlled ↔ Open',
    'research.axes.capability': 'Capability · Limited ↔ Transformative',
    'research.axes.existentialRisk': 'Existential risk · Low ↔ High',
    'research.axes.ecology': 'Ecology · Low harm ↔ High harm',
    'research.axes.creativity': 'Creativity · Low harm ↔ High harm',
    'research.axes.labor': 'Labor · Low harm ↔ High harm',
    'research.axes.surveillance': 'Surveillance · Low ↔ High',
    'research.axes.openSourcePreference':
        'Open-source preference · Closed APIs ↔ Open / self-hosted',
    'research.axes.aiDelegation':
        'AI delegation · Write it myself ↔ Agents write it',
    'research.axes.displacementRisk': 'Displacement risk · Low ↔ High',
};
