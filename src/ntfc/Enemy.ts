import { Mesh, Sprite } from "@babylonjs/core";
import { Timer } from "../core/Timer";
import Explosion from "../core/Explosion";


export default interface Enemy
{
    sprite: Sprite;
    collider: Mesh;
    timer:Timer;
    explosion: Explosion;
}