import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import { Box, Grid, CircularProgress, ButtonGroup, Button } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import "@scarygami/scary-cube";
import { ApolloClient, gql, HttpLink, InMemoryCache } from 'apollo-boost';
import React, { useState } from 'react';
import './App.css';
import CubeController from './CubeController';
import Graph from './ForceGraph';
import Path from './PathList';
import Visitors from './Visitors';
import { cloneDeep, isEmpty, get, sample } from 'lodash';
import { useClientRect } from './hooks';
import randomCubes from './generated-cubes.json';
import { SOLVED_CUBE } from './helpers';
const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: '/graphql',
    })
});


const getSolutionPath = gql`
  query getSolution($source: String, $target: String) {
      neighbors(source: $source) {
          move, source, target
      }
    path(source: $source, target: $target) {
      move
      source
      target
    }
  }
`;

const randomCubeQuery = gql`
query {
    random{
      id
      visitors {
        name,
        
      }
    }  
}`

function App() {
    let [faces, updateFaces] = useState({ previous: null, current: sample(randomCubes) });
    let [graphReset, setGraphReset] = useState(0);

    let resetGraph = () => setGraphReset(value => value + 1);

    let setFaces = newFaces => {
        let { current } = faces;
        if (current !== newFaces) {
            updateFaces(({ current }) => ({ previous: current, current: newFaces }));
        }
    };

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(
        () =>
            createMuiTheme({
                palette: {
                    background: {
                        default: "rgb(242, 245, 182)"
                    },
                    type: 'light',
                },
            }),
        [prefersDarkMode],
    );

    console.log(theme);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className='cubegraph-buttons'>
                <ButtonGroup color="primary" aria-label="outlined primary button group" orientation="vertical">
                    <Button onClick={() => {
                        setFaces(sample(randomCubes));
                    }}>Random</Button>
                    {/* <Button>Zoom out</Button> */}
                    <Button onClick={resetGraph}>Reset</Button>
                </ButtonGroup>
            </div>
            <Container faces={faces.current} previous={faces.previous || SOLVED_CUBE} setFaces={setFaces} graphKey={graphReset} />
        </ThemeProvider>
    );
}


function Container({ faces, setFaces, previous: prevFaces, graphKey }) {
    let [rect, ref] = useClientRect({ width: 500, height: 100 });
    let [hovered, setHover] = useState(null);
    let [nextMove, setNextMove] = useState(null);
    const { loading, error, data } = useQuery(getSolutionPath, {
        variables: {
            source: faces,
            target: prevFaces,
        },
    });
    function changeFaces(newFaces) {
        setFaces(newFaces);
    }
    let LEFT_WIDTH = 4;
    console.log(rect.width, 'x', rect.height);
    let key = `${rect.width}x${rect.height}x${faces}`
    let neighbors = nextMove ? [{...nextMove}] : [];
    return (
        <>
            <Grid container>
                <Grid item xs={12} sm={5} className='grid'>
                    <Grid item xs={12}>
                        <Box m={2} >
                            <CubeController
                                key={key}
                                faces={faces}
                                onChange={changeFaces}
                                neighbors={cloneDeep(get(data, 'neighbors', []))}
                                onHover={(cube) => setHover(cube)}
                                nextMove={nextMove}
                            />
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={7} className="graph" ref={ref}>
                    <Graph
                        key={graphKey}
                        cube={faces}
                        width={rect.width}
                        height={rect.height}
                        path={get(data, 'path', [])}
                        onClick={({ id }) => changeFaces(id)}
                        hovered={hovered}
                        neighbors={neighbors} />
                </Grid>
            </Grid>
            <Path faces={faces} setFaces={changeFaces} setNextMove={setNextMove} />

        </>
    );
}

export default () => (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);
