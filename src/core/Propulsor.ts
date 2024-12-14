import { Color4, Mesh, ParticleSystem, Scene, Texture, Vector3 } from "@babylonjs/core";


/**
 * will represent ship propulsor using particles,
 * 
 */
export default class Propulsor {


    // partSysten : ParticleSystem;

    constructor(spaceShip: Mesh, scene: Scene) {

        const particleSystem = new ParticleSystem("propulsorParticles", 300, scene);
        particleSystem.particleTexture = new Texture("/assets/textures/particle.png", scene);

        // emitting partlicle  place
        particleSystem.emitter = spaceShip; // Emite desde la nave
        particleSystem.minEmitBox = new Vector3(-0, 0.5, -1); // ship rear position
        particleSystem.maxEmitBox = new Vector3(-0, 0.3, -1);

        // Configurar propiedades visuales de las partículas
        particleSystem.color1 = new Color4(1, 1, 1, 1); // white
        particleSystem.color2 = new Color4(0.7, 0.8, 1.0, 1.0); //whithe blue
        particleSystem.colorDead = new Color4(0.2, 0.5, 1.0, 1.0); // dark blue

        // particle size
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.05;

        // particle life
        particleSystem.minLifeTime = 0.2;
        particleSystem.maxLifeTime = 0.4;

        // speed of particles
        particleSystem.minEmitPower = 3;
        particleSystem.maxEmitPower = 5;
        particleSystem.updateSpeed = 0.01;

        // dispersion and direction of particles
        particleSystem.direction1 = new Vector3(0, 0, -1); // Hacia atrás
        particleSystem.direction2 = new Vector3(0, 0, -1);

        // dispersion angle
        particleSystem.minAngularSpeed = -1;
        particleSystem.maxAngularSpeed = 1;

        // Gravedad de las partículas (ajusta si deseas que las partículas caigan o suban)
        particleSystem.gravity = new Vector3(0, 0, 0);

        particleSystem.isLocal = true;

        // Iniciar el sistema de partículas
        particleSystem.start();

    }




}