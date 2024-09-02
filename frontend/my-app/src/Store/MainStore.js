import {create} from "zustand";

const useStore = create((set, get) => ({
    user: null,
    setUser: val => set({user: val}),
    token: null,
    setToken: val => set({token: val}),
}))

export default useStore