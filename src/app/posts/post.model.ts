export interface Post {
  id: string;
  title: string;
  content: string;
}

export interface PostRetreval {
  message: string;
  posts: Post[];
}
