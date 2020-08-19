const XMLWriter = require('xml-writer');

const WIDTH = 1000
const HEIGHT = 1000
let NODE_SIZE = 30;

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

const writeLine = (writer, x1, y1, x2, y2) => {
    writer.startElement('line')
        .writeAttribute("x1", x1)
        .writeAttribute("y1", y1)
        .writeAttribute("x2", x2)
        .writeAttribute("y2", y2)
        .writeAttribute("class", "invisible")
        .writeAttribute("stroke", "steelblue");
    writer.endElement();
}

const writeNode = (writer, node, x, y) => {
    console.log(node)
    writer.startElement('text')
        .writeAttribute('class', 'cls-3')
        .writeAttribute('x', x)
        .writeAttribute('y', y);

    if (node.dataNode.species) {
        if  (node.dataNode.part) {
            writer.text(node.dataNode.part);
        } else {
            writer.text(node.dataNode.species);
        }
    } else if (node.dataNode.material) {
        writer.text(node.dataNode.material);
    } else if (node.dataNode.process) {
        writer.text(node.dataNode.process);
    }

    writer.endElement();
}

const writeDocumentStart = (writer, title) => {
    writer.startDocument()
    writer.startElement('svg')
        .writeAttribute('id', 'Layer_1')
        .writeAttribute('data-name', 'Layer 1')
        .writeAttribute('xmlns', 'http://www.w3.org/2000/svg')
        .writeAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
        .writeAttribute('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)

    writer.startElement('defs')
        .writeElement('style', '.cls-1,.cls-6{fill:none;}.cls-2{clip-path:url(#clip-path);}.cls-3,.cls-5{font-size:12px;font-family:Helvetica-Bold, Helvetica;font-weight:700;}.cls-4,.cls-5{fill:#25408f;}.cls-6{stroke:#000;stroke-width:1.5px;}');
    writer.startElement('clipPath')
        .writeAttribute('id', 'clip-path');
    writer.startElement('rect')
        .writeAttribute('class', 'cls-1')
        .writeAttribute('width', WIDTH)
        .writeAttribute('height', HEIGHT);
    writer.endElement();
    writer.endElement();
    writer.endElement();

    writer.startElement('title');
    writer.text(title);
    writer.endElement();
}

const writeSvg = (tree) => {
    const writer = new XMLWriter

    writeDocumentStart(writer, 'plants')

    const [treeWidth, treeHeight] = getDimensions(tree)
    const levelWidth = WIDTH / (treeWidth + 1)
    const levelHeight = HEIGHT / (treeHeight + 1)

    NODE_SIZE = Math.min(NODE_SIZE, levelWidth, levelHeight)
    const nodeOffsetX = levelWidth / 2 - NODE_SIZE / 2
    const nodeOffsetY = levelHeight / 2 - NODE_SIZE / 2

    writer.startElement('g')
        .writeAttribute('class', 'cls-2');

    let nodes = [tree];
    while (nodes.length) {
        let node = nodes.shift();
        let x1 = node.finalX * levelWidth + nodeOffsetX;
        let y1 = node.y * levelHeight + nodeOffsetY;

        writeNode(writer, node, x1, y1)

        for (let i = 0; i < node.children.length; i++) {
            let x2 = node.children[i].finalX * levelWidth + nodeOffsetX;
            let y2 = node.children[i].y * levelHeight + nodeOffsetY;

            writeLine(writer, x1, y1, x2, y2)
        }

        nodes = nodes.concat(node.children);
    }

    writer.endElement()
    writer.endDocument()

    return writer.toString()
}

module.exports = {
    writeSvg
}
