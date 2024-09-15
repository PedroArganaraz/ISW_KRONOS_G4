import { Component, Input, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import Swiper from 'swiper';
// import 'swiper/swiper-bundle.min.css';

@Component({
    selector: 'app-image-slider',
    templateUrl: './image-slider.component.html',
    styleUrls: ['./image-slider.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    standalone: true,
    imports: []
})
export class ImageSliderComponent implements AfterViewInit {

    @Input() images: Array<string | ArrayBuffer> = []; // Input to pass an array of image URLs

    constructor() { }

    ngAfterViewInit() {

        const swiper = new Swiper('.swiper-container', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            grabCursor: true,
            centeredSlides: true,
            effect: 'slide', // You can use 'slide', 'fade', 'cube', etc.
            speed: 800 // Transition speed in milliseconds
        });
    }
}