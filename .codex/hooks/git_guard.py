#!/usr/bin/python3
"""Gate agent tools. The Git pre-push hook also covers subprocesses/aliases."""
import json
import os
import re
import shlex
import subprocess
import sys
from pathlib import Path


def deny(reason):
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "deny", "permissionDecisionReason": reason}}))


def git_command(tokens, index):
    """Return the subcommand and global options, including git -C/-c forms."""
    options = []
    index += 1
    while index < len(tokens) and tokens[index].startswith('-'):
        option = tokens[index]
        options.append(option)
        index += 1
        if option in ('-C', '-c', '--git-dir', '--work-tree', '--namespace'):
            if index >= len(tokens):
                return '', options
            options.append(tokens[index])
            index += 1
    return tokens[index] if index < len(tokens) else '', options


def current_branch(options, cwd):
    def git(*args):
        return subprocess.run(['git', *options, *args], cwd=cwd, capture_output=True, text=True, check=True).stdout.strip()
    branch = git('branch', '--show-current')
    if branch:
        return branch
    for state in ('rebase-merge', 'rebase-apply'):
        path = Path(git('rev-parse', '--git-path', f'{state}/head-name'))
        if not path.is_absolute():
            path = Path(cwd) / path
        if path.is_file():
            return path.read_text().strip().removeprefix('refs/heads/')
    return ''


def main():
    try:
        event = json.load(sys.stdin)
        if not isinstance(event, dict):
            deny('Invalid hook event; cannot verify the workflow.')
            return
        name = event.get('tool_name', '')
        if name not in ('Bash', 'exec_command'):
            deny('Agent remote code writes, pushes, and PR merges are prohibited. The owner reviews locally, pushes, and merges.')
            return
        data = event.get('tool_input', {})
        if not isinstance(data, dict):
            deny('Invalid tool input; cannot verify the workflow.')
            return
        command = data.get('command', data.get('cmd', ''))
        tokens = shlex.split(command)
        if re.search(r'\bgh\s+pr\s+merge\b', command):
            deny('Only the owner merges pull requests.')
            return
        if re.search(r'\bgh\s+api\b', command) and re.search(r'(?:--method|-X)\s*(?:POST|PUT|PATCH|DELETE)|(?:--field|--raw-field|-f|-F)\b', command, re.I):
            deny('Remote API writes are prohibited; work locally and let the owner push.')
            return
        for index, token in enumerate(tokens):
            if Path(token).name != 'git':
                continue
            operation, options = git_command(tokens, index)
            if operation in ('push', 'send-pack'):
                deny('All agent pushes are prohibited, including feature branches and dry runs. The owner must push.')
                return
            if operation not in ('commit', 'rebase', 'merge'):
                continue
            prefix = tokens[:index]
            if any(not re.fullmatch(r'[A-Za-z_][A-Za-z0-9_]*=.*', part) for part in prefix) or any(part in command for part in (';', '&&', '||', '|', '\n', '$(')):
                deny('Use a standalone Git mutation so the target checkout can be inspected.')
                return
            cwd = data.get('workdir') or event.get('tool_cwd') or event.get('cwd') or os.getcwd()
            branch = current_branch(options, cwd)
            if branch in ('', 'dev', 'main'):
                deny('Agent commits, rebases, and merges on dev/main or an unknown branch are prohibited.')
                return
            if operation == 'rebase' and any(arg in ('main', 'dev') for arg in tokens[index + 3:]):
                deny('Rebase only the current feature branch, never an explicit shared-branch target.')
                return
    except (ValueError, OSError, subprocess.CalledProcessError, TypeError) as error:
        deny(f'Cannot verify Git workflow safely: {type(error).__name__}.')


if __name__ == '__main__':
    main()
