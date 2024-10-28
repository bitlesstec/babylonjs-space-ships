import { GameState } from "../core/GameState";
import { Initiable } from "../ntfc/Initiable";
import { Renderable } from "../ntfc/Renderable";
import { Updatable } from "../ntfc/Updatable";

import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, 
    MeshBuilder, FreeCamera, KeyboardEventTypes, Color4,
     Mesh, Camera, Color3, StandardMaterial, Texture, Sound } from '@babylonjs/core';
import  * as GUI from '@babylonjs/gui';

export class Level1 implements Updatable, Renderable, Initiable
{

    currentGameState:GameState;
    scene:Scene;
    camera:Camera;
    light: HemisphericLight;


    cube:Mesh;


   
    constructor( engine: Engine )
    {
        this.currentGameState = GameState.LOADING;   

        this.scene = new Scene(engine);
        this.scene.clearColor = new Color4(0,0,0,1);


        this.camera = new FreeCamera("camera", new Vector3( 0, -1,-5), this.scene);
        this.camera.attachControl();

        // Crear la luz
        this.light = new HemisphericLight("light1", new Vector3(0, 6, -4), this.scene);
        this.light.intensity = 1;
        
        
        // setup cube
        this.cube = MeshBuilder.CreateBox( "cube", {size:1} )


        this.init();
       


    }


    init(): void 
    {
        
        
        const cubeMaterial = new StandardMaterial( "cubeMat", this.scene )
        cubeMaterial.diffuseColor = new Color3( 1, 0, 0 ); 
        this.cube.material = cubeMaterial; 




        this.scene.onKeyboardObservable.add( ( kbInfo ) => 
        {
            switch (kbInfo.type) 
            {
                case KeyboardEventTypes.KEYDOWN:

                
                    switch (kbInfo.event.key) 
                    {
                        case "a":
                        case "A":

                        break;

                        case "d":
                        case "D":

                        break;
                    }
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
                            
                        break;

                        case " ": //SPACE
                    
                        break;
                    }

                    console.log( " key released: ", kbInfo.event.key)
                break;
            }
       
        });

        this.currentGameState = GameState.PLAYING;
    }

    render(): void 
    {
        switch( this.currentGameState )
        {
            case GameState.LOADING:
            case GameState.PLAYING:
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
                this.cube.rotation.x += 0.025;
            break;

        }
    }




}