import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Button from '../../../Interface/Button/Button'
import RecipeElement from '../RecipeElement/RecipeElement'
import classes from "./RecipeBoxesList.module.css"

const RecipeBoxesList = (props) => {
  return (
    <div className={`${props.className} ${classes.recipes}`}>
                        <h1>Recipes</h1>
                        <div className={classes.boxesContainer}>
                            {props.recipes.map((recipe) => (
                                <RecipeElement
                                    key={Math.random()}
                                    clickHandler={props.handleClickOnRecipe}
                                    recipe={recipe}
                                    selected={recipe.id === props.selected}
                                />
                            ))}
                            <div className={classes.addButtonContainer}>
                                <Button
                                    classes={classes.greenButton}
                                    onClick={props.handleAddButtonClick}
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                </Button>
                            </div>
                        </div>
                    </div>
  )
}

export default RecipeBoxesList