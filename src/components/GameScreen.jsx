import React from 'react';
import {directions} from '../data/maps.js'
import { Tile, EmptyTile } from './Tile.jsx'

class GameScreen extends React.Component {
    /**
     * Will I need something like this?
     * Could have the Locations detailed like a Compass Rose.
     * For each cardinal direction, if there is a Tile, render it.
     */
    renderTile(map_data, direction) {
        return (
            <Tile
                name={map_data.name}
                image={map_data.image}
                onClick={()=>this.props.tileClick(map_data.type, map_data.name)}
                direction={direction}
                cost={map_data.cost}
                key={direction}
            />
        );
    }

    render() {
        if(this.props.location === null) {
            // Error handling here.
            return (<h1> ERROR: NULL Game state </h1>)
        } else if(this.props.location && this.props.location.map
            && this.props.encounter === null
            && this.props.interaction === null) {
            /**
             * Only the location of the Game is populated. Go ahead and render the location.
             */
            return (
                <div className="tile-map"
                    style={{background: this.props.location.background_color}}
                >
                    {directions.map((v, i) => {
                        const offset = 3 * i;
                        return(
                            <div className="tile-row"
                                 key={i}>
                                {directions[i].map((direction, index) => {
                                    const map_data = this.props.location.map[index + offset];
                                    // TODO: discovery based off of character level.
                                    if(map_data !== null
                                        && map_data.discovered !== false) {
                                        return(
                                            <div className={"tile-slot " + direction}
                                                key={index}>
                                                {this.renderTile(map_data, direction)}
                                            </div>
                                        );
                                    } else {
                                        return(
                                            <div className="tile-slot"
                                                key={index}>
                                                <EmptyTile direction={direction}/>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        );
                    })}
                </div>
            );
        } else if(this.props.encounter !== null) {
            /**
             * Encounter Loop:
             * There are 3 possible states for the encounter loop:
             * 1. choose action
             * 2. describe outcome
             * 3. result state
             * 
             * The Encounter Loop should iterate over states 1 and 2, until the
             * encounter is over and state 3 is reached. 
             */
            const encounter = this.props.encounter;
            // The encounter object has 3 parts: creature, character, and status_update.

            // 
            // while(this.props.encounter !== null) {
            // 
            // }
            return (
                <div className="encounter-window"
                    style={{background: '#FF0000'}}>
                    <button onClick={()=>{this.props.tileClick('Location', 'Plains')}}>
                        This an encounter thingy
                    </button>
                </div>
            );

        } else if(this.props.interaction !== null) {
            /**
             * There is an interaction. Render the Interaction stuff.
             * Exiting the Interaction should properly clear this piece of Game state.
             */
            // Interaction Loop
            // while(this.props.interaction !== null) {
            //     
            // }
        }
    }
}

export {GameScreen};