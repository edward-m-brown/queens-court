import React from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { world_map, directions } from './data/maps.js';
import { GameScreen } from './components/GameScreen.jsx';
import { CharacterCreation } from './components/CharacterCreation.jsx';

// TODO: Find a less hacky way to extend these objects.
// I quite like having both of these as built-ins.
var myMath = Math;
myMath.randomInt = (max)=>{
    return Math.floor(Math.random() * Math.floor(max));
}

var myArray = Array;
myArray.prototype.any = function() {
    return this[Math.randomInt(this.length)];
}

// What should an Encounter look like?
const example_encounter = {
    name: ['Field Mouse', 'Vole', 'Varmint'].any(),
    stats: {
        agility: 3,
        guts: 2,
        wits: 1,
        health: 5,
    },
    image: 'https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwj8uvSSy6zmAhXBop4KHZPvB8gQjRx6BAgBEAQ&url=https%3A%2F%2Flizzieharper.co.uk%2F2018%2F06%2Ffield-vole-step-by-step-illustration%2F&psig=AOvVaw3RUZsJvIUPTTcxBNDSfrx8&ust=1576119050992598',
    description: ['You are wandering through the field when you chance upon a ', null, '. It is gnawing a fetid corse with its sharp yellow teeth.'],
};

/**
 * Tiles:
 * What should a Tile look like? What does it need to do?
 * A Tile should have an image, specified in Game.state.location.map[index] for the Tile's given index.
 * There should always be 9 Tiles for a given Location, though some can be null (blank space).
 * When clicked, a Tile must cause a screen transition to an Encounter, Location, or Interaction.
 * This transition will really be caused by a change in the Game's state.
 * If the Game has a 'creature' state, an Encounter begins.
 * If the Game has an 'interaction' state, an interaction begins.
 * If the only Game state is 'location', a location is shown. 
 */






/**
 * Challenges I see coming with the GameScreen:
 *      - Layout (CSS) will need to change, depending on what's showing.
 *          + This may not be an issue. Changing the class should help in changing how different game states are rendered.
 *      - What should the state look like? Or will it get passed props, rather
 *        than maintain state?
 *          + I think that passing parts of the Game state as props to the GameScreen makes sense.
 *      - What would the state/props look like?
 *          + In this model, a Map is just a collection of Tiles.
 *          +   Maybe if tiles is null, then we're not looking at a map?
 *          +- Map:
 *              { tiles: [null, Tile, Tile, null, Tile, null, null, null] };
 *          + What about an Interaction? This may vary a bit, depending on the
 *          + type of interactions. Perhaps there will be Options?
 *          +- Interaction (merchant):
 *              { options: [barter, gossip, polish, repair]}
 *            +-- How will we determine what these actions do? Will they look similar to combat actions?
 *                +--- Barter, for instance, could do a fetch on the shop's inventory.
 *          +- Interaction (Queen's court):
 *              { options: [mingle, gamble]}
 */

function initGameState() {
        return {
            location: world_map["Plains"],
            encounter: null,
            interaction: null,
            character: null
        }
}

function Game(props) {
    const [mapState, setMapState] = useState({
            location: world_map["Plains"],
            encounter: null,
            interaction: null
        });
    const [characterState, setCharacterState] = useState(null);

    function handleTileClick(type, name) {
        switch(type) {
            case 'Location':
                setMapState({
                    location: world_map[name],
                    encounter: null,
                    interaction: null
                });
                break;
            case 'Encounter':
                setMapState({
                    location: mapState.location,
                    encounter: example_encounter,
                    interaction: null
                });
                break;
            case 'Interaction':
            default:
                alert(type + " is not yet supported");
                break;
        }
    }
 
    /**
     * structure could be:
     * - GameScreen <-- This shows the current Location, Encounter, Interaction, or Menu.
     * - MenuControls <-- This always stays the same. It shows menu options like
     *      character sheet, social, settings, sign out, etc.
     *      These will need to render on the GameScreen also.
     * - Status <-- Probably need constant display of a few things when adventuring.
     *      Status would include things like HP, number of quests left, and ???.
     *
     */
    if (characterState) {
        return (
            <div className="game">
                <div className="game-screen">
                    <GameScreen
                        tileClick={(type, name) => handleTileClick(type, name)}
                        location={mapState.location}
                        encounter={mapState.encounter}
                        interaction={mapState.interaction}
                        character={characterState}
                    />
                    {/**TODO: Add UIBar component which will have buttons for
                      * Character Sheet, inventory, game menu, and possibly
                      * other things like quests.
                      */}
                </div>
            </div>
        );
    } else {
        /**
         * There is no character loaded. We need to open with a
         * "create character" or a "login" screen.
         */
        return ( 
            <CharacterCreation setCharacter={setCharacterState} />
        )
        
    }
}
  
// ========================================
  
let root = createRoot(
    document.getElementById('root')
);

root.render(<Game />)


/**
 * Reference Game object
 */
/**
 * 
 *
class OldGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: location_table['Fields']
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.currentMark;
        let nextMark = this.state.currentMark === 'X' 
            ? 'O'
            : 'X';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            currentMark: nextMark,
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            currentMark: ((step % 2) === 0) ? 'X' : 'O'
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc = move
                ? 'Go to move # ' + move
                : 'Go to game start';
            return(
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + this.state.currentMark;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}
 * 
 */
