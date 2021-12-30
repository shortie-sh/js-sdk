var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
class UserError extends Error {
    constructor(message) {
        super(message);
    }
}
class Redirect {
    constructor(url, ending) {
        this.url = url;
        if (ending == null) {
            this.ending = this.genEnding(6);
        }
        else {
            this.ending = ending;
        }
    }
    genEnding(length) {
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let str = '';
        for (let i = 0; i < length; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return str;
    }
}
class Shortie {
    constructor(instance) {
        this.instance = instance;
    }
    set updateInstance(instance) {
        this.instance = instance;
    }
    createRedirect(redirect) {
        return __awaiter(this, void 0, void 0, function* () {
            const mutationStr = JSON.stringify({
                query: `mutation {
                createRedirect(url: "${redirect.url}", ending: "${redirect.ending}") {
                    url,
                    ending
                }
            }`
            });
            const response = yield axios.post(`${this.instance}/api/graphql`, mutationStr, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).catch(e => {
                if (!e.response || e.response.status == 500) {
                    throw new Error("Server unavailable");
                }
                if (e.response.status == 429) {
                    throw new Error("Too many requests");
                }
            });
            if (response.data.errors) {
                if (response.data.errors[0].extensions.code == "USER_INPUT_ERROR") {
                    throw new UserError(response.data.errors[0].message);
                }
                else {
                    throw new Error(response.data.errors[0].message);
                }
            }
            else {
                return response.data.data.createRedirect;
            }
        });
    }
    getRedirect(ending) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryStr = JSON.stringify({
                query: `query {
                getRedirect(ending: "${ending}") {
                    url,
                    ending
                }
            }`
            });
            const response = yield axios.post(`${this.instance}/api/graphql`, queryStr, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }).catch(e => {
                if (!e.response || e.response.status == 500) {
                    throw new Error("Server unavailable");
                }
                if (e.response.status == 429) {
                    throw new Error("Too many requests");
                }
            });
            if (response.data.errors) {
                if (response.data.errors[0].extensions.code == "USER_INPUT_ERROR") {
                    throw new UserError(response.data.data.errors[0].message);
                }
                else {
                    throw new Error(response.data.data.errors[0].message);
                }
            }
            else {
                return new Redirect(response.data.data.getRedirect.url, response.data.data.getRedirect.ending);
            }
        });
    }
}
export { Shortie, UserError, Redirect };
