import { faCheck, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import Button from "../../../Interface/Button/Button";
import Modal from "../../../Interface/Modal/Modal";
import classes from "./AddIngredients.module.css";

const AddIngredients = (props) => {
    const [newIngredients, setNewIngredients] = useState([]);

    const [isError, setIsError] = useState(false);

    const name = useRef();
    const price = useRef();
    const unit = useRef();
    const info = useRef();

    const handleAdd = () => {
        const newIngred = {
            id: Math.random(),
            name: name.current.value,
            price: price.current.value,
            unit: unit.current.value,
            info: info.current.value,
        }
        setNewIngredients((prevState) => [
            ...prevState,
            newIngred,
        ]);
        name.current.value = ""
        price.current.value = 0
        unit.current.value = "item"
        info.current.value = ""
        setIsError(false)
    };

    const handleDelete = (id) => {
        setNewIngredients((prevState) => prevState.filter((ingredient) => ingredient.id !== id));
    };

    const handleSave = () => {
        props
            .newIngredientsHandler(
                newIngredients.map((ingredient) => ({
                    name: ingredient.name,
                    price: ingredient.price,
                    unit: ingredient.unit,
                    info: ingredient.info,
                }))
            )
            .then(() => props.onClose())
            .catch((error) => setIsError(error.message));
    };

    return (
        <Modal onClose={props.onClose}>
            <div className={classes.main}>
                <h1>Add Ingredients</h1>
                {isError && (
                    <div className={classes.errorMessage}>
                        <p>{isError}</p>
                    </div>
                )}
                <div className={classes.content}>
                    <table className={classes.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Unit</th>
                                <th>Info</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {newIngredients.map((ingredient) => (
                                <tr key={ingredient.id}>
                                    <td>{ingredient.name}</td>
                                    <td>{ingredient.price}</td>
                                    <td>{ingredient.unit}</td>
                                    <td>{ingredient.info}</td>
                                    <td>
                                        <Button
                                            classes={classes.redButton}
                                            onClick={() => handleDelete(ingredient.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td>
                                    <input ref={name} type="text"></input>
                                </td>
                                <td>
                                    <input ref={price} type="number" defaultValue={0}></input>
                                </td>
                                <td>
                                    <input ref={unit} type="text" defaultValue={"item"}></input>
                                </td>
                                <td>
                                    <input ref={info} type="text"></input>
                                </td>
                                <td>
                                    <Button classes={classes.greenButton} onClick={handleAdd}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={classes.actions}>
                    <div>
                        <Button classes={classes.redButton} onClick={props.onClose}>
                            Cancel
                        </Button>
                    </div>
                    <div>
                        <Button classes={classes.greenButton} onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AddIngredients;
