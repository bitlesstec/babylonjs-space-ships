import { Mesh, Sprite } from "@babylonjs/core";
// import { Timer } from "../core/Timer";
import Explosion from "../core/Explosion";
import Propulsor from "../core/Propulsor";

export default interface Ship
{
    sprite:Sprite;
    collider: Mesh;
    explosion: Explosion;
    propulsor: Propulsor;
}