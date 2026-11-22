export default {
    'result.heading': 'Your AI position',

    'result.introduction': 'A map of your answers, not a fixed identity.',
    'result.axes.heading': 'Your positions',
    'result.core.heading': 'Core profile',
    'result.developer.heading': 'Developer profile',
    'result.matches.heading': 'Nearby camps',
    'result.primary': 'Closest match',
    'result.neighboring': 'Other nearby camps',
    'result.match': '{score}% similarity',
    'result.matchExplanation':
        'Similarity describes distance from a camp’s positions. It is not a probability of membership.',
    'result.undefined': 'Undefined',
    'result.undefined.description':
        'There is not enough answered information to show a score on this axis. Unsure is not counted as neutral.',
    'result.allUndefined':
        'There is not enough answered information to calculate any axis scores.',
    'result.someUndefined':
        'Some axes are Undefined. Camp comparisons use only the axes with scores.',
    'result.noEligible.heading': 'Not enough information to compare camps',
    'result.noEligible.body':
        'Your available axis scores are shown below. No camp meets the comparison requirements for this result.',
    'result.lowMatch.heading': 'No close camp match',
    'result.lowMatch.body':
        'Your views do not closely match any of these camps. The nearest comparisons are still shown for exploration.',
    'result.developer.skipped':
        'Developer questions were not included in this result.',
    'result.developer.undefined':
        'Developer questions were included, but there is not enough answered information to calculate developer axis scores.',
    'result.youAreHere': 'You are here',
    'result.axisPosition': '{axis}: {score} out of 100',
    'result.axisUndefined': '{axis}: Undefined',
    'result.beliefs.heading': 'Beliefs — what you expect',
    'result.values.heading': 'Values — what you prefer',
    'result.relatedVoices': 'Related public voices',
    'result.methodology': 'How these results are calculated',
    'result.version': 'Result version: {version}',
    'result.privacy':
        'This result was reconstructed from the scores in the link. Individual answers are not included.',
    'result.retake': 'Take the questionnaire',
    'share.heading': 'Share your result',
    'share.copy': 'Copy result link',
    'share.copied': 'Link copied',
    'share.copyFailed':
        'The link could not be copied automatically. Select and copy it below.',
    'share.linkLabel': 'Result link',
    'share.description':
        'Share your scores without sharing individual answers.',
    'share.image': 'Download result image',
    'share.generating': 'Preparing image…',
    'share.downloaded': 'Image download started.',
    'share.exportFailed':
        'The result image could not be created. Try again or copy the result link.',
    'share.fontFailed':
        'The image fonts could not be loaded. Try again before downloading.',
    'share.imageTitle': 'My AI Position Compass',
    'share.imagePrivacy': 'Scores only — individual answers are not included.',
    'share.noScores':
        'There are no calculated scores to include in this image.',
    'recovery.missing.heading': 'No result in this link',
    'recovery.missing.body':
        'Take the questionnaire or open a complete result link.',
    'recovery.invalid.heading': 'This result link could not be read.',
    'recovery.invalid.body':
        'The link may be incomplete or damaged. Ask for the full link, or take the questionnaire.',
    'recovery.unsupported.heading': 'This result version is not supported.',
    'recovery.unsupported.body':
        'This application cannot display the version in this link. Check for an updated application or take the current questionnaire.',
    'recovery.takeTest': 'Take the questionnaire',
    'footer.disclaimer':
        'Public voices illustrate ideas, not endorsement or membership.',

    // Axes
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

    // Camps
    'research.camps.core.accelerationists.name': 'Accelerationists',
    'research.camps.core.accelerationists.description':
        'Build fast and win the race. Regulation slows progress; open models are fine; extinction fears are overblown.',
    'research.camps.core.securitists.name': 'Securitists',
    'research.camps.core.securitists.description':
        'AI will be extremely powerful and dangerous, so the state must lead, win the race and lock the models down.',
    'research.camps.core.safetyCamp.name': 'Safety camp',
    'research.camps.core.safetyCamp.description':
        'Advanced AI could cause a catastrophe. Regulate frontier models and cooperate internationally.',
    'research.camps.core.pauseCamp.name': 'Pause camp',
    'research.camps.core.pauseCamp.description':
        "Don't build superintelligence until it can be done safely; pause frontier AI through an international treaty.",
    'research.camps.core.cautiousBuilders.name': 'Cautious builders',
    'research.camps.core.cautiousBuilders.description':
        'The risks are real, but responsible labs should build it first under light, industry-shaped rules.',
    'research.camps.core.guardedOptimists.name': 'Guarded optimists',
    'research.camps.core.guardedOptimists.description':
        'Build it, but favor defensive and decentralized technology over concentrated power.',
    'research.camps.core.ethicsCamp.name': 'Ethics camp',
    'research.camps.core.ethicsCamp.description':
        'Focus on harms happening now: bias, surveillance, exploitation, environmental cost.',
    'research.camps.core.normalTechnologyCamp.name': 'Normal-technology camp',
    'research.camps.core.normalTechnologyCamp.description':
        'AI is powerful but normal, like electricity. Regulate specific uses, not the technology itself.',
    'research.camps.core.hypeSkeptics.name': 'Hype skeptics',
    'research.camps.core.hypeSkeptics.description':
        "Today's AI is overhyped and unreliable, and the industry still needs strict rules.",
    'research.camps.core.populists.name': 'Populists',
    'research.camps.core.populists.description':
        'Skeptical of AI and Big Tech power: protect jobs and families with strong government oversight.',
    'research.camps.core.creativesCopyright.name': 'Creatives / copyright',
    'research.camps.core.creativesCopyright.description':
        "Training on creative work without consent and payment is unjust and harms creators' livelihoods.",
    'research.camps.core.unconcerned.name': 'Unconcerned',
    'research.camps.core.unconcerned.description':
        'AI is a useful tool. Not worried about it either way.',
    'research.camps.core.existentialWorriers.name': 'Existential worriers',
    'research.camps.core.existentialWorriers.description':
        'Afraid AI could end humanity, even without expecting it to become all-powerful soon.',
    'research.camps.core.laborCritics.name': 'Labor critics',
    'research.camps.core.laborCritics.description':
        "AI can't really do the job, but bosses will use it to replace and squeeze workers anyway.",
    'research.camps.core.surveillanceCritics.name': 'Surveillance critics',
    'research.camps.core.surveillanceCritics.description':
        'AI makes it cheap to watch and control everyone, by governments and companies alike.',

    'research.camps.dev.vibeCoders.name': 'Vibe-coders',
    'research.camps.dev.vibeCoders.description':
        'Let the agents write the code; developers will be partly displaced.',
    'research.camps.dev.vibeFounders.name': 'Vibe-founders',
    'research.camps.dev.vibeFounders.description':
        'Ship products with AI writing the code; many developer jobs will go.',
    'research.camps.dev.openSourceAdvocatesSelfHosters.name':
        'Open-source advocates / self-hosters',
    'research.camps.dev.openSourceAdvocatesSelfHosters.description':
        'Run open models on your own hardware, and use them heavily.',
    'research.camps.dev.craftspeople.name': 'Craftspeople',
    'research.camps.dev.craftspeople.description':
        'Write it yourself, with open tools you control.',
    'research.camps.dev.corporatePragmatists.name': 'Corporate pragmatists',
    'research.camps.dev.corporatePragmatists.description':
        'Make heavy use of the hosted AI tools your employer provides.',
    'research.camps.dev.balancedUsers.name': 'Balanced users',
    'research.camps.dev.balancedUsers.description':
        'Some AI, some hand-written code, some open tools, some closed.',
    'research.camps.dev.skeptics.name': 'Skeptics',
    'research.camps.dev.skeptics.description':
        "Write it yourself; AI won't replace developers.",
};
