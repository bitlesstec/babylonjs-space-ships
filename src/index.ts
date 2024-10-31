/**
 * this file contains the game of breaking bricks, created in 3d Babylon.js with Typescript
 */

import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, 
    MeshBuilder, FreeCamera, KeyboardEventTypes, Color4,
     Mesh, Camera, Color3, StandardMaterial, Texture, Sound } from '@babylonjs/core';
import  * as GUI from '@babylonjs/gui';
import { Level1 } from './levels/Level1';
import TitleLevel from './levels/TitleLevel';



// Obtener el canvas del DOM
const canvas = document.querySelector("#canvas") as HTMLCanvasElement; //document.createElement('canvas');

const engine = new Engine(canvas, true);
Engine.audioEngine.setGlobalVolume( 1 );

// const scene = new Level1(engine);
let level:any = undefined;//new TitleLevel(engine); 

loadLevel( new TitleLevel(engine) )

// Renderizar el escenario
engine.runRenderLoop(() => 
{

    if( level !== undefined)
    {
        level.update();
        level.render();
    }
 

});

// Ajustar la ventana cuando se redimensione
window.addEventListener('resize', () => {
    engine.resize();
});

export default function loadLevel( newLevel:any )
{
    if( level !== undefined )
    {
        level.scene.dispose() //  scene.dispose();
    }

    level = newLevel;

}



  


    