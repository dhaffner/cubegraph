import { useQuery } from "@apollo/react-hooks";
import { Divider, Grid, Tooltip } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import "@scarygami/scary-cube";
import { gql } from "apollo-boost";
import React, { Fragment, useEffect, useState } from "react";
import CubeSVG from "./StaticCube";
import { get } from "lodash";

import { SOLVED_CUBE } from "./helpers";
const getSolutionPath = gql`
  query getSolution($source: String, $target: String) {
    path(source: $source, target: $target) {
      move
      source
      target
    }
  }
`;

const useStyles = makeStyles({
  root: {
    minWidth: "100%",
    maxHeight: "30vh",
    overflow: "auto",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  //   title: {
  //     fontSize: 14,
  //   },
  pos: {
    marginBottom: 12,
  },
  primary: {
    fontSize: 10,
  },
});

function HoverableMove({ move, source, target, onClick }) {
  return (
    <Tooltip title={target} aria-label={move}>
      <span
        onClick={() => {
          onClick(target);
        }}
      >
        {move}
      </span>
    </Tooltip>
  );
}

export function PathList({ source, steps, setFaces, setNextMove }) {
  let [path, setPath] = useState([]);
  const classes = useStyles();
  useEffect(() => {
    // The source cube has changed; see if it is in our list of steps.
    let index = path.findIndex(({ target }) => target == source),
      truePath;
    if (index < 0) {
      // Source is a cube outside of our current path; re-start
      truePath = steps;
      console.log("in the path!");
    } else {
      truePath = path.slice(index + 1);
    }
    setPath(truePath);
  }, [source, steps]);

  useEffect(() => {
    let first = path.length > 0 && path[0];
    setNextMove(first ? first : null);
  }, [path]);
  return (
    <div className='path-list'>
      {path.map(({ move, target, source }, i) => (
        <Fragment key={target}>
          {i > 0 && "  "}
          <HoverableMove
            key={target}
            move={move}
            source={source}
            target={target}
            onClick={() => setFaces(target)}
          />
        </Fragment>
      ))}
    </div>
  );
}

export default function ({ faces, setFaces, setNextMove }) {
  const classes = useStyles();

  const { loading, error, data } = useQuery(getSolutionPath, {
    variables: { source: faces, target: SOLVED_CUBE },
  });

  return (
    <PathList
      steps={get(data, "path", [])}
      source={faces}
      setFaces={setFaces}
      setNextMove={setNextMove}
    />
  );
}
