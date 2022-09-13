import {useCallback } from "react";

const useHttp = () => {
    const sendRequest = useCallback((requestConfig) => {
        return new Promise((resolve, reject) => {

            const requestData = {
                mode: "cors",
                method: requestConfig.method ? requestConfig.method : "GET",
                headers: requestConfig.headers ? requestConfig.headers : {},
                body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
            }

            fetch(requestConfig.url, requestData)
            .then((response) => {
                if (!response.ok) {
                    response.json().then((data) => reject(data.Error))
                }else{
                    response
                        .json()
                        .then((data) => resolve(data))
                        .catch((error) => {
                            throw error;
                        });
                }
            })
            .catch((error) => reject(error || "Something went wrong whilst fetching!"));
        });
    }, []);

    return {
        sendRequest,
    };
};

export default useHttp;
