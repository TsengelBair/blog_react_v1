## rebase vs merge

**merge** — сохраняет историю, создаёт merge-коммит.

**rebase** — переписывает историю, линейно.

```bash
git rebase main
git rebase -i HEAD~3
```