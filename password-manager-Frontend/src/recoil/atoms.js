import { atom } from "recoil";

export const authStateAtom = atom({
    key: "authStateAtom",
    default: {
        email: null,
        username: null,
        authenticated: false
    }
})

export const passwordsAtom = atom({
    key: "passwordsAtom",
    default: []
})

export const cardsAtom = atom({
    key: "cardsAtom",
    default: []
})

export const identityAtom = atom({
    key: "identityAtom",
    default: []
})