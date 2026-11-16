## Модель/представление

Своя модель:

```cpp
class MyModel : public QAbstractTableModel {
    int rowCount(const QModelIndex&) const override { return rows_.size(); }
    int columnCount(const QModelIndex&) const override { return 2; }
    QVariant data(const QModelIndex& i, int role) const override { ... }
};
```