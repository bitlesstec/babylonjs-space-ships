import Explosion from "../core/Explosion";
import { GameState } from "../core/GameState";
import Propulsor from "../core/Propulsor";
import { Timer } from "../core/Timer";
import Enemy from "../ntfc/Enemy";
import EnemyBullet from "../ntfc/EnemyBullet";
import { Initiable } from "../ntfc/Initiable";
import { Renderable } from "../ntfc/Renderable";
import Ship from "../ntfc/Ship";
import { Updatable } from "../ntfc/Updatable";

import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, 
    MeshBuilder, FreeCamera, KeyboardEventTypes, Color4,
     Mesh, Camera, Color3, StandardMaterial, Texture, Sound, 
     Sprite,
     SpriteManager,
     AdvancedTimer  } from '@babylonjs/core';
import  * as GUI from '@babylonjs/gui';

export class Level1 implements Updatable, Renderable, Initiable
{

    readonly MAX_ENE_BULLETS:number = 10;
    readonly SHIP_SPD:number = 0.04;
    readonly STAR_NBR:number = 15;
    readonly MAX_LASERS:number = 5;
    readonly MAX_ENEMIES:number = 10;
    readonly ENE_BULLET_SPEED:number = 5;
    
    

    currentGameState:GameState;
    scene:Scene;
    camera:Camera;
    light: HemisphericLight;


    // cube:Mesh;

    // ship:Sprite;
    // shipCollider: Mesh;
    // shipExplosion:Explosion;

    ship:Ship;

    //ship movement variables
    moveHor:number=0;
    moveVer:number=0;

    //star field meshes
    stars:Mesh[] = [];
    lasers:Mesh[] = [];

    
    //first approach
    // enemies1:Sprite[] = []
    // ene1Colliders:Mesh[] = [];
    // enemies2:Sprite[] = []
    // ene2Colliders:Mesh[] = [];

    enemies:Enemy[] = [];
    
    // eneBullets:Mesh[] = []; 
    eneBullets:EnemyBullet[]=[];
    // bullet:Sprite;

    score:number=0;


    advancedTexture:GUI.AdvancedDynamicTexture;// = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
    msgBlock:GUI.TextBlock;// = new GUI.TextBlock();
    scoreText:GUI.TextBlock;
    pauseText:GUI.TextBlock;

    advancedTimer:AdvancedTimer;

    propulsor:Propulsor;
    explosion:Explosion;


    bgmusic:Sound;
    laserSfx:Sound;
    shipExplosionSfx:Sound;
    eneExplosionSfx:Sound;



    constructor( engine: Engine )
    {
        this.currentGameState = GameState.LOADING;   

        this.scene = new Scene(engine);
        this.scene.clearColor = new Color4(0,0,0,1);


        
        
        // setup cube
        // this.cube = MeshBuilder.CreateBox( "cube", {size:1} )



        this.init();
       


    }

