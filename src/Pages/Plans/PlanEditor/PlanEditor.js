import { faCopy, faPencil, faSave, faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../../Interface/Button/Button";
import Confirmation from "../../../Interface/Confirmation/Confirmation";
import IngredientsTable from "../../Ingredients/IngredientsTable/IngredientsTable";
import RecipeTable from "../PlanDetails/RecipeTable";
import DayEditor from "./DayEditor/DayEditor";
import PlanDayTable from "./PlanDayTable/PlanDayTable";
import classes from "./PlanEditor.module.css";

const PlanEditor = (props) => {
    const [neededIngredients, setNeededIngredients] = useState([]);
    const [totalRow, setTotalRow] = useState(<tr></tr>);

    const [confirm, setConfirm] = useState(false);
    const [askAddNewFromPlan, setAskAddNewFromPlan] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isError, setIsError] = useState(false);

    const [isEditDay, setIsEditDay] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    const planName = useRef();

    const newEmptyPlan = { name: "", recipes: [], new: true };
    const [planUsedForTemplate, setPlanUsedForTemplate] = useState(newEmptyPlan);
    const [plan, setPlan] = useState(newEmptyPlan);

    const countIngredients = (ingredients2dArr) => {
        const counts = {};

        ingredients2dArr.forEach((ingredientlist) => {
            ingredientlist.forEach((ingredient) => {
                counts[ingredient.id] = (counts[ingredient.id] || 0) + 1 * ingredient.quantity;
            });
        });
        return counts;
    };

    const sortByQuantity = (a,b) => {
        return a.quantity > b.quantity ? -1 : 1;
    }

    const copyShoppingList = () => {
        const copyText = neededIngredients.sort(sortByQuantity).reduce(
            (text, ingredient) => text + reduceToPoint2(ingredient.quantity) + "x " + ingredient.name + " (" +ingredient.info+ ")\n",
            ""
        );
        navigator.clipboard.writeText(copyText);
    };

    useEffect(() => {
        if (props.plans.length && searchParams.get("id")) {
            const foundPlan = props.plans.find(
                (plan) => parseInt(searchParams.get("id")) === plan.id
            );
            foundPlan ? setPlan(foundPlan) : setPlan({ name: "", recipes: [] });
        }
    }, [props.plans, searchParams]);

    useEffect(() => {
        const countedIngredientIds = countIngredients(
            plan.recipes.map((recipe) => recipe.ingredients)
        );
        setNeededIngredients(
            props.ingredients
                .filter((ingredient) => countedIngredientIds[ingredient.id])
                .map((ingredient) => ({
                    ...ingredient,
                    quantity: countedIngredientIds[ingredient.id],
                }))
        );

        setTotalRow(
            <tr>
                <td>
                    <b>TOTAL</b>
                </td>
                <td>
                    {reduceToPoint2(
                        plan.recipes.reduce((total, recipe) => total + recipe.total, 0)
                    )}{" "}
                    €
                </td>
            </tr>
        );
    }, [plan, props.ingredients]);

    const tableDataFieldQuantity = (ingredient) => {
        return (
            <Fragment>
                <td>{reduceToPoint2(parseFloat(ingredient.quantity))}</td>
            </Fragment>
        );
    };

    const reduceToPoint2 = (number) => {
        return parseFloat((Math.round(number * 100) / 100).toFixed(2));
    };

    const deleteHandler = () => {
        props
            .deletePlanHandler(props.plan.id)
            .then(() => {
                setPlan({ name: "", recipes: [] });
                setConfirm(false);
            })
            .catch((error) => setIsError(error.message));
    };

    const saveDay = (newRecipesList) => {
        setPlan((prevState) => ({ ...plan, recipes: [...newRecipesList] }));
    };

    const navigate = useNavigate();
    const reloadWithId = useCallback(
        (id) => navigate("/Editor?id=" + id, { replace: true }),
        [navigate]
    );

    const savePlan = () => {
        if (planName.current.value) {
            if (plan.new) {
                props
                    .addPlanHandler({ ...plan, name: planName.current.value })
                    .then((newPlanId) => {
                        setIsEditing(false);
                        reloadWithId(newPlanId);
                    })
                    .catch((error) => setIsError(error.message));
            } else {
                props
                    .updatePlanHandler({ ...plan, name: planName.current.value })
                    .then(() => setIsEditing(false))
                    .catch((error) => setIsError(error.message));
            }
        } else {
            setIsError("Plan needs to have a name");
        }
    };

    const handleTemplateQuestion = (planToUse) => {
        setPlan(planToUse);
        setIsEditing(true);
        setAskAddNewFromPlan(false);
    };

    const startEditing = () => {
        setIsEditing(true);
        setPlanUsedForTemplate(plan);
    };

    return (
        <div className={classes.main}>
            {isError && (
                <div className={classes.error}>
                    <p>{isError}</p>
                </div>
            )}
            {confirm && !isEditing && !plan.new && (
                <Confirmation
                    onCancel={() => setConfirm(false)}
                    onContinue={deleteHandler}
                    message={"Are you sure you want to delete this plan?"}
                />
            )}
            {confirm && isEditing && (
                <Confirmation
                    onCancel={() => setConfirm(false)}
                    onContinue={() => {
                        setIsEditing(false);
                        setConfirm(false);
                        setPlan(planUsedForTemplate);
                    }}
                    message={
                        "Are you sure you want to cancel editing this plan? All unsaved changes will be lost"
                    }
                />
            )}
            {askAddNewFromPlan && !isEditing && (
                <Confirmation
                    onCancel={() => {
                        setPlanUsedForTemplate(plan);
                        handleTemplateQuestion(newEmptyPlan);
                    }}
                    onContinue={() => {
                        // window.history.replaceState({}, document.title, "/Editor" );
                        setPlanUsedForTemplate(plan);
                        handleTemplateQuestion((prevState) => ({ ...prevState, new: true }));
                    }}
                    message={"Do you want to use this plan as template?"}
                />
            )}
            {isEditDay !== false && (
                <DayEditor
                    recipes={props.recipes}
                    planRecipes={plan.recipes}
                    day={isEditDay}
                    ingredients={props.ingredients}
                    newRecipeHandler={props.newRecipeHandler}
                    updateRecipeHandler={props.updateRecipeHandler}
                    newIngredientsHandler={props.newIngredientsHandler}
                    deleteIngredientHandler={props.deleteIngredientHandler}
                    updateIngredientHandler={props.updateIngredientHandler}
                    exitEditing={() => setIsEditDay(false)}
                    saveDay={saveDay}
                />
            )}
            <div className={classes.top}>
                <div className={classes.name}>
                    {!isEditing && <h1>{plan.name}</h1>}
                    {isEditing && (
                        <input
                            ref={planName}
                            defaultValue={plan.new && plan.name ? plan.name + " Copy" : plan.name}
                        ></input>
                    )}
                </div>
                <div className={classes.actions}>
                    {!isEditing && !plan.new && (
                        <Button
                            classes={classes.greenButton}
                            onClick={() => setAskAddNewFromPlan(true)}
                        >
                            Add New +
                        </Button>
                    )}
                    {!isEditing && !plan.new && (
                        <Button classes={classes.edit} onClick={() => startEditing()}>
                            <FontAwesomeIcon icon={faPencil} />
                        </Button>
                    )}
                    {!isEditing && plan.new && (
                        <Button classes={classes.greenButton} onClick={() => startEditing()}>
                            Create New Plan +
                        </Button>
                    )}
                    {!isEditing && !plan.new && (
                        <Button classes={classes.redButton} onClick={() => setConfirm(true)}>
                            <FontAwesomeIcon icon={faTrashCan} />
                        </Button>
                    )}
                    {isEditing && (
                        <Button classes={classes.edit} onClick={savePlan}>
                            <FontAwesomeIcon icon={faSave} />
                        </Button>
                    )}
                    {isEditing && (
                        <Button classes={classes.redButton} onClick={() => setConfirm(true)}>
                            <FontAwesomeIcon icon={faXmark} />
                        </Button>
                    )}
                </div>
            </div>
            <div className={classes.tableContainer}>
                <PlanDayTable
                    plan={plan}
                    ingredients={props.ingredients}
                    isEditing={isEditing}
                    setIsEditDay={setIsEditDay}
                />
            </div>
            {(!plan.new || isEditing) && (
                <div className={classes.underTable}>
                    <div className={classes.ingredientsList}>
                        <h2>All needed Ingredients</h2>
                        <IngredientsTable
                            ingredients={neededIngredients}
                            customTableDataCells={tableDataFieldQuantity}
                            customTableHeaderCells={<th>Quantity</th>}
                            customTableRows={totalRow}
                        />
                    </div>
                    <div className={classes.shoppingList}>
                        <div className={classes.actualList}>
                            <h2>Shopping List</h2>
                            {neededIngredients.map((ingredient) => (
                                <div key={Math.random()} className={classes.ingredientInList}>
                                    {reduceToPoint2(ingredient.quantity)}x {ingredient.name}
                                </div>
                            ))}
                        </div>
                        <Button classes={classes.copyButton} onClick={copyShoppingList}>
                            Copy <FontAwesomeIcon icon={faCopy} />
                        </Button>
                    </div>
                    <div className={classes.allRecipes}>
                        <h2>All Recipes</h2>
                        <RecipeTable classes={classes.recipeTable} recipes={plan.recipes} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanEditor;
