## Бинарный поиск по ответу

Когда ответ **монотонен** — можно искать бинарно.

```cpp
int l = 0, r = 1e9;
while (l < r) {
    int mid = (l + r) / 2;
    if (check(mid)) r = mid;
    else l = mid + 1;
}
```