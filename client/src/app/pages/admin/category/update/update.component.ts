import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService } from '../../../../services/categories.service';
import { Category } from '../../../../models/category.model';
import { FormsModule, NgForm } from '@angular/forms';
import { UploadService } from '../../../../services/upload.service';
import { concatMap, of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
})
export class UpdateCategoryComponent implements OnInit {
  @ViewChild('img') img!: ElementRef;

  category!: Category;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoriesService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.getCategory();
  }

  getCategory(): void {
    Swal.fire({
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const id = this.route.snapshot.params['id'];

    this.categoryService.findOne(id).subscribe({
      next: (response: Category) => {
        this.category = response;
        Swal.close();
      },
      error: (err: any) => {
        throw err;
      },
    });
  }

  onSubmit(form: NgForm): void {
    Swal.fire({
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const { name, imgold } = form.value;
    const id = this.route.snapshot.params['id'];

    if (this.img.nativeElement.files[0]) {
      this.uploadService
        .upload(this.img.nativeElement.files[0])
        .pipe(
          concatMap((uploadResponse: any) => {
            const data = {
              img: uploadResponse.img,
              name,
            };
            return this.categoryService.update(id, data);
          })
        )
        .subscribe({
          next: (response: any) => {
            if (response.status === 'success') {
              Swal.fire({
                title: 'Thành công',
                text: 'Cập nhật danh mục sản phẩm thành công',
                icon: 'success',
                allowOutsideClick: false,
              }).then(({ isConfirmed }) => isConfirmed && location.reload());
            } else {
              console.log(response);
            }
          },
          error: (err: any) => {
            throw err;
          },
        });
    } else {
      const data = {
        img: imgold,
        name,
      };

      this.categoryService.update(id, data).subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            Swal.fire({
              title: 'Thành công',
              text: 'Cập nhật danh mục sản phẩm thành công',
              icon: 'success',
              allowOutsideClick: false,
            }).then(({ isConfirmed }) => isConfirmed && location.reload());
          } else {
            console.log(response);
          }
        },
        error: (err: any) => {
          throw err;
        },
      });
    }
  }
}
