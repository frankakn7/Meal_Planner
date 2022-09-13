import React from "react";
import classes from "./IngredientsTable.module.css";

const IngredientsTable = (props) => {
    

    return (
        <table className={`${classes.ingredientTable} ${props.classes}`}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Unit</th>
                    <th>Info</th>
                    {props.customTableHeaderCells}
                </tr>
            </thead>
            <tbody>
                {props.ingredients.map((ingredient) => (
                    <tr onClick={props.clickHandler} ingredient-id={ingredient.id} key={Math.random()}>
                        <td>{ingredient.name}</td>
                        <td>{(Math.round(ingredient.price * 100) / 100).toFixed(2)} €</td>
                        <td>{ingredient.unit}</td>
                        <td>{ingredient.info}</td>
                        {props.customTableDataCells && props.customTableDataCells(ingredient)}
                    </tr>
                ))}
                {props.customTableRows}
            </tbody>
        </table>
    );
};

export default IngredientsTable;
