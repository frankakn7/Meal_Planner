import React from "react";
import classes from "./RecipeTable.module.css";

const RecipeTable = (props) => {

    const compareDay = (a, b) => {
        return a.day < b.day ? -1 : 1;
    };

    const reduceToPoint2 = (number) => {
        return parseFloat((Math.round(number * 100) / 100).toFixed(2))
    }

    return (
        <table className={`${classes.recipeTable} ${props.classes}`}>
            <thead>
                <tr>
                    <th>Day</th>
                    <th>Recipes</th>
                    <th>Ingredients</th>
                    <th>Cost</th>
                </tr>
            </thead>
            <tbody>
                {props.recipes.sort(compareDay).map((recipe) => (
                    <tr key={Math.random()}>
                        <td>Day {recipe.day}</td>
                        <td>{recipe.name}</td>
                        <td>
                            {recipe.ingredients.map((ingredient) => (
                                <div key={Math.random()}>
                                    {parseFloat(ingredient.quantity)} x {ingredient.name}
                                </div>
                            ))}
                        </td>
                        <td>{recipe.total} €</td>
                    </tr>
                ))}
                <tr>
                    <td>
                        <b>TOTAL</b>
                    </td>
                    <td></td>
                    <td></td>
                    <td>{props.recipes.length && reduceToPoint2(props.recipes.reduce((total, recipe) => total + recipe.total, 0))} €</td>
                </tr>
            </tbody>
        </table>
    );
};

export default RecipeTable;
