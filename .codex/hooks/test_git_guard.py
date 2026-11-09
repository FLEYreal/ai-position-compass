import json
import os
import re
import subprocess
import tempfile
import unittest
from pathlib import Path

GUARD = Path(__file__).with_name('git_guard.py').resolve()


class GitGuardTests(unittest.TestCase):
    def test_matcher_covers_git_writes_without_blocking_reads_or_pr_creation(self):
        config = json.loads(GUARD.parent.parent.joinpath('hooks.json').read_text())
        matcher = config['hooks']['PreToolUse'][0]['matcher']
        for tool in ['Bash', 'exec_command', 'mcp__GitKraken__git_push', 'mcp__codex_apps__github_update_ref', 'mcp__codex_apps__github_update_file']:
            self.assertIsNotNone(re.search(matcher, tool), tool)
        for tool in ['mcp__codex_apps__github_create_pull_request', 'mcp__codex_apps__github_get_repository', 'mcp__documents__update_file']:
            self.assertIsNone(re.search(matcher, tool), tool)

    def check(self, command, cwd, tool='Bash'):
        event = {'tool_name': tool, 'tool_input': {'command': command}}
        result = subprocess.run(['python3', str(GUARD)], input=json.dumps(event), text=True, capture_output=True, cwd=cwd, check=True)
        return bool(result.stdout.strip())

    def test_push_and_merge_rules(self):
        with tempfile.TemporaryDirectory() as directory:
            subprocess.run(['git', 'init', '-q', '-b', 'dev', directory], check=True)
            for command in ['git push', 'git push -u origin feat/tooling', 'git push --dry-run origin feat/tooling', 'git -c push.default=current push', 'git push origin dev', 'git push origin HEAD:refs/heads/main', 'git push --force origin feat/a', 'git push origin :dev', 'git send-pack origin feat/tooling', 'gh api repos/example/project/contents/file -X PUT', 'gh pr merge 42', 'git commit -m test', 'git rebase feat/tooling', 'git merge feat/tooling']:
                with self.subTest(command=command):
                    self.assertTrue(self.check(command, directory))
            for command in ['git status', 'git fetch origin', 'gh pr create', 'gh pr checks', 'gh api repos/example/project']:
                with self.subTest(command=command):
                    self.assertFalse(self.check(command, directory))
            self.assertTrue(self.check('', directory, 'mcp__GitKraken__git_push'))
            self.assertTrue(self.check('', directory, 'mcp__codex_apps__github_update_file'))
            self.assertTrue(self.check('', directory, 'mcp__codex_apps__github_update_ref'))
            subprocess.run(['git', 'checkout', '-q', '-b', 'feat/tooling'], cwd=directory, check=True)
            for command in ['git commit -m test', 'git rebase dev', 'git merge dev']:
                self.assertFalse(self.check(command, directory))
            self.assertTrue(self.check('git rebase feat/tooling main', directory))
            self.assertTrue(self.check('git rebase --onto main dev', directory))
            self.assertTrue(self.check('git push -u origin feat/tooling', directory))
            self.assertTrue(self.check('git push -u origin feat/tooling', directory, 'exec_command'))

    def test_git_global_directory_options(self):
        with tempfile.TemporaryDirectory() as directory:
            subprocess.run(['git', 'init', '-q', '-b', 'main', directory], check=True)
            self.assertTrue(self.check(f'git -C {directory} commit -m test', directory))
            self.assertTrue(self.check(f'git -C {directory} push origin feat/a', directory))

    def test_git_backstop_preserves_owner_terminal(self):
        hook = GUARD.parents[2] / '.githooks' / 'pre-push'
        for marker in ('CODEX_THREAD_ID', 'CODEX_CI', 'CURSOR_AGENT', 'CLAUDECODE'):
            with self.subTest(marker=marker):
                result = subprocess.run(['/usr/bin/python3', str(hook)], env={marker: 'test'}, capture_output=True, check=False)
                self.assertEqual(result.returncode, 1)
                self.assertIn(b'owner', result.stderr)
        environment = {key: value for key, value in os.environ.items() if key not in ('CODEX_THREAD_ID', 'CODEX_CI', 'CURSOR_AGENT', 'CLAUDECODE')}
        result = subprocess.run(['/usr/bin/python3', str(hook)], env=environment, capture_output=True, check=False)
        self.assertEqual(result.returncode, 0)


if __name__ == '__main__':
    unittest.main()
