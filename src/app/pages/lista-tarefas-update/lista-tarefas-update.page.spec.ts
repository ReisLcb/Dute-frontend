import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaTarefasUpdatePage } from './lista-tarefas-update.page';

describe('ListaTarefasUpdatePage', () => {
  let component: ListaTarefasUpdatePage;
  let fixture: ComponentFixture<ListaTarefasUpdatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaTarefasUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
