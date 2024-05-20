const canvas = document.querySelector('canvas')
    const c = canvas.getContext('2d')

    canvas.width = 1280
    canvas.height = 768

    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    const image = new Image()
    image.onload = () => {
        animate()
    }
    image.src = 'img/TDMap.png'

    const placementTilesData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 162, 0, 162, 0, 162, 0, 162, 0, 162, 0, 162, 0, 162, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 162, 0, 0, 0, 0, 0, 0, 0, 0, 0, 162, 0, 162, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 162, 0, 0, 0, 0, 162, 0, 0, 0, 0, 162, 0, 162, 0, 0, 0, 0, 162, 0,
        0, 0, 0, 0, 0, 0, 162, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 162, 0,
        0, 162, 0, 0, 0, 0, 162, 0, 0, 0, 0, 162, 0, 162, 0, 0, 0, 0, 162, 0,
        0, 0, 0, 0, 0, 0, 162, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 162, 0,
        0, 0, 0, 0, 0, 0, 162, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 162, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        
        const placementTilesData2D = []

        for(let i = 0; i< placementTilesData.length; i+= 20){
            placementTilesData2D.push(placementTilesData.slice(i, i + 20))
        }

        class PlacementTile{
            constructor({position = {x:0, y:0}}){
                this.position = position
                this.size = 64 
                this.color = 'rgba(255, 255, 255, 0.15)'
                this.occupied = false
            }
            draw(){
                c.fillStyle = this.color
                c.fillRect(this.position.x, this.position.y, this.size, this.size)
            }
            update(mouse){
                this.draw()
        
                if(mouse.x > this.position.x && 
                    mouse.x < this.position.x + this.size &&
                     mouse.y > this.position.y && 
                     mouse.y < this.position.y + this.size
                ){
                    this.color = 'white'
                } else this.color = 'rgba(255, 255, 255, 0.2)'
            }
        }

        class Sprite{
            constructor({ position = { x: 0, y: 0 }, imageSrc, frames ={ max: 1 }, offset = {x: 0, y: 0} }){
                this.position = position
                this.image = new Image()
                this.image.src = imageSrc
                this.frames = {
                    max: frames.max,
                    current: 0,
                    elapsed: 0,
                    hold: 3
                }
                this.offset = offset
            }
    
            draw(){
                const cropWidth = this.image.width / this.frames.max
                const crop = {
                    position: {
                        x: cropWidth * this.frames.current,
                        y: 0
                    },
                    width: cropWidth, 
                    height: this.image.height
                }
                c.drawImage(this.image, crop.position.x, crop.position.y, crop.width, crop.height, this.position.x + this.offset.x, this.position.y + this.offset.y, crop.width, crop.height)      
            }
            update() {
                //responsible for animation
                this.frames.elapsed++
                if(this.frames.elapsed % this.frames.hold === 0){
                this.frames.current++
                if (this.frames.current >= this.frames.max){
                    this.frames.current = 0
                }
              }
            }
        }
        

      
        class Projectile extends Sprite {
            constructor({position = {x: 0, y: 0}, enemy}){
                super({position, imageSrc: 'img/projectile.png'})
                this.velocity = {
                    x: 0,
                    y: 0
                }
                this.enemy = enemy
                this.radius = 10

               
            }
    
         

            update(){
                this.draw()

                const angle = Math.atan2(
                        this.enemy.center.y - this.position.y,
                        this.enemy.center.x - this.position.x
                    )

                    const power = 5
                    this.velocity.x = Math.cos(angle) * power
                    this.velocity.y = Math.sin(angle) * power

                    this.position.x += this.velocity.x
                    this.position.y += this.velocity.y
            }
        }

    class Building extends Sprite {
        constructor({position = {x: 0, y: 0}}){
            super({
                position,
                imageSrc: './img/tower.png',
                frames: {
                    max: 19,
                },
                offset: {
                    x: 0,
                    y: -80
                }
            })
            this.width = 64 * 2
            this.height = 64
            this.center = {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height / 2
            }
            this.projectiles = []
            this.radius = 250
           this.target
        }

        draw(){
            super.draw()

            // c.beginPath()
            // c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2)
            // c.fillStyle = 'rgba(255, 255, 255, 0.1)'
            // c.fill()
        }
        update(){
            this.draw()
            if(this.target || !this.target && this.frames.current !== 0) super.update()

            if(this.target && this.frames.current === 6 && this.frames.elapsed % this.frames.hold === 0)
            this.shoot()
        }
        shoot(){
            this.projectiles.push(
                new Projectile({
                    position: {
                        x: this.center.x - 20,
                        y: this.center.y - 110
                    },
                    enemy: this.target
                })
           )
        }
    }

   
        
        const placementTiles = []

    placementTilesData2D.forEach((row, y) => {
        row.forEach((symbol, x) => {
            if (symbol === 162){
                 //add building placement tile here
                placementTiles.push(
                    new PlacementTile({
                        position: {
                            x: x * 64,
                            y: y * 64
                        }
                    })
                )
            }
        })
    })

    const waypoints =[ 
        {
         "x":-166,
         "y":604
        }, 
        {
         "x":288,
         "y":602
        }, 
        {
         "x":290,
         "y":222
        }, 
        {
         "x":604,
         "y":226
        }, 
        {
         "x":604,
         "y":602
        }, 
        {
         "x":1054,
         "y":612
        }, 
        {
         "x":1056,
         "y":232
        }, 
        {
         "x":1378,
         "y":226
        }]
  
  class Enemy extends Sprite{
    constructor({ position = { x: 0, y: 0 }, health = 100 }) {
        super({position, imageSrc: 'img/orc.png', frames: { max: 7 }})
        this.position = position;
        this.width = 80;
        this.height = 80;
        this.waypointIndex = 0;
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        };
        this.radius = 50;
        this.health = health;
        this.velocity = {
            x: 0,
            y: 0
        }
    }

    draw() {
        // Draw enemy
        super.draw()

        // Health bar dimensions
        const healthBarWidth = 80;
        const healthBarHeight = 10;
        const healthBarX = this.center.x - healthBarWidth / 2;
        const healthBarY = this.position.y - 25;

        // Draw health bar background
        c.fillStyle = 'red';
        c.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

        // Draw health bar foreground
        c.fillStyle = 'green';
        const currentHealthWidth = (healthBarWidth * this.health) / 100;
        c.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);

        // Draw health bar border for better visibility
        c.strokeStyle = 'black';
        c.lineWidth = 2;
        c.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    }

    update() {
        this.draw()
        super.update()

        const waypoint = waypoints[this.waypointIndex];
        const yDistance = waypoint.y - this.center.y;
        const xDistance = waypoint.x - this.center.x;
        const angle = Math.atan2(yDistance, xDistance);

        const speed = 3

        this.velocity.x = Math.cos(angle) * speed
        this.velocity.y = Math.sin(angle) * speed

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y 
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        };

        if (
            Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) < 
            Math.abs(this.velocity.x) &&
            Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) <
            Math.abs(this.velocity.y) &&
            this.waypointIndex < waypoints.length - 1
        ) {
            this.waypointIndex++;
        }
    }
}


   const enemies = []
 
   let currentWave = 1
   let baseHealth = 100;  // Starting health for enemies
