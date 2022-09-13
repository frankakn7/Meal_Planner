import React, { useEffect, useRef, useState } from "react";
import classes from "./Ingredients.module.css";
import IngredientsTable from "./IngredientsTable/IngredientsTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../../Interface/Button/Button";
import AddIngredients from "./AddIngredients/AddIngredients";
import EditIngredient from "./EditIngredients/EditIngredient";

const Ingredients = (props) => {
    const searchInput = useRef();
    const [filteredIngredients, setFilteredIngredients] = useState(props.ingredients);

    const [selected, setSelected] = useState(false);

    const [addIngredientVisible, setAddIngredientVisible] = useState(false);

    const handleClick = (event) => {
        setSelected(event.currentTarget.getAttribute("ingredient-id"));
    };

    const filterIngreds = (searchInput, toFilterIngredients) => {
        const regexSearch = new RegExp(".*" + searchInput.replaceAll(" ", ".*"), "i");
        return toFilterIngredients.filter((ingredient) =>
            regexSearch.test(ingredient.name + ingredient.info + ingredient.unit)
        );
    };

    useEffect(() => {
        setFilteredIngredients(filterIngreds(searchInput.current.value, props.ingredients));
    }, [props.ingredients]);

    const handleSearchChange = () => {
        setFilteredIngredients(filterIngreds(searchInput.current.value, props.ingredients));
    };

    return (
        <div className={classes.main}>
            <h1>Ingredients</h1>
            <div className={classes.content}>
                <div className={classes.tableContainer}>
                    <div className={classes.actions}>
                        <div>
                            <label>Search: </label>
                            <input ref={searchInput} onChange={handleSearchChange}></input>
                        </div>
                        <Button onClick={() => setAddIngredientVisible(true)}>
                            Add Ingredients <FontAwesomeIcon icon={faPlus} />
                        </Button>
                    </div>
                    <IngredientsTable
                        clickHandler={handleClick}
                        ingredients={filteredIngredients}
                    />
                </div>
            </div>
            {addIngredientVisible && (
                <AddIngredients
                    onClose={() => setAddIngredientVisible(false)}
                    newIngredientsHandler={props.newIngredientsHandler}
                />
            )}
            {selected && (
                <EditIngredient
                    onClose={() => setSelected(false)}
                    ingredient={props.ingredients.find(
                        (ingredient) => ingredient.id === parseInt(selected)
                    )}
                    deleteIngredientHandler={props.deleteIngredientHandler}
                    updateIngredientHandler={props.updateIngredientHandler}
                />
            )}
        </div>
    );
};

export default Ingredients;
