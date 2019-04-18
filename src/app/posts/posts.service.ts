import { Post, PostRetreval } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private baseUrl = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {}

  public getPosts() {
    this.httpClient
    .get<{message: string, posts: any}>(this.baseUrl + '/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        };
      });
    }))
    .subscribe((postData) => {
      this.posts = postData;
      this.postsUpdated.next([...this.posts]);
    });
  }

  public getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  public addPost(post: Post) {
    this.httpClient
    .post<{message: string, postId: string}>(this.baseUrl + '/api/posts', post)
    .subscribe((res) => {
      post.id = res.postId;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
  }

  deletePost(postId: string) {
    this.httpClient
    .delete(this.baseUrl + '/api/posts/' + postId)
    .subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== postId);
      this.postsUpdated.next([...this.posts]);
    });
  }
}
