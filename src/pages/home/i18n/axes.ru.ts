import type { axesCopy as englishAxes } from './axes.en';

export const axesCopy = {
    heading: 'Что измеряет компас',
    introduction:
        'Каждая ось отражает один из аспектов ваших взглядов на ИИ. Ценности описывают то, каким, по вашему мнению, должно быть будущее, а убеждения — то, каким вы ожидаете его увидеть. Это позволяет определить вашу позицию по каждому из вопросов.',
    values: 'Основные ценности',
    beliefs: 'Основные убеждения',
    developer: 'Оси для разработчиков',
    developerDescription:
        'Две ценности и одно убеждение, связанные с разработкой.',
    axes: {
        regulation: 'Регулирование',
        control: 'Контроль',
        geopolitics: 'Геополитика',
        openness: 'Открытость',
        capability: 'Потенциал',
        existentialRisk: 'Риск вымирания',
        ecology: 'Экология',
        creativity: 'Творчество',
        labor: 'Рынок труда',
        surveillance: 'Массовая слежка',
        openSourcePreference: 'Предпочтение опенсорса',
        aiDelegation: 'Делегирование кода ИИ',
        displacementRisk: 'Риск замены разработчиков',
    },
} satisfies typeof englishAxes;
