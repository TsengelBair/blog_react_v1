### Создание переменной в цикле

Рассмотрим метод, выполняющий сортировку массива пузырьком, но что на самом деле делает данный метод не так важно
```c++
/// сортировка пузырьком с созданием переменной внутри цикла
void tmpInside(int array[], int size)
{
    for (int i = 0; i < size; ++i) {
        for (int j = 0; j < size - 1; ++j) {
            if (array[j] > array[j + 1]) {
                int tmp = array[j];         /// создается на каждой итерации
                array[j] = array[j + 1];
                array[j + 1] = tmp;
            }
        }
    }
}
```
Данный код хочется оптимизировать следующим образом: каждый раз при заходе в if во вложенном цикле выполняется создание и удаление временной переменной tmp 

Вынесем объявление временной переменной за пределы цикла, чтобы создание и удаление происходило единожды, а внутри цикла осуществлялась только перезапись

```c++
void tmpOutside(int array[], int size)
{
    /// создаем единожды
    int tmp;
    for (int i = 0; i < size; ++i) {
        for (int j = 0; j < size - 1; ++j) {
            if (array[j] > array[j + 1]) {
                tmp = array[j];         /// просто перезаписываем
                array[j] = array[j + 1];
                array[j + 1] = tmp;
            }
        }
    }
}
```

Теперь сравним оба метода используя библиотеку google benchmark
```c++
#include <iostream>
#include <benchmark/benchmark.h>

static void BM_TmpInside(benchmark::State& state)
{
    const int size = 1000;
    for (auto _ : state) {
        /// создаем массив на 1000 эл-тов, заполненных от 1000 до 1
        int arr[size];
        for (int i = 0; i < size; ++i) arr[i] = size - i;

        /// сортировка пузырьком
        for (int i = 0; i < size; ++i) {
            for (int j = 0; j < size - i - 1; ++j) {
                if (arr[j] > arr[j + 1]) {
                    int tmp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tmp;
                }
            }
        }
        benchmark::DoNotOptimize(arr);
    }
}
BENCHMARK(BM_TmpInside);

static void BM_TmpOutside(benchmark::State& state)
{
    const int size = 1000;
    for (auto _ : state) {
        /// создаем массив на 1000 эл-тов, заполненных от 1000 до 1
        int arr[size];
        for (int i = 0; i < size; ++i) arr[i] = size - i;

        /// сортировка пузырьком
        int tmp;
        for (int i = 0; i < size; ++i) {
            for (int j = 0; j < size - i - 1; ++j) {
                if (arr[j] > arr[j + 1]) {
                    tmp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tmp;
                }
            }
        }
        benchmark::DoNotOptimize(arr);
    }
}
BENCHMARK(BM_TmpOutside);

BENCHMARK_MAIN();
```

Запускаем и видим следующий вывод
```
--------------------------------------------------------
Benchmark              Time             CPU   Iterations
--------------------------------------------------------
BM_TmpInside      851230 ns       851230 ns          822
BM_TmpOutside     851297 ns       851297 ns          822
```

- Параметр Time - это среднее время выполнения одной итерации в наносекундах
- CPU - время работы процессора, которое в большинстве случаев совпадает с параметром Time
- Iterations - сколько раз бенчмарк выполнил код для получения статистики

Разница между методами составляет 67 наносекунд, то есть менее 0.1%, а значит никакой оптимизации нет и это всего лишь статистически незначимая погрешность.

Для того, чтобы понять почему так происходит скомпилируем оба метода вручную и рассмотрим ассемблерный код

```c++
#include <iostream>

void tmpInside(int array[], int size)
{
    for (int i = 0; i < size; ++i) {
        for (int j = 0; j < size - 1; ++j) {
            if (array[j] > array[j + 1]) {
                int tmp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = tmp;
            }
        }
    }
}

void tmpOutside(int array[], int size)
{
    int tmp;
    for (int i = 0; i < size; ++i) {
        for (int j = 0; j < size - 1; ++j) {
            if (array[j] > array[j + 1]) {
                tmp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = tmp;
            }
        }
    }
}

int main()
{
    int arr[] = {5, 2, 8, 1, 9, 3, 7, 4, 6, 0};
    int size = sizeof(arr) / sizeof(arr[0]);
    
    tmpInside(arr, size);
    // tmpOutside(arr, size);
    
    return 0;
}
```

Компилируем метод с переменной внутри цикла
```bash
g++ -S -O2 main.cpp -o inside.s
```
Компилируем метод с переменной за пределами цикла, предварительно раскомментировав сам метод в main.cpp
```bash
g++ -S -O2 main.cpp -o outside.s
```

И по итогу получаем два ассемблерных файла 

Сравниваем их и видим, что оба файла идентичны, а значит оба метода были скомпилированы в идентичный ассемблерный код
```bash
diff inside.s outside.s
```

Ключевой фрагмент ассемблерного кода выглядит следующим образом
```
.L3:
    movl    (%rax), %edx    ; edx = array[j]   (загружаем в РЕГИСТР edx)
    movl    4(%rax), %ecx   ; ecx = array[j+1] (загружаем в РЕГИСТР ecx)
    cmpl    %ecx, %edx      ; сравниваем array[j] и array[j+1]
    jle     .L6             ; если <=, прыгаем
    movl    %ecx, (%rax)    ; array[j] = ecx (бывш. array[j+1])
    movl    %edx, 4(%rax)   ; array[j+1] = edx (бывш. array[j])
```

Как видно из двух последних строчек процессор напрямую меняет значения между регистрами `edx` и `ecx` без создания временной переменной, данная ситуация возникает по причине того, что при запуске приложения, то есть release сборке большинство IDE используют флаги оптимизации из коробки, хотя в текущем примере мы выполнили это явно, указав при компиляции флаг -O2 

Для примитивных типов данных, таких как: int, char, double оптимизация в виде выноса за пределы цикла не имеет смысла, поскольку у них отсутствуют конструкторы и деструкторы и компилятор с оптимизациями хранит такие переменные в регистрах процессора

Теперь рассмотрим создание сложного типа с конструктором и деструктором на примере вектора

Оба метода создают матрицу из векторов, заполненных псевдослучайными цифрами

```c++
static void BM_VectorInside(benchmark::State& state)
{
    const int rows = 10000;
    const int cols = 10000;

    for (auto _ : state) {
        vector<vector<int>> matrix;
        for (int i = 0; i < rows; ++i) {
            vector<int> array;
            for (int j = 0; j < cols; ++j) {
                array.push_back(std::rand());
            }
            matrix.push_back(array);
        }
        benchmark::DoNotOptimize(matrix);
    }
}
BENCHMARK(BM_VectorInside);

static void BM_VectorOutside(benchmark::State& state)
{
    const int rows = 10000;
    const int cols = 10000;

    for (auto _ : state) {
        vector<vector<int>> matrix;
        vector<int> array;
        for (int i = 0; i < rows; ++i) {
            array.clear();  /// очищаем, но память не освобождается
            for (int j = 0; j < cols; ++j) {
                array.push_back(rand());
            }
            matrix.push_back(array);
        }
        benchmark::DoNotOptimize(matrix);
    }
}
BENCHMARK(BM_VectorOutside);

BENCHMARK_MAIN();
```

```
-----------------------------------------------------------
Benchmark                 Time             CPU   Iterations
-----------------------------------------------------------
BM_VectorInside   731380575 ns    731282078 ns            1
BM_VectorOutside  626993067 ns    626990152 ns            1
```

Разница составляет 14%, что является значимым результатом, а значит для сложных типов с нетривиальным конструктором и деструктором такая оптимизация имеет смысл