### Индексы из коробки

При указании колонке `PRIMARY KEY` или `UNIQUE` ограничения, автоматически создается индекс
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,      -- UNIQUE B-tree
    email TEXT UNIQUE NOT NULL  -- UNIQUE B-tree
);
```
Это означает что поиск записи по id или email будет обладать `O(logN)`, но только при следующих сценариях

1) Поиск по равенству (=)
```sql
SELECT * FROM users WHERE id = 123;
SELECT * FROM users WHERE email = 'ivan@example.com';
```

2) Поиск по диапазонам (>, <, >=, <=, BETWEEN)
```sql
SELECT * FROM users WHERE id > 100 AND id < 200;
SELECT * FROM users WHERE id BETWEEN 100 AND 200;
SELECT * FROM users WHERE email >= 'a' AND email <= 'm'; -- все пользователи, чей email начинается с 'a - m'
```

3) Сортировка по индексированной колонке
```sql
SELECT * FROM users ORDER BY email;   
SELECT * FROM users ORDER BY id DESC;
```

4) Поиск по префиксу (LIKE без % в начале)
```sql
SELECT * FROM users WHERE email LIKE 'ivan%@example.com'; -- O(log N)
SELECT * FROM users WHERE email LIKE '%@gmail.com';        -- O(N)
```

5) Агрегация MIN/MAX
```sql
SELECT MIN(id), MAX(id) FROM users; -- берет крайние значения из индекса O(log N) теория, O(1) практика
```

**Когда индекс есть, но не работает**
1) Применение функции к колонке
```sql
SELECT * FROM users WHERE lower(email) = 'ivan@example.com';
```

2) Неявное преобразование типов
```sql
SELECT * FROM users WHERE email = 123;  -- email TEXT
```

3) LIKE в начале
```sql
SELECT * FROM users WHERE email LIKE '%@gmail.com';
```

4) Оператор не равно 
```sql
SELECT * FROM users WHERE email != 'ivan@example.com';
```

5) Оператор OR когда на одной из колонок нет индекса
```sql
SELECT * FROM users WHERE id = 123 OR name = 'Ivan';
```
Если индексы есть на обеих колонках, PostgreSQL может скомбинировать их через BitmapOr

Но лучше переписать через UNION:
```sql
SELECT * FROM users WHERE id = 123
UNION
SELECT * FROM users WHERE name = 'Ivan';
```

6) Оператор NOT IN
```sql
SELECT * FROM users WHERE email NOT IN ('a@b.com', 'c@d.com');  -- O(N)
```