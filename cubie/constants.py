CUBE_STRING_LENGTH = 54
COLOR_MAP = {
    "red": "L",
    "yellow": "U",
    "green": "F",
    "white": "D",
    "orange": "R",
    "blue": "B"
}
FACE_ORDER = 'URFDLB'
INVERSE_COLOR_MAP = {value: key for (key, value) in COLOR_MAP.items()}
CUBIES_BY_FACE = {
    'B': ['RBU', 'BU', 'LBU', 'RB', 'B', 'LB', 'RBD', 'BD', 'LBD'],
    'D': ['LFD', 'FD', 'RFD', 'LD', 'D', 'RD', 'LBD', 'BD', 'RBD'],
    'F': ['LFU', 'FU', 'RFU', 'LF', 'F', 'RF', 'LFD', 'FD', 'RFD'],
    'L': ['LBU', 'LU', 'LFU', 'LB', 'L', 'LF', 'LBD', 'LD', 'LFD'],
    'R': ['RFU', 'RU', 'RBU', 'RF', 'R', 'RB', 'RFD', 'RD', 'RBD'],
    'U': ['LBU', 'BU', 'RBU', 'LU', 'U', 'RU', 'LFU', 'FU', 'RFU']
}