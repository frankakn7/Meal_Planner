import React from "react";
import classes from "./PlanElement.module.css";

const PlanElement = (props) => {

    const compareDay = (a,b) => {
        return a.day < b.day ? -1 : 1
    }

    return (
        <div className={`${classes.box} ${props.selected ? classes.selected : ""}`} onClick={() => props.clickHandler(props.plan.id)}>
            <div className={classes.name}>
                <h1>{props.plan.name}</h1>
            </div>
            <div className={classes.recipes}>
                {props.plan.recipes.sort(compareDay).slice(0,2).map((recipe, index) => (
                    <div key={Math.random()} className={classes.day}>
                        <p className={classes.dayNumber}>Day {recipe.day}</p>
                        <p>{recipe.name} ...</p>
                    </div>
                ))}
                <div className={classes.day}>
                        <p>...</p>
                    </div>
            </div>
        </div>
    );
};

export default PlanElement;
