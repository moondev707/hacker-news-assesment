import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoryListComponent } from './story-list.component';
import { HackerNewsService } from '../../services/hacker-news.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

class MockHackerNewsService {
  getNewestStoryIds() { return of([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]); }
  getStories(ids: number[]) { return of(ids.map(id => ({ title: `Story ${id}`, url: `http://test.com/${id}` }))); }
}

describe('StoryListComponent', () => {
  let component: StoryListComponent;
  let fixture: ComponentFixture<StoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryListComponent, FormsModule, CommonModule],
      providers: [{ provide: HackerNewsService, useClass: MockHackerNewsService }]
    }).compileComponents();

    fixture = TestBed.createComponent(StoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show correct pagination summary for first page', () => {
    component.page = 1;
    component.pageSize = 40;
    component.storyIds = Array.from({ length: 45 }, (_, i) => i + 1);
    fixture.detectChanges();
    expect(component.pageEnd).toBe(40);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.pagination-summary')?.textContent).toContain('Showing 1-40 of 45 stories');
  });

  it('should show correct pagination summary for last page', () => {
    component.page = 2;
    component.pageSize = 40;
    component.storyIds = Array.from({ length: 45 }, (_, i) => i + 1);
    fixture.detectChanges();
    expect(component.pageEnd).toBe(45);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.pagination-summary')?.textContent).toContain('Showing 41-45 of 45 stories');
  });

  it('should filter stories by search term', () => {
    component.stories = [
      { title: 'Angular', url: 'http://test.com/1' },
      { title: 'React', url: 'http://test.com/2' }
    ];
    component.searchTerm = 'Angular';
    component.applySearch();
    expect(component.filteredStories.length).toBe(1);
    expect(component.filteredStories[0].title).toBe('Angular');
  });

  it('should go to next and previous page', () => {
    component.storyIds = Array.from({ length: 80 }, (_, i) => i + 1);
    component.page = 1;
    component.pageSize = 40;
    component.loadPage = jasmine.createSpy();
    component.nextPage();
    expect(component.page).toBe(2);
    component.prevPage();
    expect(component.page).toBe(1);
  });
});
