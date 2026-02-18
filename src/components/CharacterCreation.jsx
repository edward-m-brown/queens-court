import React from 'react';
import { useState } from 'react';
/**
 * The CharacterCreation screen is basically a form. It should keep track of
 * all of the following:
 *  * Build Points - used to purchase stat upgrades or classes
 *  * Ability Scores - Guts, Wits, and Agility. Each start with a rating of 3.
 *    They can be increased by purchasing a class or by stat increases.
 *  * Class - The character class, if any. Peasant is default, Soldier costs
 *    2 points, Knight costs 5 points, and Mage costs 8 points.
 *  * Inventory - Starts with some very simple gear, and will be added to
 *    based off of character class, if any.
 *  * A save button which populates the character state and starts the Game.
 */

/**
 * Global variables
 */
const startBuildPoints = 10;
const defaultAbilityScores =
    {"Guts": 3,
     "Wits": 3,
     "Agility": 3}
const defaultClass = "Peasant";
// Toggle console.log statements
const DEBUG = 0;

// TODO: This table should be stored in a database.
// We should also store it in the data directory.
const characterClasses = [
    {"name": "Peasant",
     "cost": 0,
     "gutsMod": 0,
     "witsMod": 0,
     "agilityMod": 0,
     "startGear": {"weapon": "dagger",
                   "armor" :"clothes",
                   "gold"  : 5},
     "title": ""
    }, {"name": "Soldier",
        "cost": 2,
        "gutsMod": 1,
        "witsMod": 0,
        "agilityMod": 1,
        "startGear": {"weapon": "sword",
                      "armor" : "leather",
                      "gold"  : 5},
        "title": "Lt."
    }, {"name": "Knight",
        "cost": 5,
        "gutsMod": 2,
        "witsMod": 0,
        "agilityMod": 1,
        "startGear": {"weapon": "sword",
                      "armor" : "chainmail",
                      "gold"  : 15},
        "title": "Sir"
    }, { "name": "Mage",
        "cost": 8,
        "gutsMod": 0,
        "witsMod": 4,
        "agilityMod": 0,
        "startGear": {"weapon": "staff",
                      "armor" : "robes",
                      "gold"  : 10},
        "title": "Magus",
        "powers": "Hypnosis"
    }
]
const abilityScores = ["Guts", "Wits", "Agility"];

/**
 * Helper functions
 */

/**
 * Finds the class object by class name.
 * @param string className 
 */
function findClass(className) {
    if(DEBUG) console.log("className " + className)
    for (let i = 0; i < characterClasses.length; i++) {
        let classData = characterClasses[i];
        if(DEBUG) console.log("name: " + classData.name)
        if (classData.name == className){
            if(DEBUG) console.log(i)
            if(DEBUG) console.log(JSON.stringify(classData));
            return classData;
        }
    }
}

function BPDisplay(props) {
    return (
        <h2>Build Points: {props.buildPoints}</h2>
    );
    
}

function CharacterName(props) {
    let classData = findClass(props.class);
    let title = classData.title;
    return (
        <div>
            <b>Character Name:</b>
            <div className="character-title">
                {title}
                <input type="text" id="charName" onChange={props.updateName}></input>
            </div>
        </div>
    );
}


function AbilityScore(props) {
    if(DEBUG) console.log("In AbilityScore. props: " + JSON.stringify(props))
    return (
        <tr>
            <td>{props.name}</td>
            <td>{props.score}</td>
            <td>
                <button onClick={props.plusClick} name={props.name}>+</button>
            </td>
            <td>
                <button onClick={props.minusClick} name={props.name}>-</button>
            </td>
        </tr>
    )
}

function AbilityScores(props) {
    if(DEBUG) console.log("Stats: " + JSON.stringify(props.abilities))
    if(DEBUG) console.log("props.abilities[value]: " + props.abilities["Guts"])
    return(
        <table>
            <thead>
                <tr>
                    <th>Ability</th>
                    <th>Score</th>
                    <th>Increase</th>
                    <th>Decrease</th>
                </tr>
            </thead>
            <tbody>
            {abilityScores.map((value, index) => {
                if(DEBUG) console.log("Ability Score: " + value);
                return(<AbilityScore name={value}
                              score={props.abilities[value]}
                              plusClick={props.plusClick}
                              minusClick={props.minusClick}
                              key={"abilityScore " + value}/>);
                
            })}
            </tbody>
        </table>
    )
}

/**
 * Displays the info for the currently selected class.
 */
function ClassInfoDisplay(props) {
    if(DEBUG) console.log(props)
    let classData = findClass(props.class)
    if(DEBUG) console.log("ClassInfoDisplay: " + JSON.stringify(classData))
    // TODO: Could replace a lot of repetative table HTML with a map fn.
    return (
        <div>
            <table>
                <tbody>
                <tr><td>Cost:</td><td>{classData.cost}</td></tr>
                <tr><td>Guts Bonus:</td><td>{classData.gutsMod}</td></tr>
                <tr><td>Wits Bonus:</td><td>{classData.witsMod}</td></tr>
                <tr><td>Agility Bonus:</td><td>{classData.agilityMod}</td></tr>
                </tbody>
            </table>
            <br></br>
            <table>
            <caption><b>Starting Gear:</b></caption>
                <tbody>
                <tr><td>Weapon:</td><td>{classData.startGear.weapon}</td></tr>
                <tr><td>Armor:</td><td>{classData.startGear.armor}</td></tr>
                <tr><td>Gold:</td><td>{classData.startGear.gold}</td></tr>
                <tr><td>Powers:</td><td>{classData.powers ? classData.powers : "NONE"}</td></tr>
                </tbody>
        </table>
        </div>
        
    )

}