    /**
     * init all objects and assets for the game
     */
    init(): void 
    {
        

        //setting ortho camera for 2d view
        this.camera = new FreeCamera('orthoCamera', new Vector3(0, 0, -10), this.scene);
        this.camera.attachControl();
        this.camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
        this.camera.orthoTop = 5;
        this.camera.orthoBottom = -5;
        this.camera.orthoLeft = -8;
        this.camera.orthoRight = 8;


        // Crear la luz
        this.light = new HemisphericLight("light1", new Vector3(0, 6, -4), this.scene);
        this.light.intensity = .07;
        
        // const cubeMaterial = new StandardMaterial( "cubeMat", this.scene )
        // cubeMaterial.diffuseColor = new Color3( 1, 0, 0 ); 
        // this.cube.material = cubeMaterial; 



        this.setSound()
        
        this.setStarFiled();

        this.setShip();

        this.setLasers();


        this.setEnemies();

        this.setEnemyBullets()

        this.setUI()


        this.scene.onKeyboardObservable.add( ( kbInfo ) => 
        {
            switch (kbInfo.type) 
            {
                case KeyboardEventTypes.KEYDOWN:

                if( this.currentGameState === GameState.PLAYING )
                {
                    switch (kbInfo.event.key) 
                    {
                        case "a":
                        case "A":
                            this.moveHor = -this.SHIP_SPD;
                        break;

                        case "d":
                        case "D":
                            this.moveHor = this.SHIP_SPD;
                        break;

                        case "w":
                        case "W":
                            this.moveVer = this.SHIP_SPD;
                            this.ship.sprite.cellIndex=0;
                        break;

                        case "s":
                        case "S":
                            this.moveVer = -this.SHIP_SPD;
                            this.ship.sprite.cellIndex=2;
                        break;
                    }
                }//gamesatte
                       
                break;
                case KeyboardEventTypes.KEYUP:
                        switch(kbInfo.event.key)
                        {
                            case "a":
                            case "A":
                            case "d":
                            case "D":
                            case "w":
                            case "W":
                            case "s":
                            case "S":
                            this.moveHor = 0;
                            this.moveVer = 0;
                            this.ship.sprite.cellIndex = 1;
                           
                            break
                            case " ":
                                // console.log("shoot laser")
                                this.shootLaser()
                            break;
                            case "l":
                                // console.log("shoot laser")
                                // this.shootEneBullet( Vector3.Zero(), this.shipCollider.position )
                                // this.explosion .explode()
                            break;
                            case "Enter":
                                if( this.currentGameState === GameState.GAME_OVER ) return;

                                if( this.currentGameState === GameState.PLAYING )
                                { 
                                    this.currentGameState =  GameState.PAUSE;
                                    this.scoreText.text=`Score: ${this.score}`
                                    this.scoreText.isVisible = true;
                                    this.pauseText.isVisible = true;
                                }
                                else
                                {
                                    this.currentGameState =  GameState.PLAYING;
                                    this.scoreText.isVisible = false;
                                    this.pauseText.isVisible = false;
                                }
                                break;
                        }
                break;
            }
       
        });


        this.advancedTimer = new AdvancedTimer({
            timeout: 3000,
            contextObservable: this.scene.onBeforeRenderObservable
        });


        // this.advancedTimer.onTimerEndedObservable.add( ()=>{

        //     this.advancedTimer.
        // });


        this.currentGameState = GameState.PLAYING;
    }

    render(): void 
    {
        switch( this.currentGameState )
        {
            case GameState.LOADING:
            
            case GameState.PAUSE:
            case GameState.PLAYING:
            case GameState.GAME_OVER:
                this.scene.render()
            break;
            
        }
    
    }
    
    
    update(delta?: number, args?: any[]): void 
    {
        switch( this.currentGameState )
        {
            case GameState.LOADING:
                
            break;
            case GameState.PLAYING:
                // this.cube.rotation.x += 0.025;

                this.updateStarField()

                this.updateShip()

                this.updateLasers()

                this.updateEnemies();

                this.updateEneBullets()

            break;
            case GameState.PAUSE:
            break;
            case GameState.GAME_OVER:

            break;

        }
    }



    setStarFiled()
    {
            const starMaterial = new StandardMaterial("Mat", this.scene);
            starMaterial.emissiveColor = new Color3(1, 1, 1);
            

            for( let idx:number=0; idx < this.STAR_NBR; idx++ )
            {
                const star = MeshBuilder.CreateBox(`start${idx}`, {size: .06}, this.scene);
                // this.stars[idx] = star.clone("star"+idx);
                star.position = new Vector3( this.randomNumber( -8, 8), this.randomNumber( -5, 5), 1 );
                star.material = starMaterial;

                this.stars.push( star );

            }
    }


