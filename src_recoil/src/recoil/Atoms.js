import { atom } from 'recoil'

export const mostPopularRuleAtoms = atom({
    key: '_atoms_most_popular_rule',
    default: '/viewed/7.json'
});

export const sectionAtoms = atom({
    key: '_atoms_section',
    default: {}
});