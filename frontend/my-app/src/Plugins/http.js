const rootUrl = 'http://localhost:2001'

const http = {
    post: (url, data) => {
        const options = {
            method: "POST",
            headers: {
                "content-type":"application/json",
            },
            body: JSON.stringify(data)
        }
        return new Promise(resolve => {
            fetch(rootUrl+url, options)
                .then(res => res.json())
                .then(res => {
                    resolve(res)
                })
        })
    },
    postAuth: (url, data, token) => {
        const options = {
            method: "POST",
            headers: {
                "content-type":"application/json",
                authorization: token
            },
            body: JSON.stringify(data)
        }
        return new Promise(resolve => {
            fetch(rootUrl+url, options)
                .then(res => res.json())
                .then(res => {
                    resolve(res)
                })
        })
    },
    get: (url) => {
        return new Promise(resolve => {
            fetch(rootUrl + url)
                .then(res => res.json())
                .then(res => {
                    resolve(res)
                })
        })
    },
    getAuth: (url, token) => {
        const options = {
            method: "GET",
            headers: {
                "content-type":"application/json",
                authorization: token
            },
        }
        return new Promise(resolve => {
            fetch(rootUrl+url, options)
                .then(res => res.json())
                .then(res => {
                    resolve(res)
                })
        })
    },deleteAuth: (url, token) => {
        const options = {
            method: "DELETE",
            headers: {
                "content-type":"application/json",
                authorization: token
            },
        }
        return new Promise(resolve => {
            fetch(rootUrl+url, options)
                .then(res => res.json())
                .then(res => {
                    resolve(res)
                })
        })
    },
}

export default http