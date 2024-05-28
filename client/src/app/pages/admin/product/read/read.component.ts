import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../models/product.model';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { NumberFormatPipe } from '../../../../pipes/number-format.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-read',
  standalone: true,
  imports: [RouterLink, NumberFormatPipe, FormsModule],
  templateUrl: './read.component.html',
  styleUrl: './read.component.scss',
})
export class ReadProductComponent implements OnInit {
  products!: Product[];
  keyword: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProduts();
  }

  getProduts(): void {
    Swal.fire({
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.productService.findAll().subscribe({
      next: (response: Product[]) => {
        this.products = response.reverse();

        Swal.close();
      },
      error: (err: any) => {
        throw err;
      },
    });
  }

  deleteProduct(id: number) {
    Swal.fire({
      text: 'Bạn có chắc chắn muốn xóa không?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Hủy',
      allowOutsideClick: false,
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        this.productService.delete(id).subscribe({
          next: (response: any) => {
            if (response.code === 200) {
              Swal.fire({
                title: 'Thành công',
                text: 'Xóa sản phẩm thành công',
                icon: 'success',
                allowOutsideClick: false,
              }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                  this.getProduts();
                  Swal.close();
                }
              });
            }
          },
        });
      }
    });
  }
}
