export class Post{
    public id?: string;
    constructor(
        public userId:string,
        public profilepic:string,
        public title:string,
        public img:string,
        public auth:string,
        public description:string,
        public date:Date,
        public like:number=0,
        public comment:PostComment[] = [],
        public likedBy:string[] = [],
    ){
    }
}
export interface PostComment {
    userId:string;
    profilepic:string;
    likes: any;
    text: string;
    replies: Reply[];
    commenter:string;
}
export interface Reply {
    userId:string;
    username: string;
    profilepic: string;
    reply: string;
  }
