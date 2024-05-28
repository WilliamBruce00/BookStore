import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { NumberFormatPipe } from '../../pipes/number-format.pipe';

@Component({
  selector: 'app-card-product',
  standalone: true,
  imports: [NumberFormatPipe],
  templateUrl: './card-product.component.html',
  styleUrl: './card-product.component.scss',
})
export class CardProductComponent implements OnInit {
  @Input() data!: Product;

  ngOnInit(): void {}
}
