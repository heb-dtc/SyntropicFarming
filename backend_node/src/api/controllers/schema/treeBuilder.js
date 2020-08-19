const X_MARGIN = 1

class Node {
    constructor(x, y, parent, prevSibling, dataNode) {
        this.x = x;
        this.y = y;
        this.finalX = 0;
        this.modifier = 0;

        this.parent = parent;
        this.prevSibling = prevSibling;
        this.children = [];

        this.dataNode = dataNode;
    }
}

function getContour(root, val, func) {
    let nodes = [root];
    while (nodes.length) {
        let node = nodes.shift();
        nodes = nodes.concat(node.children);
        val = func(val, node.finalX);
    }
    return val;
}

function shiftRight(root, shiftValue) {
    let nodes = [root];
    while (nodes.length) {
        let node = nodes.shift();
        nodes = nodes.concat(node.children);
        node.finalX += shiftValue;
    }
}

function assignSiblingCounts(root) {
    let nodes = [root, null];
    let level = [];

    let siblings = 0;
    while (nodes.length) {
        let node = nodes.shift();
        if (!node) {
            for (let i = 0; i < level.length; i++) {
                level[i].siblings = siblings;
            }
            level = [];
            siblings = 0;
            if (nodes.length) {
                nodes.push(null);
            }
        } else {
            nodes = nodes.concat(node.children);
            siblings++;
            level.push(node);
        }
    }
}

const fixNodeConflicts = (root) => {
    for (let i = 0; i < root.children.length; i++) {
        fixNodeConflicts(root.children[i]);
    }

    for (let i = 0; i < root.children.length - 1; i++) {
        // Get the right contour position of the current node
        let rightContour = getContour(root.children[i], -Infinity, Math.max);

        // Get the left contour position of the node next to the current one
        let leftContour = getContour(root.children[i + 1], Infinity, Math.min);

        if (rightContour >= leftContour) {
            shiftRight(root.children[i + 1], rightContour - leftContour + X_MARGIN);
        }
    }
}

/**
 * Find the lowest X value among all nodes
 * and shift all X values of all nodes by the minimum X value
 */
const updateXVals = (root) => {
    let minXVal = Infinity;
    let nodes = [root];

    while (nodes.length) {
        let node = nodes.shift();
        nodes = nodes.concat(node.children);
        if (node.finalX < minXVal) {
            minXVal = node.finalX;
        }
    }

    nodes = [root];
    while (nodes.length) {
        let node = nodes.shift();
        nodes = nodes.concat(node.children);
        node.finalX += Math.abs(minXVal);
    }
}

const calculateFinalValues = (node, modSum) => {
    node.finalX = node.x + modSum;
    for (let i = 0; i < node.children.length; i++) {
        calculateFinalValues(node.children[i], node.modifier + modSum);
    }
}

/**
 * Set X value to every node.
 *
 * if the node has no sibling then X is set to 0
 * otherwise, X is set to sibling X + X_MARGIN
 *
 * since the node will be centered on top of its children,
 * the modifier is also set here.
 */
const setXValuesForNodes = (node) => {
    for (let i = 0; i < node.children.length; i++) {
        setXValuesForNodes(node.children[i]);
    }

    if (node.prevSibling) {
        node.x = node.prevSibling.x + X_MARGIN;
    } else {
        node.x = 0;
    }

    if (node.children.length === 1) {
        node.modifier = node.x;
    } else if (node.children.length >= 2) {
        let minX = Infinity;
        let maxX = -minX;
        for (let i = 0; i < node.children.length; i++) {
            minX = Math.min(minX, node.children[i].x);
            maxX = Math.max(maxX, node.children[i].x);
        }
        node.modifier = node.x - (maxX - minX) / 2;
    }
}

/**
 * Returns a tree of Nodes given a JSON looking like:
 * {
 *     data: {...}
 *     children: [
 *         {
 *             data: {...}
 *             children: [...]
 *         }
 *     ]
 * }
 */
const build = (dataNode, parent, prevSibling, level)  => {
    let root = new Node(0, level, parent, prevSibling, dataNode.data);

    if (dataNode.children != null) {
        for (let i = 0; i < dataNode.children.length; i++) {
            root.children.push(
                build(
                    dataNode.children[i],
                    root,
                    i >= 1 ? root.children[i - 1] : null,
                    level + 1
                )
            );
        }
    } else {
        root.children.push()
    }
    return root;
}

const buildTree = (json) => {
    let tree = build(json, null, null, 0)

    setXValuesForNodes(tree);
    calculateFinalValues(tree, 0)
    updateXVals(tree)
    fixNodeConflicts(tree)
    assignSiblingCounts(tree)
    return tree
}

module.exports = {
    buildTree
}
