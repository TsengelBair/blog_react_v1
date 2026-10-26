## Сигналы и слоты

Соединение объектов в Qt:

```cpp
connect(button, &QPushButton::clicked,
        this, &MainWindow::onClicked);
```