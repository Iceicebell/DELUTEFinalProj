import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from './post.service';

@Injectable({
  providedIn: 'root'
})
export class BackEndService {
  constructor(private postservice:PostService,private http:HttpClient) { }

  saveData() {
    const listofpost: Post[] = this.postservice.getPost();
    listofpost.forEach((post, index) => {
      this.http.post('https://cc105-3c163-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json', post)
        .subscribe((res) => { console.log(res) });
    });
  }

  fetchData(): Observable<Post[]> {
    return this.http.get<{[key: string]: Post}>('https://cc105-3c163-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json')
      .pipe(
        map(responseData => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          return postArray;
        }),
        tap((listofpost: Post[]) => {
          listofpost.forEach(post => {
            if (!Array.isArray(post.comment)){
              post.comment = [];
            }
            post.comment.forEach(comment => {
              if (!Array.isArray(comment.replies)) {
                comment.replies = [];
              }
            });
          });
          this.postservice.setPosts(listofpost);
        })
      );
  }

 deleteButton(id:string){
    this.http.delete('https://cc105-3c163-default-rtdb.asia-southeast1.firebasedatabase.app/posts/'+id+'.json')
    .subscribe();
  }

  updatePost(id: string, post: Post): Promise<void> {
  return this.http.put(`https://cc105-3c163-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${id}.json`, post)
    .toPromise()
    .then(() => console.log('Post updated successfully'))
    .catch(error => console.error('Error updating post: ', error));
}
}
