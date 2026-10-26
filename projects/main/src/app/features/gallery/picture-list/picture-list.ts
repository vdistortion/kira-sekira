import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, inject } from '@angular/core';
import { PhotoGalleryModule } from '@twogate/ngx-photo-gallery';
import { PictureCard } from '../picture-card/picture-card';

@Component({
  selector: 'app-picture-list',
  imports: [PictureCard, PhotoGalleryModule],
  templateUrl: './picture-list.html',
  styleUrl: './picture-list.scss',
})
export class PictureList implements AfterViewInit, OnChanges, OnDestroy {
  private readonly changeDetector = inject(ChangeDetectorRef);
  @Input() public images: { url: string; width?: number; height?: number }[] = [];
  @Input() public altText = '';
  @ViewChild('gallery') private gallery?: ElementRef<HTMLElement>;
  public rows: { height: number; images: { url: string; width?: number; height?: number; displayWidth: number }[] }[] = [];
  private resizeObserver?: ResizeObserver;

  ngOnChanges(_changes: SimpleChanges): void {
    this.layout(1200);
  }

  ngAfterViewInit(): void {
    const element = this.gallery!.nativeElement;
    this.layout(element.clientWidth || 1200);
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(([entry]) => this.layout(entry.contentRect.width));
      this.resizeObserver.observe(element);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private layout(containerWidth: number): void {
    const gap = 16;
    const targetHeight = Math.min(260, Math.max(150, containerWidth * 0.22));
    const rows: typeof this.rows = [];
    let pending: typeof this.images = [];
    let ratioSum = 0;

    const commit = (height: number, justify: boolean) => {
      if (!pending.length) return;
      const available = containerWidth - gap * (pending.length - 1);
      const rowHeight = justify ? available / ratioSum : Math.min(targetHeight, available / ratioSum);
      rows.push({
        height: rowHeight,
        images: pending.map((image) => ({ ...image, displayWidth: rowHeight * ((image.width && image.height) ? image.width / image.height : 4 / 3) })),
      });
      pending = [];
      ratioSum = 0;
    };

    for (const image of this.images) {
      const ratio = image.width && image.height ? image.width / image.height : 4 / 3;
      const nextSum = ratioSum + ratio;
      const nextHeight = (containerWidth - gap * pending.length) / nextSum;
      if (pending.length && nextHeight < targetHeight * 0.82) commit(targetHeight, true);
      pending.push(image);
      ratioSum += ratio;
    }
    const lastRowFill = (targetHeight * ratioSum) / (containerWidth - gap * Math.max(0, pending.length - 1));
    commit(targetHeight, lastRowFill >= 0.82);
    this.rows = rows;
    this.changeDetector.markForCheck();
  }
}
