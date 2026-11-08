import json
import subprocess
import tempfile
import unittest
from pathlib import Path

GUARD = Path(__file__).with_name('git_guard.py').resolve()


class GitGuardTests(unittest.TestCase):
    def check(self, command, cwd, tool='Bash'):
        event = {'tool_name': tool, 'tool_input': {'command': command}}
        result = subprocess.run(['python3', str(GUARD)], input=json.dumps(event), text=True, capture_output=True, cwd=cwd, check=True)
        return bool(result.stdout.strip())

    def test_push_and_merge_rules(self):
        with tempfile.TemporaryDirectory() as directory:
            subprocess.run(['git', 'init', '-q', '-b', 'dev', directory], check=True)
            for command in ['git push', 'git push origin dev', 'git push origin HEAD:refs/heads/main', 'git push --force origin feat/a', 'git push origin :dev', 'gh pr merge 42', 'git commit -m test', 'git rebase feat/tooling', 'git merge feat/tooling']:
                with self.subTest(command=command):
                    self.assertTrue(self.check(command, directory))
            for command in ['git status', 'git push -u origin feat/tooling', 'gh pr create']:
                with self.subTest(command=command):
                    self.assertFalse(self.check(command, directory))
            self.assertTrue(self.check('', directory, 'mcp__GitKraken__git_push'))
            subprocess.run(['git', 'checkout', '-q', '-b', 'feat/tooling'], cwd=directory, check=True)
            for command in ['git commit -m test', 'git rebase dev', 'git merge dev']:
                self.assertFalse(self.check(command, directory))
            self.assertTrue(self.check('git rebase feat/tooling main', directory))
            self.assertTrue(self.check('git rebase --onto main dev', directory))


if __name__ == '__main__':
    unittest.main()
