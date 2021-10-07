import AwesomeDebouncePromise from 'awesome-debounce-promise';

export async function callServer(query){
    return new Promise((res,rej)=>{
        fetch(process.env.REACT_APP_API_BASE_URL + "graphql",{
                method: 'POST',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                query: query,
            }),
        })
        .then(res => res.json())
        .then(
        (result) => {
            res(result);
        },
        (error) => {
            console.log(error);
        }
        )
    });
};

export const callServerDebounced = AwesomeDebouncePromise(callServer,500);

export function getTimeFromDate(d){
    return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}