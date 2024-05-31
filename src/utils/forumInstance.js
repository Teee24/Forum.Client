const env = import.meta.env
console.log(env)
console.log(env.VITE_FORUM_API_BASEURL)
export const forumInstance = env.VITE_FORUM_API_BASEURL
console.log(forumInstance)
// env.VITE_FORUM_API_BASEURL