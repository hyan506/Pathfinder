let cameFrom = [];

export const astar = (grid, startNode, finishNode) => {
  // console.log(grid[startNode.row][startNode.col]);
  const visitedNodesInOrder = [];
  // Initially, only the start node is known.
  let visitedNodes = [];
  visitedNodes.push(startNode);
  // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start to n currently known.
  initializeCameFrom(grid);

  //the cost of the cheapest path from start to n currently known.
  let gScore = infinityScoreGrid(grid);
  gScore[startNode.row][startNode.col] = 0;

  //fScore[n] := gScore[n] + h(n).
  let fScore = infinityScoreGrid(grid);
  fScore[startNode.row][startNode.col] = hCost(startNode, finishNode);

  while (visitedNodes.length !== 0) {
    const currentNode = findCurrentNode(visitedNodes, fScore);
    if (currentNode === finishNode) {
      return visitedNodesInOrder;
    }
    visitedNodes.splice(visitedNodes.indexOf(currentNode), 1);
    const neighbor = getUnvisitedNeighbors(currentNode, grid);
    for (const n of neighbor) {
      if (n.type === "node-wall") continue;
      // tentative_gScore is the distance from start to the neighbor through current
      const tentative_gScore =
        gScore[currentNode.row][currentNode.col] + 1;
      if (tentative_gScore < gScore[n.row][n.col]) {
        // This path to neighbor is better than any previous one. Record it!
        cameFrom[n.row][n.col] = currentNode;
        gScore[n.row][n.col] = tentative_gScore;
        fScore[n.row][n.col] = gScore[n.row][n.col] + hCost(n, finishNode);
        if (visitedNodes.indexOf(n) === -1) {
          visitedNodes.push(n);
          visitedNodesInOrder.push(n);
          n.isVisited = true;
        }
      }
    }
  }
  return visitedNodesInOrder;
};

const hCost = (currentNode, finishNode) => {
  return Math.sqrt(
    Math.pow(currentNode.row - finishNode.row, 2) +
    Math.pow(currentNode.col - finishNode.col, 2)
  );
};

const findCurrentNode = (visitedNodes, fScore) => {
  let currentNode;

  let shortest = 9999;
  for (const node of visitedNodes) {
    if (fScore[node.row][node.col] < shortest) {
      shortest = fScore[node.row][node.col];
      currentNode = node;
    }
  }
  return currentNode;
};

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}

const infinityScoreGrid = grid => {
  const scores = [];
  for (const row of grid) {
    const scoreRow = [];
    for (let i = 0; i < row.length; i++) {
      scoreRow.push("9999");
    }
    scores.push(scoreRow);
  }
  return scores;
};

const initializeCameFrom = grid => {
  for (const row of grid) {
    const cameFromRow = [];
    for (let i = 0; i < row.length; i++) {
      cameFromRow.push("");
    }
    cameFrom.push(cameFromRow);
  }
  return;
};

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the a star method above.
export function reconstructPathAstar(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== "") {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = cameFrom[currentNode.row][currentNode.col];
  }
  return nodesInShortestPathOrder;
}
