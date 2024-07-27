import { createContext, useContext, useMemo, useState } from "react";
import { faker } from "@faker-js/faker";
const PostContext = createContext();

function PostProvider({ children }) {
  function createRandomPost() {
    return {
      title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
      body: faker.hacker.phrase(),
    };
  }

  const [posts, setPosts] = useState(() =>
    Array.from({ length: 5000 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }
  const value = useMemo(() => {
    return {
      posts: searchedPosts,
      onClearPosts: handleClearPosts,
      onAddPost: handleAddPost,
      searchQuery,
      setSearchQuery,
    };
  }, [searchedPosts, searchQuery]);
  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}
function usePost() {
  const context = useContext(PostContext);
  if (context === undefined)
    throw new Error("Post was used  outside  of the postProvider");
  return context;
}

export { PostProvider, usePost };