    setShip()
    {

        const shipMngr = new   SpriteManager("shipMngr", "/assets/ship.png", 1, { width:21 , height:12 }, this.scene );
     
        // OLD APPROACH
        // this.ship = new Sprite("ship", shipMngr);
        // this.ship.cellIndex = 1;
        // this.ship.width=.6;
        // this.ship.height=.4;

        // this.shipCollider = MeshBuilder.CreateCapsule("shipCollider", { height: 0.6, radius: 0.1 }, this.scene);
        
        const capsMat = new StandardMaterial("capsuleMaterial", this.scene);
        capsMat.emissiveColor = new Color3(0,0,1);
        capsMat.wireframe=true;
        // capsMat.alpha = 0.6

        // this.shipCollider.position = this.ship.position;   
        // this.shipCollider.rotation.z = Math.PI/2;
        // this.shipCollider.material = capsMat;
        // this.shipCollider.isVisible = false; 


        // this.propulsor = new Propulsor( this.shipCollider, this.scene ); 
    
        // this.explosion = 
        // this.shipExplosion = new Explosion( Vector3.Zero(), this.scene );
        // this.shipExplosion.setShipColors();

        

        const ship = new Sprite("ship", shipMngr);
        ship.cellIndex = 1;
        ship.width=.6;
        ship.height=.4;

        const shipCollider =  MeshBuilder.CreateCapsule("shipCollider", { height: 0.6, radius: 0.1 }, this.scene);
        capsMat.wireframe=true;
        // capsMat.alpha = 0.6

        shipCollider.position = ship.position;   
        shipCollider.rotation.z = Math.PI/2;
        shipCollider.material = capsMat;
        shipCollider.isVisible = false; 

        const propulsor = new Propulsor( shipCollider, this.scene ); 


        this.ship = {
            "sprite": ship,
            "collider": shipCollider,
            "propulsor":  propulsor,
            "explosion":  new Explosion( Vector3.Zero(), this.scene )
        }

        this.ship.explosion.setShipColors()
    }//


    setLasers()
    {

        const laserMaterial = new StandardMaterial( "laserMaterial" , this.scene );
              laserMaterial.emissiveColor  = new Color3( 1,0,0 );

        for( let idx:number=0; idx < this.MAX_LASERS; idx++ )
            {
                const laser = MeshBuilder.CreateBox( "laser"+idx , {width: .5, height:.08}, this.scene );
                laser.position = new Vector3( -100, 50, 0 )
                laser.material = laserMaterial;
                laser.isVisible = false;
                laser.setEnabled( false )

                this.lasers.push(laser);
            }
    }


    shootLaser()
    {

        for( let idx:number = 0; idx<this.MAX_LASERS ;idx++)
            {
                // console.log( this.lasers[idx] )
                 if( !this.lasers[idx].isVisible )
                {
                    if(this.laserSfx.isReady())
                    this.laserSfx.play();
                    // this.lasers[idx].position.x = ;
                    // this.lasers[idx].position.y = ;
                    this.lasers[idx].setEnabled(true)
                    this.lasers[idx].isVisible=true;
                    this.lasers[idx].position = new Vector3(this.ship.sprite.position.x, this.ship.sprite.position.y, 0);
                    
                    break;
                }
            }
    }


    updateShip()
    {
        if( this.moveHor !== 0)
            { 
                this.ship.sprite.position.x += this.moveHor 
            }

            if( this.moveVer !== 0)
            { 
                this.ship.sprite.position.y += this.moveVer
            }

            //adjust collider to new ship position
            this.ship.collider.position.x =  this.ship.sprite.position.x
            this.ship.collider.position.y =  this.ship.sprite.position.y
    }

    updateStarField()
    {
        this.stars.forEach( star=>
            {
                star.position.x -=.06;

                const camPos = this.camera.position;
                const starPos = star.position;
                
                if(starPos.x < camPos.x - 8)
                {
                    //moving star to the initial
                    star.position = new Vector3( camPos.x + 8, this.randomNumber(-5, 5), 1);
                }

            })
    }


