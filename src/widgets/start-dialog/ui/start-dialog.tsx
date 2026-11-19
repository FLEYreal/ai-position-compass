import { getQuestionCount } from '@/shared/config';
import { ArrowRight, Code2 } from 'lucide-react';
import { useId, useState } from 'react';
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/ui';
import type { Messages as CommonMessages } from '@/shared/i18n';
import type { StartMessages } from '../i18n';

export function StartDialog({
    label,
    messages,
    common,
    openOnMount,
    onStart,
}: {
    label: string;
    messages: StartMessages;
    common: Pick<CommonMessages, 'common.close'>;
    openOnMount?: boolean;
    onStart: (includeDeveloper: boolean) => void;
}) {
    const [includeDeveloper, setIncludeDeveloper] = useState(false);
    const developerLabel = useId();
    const developerDescription = useId();

    return (
        <Dialog
            defaultOpen={openOnMount}
            onOpenChange={(open) => {
                if (open) setIncludeDeveloper(false);
            }}
        >
            <DialogTrigger asChild>
                <Button>
                    {label}
                    <ArrowRight aria-hidden="true" />
                </Button>
            </DialogTrigger>
            <DialogContent closeLabel={common['common.close']}>
                <DialogHeader>
                    <DialogTitle>{messages['start.heading']}</DialogTitle>
                    <DialogDescription>
                        {messages['start.description']}
                    </DialogDescription>
                </DialogHeader>
                <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-card p-4">
                    <input
                        type="checkbox"
                        className="mt-1 size-4 shrink-0 accent-primary"
                        checked={includeDeveloper}
                        onChange={(event) =>
                            setIncludeDeveloper(event.target.checked)
                        }
                        aria-labelledby={developerLabel}
                        aria-describedby={developerDescription}
                    />
                    <span>
                        <span
                            id={developerLabel}
                            className="flex items-center gap-2 text-sm font-semibold"
                        >
                            <Code2 size={16} aria-hidden="true" />
                            {messages['start.developer.label']}
                        </span>
                        <span
                            id={developerDescription}
                            className="mt-1 block text-sm text-muted-foreground"
                        >
                            {messages['start.developer.description'].replace(
                                '{count}',
                                String(getQuestionCount('dev')),
                            )}
                        </span>
                    </span>
                </label>
                <p className="text-xs text-muted-foreground">
                    {messages['start.privacy']}
                </p>
                <Button
                    className="justify-self-start"
                    onClick={() => onStart(includeDeveloper)}
                >
                    {messages['start.begin']}
                    <ArrowRight aria-hidden="true" />
                </Button>
            </DialogContent>
        </Dialog>
    );
}
