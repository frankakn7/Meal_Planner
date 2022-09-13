import React, { useRef, useState } from "react";
import classes from "./AddRecipe.module.css";
import AddRecipeDetails from "./Details/AddRecipeDetails";
import AddRecipeIngredients from "./IngredientsTable/AddRecipeIngredients";

const AddRecipe = (props) => {
    const [isError, setIsError] = useState(false);
    const [newRecipe, setNewRecipe] = useState(props.recipeTemplate);

    const nameInput = useRef();

    const reduceToPoint2 = (number) => {
        return parseFloat((Math.round(number * 100) / 100).toFixed(2));
    };

    const handleQuantityChange = () => {
        setNewRecipe((prevState) => ({
            ...prevState,
            total: reduceToPoint2(
                prevState.ingredients.reduce(
                    (total, ingredient) => total + ingredient.price * ingredient.quantity,
                    0
                )
            ),
        }));
    }

    const handleAddIngredientClick = (ingredientId) => {
        const newIngredient = props.ingredients.find(
            (ingredient) => ingredient.id === ingredientId
        );
        newIngredient.quantity = 1;
        setNewRecipe((prevState) => ({
            ...prevState,
            ingredients: [...prevState.ingredients, newIngredient],
            total: reduceToPoint2(
                [...prevState.ingredients, newIngredient].reduce(
                    (total, ingredient) => total + ingredient.price * ingredient.quantity,
                    0
                )
            ),
        }));
    };

    const handleRemoveIngredientClick = (ingredientId) => {
        setNewRecipe((prevState) => {
            const newIngredients = prevState.ingredients.filter(
                (ingredient) => ingredient.id !== ingredientId
            );
            return {
                ...prevState,
                ingredients: newIngredients,
                total: reduceToPoint2(
                    newIngredients.reduce(
                        (total, ingredient) => total + ingredient.price * ingredient.quantity,
                        0
                    )
                ),
            };
        });
    };

    const handleSave = () => {
        newRecipe.name = nameInput.current.value;
        if (newRecipe.new) {
            props
                .newRecipeHandler(newRecipe)
                .then(() => props.exitEditing())
                .catch((error) => setIsError(error.message));
        } else {
            props
                .updateRecipeHandler(newRecipe)
                .then(() => props.exitEditing())
                .catch((error) => setIsError(error.message));
        }
    };

    return (
        <div className={classes.main}>
            <div className={classes.half}>
                <AddRecipeIngredients
                    ingredients={props.ingredients}
                    newIngredientsHandler={props.newIngredientsHandler}
                    deleteIngredientHandler={props.deleteIngredientHandler}
                    updateIngredientHandler={props.updateIngredientHandler}
                    handleAddIngredientClick={handleAddIngredientClick}
                    recipe={newRecipe}
                />
            </div>
            <div className={classes.rightHalf}>
                <AddRecipeDetails
                    nameInput={nameInput}
                    exitEditing={props.exitEditing}
                    recipe={newRecipe}
                    handleRemoveIngredientClick={handleRemoveIngredientClick}
                    handleSave={handleSave}
                    isError={isError}
                    handleQuantityChange={handleQuantityChange}
                />
            </div>
        </div>
    );
};

export default AddRecipe;
