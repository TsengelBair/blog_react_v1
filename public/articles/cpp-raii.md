
### `cpp-raii.md`


Ресурс живёт, пока живёт объект. Деструктор освобождает.

```cpp
class File {
    std::FILE* f_;
public:
    explicit File(const char* path) : f_(std::fopen(path, "r")) {}
    ~File() { if (f_) std::fclose(f_); }
    File(const File&) = delete;
    File& operator=(const File&) = delete;
};
```