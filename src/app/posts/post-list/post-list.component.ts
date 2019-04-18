import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  subs: Subscription;

  constructor(public postService: PostsService) {}

  ngOnInit() {
    this.postService.getPosts();
    this.subs = this.postService.getPostUpdateListener()
      .subscribe((postsUpdated: Post[]) => {
        this.posts = postsUpdated;
      });
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
