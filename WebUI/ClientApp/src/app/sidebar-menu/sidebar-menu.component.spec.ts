/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { SidebarMenuComponent } from './sidebar-menu.component';

let component: SidebarMenuComponent;
let fixture: ComponentFixture<SidebarMenuComponent>;

describe('sidebar-menu component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ SidebarMenuComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(SidebarMenuComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});