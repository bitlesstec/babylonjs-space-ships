
/**
 * this class will create a timer that has a counter, 
 * when counter reach 0 the executor (of proccess method) will be called,
 * NOTE: process method should be called inside Level.update() mehtod
 */
export class Timer
{
     /**
     * to know whether the timer is active or not
     */
    private active: boolean;
    private counter: number;


    /**
     * this is optionat just in case you may need to activate the timer after creationg
     * @param counter ammount of frames until the executor can be called
     */
    constructor(counter?:number)
    {
        if(counter)
        {
            this.active = true;
            this.counter = counter;
        }
        else{
            this.active = false;
            this.counter = 0;    
        }
    }

    /**
     * this is to set any process to be executed after several gamethicks
     * this will decrese the counter every game thick ( every frame ) if the timer is active ( active = true )
     * after time is done will executhe the callback function "execute"
     * @param executer 
     */
    process( executor = function(){} )
    {
        this.counter--;

        if( this.counter < 1 && this.active )
        {
            this.counter = 0;
            this.active = false;
            executor();//.execute();
        }

    }//

    /**
     * returns current counter
     */
    getCounter():number
    { return this.counter }


    /**
     * every time a new counter value is set, then the task will be activated,
     * to deactivate this task at any time then set the counter to 0
     * @param counter 
     */
    setCounter( counter:number ):void
    { 
        this.counter = counter; 
        this.active = ( counter === 0 )? false : true;
    }


}//