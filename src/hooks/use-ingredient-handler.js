import useHttp from "./use-http";

const useIngredientHandler = (baseUrl, setIngredients) => {

    const {sendRequest: sendHttpRequest} = useHttp()

    const handleAddIngredient = (newIngredients) => {
        return new Promise((resolve, reject) => {
            sendHttpRequest({
                url: baseUrl + "/api/ingredients",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: newIngredients,
            })
                .then((response) => {
                    const mappedNewIngredients = newIngredients.map((ingredient, index) => ({
                        ...ingredient,
                        id: response.insertId + index,
                    }));
                    setIngredients((prevState) => [...prevState, ...mappedNewIngredients]);
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    const handleDeleteIngredient = (ingredientId) => {
        return new Promise((resolve, reject) => {
            sendHttpRequest({
                url: baseUrl + "/api/ingredient/delete?id=" + ingredientId,
                method: "POST",
            })
                .then((response) => {
                    setIngredients((prevState) =>
                        prevState.filter((ingredient) => ingredient.id !== ingredientId)
                    );
                    resolve();
                })
                .catch((error) => 
                    reject(error));
        });
    };

    const handleUpdateIngredient = (newIngredient) => {
        return new Promise((resolve, reject) => {
            sendHttpRequest({
                url: baseUrl + "/api/ingredient/update",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: newIngredient
            }).then((response) => {
                setIngredients((prevState) =>
                        prevState.map((ingredient) => ingredient.id !== newIngredient.id ? ingredient : newIngredient)
                    );
                    resolve();
            }).catch((error) => reject(error))
        })
    }

    return {handleAddIngredient, handleDeleteIngredient, handleUpdateIngredient}
}

export default useIngredientHandler;