import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../Interface/Button/Button";
import PlanDetails from "./PlanDetails/PlanDetails";
import PlanElement from "./PlanElement/PlanElement";
import classes from "./Plans.module.css";

const Plans = (props) => {
    const [selected, setSelected] = useState(false);

    const handleClick = (id) => {
        setSelected((prevState) => (id !== prevState ? id : false));
    };

    const navigate = useNavigate();
    const addClickHandler = useCallback(() => navigate("/Editor", { replace: true }), [navigate]);

    return (
        <div className={classes.main}>
            <div className={`${selected !== false ? classes.half : ""} ${classes.plans}`}>
                <div>
                    <h1>Plans</h1>
                </div>
                {props.plans.map((plan) => (
                    <PlanElement
                        key={Math.random()}
                        plan={plan}
                        clickHandler={handleClick}
                        selected={plan.id === selected}
                    />
                ))}
                <Button classes={classes.greenButton} onClick={addClickHandler}>
                    +
                </Button>
            </div>
            {selected !== false && (
                <div className={classes.rightHalf}>
                    <PlanDetails
                        exitSelect={() => setSelected(false)}
                        plan={props.plans.find((plan) => plan.id === selected)}
                        ingredients={props.ingredients}
                        deletePlanHandler={props.deletePlanHandler}
                    />
                </div>
            )}
        </div>
    );
};

export default Plans;