    updateLasers()
    {
        for( let idx:number =0; idx<this.MAX_LASERS; idx++)
            {
                if(this.lasers[idx].isVisible )
                {
                    const laser = this.lasers[idx]; 
                    laser.position.x += .1;

                    if(laser.position.x > this.camera.position.x + 8)
                    {
                        laser.isVisible=false;
                    }
                    else
                    {
                       
                        for( let x:number =0; x < this.enemies.length ; x++ )
                        {
                            //OLD
                            // if(laser.intersectsMesh( this.ene2Colliders[x], false ) && this.enemies2[x].isVisible )
                            // {
                            //     console.log("ene2 col: ", x)
                            //     const pos = new Vector3( 100, 100, 0)
                            //     this.enemies2[x].position = pos;
                            //     this.enemies2[x].isVisible=false;
                            //     this.ene2Colliders[x].position = pos;
                            //     this.score+=10;
                            //     this.lasers[idx].isVisible=false;
                            // }
        
                            // if(laser.intersectsMesh( this.ene1Colliders[x], false ) && this.enemies1[x].isVisible )
                            // {
                            //     console.log("ene3 col: ", x)
                            //     const pos = new Vector3( 100, 100, 0)
                            //     this.enemies1[x].position = pos;
                            //     this.enemies1[x].isVisible=false;
                            //     this.ene1Colliders[x].position = pos;
                            //     this.score+=10;
                            //     this.lasers[idx].isVisible=false;
                            // }
        
                            if( laser.intersectsMesh( this.enemies[x].collider, false ) && this.enemies[x].sprite.isVisible )
                            {
                                //console.log("ene3 col: ", x)
                                this.eneExplosionSfx.play()
                                
                                const exploPos = this.enemies[x].sprite.position.clone()
                                // this.enemies[x].sprite.isVisible=false;
                                const pos = new Vector3( this.randomNumber(8, 16), this.randomNumber(-5, 5), 0) 
                                this.enemies[x].sprite.position = pos;
                                this.enemies[x].collider.position = pos;

                                this.score+=10;
                                
                               this.lasers[idx].isVisible=false

                                this.enemies[x].explosion.explode( exploPos )
                            }
        
        
                        }   

                    }
                }
            }
    }



    setEnemies()
    {

        const ene1Mngr = new   SpriteManager("ene1Mngr", "/assets/ene1.png", 10, { width:16 , height:16 }, this.scene );
        const ene2Mngr = new   SpriteManager("ene2Mngr", "/assets/ene2.png", 10, { width:16 , height:16 }, this.scene );


        for( let idx:number =0; idx < this.MAX_ENEMIES; idx++)
        {
            const ene1 = new Sprite("ene1_"+idx, ene1Mngr);
            ene1.cellIndex = 0;
            ene1.width = .5;
            ene1.height = .5;


            const ene2 = new Sprite("ene2_"+idx, ene2Mngr);
            ene2.cellIndex = 0;
            ene2.width = .5;
            ene2.height = .5;

            //setting random position of enemies out of the camera view
            ene1.position = new Vector3( this.randomNumber( 8, 100), this.randomNumber( -4, 4), 0 );
            ene2.position = new Vector3( this.randomNumber( 8, 100), this.randomNumber( -4, 4), 0 );

            ene1.playAnimation(0, 3, true, 200)
            ene2.playAnimation(0, 4, true, 200)


            //these colliders will be moved when an enemy sprite moves
            const ene1Collider = MeshBuilder.CreateSphere("ene1Collider_"+idx, {diameter:.4}, this.scene);
            const ene2Collider = MeshBuilder.CreateSphere("ene2Collider_"+idx, {diameter:.4}, this.scene);


            const collMat = new StandardMaterial( "collisionMaterial", this.scene )
            collMat.emissiveColor = new Color3( 1, 1, 0)
            ene1Collider.material = collMat;
            ene2Collider.material = collMat;
            
            //set this to false, to hide enemy colliders
            ene1Collider.isVisible = false;
            ene2Collider.isVisible = false;
           
            // this.enemies1.push( ene1 )
            // this.enemies2.push( ene2 )
            // this.ene1Colliders.push( ene1Collider )
            // this.ene2Colliders.push( ene2Collider )

            const enemy1 = {
                "sprite": ene1,
                "collider": ene1Collider,
                "timer": new Timer( this.randomNumber( 0, 200), () => this.setEnemyShootTimer(enemy1) ),
                "explosion": new Explosion( Vector3.Zero(), this.scene )
            }

            const enemy2 = {
                "sprite": ene2,
                "collider": ene2Collider,
                "timer": new Timer( this.randomNumber( 0, 200), () => this.setEnemyShootTimer(enemy2) ),
                "explosion": new Explosion( Vector3.Zero(), this.scene )
            }

            this.enemies.push(enemy1)
            this.enemies.push(enemy2)

        }    

    }//


