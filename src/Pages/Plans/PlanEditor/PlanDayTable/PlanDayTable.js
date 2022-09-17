import { faChevronLeft, faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Button from "../../../../Interface/Button/Button";
import classes from "./PlanDayTable.module.css";

const PlanDayTable = (props) => {
    const weekdays = useMemo(
        () => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        []
    );

    

    const [visibleDays, setVisibleDays] = useState([]);

    const getRecipeForDay = useCallback(
        (day) => {
            return props.plan.recipes.filter((recipe) => recipe.day === day);
        },
        [props.plan.recipes]
    );

    const countIngredients = (ingredients2dArr) => {
        const counts = {};

        ingredients2dArr.forEach((ingredientlist) => {
            ingredientlist.forEach((ingredient) => {
                counts[ingredient.id] = (counts[ingredient.id] || 0) + 1 * ingredient.quantity;
            });
        });
        return counts;
    };

    const getDayObject = useCallback(
        (dayNum) => {
            const recipesForDay = getRecipeForDay(dayNum);
            const countedIngredientIds = countIngredients(
                recipesForDay.map((recipe) => recipe.ingredients)
            );
            return {
                id: dayNum,
                name: weekdays[dayNum % 7],
                recipes: recipesForDay,
                total: recipesForDay.reduce((total, recipe) => total + recipe.total, 0),
                ingredients: props.ingredients
                    .filter((ingredient) => countedIngredientIds[ingredient.id])
                    .map((ingredient) => ({
                        ...ingredient,
                        quantity: countedIngredientIds[ingredient.id],
                    })),
            };
        },
        [getRecipeForDay, props.ingredients, weekdays]
    );

    const reduceToPoint2 = (number) => {
        return parseFloat((Math.round(number * 100) / 100).toFixed(2));
    };

    useEffect(() => {
        setVisibleDays([...Array(7).keys()].map((i) => getDayObject(i + props.weekNum * 7)));
    }, [getDayObject, props.plan.recipes, props.weekNum]);

    return (
        <div className={classes.main}>
            <div>
                {(!props.plan.new || props.isEditing) && (
                    <Button
                        classes={classes.changeWeekButton}
                        disabled={props.weekNum === 0}
                        onClick={() => {
                            props.setWeekNum((prevState) => prevState - 1);
                        }}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </Button>
                )}
            </div>
            <table className={classes.dayTable}>
                <thead>
                    <tr>
                        {visibleDays.map((day) => (
                            <th key={Math.random()} className={classes.dayHeader}>
                                <div>{day.name}</div>
                                <div className={classes.dayNumber}>(Day {day.id})</div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {visibleDays.map((day) => (
                            <td key={Math.random()} className={classes.recipeCell}>
                                <div className={classes.recipeCellContent}>
                                    <div className={classes.recipeNames}>
                                        {day.recipes.map((recipe) => (
                                            <div
                                                key={Math.random()}
                                                className={classes.singleRecipeName}
                                            >
                                                <b>{recipe.name}</b>
                                            </div>
                                        ))}
                                    </div>
                                    {props.isEditing && (
                                        <div
                                            key={Math.random()}
                                            className={classes.buttonContainer}
                                        >
                                            <Button
                                                classes={classes.greenButton}
                                                onClick={() => {
                                                    props.setIsEditDay(day);
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faPlus}/>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </td>
                        ))}
                    </tr>
                    <tr>
                        {visibleDays.map((day) => (
                            <td key={Math.random()} className={classes.ingredientsCell}>
                                {day.ingredients.map((ingredient) => (
                                    <div key={Math.random()}>
                                        {reduceToPoint2(ingredient.quantity)} x {ingredient.name}
                                    </div>
                                ))}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        {visibleDays.map((day) => (
                            <td key={Math.random()}>{reduceToPoint2(day.total)} €</td>
                        ))}
                    </tr>
                </tbody>
            </table>
            <div>
                {(!props.plan.new || props.isEditing) && (
                    <Button
                        classes={classes.changeWeekButton}
                        disabled={(Math.max(...props.plan.recipes.map((recipe) => recipe.day)) < props.weekNum + 1 * 7) && !props.isEditing}
                        onClick={() => props.setWeekNum((prevState) => prevState + 1)}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default PlanDayTable;
