import { makeAutoObservable, runInAction } from "mobx";
import { LoginUserForm, RegisterUserForm, User } from "../models/user";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Routes";

export default class UserStore {
    user: User | null = null;

    constructor(){
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (userCredentials: LoginUserForm) => {
        const user = await agent.Account.login(userCredentials);
        store.commonStore.setToken(user.accessToken);
        runInAction(() => this.user = user);
        router.navigate('/activities');
        store.modalStore.closeModal();
    }

    register = async (userCredentials: RegisterUserForm) => {
        const user = await agent.Account.register(userCredentials);
        store.commonStore.setToken(user.accessToken);
        runInAction(() => this.user = user);
        router.navigate('/activities');
        store.modalStore.closeModal();
    }

    logout = () => {
        store.commonStore.setToken(null);
        this.user = null;
        router.navigate('/');
    }

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => this.user = user);
        } catch(error) {
            console.log(error);
        }
    }
}