## Надёжные bash-скрипты

```bash
#!/usr/bin/env bash
set -euo pipefail

main() {
    local name="${1:-world}"
    echo "Hello, $name"
}

main "$@"
```