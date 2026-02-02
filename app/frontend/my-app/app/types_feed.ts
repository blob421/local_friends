export type Region = {
  id: number
  display_name: string
}
export type Post = {
  _id: string
  id: number;
  title: string;
  content: string;
  Media: Media[]
  User: User
  Comments: Comment[]
  SubComments: SubComment[]
  Region: Region
  latitude: number
  guessed_animal: string
  longitude: number
 
  
};
export type Media = {
  url: string;
  idx: number;
  filename: string;
  mimeType: string;
  
};
export type Comment = {
  content : string
  id: string
  User: User
  SubComments: SubComment[]
  createdAt: string
}
export type SubComment = {
  content : string
  id: string
  User: User
  SubComments: SubComment[]
  createdAt: string
  CommentId ? : number
  ParentId ? : number
}
export type User = {
  picture: string
  id: number
  username: string
}