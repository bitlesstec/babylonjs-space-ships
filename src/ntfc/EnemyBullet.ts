import { Mesh, Vector3 } from "@babylonjs/core";



export default interface EnemyBullet
{

    mesh:Mesh;
    speed:number;
    direction: Vector3;
}