import {
  booleanAttribute,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UploadService } from '../../../../services/upload.service';
import { concatMap } from 'rxjs';
import { CategoriesService } from '../../../../services/categories.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateCategoryComponent implements OnInit {
  @ViewChild('img') img!: ElementRef;

  constructor(
    private uploadService: UploadService,
    private categoryService: CategoriesService
  ) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm): void {
    Swal.fire({
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.uploadService
      .upload(this.img.nativeElement.files[0])
      .pipe(
        concatMap((uploadResponse: any) => {
          const data = {
            img: uploadResponse.img,
            name: form.value.name,
          };
          return this.categoryService.create(data);
        })
      )
      .subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            Swal.fire({
              title: 'Thành công',
              text: 'Thêm sản phẩm thành công',
              icon: 'success',
              allowOutsideClick: false,
            }).then(({ isConfirmed }) => {
              if (isConfirmed) location.href = 'admin/category';
            });
          }
        },
        error: (err: any) => {
          throw err;
        },
      });
  }
}
