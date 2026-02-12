class Node {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
        this.height = 1;

        this.x = 0;
        this.y = 0;
    }
}

let root = null;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const levelGap = 80;
const nodeRadius = 22;
const horizontalGap = 160;

// ---------- AVL LOGIC ----------

function height(n) {
    return n ? n.height : 0;
}

function balance(n) {
    return n ? height(n.left) - height(n.right) : 0;
}

function rightRotate(y) {

    let x = y.left;
    let t2 = x.right;

    x.right = y;
    y.left = t2;

    y.height = Math.max(height(y.left), height(y.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;

    return x;
}

function leftRotate(x) {

    let y = x.right;
    let t2 = y.left;

    y.left = x;
    x.right = t2;

    x.height = Math.max(height(x.left), height(x.right)) + 1;
    y.height = Math.max(height(y.left), height(y.right)) + 1;

    return y;
}

function insertNode(node, val) {

    if (!node) return new Node(val);

    if (val < node.val)
        node.left = insertNode(node.left, val);

    else if (val > node.val)
        node.right = insertNode(node.right, val);

    else
        return node;

    node.height = 1 + Math.max(height(node.left), height(node.right));

    let bf = balance(node);

    // LL
    if (bf > 1 && val < node.left.val)
        return rightRotate(node);

    // RR
    if (bf < -1 && val > node.right.val)
        return leftRotate(node);

    // LR
    if (bf > 1 && val > node.left.val) {
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }

    // RL
    if (bf < -1 && val < node.right.val) {
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }

    return node;
}

// ---------- BUTTONS ----------

function insertValue() {

    let val = document.getElementById("valueInput").value;

    if (val === "") return;

    root = insertNode(root, parseInt(val));
    updatePositions();
    drawTree();

    document.getElementById("valueInput").value = "";
}

function clearTree() {
    root = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ---------- TREE LAYOUT ----------

function updatePositions() {

    let startX = canvas.width / 2;

    assignPos(root, 1, startX, horizontalGap);
}

function assignPos(node, depth, x, gap) {

    if (!node) return;

    node.x = x;
    node.y = depth * levelGap;

    assignPos(node.left, depth + 1, x - gap, gap / 2);
    assignPos(node.right, depth + 1, x + gap, gap / 2);
}

// ---------- DRAWING ----------

function drawTree() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawEdges(root);
    drawNodes(root);
}

function drawNodes(node) {

    if (!node) return;

    // Circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Text
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.val, node.x, node.y);

    drawNodes(node.left);
    drawNodes(node.right);
}

function drawEdges(node) {

    if (!node) return;

    if (node.left) {
        drawLine(node, node.left);
    }

    if (node.right) {
        drawLine(node, node.right);
    }

    drawEdges(node.left);
    drawEdges(node.right);
}

function drawLine(parent, child) {

    ctx.beginPath();
    ctx.moveTo(parent.x, parent.y + nodeRadius);
    ctx.lineTo(child.x, child.y - nodeRadius);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
}
