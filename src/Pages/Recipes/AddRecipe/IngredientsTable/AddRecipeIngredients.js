import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import Button from "../../../../Interface/Button/Button";
import AddIngredients from "../../../Ingredients/AddIngredients/AddIngredients";
import IngredientsTable from "../../../Ingredients/IngredientsTable/IngredientsTable";
import classes from "./AddRecipeIngredients.module.css";

const AddRecipeIngredients = (props) => {
    const searchInput = useRef();
    const [filteredIngredients, setFilteredIngredients] = useState(props.ingredients);
    const [addIngredientVisible, setAddIngredientVisible] = useState(false);

    const filterIngreds = (searchInput, toFilterIngredients) => {
        const regexSearch = new RegExp(".*" + searchInput.replaceAll(" ", ".*"), "i");
        return toFilterIngredients.filter((ingredient) =>
            regexSearch.test(ingredient.name + ingredient.info + ingredient.unit)
        );
    };
    const handleSearchChange = () => {
        setFilteredIngredients(filterIngreds(searchInput.current.value, props.ingredients));
    };

    const handleClick = (event) => {
        props.handleAddIngredientClick(parseInt(event.currentTarget.getAttribute("ingredient-id")));
    };

    useEffect(() => {
        setFilteredIngredients(
            filterIngreds(
                searchInput.current.value,
                props.ingredients.filter((ingredient) =>
                    !props.recipe.ingredients
                        .map((ingredient) => ingredient.id)
                        .includes(ingredient.id)
                )
            )
        );
    }, [props.ingredients, props.recipe]);

    const tableDataFieldIcon = (ingredient) => {
        return (
            <td className={classes.plusIcon}>
                <FontAwesomeIcon icon={faPlus} />
            </td>
        );
    };

    return (
        <div className={classes.main}>
            <div className={classes.title}>
                <h1>Available Ingredients</h1>
            </div>
            <div className={classes.tableContainer}>
                <div className={classes.actions}>
                    <div>
                        <label>Search: </label>
                        <input ref={searchInput} onChange={handleSearchChange}></input>
                    </div>
                    <div>
                        <Button onClick={() => setAddIngredientVisible(true)}>
                            Add Ingredients <FontAwesomeIcon icon={faPlus} />
                        </Button>
                    </div>
                </div>
                <IngredientsTable
                    ingredients={filteredIngredients}
                    customTableDataCells={tableDataFieldIcon}
                    clickHandler={handleClick}
                />
            </div>
            {addIngredientVisible && (
                <AddIngredients
                    onClose={() => setAddIngredientVisible(false)}
                    newIngredientsHandler={props.newIngredientsHandler}
                />
            )}
            {/* {selected && (
                <EditIngredient
                    onClose={() => setSelected(false)}
                    ingredient={props.ingredients.find(
                        (ingredient) => ingredient.id === parseInt(selected)
                    )}
                    deleteIngredientHandler={props.deleteIngredientHandler}
                    updateIngredientHandler={props.updateIngredientHandler}
                />
            )} */}
        </div>
    );
};

export default AddRecipeIngredients;
