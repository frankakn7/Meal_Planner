import React from 'react'
import classes from "./RecipeElement.module.css"

const RecipeElement = (props) => {


  return (
    <div className={`${classes.recipeBox} ${props.selected ? classes.selected : ""}`}onClick={() => props.clickHandler(props.recipe.id)}>
        <b>{props.recipe.name}</b>
        <p>{props.recipe.ingredients.slice(0,4).map((ingredient) => ingredient.name+", ")}...</p>
    </div>
  )
}

export default RecipeElement