import { Icon } from 'lucide-react';
import { axisNodes, type AxisId } from './axis-presentation';

export function AxisIcon({
    axis,
    size = 18,
    className,
}: {
    axis: AxisId;
    size?: number;
    className?: string;
}) {
    return (
        <Icon
            iconNode={axisNodes[axis]}
            className={className}
            size={size}
            strokeWidth={1.6}
            aria-hidden="true"
        />
    );
}
