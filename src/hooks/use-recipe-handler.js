import useHttp from "./use-http";

const useRecipeHandler = (baseUrl, setRecipes) => {
    const { sendRequest: sendHttpRequest } = useHttp();

    const handleAddRecipe = (newRecipe) => {
        return new Promise((resolve, reject) => {

            const httpBody = {
                name: newRecipe.name,
                ingredients: {
                    new: [],
                    existing: newRecipe.ingredients.map((ingredient) => ({
                        id: ingredient.id,
                        quantity: ingredient.quantity,
                    })),
                },
            };

            if(!httpBody.name || !httpBody.ingredients.existing.length){
                console.log("checked")
                reject({message: "Recipe needs a name and at least 1 ingredient"})
            }else{
                sendHttpRequest({
                    url: baseUrl + "/api/recipe",
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: httpBody
                }).then((response) => {
                    newRecipe.id = response.insertId
                    setRecipes((prevState) => [...prevState,newRecipe])
                    resolve()
                }).catch((error) => reject(error));
            }
        });
    };

    const handleDeleteRecipe = (recipeId) => {
        return new Promise((resolve, reject) => {
            sendHttpRequest({
                url: baseUrl + "/api/recipe/delete?id=" + recipeId,
                method: "POST",
            })
                .then((response) => {
                    setRecipes((prevState) => prevState.filter((recipe) => recipe.id !== recipeId));
                    resolve();
                })
                .catch((error) => reject(error));
        });
    };

    const handleUpdateRecipe = (newRecipe) => {
        return new Promise((resolve, reject) => {
            sendHttpRequest({
                url: baseUrl + "/api/recipe/update",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: newRecipe
            }).then((response) => {
                setRecipes((prevState) =>
                        prevState.map((recipe) => recipe.id !== newRecipe.id ? recipe : newRecipe)
                    );
                    resolve();
            }).catch((error) => reject(error))
        })
    }

    return {handleAddRecipe, handleDeleteRecipe, handleUpdateRecipe };
};

export default useRecipeHandler;
