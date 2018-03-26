
var canvas = document.getElementById('cnv');
var gl = canvas.getContext('2d');
var boids = [{x:20, y:20, vx:0.5, vy:0.5, w:10}];
var numBoids = 1;
var repulsion = 1;
var repulseRadius = 1;
var alignment = 0.0001;
var alignRadius = 3;
var attraction = 0.0004;
var attractRadius = 8;
const BOID_WIDTH = 5;
const MAX_SPEED = 3;
var timeStep = 0.1;
var timeScale = 100;

for(var ii = 0; ii < 50; ii++)
{
    addBoid();
}

setInterval(update, timeScale * timeStep);

function addBoid()
{
    var newBoid = {x:0, y:0, vx:0, vy:0, w:0};
    newBoid.x = canvas.width * Math.random();
    newBoid.y = canvas.height * Math.random();
    newBoid.vx = (0.5 - Math.random()) * 2;
    newBoid.vy = (0.5 - Math.random()) * 2;
    newBoid.w = Math.random() * BOID_WIDTH;
    
    boids.push(newBoid);
    numBoids++;
}

function clear()
{
    gl.beginPath();
    gl.fillStyle = 'white';
    gl.fillRect(0,0,canvas.width, canvas.height);
    gl.stroke();
    gl.closePath();
}

function drawBoid(x, y, width)
{
    gl.beginPath();
    gl.strokeStyle = 'black';
    gl.fillStyle = 'white';
    gl.moveTo(x+width, y);
    gl.arc(x, y, width, 0, Math.PI * 2, false);
    gl.stroke();
    gl.closePath();
}

function magnitude(x, y)
{
    return Math.sqrt(x*x + y*y);
}

function distance(x1, y1, x2, y2)
{
    var xd = x1 - x2;
    var yd = y1 - y2;
    return Math.sqrt(xd*xd + yd*yd);
}

function getNeighbours(flock, boid, radius)
{
    var neighbours = [];
    var bx = flock[boid].x;
    var by = flock[boid].y;
    for(var nn = 0; nn < numBoids; nn++)
    {
        if(nn != boid)
        {
            // get distance
            var dist = distance(bx, by, flock[nn].x, flock[nn].y);
            if(dist < radius)
            {
                neighbours.push(flock[nn]);
            }
        }
    }
    return neighbours;
}

function drawLine(x1, y1, x2, y2)
{
    gl.beginPath();
    gl.moveTo(x1, y2);
    gl.lineTo(x2, y2);
    gl.closePath();
}

function updateBoids()
{
    for(var boid = 0; boid < numBoids; boid++)
    {
        neighbours = getNeighbours(boids, boid, repulseRadius * boids[boid].w);
        var nx=0, ny=0;
        // repulsion
        gl.strokeStyle = 'red';
        for(var neighbour = 0; neighbour < neighbours.length; neighbour++)
        {
            nx -= repulsion / (neighbours[neighbour].x - boids[boid].x);
            ny -= repulsion / (neighbours[neighbour].y - boids[boid].y);
            drawLine(neighbours[neighbour].x, neighbours[neighbour].y, boids[boid].x, boids[boid].y);
        }

        // alignment
        neighbours = getNeighbours(boids, boid, alignRadius * boids[boid].w);
        for(var neighbour = 0; neighbour < neighbours.length; neighbour++)
        {
            nx += alignment * (neighbours[neighbour].vx - boids[boid].vx);
            ny += alignment * (neighbours[neighbour].vy - boids[boid].vy);
        }

        // attraction
        neighbours = getNeighbours(boids, boid, attractRadius * boids[boid].w);
        for(var neighbour = 0; neighbour < neighbours.length; neighbour++)
        {
            nx += attraction * (neighbours[neighbour].x - boids[boid].x);
            ny += attraction * (neighbours[neighbour].y - boids[boid].y);
        }

        boids[boid].vx += nx;
        boids[boid].vy += ny;

        // contrain to canvas bounds
        
        if(boids[boid].x > canvas.width)
        {
            boids[boid].x = 0;
        }else if(boids[boid].x < 0)
        {
            boids[boid].x = canvas.width;
        }

        if(boids[boid].y > canvas.height)
        {
            boids[boid].y = 0;
        }else if(boids[boid].y < 0)
        {
            boids[boid].y = canvas.height;
        }

        // constrain velocity
        var speed = magnitude(boids[boid].vx, boids[boid].vy);
        if(speed > MAX_SPEED)
        {
            boids[boid].vx /= speed / MAX_SPEED;
            boids[boid].vy /= speed / MAX_SPEED;
        }

        // apply velocity
        boids[boid].x += boids[boid].vx * timeStep;
        boids[boid].y += boids[boid].vy * timeStep;
    }
}

function update()
{
    clear();
    updateBoids();
    gl.strokeStyle = 'black';
    for(var boid = 0; boid < numBoids; boid++)
    {
        drawBoid(boids[boid].x, boids[boid].y, boids[boid].w);
    }
    gl.beginPath();
    gl.strokeStyle = 'black';
    gl.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
    gl.closePath();
}
