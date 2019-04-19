import { Post, PostRetreval } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private baseUrl = 'http://localhost:3000';
  private postsAPI = '/api/posts/';

  constructor(private httpClient: HttpClient, private router: Router) {}

  public getPosts() {
    this.httpClient
    .get<{message: string, posts: any}>(this.baseUrl + this.postsAPI)
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

  public getPostById(id: string) {
    return this.httpClient.get(this.baseUrl +  this.postsAPI + id);
  }

  public addPost(post) {
    this.httpClient
    .post<{message: string, postId: string}>(this.baseUrl +  this.postsAPI, post)
    .subscribe((res) => {
      post.id = res.postId;
      this.posts.push(post);
      this.postPushed();
      this.navToHome();
    });
  }

  public updatePost(post) {
    this.httpClient.put(this.baseUrl +  this.postsAPI + post.id, post)
    .subscribe(res => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post[`id`]);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postPushed();
      this.navToHome();
    });
  }

  public deletePost(postId: string) {
    this.httpClient
    .delete(this.baseUrl +  this.postsAPI + postId)
    .subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== postId);
      this.postPushed();
    });
  }

  private postPushed() {
    this.postsUpdated.next([...this.posts]);
  }

  private navToHome() {
    this.router.navigate(['/']);
  }
}
