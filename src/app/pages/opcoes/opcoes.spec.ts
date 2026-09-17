import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Opcoes } from './opcoes';

describe('Opcoes', () => {
  let component: Opcoes;
  let fixture: ComponentFixture<Opcoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Opcoes],
    }).compileComponents();

    fixture = TestBed.createComponent(Opcoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
