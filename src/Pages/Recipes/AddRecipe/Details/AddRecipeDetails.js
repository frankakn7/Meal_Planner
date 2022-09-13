import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, useState } from "react";
import Button from "../../../../Interface/Button/Button";
import Confirmation from "../../../../Interface/Confirmation/Confirmation";
import IngredientsTable from "../../../Ingredients/IngredientsTable/IngredientsTable";
import classes from "./AddRecipeDetails.module.css";

const AddRecipeDetails = (props) => {
    const [confirm, setConfirm] = useState(false);

    const totalRow = (
        <tr>
            <td>
                <b>TOTAL</b>
            </td>
            <td>{props.recipe.total} €</td>
        </tr>
    );

    const tableDataFieldQuantity = (ingredient) => {
        return (
            <Fragment>
                <td>
                    <div className={classes.quantityInput}>
                        <input
                            type="number"
                            step="0.5"
                            defaultValue={parseFloat(ingredient.quantity)}
                            onBlur={(event) => {ingredient.quantity = event.target.value; props.handleQuantityChange()}}
                        />
                    </div>
                </td>
                <td className={classes.xIcon}>
                    <Button
                        classes={classes.redButton}
                        onClick={() => props.handleRemoveIngredientClick(ingredient.id)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </Button>
                </td>
            </Fragment>
        );
    };

    return (
        <div className={classes.main}>
            {confirm && (
                <Confirmation
                    onCancel={() => setConfirm(false)}
                    onContinue={props.exitEditing}
                    message={
                        "Are you sure you want to cancel editing this recipe? All unsaved changes will be lost"
                    }
                />
            )}
            {props.isError && (
                <div className={classes.error}>
                    <p>{props.isError}</p>
                </div>
            )}
            <div className={classes.top}>
                <div className={classes.empty} />
                <div className={classes.nameContainer}>
                    <input ref={props.nameInput} defaultValue={props.recipe.name}></input>
                </div>
                <div className={classes.actions}>
                    <Button classes={classes.redButton} onClick={() => setConfirm(true)}>
                        <FontAwesomeIcon icon={faXmark} />
                    </Button>
                </div>
            </div>
            <IngredientsTable
                ingredients={props.recipe.ingredients}
                customTableDataCells={tableDataFieldQuantity}
                customTableHeaderCells={<th>Quantity</th>}
                customTableRows={totalRow}
                classes={classes.ingredientTable}
            />
            <div className={classes.cancelSave}>
                <Button classes={classes.redButton} onClick={() => setConfirm(true)}>
                    Cancel
                </Button>
                <Button classes={classes.greenButton} onClick={props.handleSave}>
                    Save
                </Button>
            </div>
        </div>
    );
};

export default AddRecipeDetails;