function ClassSelect(props) {
    const [curClass, setCurClass] = useState(defaultClass);
    function displayClassInfo(event) {
        setCurClass(event.target.value);
    }

    let classData = findClass(curClass);
    return (
        <div>
            <label htmlFor="class"><b>Select a class (BP cost in parentheses)</b></label>
            <select id="class" onChange={displayClassInfo}>
                {characterClasses.map((value, index) => (
                    <option
                        key={"classSelect " + value.name}
                        value={value.name}>
                            {value.name}
                    </option>
                ))};
            </select>
            <ClassInfoDisplay class={curClass}/>
            <button name={curClass}
                    onClick={
                        (event) => props.applyClass(event, classData.cost)}>
                        Apply Class
            </button>
        </div>
    )
}

function CharacterCreation(props) {
    const [buildPoints, setBuildPoints] = useState(startBuildPoints);
    const [characterName, setCharacterName] = useState("");
    const [character, setCharacter] = useState(
        {"class": defaultClass,
         "abilities": defaultAbilityScores,
         "gear": characterClasses[0]["startGear"]
    });

    function abilityPlus(event) {
        let ability = event.target.name;
        if(DEBUG) console.log("abilityPlus " + ability);
        if (buildPoints == 0) {
            alert("You have no Build Points left");
            return;
        }
        let charUpdate = structuredClone(character);
        charUpdate.abilities[ability] += 1;
        setCharacter(charUpdate);
        setBuildPoints(buildPoints - 1);
    }
    
    function abilityMinus(event) {
        let ability = event.target.name;
        if(DEBUG) console.log("abilityMinus: " + ability)
        let charUpdate = structuredClone(character);
        if (charUpdate.abilities[ability] == 1) {
            alert("Cannot decrease " + ability + " to zero");
            return;
        }
        charUpdate.abilities[ability] -= 1;
        setCharacter(charUpdate);
        setBuildPoints(buildPoints + 1);
    }

    function addClassAbilities(curClass, className, character) {
        function statOutOfBounds(stat) {
            alert("Cannot add class: " + stat + " cannot be reduced below 1");
            return false;
        }
        let classStats = findClass(className);
        // Add the difference between the current class mod
        // and the new class mod
        let gutsDiff = classStats["gutsMod"] - curClass["gutsMod"];
        let witsDiff = classStats["witsMod"] - curClass["witsMod"];
        let agilityDiff = classStats["agilityMod"] - curClass["agilityMod"];

        // It's possible for the diffs to lead to stats <= 0.
        if ((character["abilities"]["Guts"] += gutsDiff) < 1) {
            return statOutOfBounds("Guts");
        }
        if ((character["abilities"]["Wits"] += witsDiff) < 1) {
            return statOutOfBounds("Wits");
        }
        if ((character["abilities"]["Agility"] += agilityDiff) < 1) {
            return statOutOfBounds("Agility");
        }

        // Also update the character's title since we are here.
        character["title"] = classStats["title"];
        return true;
    }

    function applyClass(event, cost) {
        let charUpdate = structuredClone(character);
        let classUpdateCost = Number(cost);
        let curClass = findClass(character["class"]);
        let curClassCost = Number(curClass.cost);
        
        // Difference in cost represents the total cost for the class.
        let totalBPCost = classUpdateCost - curClassCost;
        if (buildPoints >= totalBPCost) {
            /**
             * If there are enough buildPoints, update character
             * class, build points, and character stats. 
             */
            if (addClassAbilities(curClass, event.target.name, charUpdate)) {
                charUpdate["class"] = event.target.name;
                setCharacter(charUpdate);
                setBuildPoints(buildPoints - totalBPCost);
            } else {
                alert("Class " + event.target.name + " could not be applied.");
            }
        } else {
            alert("Cannot afford class: " +
                event.target.name + ". Cost requirement " +
                cost + " BP. Current BP: " + buildPoints);
            return;
        }
    }

    function clearClass(event) {
        let charUpdate = structuredClone(character);
        charUpdate["class"] = defaultClass;
    }

    function saveCharacter() {
        props.setCharacter(character);
    }

    function updateName(event) {
        let charUpdate = structuredClone(character);
        charUpdate["name"] = event.target.value;
        // If the player hit save with Build Points left,
        // keep them on the character for later use.
        // (We will need the character sheet button for this.)
        if (buildPoints) {
            charUpdate["buildPoints"] = buildPoints;
        }
        setCharacter(charUpdate);
    }
    return (
        <div>
            <BPDisplay buildPoints={buildPoints} /><br></br>
            <CharacterName updateName={updateName} 
                           class={character.class}/>
            <AbilityScores plusClick={abilityPlus}
                           minusClick={abilityMinus}
                           abilities={character.abilities}/>
            <ClassSelect applyClass={applyClass}
                         clearClass={clearClass}/>
            <button onClick={saveCharacter}> Save Character </button>

        </div>
    );
}

export {CharacterCreation};