import { Component, Input, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { DateFormantPipe } from '../../pipes/date-formant.pipe';
import { NumberFormatPipe } from '../../pipes/number-format.pipe';

@Component({
  selector: 'app-card-order',
  standalone: true,
  imports: [DateFormantPipe, NumberFormatPipe],
  templateUrl: './card-order.component.html',
  styleUrl: './card-order.component.scss',
})
export class CardOrderComponent implements OnInit {
  @Input('data') data!: Order;

  constructor() {}

  ngOnInit(): void {}
}
