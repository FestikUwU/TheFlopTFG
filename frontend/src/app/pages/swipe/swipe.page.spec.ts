import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwipePage } from './swipe.page';

describe('SwipePage', () => {
  let component: SwipePage;
  let fixture: ComponentFixture<SwipePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SwipePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
