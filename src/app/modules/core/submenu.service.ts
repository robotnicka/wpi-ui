import { Injectable } from '@angular/core';
import { BehaviorSubject ,  Observable } from 'rxjs';
import { SubmenuItem } from './submenu-item.model';

@Injectable()
export class SubmenuService {
    itemsSubject: BehaviorSubject<SubmenuItem[]>;
    items: Observable<SubmenuItem[]>;
    constructor() {
        this.itemsSubject = new BehaviorSubject([]);
        this.items = this.itemsSubject.asObservable();
    }
    public setItems(items: SubmenuItem[]){
        this.itemsSubject.next(items);
    }
    public getItems(){
        return this.items;
    }

}
