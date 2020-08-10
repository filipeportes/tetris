const step = 40;
const width = 400;
const height = 600;
const initialFrameRate = 1;

const forms = [
    { //I
        coordinates: [{x: 0, y: 0}, {x: 0, y: -1}, {x: 0, y: -2}, {x: 0, y: -3}],
        color: 'lightblue'
    },
    { //L
        coordinates: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: -2}],
        color: 'orange'
    },
    { //J
        coordinates: [{x: 0, y: 0}, {x: -1, y: 0}, {x: 0, y: -1}, {x: 0, y: -2}],
        color: 'blue'
    },
    { //T
        coordinates: [{x: 0, y: 0}, {x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}],
        color: 'purple'
    },
    { //O
        coordinates: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 1, y: -1}],
        color: 'yellow'
    },
    { //S
        coordinates: [{x: 0, y: 0}, {x: -1, y: 0}, {x: 0, y: -1}, {x: 1, y: -1}],
        color: 'lightgreen'
    },
    { //Z
        coordinates: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: -1}],
        color: 'red'
    }
]

let form;
let advanceLine = true;
let formY = 0;
let formX = width / 2 - step;
let gameover = false;
let score = 0;
let pile = [];

function setup() {
    createCanvas(width, height);
    textSize(18);
    form = randomForm();
}

function getFormPartCoordinate(formPart, color) {
    return {
        x: formX + (formPart.x * step),
        y: formY + (formPart.y * step),
        color: color
    };
}

function getFormCoordinates(form) {
    return form.coordinates.map(formPart => getFormPartCoordinate(formPart, form.color));
}

function drawForm(form) {
    fill(form.color);
    form.coordinates.forEach( formPart => {
        coordinate = getFormPartCoordinate(formPart, form.color);
        rect(coordinate.x, coordinate.y, step, step)
    });
}

function drawPile() {
    pile.forEach( position => {
        fill(position.color);
        rect(position.x, position.y, step, step);
    });
}

function addFormToPile(form) {
    pile.push.apply(pile, form.coordinates.map(formPart => getFormPartCoordinate(formPart, form.color)));
}

function checkPileColision(formCoordinates) {
    let colision = false;
    if (pile.length === 0) {
        return colision;
    }
    for (let i = 0; i < pile.length; i++) {
        const pileItem = pile[i];
        for (let j = 0; j < formCoordinates.length; j++) {
            const formPart = formCoordinates[j];
            if (pileItem.x === formPart.x && pileItem.y === formPart.y + step) {
                colision = true;
                break;
            }
        }
    }
    return colision;
}

function randomForm() {
    const index = Math.floor(Math.random() * forms.length);
    return forms[index];
}

function update() {
    advanceLine = false;
    redraw();
    advanceLine = true;
}

function keyPressed() {
    switch (keyCode) {
        case RIGHT_ARROW:
            formX += step
        break;
        case LEFT_ARROW:
            formX -= step
        break;
        case DOWN_ARROW:
            formY += step;
        break;
        default: 
    }
    update();
}

function draw() {
    if (gameover) {
        text("GAME OVER", width / 2 - 50, height / 2);
        text("score: " + score, width / 2 - 30, height / 2 + 20);
        return;
    }

    background(40);
    frameRate(floor(score / 100) + initialFrameRate);

    drawForm(form);
    drawPile();
    
    if (advanceLine) {
        formY += step;
    }
    
    const nextFormCoordinates = getFormCoordinates(form);
    if (formY >= height - step || checkPileColision(nextFormCoordinates)) {
        addFormToPile(form)
        formY = 0;
        formX = width / 2 - step;
        form = randomForm();
    }
}