    updateEnemies()
    {
    
        for( let idx:number =0; idx < this.enemies.length; idx++ )
        {

            //OLD
            // if( this.enemies1[idx].isVisible )
            // {
            //         this.enemies1[idx].position.x-= .06;
            //         this.ene1Colliders[idx].position = this.enemies1[idx].position;
            // }
                 
            // if( this.enemies2[idx].isVisible )
            // {
            //             this.enemies2[idx].position.x-= .06;
            //             this.ene2Colliders[idx].position = this.enemies2[idx].position;
            // }


                if( this.enemies[idx].sprite.isVisible )
                {
                    
                    this.enemies[idx].sprite.position.x-= .06;
                    this.enemies[idx].collider.position = this.enemies[idx].sprite.position

                    this.enemies[idx].timer.process();

                   //if enemy goes beyong port view, move it back to random position to 
                   //apprear again in the game
                    if( this.enemies[idx].sprite.position.x < -9 )
                    {
                        // this.enemies[idx].sprite.isVisible = false;
                        const pos = new Vector3( this.randomNumber(8, 16), this.randomNumber(-5, 5), 0) 
                        this.enemies[idx].sprite.position = pos;
                    }

                }
                     
                

            //@todo move again enemies to the right if leave the camera
        }//
    }//


    setEnemyBullets()
    {
        const eneBulletMat = new StandardMaterial( "eneBulletMat", this.scene )
              eneBulletMat.emissiveColor = new Color3( 1, 1, 0)

        for( let idx:number =0; idx < this.MAX_ENE_BULLETS; idx++ )
            {
                const eneBullet = MeshBuilder.CreateSphere("eneBullet_"+idx, {diameter:0.1} )
                eneBullet.isVisible = false;
                eneBullet.position = new Vector3( 100, 100, 0 );
                eneBullet.material = eneBulletMat;

                

                this.eneBullets.push({
                    mesh: eneBullet,
                    speed: this.ENE_BULLET_SPEED,
                    direction: Vector3.Zero(),
                })
            }

    }


    shootEneBullet( shooterPosition: Vector3, targetPosition:Vector3 )
    {
        for( let idx:number =0; idx < this.MAX_ENE_BULLETS; idx++ )
            {
               
                const eneBullet = this.eneBullets[idx].mesh; //  MeshBuilder.CreateSphere("eneBullet_"+idx, {diameter:0.1} )
                if( !eneBullet.isVisible )
               {
                    eneBullet.isVisible = true;
                    eneBullet.position = shooterPosition.clone();
                    const dir = targetPosition.subtract( shooterPosition).normalize()
                    this.eneBullets[idx].direction = dir;
                    // eneBullet.speed =s
                    break;
               }

                // eneBullet.isVisible = false;
                // eneBullet.position = new Vector3( 100, 100, 0 );
                // eneBullet.material = eneBulletMat;

            }
    }

