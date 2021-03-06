import axios from "axios";

class UserError extends Error {
        constructor(message: string) {
            super(message)
        }
}

interface RedirectInterface {
    url: string,
    ending: string
}
class Redirect implements RedirectInterface {
    url: string
    ending: string
    constructor(url: string, ending: string) {
        this.url = url;
        if(ending == null) {
            this.ending = this.genEnding(6)
        } else {
            this.ending = ending
        }
    }
    genEnding(length: number) {
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    	let str = '';
    	for (let i = 0; i < length; i++) {
        	str += chars.charAt(Math.floor(Math.random() * chars.length));
    	}
        return str;
    }
}

class Shortie {
    instance: string;
    constructor(instance: string) {
        this.instance = instance;
    }
    set updateInstance(instance: string) {
        this.instance = instance
    }
    async createRedirect(redirect: RedirectInterface) {
        const mutationStr = JSON.stringify({
            query: `mutation {
                createRedirect(url: "${redirect.url}", ending: "${redirect.ending}") {
                    url,
                    ending
                }
            }`
        })
        const response: any = await axios.post(`${this.instance}/api/graphql`, mutationStr, {
            headers: {
                'Content-Type': 'application/json',
            }
         }).catch(e => {
             if(!e.response || e.response.status == 500) {
                throw new Error("Server unavailable")
             }
             if(e.response.status == 429) {
                 throw new Error("Too many requests")
             }
         })
        if(response.data.errors) {
            if(response.data.errors[0].extensions.code == "USER_INPUT_ERROR") {
                throw new UserError(response.data.errors[0].message)
            } else {
                throw new Error(response.data.errors[0].message)
            }
        } else {
            return response.data.data.createRedirect
        }
    }
    async getRedirect(ending: string) {
        const queryStr = JSON.stringify({
            query: `query {
                getRedirect(ending: "${ending}") {
                    url,
                    ending
                }
            }`
        })
        
        const response: any = await axios.post(`${this.instance}/api/graphql`, queryStr, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).catch(e => {
             if(!e.response || e.response.status == 500) {
                throw new Error("Server unavailable")
             }
             if(e.response.status == 429) {
                 throw new Error("Too many requests")
             }
         })

        
        if(response.data.errors) {
            if(response.data.errors[0].extensions.code == "USER_INPUT_ERROR") {
                throw new UserError(response.data.data.errors[0].message)
            } else {
                throw new Error(response.data.data.errors[0].message)
            }
        } else {
            return new Redirect(response.data.data.getRedirect.url, response.data.data.getRedirect.ending)
        }
    }
}

export { Shortie, UserError, Redirect, RedirectInterface }