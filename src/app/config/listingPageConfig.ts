export const listingConfig = {
    explore: {
        apiUrl: "/project/v1/library/categories/projects/educationLeader",
        enableSearch: true,
        headerConfig: {
            title:'EXPLORE',
            customActions: [{ icon: 'options-outline', actionName: 'filter' }],
        }
    },
    saved: {
        apiUrl: "/project/v1/",
        enableSearch: false,
        headerConfig: {}
    }
}