const XMLWriter = require('xml-writer');

const WIDTH = 1000
const HEIGHT = 1000

const Y_START = 20
const Y_INCREASE = 100

const X_MARGIN = 50

const TREE_WIDTH = 200

const getYForLevel = (level) => {
    return Y_START + Y_INCREASE * level
}

const getXForNode = (nodeIndex, tree) => {
    if (nodeIndex === 0) {
        return tree.xStart + X_MARGIN
    } else if (nodeIndex === 1) {
        return tree.xEnd - X_MARGIN
    } else if (nodeIndex === 2) {
        return tree.xStart + ((tree.xEnd - tree.xStart / 2) - 50)
    }
}

class Node {
    constructor(x, y, parent, prevSibling, dataNode) {
        this.x = x;
        this.y = y;
        this.finalY = 0;
        this.modifier = 0;

        this.parent = parent;
        this.prevSibling = prevSibling;
        this.children = [];

        this.dataNode = dataNode;
        this.collapse = false;
    }
}

const buildTree = (dataNode, parent, prevSibling, level)  => {
    let root = new Node(level, 0, parent, prevSibling, dataNode);
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
    return root;
}


function Builder(json) {
    this.writer = new XMLWriter;
    this.data = json
    this.tree = buildTree(json, null, null, 0)

    console.log(JSON.stringify(this.tree));

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

    //draw root node
    const rootNode = {
        x: (WIDTH / 2) - 50,
        y: getYForLevel(0),
        text: json.species
    }
    this.drawNode(rootNode, json.parts.length)

    //draw part nodes
    json.parts.map((part, index) => {
        let x = 0

        const tree = {
            xStart: rootNode.x - TREE_WIDTH,
            xEnd: rootNode.x + TREE_WIDTH
        }

        const partNode = {
            x: getXForNode(index, tree),
            y: getYForLevel(1),
            text: part.part_name
        }

        const subTree = {
            xStart: partNode.x - TREE_WIDTH,
            xEnd: partNode.x + TREE_WIDTH
        }
        console.log(`subtree for part ${part.part_name}`)
        console.log(subTree)

        this.drawNode(partNode, part.operations.length)
        this.drawOperationTree(part.operations, subTree)
    })
}

Builder.prototype.drawOperationTree = function (operations, tree) {
    operations.map((operation, index) => {
        const process = operation.process

        const node = {
            x: getXForNode(index, tree),
            y: getYForLevel(2),
            text: process.process
        }

        //draw process node
        this.drawNode(node, 1)

        const subTree = {
            xStart: node.x - TREE_WIDTH,
            xEnd: node.x + TREE_WIDTH
        }
        console.log(`subtree for process ${process}`)
        console.log(subTree)
        operation.materials.map((material, index) => {
            this.drawMaterialTree(material, index, 3, subTree)
        })
    })
}

Builder.prototype.drawMaterialTree = function (material, index, level, subTree) {
    const node = {
        x: getXForNode(index, subTree),
        y: getYForLevel(level),
        text: material.material.material
    }
    console.log(`${material.material.material} @`)
    console.log(node)
    this.drawNode(node, 0)
}

Builder.prototype.drawNode = function (node, childrenNumber) {
    this.addTextElement(node.x, node.y, 'cls-3', node.text)

    const downLineX = node.x + 25
    const downLineY = node.y + 10
    this.addLineElement(downLineX, downLineY, downLineX, node.y + Y_INCREASE - 20)
}

Builder.prototype.addTextElement = function(x, y, className, content) {
    this.writer.startElement('text')
        .writeAttribute('class', className)
        .writeAttribute('x', x)
        .writeAttribute('y', y);
    this.writer.text(content);
    this.writer.endElement();
}

Builder.prototype.addLineElement = function (x1, y1, x2, y2){
    this.writer.startElement('line')
        .writeAttribute('class', 'cls-6')
        .writeAttribute('x1', x1)
        .writeAttribute('y1', y1)
        .writeAttribute('x2', x2)
        .writeAttribute('y2', y2);
    this.writer.endElement();
}

Builder.prototype.addPart = function (part, index) {
    this.currentPartIndex = index

    const bla = (WIDTH / (this.partsNumber * 2))
    const partX = bla * (index + 1)
    console.log(`partX ${partX}`)

    this.addTextElement(partX, PART_Y, 'cls-3', part.part_name)
}

Builder.prototype.getData = function () {
    this.writer.endElement();
    this.writer.endDocument();
    return this.writer.toString();
}

module.exports = Builder
