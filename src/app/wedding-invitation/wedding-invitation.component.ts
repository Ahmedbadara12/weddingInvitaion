import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject, interval, Observable } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';

export interface TimeRemaining {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

@Component({
  selector: 'app-wedding-invitation',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './wedding-invitation.component.html',
  styleUrls: ['./wedding-invitation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeddingInvitationComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('introVideo', { static: false }) introVideo?: ElementRef<HTMLVideoElement>;
  @ViewChild('backgroundMusic', { static: false })
  backgroundMusic?: ElementRef<HTMLAudioElement>;

  isEnvelopeOpened = false;
  isVideoEnded = false;
  isMusicPlaying = false;
  audioError = '';

  countdown$!: Observable<TimeRemaining>;
  readonly flowerPetals = ['🌸', '🌺', '🌷', '🌹', '❀', '✿', '🌸', '🌺', '🌷', '🌹', '❀', '✿'];

  private destroy$ = new Subject<void>();

  private readonly targetDate = new Date(2026, 8, 3, 16, 30, 0).getTime();
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  ngAfterViewInit(): void {
    this.playIntroVideo();
    this.setupScrollReveal();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopMusic();
  }

  openEnvelope(): void {
    if (this.isEnvelopeOpened) return;

    this.isEnvelopeOpened = true;
    void this.startMusic();
  }

  onVideoEnded(): void {
    this.isVideoEnded = true;
  }

  private playIntroVideo(): void {
    const video = this.introVideo?.nativeElement;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.load();

    void video.play().catch(() => {
      this.isVideoEnded = true;
      this.cdr.markForCheck();
    });
  }

  private startCountdown(): void {
    this.countdown$ = interval(1000).pipe(
      startWith(0),
      map(() => this.calculateTimeRemaining()),
      takeUntil(this.destroy$),
    );
  }

  private calculateTimeRemaining(): TimeRemaining {
    const now = new Date().getTime();
    const difference = this.targetDate - now;

    if (difference <= 0) {
      return { days: '00', hours: '00', minutes: '00', seconds: '00' };
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days: String(d).padStart(2, '0'),
      hours: String(h).padStart(2, '0'),
      minutes: String(m).padStart(2, '0'),
      seconds: String(s).padStart(2, '0'),
    };
  }

  private setupScrollReveal(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      },
    );

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    const illustrationCard = document.getElementById('illustration-card');
    if (illustrationCard) {
      const cardObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            illustrationCard.classList.add('animate');
            cardObserver.unobserve(illustrationCard);
          }
        },
        { threshold: 0.2 },
      );
      cardObserver.observe(illustrationCard);
    }
  }

  toggleMusic(): void {
    if (this.isMusicPlaying) {
      this.stopMusic();
    } else {
      void this.startMusic();
    }
  }

  private async startMusic(): Promise<void> {
    if (this.isMusicPlaying) return;
    const audio = this.backgroundMusic?.nativeElement;

    if (!audio) {
      this.audioError = 'ملف الموسيقى غير جاهز بعد، اضغط مرة أخرى.';
      this.cdr.markForCheck();
      return;
    }

    audio.volume = 0.55;
    audio.loop = true;

    try {
      await audio.play();
    } catch {
      this.audioError = 'اضغط على زر الموسيقى مرة أخرى لتشغيل الصوت.';
      this.cdr.markForCheck();
      return;
    }

    this.audioError = '';
    this.isMusicPlaying = true;
    this.cdr.markForCheck();
  }

  private stopMusic(): void {
    this.isMusicPlaying = false;
    const audio = this.backgroundMusic?.nativeElement;

    if (audio) {
      audio.pause();
    }

    this.cdr.markForCheck();
  }
}
