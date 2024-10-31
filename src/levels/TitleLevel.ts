
import loadLevel from "..";
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
     AdvancedTimer} from '@babylonjs/core';
import  * as GUI from '@babylonjs/gui';
import { Level1 } from "./Level1";


/**
 * this is the title screen of the game
 */
export default class TitleLevel implements Updatable, Renderable, Initiable
{

    readonly BEFORE_START_TXT:string = " press any key to start "
    readonly GAME_TITLE_TXT:string = " BABYLON Space Shooter! "
    readonly START_GAME_TXT:string = " Press Enter To Start! " // should be release... right?

    currentGameState:GameState;
    advancedTexture:GUI.AdvancedDynamicTexture;// = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
    msgBlock:GUI.TextBlock;
    bgBlock:GUI.Rectangle;

    scene:Scene;
    camera:Camera;
    light: HemisphericLight;

    blinkTimer:Timer;
    showText:boolean;

    titleImage:GUI.Image;


    tittleScreen:GUI.AdvancedDynamicTexture;

    engine:Engine;

    constructor( engine: Engine  )
    {

        this.engine = engine;
        this.scene = new Scene(engine);
        this.scene.clearColor = new Color4(0,0,0,1);


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


        this.init();
    }

     
    init(): void 
    {
    
        //setting UI here...
        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
    
        this.titleImage =  new GUI.Image("tittleScreenImg","/assets/title_screen.jpg");
        this.titleImage.stretch = GUI.Image.STRETCH_UNIFORM ; // Estira la imagen para llenar toda la pantalla
        this.titleImage.width = 1;  // 100% del ancho de la UI
        this.titleImage.height = 1; // 100% de la altura de la UI
        this.advancedTexture .addControl( this.titleImage )
        this.titleImage.isVisible=false;

        this.msgBlock = new GUI.TextBlock();
        this.msgBlock.color = 'white';
        this.msgBlock.fontSize = 24;
        this.msgBlock.top = '200px'; 
        this.msgBlock.left = '0px';
        
        this.msgBlock.text =  this.BEFORE_START_TXT;
       

        this.bgBlock = new GUI.Rectangle("bgBlock");
        this.bgBlock.width = 1; // Abarca el 100% del ancho de la pantalla
        this.bgBlock.height = "100px"; // Altura fija para el mensaje
        // this.bgBlock.left = '0px';
        this.bgBlock.top = '200px'; 
        this.bgBlock.color = "transparent"
        this.bgBlock.background = "black"
        // this.bgBlock.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.advancedTexture.addControl( this.bgBlock );
        this.advancedTexture.addControl( this.msgBlock );
        
        

        this.blinkTimer = new Timer( 35 , 
        ()=>{ 
            this.showText = !this.showText;
            this.msgBlock.isVisible = this.showText;
            this.bgBlock.isVisible = this.showText;
            this.blinkTimer.reset();
            }
    );
        this.showText = true;


       


        this.scene.onKeyboardObservable.add( ( kbInfo ) => 
            {
                switch (kbInfo.type) 
                {
                    case KeyboardEventTypes.KEYDOWN:        
                    break;
                    case KeyboardEventTypes.KEYUP:
                          
                    switch(this.currentGameState)
                    {
                        case GameState.LOADING:
                            this.currentGameState = GameState.PLAYING;
                            this.msgBlock.text = this.START_GAME_TXT;

                            //show image title
                            this.titleImage.isVisible=true;

                            //display background and text to start game
                            this.msgBlock.isVisible = true;
                            this.bgBlock.isVisible = true;


                            this.blinkTimer.setCounter(0)
                            break;   
                        case GameState.PLAYING:
                            switch(kbInfo.event.key)
                            {
                             case "Enter":
                                loadLevel( new Level1( this.engine) )
                                break;   
                            }
                            break;
                    }

                    break;
                }
           
            });
    



        this.currentGameState = GameState.LOADING;
    }//

    render(): void 
    {
        switch( this.currentGameState )
        {
            case GameState.LOADING:
            
            case GameState.PAUSE:
            case GameState.PLAYING:
                this.scene.render()
            break;

            case GameState.GAME_OVER:

            break;

        }
    }
   
    
    update(delta?: number, args?: any[]): void 
    {
        switch( this.currentGameState )
        {
            case GameState.LOADING:
             //this will make the text blink to make the user start with a kerboard event
             this.blinkTimer.process( )
            case GameState.PAUSE:
            case GameState.PLAYING:
            break;

            case GameState.GAME_OVER:

            break;

        }
    }


}