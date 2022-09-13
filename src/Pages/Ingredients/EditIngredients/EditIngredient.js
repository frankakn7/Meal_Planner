import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import Button from "../../../Interface/Button/Button";
import Modal from "../../../Interface/Modal/Modal";
import classes from "./EditIngredient.module.css";

const EditIngredient = (props) => {
    const [isError, setIsError] = useState(false);

    const name = useRef()
    const price = useRef()
    const unit = useRef()
    const info = useRef()

    
    const handleSave = () => {
        const newIngredient = {
            name: name.current.value,
            price: price.current.value,
            unit: unit.current.value,
            info: info.current.value,
            id: props.ingredient.id
        }
        props.updateIngredientHandler(newIngredient).then(() => props.onClose()).catch((error) => setIsError(error.message))
        
    };

    const handleDelete = () => {
        props
            .deleteIngredientHandler(props.ingredient.id)
            .then(() => props.onClose())
            .catch((error) => setIsError(error.message));
    };

    return (
        <Modal onClose={props.onClose}>
            <div className={classes.content}>
                {isError && (
                    <div className={classes.errorMessage}>
                        <p>{isError}</p>
                    </div>
                )}
                <div className={classes.editDelete}>
                    <div>
                        <Button classes={classes.redButton} onClick={handleDelete}>
                            <FontAwesomeIcon icon={faTrashCan} />
                        </Button>
                    </div>
                </div>
                <table className={classes.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Unit</th>
                            <th>Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input ref={name} defaultValue={props.ingredient.name}></input>
                            </td>
                            <td>
                                <input ref={price} defaultValue={props.ingredient.price}></input>
                            </td>
                            <td>
                                <input ref={unit} defaultValue={props.ingredient.unit}></input>
                            </td>
                            <td>
                                <input ref={info} defaultValue={props.ingredient.info}></input>
                            </td>
                        </tr>
                    </tbody>
                </table>
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

export default EditIngredient;
