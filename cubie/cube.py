from itertools import chain, product
from collections import Iterable, defaultdict

from pycuber import Cube as BaseCube, Formula
from pycuber.cube import Square, Centre, Edge, Corner

from kociemba import solve

from .constants import (
    FACE_ORDER, COLOR_MAP, CUBIES_BY_FACE, INVERSE_COLOR_MAP)


class Cube(BaseCube):
    @staticmethod
    def random():
        formula, cube = Formula(), Cube()
        return cube(formula.random())

    def solution(self):
        return self.path(to=None)

    def path(self, to=None):
        algorithm = solve(str(self), str(
            to)) if to is not None else solve(str(self))
        steps = []
        cube = Cube.from_iterable(str(self))
        for move in algorithm.split(' '):
            source = str(cube)
            cube(move)
            target = str(cube)
            steps.append({
                'source': source,
                'target': target,
                'move': move,
            })
        return algorithm, steps

    def __str__(self, face_order=FACE_ORDER):
        '''
        UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB.
        '''
        all_faces = (chain.from_iterable(self.get_face(f)) for f in face_order)
        squares = chain.from_iterable(all_faces)

        return ''.join(
            COLOR_MAP[square.colour] for square in squares
        )

    def __repr__(self):
        return str(self)

    def get_neighbors(self, depth=2):
        def next(move):
            return self.copy()(move)

        variants = ["", "'"]
        if depth >= 2:
            print(depth)
            variants.append("2")

        for (face, variant) in product(FACE_ORDER, variants):
            move = face + variant
            yield move, next(move)

    def copy(self):
        return self.__class__.from_iterable(str(self))

    @property
    def solved(self):
        return str(self) == ''.join(c * 9 for c in FACE_ORDER)

    @classmethod
    def from_iterable(cls, iterable, face_order=FACE_ORDER):
        assert isinstance(iterable, Iterable) and len(iterable) == 54
        array = list(chain.from_iterable(iterable))
        result = defaultdict(dict)

        cubies_by_face = ((face, CUBIES_BY_FACE[face]) for face in face_order)
        for face, cubies in cubies_by_face:
            for cubie in cubies:
                result[cubie][face] = Square(INVERSE_COLOR_MAP[array.pop(0)])

        return cls(cubies={
            [Centre, Edge, Corner][len(cubie) - 1](**cubie)
            for cubie in result.values()
        })

    def serialize(self, with_neighbors=0):
        c = str(self)
        data = {'cube': c}
        if with_neighbors > 0:
            data['neighbors'] = [
                {'move': move, 'cube': cube.serialize()} for (move, cube) in self.get_neighbors(with_neighbors)
            ]
        return data

    @property
    def id(self):
        return str(self)

    def __hash__(self):
        return hash(str(self))