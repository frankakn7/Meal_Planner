
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import useHttp from "./hooks/use-http";
import { useCallback, useEffect, useState } from "react";
import Ingredients from "./Pages/Ingredients/Ingredients";
import FourOFour from "./Pages/404/FourOFour";
import Layout from "./Pages/Layout/Layout";
import Recipes from "./Pages/Recipes/Recipes";
import Plans from "./Pages/Plans/Plans";
import useIngredientHandler from "./hooks/use-ingredient-handler";
import useRecipeHandler from "./hooks/use-recipe-handler";
import usePlanHandler from "./hooks/use-plan-handler";
import PlanEditor from "./Pages/Plans/PlanEditor/PlanEditor";

function App() {
    const { sendRequest: sendHttpRequest } = useHttp();

    const [ingredients, setIngredients] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [plans, setPlans] = useState([]);

    const baseUrl = "http://127.0.0.1:8080";

    const { handleAddIngredient, handleDeleteIngredient, handleUpdateIngredient } =
        useIngredientHandler(baseUrl, setIngredients);
    const { handleAddRecipe, handleDeleteRecipe, handleUpdateRecipe } = useRecipeHandler(
        baseUrl,
        setRecipes
    );
    const {handleAddPlan, handleDeletePlan, handleUpdatePlan } = usePlanHandler(baseUrl, setPlans);

    const reduceToPoint2 = (number) => {
        return parseFloat((Math.round(number * 100) / 100).toFixed(2));
    };

    const mapRecipeIngredients = useCallback((recipesData, ingredientsData) => {
        return recipesData
            .map((recipe) => ({
                ...recipe,
                ingredients: recipe.ingredients.map((ingredient) => ({
                    quantity: ingredient.quantity,
                    ...ingredientsData.find((ingr) => ingr.id === ingredient.ingredient_id),
                })),
            }))
            .map((recipe) => ({
                ...recipe,
                total: reduceToPoint2(
                    recipe.ingredients.reduce(
                        (total, ingredient) => total + ingredient.price * ingredient.quantity,
                        0
                    )
                ),
            }));
    }, []);

    const mapPlansRecipes = useCallback((plansData, mappedRecipesData) => {
        return plansData.map((plan) => ({
            ...plan,
            recipes: plan.recipes.map((recipe) => ({
                day: recipe.day,
                ...mappedRecipesData.find((rec) => rec.id === recipe.recipe_id),
            })),
        }));
    }, []);

    useEffect(() => {
        const loadDataFromDB = () => {
            const ingredientPromise = sendHttpRequest({
                url: baseUrl + "/api/ingredients",
            });

            const recipePromise = sendHttpRequest({
                url: baseUrl + "/api/recipes/ingredients",
            });

            const planPromise = sendHttpRequest({
                url: baseUrl + "/api/plans/recipes",
            });

            Promise.all([ingredientPromise, recipePromise, planPromise])
                .then((values) => {
                    const [ingredientsData, recipesData, plansData] = values;

                    const mappedRecipesWithIngredients = mapRecipeIngredients(
                        recipesData,
                        ingredientsData
                    );

                    const mappedPlansWithRecipes = mapPlansRecipes(
                        plansData,
                        mappedRecipesWithIngredients
                    );

                    setIngredients(ingredientsData);
                    setRecipes(mappedRecipesWithIngredients);
                    setPlans(mappedPlansWithRecipes);
                })
                .catch((error) =>
                    console.log(
                        error.message || "Something went wrong whilst loading data from db!"
                    )
                );
        };

        loadDataFromDB();
    }, [sendHttpRequest, mapRecipeIngredients, mapPlansRecipes]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/Editor" />} />
                    <Route
                        path="/Editor"
                        element={
                            <PlanEditor
                                plans={plans}
                                recipes={recipes}
                                ingredients={ingredients}
                                newRecipeHandler={handleAddRecipe}
                                deleteRecipeHandler={handleDeleteRecipe}
                                updateRecipeHandler={handleUpdateRecipe}
                                newIngredientsHandler={handleAddIngredient}
                                deleteIngredientHandler={handleDeleteIngredient}
                                updateIngredientHandler={handleUpdateIngredient}
                                addPlanHandler={handleAddPlan}
                                deletePlanHandler={handleDeletePlan}
                                updatePlanHandler={handleUpdatePlan}
                            />
                        }
                    />
                    <Route
                        path="/Ingredients"
                        element={
                            <Ingredients
                                ingredients={ingredients}
                                newIngredientsHandler={handleAddIngredient}
                                deleteIngredientHandler={handleDeleteIngredient}
                                updateIngredientHandler={handleUpdateIngredient}
                            />
                        }
                    />
                    <Route
                        path="/Recipes"
                        element={
                            <Recipes
                                recipes={recipes}
                                ingredients={ingredients}
                                newRecipeHandler={handleAddRecipe}
                                deleteRecipeHandler={handleDeleteRecipe}
                                updateRecipeHandler={handleUpdateRecipe}
                                newIngredientsHandler={handleAddIngredient}
                                deleteIngredientHandler={handleDeleteIngredient}
                                updateIngredientHandler={handleUpdateIngredient}
                            />
                        }
                    />
                    <Route
                        path="/Plans"
                        element={
                            <Plans
                                plans={plans}
                                recipes={recipes}
                                ingredients={ingredients}
                                deletePlanHandler={handleDeletePlan}
                            />
                        }
                    />
                    <Route path="*" element={<FourOFour />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
