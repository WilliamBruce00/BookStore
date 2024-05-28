import { Component, OnInit } from '@angular/core';
import { Order } from '../../../../models/order.model';
import { OrderService } from '../../../../services/order.service';
import { NumberFormatPipe } from '../../../../pipes/number-format.pipe';
import { DateFormantPipe } from '../../../../pipes/date-formant.pipe';

@Component({
  selector: 'app-read',
  standalone: true,
  imports: [NumberFormatPipe, DateFormantPipe],
  templateUrl: './read.component.html',
  styleUrl: './read.component.scss',
})
export class ReadOrderComponent implements OnInit {
  orders!: Order[];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.orderService.findAll().subscribe({
      next: (response: Order[]) => {
        this.orders = response;
      },
      error: (err: any) => {
        throw err;
      },
    });
  }

  updateStatus(id: any, status: any): void {
    this.orderService.updateStatus(id, { status: status.value }).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.getOrders();
        }
      },
      error: (err: any) => {
        throw err;
      },
    });
  }
}
