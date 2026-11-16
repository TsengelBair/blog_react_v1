## Цели и зависимости

```cmake
add_executable(app main.cpp)
target_link_libraries(app PRIVATE fmt::fmt)
target_include_directories(app PRIVATE include)
```