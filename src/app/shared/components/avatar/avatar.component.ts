import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  @Input() src: string;

  constructor() {
  }

  ngOnInit() {
    this.src = this.src || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvlRriLVd11QaMe0suGWewi2AjP4X9tI55All09seJrBQqcKTEig';
  }

}
