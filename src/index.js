import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import to_town from './images/to_castle_town.jpg'
import blacksmith from './images/blacksmith.jpg'
import fields_quest from './images/fields_quest.jpg'
import to_fields from './images/to_fields.jpg'
import temple from './images/temple.jpg'
import empty_image from './images/empty_image.jpg'

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
/* First shot at the game:
 * - Clickable Tiles that can transition from one Location to another and back.
 */
// Directions is split into rows. Kind of hacky feeling, but this was a decent start at getting
// the tiles to render as rows of cardinal directions.
const directions = [
    ['North-West', 'North', 'North-East'], // row 0
    ['West', 'Center','East'],             // row 1
    ['South-West', 'South', 'South-East']  // row 2
];

const nothings = ['Naught', 'Nary a thing', 'Nothing', 'Nothing of interest']

/** 
 * Note: the Forest was actually a combination of Encounter and Location.
 * Sometimes clicking would lead to an encounter; Sometimes it would lead to
 * the forest location.
 * Goblin Caves were similar, but there would always be an encounter with the
 * Gate before descending into the Caves. 
 * 
 * I will need to account for these kind of transitions in my design.
 * My first thought on how to handle this is by allowing for the update request
 * to send a response back with a Location object.
 */
const plains_location = {
    map: [
        null, /* North-West */
        null, /* North */
        {image: to_town, name: 'Castle Town', cost: 0, type: 'Location'}, /* North-East */
        null, /* West */
        {image: fields_quest, name: 'Fields', cost: 1, type: 'Encounter'}, /* Center */
        {image: temple, name: 'Temple', cost: 0, type: 'Interaction'}, /* East */
        {image: 'dark-forest-image', name: 'Dark Forest', cost: 1, type: 'Location', discovered: false}, /* South-West */
        {image: 'goblin-caves-image', name: 'Goblin Caves', cost: 1, type: 'Location', discovered: false}, /* South */
        null, /* South-East */
    ],
    background_color: '#917029',
};

const town_location = {
    map: [
        null, /* North-West */
        null, /* North */
        {image: blacksmith, name: 'Smithy', cost: 0, type: 'Interaction'}, /* North-East */
        null, /* West */
        null, /* Center */
        null, /* East */
        {image: to_fields, name: 'Fields', cost: 0, type: 'Location'}, /* South-West */
        null, /* South */
        null, /* South-East */
    ],
    background_color: '#54872f',
};

const location_table = {
    'Fields': plains_location,
    'Castle Town': town_location,
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


function Tile(props){
    return (
        <button className="tile"
            onClick={props.onClick}>

        </button>
        <figure className="tile">
            <img
                className="tile-image"
                onClick={props.onClick}
                src={props.image}
                alt={props.name}
            />
            <figcaption>{props.direction} to {props.name} <i>({props.cost})</i></figcaption>
        </figure>
        
    );
}

function EmptyTile(props){
    let nothing = nothings.any();
    let direction = props.direction;
    let descriptionString = `${nothing} to the ${direction}`;
    return (
        <figure className="tile">
            <img
                className="tile-image"
                src={empty_image}
                alt={descriptionString}
            />
            <figcaption>{descriptionString}</figcaption>
        </figure>
        
    );
}

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
                            <div className="tile-row">
                                {directions[i].map((direction, index) => {
                                    const map_data = this.props.location.map[index + offset];
                                    if(map_data !== null
                                        && map_data.discovered !== false) {
                                        return(
                                            <div className={"tile-slot " + direction}>
                                                {this.renderTile(map_data, direction)}
                                            </div>
                                        );
                                    } else {
                                        return(
                                            <div className="tile-slot">
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
                    <button onClick={()=>{this.props.tileClick('Location', 'Fields')}}>
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
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: location_table['Fields'],
            encounter: null,
            interaction: null
        };
    }

    handleTileClick(type, name) {
        switch(type) {
            case 'Location':
                this.setState({
                    location: location_table[name],
                    encounter: null,
                    interaction: null
                });
                break;
            case 'Encounter':
                this.setState({
                    location: this.state.location,
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

    render() {
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
        return (
            <div className="game">
                <div className="game-screen">
                    <GameScreen
                        tileClick={(type, name) => this.handleTileClick(type, name)}
                        location={this.state.location}
                        encounter={this.state.encounter}
                        interaction={this.state.interaction}
                    />
                </div>
            </div>
        );
    }
}
  
// ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


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
