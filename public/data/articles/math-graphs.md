## Топологическая сортировка

Для ориентированного ациклического графа (DAG).

```python
def topo_sort(graph):
    visited = set()
    order = []
    def dfs(v):
        visited.add(v)
        for u in graph[v]:
            if u not in visited:
                dfs(u)
        order.append(v)
    for v in graph:
        if v not in visited:
            dfs(v)
    return order[::-1]
```