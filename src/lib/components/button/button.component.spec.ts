import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpadeButtonComponent } from './button.component';

describe('Button', () => {
  let component: SpadeButtonComponent;
  let fixture: ComponentFixture<SpadeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpadeButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpadeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
