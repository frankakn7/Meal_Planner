import useHttp from "./use-http";

const usePlanHandler = (baseUrl, setPlans) => {
    const {sendRequest: sendHttpRequest} = useHttp()

    const handleAddPlan = (newPlan) => {

        const formattedPlan = {name: newPlan.name, recipes: {new: [], existing: newPlan.recipes}}

        return new Promise((resolve, reject) => {
            sendHttpRequest({
                url: baseUrl + "/api/plan",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: formattedPlan,
            })
                .then((response) => {
                    newPlan = {name: newPlan.name, recipes: newPlan.recipes, id: response.insertId}
                    setPlans((prevState) => [...prevState, newPlan]);
                    resolve(response.insertId);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    const handleDeletePlan = (planId) => {
        return new Promise((resolve, reject) => {
            sendHttpRequest({
                url: baseUrl + "/api/plan/delete?id=" + planId,
                method: "POST",
            })
                .then((response) => {
                    setPlans((prevState) =>
                        prevState.filter((plan) => plan.id !== planId)
                    );
                    resolve();
                })
                .catch((error) => 
                    reject(error));
        });
    }

    const handleUpdatePlan = (newPlan) => {

        const formattedPlan = {id: newPlan.id, name: newPlan.name, recipes: newPlan.recipes}

        return new Promise((resolve, reject) => {
            sendHttpRequest({
                url: baseUrl + "/api/plan/update",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: formattedPlan
            }).then((response) => {
                setPlans((prevState) =>
                        prevState.map((plan) => plan.id !== newPlan.id ? plan : newPlan)
                    );
                    resolve();
            }).catch((error) => reject(error))
        })
    }

    return {handleAddPlan, handleDeletePlan, handleUpdatePlan}
}

export default usePlanHandler