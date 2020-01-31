const XMLWriter = require('xml-writer');

const WIDTH = 1000
const HEIGHT = 1000
const X_MARGIN = 1

let NODE_SIZE = 30;

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

const getDimensions = (root) => {
    let minWidth = Infinity;
    let maxWidth = -minWidth;

    let minHeight = Infinity;
    let maxHeight = -minWidth;

    let nodes = [root];
    while (nodes.length) {
        let node = nodes.shift();
        nodes = nodes.concat(node.children);

        if (node.finalX < minWidth) {
            minWidth = node.finalX;
        }

        if (node.finalX > maxWidth) {
            maxWidth = node.finalX;
        }

        if (node.y < minHeight) {
            minHeight = node.y;
        }

        if (node.y > maxHeight) {
            maxHeight = node.y;
        }
    }
    return [maxWidth - minWidth, maxHeight - minHeight];
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
        // Get the bottom-most contour position of the current node
        let rightContour = getContour(root.children[i], -Infinity, Math.max);

        // Get the topmost contour position of the node underneath the current one
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

    console.log(minXVal)

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
const buildTree = (dataNode, parent, prevSibling, level)  => {
    let root = new Node(0, level, parent, prevSibling, dataNode.data);

    if (dataNode.children != null) {
        for (let i = 0; i < dataNode.children.length; i++) {
            root.children.push(
                buildTree(
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

function Builder(json) {
    this.writer = new XMLWriter;
    this.data = json
    this.tree = buildTree(json, null, null, 0)

    setXValuesForNodes(this.tree);
    calculateFinalValues(this.tree, 0)
    updateXVals(this.tree)
    fixNodeConflicts(this.tree)
    assignSiblingCounts(this.tree)

    console.log(this.tree)

    let [treeWidth, treeHeight] = getDimensions(this.tree);
    let levelWidth = WIDTH / (treeWidth + 1);
    let levelHeight = HEIGHT / (treeHeight + 1);

    NODE_SIZE = Math.min(NODE_SIZE, levelWidth, levelHeight);
    let nodeOffsetX = levelWidth / 2 - NODE_SIZE / 2;
    let nodeOffsetY = levelHeight / 2 - NODE_SIZE / 2;

        this.writer.startDocument();
    this.writer.startElement('svg')
        .writeAttribute('id', 'Layer_1')
        .writeAttribute('data-name', 'Layer 1')
        .writeAttribute('xmlns', 'http://www.w3.org/2000/svg')
        .writeAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
        .writeAttribute('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);

    this.writer.startElement('defs')
        .writeElement('style', '.cls-1,.cls-6{fill:none;}.cls-2{clip-path:url(#clip-path);}.cls-3,.cls-5{font-size:12px;font-family:Helvetica-Bold, Helvetica;font-weight:700;}.cls-4,.cls-5{fill:#25408f;}.cls-6{stroke:#000;stroke-width:1.5px;}');
    this.writer.startElement('clipPath')
            .writeAttribute('id', 'clip-path');
    this.writer.startElement('rect')
            .writeAttribute('class', 'cls-1')
            .writeAttribute('width', WIDTH)
            .writeAttribute('height', HEIGHT);
    this.writer.endElement();
    this.writer.endElement();
    this.writer.endElement();

    this.writer.startElement('title');
    this.writer.text('plants');
    this.writer.endElement();

    this.writer.startElement('g')
        .writeAttribute('class', 'cls-2');

    let nodeCount = 0;
    let nodes = [this.tree];
    while (nodes.length) {
        let node = nodes.shift();

        let parent = node.parent;

        let x1 = node.finalX * levelWidth + nodeOffsetX;
        let y1 = node.y * levelHeight + nodeOffsetY;

        this.writer.startElement('text')
            .writeAttribute('class', 'cls-3')
            .writeAttribute('x', x1)
            .writeAttribute('y', y1);
        if (node.dataNode.species) {
            if  (node.dataNode.part) {
                this.writer.text(node.dataNode.part);
            } else {
                this.writer.text(node.dataNode.species);
            }
        } else if (node.dataNode.material) {
            this.writer.text(node.dataNode.material);
        } else if (node.dataNode.process) {
            this.writer.text(node.dataNode.process);
        }
        this.writer.endElement();

        nodeCount += 1;
        for (let i = 0; i < node.children.length; i++) {
            let x2 = node.children[i].finalX * levelWidth + nodeOffsetX;
            let y2 = node.children[i].y * levelHeight + nodeOffsetY;

            this.writer.startElement('line')
                .writeAttribute("x1", x1)
                .writeAttribute("y1", y1)
                .writeAttribute("x2", x2)
                .writeAttribute("y2", y2)
                .writeAttribute("id", `line-${node.children[i].dataNode.count}`)
                .writeAttribute("class", "invisible")
                .writeAttribute("stroke", "steelblue");
            this.writer.endElement();
        }

        nodes = nodes.concat(node.children);
    }

    this.writer.endElement();
    this.writer.endDocument();
}

Builder.prototype.getData = function () {
    return this.writer.toString();
}

module.exports = Builder
