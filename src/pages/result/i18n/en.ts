export default {
    'result.heading': 'Your AI position',

    'result.axes.heading': 'Your positions',
    'result.core.heading': 'Core profile',
    'result.developer.heading': 'Developer profile',
    'result.matches.heading': 'Nearby camps',
    'result.primary': 'Closest match',
    'result.neighboring': 'Also close',
    'result.similarityLabel': 'Similarity',
    'result.neighboring.caption': 'Other points of overlap',
    'result.references': 'More sources',
    'result.match': '{score}% similarity',
    'result.undefined': 'Undefined',
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
    'result.developer.lowMatch':
        'This is your closest developer camp, with a low similarity score.',
    'result.developer.undefined':
        'Developer questions were included, but there is not enough answered information to calculate developer axis scores.',
    'result.youAreHere': 'You are here',
    'result.axis.value': 'Value',
    'result.axis.belief': 'Belief',
    'result.axisPosition': '{axis}: {score} out of 100',
    'result.axisUndefined': '{axis}: Undefined',
    'result.beliefs.heading': 'Beliefs — what you expect',
    'result.values.heading': 'Values — what you prefer',
    'result.relatedVoices': 'Related public views',
    'share.heading': 'Share your result',
    'share.copy': 'Copy link',
    'share.copied': 'Link copied',
    'share.copyFailed':
        'The link could not be copied automatically. Select and copy it below.',
    'share.linkLabel': 'Result link',
    'share.description':
        'Share your scores without sharing individual answers.',
    'share.download': 'Download result',
    'share.format': 'Choose a format',
    'share.png': 'Result card · PNG',
    'share.png.description': 'A card with your scores and nearby camps.',
    'share.json': 'Result data · JSON',
    'share.json.description':
        'Scores, camp comparisons, and question answers when available.',
    'share.downloadPrivacy': 'Files are created in your browser.',
    'share.jsonDownloaded': 'JSON download started. It includes your answers.',
    'share.jsonScoresDownloaded':
        'JSON download started. Only scores and comparisons are available for this result.',
    'share.jsonFailed': 'Could not create the JSON file. Try again.',
    'share.generating': 'Preparing download…',
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
    'research.camps.core.accelerationists.context':
        'This camp sees faster AI development as a source of prosperity and scientific progress. It favors letting more developers build with open models and treats a lead over competing countries as an advantage worth pursuing.',
    'research.camps.core.accelerationists.name': 'Accelerationists',
    'research.camps.core.accelerationists.description':
        'Build fast and win the race. Regulation slows progress; open models are fine; extinction fears are overblown.',
    'research.camps.core.securitists.context':
        'This camp sees advanced AI as a strategic resource that could change the balance of power between countries. It favors government leadership and tight control over access to powerful models and the information needed to build them.',
    'research.camps.core.securitists.name': 'Securitists',
    'research.camps.core.securitists.description':
        'AI will be extremely powerful and dangerous, so the state must lead, win the race and lock the models down.',
    'research.camps.core.safetyCamp.context':
        'The possibility of catastrophic harm makes safety testing a priority for this camp. It favors oversight of the most capable models and cooperation between countries, since a failure at that scale could have consequences far beyond the place where it began.',
    'research.camps.core.safetyCamp.name': 'Safety camp',
    'research.camps.core.safetyCamp.description':
        'Advanced AI could cause a catastrophe. Regulate frontier models and cooperate internationally.',
    'research.camps.core.pauseCamp.context':
        'This camp wants clear safety conditions before work toward superintelligence moves ahead. It favors an international agreement so developers and countries can pause together without fearing that others will continue unchecked.',
    'research.camps.core.pauseCamp.name': 'Pause camp',
    'research.camps.core.pauseCamp.description':
        "Don't build superintelligence until it can be done safely; pause frontier AI through an international treaty.",
    'research.camps.core.cautiousBuilders.context':
        'This camp expects major advances from AI and wants experienced labs to lead development. It places much of the responsibility for managing risks on the labs and leaves room for some model releases alongside tighter access to the most capable systems.',
    'research.camps.core.cautiousBuilders.name': 'Cautious builders',
    'research.camps.core.cautiousBuilders.description':
        'The risks are real, but responsible labs should build it first under light, industry-shaped rules.',
    'research.camps.core.guardedOptimists.context':
        'This camp favors progress that helps people protect themselves and retain control over the tools they use. It gives particular weight to defensive applications and approaches that distribute power among many users and institutions.',
    'research.camps.core.guardedOptimists.name': 'Guarded optimists',
    'research.camps.core.guardedOptimists.description':
        'Build it, but favor defensive and decentralized technology over concentrated power.',
    'research.camps.core.ethicsCamp.context':
        'This camp looks at who benefits from deployed AI and who bears its costs. Its concerns include whose work goes into training, how systems treat different groups, and how their use affects privacy and the environment.',
    'research.camps.core.ethicsCamp.name': 'Ethics camp',
    'research.camps.core.ethicsCamp.description':
        'Focus on harms happening now: bias, surveillance, exploitation, environmental cost.',
    'research.camps.core.normalTechnologyCamp.context':
        'This camp expects AI to spread through workplaces and institutions as people find useful applications. It would set rules for concrete risks such as unreliable hiring decisions, with oversight tailored to how the tool is used.',
    'research.camps.core.normalTechnologyCamp.name': 'Normal-technology camp',
    'research.camps.core.normalTechnologyCamp.description':
        'AI is powerful but normal, like electricity. Regulate specific uses, not the technology itself.',
    'research.camps.core.hypeSkeptics.context':
        'This camp questions whether current systems can deliver the reliability and usefulness promised for them. It supports oversight because systems can be deployed at scale and cause harm even when their capabilities fall short of expectations.',
    'research.camps.core.hypeSkeptics.name': 'Hype skeptics',
    'research.camps.core.hypeSkeptics.description':
        "Today's AI is overhyped and unreliable, and the industry still needs strict rules.",
    'research.camps.core.populists.context':
        'This camp focuses on who has the power to decide how AI reaches workers and families. It favors a strong public role in keeping large companies accountable, while views within the camp differ on how governments should deal with foreign competitors.',
    'research.camps.core.populists.name': 'Populists',
    'research.camps.core.populists.description':
        'Skeptical of AI and Big Tech power: protect jobs and families with strong government oversight.',
    'research.camps.core.creativesCopyright.context':
        'This camp focuses on the terms under which creative work is used to train models. It sees consent and compensation as practical protections for creators whose livelihoods depend on being able to control how their work is used.',
    'research.camps.core.creativesCopyright.name': 'Creatives / copyright',
    'research.camps.core.creativesCopyright.description':
        "Training on creative work without consent and payment is unjust and harms creators' livelihoods.",
    'research.camps.core.unconcerned.context':
        'This profile reflects a relatively relaxed view of AI. Its usefulness can vary by task, and the profile gives little weight to forecasts of either dramatic breakthroughs or severe harms.',
    'research.camps.core.unconcerned.name': 'Unconcerned',
    'research.camps.core.unconcerned.description':
        'AI is a useful tool. Not worried about it either way.',
    'research.camps.core.existentialWorriers.context':
        'This profile combines uncertainty about how powerful AI will become with concern about the consequences if development goes badly. An outcome can be a serious concern even for someone who gives it a low chance.',
    'research.camps.core.existentialWorriers.name': 'Existential worriers',
    'research.camps.core.existentialWorriers.description':
        'Afraid AI could end humanity, even without expecting it to become all-powerful soon.',
    'research.camps.core.laborCritics.context':
        'This camp is concerned with how employers use AI to reorganize work. Even imperfect systems can affect staffing, pay, and expectations if managers rely on them to cut costs or put pressure on workers.',
    'research.camps.core.laborCritics.name': 'Labor critics',
    'research.camps.core.laborCritics.description':
        "AI can't really do the job, but bosses will use it to replace and squeeze workers anyway.",
    'research.camps.core.surveillanceCritics.context':
        'This camp focuses on the lower cost of collecting, connecting, and analyzing information about people. It sees that ability as a concern in commercial services as well as in the hands of governments.',
    'research.camps.core.surveillanceCritics.name': 'Surveillance critics',
    'research.camps.core.surveillanceCritics.description':
        'AI makes it cheap to watch and control everyone, by governments and companies alike.',

    'research.camps.dev.vibeCoders.context':
        'This profile treats AI agents as the main way to turn an idea into code. It expects substantial changes to the tasks developers do and anticipates some displacement as agents handle more implementation.',
    'research.camps.dev.vibeCoders.name': 'Vibe-coders',
    'research.camps.dev.vibeCoders.description':
        'Let the agents write the code; developers will be partly displaced.',
    'research.camps.dev.vibeFounders.context':
        'This profile sees heavy delegation to AI as a way to build and ship products with less manual coding. It also expects the shift to substantially reduce demand for developers.',
    'research.camps.dev.vibeFounders.name': 'Vibe-founders',
    'research.camps.dev.vibeFounders.description':
        'Ship products with AI writing the code; many developer jobs will go.',
    'research.camps.dev.openSourceAdvocatesSelfHosters.context':
        'This profile combines extensive use of AI for coding with a preference for open models. Running them on your own hardware offers more direct control over where the tools run and how they are configured.',
    'research.camps.dev.openSourceAdvocatesSelfHosters.name':
        'Open-source advocates / self-hosters',
    'research.camps.dev.openSourceAdvocatesSelfHosters.description':
        'Run open models on your own hardware, and use them heavily.',
    'research.camps.dev.craftspeople.context':
        'This profile treats writing and understanding the code directly as an important part of development. It favors tools you can inspect and run yourself while leaving most implementation in your own hands.',
    'research.camps.dev.craftspeople.name': 'Craftspeople',
    'research.camps.dev.craftspeople.description':
        'Write it yourself, with open tools you control.',
    'research.camps.dev.corporatePragmatists.context':
        'This profile is comfortable delegating a lot of coding work to the hosted tools available through an employer. The practical starting point is what the team can use in its existing workflow.',
    'research.camps.dev.corporatePragmatists.name': 'Corporate pragmatists',
    'research.camps.dev.corporatePragmatists.description':
        'Make heavy use of the hosted AI tools your employer provides.',
    'research.camps.dev.balancedUsers.context':
        'This profile mixes hand-written code and AI assistance according to the task. It can use either open models or hosted services and expects a moderate effect on developer jobs.',
    'research.camps.dev.balancedUsers.name': 'Balanced users',
    'research.camps.dev.balancedUsers.description':
        'Some AI, some hand-written code, some open tools, some closed.',
    'research.camps.dev.skeptics.context':
        'This profile prefers direct control of implementation and gives agents a limited role. It expects that developers will continue to be needed even as coding tools improve.',
    'research.camps.dev.skeptics.name': 'Skeptics',
    'research.camps.dev.skeptics.description':
        "Write it yourself; AI won't replace developers.",
};
