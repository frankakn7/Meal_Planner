import {
    faTrashCan,
    faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../Interface/Button/Button";
import Confirmation from "../../../Interface/Confirmation/Confirmation";
import classes from "./PlanDetails.module.css";
import RecipeTable from "./RecipeTable";

const PlanDetails = (props) => {
    const [confirm, setConfirm] = useState(false);
    const [isError, setIsError] = useState(false);

    const navigate = useNavigate();
    const expandClickHandler = useCallback(
        () => navigate("/Editor?id=" + props.plan.id, { replace: true }),
        [navigate, props.plan]
    );

    const deleteHandler = () => {
        props
            .deletePlanHandler(props.plan.id)
            .then(() => {
                props.exitSelect();
                setConfirm(false);
            })
            .catch((error) => setIsError(error.message));
    };

    return (
        <div className={classes.main}>
            {confirm && (
                <Confirmation
                    onCancel={() => setConfirm(false)}
                    onContinue={deleteHandler}
                    message={"Are you sure you want to delete this plan?"}
                />
            )}
            {isError && (
                <div className={classes.error}>
                    <p>{isError}</p>
                </div>
            )}
            <div className={classes.top}>
                <div className={classes.emtpy}></div>
                <div className={classes.nameContainer}>
                    <h1>{props.plan.name}</h1>
                </div>
                <div className={classes.actions}>
                    <Button classes={classes.expand} onClick={expandClickHandler}>
                        <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
                    </Button>
                    <Button classes={classes.redButton} onClick={() => setConfirm(true)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                    </Button>
                </div>
            </div>
            <div className={classes.recipeContainer}>
                <RecipeTable recipes={props.plan.recipes} ingredients={props.ingredients} />
            </div>
        </div>
    );
};

export default PlanDetails;
