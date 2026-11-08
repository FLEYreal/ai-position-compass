import { Icon } from 'lucide-react';
import { axisNodes, type AxisId } from './axis-presentation';

export function AxisIcon({ axis, size = 18 }: { axis: AxisId; size?: number }) {
    return (
        <Icon
            iconNode={axisNodes[axis]}
            size={size}
            strokeWidth={1.6}
            aria-hidden="true"
        />
    );
}
