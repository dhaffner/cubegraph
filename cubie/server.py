import os

from flask import Flask, jsonify, request

from ariadne import ObjectType, QueryType, graphql_sync, make_executable_schema
from ariadne.constants import PLAYGROUND_HTML
from cubie.cube import Cube


type_defs = """
    type Visitor {
        id: ID!
        name: String
    }

    type Cube {
        id: ID!
        visitors: [Visitor]
        neighbors: [Step]
    }

    type Step {
        source: ID!
        target: ID!
        move: String
    }

    type Query {
        random: Cube!
        visitors(id: String): [Visitor]
        path(source: String, target: String): [Step]
        neighbors(source: String): [Step]
    }

    type Mutation {
        visit(cube: ID): [Visitor]
    }
"""


query = QueryType()
cubeType = ObjectType('Cube')


@query.field("path")
def resolve_path(*_, source=None, target=None):
    algorithm, steps = Cube.from_iterable(source).path(to=target)
    return steps


@query.field("random")
def resolve_hello(_, info):
    cube = Cube.random()
    return dict(id=str(cube))


@query.field("visitors")
def resolve_visitors(_, info):
    return []


@query.field("neighbors")
def resolve_neighbors(*_, source=None):
    neighbors = Cube.from_iterable(source).get_neighbors()
    return [
        {'move': move, 'target': str(cube), 'source': source}
        for (move, cube) in neighbors
    ]


@cubeType.field('neighbors')
def resolve_cube_neighbors(cube, *_):
    return resolve_neighbors(source=cube['id'])


schema = make_executable_schema(type_defs, query, cubeType)

app = Flask(
    __name__,
    static_folder='../build',
    static_url_path='/')


@app.route('/', methods=['GET'])
def index():
    return app.send_static_file('index.html')


@app.route("/graphql", methods=["GET"])
def graphql_playgroud():
    return PLAYGROUND_HTML, 200


@app.route("/graphql", methods=["POST"])
def graphql_server():
    data = request.get_json()
    success, result = graphql_sync(
        schema,
        data,
        context_value=request,
        debug=app.debug
    )
    status_code = 200 if success else 400
    return jsonify(result), status_code


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
