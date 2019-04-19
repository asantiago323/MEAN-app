import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  public post: Post;
  public buttonText = 'Create Post';
  public isLoading = false;
  private mode = 'create';
  private postId: string = null;

  constructor(
    public postService: PostsService,
    public route: ActivatedRoute
    ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.buttonText = 'Edit Post';
        this.postId = paramMap.get('postId');
        // loading start
        this.isLoading = true;
        this.postService.getPostById(this.postId).subscribe((postData: Post) => {
          // loading end
          this.isLoading = false;
          this.post = postData;
        });
      } else {
        this.mode = 'create';
        this.buttonText = 'Create Post';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    const post = {
      id: this.postId,
      title: form.value.title,
      content: form.value.content
    };
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(post);
    } else {
      this.postService.updatePost(post);
    }
    form.resetForm();
  }
}
