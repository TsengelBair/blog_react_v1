## Move-семантика

`std::move` — **не** двигает. Приводит к rvalue.

```cpp
std::string a = "hello";
std::string b = std::move(a);  // a теперь пуст (обычно)
```