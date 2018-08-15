import { Pipe, PipeTransform } from "@angular/core";
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
const PADDING = "000000";

@Directive({
    selector: '[OnlyNumber]'
})
export class OnlyNumber implements PipeTransform{
    private el: HTMLInputElement;
    private DECIMAL_SEPARATOR: string;
    private THOUSANDS_SEPARATOR: string;
    constructor(private elementRef: ElementRef) {
        this.el = this.elementRef.nativeElement;
        this.DECIMAL_SEPARATOR = ".";
        this.THOUSANDS_SEPARATOR = ",";
    }

    @Input() OnlyNumber: boolean;

    ngOnInit() {
        if (this.el.value.length > 0) {
            this.el.value = this.transform(this.el.value);
        }
    }

    @HostListener('keydown', ['$event']) onKeyDown(event)  {
        let e = <KeyboardEvent>event;
        if (this.OnlyNumber) {
            if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
                // Allow: Ctrl+C
                (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
                // Allow: Ctrl+V
                (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
                // Allow: Ctrl+X
                (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        }
    }
    @HostListener("focus", ["$event.target.value"])
    onFocus(value) {
        //if (value > 0) {
        //    this.el.value = this.parse(value);
        //}
    }
    @HostListener("blur", ["$event.target.value"])
    onBlur(value) {
        //if (value > 0) {
        //    this.el.value = this.transform(value);
        //}
    }

    transform(value: number | string, fractionSize: number = 2): string {
        let [integer, fraction = ""] = (value || "").toString()
            .split(this.DECIMAL_SEPARATOR);

        fraction = fractionSize > 0
            ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
            : "";

        integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);

        return integer + fraction;
    }

    parse(value: string, fractionSize: number = 2): string {
        let [integer, fraction = ""] = (value || "").split(this.DECIMAL_SEPARATOR);

        integer = integer.replace(new RegExp(this.THOUSANDS_SEPARATOR, "g"), "");

        fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
            ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
            : "";

        return integer + fraction;
    }
}