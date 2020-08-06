from functools import reduce
from itertools import combinations, chain
from pprint import pprint
from time import time

from cubie.path import Path
from cubie.cube import Cube


class Timer(object):
    def __init__(self):
        self.t = time()

    def __str__(self):
        return '{0:.5f}'.format(time() - self.t)

    def __call__(self, message=''):
        print(f'{self}: {message}')


def get_tail(cube, n=2):
    _, steps = cube.solution(simple=True, path=True)
    return steps[-n]


def get_cubes(count=100, tail=5):
    cubes = (Cube.random() for _ in range(count))
    return (get_tail(cube, n=tail) for cube in cubes)


def paths(n=10, tail=4):
    a = Cube.random()
    for i in range(n):
        b = Cube.random()
        pprint(b.path(to=a))

        print('\n' * 4)


def random_graph(n=10):
    nodes = {Cube.random() for _ in range(n)}
    edges = (start.path(to=end) for (start, end) in combinations(nodes, 2))
    return dict(
        nodes=nodes,
        edges=list(
            chain.from_iterable(edges)
        )
    )


if __name__ == '__main__':
    pprint(random_graph(n=3))
