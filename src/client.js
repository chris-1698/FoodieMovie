import sanityClient from '@sanity/client'
//TODO: Create Combo class
export default sanityClient({
    projectId: "czk7u0to",
    dataset: 'production',
    useCdn: false
});

export async function getCombos() {
    const combos = await sanityClient.fetch('*[_type == "combo"]')
    return combos
}

// export async function createPost(combo: Combo) {
//     const result = sanityClient.create(combo)
//     return result
// }

export async function updateName(_id, name) {
    const result = sanityClient.patch(_id).set({ name })
    return result
}
