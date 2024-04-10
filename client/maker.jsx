const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    // Prevent default events
    e.preventDefault();

    // Get the name and age of the domo
    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const level = e.target.querySelector('#domoLevel').value;

    // Check if both a name and age are given
    if(!name || !age || !level) {
        helper.handleError('All fields are required');
        return false;
    }

    // Post the domo
    helper.sendPost(e.target.action, {name, age, level}, onDomoAdded);
    return false;
};

const startEdit = (e, onStartEdit) => {
    e.preventDefault();

    onStartEdit();
    return false;
}

const saveEdits = (e, onSaveEdit, onDomosEdited) => {
    e.preventDefault();

    saveDomos(e, onSaveEdit, onDomosEdited);
    return false;
}

const saveDomos = async (e, onSaveEdit, onDomosEdited) => {
    // Prevent default events
    e.preventDefault();

    // Get all the current domos
    const reactDomos = document.querySelectorAll('.domoEditing');

    // Get the domos stored on the server
    let storedDomos;
    const response = await fetch('/getDomos');
    storedDomos = await response.json();

    // Loop through the domos and check for changes
    for(let i = 0; i < reactDomos.length; i++) {
        // Get the edit inputs
        const nameInput = reactDomos[i].querySelector('#editName');
        const ageInput = reactDomos[i].querySelector('#editAge');
        const levelInput = reactDomos[i].querySelector('#editLevel');
        
        // Get the edited values
        let domoName = getEditValue(nameInput);
        let domoAge = getEditValue(ageInput);
        let domoLevel = getEditValue(levelInput);

        // Create the new domo
        const reactDomo = {
            name: domoName,
            age: Number(domoAge),
            level: Number(domoLevel),
            id: Number(reactDomos[i].id),
        };

        // Compare the domos
        for(let j = 0; j < Object.keys(storedDomos.domos).length; j++) {
            compareDomos(e, reactDomo, storedDomos.domos[j], onDomosEdited);
        }
    }

    // Confirm save
    onSaveEdit();
    return false;
}

const getEditValue = (element) => {
    return element.value ? element.value : element.placeholder;
}

const compareDomos = (e, reactDomo, serverDomo, onDomosEdited) => {
    // If the id's are not the same, then return
    if(reactDomo.id !== serverDomo.id) return;

    // Check for changes
    let changes = false;
    if(reactDomo.name !== serverDomo.name) changes = true;
    if(reactDomo.age !== serverDomo.age) changes = true;
    if(reactDomo.level !== serverDomo.level) changes = true;

    // If they are the same and there's a difference, then send a post
    if(changes) {
        helper.sendPost("/save", reactDomo, onDomosEdited);
    }
}

const DomoForm = (props) => {
    return(
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <span id="nameSection">
                <label htmlFor="name">Name: </label>
                <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
            </span>
            <span id="ageSection">
                <label htmlFor="age">Age: </label>
                <input id="domoAge" type="number" min="0" name="age"/>
            </span>
            <span id="levelSection">
                <label htmlFor="level">Level: </label>
                <input id="domoLevel" type="number" min="1" max="10" name="level"/>
            </span>
            <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
        </form>
    );
};

const DomoEditButton = (props) => {
    return(
        <button id="domoEdit"
            onClick={(e) => startEdit(e, props.triggerEditing)}
            className="domoEdit">Edit Domos
        </button>
    );
}

const DomoSaveButton = (props) => {
    // Only show if editing
    if(props.isEditing) {
        return(
            <button id="domoSave"
                onClick={(e) => saveEdits(e, props.triggerEditing, props.triggerReload)}
                className="domoSave">Save Domos
            </button>
        );
    }
}

const DomoList = (props) => {
    // Store the domos array using useState so that we can update and rerender the list
    const [domos, setDomos] = useState(props.domos);

    // Create an effect that reloads whenever the variable changes
    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    // Present the appropriate HTML if there are no Domos
    if(domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    // Create a node for each domo
    domoNodes = domos.map(domo => {
        if(props.isEditing) {
            return (
                <div id={domo.id} className="domoEditing">
                    <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                    <h3 className="domoName">Name: </h3>
                    <input id="editName" type="text" name="name" placeholder={domo.name}/>
                    <h3 className="domoAge">Age: </h3>
                    <input id="editAge" type="number" min="0" name="age" placeholder={domo.age}/>
                    <h3 className="domoLevel">Level: </h3>
                    <input id="editLevel" type="number" min="1" max="10" name="level" placeholder={domo.level}/>
                </div>
            );
        } else {
            return (
                <div id={domo.id} className="domo">
                    <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                    <h3 className="domoName">Name: {domo.name}</h3>
                    <h3 className="domoAge">Age: {domo.age}</h3>
                    <h3 className="domoLevel">Level: {domo.level}</h3>
                </div>
            );
        }
    });
    

    // List all domo nodes
    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const App = () => {
    // Store a state variable as a boolean and set it to false
    const [reloadDomos, setReloadDomos] = useState(false);
    const [editingDomos, setEditingDomos] = useState(false);

    // When we render DomoForm, we create a triggerReload prop, which calls setReloadDomos
    // and passes in the negation of reloadDomos so that it toggles every time it gets called
    return (
        <div>
            <div id="domoControls">
                <div id="makeDomo">
                    <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)}/>
                </div>
                <div id="editDomo">
                    <DomoEditButton triggerEditing={() => setEditingDomos(true)}/>
                    <DomoSaveButton isEditing={editingDomos} 
                        triggerEditing={() => setEditingDomos(false)} 
                        triggerReload={() => setReloadDomos(!reloadDomos)}
                    />
                </div>
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} isEditing={editingDomos}/>
            </div>
        </div>
    );
}

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App/>);
};

window.onload = init;