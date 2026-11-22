import {
    ChevronDown,
    Download,
    FileJson,
    Image as ImageIcon,
} from 'lucide-react';
import { useId, type ComponentType } from 'react';
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/ui';
import type { Messages } from '../i18n';

export function ResultDownloadMenu({
    copy,
    busy,
    allUndefined,
    onImage,
    onJson,
}: {
    copy: Messages;
    busy: boolean;
    allUndefined: boolean;
    onImage: () => void;
    onJson: () => void;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    aria-busy={busy}
                    className="max-w-full bg-[var(--result-camp-ink,var(--camp-cautious-builders-ink))] text-background whitespace-normal hover:bg-[var(--result-camp-ink,var(--camp-cautious-builders-ink))] hover:brightness-110"
                >
                    <Download aria-hidden="true" />
                    {busy ? copy['share.generating'] : copy['share.download']}
                    <ChevronDown aria-hidden="true" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                sideOffset={8}
                className="w-[405px] p-2.5"
            >
                <DropdownMenuLabel className="px-2.5 py-2 text-xs font-normal tracking-wide text-muted-foreground uppercase">
                    {copy['share.format']}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DownloadOption
                    format="PNG"
                    Icon={ImageIcon}
                    title={copy['share.png']}
                    description={
                        allUndefined ?
                            copy['share.noScores']
                        :   copy['share.png.description']
                    }
                    disabled={allUndefined || busy}
                    onSelect={onImage}
                />
                <DownloadOption
                    format="JSON"
                    Icon={FileJson}
                    title={copy['share.json']}
                    description={copy['share.json.description']}
                    disabled={busy}
                    onSelect={onJson}
                />
                <p className="px-2.5 pt-2 text-xs text-muted-foreground italic">
                    {copy['share.downloadPrivacy']}
                </p>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function DownloadOption({
    format,
    Icon,
    title,
    description,
    disabled,
    onSelect,
}: {
    format: 'PNG' | 'JSON';
    Icon: ComponentType<{ className?: string }>;
    title: string;
    description: string;
    disabled?: boolean;
    onSelect: () => void;
}) {
    const descriptionId = useId();
    return (
        <DropdownMenuItem
            aria-label={title}
            aria-describedby={descriptionId}
            disabled={disabled}
            onSelect={onSelect}
            className="cursor-pointer gap-3 rounded-md px-2.5 py-3 focus:bg-secondary focus:text-foreground"
        >
            <span
                aria-hidden="true"
                className={`grid min-h-14 w-12 shrink-0 content-center justify-items-center gap-1 rounded-md font-mono text-[9px] ${format === 'PNG' ? 'bg-primary text-primary-foreground' : 'bg-foreground text-background'}`}
            >
                <Icon className="size-5 text-current" />
                {format}
            </span>
            <span className="min-w-0 space-y-1">
                <strong className="block text-sm font-semibold">{title}</strong>
                <span
                    id={descriptionId}
                    className="block text-xs leading-relaxed text-muted-foreground"
                >
                    {description}
                </span>
            </span>
        </DropdownMenuItem>
    );
}