    updateEneBullets()
    {
        for( let idx:number =0; idx < this.MAX_ENE_BULLETS; idx++ )
        {
            const eneBullet = this.eneBullets[idx].mesh;
            if( eneBullet.isVisible )
                {
                     //eneBullet.position.x -= 0.2;
                    //  console.log(this.scene.getAnimationRatio())
                     eneBullet.position.addInPlace( this.eneBullets[idx].direction.scale(0.05 ) );


                     if( eneBullet.intersectsMesh( this.ship.collider, false ) && this.ship.collider.isEnabled() )
                     {
                        this.shipExplosionSfx.play();
                        eneBullet.isVisible = false;

                        this.ship.explosion.explode( this.ship.sprite.position.clone(), ()=>{
                            this.setGameOver();
                        } )
                        // this.ship.isVisible=false;
                        this.ship.sprite.position = new Vector3( -10, 0, 0 );
                        this.ship.collider.setEnabled(false)

                     }

                    // Verifica si la bala está fuera de la vista (ajusta según tu viewport)
                    if (Math.abs(eneBullet.position.x) > 8 || Math.abs(eneBullet.position.y) > 8) 
                    {
                        eneBullet.isVisible = false;
                        eneBullet.position = new Vector3(100, 100, 0); // Restablece la posición para reusarla
                        console.log("removing bullet ", eneBullet.name)
                    }

                }

        }
    }//



    // if (this.bullet) {
    //     // Mover la bala en la dirección calculada
    //     this.bullet.position.addInPlace(direction.scale(this.bulletSpeed * this.scene.getAnimationRatio()));

    //     // Opcional: Detectar colisión o eliminar la bala si está muy lejos
    //     if (BABYLON.Vector3.Distance(this.bullet.position, this.target.position) < 0.5) {
    //         console.log("Impacto!");
    //         this.bullet.dispose();
    //         this.bullet = null; // Resetea la bala para permitir un nuevo disparo
    //     }



    /**
     * rturns a random number between min and max
     * @param min 
     * @param max 
     * @returns 
     */
    randomNumber(min:number, max:number)
    {
        if (min == max)
			return (min);

        const random = Math.random();
		return ((random * (max - min)) + min);
		
    }



//     var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
// var image = new BABYLON.GUI.Image("myImage", "/path/to/image.png");
// image.width = "100px";
// image.height = "100px";
// image.top = "50px";
// image.right = "50px";
// advancedTexture.addControl(image);

// para agregar una imagen en Babylon.js



setUI()
{
    this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
    this.msgBlock = new GUI.TextBlock();
    this.scoreText = new GUI.TextBlock();
    this.pauseText = new GUI.TextBlock();   

    this.msgBlock.color = 'white';
    this.msgBlock.fontSize = 24;
    this.msgBlock.top = '0px'; 
    this.msgBlock.left = '0px';
    this.advancedTexture.addControl( this.msgBlock );
    this.msgBlock.isVisible=false;


    this.scoreText.color = 'white';
    this.scoreText.fontSize = 24;
    this.scoreText.top = '-400px'; 
    this.scoreText.left = '-500px';
    this.advancedTexture.addControl( this.scoreText );
    this.scoreText.isVisible=false;

    this.pauseText.color = 'white';
    this.pauseText.fontSize = 34;
    this.pauseText.top = '-100px'; 
    this.pauseText.left = '40px';
    this.advancedTexture.addControl( this.pauseText );
    this.pauseText.isVisible = false;
    this.pauseText.text = "GAME PAUSED"
    
}


explodeEnemy()
{

}



setGameOver()
{

   
    // console.log( "GAME OVER: " , this.msgBlock.isVisible)
    this.msgBlock.text = "GAME OVER\ntotal Score: "+this.score;
         this.msgBlock.isVisible = true;

    this.currentGameState = GameState.GAME_OVER;
}


setEnemyShootTimer( enemy:Enemy ):void
{
    this.shootEneBullet( enemy.sprite.position, this.ship.sprite.position );
    enemy.timer.setCounter( this.randomNumber( 300, 400) ); // set again the timer 
}

setSound()
{
    this.bgmusic = new Sound( "bgmusic", "/assets/sounds/music/level1.ogg", this.scene, null, {
        loop: true,
        autoplay: true
      });

 
    this.laserSfx = new Sound( "lasersfx", "/assets/sounds/sfx/laser.wav", this.scene);
    this.shipExplosionSfx = new Sound( "shipExplosion", "/assets/sounds/sfx/shipexplosion.wav", this.scene);
    this.eneExplosionSfx = new Sound( "eneExplosion", "/assets/sounds/sfx/enexplosion.wav", this.scene);


    // this.bgmusic.play()
}

}