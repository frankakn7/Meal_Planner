import { faCopy, faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, useState } from "react";
import Button from "../../../Interface/Button/Button";
import Confirmation from "../../../Interface/Confirmation/Confirmation";
import IngredientsTable from "../../Ingredients/IngredientsTable/IngredientsTable";
import classes from "./RecipeDetails.module.css";

const RecipeDetails = (props) => {
    const [isError, setIsError] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const tableDataFieldQuantity = (ingredient) => {
        return (<Fragment><td>{parseFloat(ingredient.quantity)}</td></Fragment>);
    };

    const editClickHandler = () => {
        props.handleEditRecipe(props.recipe)
    };

    const deleteClickHandler = () => {
        props
            .deleteRecipeHandler(props.recipe.id)
            .then(props.deselect)
            .catch((error) => {setIsError(error.message); setConfirm(false)});
    };

    const sortByQuantity = (a,b) => {
        return a.quantity > b.quantity ? -1 : 1;
    }

    const reduceToPoint2 = (number) => {
        return parseFloat((Math.round(number * 100) / 100).toFixed(2));
    };

    const copyShoppingList = () => {
        const copyText = props.recipe.ingredients.sort(sortByQuantity).reduce(
            (text, ingredient) => text + reduceToPoint2(ingredient.quantity) + "x " +(ingredient.unit !== "item" ? ingredient.unit + " " : "")+ ingredient.name + (ingredient.info ? " ("+ingredient.info+ ")" : "")+"\n",
            ""
        );
        navigator.clipboard.writeText(copyText);
    };

    const totalRow = (
        <tr>
            <td>
                <b>TOTAL</b>
            </td>
            <td>{props.recipe.total} €</td>
        </tr>
    );

    return (
        <div className={classes.main}>
            {confirm && <Confirmation onCancel={() => setConfirm(false)} onContinue={deleteClickHandler} message={"Are you sure you want to delete this recipe?"} />}
            {isError && (
                <div className={classes.error}>
                    <p>{isError}</p>
                </div>
            )}
            <div className={classes.top}>
                <div className={classes.empty} />
                <div className={classes.nameContainer}>
                    <h1>{props.recipe.name}</h1>
                </div>
                <div className={classes.actions}>
                    <Button classes={classes.edit} onClick={editClickHandler}>
                        <FontAwesomeIcon icon={faPencil} />
                    </Button>
                    <Button classes={classes.redButton} onClick={() => setConfirm(true)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                    </Button>
                </div>
            </div>
            <IngredientsTable
                ingredients={props.recipe.ingredients}
                customTableDataCells={tableDataFieldQuantity}
                customTableHeaderCells={<th>Quantity</th>}
                customTableRows={totalRow}
            />
            <div className={classes.copyButtonContainer}>
                <Button onClick={copyShoppingList}>Copy Ingredients <FontAwesomeIcon icon={faCopy}/> </Button>
            </div>
        </div>
    );
};

export default RecipeDetails;
