import React, { Fragment, useState } from "react";
import AddRecipe from "./AddRecipe/AddRecipe";
import RecipeBoxesList from "./RecipeBoxesList/RecipeBoxesList";
import RecipeDetails from "./RecipeDetails/RecipeDetails";
import classes from "./Recipes.module.css";

const Recipes = (props) => {
    const [selected, setSelected] = useState(false);
    const [editing, setEditing] = useState(false);

    const [recipeTemplate, setRecipeTemplate] = useState({
        name: "",
        total: 0,
        ingredients: [],
        new: true,
    });

    const handleClick = (id) => {
        setSelected((prevState) => (id !== prevState ? id : false));
    };

    const editRecipeHandler = (recipe) => {
        setRecipeTemplate(recipe);
        setEditing(true);
    };

    const exitEditing = () => {
        setRecipeTemplate({
            name: "",
            total: 0,
            ingredients: [],
            new: true,
        });
        setEditing(false);
    };

    return (
        <Fragment>
            {!editing && (
                <div className={classes.main}>
                    <RecipeBoxesList
                        className={`${selected !== false ? classes.half : ""}`}
                        handleClickOnRecipe={handleClick}
                        selected={selected}
                        recipes={props.recipes}
                        handleAddButtonClick={() => setEditing(true)}
                    />
                    {selected !== false && (
                        <div className={classes.rightHalf}>
                            <RecipeDetails
                                recipe={props.recipes.find((recipe) => recipe.id === selected)}
                                deleteRecipeHandler={props.deleteRecipeHandler}
                                deselect={() => setSelected(false)}
                                handleEditRecipe={editRecipeHandler}
                            />
                        </div>
                    )}
                </div>
            )}
            {editing && (
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
            )}
        </Fragment>
    );
};

export default Recipes;
