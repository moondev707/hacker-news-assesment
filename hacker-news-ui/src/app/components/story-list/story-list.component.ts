import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HackerNewsService, StoryDto } from '../../services/hacker-news.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-story-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss']
})
export class StoryListComponent implements OnInit, OnDestroy {
  stories: StoryDto[] = [];
  page = 1;
  pageSize = 40;
  searchTerm = '';
  loading = false;

  private searchSubject = new Subject<string>();
  private searchSub?: Subscription;

  constructor(private hnService: HackerNewsService) { }

  ngOnInit() {
    this.fetchStories();
    this.searchSub = this.searchSubject.pipe(
      debounceTime(3000)
    ).subscribe(term => {
      this.searchTerm = term;
      this.page = 1;
      this.fetchStories();
    });
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
  }

  fetchStories() {
    this.loading = true;
    this.hnService.getNewestStories(this.page, this.pageSize, this.searchTerm).subscribe(stories => {
      this.stories = stories;
      this.loading = false;
    });
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  nextPage() {
    this.page++;
    this.fetchStories();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchStories();
    }
  }
} 