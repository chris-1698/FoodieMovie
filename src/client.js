import sanityClient from '@sanity/client'

export default sanityClient({
    projectId: "czk7u0to",
    dataset: 'production',
    useCdn: false
});
