from itertools import chain

from .cube import Cube

class Path(object):
    def __init__(self, source=None, target=None):
        self.source = source
        self.target = target

    def __len__(self):
        return len(list(iter(self)))

    def __str__(self):
        return f'<Path: {self.source} -> {self.target}>'

    def __iter__(self):
        yield from self.path()

    def path_naive(self):
        (a1, s1), (a2, s2) = (
            self.source.solution(path=True, simple=True),
            self.target.solution(path=True, simple=True)
        )
        s1.insert(0, str(self.source))
        s2.insert(0, str(self.target))
        yield from shorten(chain(s1, s2[-2::-1]))

    def path(self, method='naive'):
        if method == 'naive':
            yield from self.path_naive()
        else:
            raise NotImplemented

    @classmethod
    def random(self):
        return Path(source=Cube.random(), target=Cube.random())


def shorten(path):
    path = list(path)
    pointers = dict()
    for (i, p) in enumerate(path):
        if p in pointers:
            j = pointers[p]
            return chain(path[0:j], path[i:])
        pointers[p] = i
    return path
