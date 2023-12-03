export class Post{
    public id?: string;
    constructor(
        public title:string,
        public img:string,
        public auth:string,
        public description:string,
        public date:Date,
        public like:number=0,
        public comment:PostComment[] = [],
    ){
    }
}
export interface PostComment {
    likes: any;
    text: string;
    replies: any[];
}