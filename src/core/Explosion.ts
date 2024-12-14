
import { Color4, ParticleSystem, Texture, Vector3, Scene } from "@babylonjs/core";



export default class Explosion {


    particleSystem: ParticleSystem;

    constructor(emmiterPosition: Vector3, scene: Scene) {

        this.particleSystem = new ParticleSystem("explosionParticles", 500, scene);

        // Definir la textura de las partículas (una imagen simple de flare funciona bien)
        this.particleSystem.particleTexture = new Texture("/assets/textures/particle.png", scene);

        // Configurar el origen de la explosión
        this.particleSystem.emitter = emmiterPosition;

        // Tamaño de las partículas
        this.particleSystem.minSize = 0.02;
        this.particleSystem.maxSize = 0.2;

        // Vida de las partículas (corto para que se desvanezcan rápidamente)
        this.particleSystem.minLifeTime = 0.2;
        this.particleSystem.maxLifeTime = 0.6;

        // Velocidad de las partículas para crear un efecto de explosión
        this.particleSystem.minEmitPower = .5;
        this.particleSystem.maxEmitPower = 3;
        this.particleSystem.updateSpeed = 0.03;

        // Configurar el color de las partículas
        this.particleSystem.color1 = new Color4(1, 0, 0, 1);
        this.particleSystem.color2 = new Color4(1, 1, 0, 1);
        this.particleSystem.colorDead = new Color4(1, 1, 1, 1);

        // Definir dirección de emisión en todas las direcciones
        this.particleSystem.direction1 = new Vector3(-1, -1, -1);
        this.particleSystem.direction2 = new Vector3(1, 1, 1);

        // Activar el sistema de partículas y detenerlo después de una breve duración
        // this.particleSystem.start();
        // setTimeout(() => this.particleSystem.stop(), 500); // Detener las partículas tras 0.5 segundos
        // this.explode();
    }


    explode(position: Vector3, executor = function () { }) {
        // console.log("exploding boom!")
        this.particleSystem.emitter = position;
        this.particleSystem.start()
        setTimeout(() => {
            this.particleSystem.stop()
            executor();
        }, 700)
    }

    setShipColors() {
        this.particleSystem.color1 = new Color4(1, 1, 1, 1); // white
        this.particleSystem.color2 = new Color4(0.7, 0.8, 1.0, 1.0); //whithe blue
        this.particleSystem.colorDead = new Color4(0.2, 0.5, 1.0, 1.0); // dark blue
    }


}