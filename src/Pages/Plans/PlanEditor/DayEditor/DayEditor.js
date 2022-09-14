import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Button from "../../../../Interface/Button/Button";
import Confirmation from "../../../../Interface/Confirmation/Confirmation";
import Modal from "../../../../Interface/Modal/Modal";
import AddRecipe from "../../../Recipes/AddRecipe/AddRecipe";
import RecipeBoxesList from "../../../Recipes/RecipeBoxesList/RecipeBoxesList";
import RecipeTable from "../../PlanDetails/RecipeTable";
import classes from "./DayEditor.module.css";

const DayEditor = (props) => {
    const [isAddingRecipe, setIsAddingRecipe] = useState();
    const [recipeTemplate, setRecipeTemplate] = useState({
        name: "",
        total: 0,
        ingredients: [],
        new: true,
    });

    const [confirm, setConfirm] = useState(false);

    const [addedRecipes, setAddedRecipes] = useState(props.planRecipes);

    const exitEditing = () => {
        setRecipeTemplate({
            name: "",
            total: 0,
            ingredients: [],
            new: true,
        });
        setIsAddingRecipe(false);
    };

    const handleAddRecipeToDay = (recipeId) => {
        const foundRecipe = {...props.recipes.find((recipe) => recipe.id === recipeId)}
        foundRecipe.day = props.day.id
        setAddedRecipes((prevState) => [...prevState, foundRecipe]);
    };

    const handleSaveDay = () => {
        props.saveDay(addedRecipes)
        props.exitEditing()
    }

    const removeRecipe = (recipeId) => {
        setAddedRecipes((prevState) => prevState.filter((recipe) => recipe.id !== recipeId))
    }

    const customDataCellsForRecipes = (recipe) => {
        return (<td>
            <Button classes={classes.redButton} onClick={() => removeRecipe(recipe.id)}><FontAwesomeIcon icon={faXmark}/></Button>
        </td>)
    }

    return (
        <Modal classes={classes.modal}>
            {confirm && (
                <Confirmation
                    onCancel={() => setConfirm(false)}
                    onContinue={props.exitEditing}
                    message={
                        "Are you sure you want to cancel editing this Day? All unsaved changes will be lost"
                    }
                />
            )}
            {isAddingRecipe && (
                <Modal classes={classes.addRecipeModal}>
                    <div className={classes.addRecipeModalContent}>
                        <AddRecipe
                            exitEditing={exitEditing}
                            ingredients={props.ingredients}
                            newRecipeHandler={props.newRecipeHandler}
                            updateRecipeHandler={props.updateRecipeHandler}
                            newIngredientsHandler={props.newIngredientsHandler}
                            deleteIngredientHandler={props.deleteIngredientHandler}
                            updateIngredientHandler={props.updateIngredientHandler}
                            recipeTemplate={recipeTemplate}
                        />
                    </div>
                </Modal>
            )}
            <div className={classes.content}>
                <div className={classes.recipeList}>
                    <RecipeBoxesList
                        recipes={props.recipes.filter(
                            (recipe) => !addedRecipes.map((recipe) => recipe.id).includes(recipe.id)
                        )}
                        handleAddButtonClick={() => setIsAddingRecipe(true)}
                        handleClickOnRecipe={handleAddRecipeToDay}
                    />
                </div>
                <div className={classes.dayDetails}>
                    <div>
                        <h1>{props.day.name} (Day {props.day.id})</h1>
                    </div>
                    <RecipeTable
                        recipes={addedRecipes.filter((recipe) => recipe.day === props.day.id)}
                        classes={classes.recipeTable}
                        customDataCells={customDataCellsForRecipes}
                    />
                    <div className={classes.actions}>
                        <Button classes={classes.redButton} onClick={() => setConfirm(true)}>
                            Cancel
                        </Button>
                        <Button classes={classes.greenButton} onClick={handleSaveDay}>
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default DayEditor;
