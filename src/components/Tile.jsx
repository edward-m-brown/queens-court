import React from 'react';
import empty_image from '../images/empty_image.jpg'
/**
 * Tile is an element of the current game Map.
 * There will be up to nine Tiles in each Map.
 * Each tile is a button which will cause a transition to
 * either another Map, an NPC interaction (e.g. blacksmith shop),
 * or an Encounter. 
 */
function Tile(props) {

    return (
        <button className="tile"
            onClick={props.onClick}>
            <figure className="tile">
                <img
                    className="tile-image"
                    onClick={props.onClick}
                    src={props.image}
                    alt={props.name}
                />
                <figcaption>{props.direction} to {props.name} <i>({props.cost})</i></figcaption>
            </figure>
        </button>
    );
}

/**
 * When there is nothing to click at a particular map location,
 * an EmptyTile will be rendered.
 */
const nothings = ['Naught', 'Nary a thing', 'Nothing', 'Nothing of interest'];
function EmptyTile(props) {
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

export {Tile, EmptyTile};