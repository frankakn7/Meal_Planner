import React from "react";
import classes from "./RecipeElement.module.css";

const RecipeElement = (props) => {
    const reduceToPoint2 = (number) => {
        return parseFloat((Math.round(number * 100) / 100).toFixed(2));
    };

    return (
        <div
            className={`${classes.recipeBox} ${props.selected ? classes.selected : ""}`}
            onClick={() => props.clickHandler(props.recipe.id)}
        >
            <b>{props.recipe.name}</b>
            <p>
                {props.recipe.ingredients.slice(0, 4).map((ingredient) => ingredient.name + ", ")}
                ...
            </p>
            <p>{reduceToPoint2(props.recipe.total)} €</p>
        </div>
    );
};

export default RecipeElement;
