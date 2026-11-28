import type { axesCopy as englishAxes } from './axes.en';

export const axesCopy = {
    heading: 'Из чего складывается ваша позиция?',
    introduction:
        'Каждая ось отражает одну сторону ваших взглядов на ИИ. Ценности показывают, что, по вашему мнению, должно произойти, а убеждения — чего вы ожидаете. Три оси относятся к дополнительному модулю для разработчиков.',
    module: {
        core: 'Основной тест',
        dev: 'Для разработчиков',
    },
    construct: {
        value: 'Ценность',
        belief: 'Убеждение',
    },
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