let healthIncrement = 20;  // Health increase per wave

function spawnEnemies(spawnCount) {
    for (let i = 1; i < spawnCount + 1; i++) {
        const xOffset = i * 150;
        enemies.push(
            new Enemy({
                position: { x: waypoints[0].x - xOffset, y: waypoints[0].y },
                health: baseHealth + healthIncrement * Math.floor(i / spawnCount)
            })
        );
    }
}
   
   const buildings = []
   let activeTile = undefined
   let enemyCount = 3
   let hearts = 10
   let coins = 100
   const explosions = []
   spawnEnemies(enemyCount)
   
    function animate(){
        const animationId = requestAnimationFrame(animate)

        c.drawImage(image, 0, 0)

        for(let i = enemies.length - 1; i >= 0; i--){
            const enemy = enemies[i]
            enemy.update()

            if(enemy.position.x > canvas.width){
                hearts -= 1
                enemies.splice(i, 1)
                document.querySelector('#hearts').innerHTML = hearts
                console.log(hearts)

                if(hearts === 0) {
                    console.log('Game Over')
                    cancelAnimationFrame(animationId)
                    document.querySelector('#gameOver').style.display = 'flex'
                }

            }
        }

        for(let i = explosions.length - 1; i >= 0; i--){
            const explosion = explosions[i]
            explosion.draw()
            explosion.update()

            
            if(explosion.frames.current >= explosion.frames.max - 1){
                explosions.splice(i, 1)
            }

            console.log(explosions)
        }

         //tracking total amount of enemies
         if(enemies.length === 0 ){
            currentWave++
            enemyCount += 4
            spawnEnemies(enemyCount)
        }

        placementTiles.forEach(tile => {
            tile.update(mouse)
        })

        buildings.forEach(building => {
            building.update()
            building.target = null
            const validEnemies = enemies.filter(enemy => {
                const xDifference = enemy.center.x - building.center.x
            const yDifference = enemy.center.y - building.center.y
            const distance = Math.hypot(xDifference, yDifference)
                return distance < enemy.radius + building.radius
            })
            building.target = validEnemies[0]

        for(let i = building.projectiles.length - 1; i >= 0; i--){
            const projectile = building.projectiles[i]
        
            projectile.update()

            const xDifference = projectile.enemy.center.x - projectile.position.x
            const yDifference = projectile.enemy.center.y - projectile.position.y
            const distance = Math.hypot(xDifference, yDifference)

            //this is when the projectile hits an enemy
            if (distance < projectile.enemy.radius + projectile.radius){
                //enemy health and enemy removal
                projectile.enemy.health -= 20
                if (projectile.enemy.health <= 0){
                    const enemyIndex = enemies.findIndex((enemy) => {
                        return projectile.enemy === enemy
                    })

                    if(enemyIndex > -1) {
                        enemies.splice(enemyIndex, 1)
                        coins += 25
                        document.querySelector('#coins').innerHTML = coins
                    }
                }

               

                console.log( projectile.enemy.health)
                explosions.push(new Sprite({ position : { x: projectile.position.x, y: projectile.position.y }, imageSrc: './img/explosion2.png', frames :{ max: 4 }, offset : {x: 0, y: 0} }))
                building.projectiles.splice(i, 1)
            }
        }
        })

    }

const mouse = {
    x: undefined,
    y: undefined
}

canvas.addEventListener('click', (event) => {
    if (activeTile && !activeTile.isOccupied && coins - 50 >= 0){
        coins -= 50
        document.querySelector('#coins').innerHTML = coins
        buildings.push(new Building({
            position: {
                x: activeTile.position.x,
                y: activeTile.position.y
            }
        }))
        activeTile.isOccupied = true
        buildings.sort((a, b) => {
            return a.position.y - b.position.y
        })
    }
})

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX
    mouse.y = event.clientY

    activeTile = null
    for(let i = 0; i<placementTiles.length; i++){
        const tile = placementTiles[i]
   
    if(mouse.x > tile.position.x && 
        mouse.x < tile.position.x + tile.size &&
         mouse.y > tile.position.y && 
         mouse.y < tile.position.y + tile.size
        ){
        activeTile = tile
        break
         }
       
        }
    })
