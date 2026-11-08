#!/usr/bin/env python3
"""Guard common agent Git commands; this is not a security boundary."""
import json
import re
import shlex
import subprocess
import sys


def deny(reason):
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "deny", "permissionDecisionReason": reason}}))


def main():
    event = json.load(sys.stdin)
    name = event.get("tool_name", "")
    if name != "Bash":
        deny("Agent pushes through this tool and PR merges are blocked; use an explicit feature-branch push and ask the owner to merge.")
        return
    command = event.get("tool_input", {}).get("command", "")
    if re.search(r"\bgh\s+pr\s+merge\b", command):
        deny("Only the owner merges pull requests.")
        return
    if not re.search(r"\bgit\b[^\n]*\b(push|commit|rebase|merge)\b", command):
        return
    try:
        tokens = shlex.split(command)
    except ValueError:
        deny("Cannot safely check this Git command; use a simple explicit command.")
        return
    if not tokens or tokens[0] != "git" or any(t in command for t in (";", "&&", "||", "|", "\n", "$(")):
        deny("Use a standalone Git command so branch protections can inspect it.")
        return
    if len(tokens) < 2:
        return
    if tokens[1] == "rebase" and (any(a.startswith("-") for a in tokens[2:]) or len(tokens[2:]) > 1):
        deny("Use a simple rebase of the current feature branch; explicit branch targets and options are blocked.")
        return
    if tokens[1] in ("commit", "rebase", "merge"):
        result = subprocess.run(["git", "branch", "--show-current"], capture_output=True, text=True, check=False)
        if result.returncode != 0 or result.stdout.strip() in ("main", "dev", ""):
            deny("Agent commits, rebases, and merges on dev or main are blocked; use a feature branch and a PR.")
        return
    if tokens[1] != "push":
        deny("Use a standalone git push with an explicit feature branch.")
        return
    args = tokens[2:]
    if any(a.startswith("-") and a not in ("-u", "--set-upstream") for a in args):
        deny("Only a simple explicit feature-branch push is allowed.")
        return
    positional = [a for a in args if not a.startswith("-")]
    if len(positional) < 2:
        deny("Specify the remote and feature-branch ref explicitly.")
        return
    for ref in positional[1:]:
        parts = ref.split(":")
        target = parts[-1].removeprefix("refs/heads/")
        if len(parts) > 2 or not parts[0] or target in ("main", "dev", "HEAD", "") or not re.fullmatch(r"[A-Za-z0-9._/-]+", target):
            deny("Pushes to main/dev, deletions, and ambiguous refspecs are blocked.")
            return


if __name__ == "__main__":
    main()
