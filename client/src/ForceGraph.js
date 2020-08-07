import { useTheme } from "@material-ui/core/styles";
import { uniq, cloneDeep as clone, now } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { SOLVED_CUBE } from "./helpers";

let PULSE_INTERVAL = 2000;
export default function ForceGraph({
  cube,
  path,
  neighbors,
  width,
  height,
  onClick,
  hovered,
}) {
  const fgRef = useRef();

  const theme = useTheme();

  let [graph, setGraph] = useState({ links: [], nodes: [] });
  let [clicked, setClicked] = useState(cube);
  let [visited, setVisited] = useState(new Set());
  let allNodes = new Set();

  let fixNode = (nodes, id) => {
    for (let i = 0; i < nodes.length; ++i) {
      if (nodes[i].id !== id) continue;
      let { index, x, y } = nodes[i];
      nodes[index] = { ...nodes[index], fx: x, fy: y };
      console.log("fixed", id, x, y);
      return nodes[index];
    }
  };

  let panToNode = (nodes, id) => {
    for (let i = 0; i < nodes.length; ++i) {
      if (nodes[i].id !== id) continue;
      let { index, x, y } = nodes[i];
      //   nodes[index] = { ...nodes[index], fx: x, fy: y };
      //   console.log("fixed", id, x, y);
      if (x && y && fgRef && fgRef.current) fgRef.current.centerAt(x, y, 500);
      // return nodes[index];
    }
  };
  useEffect(() => {
    console.log("useEffect!");
    setGraph(({ links, nodes }) => {
      nodes.forEach(({ id }) => {
        allNodes.add(id);
      });

      let newNodes = [cube];
      neighbors.forEach(({ source, target }) => {
        newNodes.push(source, target);
      });
      path.forEach(({ source, target }) => {
        newNodes.push(source, target);
      });

      newNodes = uniq(newNodes).filter((id) => !allNodes.has(id));
      let filteredLinks = [...clone(path), ...clone(neighbors)];

      return {
        nodes: [
          ...nodes,
          ...newNodes.map((node) => {
            return node && node.id ? node : { id: node };
          }),
        ],
        links: [...links, ...filteredLinks],
      };
    });
  }, [path]);

  useEffect(() => {
    setGraph(({ links, nodes }) => {
      //   fixNode(nodes, cube);
      panToNode(nodes, cube);
      return { links, nodes };
    });
    setClicked(cube);
    setVisited((visited) => visited.add(cube));
  }, [cube]);

  let neighborIds = new Set(neighbors.map(({ target }) => target));
  let pathIds = new Set([cube, ...path.map(({ target }) => target)]);

  let COLORS = {
    CURRENT: theme.palette.primary.dark,
    NEIGHBOR: theme.palette.secondary.light,
    PATH: theme.palette.info.main,
    OTHER: "#999",
    VISITED: theme.palette.primary.light,
    SOLUTION: theme.palette.success.main,
    HOVERED: theme.palette.warning.light,
  };
  function getColor({ id }) {
    if (id === SOLVED_CUBE) return COLORS.SOLUTION;
    if (id === clicked) return COLORS.CURRENT;
    if (id === hovered) return COLORS.HOVERED;
    else if (visited.has(id)) return COLORS.VISITED;
    else if (pathIds.has(id)) return COLORS.PATH;
    else if (neighborIds.has(id)) return COLORS.NEIGHBOR;

    return COLORS.OTHER;
  }
  function getVal({ id }) {
    if (SOLVED_CUBE === id) {
        return 20;
      }
    if (hovered === id) {
      let t = now() % PULSE_INTERVAL;
      return 5 + (t / PULSE_INTERVAL) * 4;
    }

    if (id === cube) return 15;
    else if (visited.has(id)) return 10;
    else if (pathIds.has(id)) return 5;
    else if (neighborIds.has(id)) return 10;
    return 1;
  }

  function isCoolNode({ id }) {
    return (
      id === clicked || id === hovered || neighborIds.has(id) || pathIds.has(id) || visited.has(id)
    );
  }

  function zoomIt() {
    fgRef.current.zoomToFit(200, 20, isCoolNode)
  }

  console.log("Graph render...", visited);
  return (
    <ForceGraph2D
      ref={fgRef}
      //   nodeCanvasObject={drawNode}
      width={width}
      height={height}
      nodeRelSize={4}
      graphData={graph}
      nodeLabel="id"
      linkColor={() => "#aaa"}
      linkOpacity={() => 0.05}
      linkDirectionalParticleColor={() => "#666"}
      linkDirectionalParticles={2}
      linkDirectionalParticleSpeed={5 * 0.001}
      cooldownTicks={2000}
      cooldownTime={2000}
      nodeColor={getColor}
      nodeVal={getVal}
      onNodeDragEnd={(node) => {
        node.fx = node.x;
        node.fy = node.y;
      }}
      onEngineStop={() => {
          zoomIt();
      }}
      onNodeClick={(node, event) => {
        setGraph(({ nodes, links }) => {
          node[node.index] = { ...node, fx: node.x, fy: node.y };
          return { nodes, links };
        });
        setVisited((visited) => visited.add(node.id));
        setTimeout(() => {
          onClick(node);
        }, 200);
      }}
    />
  );
}
